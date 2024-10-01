/* ------------
     memory.ts

     
     ------------ */

module TSOS {

    export class Memory {

        constructor(public mainMemory: number[] = []) {
        }

        public init(): void {
            //initialize main memory to all 0x00's
            this.reset();
        }

        //(re)set all mainMemory elements to 0x00
        public reset(){
            for(let i = 0x00; i < MEMORY_SIZE; i++){
                this.mainMemory[i] = (0x00);
            }  
        }

        //given a starting position and string list of hexes, set memory elements to a given hex
        public setMemoryStr(hexList: string[], startIndex: number){

            //convert hex list to decimal list
            var decimalList: number[];
            for (var i = 0; i < hexList.length; i++) {
                decimalList[i] = Utils.hexStringToDecimal(hexList[i]);
            }
            //set memory with function
            _MemoryAccessor.writeBlock(decimalList, startIndex);
        }
    }
}
