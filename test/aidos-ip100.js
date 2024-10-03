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
 
       // Test 'help' command.
       _KernelInputQueue.enqueue('h');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('l');
       _KernelInputQueue.enqueue('p');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       // Test the 'palindrom' command.
       _KernelInputQueue.enqueue('p');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('l');
       _KernelInputQueue.enqueue('i');
       _KernelInputQueue.enqueue('n');
       _KernelInputQueue.enqueue('d');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('o');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue(' ');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('c');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue(' ');
       _KernelInputQueue.enqueue('C');
       _KernelInputQueue.enqueue('A');
       _KernelInputQueue.enqueue('R');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

       // Test the 'ver' command.
       _KernelInputQueue.enqueue('v');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       // Test the 'date' command.
       _KernelInputQueue.enqueue('d');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('t');
       _KernelInputQueue.enqueue('e');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       // Test the 'whereami' command many times.
       _KernelInputQueue.enqueue('w');
       _KernelInputQueue.enqueue('h');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('i');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       // Test the 'whereami' command again.
       _KernelInputQueue.enqueue('w');
       _KernelInputQueue.enqueue('h');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('i');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       // Test the 'whereami' command one more time.
       _KernelInputQueue.enqueue('w');
       _KernelInputQueue.enqueue('h');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('i');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       // Use the 'status' command to give the expected output of the program below.
         var str = "StaTUs H3Y it's AIDAN! lets test this? (b@d words coming)";
         for (var i = 0; i < str.length; i++) {
             _KernelInputQueue.enqueue(str[i]);
         }

       //woah many enters looks nicer
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);  
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
         
       // Load a valid user program code and run it.
       var code = "A9 10 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 ff EE 40 00 AE 40 00 EC 41 00 D0 " +
                  "EF A9 55 8D 42 00 A9 43 8D 43 00 A9 4B 8D 44 00 A9 00 8D 46 00 " +
                  "A2 02 A0 42 EaeaeaeaeaeA ff 00";	   
       document.getElementById("taProgramInput").value = code;
    };
 }
 