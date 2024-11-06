/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        krnBootstrap() {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize memory manager
            _MemoryManager = new TSOS.MemoryManager();
            _MemoryManager.init();
            // Initialize scheduler
            _Scheduler = new TSOS.Scheduler();
            _Scheduler.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }
        krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }
        krnOnCPUClockPulse() {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.
            */
            // Check for an interrupt, if there are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO (maybe): Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            var whatToDo = _Scheduler.askScheduler();
            //DISPATCHER
            switch (whatToDo) {
                //do nothing
                case "IDLE": {
                    break;
                }
                //context switch
                case "CS": {
                    break;
                }
                //do yet another cycle
                case "CYCLE": {
                    break;
                }
                //current program is terminated, context switch
                case "DQ,CS": {
                    break;
                }
                //turn off cpu
                case "OFF": {
                    break;
                }
            }
            /*
            //cpu wasnt running, and now theres a program in the ready queue
            else if (!_CPU.isExecuting && !_MemoryManager.readyQueue.isEmpty()) {
                var nextPCB = _MemoryManager.readyQueue.dequeue();
                var nextPID = nextPCB.pid;
                _StdOut.putText("~"+nextPID+"~");

                var systemCall = new Interrupt(CONTEXT_SWITCH_IRQ, [nextPID]);
                _KernelInterruptQueue.enqueue(systemCall);
                _CPU.isExecuting = true;
            }
                */
            //check if running is terminated?
            //context switch!
            //BOOKMARK
            /*
            else if (_Scheduler.quantumCounter >= _Scheduler.quantum) {
                //reset the count
                _Scheduler.resetCounter();
                //context switch for our PID, enqueue it
                //TO DO:
                //lets fix context switching to read the ready queue!, no more parameters
                var systemCall = new Interrupt(CONTEXT_SWITCH_IRQ, [numPID]);
                _KernelInterruptQueue.enqueue(systemCall);

            }
            */
            //next cycle!
            if (_CPU.isExecuting && _CPU.isSingleStepping == false) { // If there are no interrupts then run one CPU cycle if there is anything being processed.
                _CPU.cycle();
                _Scheduler.count();
                //after each cycle, update displays
                TSOS.Control.updateCPUDisplay();
                TSOS.Control.updateMemoryDisplay();
            }
            //cpu was running, and now theres nothing left to run
            else if (_CPU.isExecuting && _MemoryManager.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
            }
            // If there are no interrupts and there is nothing being executed then just be idle.
            else {
                this.krnTrace("Idle");
            }
        }
        //
        // Interrupt Handling
        //
        krnEnableInterrupts() {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }
        krnDisableInterrupts() {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }
        krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case OUTPUT_CPU_IRQ:
                    this.outputCPU(); // System call from CPU (output int or string)    
                    break;
                case KILL_PROCESS_IRQ:
                    this.killProcess(params);
                    break;
                case OUT_OF_BOUNDS_IRQ:
                    this.outOfBounds(params);
                    break;
                case CONTEXT_SWITCH_IRQ:
                    this.contextSwitch(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }
        outputCPU() {
            //print integer in Yreg
            if (_CPU.Xreg == 0x01) {
                _StdOut.putText(TSOS.Utils.toHex(_CPU.Yreg));
            }
            //print 00terminated string in Yreg
            else if (_CPU.Xreg == 0x02) { //magic number?
                var currentPosition = _CPU.Yreg;
                var currentIntValue = _MemoryAccessor.read(currentPosition, _CPU.currentBase); //new line
                while (currentIntValue != 0x00) {
                    var currentStrValue = TSOS.Utils.sysCallString(currentIntValue);
                    _StdOut.putText(currentStrValue); //print char
                    //next character
                    currentPosition++;
                    currentIntValue = _MemoryAccessor.read(currentPosition, _CPU.currentBase); //new line
                }
            }
        }
        killProcess(params) {
            //get params
            var pcb = params[0];
            //proj 3: should killing one process stop the whole CPU?
            _CPU.isExecuting = false;
            //terminate and get rid of it in the segment view
            pcb.setState("TERMINATED");
            _MemoryManager.segmentList[pcb.getSegment()] = undefined;
            pcb.segment = ERROR_CODE;
            //tell the shell
            _StdOut.advanceLine();
            _StdOut.putText("Process " + pcb.pid + " terminated. ");
            _StdOut.advanceLine();
            _StdOut.putText(_OsShell.promptStr);
        }
        outOfBounds(params) {
            //get params
            var pcb = params[0];
            var address = params[1];
            //tell the shell
            _StdOut.advanceLine();
            _StdOut.putText("Out of bounds error. ");
            _StdOut.putText("Cannot access memory " + TSOS.Utils.toHex(address));
            _StdOut.advanceLine();
            _StdOut.putText(_OsShell.promptStr);
            //kill it
            this.killProcess(pcb);
        }
        contextSwitch(args) {
            if (_CPU.isVirgin) {
                //if CPU is a virgin, no need to save current pcb state
            }
            //save the state
            else {
                //save registers from CPU->PCB
                _CPU.currentPCB.processPC = _CPU.PC;
                _CPU.currentPCB.processAcc = _CPU.Acc;
                _CPU.currentPCB.processXreg = _CPU.Xreg;
                _CPU.currentPCB.processYreg = _CPU.Yreg;
                _CPU.currentPCB.processZflag = _CPU.Zflag;
                _CPU.currentPCB.processIR = _CPU.instructionRegister;
                //requeue it
                if (_CPU.currentPCB.getState() === "RUNNING") { //this prevents creating zombies
                    _CPU.currentPCB.setState("READY");
                    _MemoryManager.readyQueue.enqueue(_CPU.currentPCB);
                }
            }
            //pid is given
            /*
            if(args.length > 0) {
                var nextPID = args[0];
                var nextPCB = _MemoryManager.getProcessByPID(nextPID);
            }
                */
            //NEW LINE
            if (_MemoryManager.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                //the end!
            }
            //pid from ready queue
            else {
                var nextPCB = _MemoryManager.readyQueue.dequeue();
                var nextPID = nextPCB.pid;
            }
            //BOOKMARK, check if its in the right order
            //next pcb: set all CPU's registers to next PCB's registers
            _CPU.PC = nextPCB.processPC;
            _CPU.Acc = nextPCB.processAcc;
            _CPU.Xreg = nextPCB.processXreg;
            _CPU.Yreg = nextPCB.processYreg;
            _CPU.Zflag = nextPCB.processZflag;
            _CPU.instructionRegister = nextPCB.processIR;
            //set new current PCB and run it
            _CPU.currentPCB = nextPCB;
            _CPU.currentPCB.setState("RUNNING");
            //_MemoryManager.readyQueue.enqueue(nextPCB);
            _CPU.isExecuting = true;
            //do something with the queues?? 
            //maybe we check the queue to figure out what is nextPID
            //(in the beginning)
        }
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        krnTrace(msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        }
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // Display BSOD error
            _OsShell.shellBsod();
            //this.krnShutdown(); //may be a redundant shutdown
        }
    }
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=kernel.js.map