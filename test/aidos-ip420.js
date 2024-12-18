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
    
        // Test the 'date' command.
        _KernelInputQueue.enqueue('d');
        _KernelInputQueue.enqueue('a');
        _KernelInputQueue.enqueue('t');
        _KernelInputQueue.enqueue('e');
        TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);
    
    
        // Load THREE (slightly different) valid user programs code and run them. The differences are . . .                                          . . .                                        here                                                        . . .                                                                                                                                   . . . and here.
        var code1 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 03 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 61 00 61 64 6F 6E 65 00";
        var code2 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 06 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 62 00 62 64 6F 6E 65 00";
        var code3 = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 09 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 63 00 63 64 6F 6E 65 00";

        /*
        Approximate Turnaround Time and Wait Time values, +/- 1 quantum (6 cycles)
        Process 0 - Turnaround Time = 366 cycles, Wait Time = 240 cycles
        Process 1 - Turnaround Time = 570 cycles, Wait Time = 348 cycles
        Process 2 - Turnaround Time = 666 cycles, Wait Time = 348 cycles     
        */

        setTimeout(function(){ document.getElementById("taProgramInput").value = code1;
                    _KernelInputQueue.enqueue('l');
                    _KernelInputQueue.enqueue('o');
                    _KernelInputQueue.enqueue('a');
                    _KernelInputQueue.enqueue('d');
                    TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                }, 500);

        setTimeout(function(){ document.getElementById("taProgramInput").value = code2;
                    _KernelInputQueue.enqueue('l');
                    _KernelInputQueue.enqueue('o');
                    _KernelInputQueue.enqueue('a');
                    _KernelInputQueue.enqueue('d');
                    TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                }, 1000);

        setTimeout(function(){ document.getElementById("taProgramInput").value = code3;
                    _KernelInputQueue.enqueue('l');
                    _KernelInputQueue.enqueue('o');
                    _KernelInputQueue.enqueue('a');
                    _KernelInputQueue.enqueue('d');
                    TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);           	   				
                }, 1500);
    }
}