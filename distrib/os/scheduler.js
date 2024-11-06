/* ------------
     scheduler.ts

     scheduler looks at ready Q
     tells dispatcher
     scheduler counts too (kernel could count if you want)

     ------------ */
var TSOS;
(function (TSOS) {
    class Scheduler {
        quantum;
        quantumCounter;
        constructor(quantum, quantumCounter) {
            this.quantum = quantum;
            this.quantumCounter = quantumCounter;
            //tell the kernel
            _Kernel.krnTrace('Scheduler created');
        }
        init() {
            this.quantum = DEFAULT_QUANTUM;
            this.quantumCounter = 0;
        }
        //setters
        setQuantum(newQuantum) {
            this.quantum = newQuantum;
        }
        //keep track of each cycle for quantum purposes
        count() {
            this.quantumCounter++;
        }
        resetCounter() {
            this.quantum = 0;
        }
        //given all cpu, memory, scheduler information, tell the dispatcher what to do
        askScheduler() {
            //all the cases
            if (!_CPU.isExecuting) {
                if (_MemoryManager.readyQueue.isEmpty()) {
                    //idle
                }
                else {
                    var nextPCB = _MemoryManager.readyQueue.dequeue();
                    var nextPID = nextPCB.pid;
                    if (nextPCB.getState() === "READY") {
                        //context switch
                    }
                    else if (nextPCB.getState() === "TERMINATED") {
                        //dequeue it and context switch?
                    }
                }
            }
            //CPU is executing:
            else {
                //quantum safe
                if (this.quantumCounter < this.quantum) {
                    if (_CPU.currentPCB.getState() === "READY") {
                        //increment and do the next cycle
                    }
                    else if (_CPU.currentPCB.getState() === "TERMINATED") {
                        //dequeue it and context switch?
                    }
                }
                //BOOKMARK
                //quantum reached
                else {
                    if (_MemoryManager.readyQueue.isEmpty()) {
                        if (_CPU.currentPCB.getState() === "READY") {
                            //no context switch
                        }
                        else if (_CPU.currentPCB.getState() === "TERMINATED") {
                            //dequeue and stop executing pc
                        }
                    }
                    //something in the ready queue
                    else {
                    }
                }
                //if something is ready queue
                //if it is terminated
                //if nothing is ready queue
                //no context swithc
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map