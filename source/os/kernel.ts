/* ------------
     Kernel.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.

            // Initialize the console.
            _Console = new Console();             // The command line interface / console I/O device.
            _Console.init();

            // Initialize memory manager
            _MemoryManager = new MemoryManager();
            _MemoryManager.init();

            // Initialize scheduler
            _Scheduler = new Scheduler();
            _Scheduler.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
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


        public krnOnCPUClockPulse() {
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

            else {

                //SCHEDULER 
                var whatToDo = _Scheduler.askScheduler();
                //DISPATCHER
                switch (whatToDo) {

                    //context switch
                    case "CS": {
                        this.krnTrace("CS");
                        //context switch to the next process in ready Q
                        var systemCall = new Interrupt(CONTEXT_SWITCH_IRQ, []);
                        _KernelInterruptQueue.enqueue(systemCall);
                        _Scheduler.resetCounter();
                        break;
                    }

                    //do yet another cycle
                    case "CYCLE": {
                        _CPU.cycle();
                        _Scheduler.count();
                        break;
                    }

                    //turn off cpu
                    case "OFF": {
                        _Scheduler.resetCounter();
                        _CPU.isExecuting = false;
                        break;
                    }

                    //do nothing
                    case "IDLE": {
                        this.krnTrace("Idle");
                        break;
                    }
                }

                //after each cycle, update displays
                Control.updateCPUDisplay();
                Control.updateMemoryDisplay();
            }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();             // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case OUTPUT_CPU_IRQ:
                    this.outputCPU();               // System call from CPU (output int or string)    
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

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
            // Or do it elsewhere in the Kernel. We don't really need this.
        }

        public outputCPU() {
            //print integer in Yreg
            if (_CPU.Xreg == 0x01) {
                _StdOut.putText(Utils.toHex(_CPU.Yreg));
            }

            //print 00terminated string in Yreg
            else if (_CPU.Xreg == 0x02) { //magic number?
                var currentPosition = _CPU.Yreg;
                var currentIntValue = _MemoryAccessor.read(currentPosition, _CPU.currentBase); //new line

                while (currentIntValue != 0x00) {
                    var currentStrValue = Utils.sysCallString(currentIntValue)
                    _StdOut.putText(currentStrValue); //print char

                    //next character
                    currentPosition ++;
                    currentIntValue = _MemoryAccessor.read(currentPosition, _CPU.currentBase); //new line
                }
            }
        }

        public killProcess(params) {
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

        public outOfBounds(params) {
            //get params
            var pcb = params[0];
            var address = params[1];

            //tell the shell
            _StdOut.advanceLine();
            _StdOut.putText("Out of bounds error. ");
            _StdOut.putText("Cannot access memory " + Utils.toHex(address));
            _StdOut.advanceLine();
            _StdOut.putText(_OsShell.promptStr);

            //kill it
            this.killProcess(pcb);
        }

        public contextSwitch(args) {
            
            //if CPU is a virgin, no need to save current pcb state
            if (_CPU.isVirgin) {
            }

            //save the state
            else {
                //save registers from CPU->PCB
                _CPU.currentPCB.processPC = _CPU.PC;
                _CPU.currentPCB.processAcc = _CPU.Acc;
                _CPU.currentPCB.processXreg = _CPU.Xreg;
                _CPU.currentPCB.processYreg = _CPU.Yreg;
                _CPU.currentPCB.processZflag = _CPU.Zflag;
                _CPU.currentPCB.processIR =  _CPU.instructionRegister;

                //requeue program if its alive it
                if (_CPU.currentPCB.getState() === "RUNNING") { //this prevents queuing terminated programs
                    _CPU.currentPCB.setState("READY");
                    _MemoryManager.readyQueue.enqueue(_CPU.currentPCB);
                }    
            }

            if (_MemoryManager.readyQueue.isEmpty()) {
                _CPU.isExecuting = false;
                //the end!
            }
            //pid from ready queue
            else {
                var nextPCB:ProcessControlBlock = _MemoryManager.readyQueue.dequeue();
            }

            //next pcb: set all CPU's registers to next PCB's registers
            _CPU.PC = nextPCB.processPC;
            _CPU.Acc = nextPCB.processAcc;
            _CPU.Xreg = nextPCB.processXreg;
            _CPU.Yreg = nextPCB.processYreg;
            _CPU.Zflag = nextPCB.processZflag;
            _CPU.instructionRegister = nextPCB.processIR; 

            //set new current PCB and run it
            _CPU.currentPCB = nextPCB;
            if (_CPU.currentPCB.getState() !== "TERMINATED") { //prevents zombies
                _CPU.currentPCB.setState("RUNNING");
            }
            _CPU.isExecuting = true;
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
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would quickly lag the browser quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            // Display BSOD error
            _OsShell.shellBsod();
            //this.krnShutdown(); //may be a redundant shutdown
        }
    }
}
