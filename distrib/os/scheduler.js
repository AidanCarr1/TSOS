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
            //cpu on/off. quantum expired/safe. queue filled/empty. process terminated/running.
            //all the cases
            if (!_CPU.isExecuting) {
                if (_MemoryManager.readyQueue.isEmpty()) {
                    //idle
                    return "IDLE";
                }
                else {
                    var nextPCB = _MemoryManager.readyQueue.dequeue();
                    var nextPID = nextPCB.pid;
                    return "CS";
                    /*
                    if (nextPCB.getState() === "READY") {
                        //context switch
                        return "CXS";
                    }
                    else if (nextPCB.getState() === "TERMINATED") {
                        //dequeue it and context switch?
                        return "DQ,CXS";
                    } */
                }
            }
            //CPU is executing:
            else {
                //quantum safe
                if (this.quantumCounter < this.quantum) {
                    if (_CPU.currentPCB.getState() === "READY") {
                        //increment and do the next cycle
                        return "CYCLE";
                    }
                    else if (_CPU.currentPCB.getState() === "TERMINATED") {
                        //dequeue it and context switch?
                        return "DQ,CS";
                    }
                }
                //quantum expired
                else {
                    if (_MemoryManager.readyQueue.isEmpty()) {
                        if (_CPU.currentPCB.getState() === "READY") {
                            //no context switch
                            return "CYCLE";
                        }
                        else if (_CPU.currentPCB.getState() === "TERMINATED") {
                            //stop executing pc
                            return "OFF";
                        }
                    }
                    //something in the ready queue
                    else {
                        var nextPCB = _MemoryManager.readyQueue.dequeue();
                        var nextPID = nextPCB.pid;
                        return "CS";
                        /*
                        if (nextPCB.getState() === "READY") {
                            //context switch
                            return "CS";
                        }
                        else if (nextPCB.getState() === "TERMINATED") {
                            //context swithc back to the running
                            return "CS";
                        }*/
                    }
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map