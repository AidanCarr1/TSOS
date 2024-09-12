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
            for(let i = 0x0000; i <= 0xffff; i++){
                this.mainMemory[i] = (0x00);
            }  
        }

        //given a starting position and list of decimals, set memory elements to a given decimal
        public setMemoryDec(decList: number[], startIndex: number){

            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {

                var currentMemoryIndex = i + startIndex;
                var currentDec = decList[i];

                //put number into memory
                this.mainMemory[currentMemoryIndex] = currentDec;
                
                //test print
                _StdOut.putText("Memory $" + Utils.toHex(currentMemoryIndex) + " - " + Utils.toHex(currentDec));
                _StdOut.advanceLine();
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
            this.setMemoryDec(decimalList, startIndex);
        }
    }
}
