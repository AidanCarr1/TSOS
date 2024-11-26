/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }

            // Set the taskbar clock to update every secon
            setInterval(Control.doClockTick,1000);
        }

        //every tick, update clock
        public static doClockTick(){
            var currentDate = new Date();
            
            //set date variables
            var dateString = currentDate.toDateString(); //correct date
            //var date = currentDate.getDay(); //this number is 1 behind
            //var month = currentDate.getMonth() + 1; //month is 0 based so 8 is actually "9"
            //var year = currentDate.getFullYear();
            //var dateString = "" + month + "/" + date + "/" + year; //date getDay is not doing what i want


            //set time variables
            var hours = (currentDate.getHours() +11) % 12 + 1;
            var mins = currentDate.getMinutes();
            var secs = currentDate.getSeconds();
            var timeString = "" + hours;
            var sun = " PM";

            if(currentDate.getHours()<12){
                sun = " AM";
            }
            if(mins < 10){
                timeString += ":0" + mins;
            } else {
                timeString += ":" + mins;
            }
            timeString += sun;
            
            (<HTMLInputElement> document.getElementById("divTime")).innerHTML = "<p>" + timeString + "<br>" + dateString + "</p>";
            
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ... and single step button!
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.

            // an initialize the memory
            _Memory = new Memory();
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
        }

        public static hostBtnSingleStepToggle_click(btn): void {

            //turn single step on
            if (_CPU.isSingleStepping == false){
                _CPU.isSingleStepping = true;
                _Kernel.krnTrace("Single Step ON");
                (<HTMLButtonElement>document.getElementById("btnTakeStep")).disabled = false;
            }

            //turn single step off
            else {
                _CPU.isSingleStepping = false;
                _Kernel.krnTrace("Single Step OFF");
                (<HTMLButtonElement>document.getElementById("btnTakeStep")).disabled = true;
            }
        }

        public static hostBtnTakeStep_click(btn): void {
            if (_CPU.isExecuting) {
                //_Kernel.krnTrace("Step");
                _CPU.takeStep = true;
                //after each cycle, update displays
                Control.updateCPUDisplay();
                Control.updateMemoryDisplay();
            }
        }

        public static createMemoryDisplay(): void {
            //start table
            var tableHTML = "";
            var memoryCount = 0; //for id purposes - so we know which location we're at

            for (var row = 0; row < MEMORY_SIZE / MEMORY_COLUMNS; row ++) {

                //row label
                tableHTML += "<tr><td class='memoryRowLabel'> 0x" + Utils.toHex(memoryCount, HEX_WORD_SIZE) + "</td>";

                for (var col = 1; col <= MEMORY_COLUMNS; col ++) {
                    tableHTML += "<td class='memoryBox' id='mem" + memoryCount + "'> 0 </td>";
                    memoryCount ++;
                }

                //end row
                tableHTML += "</tr>";
            }
            (<HTMLInputElement> document.getElementById("memoryTable")).innerHTML = tableHTML;
        }

        public static updateMemoryDisplay(): void {

            for (var i = 0; i < MEMORY_SIZE; i ++) {
                var memoryId = "mem" + i;
                var memoryBox = <HTMLInputElement> document.getElementById(memoryId);

                memoryBox.innerHTML = "" + Utils.toHex(_Memory.mainMemory[i], HEX_WORD_SIZE); //with padding
                if (i == (_CPU.currentBase + _CPU.PC)) {
                    memoryBox.className = "memoryBox highlightPC";
                }
                else {
                    memoryBox.className = "memoryBox";
                }
            }
        }

        public static updateCPUDisplay(): void {
            (<HTMLInputElement> document.getElementById("PID")).innerText = "" + _CPU.currentPCB.pid; //PIDs are in base 10
            (<HTMLInputElement> document.getElementById("PC")).innerText = Utils.toHex(_CPU.PC, HEX_WORD_SIZE);
            (<HTMLInputElement> document.getElementById("IR")).innerText = Utils.toHex(_CPU.instructionRegister, HEX_WORD_SIZE);

            (<HTMLInputElement> document.getElementById("Acc")).innerText = Utils.toHex(_CPU.Acc);
            (<HTMLInputElement> document.getElementById("X")).innerText = Utils.toHex(_CPU.Xreg);
            (<HTMLInputElement> document.getElementById("Y")).innerText = Utils.toHex(_CPU.Yreg);
            (<HTMLInputElement> document.getElementById("Z")).innerText = Utils.toHex(_CPU.Zflag);
            (<HTMLInputElement> document.getElementById("Quantum")).innerText = Utils.toHex(_Scheduler.quantumCounter)+"/"+Utils.toHex(_Scheduler.quantum);
        }

        public static addPCBDisplay(pcb: ProcessControlBlock): void {
            
            var table: HTMLTableElement = <HTMLTableElement> document.getElementById("pcbTable"); //Via Google AI
            var row = table.insertRow();

            var rowHTML = "<tr id='pcb"+pcb.pid+"'>";
            rowHTML +=    "<td id='pid"+pcb.pid+"'      class='pcbBox' >"+ pcb.pid                    +"</td>";
            rowHTML +=    "<td id='state"+pcb.pid+"'    class='pcbBoxS'>"+ pcb.getState()             +"</td>";
            rowHTML +=    "<td id='location"+pcb.pid+"' class='pcbBox' >"+ pcb.location               +"</td>";
            rowHTML +=    "<td id='base"+pcb.pid+"'     class='pcbBox' >"+ Utils.toHex(pcb.getBase()) +"</td>";
            rowHTML +=    "<td id='limit"+pcb.pid+"'    class='pcbBox' >"+ Utils.toHex(pcb.getLimit())+"</td>";
            rowHTML +=    "<td id='segment"+pcb.pid+"'  class='pcbBox' >"+ Utils.toHex(pcb.segment)   +"</td>";
            rowHTML +=    "<td id='priority"+pcb.pid+"' class='pcbBox' >"+ Utils.toHex(pcb.priority)  +"</td>";
            //rowHTML +=    "<td id='quantum"+pcb.pid+"'  class='pcbBox'>"+ Utils.toHex(pcb.quantum)   +"</td>";
            rowHTML +=    "</tr>";
            row.innerHTML = rowHTML; 
            
            pcb.isInHTML = true;
        }

        public static updatePCBDisplay(pcb: ProcessControlBlock): void {
            var pid = pcb.pid;

            //if it doesnt exist in HTML, dont update the table
            if (!pcb.isInHTML) {
                return;
            }

            // change the PCB dispaly based on a new, current state           
            document.getElementById("state"+pid).innerText    = pcb.getState();
            document.getElementById("location"+pid).innerText = pcb.location;

            //if segment no longer exists, show nothing
            if (pcb.getSegment() == ERROR_CODE){
                document.getElementById("base"+pid).innerText     = "--";
                document.getElementById("limit"+pid).innerText    = "--";
                document.getElementById("segment"+pid).innerText  = "--";
            }
            //if it exists show normal data
            else {
                document.getElementById("base"+pid).innerText     = Utils.toHex(pcb.getBase());
                document.getElementById("limit"+pid).innerText    = Utils.toHex(pcb.getLimit());
                document.getElementById("segment"+pid).innerText  = Utils.toHex(pcb.segment);
            }
            document.getElementById("priority"+pid).innerText = Utils.toHex(pcb.priority);
        }

        
        public static createDiskDisplay(): void {
            
            var table: HTMLTableElement = <HTMLTableElement> document.getElementById("diskTable");

            for (var i = 0; i < DISK_SIZE; i++) {
                var row = table.insertRow();
                var key = Utils.toOct(i, OCT_WORD_SIZE);

                var rowHTML = 
                   `<tr id="Block${key}">
                    <td id="Key${key}"     class="diskKey">${key}</td> 
                    <td id="InUse${key}"   class="diskInUse">${_krnDiskDriver.getInuse(key)}</td>
                    <td id="TSB${key}"     class="diskTSB">${Utils.keyToHex(_krnDiskDriver.getTSB(key))}</td>
                    <td id="Data${key}"    class="diskData">${_krnDiskDriver.getData(key)}</td>
                    </tr>`;

                row.innerHTML = rowHTML;
            }
        }
        


        public static updateDiskDisplay(key: string): void {
            
            if (_krnDiskDriver.isFormatted) {
                document.getElementById("InUse"+key).innerText    = _krnDiskDriver.getInuse(key);
                document.getElementById("TSB"+key).innerText      = Utils.keyToHex(_krnDiskDriver.getTSB(key));
                document.getElementById("Data"+key).innerText     = _krnDiskDriver.getData(key);
            }
        }
    }
}
