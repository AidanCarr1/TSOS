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
            for (var i = 0o000; i < DISK_SIZE; i++) {
                var key = TSOS.Utils.toOct(i, OCT_WORD_SIZE);
                sessionStorage.setItem(key, "00".repeat(BYTES_PER_BLOCK));
                this.resetTSB(i);
            }
            //set Master Boot Record
            //_Kernel.krnTrace(Utils.toHex(1, HEX_WORD_SIZE));
            this.setInuse(0o000, true);
            //create disk display table
            TSOS.Control.createDiskDisplay();
            this.isFormatted = true;
        }
        create(fileName) {
            //add to list of files
            var key = this.addFile(fileName);
            //tell the shell
            if (key != ERROR_CODE) {
                _StdOut.putText("File created: ");
                _StdOut.putText(fileName, FILE_TEXT);
            }
            else {
                _StdOut.putText("Error: Disk full. Too many files in directory", ERROR_TEXT);
            }
        }
        read(fileName) {
            //get key
            var key = this.getKeyByFileName(fileName);
            // if (key === "------") { //shouldn't see this...
            //     _StdOut.putText("!No file found for ");
            //     _StdOut.putText(fileName, FILE_TEXT);
            //     return;
            // }
            //get TSB
            var tsb = this.getTSB(key);
            //no tsb associated = no data
            if (!this.hasTSB(key)) {
                _StdOut.putText("No data in ");
                _StdOut.putText(fileName, FILE_TEXT);
                return;
            }
            else {
                _StdOut.putText("Reading data from ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText(TSOS.Utils.hexToString(this.readLinkedData(tsb)));
            }
            //_StdOut.putText("theres data!");
        }
        write(fileName, fileData) {
            var key = this.getKeyByFileName(fileName);
            //first time writing to file
            if (!this.hasTSB(key)) {
                //find a good tsb
                var tsb = this.findOpenBlock();
                _Kernel.krnTrace("Writing to " + TSOS.Utils.toOct(tsb));
                //set the file directory tsb
                this.setTSB(key, tsb);
            }
            //writing over existing data
            else {
                var tsb = this.getTSB(key);
                _Kernel.krnTrace("Writing over data at " + TSOS.Utils.toOct(tsb));
                //delete the file data
                this.deleteLinkedData(tsb);
            }
            //put in the new data
            this.writeData(tsb, fileData);
            //tell the shell
            _StdOut.putText("Successfully updated ");
            _StdOut.putText(fileName, FILE_TEXT);
            _StdOut.advanceLine();
            _StdOut.putText(TSOS.Utils.hexToString(this.readLinkedData(tsb)));
        }
        copy(fromName, toName) {
        }
        delete(fileName) {
        }
        rename(oldFileName, newFileName) {
            //get key
            var key = this.getKeyByFileName(oldFileName);
            // if (key === "------") { //shouldn't see this...
            //     _StdOut.putText("!No file found for ");
            //     _StdOut.putText(oldFileName, FILE_TEXT);
            //     return;
            // }
            //rename
            this.setData(key, TSOS.Utils.stringToHex(newFileName, BYTES_FOR_DATA * HEX_WORD_SIZE));
            _StdOut.putText("File ");
            _StdOut.putText(oldFileName, FILE_TEXT);
            _StdOut.putText(" renamed to ");
            _StdOut.putText(newFileName, FILE_TEXT);
        }
        list() {
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {
                if (i == 0) {
                    //skip MBR
                }
                else if (this.isInuse(i)) {
                    var fileName = TSOS.Utils.hexToString(this.getData(i));
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
        // given the filename string, return number key 
        getKeyByFileName(fileName) {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                //find used block with same file name
                if (this.isInuse(i) && this.getData(i) === TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA * HEX_WORD_SIZE)) {
                    //return the directory location
                    _Kernel.krnTrace("File found at " + i);
                    return i;
                }
            }
            _Kernel.krnTrace("!file not found");
            return ERROR_CODE;
        }
        //if a file exists with this name, return true
        isAFileName(fileName) {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                //find used block with same file name
                if (this.isInuse(i) && this.getData(i) === TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA * HEX_WORD_SIZE)) {
                    return true;
                }
            }
            return false;
        }
        addFile(fileName) {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                //check until we find an unused block
                if (!this.isInuse(i)) {
                    //set up camp here
                    this.setInuse(i, true);
                    this.resetTSB(i);
                    this.setData(i, TSOS.Utils.stringToHex(fileName, BYTES_FOR_DATA * HEX_WORD_SIZE));
                    //_StdOut.putText(this.getData(i), ERROR_TEXT);
                    //_StdOut.advanceLine();
                    //log it
                    _Kernel.krnTrace("File " + fileName + " saved at key " + i);
                    //return the directory location
                    return i;
                }
            }
            // FILE RECOVERY: loop again, check inuse for recoverable files, over write one
            //no unused blocks left
            return ERROR_CODE;
        }
        // find the first file data block that is not inuse
        findOpenBlock() {
            //loop through directory
            for (var i = DIRECTORY_LENGTH; i < DISK_SIZE; i++) {
                //find used block with same file name
                if (!this.isInuse(i)) {
                    //log it
                    _Kernel.krnTrace("Open line at " + i);
                    return i;
                }
            }
            _Kernel.krnTrace("No space on disk!");
            return ERROR_CODE;
        }
        writeData(startingKey, plainTextData) {
            //convert plaintext to hex                                                      //  100 characters long
            var hexDataLength = plainTextData.length * HEX_WORD_SIZE; //  200
            var numBlocksNeeded = Math.ceil(hexDataLength / (BYTES_FOR_DATA * HEX_WORD_SIZE)); //  1.6 -> 2
            var numBytesNeeded = numBlocksNeeded * BYTES_FOR_DATA; //padding                    120
            var hexData = TSOS.Utils.stringToHex(plainTextData, numBytesNeeded * HEX_WORD_SIZE); //  240
            //_StdOut.putText("chars: " + hexDataLength + ". blocks: "+numBlocksNeeded, ERROR_TEXT);
            //_StdOut.advanceLine();
            var tsb = startingKey;
            var key;
            //each block of data storing
            for (var i = 0; i < numBlocksNeeded; i++) {
                var key = tsb;
                //separate hexData string into block sized pieces (60 bytes)
                var hexDataSeparated = hexData.substring(i * BYTES_FOR_DATA * HEX_WORD_SIZE, (i + 1) * BYTES_FOR_DATA * HEX_WORD_SIZE);
                // _StdOut.putText("{"+Utils.toOct(key)+"}: '"+hexDataSeparated+"'", ERROR_TEXT);
                // _StdOut.advanceLine();
                // _StdOut.putText("Length of part "+i+": "+hexDataSeparated.length, ERROR_TEXT);
                // _StdOut.advanceLine();
                //insert into block
                this.setData(key, hexDataSeparated);
                this.setInuse(key, true);
                //find open block
                tsb = this.findOpenBlock();
                //set the tsb
                this.setTSB(key, tsb);
            }
            //the final block should not have a tsb
            this.setTSB(key, ERROR_CODE);
            //this.setData(tsb, fileData);
            //this.setInuse(tsb, true);
        }
        //given a starting key, set inuse false. Do the same for each tsb linked in chain
        deleteLinkedData(startingKey) {
            //first things first
            var key = startingKey;
            while (this.hasTSB(key)) {
                this.setInuse(key, false);
                key = this.getTSB(key);
                //leaving the tsb and data in place (for recovery)
            }
            //set the final
            this.setInuse(key, false);
        }
        //given a starting key, return the linked data chain in hex string form
        readLinkedData(startingKey) {
            //first things first
            var key = startingKey;
            var hex = "";
            while (this.hasTSB(key)) {
                hex += this.getData(key);
                key = this.getTSB(key);
            }
            //add the final and return
            hex += this.getData(key);
            return hex;
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
            TSOS.Control.updateDiskDisplay(numKey);
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
            TSOS.Control.updateDiskDisplay(numKey);
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
            TSOS.Control.updateDiskDisplay(numKey);
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
        //get tsb as a real number
        getTSB(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //get tsb (as number)
            var block = sessionStorage.getItem(key);
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX); // "010000"      "------"
            var tsbShortStr = TSOS.Utils.keyToHex(tsbLongStr); // "100"         "---"
            return TSOS.Utils.octStringToDecimal(tsbShortStr); // 0o100 or 64   -1
        }
        //get tsb but the short string version
        getTSBString(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //get tsb (as string) 
            var block = sessionStorage.getItem(key);
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX); // "010000"      "------"
            var tsbShortStr = TSOS.Utils.keyToHex(tsbLongStr); // "100"         "---"
            return tsbShortStr;
        }
        //return boolean is key has a tsb
        hasTSB(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //get tsb check if it == "---"
            var block = sessionStorage.getItem(key);
            //probably wrong here!
            return block.substring(TSB_INDEX, DATA_INDEX) !== "------";
        }
        //return data given a key
        getData(numKey) {
            //string key
            var key = TSOS.Utils.toOct(numKey, OCT_WORD_SIZE);
            //return data
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }
    }
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverDisk.js.map