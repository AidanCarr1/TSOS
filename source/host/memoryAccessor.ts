/* ------------
    memoryAccessor.ts

    ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }

        //return element in memory locaiton
        public read(location: number): number{
            return _Memory.mainMemory[location];
        }

        //write element to memory location
        //add segment for proj 3
        public write(location: number, data: number): void{
            _Memory.mainMemory[location] = data;
        }

        //given a starting position and list of decimals, set memory elements to a given decimal
        public writeSegment(decList: number[], segmentNum: number){
            var base = segmentNum * SEGMENT_SIZE;

            //loop through list of hex strings
            for (var i = base; i < decList.length; i++) {
                
                //put hex into memory
                var currentDec = decList[i];
                this.write(i, currentDec);
            }
        }

        //given a segment, set all memory elements to 0x00
        public clearSegment(segmentNum: number){
            var base = segmentNum * SEGMENT_SIZE;

            //loop through memory segment
            for (var i = base; i < base + SEGMENT_SIZE; i++) {
                
                //write 0x00 in memory                
                this.write(i, 0x00);
            }
        }
    }
}
