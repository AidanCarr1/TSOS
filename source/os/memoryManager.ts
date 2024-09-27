/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */

module TSOS {

    export class ProcessControlBlock {
        constructor(public pid?: number,              
                    public state?: string,
                    public base?: number,    //first memory location
                    public size?: number,    //length in bytes

                    //saved cpu registers:
                    public processPC?: number,       
                    public processAcc?: number,
                    public processXreg?: number,
                    public processYreg?: number,
                    public processZflag?: number,
                    public processIR?: number ) { 
        }

        public init(pid: number, state: string, 
            base: number, size: number,
            processPC: number) {
            this.pid = pid;
            this.state = state;
            this.base = base;
            this.size = size;
            this.processPC = processPC;
            //registers set to 0
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }
    }

    export class MemoryManager {
    
        constructor(public pidCounter?: number,      //number of PIDs stored
                    public readyQueue?: Queue ) {        //store all processes in order of excution
        }

        //set counter to 0 
        public init(): void {
            this.pidCounter = 0;
            this.readyQueue = new Queue();
        }

        //given a program, create a process control block, return pid
        public newProcess(decList: number[]): number {
            //start at pid 0

            //create a PCB object
            var newProcess = new ProcessControlBlock();

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