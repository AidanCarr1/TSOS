//
// glados.js - It's for testing. And enrichment.
//

function Glados() {
    this.version = 2112;
 
    this.init = function() {
       //var msg = "Hello [subject name here]. Let's test our FINAL PROJECT (woot woot woot woot).\n";
       //alert(msg);
    };
 
    this.afterStartup = function() {
 
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
 
       // Test the 'whereami' command.
       _KernelInputQueue.enqueue('w');
       _KernelInputQueue.enqueue('h');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('i');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
       // Format the hard drive so we can load FOUR or more programs.
       _KernelInputQueue.enqueue('f');
       _KernelInputQueue.enqueue('o');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('m');
       _KernelInputQueue.enqueue('a');
       _KernelInputQueue.enqueue('t');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
 
 
       // Load FOUR different valid user programs code and run them.                                                                                                           . . . and here.
       var code1 = "A9 00 A9 01 A9 02 A9 03 A9 04 A9 05 A9 06 A9 07 A9 08 A9 09   A9 00 A9 01 A9 02 A9 03 A9 04 A9 05 A9 06 A9 07 A9 08 A9 09   A9 00 A9 01 A9 02 A9 03 A9 04 A9 05 A9 06 A9 07 A9 08 A9 09 00";
       var code2 = "A9 10 A9 11 A9 12 A9 13 A9 14 A9 15 A9 16 A9 17 A9 18 A9 19   A9 10 A9 11 A9 12 A9 13 A9 14 A9 15 A9 16 A9 17 A9 18 A9 19   A9 10 A9 11 A9 12 A9 13 A9 14 A9 15 A9 16 A9 17 A9 18 A9 19 00";
       var code3 = "A9 20 A9 21 A9 22 A9 23 A9 24 A9 25 A9 26 A9 27 A9 28 A9 29   A9 20 A9 21 A9 22 A9 23 A9 24 A9 25 A9 26 A9 27 A9 28 A9 29   A9 20 A9 21 A9 22 A9 23 A9 24 A9 25 A9 26 A9 27 A9 28 A9 29 00";
       var code4 = "A9 30 A9 31 A9 32 A9 33 A9 34 A9 35 A9 36 A9 37 A9 38 A9 39   A9 30 A9 31 A9 32 A9 33 A9 34 A9 35 A9 36 A9 37 A9 38 A9 39   A9 30 A9 31 A9 32 A9 33 A9 34 A9 35 A9 36 A9 37 A9 38 A9 39 00";
 
         setTimeout(function(){ document.getElementById("taProgramInput").value = code1;
                                      _KernelInputQueue.enqueue('l');
                                      _KernelInputQueue.enqueue('o');
                                      _KernelInputQueue.enqueue('a');
                                      _KernelInputQueue.enqueue('d');
                                      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                                     }, 1000);
 
         setTimeout(function(){ document.getElementById("taProgramInput").value = code2;
                                      _KernelInputQueue.enqueue('l');
                                      _KernelInputQueue.enqueue('o');
                                      _KernelInputQueue.enqueue('a');
                                      _KernelInputQueue.enqueue('d');
                                      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                                     }, 2000);
 
         setTimeout(function(){ document.getElementById("taProgramInput").value = code3;
                                      _KernelInputQueue.enqueue('l');
                                      _KernelInputQueue.enqueue('o');
                                      _KernelInputQueue.enqueue('a');
                                      _KernelInputQueue.enqueue('d');
                                      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                                     }, 3000);
 
         setTimeout(function(){ document.getElementById("taProgramInput").value = code4;
                                      _KernelInputQueue.enqueue('l');
                                      _KernelInputQueue.enqueue('o');
                                      _KernelInputQueue.enqueue('a');
                                      _KernelInputQueue.enqueue('d');
                                      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                                     }, 3000);
 
         setTimeout(function(){ _KernelInputQueue.enqueue('r');
                                      _KernelInputQueue.enqueue('u');
                                      _KernelInputQueue.enqueue('n');
                                      _KernelInputQueue.enqueue('a');
                                      _KernelInputQueue.enqueue('l');      
                                      _KernelInputQueue.enqueue('l');            
                                      TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);		
                                     }, 4000);
 
        // Remind myself to test the file system.
        _KernelInputQueue.enqueue('S');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('A');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('U');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('T');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('h');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('f');
        _KernelInputQueue.enqueue('i');
        _KernelInputQueue.enqueue('l');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue(' ');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('y');
        _KernelInputQueue.enqueue('s');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        _KernelInputQueue.enqueue('m');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
    };
         
 }
 