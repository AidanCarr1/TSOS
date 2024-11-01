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
                this.quantumCounter = 0; // or 1
            }
    
            //setters
            public setQuantum(newQuantum: number) {
                this.quantum = newQuantum;
            }
    
            //keep track of each cycle for quantum purposes
            public count() {
                this.quantumCounter ++;
            }
            
        }
    }