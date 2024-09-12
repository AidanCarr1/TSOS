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
            for (let i = 0x0000; i <= 0xffff; i++) {
                this.mainMemory[i] = (0x00);
            }
        }
        //given a starting position and list of decimals, set memory elements to a given decimal
        setMemoryDec(decList, startIndex) {
            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {
                var currentMemoryIndex = i + startIndex;
                var currentDec = decList[i];
                //put number into memory
                this.mainMemory[currentMemoryIndex] = currentDec;
                //test print
                _StdOut.putText("Memory $" + currentMemoryIndex + " - " + currentDec);
                _StdOut.advanceLine();
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
            this.setMemoryDec(decimalList, startIndex);
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map