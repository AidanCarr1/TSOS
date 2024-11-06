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
        //given all cpu, memoyr, scheduler information, tell the dispatcher what to do
        checkScheduler() {
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
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map