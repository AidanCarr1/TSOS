/* ------------
     memoryManager.ts

     this class stores the pcbs and the ready queue
     it will also maybe move and keep track of 256 byte segments
     ------------ */

module TSOS {

    export class MemoryManager {
    
        constructor(public pidCounter?: number,      //number of PIDs stored
                    public readyQueue?: Queue,       //store all processes in order of excution
                    //keep track of all the PCBs:
                    public pcbList?: Array<ProcessControlBlock> ) {  
        }

        //set counter to 0 
        public init(): void {
            //start at pid 0
            this.pidCounter = 0;
            this.readyQueue = new Queue();
            this.pcbList = new Array();
        }

        //given a program, create a process control block, return pid
        public newProcess(decList: number[]): number {
           
            _StdOut.putText(" gonna be made~"); //test
            //create a PCB object
            var //newProcess: ProcessControlBlock = null;
            newProcess = new ProcessControlBlock();
            _StdOut.putText(" obj made~"); //test
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            newProcess.setBaseAndSize(0x000, decList.length); //put at $000 for proj2

            _StdOut.putText(" regs set~"); //test
            //let memory manager know about the PCB
            this.readyQueue.enqueue(newProcess);
            this.pcbList.push(newProcess);

            _StdOut.putText(" add to arrays~"); //test
            //thats one more PCB!
            this.pidCounter ++;
            
            //give pid value 
            return newProcess.pid;
        }

        //return the pcb object given the pcb's pid
        public getProcessByPID(pid: number): ProcessControlBlock {
            return this.pcbList[pid];
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