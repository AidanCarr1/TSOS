/* ------------
     memory.ts

     
     ------------ */

module TSOS {

    export class Memory {

        constructor(public mainMemory) {
            this.initializeMemoryArray();
        }

        //create memory in array form: space of 0xffff, word size 0xff 
        public initializeMemoryArray(){
            this.mainMemory = new Array(0xffff);
            
            //initialize to all 0x00's
            //this.reset()
        }
    }
}
