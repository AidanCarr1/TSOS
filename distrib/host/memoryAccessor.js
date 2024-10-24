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
        //add segment for proj 3
        write(location, data) {
            _Memory.mainMemory[location] = data;
        }
        //given a starting position and list of decimals, set memory elements to a given decimal
        writeSegment(decList, segmentNum) {
            var base = segmentNum * SEGMENT_SIZE;
            //loop through list of hex strings
            for (var i = base; i < base + SEGMENT_SIZE; i++) {
                //put hex into memory
                var currentDec = decList[i];
                this.write(i, currentDec);
            }
        }
        //given a segment, set all memory elements to 0x00
        clearSegment(segmentNum) {
            var base = segmentNum * SEGMENT_SIZE;
            //loop through memory segment
            for (var i = base; i < base + SEGMENT_SIZE; i++) {
                //write 0x00 in memory                
                this.write(i, 0x00);
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map