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
            this.quantumCounter = 0;
        }

        //tell the dispatcher what to do based on a few things...
        public askScheduler() {

            //TAKE INTO ACCOUNT:
            //cpu on/off
            //quantum expired/safe
            //queue filled/empty
            //current process terminated/running.

            //CPU is off:
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
                            //reset quantum
                            //no context switch, do next cycle
                            return "QCYCLE";
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
}