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
            _StdOut.putText("File created: ");
            _StdOut.putText(fileName, FILE_TEXT);
        }
        read(fileName) {
            //get key
            var key = this.getKeyByFileName(fileName);
            if (key === "------") { //shouldn't see this...
                _StdOut.putText("!No file found for ");
                _StdOut.putText(fileName, FILE_TEXT);
                return;
            }
            //get TSB
            var tsb = this.getTSB(key);
            //no tsb associated = no data
            if (!this.hasTSB(key)) {
                _StdOut.putText("Not data in ");
                _StdOut.putText(fileName, FILE_TEXT);
                return;
            }
            else {
                _StdOut.putText(this.getData(tsb));
            }
            _StdOut.putText("theres data!");
        }
        write(fileName, fileData) {
            var key = this.getKeyByFileName(fileName);
            //first time writing to file
            if (!this.hasTSB(key)) {
                var tsb = this.findOpenBlock();
                _StdOut.putText("writing to " + tsb);
                this.setTSB(key, tsb);
                //only supports one line for now!
                this.setData(tsb, fileData);
            }
            //writing over existing data
            else {
                var tsb = this.getTSB(key);
                _StdOut.putText("writing over data at " + tsb);
                this.setData(tsb, fileData);
            }
        }
        copy(fromName, toName) {
        }
        delete(fileName) {
        }
        rename(oldFileName, newFileName) {
            //get key
            var key = this.getKeyByFileName(oldFileName);
            if (key === "------") { //shouldn't see this...
                _StdOut.putText("!No file found for ");
                _StdOut.putText(oldFileName, FILE_TEXT);
                return;
            }
            //rename
            this.setData(key, TSOS.Utils.stringToHex(newFileName, BYTES_FOR_DATA));
            _StdOut.putText("File ");
            _StdOut.putText(oldFileName, FILE_TEXT);
            _StdOut.putText(" renamed to ");
            _StdOut.putText(newFileName, FILE_TEXT);
        }
        list() {
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                if (i == 0) {
                    //skip MBR
                }
                else if (this.isInuse(key)) {
                    var fileName = TSOS.Utils.hexToString(this.getData(key));
                    _StdOut.putText("  " + fileName, FILE_TEXT);
                    _StdOut.advanceLine();
                }
            }
        }
        // FUNCTIONAL FUNCTIONS
        // check filename length and characters
        isValidFileName(fileName) {
            //check length
            if (fileName.length > MAX_FILE_NAME_SIZE) {
                _StdOut.putText("Error: filename too long, file not created.", ERROR_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText("Maximum filename length is " + MAX_FILE_NAME_SIZE + " characters.");
                return false;
            }
            //already a file
            if (this.isAFileName(fileName)) {
                _StdOut.putText("Error: A file already exists as ", ERROR_TEXT);
                _StdOut.putText(fileName, FILE_TEXT);
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
                    _StdOut.putText("Error: invalid filename, file not created.", ERROR_TEXT);
                    _StdOut.advanceLine();
                    _StdOut.putText("Please only use letters, numbers, and underscore.");
                    return false;
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
        //if a file exists with this name, return true
        isAFileName(fileName) {
            //loop through directory
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                //find used block with same file name
                if (this.isInuse(key) && this.getData(key) === TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA)) {
                    return true;
                }
            }
            return false;
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
        // find the first file data block that is not inuse
        findOpenBlock() {
            //loop through directory
            for (var i = DIRECTORY_LENGTH; i < DISK_SIZE; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                //find used block with same file name
                if (!this.isInuse(key)) {
                    //log it
                    _Kernel.krnTrace("Open line at " + key);
                    return key;
                }
            }
            _Kernel.krnTrace("No space on disk!");
            return "------";
        }
        // SET FUNCTIONS
        //set inuse for a key given true/false
        setInuse(numKey, inuse) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //write inuse hex
            var inuseHex = TSOS.Utils.toHex(0, HEX_WORD_SIZE);
            if (inuse) {
                inuseHex = TSOS.Utils.toHex(1, HEX_WORD_SIZE);
            }
            //set inuse hex
            var block = sessionStorage.getItem(key);
            var newBlock = inuseHex + block.substring(TSB_INDEX);
            sessionStorage.setItem(key, newBlock);
            //update display
            TSOS.Control.updateDiskDisplay(key);
        }
        //set tsb for a key given tsb
        setTSB(numKey, numTsb) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //hex tsb
            //0o100 -> "100" 
            var strTsb = TSOS.Utils.toOct(numTsb, OCT_WORD_SIZE);
            //"100" -> "010000"
            var tsb = TSOS.Utils.keyToLongHex(strTsb);
            //set tsb hex
            var block = sessionStorage.getItem(key);
            //alert(block);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            //alert(newBlock);
            sessionStorage.setItem(key, newBlock);
            //update display
            TSOS.Control.updateDiskDisplay(key);
        }
        //set t,s,b to -1,-1,-1
        resetTSB(numKey) {
            this.setTSB(numKey, ERROR_CODE);
        }
        //set data for a key
        setData(numKey, hexData) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //set data
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + hexData;
            sessionStorage.setItem(key, newBlock);
            //update display
            TSOS.Control.updateDiskDisplay(key);
        }
        // GET FUNCTIONS
        // public getInuse(key: string): string {
        //     var block = sessionStorage.getItem(key);
        //     return block.substring(INUSE_INDEX, TSB_INDEX);
        // }
        //get boolean for in use
        isInuse(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //get boolean, is it in use
            var block = sessionStorage.getItem(key);
            // true == 01, false == 00
            return block.substring(INUSE_INDEX, TSB_INDEX) == TSOS.Utils.toHex(1, HEX_WORD_SIZE);
        }
        //get tsb
        getTSB(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //get tsb (as number)
            var block = sessionStorage.getItem(key);
            //"010000"
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX);
            //"010000" -> "100"
            var tsbShortStr = TSOS.Utils.keyToHex(tsbLongStr);
            //"100" -> 0o100 or 64
            return TSOS.Utils.octStringToDecimal(tsbShortStr);
        }
        hasTSB(key) {
            var block = sessionStorage.getItem(key);
            return block.substring(TSB_INDEX, DATA_INDEX) !== "------";
        }
        getData(key) {
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map