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
                    public residentQueue?: Queue,       //store all processes in order of excution
                    //keep track of all the PCBs:
                    public pcbList?: Array<ProcessControlBlock>,
                    public segmentList?: Array<ProcessControlBlock> ) {  
        }

        //set counter to 0 
        public init(): void {
            //start at pid 0
            this.pidCounter = 0;
            this.readyQueue = new Queue();
            this.residentQueue = new Queue();
            this.pcbList = new Array();
            this.segmentList = new Array(NUM_OF_SEGEMENTS);
        }

        //given a program, create a process control block, return pid
        public newProcess(decList: number[], segment: number): number {
           
            //create a PCB object
            var newProcess = new ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");

            //give the segment 
            newProcess.setSegment(segment); 

            //let memory manager know about the PCB
            this.residentQueue.enqueue(newProcess); //this.readyQueue.enqueue(newProcess);
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

        //if pid cannot be found or should not be added to ready queue, return false
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
            //pcb is is ready queue
            else if (this.getProcessByPID(pid).state === "READY") {
                _StdOut.putText("Process " + pid + " is in the ready queue.");
                _StdOut.advanceLine();
                return false;
            } 
            //pcb is running
            else if (this.getProcessByPID(pid).state === "RUNNING") {
                _StdOut.putText("Process " + pid + " is currently running.");
                _StdOut.advanceLine();
                return false;
            } 
            //pcb good  
            else {
                return true;
            }
        }

        //function returns where there is space
        public whereIsSpace(): number {

            //check every pcb for any residents/readys
            for (var i = 0; i < NUM_OF_SEGEMENTS; i++) {
                var pcb = this.segmentList[i];

                //if segment unused, use it!
                if (pcb === undefined) {
                    return i;
                }
                //check for a terminated segment
                if (pcb.getState() === "TERMINATED") {
                    return i;
                } 
            }
            
            //checked all segments, no segments open
            return ERROR_CODE;
        }

        // kill the pcb associated with the segment
        public killSegment(segment: number){
            var zombiePCB = this.segmentList[segment];
            
            //nothing to kill
            if (zombiePCB === undefined) {
                return;
            }

            zombiePCB.setState("TERMINATED");
            zombiePCB.segment = ERROR_CODE;
            this.segmentList[segment] = undefined;
        }
    }
}