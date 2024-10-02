/* ------------
     pcb.ts

     process control block
     stores a given pcb with its state, registers, sizes... everything!
     ------------ */

module TSOS {
    
    export class ProcessControlBlock {
    
        constructor(public pid?: number,              
                    public state?: string,
                    public base?: number,    //first memory location
                    public size?: number,    //length in bytes

                    //saved cpu registers:
                    public processPC?: number,       
                    public processAcc?: number,
                    public processXreg?: number,    //ALL THES QUESTION MARKS
                    public processYreg?: number,    //IDK HOW TO FIX THIS
                    public processZflag?: number,   //DIDNT NEED FOR OTHER CONSTRUCTORS...
                    public processIR?: number ) { 
                        
            //tell the kernel
            _Kernel.krnTrace('PCB created');
        }

        public initRegisters(){
            //registers set to 0
            this.processPC = 0x00; //always start at the first location
            this.processAcc = 0;
            this.processXreg = 0;
            this.processYreg = 0;
            this.processZflag = 0;
            //processIR will ~eventually~ be set when running and saving the state
        }

        //setters
        public setPID(pid: number) {
            this.pid = pid;
        }
        public setState(state: string) {
            this.state = state;
        }
        public setBaseAndSize(base: number, size: number){
            this.base = base;
            this.size = size;
        }
    }
}