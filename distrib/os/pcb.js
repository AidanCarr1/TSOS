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
        priority;
        base;
        limit;
        segment;
        location;
        processPC;
        processAcc;
        processXreg;
        processYreg;
        processZflag;
        processIR;
        isInHTML;
        turnaroundTime;
        waitTime;
        constructor(pid, state, priority, 
        //memory location
        base, //first memory location
        limit, //last memory location
        segment, //will be changing 
        location, 
        //saved cpu registers:
        processPC, processAcc, processXreg, processYreg, processZflag, processIR, 
        //statistics
        isInHTML, turnaroundTime, waitTime) {
            this.pid = pid;
            this.state = state;
            this.priority = priority;
            this.base = base;
            this.limit = limit;
            this.segment = segment;
            this.location = location;
            this.processPC = processPC;
            this.processAcc = processAcc;
            this.processXreg = processXreg;
            this.processYreg = processYreg;
            this.processZflag = processZflag;
            this.processIR = processIR;
            this.isInHTML = isInHTML;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
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
            //not registers
            this.priority = DEFAULT_PRIORITY;
            this.turnaroundTime = 0;
            this.waitTime = 0;
            this.isInHTML = false;
        }
        //setters
        setPID(pid) {
            this.pid = pid;
        }
        setState(state) {
            this.state = state;
            _Kernel.krnTrace('PID ' + this.pid + ' set to ' + this.state);
            TSOS.Control.updatePCBDisplay(this);
        }
        setSegment(segment) {
            //for storing in memory...
            if (segment == STORE_ON_DISK) {
                this.segment = ERROR_CODE;
                //set the base and limit
                var base = this.getBase(); //ERROR -> ERROR
                var limit = this.getLimit(); //ERROR -> ERROR
                //location
                this.location = "Disk";
            }
            //for deleting...
            else if (segment == ERROR_CODE) {
                this.segment = ERROR_CODE;
                this.base = ERROR_CODE;
                this.limit = ERROR_CODE;
                //location
                this.location = "---";
            }
            //for storing on disk...
            else {
                this.segment = segment;
                //set segment in eyes of memory manager
                _MemoryManager.segmentList[segment] = this;
                //also sets the base and limit
                var base = this.getBase(); //0->0x000 1->0x100 2->0x200
                var limit = this.getLimit(); //0->0x0FF 1->0x1FF 2->0x2FF
                //location
                this.location = "Memory";
            }
            //update display
            TSOS.Control.updatePCBDisplay(this);
        }
        //getters
        getBase() {
            //no segment = no base
            if (this.segment == ERROR_CODE) {
                this.base = ERROR_CODE;
                return this.base;
            }
            this.base = SEGMENT_SIZE * this.segment;
            return this.base;
        }
        getLimit() {
            //no segment = no limit
            if (this.segment == ERROR_CODE) {
                this.limit = ERROR_CODE;
                return this.limit;
            }
            this.base = this.base + SEGMENT_SIZE - 0x01;
            return this.base;
        }
        getState() {
            return this.state;
        }
        getSegment() {
            return this.segment;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map