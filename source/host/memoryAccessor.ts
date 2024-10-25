/* ------------
    memoryAccessor.ts

    ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }
        

        //TODO: add base as a parameter
        //this helps because when cpu is running its the curretnPCB
        //but when creating a process and writing to mem, there is no current PCB

        //return element in memory locaiton
        public read(logicalAddress: number, base: number): number{

            //get physical address
            //var base = _CPU.currentPCB.getBase();
            var physicalAddress = logicalAddress + base;

            return _Memory.mainMemory[physicalAddress];
        }

        //write element to memory location
        public write(logicalAddress: number, data: number, base: number): void{

            //get physical address
            //var base = _CPU.currentPCB.getBase();
            var physicalAddress = logicalAddress + base;

            _Memory.mainMemory[physicalAddress] = data;
        }

        //given a starting position and list of decimals, set memory elements to a given decimal
        public writeSegment(decList: number[], segment: number){
            var base = segment * SEGMENT_SIZE;

            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {
                
                //put hex into memory
                var currentDec = decList[i];
                this.write(i, currentDec, base);
            }
        }

        //given a segment, set all memory elements to 0x00
        public clearSegment(segment: number){
            var base = segment * SEGMENT_SIZE;

            //loop through memory segment
            for (var i = 0; i < SEGMENT_SIZE; i++) {
                
                //write 0x00 in memory                
                this.write(i, 0x00, base);
            }
        }
    }
}
