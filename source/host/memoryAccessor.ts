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
            public write(location: number, data: number): void{
                _Memory.mainMemory[location] = data;
            }

            //given a starting position and list of decimals, set memory elements to a given decimal
            public writeBlock(decList: number[], startIndex: number){

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

            //given a starting segment, set all memory elements to 0x00
            public clearBlock(segment: number){

                //loop through memory segment
                for (var i = 0; i < MEMORY_SIZE; i++) {
                    
                    //good for proj2, will change for proj3:
                    //var currentMemoryIndex = i + startIndex;
                    //put number into memory
                    //this.write(currentMemoryIndex, 0x00);
                    
                    this.write(i, 0x00);
                }
            }
        }
    }
    