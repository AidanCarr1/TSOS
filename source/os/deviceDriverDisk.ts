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
            this.driverEntry = this.krnDiskDriverEntry;
            //this.isr = this.krnDiskDispatchKeyPress;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }

        public format() {
            for (var i = 0; i < DISK_SIZE; i++) {
                
            }
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
        }

        public create(fileName: string) {
            alert("create filename: " + fileName);
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
        }

        public read(fileName: string) {

        }

        public write(fileName: string, fileData: string) {

        }

        public copy(fromName: string, toName: string) {

        }

        public delete(fileName: string) {

        }

        public rename(oldName: string, newName: string) {

        }

        public list() {

        }

        private writeData(key: string, data: string) {

            var wrtingData = "1" + ERROR_CODE + ERROR_CODE + ERROR_CODE + "";
            for (var i = 0; i < data.length; i++) {
                var char = data[i];
                var num = char.charCodeAt(0);
                var hex = Utils.toHex(num);
            }
            sessionStorage.setItem(key, 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
            
        }



        // public krnDiskDispatchKeyPress(params) {
        //     // Parse the params.  TODO: Check that the params are valid and osTrapError if not.
        //     // TODO: Check for caps-lock and handle as shifted if so.
        //     var keyCode = params[0];
        //     var isShifted = params[1];
        //     var isCtrled = params[2];
        //     _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted + " ctrl:" + isCtrled);
        //     var chr = "";
        //     // Check to see if we even want to deal with the key that was pressed.
            
        // }
    }
}
