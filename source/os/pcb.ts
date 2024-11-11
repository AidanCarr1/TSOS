/* ------------
     pcb.ts

     process control block
     stores a given pcb with its state, registers, sizes... everything!
     ------------ */

module TSOS {
    
    export class ProcessControlBlock {
    
        constructor(public pid?: number,              
                    public state?: string,
                    public priority?: number,

                    //memory location
                    public base?: number,    //first memory location
                    public limit?: number,   //last memory location
                    public segment?: number, //will be changing 
                    public location?: string,

                    //saved cpu registers:
                    public processPC?: number,       
                    public processAcc?: number,
                    public processXreg?: number,    
                    public processYreg?: number,    
                    public processZflag?: number,
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
            //but just in case:
            this.processIR = 0x00; 

            //not a register, but not really used yet
            this.state = "RESIDENT";
            this.priority = DEFAULT_PRIORITY;
        }

        //setters
        public setPID(pid: number) {
            this.pid = pid;
        }
        public setState(state: string) {
            this.state = state;
            _Kernel.krnTrace('PID ' + this.pid + ' set to ' + this.state);
            Control.updatePCBDisplay(this);
        }
        public setSegment(segment: number) {
            this.segment = segment;

            //set segment in eyes of memory manager
            _MemoryManager.segmentList[segment] = this;

            //also sets the base and limit
            var base = this.getBase();      //0->0x000 1->0x100 2->0x200
            var limit = this.getLimit();    //0->0x0FF 1->0x1FF 2->0x2FF

            //might change later
            this.location = "Memory";
        }

        //getters
        public getBase() {
            this.base = SEGMENT_SIZE * this.segment;
            return this.base;
        }
        public getLimit() {
            this.base = this.base + SEGMENT_SIZE - 0x01;
            return this.base;
        }
        public getState() {
            return this.state;
        }
        public getSegment() {
            return this.segment;
        }
    }
}