/* ------------
     memoryAccessor.ts

     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        constructor() {
        }
        //return element in memory locaiton
        read(location) {
            return _Memory.mainMemory[location];
        }
        //write element to memory location
        write(location, data) {
            _Memory.mainMemory[location] = data;
        }
        //given a starting position and list of decimals, set memory elements to a given decimal
        writeBlock(decList, startIndex) {
            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {
                var currentMemoryIndex = i + startIndex;
                var currentDec = decList[i];
                //put number into memory
                this.write(currentMemoryIndex, currentDec);
                //test print
                //_StdOut.putText("Memory $" + Utils.toHex(currentMemoryIndex) + " - " + Utils.toHex(currentDec));
                //_StdOut.advanceLine();
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map