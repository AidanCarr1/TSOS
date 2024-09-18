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
            //TODO: add case where pid is not found
            //go
            this.isExecuting = true;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            //fetch
            this.instructionRegister = _Memory.mainMemory[this.PC];

            switch (this.instructionRegister) {

                // A9 LDA: Load the accumulator with constant
                case 0xA9: {
                    this.PC ++;
                    this.Acc = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step
                    break;
                }

                // AD LDA: Load the accumulator from memory
                case 0xAD: {
                    this.PC ++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step

                    //update accumulator (little endian)
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    this.Acc = _Memory.mainMemory[memoryLocation];
                    break;
                }

                // 8D STA: Store the accumulator in memory
                case 0x8D: {
                    this.PC ++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step
    
                    //stor acc in memory location (little endian)
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    _Memory.mainMemory[memoryLocation] = this.Acc;
                    break;
                }

                //6D ADC:  Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator

                //A2 LDX: Load X register with a constant
                case 0xA2: {
                    this.PC ++;
                    this.Xreg = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step
                    break;
                }

                //AE LDX: Load X register from memory
                case 0xAE: {
                    this.PC ++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step

                    //update XReg (little endian)
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    this.Xreg = _Memory.mainMemory[memoryLocation];
                    break;
                }

                //A0 LDY: Load Y register with a constant
                case 0xA0: {
                    this.PC ++;
                    this.Yreg = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step
                    break;
                }

                //AC LDY: Load Y register from memory
                case 0xAC: {
                    this.PC ++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step

                    //update YReg (little endian)
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    this.Yreg = _Memory.mainMemory[memoryLocation];
                    break;
                }

                //EA NOP: No operation
                case 0xEA: {
                    this.PC ++;
                    break;
                }

                //00 BRK: end of program
                case 0x00: {
                    _StdOut.putText("Program done. ");
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
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step

                    //compare memory to XReg (little endian)
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    if (this.Xreg == _Memory.mainMemory[memoryLocation]) {
                        this.Zflag = 0x1;
                    }
                    break;
                }

                //D0 BNE: Branch n bytes if Zflag = 0
                case 0xD0: {
                    this.PC ++; //next step

                    //branch
                    if (this.Zflag == 0x0) {

                        var branchBytes = _Memory.mainMemory[this.PC];
                        this.PC += branchBytes; // possible off by 1 error
                        //remove overflow
                        this.PC = this.PC % _MemorySize; // possible off by 1 error
                    }
                    break; 
                }

                //EE INC: Increment the value of a byte
                case 0xEE: {
                    this.PC ++;
                    var lowOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++;
                    var highOrderByte = _Memory.mainMemory[this.PC];
                    this.PC ++; //next step

                    //put byte in acc, increment, return byte to memory 
                    var memoryLocation = (_HighOrderMultiplier * highOrderByte) + lowOrderByte;
                    this.Acc = _Memory.mainMemory[memoryLocation];
                    this.Acc ++; // = (this.Acc + 0x1) % _MemorySize; //add with carry?
                    _Memory.mainMemory[memoryLocation] = this.Acc;
                    break;
                }

                //FF SYS: System call
                case 0xFF: {
                    this.PC ++; //next step

                    //print integer in Yreg
                    if (this.Xreg = 0x01) {
                        _StdOut.putText(Utils.toHex(this.Yreg));
                    }

                    //print 00terminated string in Yreg
                    if (this.Xreg = 0x02) { //magic number?
                        var startPosition = this.Yreg;
                        //BOOKMARK

                    }
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
