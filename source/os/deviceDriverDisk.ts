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
                
            }
            this.isFormatted = true;
            // sessionStorage.setItem('myKey', 'myValue'); 
            // var myVar = sessionStorage.getItem('myKey');
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
                //_StdOut.putText("char"+charCode);

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
        private setInuse(key: string, inuse: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = inuse + block.substring(TSB_INDEX);
            sessionStorage.setItem(key, newBlock); 
        }
        private setTSB(key: string, tsb: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, TSB_INDEX) + tsb + block.substring(DATA_INDEX);
            sessionStorage.setItem(key, newBlock); 
        }
        private setData(key: string, data: string) {
            var block = sessionStorage.getItem(key);
            var newBlock = block.substring(INUSE_INDEX, DATA_INDEX) + data;
            sessionStorage.setItem(key, newBlock); 
        }

        // GET FUNCTIONS
        private getInuse(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(INUSE_INDEX, TSB_INDEX);
        }
        private getTSB(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(TSB_INDEX, DATA_INDEX);
        }
        private getData(key: string): string {
            var block = sessionStorage.getItem(key);
            return block.substring(DATA_INDEX);
        }

        private addFile(fileName: string) {
            //loop through directory
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {

                //check until we find an unused block
                var key = Utils.toOct(i,3);
                if (this.getInuse(key) == Utils.toHex(0, HEX_WORD_SIZE)) {
                    
                    //set up camp here
                    this.setInuse(key, Utils.toHex(1, HEX_WORD_SIZE));
                    var emptyTSB = Utils.toHex(ERROR_CODE, HEX_WORD_SIZE).repeat(3);
                    this.setTSB(key, emptyTSB);
                    this.setData(key, Utils.stringToHex(fileName));

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
