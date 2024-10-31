/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    class Cpu {
        PC;
        Acc;
        Xreg;
        Yreg;
        Zflag;
        instructionRegister;
        isExecuting;
        currentPCB;
        currentBase;
        isSingleStepping;
        constructor(PC, Acc, Xreg, Yreg, Zflag, instructionRegister, isExecuting, currentPCB, currentBase, //new line
        isSingleStepping) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.instructionRegister = instructionRegister;
            this.isExecuting = isExecuting;
            this.currentPCB = currentPCB;
            this.currentBase = currentBase;
            this.isSingleStepping = isSingleStepping;
        }
        // ON YOUR MARKS...
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.instructionRegister = 0x00;
            this.isExecuting = false;
            this.currentPCB = null;
            this.currentBase = 0x00; //new line
            this.isSingleStepping = false;
        }
        // GET SET...
        prepare(pid) {
            //find PCB from mem manager
            if (pid >= 0 && pid < _MemoryManager.pidCounter) {
                var pcb = _MemoryManager.getProcessByPID(pid);
            }
            //if not found return error (this should not occur)
            else {
                _StdOut.putText("Unknown pid");
                return;
            }
            //set all CPU registers to PCB's registers
            this.PC = pcb.processPC;
            this.Acc = pcb.processAcc;
            this.Xreg = pcb.processXreg;
            this.Yreg = pcb.processYreg;
            this.Zflag = pcb.processZflag;
            this.instructionRegister = 0x00;
            //new current pid
            this.currentPCB = pcb;
            pcb.setState("READY");
        }
        // GO!
        run() {
            //for proj3 - run should actually just put the PCB on the ready queue
            //also set the state to running
            //maybe add a check in the cycle for the ready queue, if found, context switch and set is executing true
            //if nothing inside, set to false
            //test case thought! make sure to check that the PCB in this queue is not terminated. if it is throw it out
            //in the future: change all the "set isExecuting to false" to "kill the process"
            this.isExecuting = true;
            this.currentPCB.setState("RUNNING");
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //get the base based on the PCB
            this.currentBase = _CPU.currentPCB.getBase(); //new line
            //fetch
            this.instructionRegister = _MemoryAccessor.read(this.PC, this.currentBase); //new line
            //decode and execute 
            switch (this.instructionRegister) {
                // A9 LDA: Load the accumulator with constant
                case 0xA9: {
                    this.PC++;
                    this.Acc = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    break;
                }
                // AD LDA: Load the accumulator from memory
                case 0xAD: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //update accumulator (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _MemoryAccessor.read(memoryLocation, this.currentBase); //new line
                    break;
                }
                // 8D STA: Store the accumulator in memory
                case 0x8D: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //stor acc in memory location (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    _MemoryAccessor.write(memoryLocation, this.Acc, this.currentBase); //new line
                    break;
                }
                //6D ADC:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                case 0x6D: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //add
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = (this.Acc + _MemoryAccessor.read(memoryLocation, this.currentBase)) % SEGMENT_SIZE; //new line
                    break;
                }
                //A2 LDX: Load X register with a constant
                case 0xA2: {
                    this.PC++;
                    this.Xreg = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    break;
                }
                //AE LDX: Load X register from memory
                case 0xAE: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //update XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Xreg = _MemoryAccessor.read(memoryLocation, this.currentBase); //new line
                    break;
                }
                //A0 LDY: Load Y register with a constant
                case 0xA0: {
                    this.PC++;
                    this.Yreg = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    break;
                }
                //AC LDY: Load Y register from memory
                case 0xAC: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //update YReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Yreg = _MemoryAccessor.read(memoryLocation, this.currentBase); //new line
                    break;
                }
                //EA NOP: No operation
                case 0xEA: {
                    this.PC++;
                    break;
                }
                //00 BRK: end of program
                case 0x00: {
                    //this should be a function call (but it doesnt have to be, so im keeping it here)
                    _StdOut.advanceLine();
                    _StdOut.putText(_OsShell.promptStr);
                    this.isExecuting = false;
                    this.currentPCB.setState("TERMINATED");
                    break;
                }
                //EC CPX: Compare byte in memory to XReg, set ZFlag if equal
                case 0xEC: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //compare memory to XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    if (this.Xreg == _MemoryAccessor.read(memoryLocation, this.currentBase)) { //new line
                        this.Zflag = 0x1;
                    }
                    else {
                        this.Zflag = 0x0;
                    }
                    break;
                }
                //D0 BNE: Branch n bytes if Zflag = 0
                case 0xD0: {
                    this.PC++; //read branch
                    //branch
                    if (this.Zflag == 0x0) {
                        var branchBytes = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                        this.PC += branchBytes; // branch operand amount
                        //remove overflow
                        this.PC = this.PC % SEGMENT_SIZE + 1; // add with carry
                    }
                    //skip branch
                    else {
                        this.PC++; //next step
                    }
                    break;
                }
                //EE INC: Increment the value of a byte
                case 0xEE: {
                    this.PC++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++;
                    var highOrderByte = _MemoryAccessor.read(this.PC, this.currentBase); //new line
                    this.PC++; //next step
                    //put byte in acc, increment, return byte to memory 
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _MemoryAccessor.read(memoryLocation, this.currentBase); //new line
                    this.Acc++; // inc
                    this.Acc = this.Acc % SEGMENT_SIZE; //add with carry
                    //_StdOut.putText("~acc="+this.Acc+"~"); //test line
                    _MemoryAccessor.write(memoryLocation, this.Acc, this.currentBase); //new line
                    break;
                }
                //FF SYS: System call
                case 0xFF: {
                    this.PC++; //next step
                    //create an interupt and enqueue it
                    var systemCall = new TSOS.Interrupt(OUTPUT_CPU_IRQ, []);
                    _KernelInterruptQueue.enqueue(systemCall);
                    break;
                }
                //Unknown instruction. kill and tell the user
                //can make this a system call
                default: {
                    this.isExecuting = false;
                    _StdOut.putText("Unknown instruction: " + TSOS.Utils.toHex(this.instructionRegister));
                    //create an interupt and enqueue it
                    var systemCall = new TSOS.Interrupt(KILL_PROCESS_IRQ, [this.currentPCB]);
                    _KernelInterruptQueue.enqueue(systemCall);
                    //_StdOut.advanceLine();
                    //_StdOut.putText(_OsShell.promptStr);
                    break;
                }
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map