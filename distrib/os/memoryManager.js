/* ------------
     memoryManager.ts

     this class stores the pcbs and the ready queue
     it will also maybe move and keep track of 256 byte segments
     ------------ */
var TSOS;
(function (TSOS) {
    class MemoryManager {
        pidCounter;
        readyQueue;
        pcbList;
        constructor(pidCounter, //number of PIDs stored
        readyQueue, //store all processes in order of excution
        //keep track of all the PCBs:
        pcbList) {
            this.pidCounter = pidCounter;
            this.readyQueue = readyQueue;
            this.pcbList = pcbList;
        }
        //set counter to 0 
        init() {
            //start at pid 0
            this.pidCounter = 0;
            this.readyQueue = new TSOS.Queue();
            this.pcbList = new Array();
        }
        //given a program, create a process control block, return pid
        newProcess(decList) {
            //create a PCB object
            var newProcess = new TSOS.ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            newProcess.setBaseAndSize(0x000, decList.length); //put at $000 for proj2
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
        //for proj2: 
        //returns segment 0 if its open
        //returns ERROR CODE if its not open
        //for proj3:
        //idk ill get to it when i get there something like 3 segments and stuff   
        whereIsSpace() {
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
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map