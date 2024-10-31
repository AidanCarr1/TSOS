/* ------------
     memoryManager.ts

     this class stores the pcbs and the ready queue
     it will also maybe move and keep track of 256 byte segments
     allocates segments
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
            this.segmentList = new Array(NUM_OF_SEGEMENTS);
        }
        //given a program, create a process control block, return pid
        newProcess(decList, segment) {
            //create a PCB object
            var newProcess = new TSOS.ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            //put at $000 for proj2, use segment for proj3
            //newProcess.setBaseAndSize(0x000, decList.length); 
            newProcess.setSegment(segment);
            //let memory manager know about the PCB
            this.readyQueue.enqueue(newProcess);
            this.pcbList.push(newProcess);
            //thats one more PCB!
            this.pidCounter++;
            //give pid value 
            return newProcess.pid;
        }
        //return the pcb object given the pcb's pid
        getProcessByPID(pid) {
            return this.pcbList[pid];
        }
        //if pid cannot be found, return false
        isValid(pid) {
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
        whereIsSpace() {
            //check every pcb for any residents/readys
            for (var i = 0; i < NUM_OF_SEGEMENTS; i++) {
                var pid = this.segmentList[i];
                //if segment unused, use it!
                if (pid === undefined) {
                    return i;
                }
                //check for a terminated segment
                if (this.getProcessByPID(pid).state === "TERMINATED") {
                    return i;
                }
            }
            //checked all segments, no segments open
            return ERROR_CODE;
        }
        // kill the pcb associated with the segment
        killSegment(segment) {
            var zombiePID = this.segmentList[segment];
            //nothing to kill
            if (zombiePID === undefined) {
                return;
            }
            var zombiePCB = this.getProcessByPID(zombiePID);
            zombiePCB.setState("TERMINATED");
            zombiePCB.segment = ERROR_CODE;
            this.segmentList[segment] = undefined;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map