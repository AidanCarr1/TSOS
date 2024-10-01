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
        //given a starting position and string list of hexes, set memory elements to a given hex
        setMemoryStr(hexList, startIndex) {
            //convert hex list to decimal list
            var decimalList;
            for (var i = 0; i < hexList.length; i++) {
                decimalList[i] = TSOS.Utils.hexStringToDecimal(hexList[i]);
            }
            //set memory with function
            _MemoryAccessor.writeBlock(decimalList, startIndex);
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map