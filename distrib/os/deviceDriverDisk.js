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
            //alert("create filename: " + fileName);
            _StdOut.putText("File created: " + fileName);
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
        isValidFileName(fileName) {
            //check length
            if (fileName.length > MAX_FILE_NAME_SIZE) {
                _StdOut.putText("Error creating file: filename too long.");
                _StdOut.advanceLine();
                _StdOut.putText("Maximum filename length is " + MAX_FILE_NAME_SIZE + " characters.");
                return false;
            }
            //go through each character in filename
            for (var i = 0; i < fileName.length; i++) {
                var charCode = TSOS.Utils.charToNum(fileName[i]);
                //_StdOut.putText("char"+charCode);
                //is this character allowed?
                if ((charCode >= TSOS.Utils.charToNum("A") && charCode <= TSOS.Utils.charToNum("Z")) ||
                    //capital is fine
                    (charCode >= TSOS.Utils.charToNum("a") && charCode <= TSOS.Utils.charToNum("z")) ||
                    //lowercase is fine
                    (charCode >= TSOS.Utils.charToNum("0") && charCode <= TSOS.Utils.charToNum("9")) ||
                    //numbers is fine
                    (charCode == TSOS.Utils.charToNum("_"))) {
                    //underscore is fine
                    //its good, next character
                }
                else {
                    _StdOut.putText("Error creating file: Invalid filename.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please only use letters, numbers, and underscore.");
                    return;
                }
            }
            //passed tests
            return true;
        }
        writeInuse(key, inuse) {
            var block = sessionStorage.getItem(key);
            var newBlock = inuse + block.substring(TSB_INDEX);
            sessionStorage.setItem(key, newBlock);
        }
        writeTSB(key, tsb) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock);
        }
        writeData(key, data) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + data;
            sessionStorage.setItem(key, newBlock);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map