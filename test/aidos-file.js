//
// aidos.js - It's for testing. And enrichment. And uh computer
//

function Glados() {
    this.version = 2112;
 
    this.init = function() {
        //NO ALERT!!!

       //var msg = "Hello [subject name here]. Let's test project TWO.\n";
       //alert(msg);
    };
 
    this.afterStartup = function() {
 
        // Test the 'ver' command.
        _KernelInputQueue.enqueue('v');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('r');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
    
        // format.
        _KernelInputQueue.enqueue('f');
        _KernelInputQueue.enqueue('o');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('m');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create aidan_test1
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('1');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create aidan_test2
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('1');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create aidan_test 3
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('1');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        
        // create 123
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('1');
        _KernelInputQueue.enqueue('2');
        _KernelInputQueue.enqueue('3');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        
    };
}