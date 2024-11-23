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
            alert("create filename: " + fileName);
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
        writeInuse(key, inuse) {
            var row = sessionStorage.getItem(key);
            var newRow = inuse + row.substring(TSB_INDEX);
            sessionStorage.setItem(key, newRow);
        }
        writeTSB(key, tsb) {
            var row = sessionStorage.getItem(key);
            var newRow = row.substring(INUSE_INDEX, TSB_INDEX) + tsb + row.substring(DATA_INDEX);
            sessionStorage.setItem(key, newRow);
        }
        writeData(key, data) {
            var row = sessionStorage.getItem(key);
            var newRow = row.substring(INUSE_INDEX, DATA_INDEX) + data;
            sessionStorage.setItem(key, newRow);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map