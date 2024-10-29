/* ------------
     memoryManager.ts

     this class stores the pcbs and the ready queue
     it will also maybe move and keep track of 256 byte segments
     allocates segments
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
        public newProcess(decList: number[], segment: number): number {
           
            //create a PCB object
            var newProcess = new ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");

            //put at $000 for proj2, use segment for proj3
            //newProcess.setBaseAndSize(0x000, decList.length); 
            newProcess.setSegment(0x00); 

            //let memory manager know about the PCB
            this.readyQueue.enqueue(newProcess);
            this.pcbList.push(newProcess);

            //thats one more PCB!
            this.pidCounter ++;
            
            //give pid value 
            return newProcess.pid;
        }

        //return the pcb object given the pcb's pid
        public getProcessByPID(pid: number): ProcessControlBlock {
            return this.pcbList[pid];
        }

        //if pid cannot be found, return false
        public isValid(pid: number): boolean{
            //pid out of range
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            } 
            //pcb terminated
            else if (this.getProcessByPID(pid).state === "TERMINATED") {
                _StdOut.putText("Process " + pid + " terminated.");
                _StdOut.advanceLine();
                return false;
            }  
            //pcb good  
            else {
                return true;
            }
        }

        //function returns where there is space
        //for proj2: 
            //returns segment 0 if its open
            //returns ERROR CODE if its not open
        //for proj3:
            //idk ill get to it when i get there something like 3 segments and stuff   
        public whereIsSpace(): number {

            //check every pcb for any residents/readys
            for (var i = 0; i < this.pidCounter; i++) {
                if (this.pcbList[i].state === "RESIDENT") {
                    return ERROR_CODE;
                }
                else if (this.pcbList[i].state === "READY") {
                    return ERROR_CODE;
                }
                else if (this.pcbList[i].state === "RUNNING") {
                    return ERROR_CODE;
                }
            }
            //there is space, return the segment
            return 0;
        }
    }
}