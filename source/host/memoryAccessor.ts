/* ------------
    memoryAccessor.ts

    ------------ */

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }
        

        //TODO: add base as a parameter
        //this helps because when cpu is running its the currentPCB
        //but when creating a process and writing to mem, there is no current PCB

        //return element in memory locaiton
        public read(logicalAddress: number, base: number): number{
            
            //get physical address and limit
            var physicalAddress = logicalAddress + base;
            var limit = base + SEGMENT_SIZE - 0x01;

            //make sure we are inside memory bounds
            if (logicalAddress > limit) {

                //create an interupt and enqueue it
                var systemCall = new Interrupt(OUT_OF_BOUNDS_IRQ, [_CPU.currentPCB, physicalAddress]);
                _KernelInterruptQueue.enqueue(systemCall);                
                return ERROR_CODE;
            }
            else {
                return _Memory.mainMemory[physicalAddress];
            }
        }

        //write element to memory location
        public write(logicalAddress: number, data: number, base: number): void{
            
            //get physical address and limit
            var physicalAddress = logicalAddress + base;
            var limit = base + SEGMENT_SIZE - 0x01;

            //make sure we are inside memory bounds
            if (physicalAddress > limit) {
                
                //create an interupt and enqueue it
                var systemCall = new Interrupt(OUT_OF_BOUNDS_IRQ, [_CPU.currentPCB, physicalAddress]);
                _KernelInterruptQueue.enqueue(systemCall);                
            }
            else {
                _Memory.mainMemory[physicalAddress] = data;
            }
        }

        //given a segment user program, set memory elements to the given decimals
        public writeSegment(decList: number[], segment: number){
            var base = segment * SEGMENT_SIZE;

            //loop through list of decimal values
            for (var i = 0; i < decList.length; i++) {
                
                //put user program into memory
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
            if (_MemoryManager.segmentList[segment] !== undefined) {
                _MemoryManager.segmentList[segment].setSegment(ERROR_CODE);
            }
        }
    }
}
