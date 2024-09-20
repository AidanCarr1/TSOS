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
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
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
        static createMemoryDisplay() {
            //var memDisplay = <HTMLInputElement> document.getElementById("memoryTable");
            //start table
            var tableHTML = "";
            var memoryCount = 0; //for id purposes - so we know which location we're at
            for (var row = 0; row < MEMORY_SIZE / MEMORY_COLUMNS; row++) {
                //row label
                tableHTML += "<tr><td> 0x" + TSOS.Utils.toHex(memoryCount) + "</td>";
                for (var col = 1; col <= MEMORY_COLUMNS; col++) {
                    tableHTML += "<td id='mem" + memoryCount + "'> 0 </td>";
                    memoryCount++;
                }
                //end row
                tableHTML += "</tr>";
            }
            document.getElementById("memoryTable").innerHTML = tableHTML;
        }
        static updateMemoryDisplay() {
        }
        static updateCPUDisplay() {
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map