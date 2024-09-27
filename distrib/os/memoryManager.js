/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
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
        processPC, processAcc, processXreg, processYreg, processZflag, processIR) {
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
        }
        init(pid, state, base, size, processPC) {
            this.pid = pid;
            this.state = state;
            this.base = base;
            this.size = size;
            this.processPC = processPC;
            //registers set to 0
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
    class MemoryManager {
        pidCounter;
        readyQueue;
        constructor(pidCounter, //number of PIDs stored
        readyQueue) {
            this.pidCounter = pidCounter;
            this.readyQueue = readyQueue;
        }
        //set counter to 0 
        init() {
            this.pidCounter = 0;
            this.readyQueue = new TSOS.Queue();
        }
        //given a program, create a process control block, return pid
        newProcess(decList) {
            //start at pid 0
            //create a PCB object
            var newProcess = new ProcessControlBlock();
            //this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
            this.pidCounter++;
            //I assume we will be moving processes in memory eventually
            // do that here
            //give pid value before it was incremented 
            return (this.pidCounter - 0x01);
        }
        getStartingMemory(pid) {
            return this.startingLocations[pid];
        }
        //if pid cannot be found, return false
        isValid(pid) {
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map