/* ------------
     pcb.ts

     process control block
     stores a given pcb with its state, registers, sizes... everything!
     ------------ */
var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        pid;
        state;
        base;
        size;
        processPC;
        processAcc;
        processXreg;
        processYreg;
        processZflag;
        processIR;
        constructor(pid, state, base, //first memory location
        size, //length in bytes
        //saved cpu registers:
        processPC, processAcc, processXreg, //ALL THES QUESTION MARKS
        processYreg, //IDK HOW TO FIX THIS
        processZflag, //DIDNT NEED FOR OTHER CONSTRUCTORS...
        processIR) {
            this.pid = pid;
            this.state = state;
            this.base = base;
            this.size = size;
            this.processPC = processPC;
            this.processAcc = processAcc;
            this.processXreg = processXreg;
            this.processYreg = processYreg;
            this.processZflag = processZflag;
            this.processIR = processIR;
            //tell the kernel
            _Kernel.krnTrace('PCB created');
        }
        initRegisters() {
            //registers set to 0
            this.processPC = 0x00; //always start at the first location
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }
        //setters
        setPID(pid) {
            this.pid = pid;
        }
        setState(state) {
            this.state = state;
        }
        setBaseAndSize(base, size) {
            this.base = base;
            this.size = size;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map