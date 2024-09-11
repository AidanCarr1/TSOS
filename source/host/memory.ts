/* ------------
     memory.ts

     
     ------------ */

module TSOS {

    export class Memory {

        constructor(public mainMemory) {
            this.initializeMemoryArray();
        }

        //create mainMemory in array form: space of 0xffff 
        public initializeMemoryArray(){
            this.mainMemory = new Array(0xffff);
            
            //initialize to all 0x00's
            this.reset()
        }

        //(re)set all mainMemory elements to 0x00
        public reset(){
            for(let i = 0x0000; i < 0xffff; i++){
                this.mainMemory[i] = (0x00);
            }  
        }

        //given a starting position and string list of hexes, set memory elements to a given hex
        public setMemoryStr(hexList: string[], startIndex: number){

            _StdOut.putText("before loop"); //test
            _StdOut.advanceLine();

            //loop through list of hex strings
            for (var i = 0; i < hexList.length; i++) {
                var currentMemoryIndex = i + startIndex;
                var currentHex = hexList[i];

                _StdOut.putText("before util"); //test
                _StdOut.advanceLine();

                //convert str hex to decimal
                var currentDecimal = Utils.hexStringToDecimal(currentHex);

                _StdOut.putText("after util"); //test
                _StdOut.advanceLine();

                //put number into memory
                this.mainMemory[currentMemoryIndex] = currentDecimal;
                
                //test print
                _StdOut.putText("0x" + currentHex + " = " + currentDecimal + ". Memory: $" + currentMemoryIndex);
                _StdOut.advanceLine();
            }
        }

        //given a starting position and list of decimals, set memory elements to a given decimal
        public setMemoryDec(decList: number[], startIndex: number){

            _StdOut.putText("before loop"); //test
            _StdOut.advanceLine();

            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {
                var currentMemoryIndex = i + startIndex;
                var currentDec = decList[i];

                //put number into memory
                this.mainMemory[currentMemoryIndex] = decList;
                
                //test print
                _StdOut.putText("Memory $" + currentMemoryIndex + " - " + currentDec);
                _StdOut.advanceLine();
            }
        }
    }
}
