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
            for (var i = 0; i < DISK_SIZE; i++) {
                var key = Utils.toOct(i, OCT_WORD_SIZE);
                sessionStorage.setItem(key, "00".repeat(BYTES_PER_BLOCK));
                this.resetTSB(key);
            }

            //set Master Boot Record
            _Kernel.krnTrace(Utils.toHex(1, HEX_WORD_SIZE));
            this.setInuse("000", true);

            //create disk display table
            Control.createDiskDisplay();
            this.isFormatted = true;
        }

        public create(fileName: string) {
            //add to list of files
            this.addFile(fileName);

            //tell the shell
            _StdOut.putText("File created: " + fileName);

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

        public isValidFileName(fileName: string) {

            //check length
            if (fileName.length > MAX_FILE_NAME_SIZE) {
                _StdOut.putText("Error creating file: filename too long.");
                _StdOut.advanceLine();
                _StdOut.putText("Maximum filename length is " +MAX_FILE_NAME_SIZE+ " characters.");
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
                    _StdOut.putText("Error creating file: Invalid filename.");
                    _StdOut.advanceLine();
                    _StdOut.putText("Please only use letters, numbers, and underscore.");
                    return;
                }
            }

            //passed tests
            return true;
        }

        // SET FUNCTIONS
        public setInuse(key: string, inuse: boolean) {
            var inuseHex = Utils.toHex(0, HEX_WORD_SIZE);
            if (inuse) {
                inuseHex = Utils.toHex(1, HEX_WORD_SIZE);
            }
            //_Kernel.krnTrace("setting in use");
            var block = sessionStorage.getItem(key);
            var newBlock = inuseHex + block.substring(TSB_INDEX);
            //_Kernel.krnTrace("new block "+newBlock);
            sessionStorage.setItem(key, newBlock); 
            //_Kernel.krnTrace("set in use");
            Control.updateDiskDisplay(key);
        }
        public setTSB(key: string, tsb: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock); 

            Control.updateDiskDisplay(key);
        }
        public resetTSB(key: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + Utils.toHex(ERROR_CODE, HEX_WORD_SIZE).repeat(OCT_WORD_SIZE) + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock); 

            Control.updateDiskDisplay(key);
        }
        public setData(key: string, data: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + data;
            sessionStorage.setItem(key, newBlock); 

            Control.updateDiskDisplay(key);
        }

        // GET FUNCTIONS
        public getInuse(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(INUSE_INDEX, TSB_INDEX);
        }
        public getTSB(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(TSB_INDEX, DATA_INDEX);
        }
        public getData(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }

        public addFile(fileName: string) {
            //loop through directory
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {

                //check until we find an unused block
                var key = Utils.toOct(i, OCT_WORD_SIZE);
                if (this.getInuse(key) == Utils.toHex(0, HEX_WORD_SIZE)) {
                    
                    //set up camp here
                    this.setInuse(key, true);
                    this.resetTSB(key);
                    this.setData(key, Utils.stringToHex(fileName));

                    //log it
                    _Kernel.krnTrace("File " +fileName+ " saved at key " +key);

                    //update disk display
                    return key;
                }
            }
            // FILE RECOVERY: loop again, check inuse for recoverable files, over write one

            //no unused blocks left
            _StdOut.putText("Disk Full. Too many files in directory");
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
