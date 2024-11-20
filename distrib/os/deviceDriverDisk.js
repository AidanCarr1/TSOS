/* ----------------------------------
   DeviceDriverDisk.ts

   The Disk System Device Driver (dsDD)
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        constructor() {
            // Override the base method pointers.
            super();
            this.driverEntry = this.krnDiskDriverEntry;
            //this.isr = this.krnDiskDispatchKeyPress;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }
        format() {
            for (var i = 0; i < DISK_SIZE; i++) {
            }
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
        }
        create(fileName) {
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
        }
        read(fileName) {
        }
        write(fileName, fileData) {
        }
        copy(fromName, toName) {
        }
        delete(fileName) {
        }
        rename(oldName, newName) {
        }
        list() {
        }
        writeData() {
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map