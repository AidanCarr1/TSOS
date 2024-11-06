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

            //given all cpu, memoyr, scheduler information, tell the dispatcher what to do
            public checkScheduler() {

                //all the cases
                //CPU isnt executing:
                
                    //something is in the ready queue
                        //check the state

                        //it is ready
                            //context switch

                        //it is terminated
                            //dequeue it
                            //context switch

                //CPU is exectuing:

                    //quantum is good
                        
                        //is it ready:
                            //increment and do the next cycle

                        //is it terminated
                            //dequeue it
                            //context switch

                    //quantum reached


                        //if something is ready queue

                            //if it is terminated

                        //if nothing is ready queue
                            //no context swithc

            }
        }
    }