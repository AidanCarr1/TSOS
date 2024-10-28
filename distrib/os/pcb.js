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
        limit;
        segment;
        processPC;
        processAcc;
        processXreg;
        processYreg;
        processZflag;
        processIR;
        constructor(pid, state, 
        //memory location
        base, //first memory location
        limit, //last memory location
        segment, //will be changing 
        //saved cpu registers:
        processPC, processAcc, processXreg, processYreg, processZflag, processIR) {
            this.pid = pid;
            this.state = state;
            this.base = base;
            this.limit = limit;
            this.segment = segment;
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
            //but just in case:
            this.processIR = 0x00;
        }
        //setters
        setPID(pid) {
            this.pid = pid;
        }
        setState(state) {
            this.state = state;
            //_Kernel.krnTrace('PCB ' + this.pid + ' set to READY');
        }
        setSegment(segment) {
            this.segment = segment;
            //also sets the base and limit
            this.base = SEGMENT_SIZE * segment; //0->0x000 1->0x100 2->0x200
            this.limit = this.base + SEGMENT_SIZE - 0x01; //0->0x0FF 1->0x1FF 2->0x2FF
        }
        getBase() {
            this.base = SEGMENT_SIZE * this.segment;
            return this.base;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map