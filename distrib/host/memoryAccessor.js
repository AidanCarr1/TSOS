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
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map