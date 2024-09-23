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
        constructor(PC = 0, Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, instructionRegister = 0x00, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.instructionRegister = instructionRegister;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.instructionRegister = 0x00;
        }
        run(pid) {
            //set starting location
            this.PC = _MemoryManager.getStartingMemory(pid);
            //TODO: add case where pid is not found
            //go
            this.isExecuting = true;
        }
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //fetch
            this.instructionRegister = _Memory.mainMemory[this.PC];
            //decode and execute
            switch (this.instructionRegister) {
                // A9 LDA: Load the accumulator with constant
                case 0xA9: {
                    this.PC++;
                    this.Acc = _Memory.mainMemory[this.PC]; //every time you see this line, it should probably be memory accessor function. 
                    //BOOKMARK
                    this.PC++; //next step
                    break;
                }
                // AD LDA: Load the accumulator from memory
                case 0xAD: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //update accumulator (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _Memory.mainMemory[memoryLocation];
                    break;
                }
                // 8D STA: Store the accumulator in memory
                case 0x8D: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //stor acc in memory location (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    _Memory.mainMemory[memoryLocation] = this.Acc;
                    break;
                }
                //6D ADC:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                case 0x6D: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //add
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = (this.Acc + _Memory.mainMemory[memoryLocation]) % MEMORY_SIZE;
                    break;
                }
                //A2 LDX: Load X register with a constant
                case 0xA2: {
                    this.PC++;
                    this.Xreg = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    break;
                }
                //AE LDX: Load X register from memory
                case 0xAE: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //update XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Xreg = _Memory.mainMemory[memoryLocation];
                    break;
                }
                //A0 LDY: Load Y register with a constant
                case 0xA0: {
                    this.PC++;
                    this.Yreg = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    break;
                }
                //AC LDY: Load Y register from memory
                case 0xAC: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //update YReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Yreg = _Memory.mainMemory[memoryLocation];
                    break;
                }
                //EA NOP: No operation
                case 0xEA: {
                    this.PC++;
                    break;
                }
                //00 BRK: end of program
                case 0x00: {
                    //this should maybe be a function call, not cpu functionality
                    //_StdOut.putText("Program done. ");
                    _StdOut.advanceLine();
                    _StdOut.putText(_OsShell.promptStr);
                    this.isExecuting = false;
                    //test print memory $0040
                    //_StdOut.putText("memory $0040: " + Utils.toHex(_Memory.mainMemory[0x0040]));
                    break;
                }
                //EC CPX: Compare byte in memory to XReg, set ZFlag if equal
                case 0xEC: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //compare memory to XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    if (this.Xreg == _Memory.mainMemory[memoryLocation]) {
                        this.Zflag = 0x1;
                    }
                    break;
                }
                //D0 BNE: Branch n bytes if Zflag = 0
                case 0xD0: {
                    this.PC++; //read branch
                    //branch
                    if (this.Zflag == 0x0) {
                        var branchBytes = _Memory.mainMemory[this.PC];
                        this.PC += branchBytes; // branch operand amount
                        //remove overflow
                        this.PC = this.PC % MEMORY_SIZE + 1; // add with carry
                        //_StdOut.putText("branch to " + this.PC);
                    }
                    //skip branch
                    else {
                        //_StdOut.putText("no branch ");
                        this.PC++; //next step
                    }
                    break;
                }
                //EE INC: Increment the value of a byte
                case 0xEE: {
                    this.PC++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC++; //next step
                    //put byte in acc, increment, return byte to memory 
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _Memory.mainMemory[memoryLocation];
                    this.Acc++; // = (this.Acc + 0x1) % _MemorySize; //add with carry?
                    _Memory.mainMemory[memoryLocation] = this.Acc;
                    break;
                }
                //FF SYS: System call
                case 0xFF: {
                    this.PC++; //next step
                    //ALLLLL of this should be a system call:
                    //enqueue system call software interupt
                    //print integer in Yreg
                    if (this.Xreg = 0x01) {
                        _StdOut.putText(TSOS.Utils.toHex(this.Yreg));
                    }
                    //print 00terminated string in Yreg
                    else if (this.Xreg = 0x02) { //magic number?
                        var startPosition = this.Yreg;
                        //need to complete!
                        //check that we actually make a system call
                        _StdOut.putText("~" + TSOS.Utils.toHex(this.Yreg) + "~ "); //temporary print memory location
                    }
                    break;
                }
                //Unknown instruction. kill and tell the user
                default: {
                    this.isExecuting = false;
                    _StdOut.putText("Unknown instruction: " + TSOS.Utils.toHex(this.instructionRegister));
                    _StdOut.advanceLine();
                    _StdOut.putText(_OsShell.promptStr);
                    break;
                }
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map