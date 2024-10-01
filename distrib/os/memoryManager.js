/* ------------
     memoryManager.ts

     this class should store pid and its starting position
     also maybe something with pcb?
     ------------ */
var TSOS;
(function (TSOS) {
    class ProcessControlBlock {
        pid;
        state;
        base;
        size;
        processPC;
        processAcc;
        processXreg;
        processYreg;
        processZflag;
        processIR;
        constructor(pid, state, base, //first memory location
        size, //length in bytes
        //saved cpu registers:
        processPC, processAcc, processXreg, //ALL THES QUESTION MARKS
        processYreg, //IDK HOW TO FIX THIS
        processZflag, //DIDNT NEED FOR OTHER CONSTRUCTORS...
        processIR) {
            this.pid = pid;
            this.state = state;
            this.base = base;
            this.size = size;
            this.processPC = processPC;
            this.processAcc = processAcc;
            this.processXreg = processXreg;
            this.processYreg = processYreg;
            this.processZflag = processZflag;
            this.processIR = processIR;
            //tell the kernel
            _Kernel.krnTrace('PCB created');
        }
        initRegisters() {
            //registers set to 0
            this.processPC = 0x00; //always start at the first location
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }
        //setters
        setPID(pid) {
            this.pid = pid;
        }
        setState(state) {
            this.state = state;
        }
        setBaseAndSize(base, size) {
            this.base = base;
            this.size = size;
        }
    }
    TSOS.ProcessControlBlock = ProcessControlBlock;
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
            var newProcess = new ProcessControlBlock();
            newProcess.initRegisters();
            newProcess.setPID(this.pidCounter);
            newProcess.setState("RESIDENT");
            newProcess.setBaseAndSize(0x0000, decList.length); //put at $0000 for proj2
            //let memory manager know about the PCB
            this.readyQueue.enqueue(newProcess);
            this.pcbList.push(newProcess);
            //thats one more PCB!
            this.pidCounter++;
            //give pid value before it was incremented 
            return (newProcess.pid);
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