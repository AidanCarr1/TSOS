/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        pidCounter;
        startingLocations;
        constructor(pidCounter = 0, //number of PIDs stored
        startingLocations = []) {
            this.pidCounter = pidCounter;
            this.startingLocations = startingLocations;
        }
        //set counter and locations to 0 and empty
        init() {
            this.pidCounter = 0;
            this.startingLocations = [];
        }
        //given a program, remember the starting location, return pid
        newProcess(decList) {
            //start at pid 0
            this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
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