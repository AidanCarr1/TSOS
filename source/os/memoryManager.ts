/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */

module TSOS {

    export class MemoryManager {
    
        constructor(public pidCounter: number = 0) {
        }

        public init(): void {
            this.pidCounter = 0;
        }

        public newProcess(decList: number[]) {
            this.pidCounter ++;
        }
    }
}