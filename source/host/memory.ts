/* ------------
     memory.ts

     
     ------------ */

module TSOS {

    export class Memory {

        constructor(public mainMemory: number[] = []) {
            this.initializeMemoryArray();
        }

        public init(): void {
        }

        //create mainMemory in array form: space of 0xffff 
        public initializeMemoryArray(){
            //this.mainMemory = new Array(0xffff);
            
            //initialize to all 0x00's
            this.reset()
        }

        //(re)set all mainMemory elements to 0x00
        public reset(){
            for(let i = 0x0000; i < 0xffff; i++){
                this.mainMemory[i] = (0x00);
            }  
        }

        //given a starting position and list of decimals, set memory elements to a given decimal
        public setMemoryDec(decList: number[], startIndex: number){

            _StdOut.putText("declist len: " + decList[1]); //test
            _StdOut.advanceLine();

            //loop through list of hex strings
            for (var i = 0; i < decList.length; i++) {
                _StdOut.putText("in loop"); //test
                _StdOut.advanceLine();
                var currentMemoryIndex = i + startIndex;
                var currentDec = decList[i];

                _StdOut.putText("before memory"); //test
                _StdOut.advanceLine();

                //put number into memory
                this.mainMemory[currentMemoryIndex] = currentDec;
                
                //test print
                _StdOut.putText("Memory $" + currentMemoryIndex + " - " + currentDec);
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
