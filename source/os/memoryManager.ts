/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */

module TSOS {

    export class ProcessControlBlock {
        constructor(public pid: number,              
                    public state: string,
                    public processPC: number,
                    public processAcc: number = 0,
                    public processXreg: number = 0,
                    public processYreg: number = 0,
                    public processZflag: number = 0,
                    public processIR: number ) { 
        }
    }

    export class MemoryManager {
    
        constructor(public pidCounter: number = 0,      //number of PIDs stored
                    public readyQueue: Queue ) {        //store all processes in order of excution
        }

        //set counter to 0 
        public init(): void {
            this.pidCounter = 0;
            this.readyQueue = new Queue();
        }

        //given a program, remember the starting location, return pid
        public newProcess(decList: number[]): number {
            //start at pid 0
            //this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
            this.pidCounter ++;

            //I assume we will be moving processes in memory eventually
            // do that here
            
            //give pid value before it was incremented 
            return (this.pidCounter - 0x01);
        }

        public getStartingMemory(pid: number): number{
            return this.startingLocations[pid];
        }

        //if pid cannot be found, return false
        public isValid(pid: number): boolean{
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            } else {
                return true;
            }
        }
    }
}