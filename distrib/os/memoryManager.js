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
        processPC;
        processAcc;
        processXreg;
        processYreg;
        processZflag;
        processIR;
        constructor(pid, state, processPC, processAcc = 0, processXreg = 0, processYreg = 0, processZflag = 0, processIR) {
            this.pid = pid;
            this.state = state;
            this.processPC = processPC;
            this.processAcc = processAcc;
            this.processXreg = processXreg;
            this.processYreg = processYreg;
            this.processZflag = processZflag;
            this.processIR = processIR;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
    class MemoryManager {
        pidCounter;
        readyQueue;
        constructor(pidCounter = 0, //number of PIDs stored
        readyQueue) {
            this.pidCounter = pidCounter;
            this.readyQueue = readyQueue;
        }
        //set counter to 0 
        init() {
            this.pidCounter = 0;
            this.readyQueue = new TSOS.Queue();
        }
        //given a program, remember the starting location, return pid
        newProcess(decList) {
            //start at pid 0
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