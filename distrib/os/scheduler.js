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
            this.quantumCounter = 0; // or 1
        }
        //setters
        setQuantum(newQuantum) {
            this.quantum = newQuantum;
        }
        //keep track of each cycle for quantum purposes
        count() {
            this.quantumCounter++;
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map