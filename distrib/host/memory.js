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
        //create mainMemory in array form: space of 0xffff 
        initializeMemoryArray() {
            this.mainMemory = new Array(0xffff);
            //initialize to all 0x00's
            this.reset();
        }
        //(re)set all mainMemory elements to 0x00
        reset() {
            for (let i = 0x0000; i < 0xffff; i++) {
                this.mainMemory[i] = (0x00);
            }
        }
        //given a starting position and string list of hexes, set memory elements to a given hex
        setMemoryStr(hexList, startIndex) {
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map