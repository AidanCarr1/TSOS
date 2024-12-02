/* ----------------------------------
   DeviceDriverDisk.ts

   The Disk System Device Driver (dsDD)
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {

        constructor(public isFormatted?: boolean) {
            // Override the base method pointers.

            super();
            //this.isr = this.krnDiskDispatchKeyPress;

            this.driverEntry = this.krnDiskDriverEntry;
            this.isFormatted = false;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }

        public format() {
            for (var i = 0o000; i < DISK_SIZE; i++) {
                var key = Utils.toOct(i, OCT_WORD_SIZE);
                sessionStorage.setItem(key, "00".repeat(BYTES_PER_BLOCK));

                this.resetTSB(i);
            }

            //set Master Boot Record
            //_Kernel.krnTrace(Utils.toHex(1, HEX_WORD_SIZE));
            this.setInuse(0o000, true);

            //create disk display table
            Control.createDiskDisplay();
            this.isFormatted = true;
        }

        public create(fileName: string) {
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

        public read(fileName: string) {
            
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
                _StdOut.putText("Not data in ");
                _StdOut.putText(fileName, FILE_TEXT);
                return;
            }

            else {
                _StdOut.putText(this.getData(tsb));
            }

            _StdOut.putText("theres data!");
        }

        public write(fileName: string, fileData: string) {
            var key = this.getKeyByFileName(fileName);

            //first time writing to file
            if (! this.hasTSB(key)) {
                var tsb = this.findOpenBlock();
                _StdOut.putText("writing to " + Utils.toOct(tsb));

                this.setTSB(key, tsb);
                //only supports one line for now!
                this.setData(tsb, fileData);
            }
            //writing over existing data
            else {
                var tsb = this.getTSB(key);
                _StdOut.putText("writing over data at " + Utils.toOct(tsb));
                this.setData(tsb, fileData);
            }
            
        }

        public copy(fromName: string, toName: string) {

        }

        public delete(fileName: string) {

        }

        public rename(oldFileName: string, newFileName: string) {
            //get key
            var key = this.getKeyByFileName(oldFileName);
            // if (key === "------") { //shouldn't see this...
            //     _StdOut.putText("!No file found for ");
            //     _StdOut.putText(oldFileName, FILE_TEXT);
            //     return;
            // }

            //rename
            this.setData(key, Utils.stringToHex(newFileName, BYTES_FOR_DATA));
            _StdOut.putText("File ");
            _StdOut.putText(oldFileName, FILE_TEXT);
            _StdOut.putText(" renamed to ");
            _StdOut.putText(newFileName, FILE_TEXT);
        }

        public list() {
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {

                if (i == 0) {
                    //skip MBR
                }
                else if (this.isInuse(i)) {
                    var fileName = Utils.hexToString(this.getData(i));
                    _StdOut.putText("  "+fileName, FILE_TEXT);
                    _StdOut.advanceLine();
                }
            }

        }


        // FUNCTIONAL FUNCTIONS

        // check filename length and characters
        public isValidFileName(fileName: string): boolean {

            //check length
            if (fileName.length > MAX_FILE_NAME_SIZE) {
                _StdOut.putText("Error: filename too long, file not created.", ERROR_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText("Maximum filename length is " +MAX_FILE_NAME_SIZE+ " characters.");
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
                var charCode = Utils.charToNum(fileName[i]);

                //is this character allowed?
                if ((charCode >= Utils.charToNum("A") && charCode <= Utils.charToNum("Z")) ||
                        //capital is fine
                    (charCode >= Utils.charToNum("a") && charCode <= Utils.charToNum("z")) ||
                        //lowercase is fine
                    (charCode >= Utils.charToNum("0") && charCode <= Utils.charToNum("9")) ||
                        //numbers is fine
                    (charCode == Utils.charToNum(".") || charCode == Utils.charToNum("_"))) {
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
        public getKeyByFileName(fileName: string): number {
            
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                
                //find used block with same file name
                if (this.isInuse(i) && this.getData(i) === Utils.stringToHex(fileName, BYTES_FOR_DATA)) {
                    
                    //return the directory location
                    _Kernel.krnTrace("File found at " +i);
                    return i;
                }
            }
            _Kernel.krnTrace("!file not found");
            return ERROR_CODE;
        }

        //if a file exists with this name, return true
        public isAFileName(fileName: string): boolean {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                
                //find used block with same file name
                if (this.isInuse(i) && this.getData(i) === Utils.stringToHex(fileName, BYTES_FOR_DATA)) {
                    return true;
                }
            }
            return false;
        }

        public addFile(fileName: string): number {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {

                //check until we find an unused block
                if (!this.isInuse(i)) {
                    
                    //set up camp here
                    this.setInuse(i, true);
                    this.resetTSB(i);
                    this.setData(i, Utils.stringToHex(fileName, BYTES_FOR_DATA));

                    //log it
                    _Kernel.krnTrace("File " +fileName+ " saved at key " +i);

                    //return the directory location
                    return i;
                }
            }
            // FILE RECOVERY: loop again, check inuse for recoverable files, over write one

            //no unused blocks left
            return ERROR_CODE;
        }

        // find the first file data block that is not inuse
        public findOpenBlock(): number {
            
            //loop through directory
            for (var i = DIRECTORY_LENGTH; i < DISK_SIZE; i++) {
                
                //find used block with same file name
                if (! this.isInuse(i)) {
                    
                    //log it
                    _Kernel.krnTrace("Open line at " +i);
                    return i;
                }
            }
            _Kernel.krnTrace("No space on disk!");
            return ERROR_CODE;
        }



        // SET FUNCTIONS

        //set inuse for a key given true/false
        public setInuse(numKey: number, inuse: boolean) {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);

            //write inuse hex
            var inuseHex = Utils.toHex(0, HEX_WORD_SIZE);
            if (inuse) {
                inuseHex = Utils.toHex(1, HEX_WORD_SIZE);
            }

            //set inuse hex
            var block = sessionStorage.getItem(key);
            var newBlock = inuseHex + block.substring(TSB_INDEX);
            sessionStorage.setItem(key, newBlock); 

            //update display
            Control.updateDiskDisplay(key);
        }

        //set tsb for a key given tsb
        public setTSB(numKey: number, numTsb: number) {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);

            //hex tsb
            //0o100 -> "100" 
            var strTsb = Utils.toOct(numTsb, OCT_WORD_SIZE);    
            //"100" -> "010000"
            var tsb = Utils.keyToLongHex(strTsb);                

            //set tsb hex
            var block = sessionStorage.getItem(key);
            //alert(block);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            //alert(newBlock);
            sessionStorage.setItem(key, newBlock); 

            //update display
            Control.updateDiskDisplay(key);
        }

        //set t,s,b to -1,-1,-1
        public resetTSB(numKey: number) {
            this.setTSB(numKey, ERROR_CODE);
        }

        //set data for a key
        public setData(numKey: number, hexData: string) {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);

            //set data
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + hexData;
            sessionStorage.setItem(key, newBlock); 

            //update display
            Control.updateDiskDisplay(key);
        }


        // GET FUNCTIONS
            // public getInuse(key: string): string {
            //     var block = sessionStorage.getItem(key);
            //     return block.substring(INUSE_INDEX, TSB_INDEX);
            // }

        //get boolean for in use
        public isInuse(numKey: number): boolean {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);
            
            //get boolean, is it in use
            var block = sessionStorage.getItem(key);
            // true == 01, false == 00
            return block.substring(INUSE_INDEX, TSB_INDEX) == Utils.toHex(1, HEX_WORD_SIZE);
        }

        //get tsb
        public getTSB(numKey: number): number {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);
            
            //get tsb (as number)
            var block = sessionStorage.getItem(key);
            //"010000"
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX);
            //"010000" -> "100"
            var tsbShortStr = Utils.keyToHex(tsbLongStr);
            //"100" -> 0o100 or 64
            return Utils.octStringToDecimal(tsbShortStr);
        }

        //return boolean is key has a tsb
        public hasTSB(numKey: number): boolean {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);
            
            //get tsb check if it == "---"
            var block = sessionStorage.getItem(key);
            //probably wrong here!
            return block.substring(TSB_INDEX, DATA_INDEX) !== "------";
        }

        //return data given a key
        public getData(numKey: number): string {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);

            //return data
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }




        

            //write in use, TSB
            // var writingData = Utils.toHex(0x1,2);
            // writingData += Utils.toHex(ERROR_CODE,2) + Utils.toHex(ERROR_CODE,2) + Utils.toHex(ERROR_CODE,2);

            // for (var i = 0; i < data.length; i++) {
            //     var char = data[i];
            //     var num = char.charCodeAt(0);
            //     var hex = Utils.toHex(num);
            // }
            // sessionStorage.setItem(key, 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
            
        



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
