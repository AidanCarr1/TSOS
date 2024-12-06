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
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            // Set the taskbar clock to update every secon
            setInterval(Control.doClockTick, 1000);
        }
        //every tick, update clock
        static doClockTick() {
            var currentDate = new Date();
            //set date variables
            var dateString = currentDate.toDateString(); //correct date
            //var date = currentDate.getDay(); //this number is 1 behind
            //var month = currentDate.getMonth() + 1; //month is 0 based so 8 is actually "9"
            //var year = currentDate.getFullYear();
            //var dateString = "" + month + "/" + date + "/" + year; //date getDay is not doing what i want
            //set time variables
            var hours = (currentDate.getHours() + 11) % 12 + 1;
            var mins = currentDate.getMinutes();
            var secs = currentDate.getSeconds();
            var timeString = "" + hours;
            var sun = " PM";
            if (currentDate.getHours() < 12) {
                sun = " AM";
            }
            if (mins < 10) {
                timeString += ":0" + mins;
            }
            else {
                timeString += ":" + mins;
            }
            timeString += sun;
            document.getElementById("divTime").innerHTML = "<p>" + timeString + "<br>" + dateString + "</p>";
        }
        static hostLog(msg, source = "?") {
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }
        //
        // Host Events
        //
        static hostBtnStartOS_click(btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ... and single step button!
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            document.getElementById("btnSingleStep").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // an initialize the memory
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        }
        static hostBtnHaltOS_click(btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }
        static hostBtnReset_click(btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload();
        }
        static hostBtnSingleStepToggle_click(btn) {
            //turn single step on
            if (_CPU.isSingleStepping == false) {
                _CPU.isSingleStepping = true;
                _Kernel.krnTrace("Single Step ON");
                document.getElementById("btnTakeStep").disabled = false;
            }
            //turn single step off
            else {
                _CPU.isSingleStepping = false;
                _Kernel.krnTrace("Single Step OFF");
                document.getElementById("btnTakeStep").disabled = true;
            }
        }
        static hostBtnTakeStep_click(btn) {
            if (_CPU.isExecuting) {
                //_Kernel.krnTrace("Step");
                _CPU.takeStep = true;
                //after each cycle, update displays
                Control.updateCPUDisplay();
                Control.updateMemoryDisplay();
            }
        }
        static createMemoryDisplay() {
            //start table
            var tableHTML = "";
            var memoryCount = 0; //for id purposes - so we know which location we're at
            for (var row = 0; row < MEMORY_SIZE / MEMORY_COLUMNS; row++) {
                //row label
                tableHTML += "<tr><td class='memoryRowLabel'> 0x" + TSOS.Utils.toHex(memoryCount, HEX_WORD_SIZE) + "</td>";
                for (var col = 1; col <= MEMORY_COLUMNS; col++) {
                    tableHTML += "<td class='memoryBox' id='mem" + memoryCount + "'> 00 </td>";
                    memoryCount++;
                }
                //end row
                tableHTML += "</tr>";
            }
            document.getElementById("memoryTable").innerHTML = tableHTML;
        }
        static updateMemoryDisplay() {
            for (var i = 0; i < MEMORY_SIZE; i++) {
                var memoryId = "mem" + i;
                var memoryBox = document.getElementById(memoryId);
                memoryBox.innerHTML = "" + TSOS.Utils.toHex(_Memory.mainMemory[i], HEX_WORD_SIZE); //with padding
                if (i == (_CPU.currentBase + _CPU.PC)) {
                    memoryBox.className = "memoryBox highlightPC";
                }
                else {
                    memoryBox.className = "memoryBox";
                }
            }
        }
        static updateCPUDisplay() {
            document.getElementById("PID").innerText = "" + _CPU.currentPCB.pid; //PIDs are in base 10
            document.getElementById("PC").innerText = TSOS.Utils.toHex(_CPU.PC, HEX_WORD_SIZE);
            document.getElementById("IR").innerText = TSOS.Utils.toHex(_CPU.instructionRegister, HEX_WORD_SIZE);
            document.getElementById("Acc").innerText = TSOS.Utils.toHex(_CPU.Acc, HEX_WORD_SIZE);
            document.getElementById("X").innerText = TSOS.Utils.toHex(_CPU.Xreg);
            document.getElementById("Y").innerText = TSOS.Utils.toHex(_CPU.Yreg);
            document.getElementById("Z").innerText = TSOS.Utils.toHex(_CPU.Zflag);
            document.getElementById("Quantum").innerText = TSOS.Utils.toHex(_Scheduler.quantumCounter) + "/" + TSOS.Utils.toHex(_Scheduler.quantum);
        }
        static addPCBDisplay(pcb) {
            var table = document.getElementById("pcbTable"); //Via Google AI
            var row = table.insertRow();
            var rowHTML = "<tr id='pcb" + pcb.pid + "'>";
            rowHTML += "<td id='pid" + pcb.pid + "'      class='pidBox' >" + pcb.pid + "</td>";
            rowHTML += "<td id='state" + pcb.pid + "'    class='pcbBoxS'>" + pcb.getState() + "</td>";
            rowHTML += "<td id='location" + pcb.pid + "' class='pcbBox' >" + pcb.location + "</td>";
            rowHTML += "<td id='base" + pcb.pid + "'     class='pcbBox' >" + TSOS.Utils.toHex(pcb.getBase(), BASE_LIMIT_WORD_SIZE) + "</td>";
            rowHTML += "<td id='limit" + pcb.pid + "'    class='pcbBox' >" + TSOS.Utils.toHex(pcb.getLimit(), BASE_LIMIT_WORD_SIZE) + "</td>";
            rowHTML += "<td id='segment" + pcb.pid + "'  class='pcbBox' >" + TSOS.Utils.toHex(pcb.segment) + "</td>";
            rowHTML += "<td id='priority" + pcb.pid + "' class='pcbBox' >" + TSOS.Utils.toHex(pcb.priority) + "</td>";
            //rowHTML +=    "<td id='quantum"+pcb.pid+"'  class='pcbBox'>"+ Utils.toHex(pcb.quantum)   +"</td>";
            rowHTML += "</tr>";
            row.innerHTML = rowHTML;
            pcb.isInHTML = true;
        }
        static updatePCBDisplay(pcb) {
            var pid = pcb.pid;
            //if it doesnt exist in HTML, dont update the table
            if (!pcb.isInHTML) {
                return;
            }
            // change the PCB dispaly based on a new, current state           
            document.getElementById("state" + pid).innerText = pcb.getState();
            document.getElementById("location" + pid).innerText = pcb.location;
            document.getElementById("base" + pid).innerText = TSOS.Utils.toHex(pcb.getBase(), BASE_LIMIT_WORD_SIZE);
            document.getElementById("limit" + pid).innerText = TSOS.Utils.toHex(pcb.getLimit(), BASE_LIMIT_WORD_SIZE);
            document.getElementById("segment" + pid).innerText = TSOS.Utils.toHex(pcb.segment);
            document.getElementById("priority" + pid).innerText = TSOS.Utils.toHex(pcb.priority);
            //if terminated, set pcb elements to the "not in use" color
            if (pcb.getState() === "TERMINATED") {
                document.getElementById("state" + pid).classList.add("notInuse");
                document.getElementById("location" + pid).classList.add("notInuse");
                document.getElementById("base" + pid).classList.add("notInuse");
                document.getElementById("limit" + pid).classList.add("notInuse");
                document.getElementById("segment" + pid).classList.add("notInuse");
                document.getElementById("priority" + pid).classList.add("notInuse");
            }
        }
        static createDiskDisplay() {
            var table = document.getElementById("diskTable");
            for (var i = 0; i < DISK_SIZE; i++) {
                var row = table.insertRow();
                var numKey = i;
                var octKey = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
                var rowHTML = `<tr id="Block${octKey}">
                    <td id="Key${octKey}"   class="diskKey"           > ${octKey}</td> 
                    <td id="InUse${octKey}" class="diskInUse notInuse"> 00</td>
                    <td id="TSB${octKey}"   class="diskTSB   notInuse"> ${_krnDiskDriver.getTSBString(numKey)}</td>
                    <td id="Data${octKey}"  class="diskData  notInuse"> <strong>${_krnDiskDriver.getData(numKey)}</strong></td>
                    </tr>`;
                row.innerHTML = rowHTML;
            }
        }
        static updateDiskDisplay(numKey) {
            // key in oct string
            var octKey = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            if (_krnDiskDriver.isFormatted) {
                if (_krnDiskDriver.isInuse(numKey)) {
                    document.getElementById("InUse" + octKey).innerText = "01";
                    //color the row based on inuse
                    //remove the "not in use" color
                    document.getElementById("InUse" + octKey).classList.remove("notInuse");
                    //document.getElementById("InUse"+octKey).classList.add("inuse");
                    document.getElementById("TSB" + octKey).classList.remove("notInuse");
                    //document.getElementById("TSB"+octKey).classList.add("inuse");
                    document.getElementById("Data" + octKey).classList.remove("notInuse");
                    //document.getElementById("Data"+octKey).classList.add("inuse");
                }
                else {
                    document.getElementById("InUse" + octKey).innerText = "00";
                    //set to the "not in use" color
                    //document.getElementById("InUse"+octKey).classList.remove("inuse");
                    document.getElementById("InUse" + octKey).classList.add("notInuse");
                    //document.getElementById("TSB"+octKey).classList.remove("inuse");
                    document.getElementById("TSB" + octKey).classList.add("notInuse");
                    //document.getElementById("Data"+octKey).classList.remove("inuse");
                    document.getElementById("Data" + octKey).classList.add("notInuse");
                }
                document.getElementById("TSB" + octKey).innerText = _krnDiskDriver.getTSBString(numKey);
                document.getElementById("Data" + octKey).innerHTML = "<strong>" + _krnDiskDriver.getData(numKey) + "</strong>";
            }
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map