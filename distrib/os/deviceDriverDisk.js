/* ----------------------------------
   DeviceDriverDisk.ts

   The Disk System Device Driver (dsDD)
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    class DeviceDriverDisk extends TSOS.DeviceDriver {
        isFormatted;
        constructor(isFormatted) {
            // Override the base method pointers.
            super();
            this.isFormatted = isFormatted;
            //this.isr = this.krnDiskDispatchKeyPress;
            this.driverEntry = this.krnDiskDriverEntry;
            this.isFormatted = false;
        }
        krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }
        format() {
            for (var i = 0; i < DISK_SIZE; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                sessionStorage.setItem(key, "00".repeat(BYTES_PER_BLOCK));
                this.resetTSB(key);
            }
            //set Master Boot Record
            _Kernel.krnTrace(TSOS.Utils.toHex(1, HEX_WORD_SIZE));
            this.setInuse("000", true);
            //create disk display table
            TSOS.Control.createDiskDisplay();
            this.isFormatted = true;
        }
        create(fileName) {
            //add to list of files
            this.addFile(fileName);
            //tell the shell
            _StdOut.putText("File created: " + fileName);
        }
        read(fileName) {
            //get key
            var key = this.getKeyByFileName(fileName);
            if (key === "------") {
                _StdOut.putText("No file found for " + fileName);
                return;
            }
            //get TSB
            var tsb = this.getTSB(key);
            if (tsb === "------") {
                _StdOut.putText("Not data in " + fileName);
                return;
            }
            _StdOut.putText("theres data!");
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
        // FUNCTIONAL FUNCTIONS
        // check filename length and characters
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
                //is this character allowed?
                if ((charCode >= TSOS.Utils.charToNum("A") && charCode <= TSOS.Utils.charToNum("Z")) ||
                    //capital is fine
                    (charCode >= TSOS.Utils.charToNum("a") && charCode <= TSOS.Utils.charToNum("z")) ||
                    //lowercase is fine
                    (charCode >= TSOS.Utils.charToNum("0") && charCode <= TSOS.Utils.charToNum("9")) ||
                    //numbers is fine
                    (charCode == TSOS.Utils.charToNum(".") || charCode == TSOS.Utils.charToNum("_"))) {
                    //underscore or period is fine
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
        // given the filename string, return key
        getKeyByFileName(fileName) {
            //loop through directory
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                //find used block with same file name
                if (this.isInuse(key) && this.getData(key) === TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA)) {
                    //log it
                    _Kernel.krnTrace("the file is at " + key);
                    //update disk display
                    return key;
                }
            }
            _Kernel.krnTrace("file not found");
            return "------";
        }
        addFile(fileName) {
            //loop through directory
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {
                //check until we find an unused block
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                if (this.getInuse(key) == TSOS.Utils.toHex(0, HEX_WORD_SIZE)) {
                    //set up camp here
                    this.setInuse(key, true);
                    this.resetTSB(key);
                    this.setData(key, TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA));
                    //log it
                    _Kernel.krnTrace("File " + fileName + " saved at key " + key);
                    //update disk display
                    return key;
                }
            }
            // FILE RECOVERY: loop again, check inuse for recoverable files, over write one
            //no unused blocks left
            _StdOut.putText("Disk Full. Too many files in directory");
        }
        // SET FUNCTIONS
        setInuse(key, inuse) {
            var inuseHex = TSOS.Utils.toHex(0, HEX_WORD_SIZE);
            if (inuse) {
                inuseHex = TSOS.Utils.toHex(1, HEX_WORD_SIZE);
            }
            //_Kernel.krnTrace("setting in use");
            var block = sessionStorage.getItem(key);
            var newBlock = inuseHex + block.substring(TSB_INDEX);
            //_Kernel.krnTrace("new block "+newBlock);
            sessionStorage.setItem(key, newBlock);
            //_Kernel.krnTrace("set in use");
            TSOS.Control.updateDiskDisplay(key);
        }
        setTSB(key, tsb) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock);
            TSOS.Control.updateDiskDisplay(key);
        }
        resetTSB(key) {
            var block = sessionStorage.getItem(key);
            // "------"
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + "------" /*Utils.toHex(ERROR_CODE, HEX_WORD_SIZE).repeat(OCT_WORD_SIZE)*/ + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock);
            TSOS.Control.updateDiskDisplay(key);
        }
        setData(key, data) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + data;
            sessionStorage.setItem(key, newBlock);
            TSOS.Control.updateDiskDisplay(key);
        }
        // GET FUNCTIONS
        getInuse(key) {
            var block = sessionStorage.getItem(key);
            return block.substring(INUSE_INDEX, TSB_INDEX);
        }
        isInuse(key) {
            var block = sessionStorage.getItem(key);
            // true == 01
            // false == 00
            return block.substring(INUSE_INDEX, TSB_INDEX) == TSOS.Utils.toHex(1, HEX_WORD_SIZE);
        }
        getTSB(key) {
            var block = sessionStorage.getItem(key);
            return block.substring(TSB_INDEX, DATA_INDEX);
        }
        getData(key) {
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map