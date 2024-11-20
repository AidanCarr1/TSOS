/* ----------------------------------
   DeviceDriverDisk.ts

   The Disk System Device Driver (dsDD)
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            super();
            //this.driverEntry = this.krnDiskDriverEntry;
            //this.isr = this.krnDiskDispatchKeyPress;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnDiskDispatchKeyPress(params) {
            // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
            // TODO: Check for caps-lock and handle as shifted if so.
            var keyCode = params[0];
            var isShifted = params[1];
            var isCtrled = params[2];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted + " ctrl:" + isCtrled);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            
        }
    }
}
