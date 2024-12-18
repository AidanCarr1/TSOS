/* ------------
     memoryManager.ts

     this class stores the pcbs and the ready queue
     it also knows where there is space, and what pcbs exist and can run or be killed
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        pidCounter;
        readyQueue;
        pcbList;
        segmentList;
        constructor(pidCounter, //number of PIDs stored
        readyQueue, //store all processes in order of excution
        //keep track of all the PCBs:
        pcbList, segmentList) {
            this.pidCounter = pidCounter;
            this.readyQueue = readyQueue;
            this.pcbList = pcbList;
            this.segmentList = segmentList;
        }
        //set counter to 0 
        init() {
            //start at pid 0
            this.pidCounter = 0;
            this.readyQueue = new TSOS.Queue();
            this.pcbList = new Array();
            this.segmentList = new Array(NUM_OF_SEGMENTS);
        }
        //given a program, create a process control block, return pid
        newProcess(decList, segment) {
            //create a PCB object
            var newProcess = new TSOS.ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            //give the segment 
            newProcess.setSegment(segment);
            //let memory manager know about the PCB
            this.pcbList.push(newProcess);
            //thats one more PCB!
            this.pidCounter++;
            //add pcb to the HTML
            TSOS.Control.addPCBDisplay(newProcess);
            //give pid value 
            return newProcess.pid;
        }
        //return the pcb object given the pcb's pid
        getProcessByPID(pid) {
            return this.pcbList[pid];
        }
        //if pid cannot be found or should not be added to ready queue, return false
        isRunable(pid) {
            //pid is out of range
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            }
            //pcb is terminated
            else if (this.getProcessByPID(pid).state === "TERMINATED") {
                _StdOut.putText("Process " + pid + " is terminated.");
                _StdOut.advanceLine();
                return false;
            }
            //pcb is ready or running
            else if (this.getProcessByPID(pid).state === "RUNNING" || this.getProcessByPID(pid).state === "READY") {
                _StdOut.putText("Process " + pid + " is currently running.");
                _StdOut.advanceLine();
                return false;
            }
            //pcb is good  
            else {
                return true;
            }
        }
        //function returns where there is space
        whereIsSpace() {
            //check every pcb for any residents/readys
            for (var i = 0; i < NUM_OF_SEGMENTS; i++) {
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
        //if pid cannot be found or is already dead, return false
        isKillable(pid) {
            //pid is out of range
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            }
            //pcb is terminated
            else if (this.getProcessByPID(pid).state === "TERMINATED") {
                _StdOut.putText("Process " + pid + " is already terminated.");
                _StdOut.advanceLine();
                return false;
            }
            //pcb is ready to be killed  
            else {
                return true;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map