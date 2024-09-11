/* ------------
     memory.ts

     
     ------------ */
var TSOS;
(function (TSOS) {
    class Memory {
        mainMemory;
        constructor(mainMemory) {
            this.mainMemory = mainMemory;
            this.initializeMemoryArray();
        }
        //create memory in array form: space of 0xffff, word size 0xff 
        initializeMemoryArray() {
            this.mainMemory = new Array(0xffff);
            //initialize to all 0x00's
            //this.reset()
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map