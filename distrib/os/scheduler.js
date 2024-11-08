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
            this.quantumCounter = 0;
        }
        //given all cpu, memory, scheduler information, tell the dispatcher what to do
        askScheduler() {
            //cpu on/off. quantum expired/safe. queue filled/empty. process terminated/running.
            //all the cases
            if (!_CPU.isExecuting) {
                if (_MemoryManager.readyQueue.isEmpty()) {
                    //idle
                    //_StdOut.putText("/CS");
                    return "IDLE";
                }
                else {
                    //context switch
                    //var nextPCB = _MemoryManager.readyQueue.dequeue();
                    //var nextPID = nextPCB.pid;
                    //_StdOut.putText("/CS");
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
                //_StdOut.putText("Q:"+this.quantumCounter+"/"+this.quantum); //test line
                //quantum safe
                if (this.quantumCounter < this.quantum) {
                    if (_CPU.currentPCB.getState() === "READY" || _CPU.currentPCB.getState() === "RUNNING") {
                        //increment and do the next cycle
                        //_StdOut.putText("/CYCLE");
                        return "CYCLE";
                    }
                    else if (_CPU.currentPCB.getState() === "TERMINATED") {
                        //context switch
                        //_StdOut.putText("/CS");
                        return "CS";
                    }
                }
                //quantum expired
                else {
                    if (_MemoryManager.readyQueue.isEmpty()) {
                        if (_CPU.currentPCB.getState() === "READY" || _CPU.currentPCB.getState() === "RUNNING") {
                            //no context switch
                            //_StdOut.putText("/CYCLE");
                            return "CYCLE";
                        }
                        else if (_CPU.currentPCB.getState() === "TERMINATED") {
                            //stop executing pc
                            //_StdOut.putText("/OFF");
                            return "OFF";
                        }
                    }
                    //something in the ready queue
                    else {
                        //context switch
                        //var nextPCB = _MemoryManager.readyQueue.dequeue();
                        //var nextPID = nextPCB.pid;
                        //_StdOut.putText("/CS");
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