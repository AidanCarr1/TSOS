/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */

module TSOS {

    export class MemoryManager {
    
        constructor(public pidCounter: number = 0,              //number of PIDs stored
                    public startingLocations: number[] = [] ) { //for each pid, store the starting location
        }

        //set counter and locations to 0 and empty
        public init(): void {
            this.pidCounter = 0;
            this.startingLocations = []
        }

        //given a program, remember the starting location, return pid
        public newProcess(decList: number[]): number {
            this.pidCounter ++;
            this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
            
            //I assume we will be moving processes in memory eventually
            // do that here
            
            return this.pidCounter;
        }
    }
}