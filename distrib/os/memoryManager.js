/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        pidCounter;
        constructor(pidCounter = 0) {
            this.pidCounter = pidCounter;
        }
        init() {
            this.pidCounter = 0;
        }
        newProcess(decList) {
            this.pidCounter++;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map