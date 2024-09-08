/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverKeyboard extends TSOS.DeviceDriver {
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
        krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }
        krnKbdDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            // TODO: Check for caps-lock and handle as shifted if so.
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
                }
                else {
                    // Lowercase a-z
                    chr = String.fromCharCode(keyCode + 32);
                }
                //_KernelInputQueue.enqueue(chr);
            }
            //Numbers (top row)
            else if ((keyCode >= 48) && (keyCode <= 57)) {
                if (isShifted === true) {
                    // Special Symbols              0    1    2    3    4    5    6    7    8    9
                    var topRowSymbols = [')', '!', '@', '#', '$', '%', '^', '&', '*', '('];
                    chr = topRowSymbols[keyCode - 48];
                }
                else {
                    // Normal number 0 through 9
                    chr = String.fromCharCode(keyCode);
                }
                //_KernelInputQueue.enqueue(chr);
            }
            //Symbols pt 1
            else if ((keyCode >= 186) && (keyCode <= 192)) {
                if (isShifted === true) {
                    // Top part of key              186  187  188  189  190  191  192 
                    var shiftedSymbols = [':', '+', '<', '_', '>', '?', '~'];
                    chr = shiftedSymbols[keyCode - 186];
                }
                else {
                    // Bottom part of key           186  187  188  189  190  191  192 
                    var symbols = [';', '=', ',', '-', '.', '/', '`'];
                    chr = symbols[keyCode - 186];
                }
                //_KernelInputQueue.enqueue(chr);
            }
            //Symbols pt 2
            else if ((keyCode >= 219) && (keyCode <= 222)) {
                if (isShifted === true) {
                    // Top part of key              219  220   221  222
                    var shiftedSymbols = ['{', '|', '}', "\""];
                    chr = shiftedSymbols[keyCode - 219];
                }
                else {
                    //Bottom part of key            219  220   221  222
                    var symbols = ['[', '\\', ']', "\'"];
                    chr = symbols[keyCode - 219];
                }
                //_KernelInputQueue.enqueue(chr);
            }
            //Non shiftable characters
            else if ((keyCode == 32) || // space
                (keyCode == 13)) { // enter
                chr = String.fromCharCode(keyCode);
                //_KernelInputQueue.enqueue(chr);
            }
            //Backspace
            else if ((keyCode == 8)) {
                //make sure there is at least something in the buffer first
                if (_Console.buffer.length > 0) {
                    //remove final character
                    var removing = _Console.buffer.substring(_Console.buffer.length - 1);
                    _Console.buffer = _Console.buffer.substring(0, _Console.buffer.length - 1);
                    //remove character visually (new function), and move backwards
                    _Console.deleteText(removing);
                }
                return;
            }
            //Tab
            else if ((keyCode == 9)) {
                //make sure there is at least something to complete first
                if (_Console.buffer.length > 0) {
                }
                return;
            }
            //If unknown character, leave before queuing anything
            else {
                return;
            }
            //Queue the character to Kernel input
            _KernelInputQueue.enqueue(chr);
        }
    }
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverKeyboard.js.map