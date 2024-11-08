/* ------------
     scheduler.ts

     scheduler looks at ready Q
     tells dispatcher
     scheduler counts too (kernel could count if you want)

     ------------ */

module TSOS {

    export class Scheduler {
    
        constructor(public quantum?: number,
                    public quantumCounter?: number ) { 
                        
            //tell the kernel
            _Kernel.krnTrace('Scheduler created');
        }

        public init(){
            this.quantum = DEFAULT_QUANTUM;
            this.quantumCounter = 0; 
        }

        //setters
        public setQuantum(newQuantum: number) {
            this.quantum = newQuantum;
        }

        //keep track of each cycle for quantum purposes
        public count() {
            this.quantumCounter ++;
        }
        public resetCounter() {
            this.quantum = 0;
        }

        //given all cpu, memory, scheduler information, tell the dispatcher what to do
        public askScheduler() {

            //cpu on/off. quantum expired/safe. queue filled/empty. process terminated/running.

            //all the cases
            if (!_CPU.isExecuting) {

                if (_MemoryManager.readyQueue.isEmpty()) {
                    //idle
                    return "IDLE";
                }
                else {
                    //context switch
                    //var nextPCB = _MemoryManager.readyQueue.dequeue();
                    //var nextPID = nextPCB.pid;
                    alert("CS");
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
                        alert("CYCLE");
                        return "CYCLE";
                    }
                    else if (_CPU.currentPCB.getState() === "TERMINATED") {
                        //context switch
                        alert("CS");
                        return "CS";
                    }
                }  

                //quantum expired
                else {
                    if (_MemoryManager.readyQueue.isEmpty()) {

                        if (_CPU.currentPCB.getState() === "READY") {
                            //no context switch
                            alert("CYCLE");
                            return "CYCLE";
                        }
                        else if (_CPU.currentPCB.getState() === "TERMINATED") {
                            //stop executing pc
                            alert("OFF");
                            return "OFF";
                        }
                    }
                    //something in the ready queue
                    else {
                        //context switch
                        //var nextPCB = _MemoryManager.readyQueue.dequeue();
                        //var nextPID = nextPCB.pid;
                        alert("CS");
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
}