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
            this.pidCounter++;
            this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
            //I assume we will be moving processes in memory eventually
            // do that here
            return this.pidCounter;
        }
        getStartingMemory(pid) {
            return this.startingLocations[pid];
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map