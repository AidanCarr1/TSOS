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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public instructionRegister: number = 0x00,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.instructionRegister = 0x00; 
        }

        public run(pid: number) {
            //set starting location
            this.PC = _MemoryManager.getStartingMemory(pid);
            //SET ALL REGISTERS
            //BOOKMARK



            //TODO: add case where pid is not found
            //go
            this.isExecuting = true;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //fetch
            this.instructionRegister = _MemoryAccessor.read(this.PC);

            //decode and execute
            switch (this.instructionRegister) {

                // A9 LDA: Load the accumulator with constant
                case 0xA9: {
                    this.PC ++;
                    this.Acc = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step
                    break;
                }

                // AD LDA: Load the accumulator from memory
                case 0xAD: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //update accumulator (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _MemoryAccessor.read(memoryLocation);
                    break;
                }

                // 8D STA: Store the accumulator in memory
                case 0x8D: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step
    
                    //stor acc in memory location (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    _MemoryAccessor.write(memoryLocation, this.Acc);
                    break;
                }

                //6D ADC:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
                case 0x6D: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //add
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = (this.Acc + _MemoryAccessor.read(memoryLocation)) % MEMORY_SIZE;
                    break;
                }

                //A2 LDX: Load X register with a constant
                case 0xA2: {
                    this.PC ++;
                    this.Xreg = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step
                    break;
                }

                //AE LDX: Load X register from memory
                case 0xAE: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //update XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Xreg = _MemoryAccessor.read(memoryLocation);
                    break;
                }

                //A0 LDY: Load Y register with a constant
                case 0xA0: {
                    this.PC ++;
                    this.Yreg = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step
                    break;
                }

                //AC LDY: Load Y register from memory
                case 0xAC: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //update YReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Yreg = _MemoryAccessor.read(memoryLocation);
                    break;
                }

                //EA NOP: No operation
                case 0xEA: {
                    this.PC ++;
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
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //compare memory to XReg (little endian)
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    if (this.Xreg == _MemoryAccessor.read(memoryLocation)) {
                        this.Zflag = 0x1;
                    }
                    else {
                        this.Zflag = 0x0;
                    }
                    break;
                }

                //D0 BNE: Branch n bytes if Zflag = 0
                case 0xD0: {
                    this.PC ++; //read branch

                    //branch
                    if (this.Zflag == 0x0) {

                        var branchBytes = _MemoryAccessor.read(this.PC);
                        this.PC += branchBytes; // branch operand amount
                        //remove overflow
                        this.PC = this.PC % MEMORY_SIZE + 1; // add with carry
                        //_StdOut.putText("branch to " + this.PC);
                    }
                    //skip branch
                    else {
                        //_StdOut.putText("no branch ");
                        this.PC ++; //next step
                    }
                    break; 
                }

                //EE INC: Increment the value of a byte
                case 0xEE: {
                    this.PC ++;
                    var lowOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++;
                    var highOrderByte = _MemoryAccessor.read(this.PC);
                    this.PC ++; //next step

                    //put byte in acc, increment, return byte to memory 
                    var memoryLocation = (HIGH_ORDER_MULTIPLIER * highOrderByte) + lowOrderByte;
                    this.Acc = _MemoryAccessor.read(memoryLocation);
                    this.Acc ++; // = (this.Acc + 0x1) % _MemorySize; //add with carry?
                    _MemoryAccessor.write(memoryLocation, this.Acc);
                    break;
                }

                //FF SYS: System call
                case 0xFF: {
                    this.PC ++; //next step
                    
                    //create an interupt and enqueue it
                    var systemCall = new Interrupt(SOFTWARE_IRQ, []);
                    _KernelInterruptQueue.enqueue(systemCall);
                    break;
                }
                
                //Unknown instruction. kill and tell the user
                default: {
                    this.isExecuting = false;
                    _StdOut.putText("Unknown instruction: " + Utils.toHex(this.instructionRegister));
                    _StdOut.advanceLine();
                    _StdOut.putText(_OsShell.promptStr);
                    break;
                }
            } 
        }
    }
}
