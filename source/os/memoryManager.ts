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
                    public processXreg?: number,    //ALL THES QUESTION MARKS
                    public processYreg?: number,    //IDK HOW TO FIX THIS
                    public processZflag?: number,   //DIDNT NEED FOR OTHER CONSTRUCTORS...
                    public processIR?: number ) { 
        }

        public initRegisters(){
            //registers set to 0
            this.processPC = 0x00; //always start at the first location
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }

        //setters
        public setPID(pid: number) {
            this.pid = pid;
        }
        public setState(state: string) {
            this.state = state;
        }
        public setBaseAndSize(base: number, size: number){
            this.base = base;
            this.size = size;
        }
    }

    export class MemoryManager {
    
        constructor(public pidCounter?: number,      //number of PIDs stored
                    public readyQueue?: Queue,       //store all processes in order of excution
                    //keep track of all the PCBs:
                    public pcbList?: Array<ProcessControlBlock> ) {  
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
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            newProcess.setBaseAndSize(0x0000, decList.length); //put at $0000

            //this.startingLocations[this.pidCounter] = 0x0000; //put at $0000
            this.pidCounter ++;

            //I assume we will be moving processes in memory eventually
            // do that here
            
            //give pid value before it was incremented 
            return (this.pidCounter - 0x01);
        }

        //is this a necessary function?
        //i think this will change into cpu switching process function
        //to switch ALL registers
        public getStartingMemory(pid: number): number{
            return 0; //temporary
            //return this.startingLocations[pid];

            //FIX:
            // take pid, search through array of PCBs
            // check each pid value until found
            // reutn that PID's starting memory
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