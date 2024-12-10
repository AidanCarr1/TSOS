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
    
        // format
        _KernelInputQueue.enqueue('f');
        _KernelInputQueue.enqueue('o');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('m');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create test1
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('1');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create test2
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('2');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create test3
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('3');
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

        // write test1 "burgers and fries"
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('1');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('"');
        _KernelInputQueue.enqueue('b');
        _KernelInputQueue.enqueue('u');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('g');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('n');
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('f');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('!');
        _KernelInputQueue.enqueue('"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // write test2 "burger"
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('2');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('"');
        _KernelInputQueue.enqueue('b');
        _KernelInputQueue.enqueue('u');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('g');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        
        // write test3 "SODA?"
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('3');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('"');
        _KernelInputQueue.enqueue('S');
        _KernelInputQueue.enqueue('O');
        _KernelInputQueue.enqueue('D');
        _KernelInputQueue.enqueue('A');
        _KernelInputQueue.enqueue('?');
        _KernelInputQueue.enqueue('"');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('x');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

        // create "..."
        _KernelInputQueue.enqueue('c');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('.');
        _KernelInputQueue.enqueue('.');
        _KernelInputQueue.enqueue('.');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
        _KernelInputQueue.enqueue('w');
        _KernelInputQueue.enqueue('r');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('.');
        _KernelInputQueue.enqueue('.');
        _KernelInputQueue.enqueue('.');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('"');
        for (var i = 0; i < 1000; i++) {
            _KernelInputQueue.enqueue('X');
            _KernelInputQueue.enqueue('O');
        }
        _KernelInputQueue.enqueue('"');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);


        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('-');
        _KernelInputQueue.enqueue('a');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
    };
}