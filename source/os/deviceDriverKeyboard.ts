/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            //Letters
            if ((keyCode >= 65) && (keyCode <= 90)) {
                if (isShifted === true) {
                    // Uppercase A-Z 
                    chr = String.fromCharCode(keyCode); 
                } else {
                    // Lowercase a-z
                    chr = String.fromCharCode(keyCode + 32); 
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } 
            
            //Numbers (top row)
            else if ((keyCode >= 48) && (keyCode <= 57)) { 
                if (isShifted === true) {
                    // Special Symbols 
                    var topRowSymbols: string[] = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
                    chr = topRowSymbols[keyCode-48]; 
                } else {
                    // Normal number
                    chr = String.fromCharCode(keyCode); 
                }
                _KernelInputQueue.enqueue(chr);
            } 
            
            //Non shiftable characters
            else if (   (keyCode == 32)     ||  // space
                        (keyCode == 13))    {   // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
