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
            public write(location: number, element: number): void{
                _Memory.mainMemory[location] = element;
            }
        }
    }
    