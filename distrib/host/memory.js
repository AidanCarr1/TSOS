/* ------------
     memory.ts

     
     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        mainMemory;
        constructor(mainMemory = []) {
            this.mainMemory = mainMemory;
        }
        init() {
            //initialize main memory to all 0x00's
            this.reset();
        }
        //(re)set all mainMemory elements to 0x00
        reset() {
            for (let i = 0x00; i < MEMORY_SIZE; i++) {
                this.mainMemory[i] = (0x00);
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map