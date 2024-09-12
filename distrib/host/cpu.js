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
        cycle() {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.instructionRegister = _Memory.mainMemory[this.PC];
            // A9 LDA: Load the accumulator with constant
            if (this.instructionRegister == 0xA9) {
                this.PC++;
                this.Acc = _Memory.mainMemory[this.PC];
                this.PC++; //next step
            }
            // 8D STA: Store the accumulator in memory
            else if (this.instructionRegister == 0x8D) {
                this.PC++;
                var lowOrderByte = _Memory.mainMemory[this.PC];
                this.PC++;
                var highOrderByte = _Memory.mainMemory[this.PC];
                this.PC++; //next step
                //remember little endian
                var memoryLocation = (0x0100 * highOrderByte) + lowOrderByte;
                _Memory.mainMemory[memoryLocation] = this.Acc;
            }
            //00 HLT: end of program
            else if (this.instructionRegister == 0x8D) {
                this.isExecuting = false;
            }
            else {
                _StdOut.putText("Unknown instruction: " + TSOS.Utils.toHex(this.instructionRegister));
            }
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map