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
    }
}
