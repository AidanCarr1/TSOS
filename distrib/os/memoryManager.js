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
            _StdOut.putText(" gonna be made~"); //test
            //create a PCB object
            var //newProcess: ProcessControlBlock = null;
            newProcess = new TSOS.ProcessControlBlock();
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
            this.pidCounter++;
            //give pid value 
            return newProcess.pid;
        }
        //return the pcb object given the pcb's pid
        getProcessByPID(pid) {
            return this.pcbList[pid];
        }
        //is this a necessary function?
        //i think this will change into cpu switching process function
        //to switch ALL registers
        getStartingMemory(pid) {
            return 0; //temporary
            //return this.startingLocations[pid];
            //FIX:
            // take pid, search through array of PCBs
            // check each pid value until found
            // reutn that PID's starting memory
        }
        //if pid cannot be found, return false
        isValid(pid) {
            if (pid >= this.pidCounter || pid < 0) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map