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
        //tell the dispatcher what to do
        askScheduler() {
            //GIVEN:
            //cpu on/off
            //quantum expired/safe
            //queue filled/empty
            //current process terminated/running.
            //all the cases
            if (!_CPU.isExecuting) {
                if (_MemoryManager.readyQueue.isEmpty()) {
                    //idle
                    return "IDLE";
                }
                else {
                    //context switch
                    return "CS";
                }
            }
            //CPU is executing:
            else {
                //quantum safe
                if (this.quantumCounter < this.quantum) {
                    if (_CPU.currentPCB.getState() === "READY" || _CPU.currentPCB.getState() === "RUNNING") {
                        //do the next cycle
                        return "CYCLE";
                    }
                    else if (_CPU.currentPCB.getState() === "TERMINATED") {
                        //context switch
                        return "CS";
                    }
                }
                //quantum expired
                else {
                    if (_MemoryManager.readyQueue.isEmpty()) {
                        if (_CPU.currentPCB.getState() === "READY" || _CPU.currentPCB.getState() === "RUNNING") {
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
                        //context switch
                        return "CS";
                    }
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map