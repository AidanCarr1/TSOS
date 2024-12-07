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
            //initialize all tracks, sectors, and blocks
            for (var i = 0o000; i < DISK_SIZE; i++) {
                var key = Utils.toOct(i, OCT_WORD_SIZE);
                sessionStorage.setItem(key, "00".repeat(BYTES_PER_BLOCK));

                this.resetTSB(i);
            }

            //create disk display table
            Control.createDiskDisplay();
            this.isFormatted = true;

            //set Master Boot Record
            this.setInuse(0o000, true);            
        }

        public create(fileName: string) {
            //add to list of files
            var key = this.addFile(fileName);

            // could NOT add file
            if (key == ERROR_CODE) {
                _StdOut.putText("Error: Disk full. Too many files in directory", ERROR_TEXT);
                return;
            }

            //tell the shell (if it is a user-made file)
            if (! this.isSwapFileName(fileName)) {
                _StdOut.putText("File created: ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
            }
        }

        public read(fileName: string) {
            //get key
            var key = this.getKeyByFileName(fileName);

            //get TSB
            var tsb = this.getTSB(key);
            //no tsb associated = no data
            if (!this.hasTSB(key)) {
                _StdOut.putText("No data in ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
                return;
            }

            //tell the shell (if it is a user-made file)
            else if (! this.isSwapFileName(fileName)) {
                _StdOut.putText("Reading data from ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText(Utils.hexToString(this.readLinkedData(tsb)));
                _StdOut.advanceLine();
            }
        }

        public write(fileName: string, fileData: string) {
            var key = this.getKeyByFileName(fileName);

            //first time writing to file
            if (! this.hasTSB(key)) {

                //find a good tsb
                var tsb = this.findOpenBlock();
                if (tsb == ERROR_CODE) {
                    return;
                }
                _Kernel.krnTrace("Writing to " + Utils.toOct(tsb));
                
                //set the file directory tsb
                this.setTSB(key, tsb);
                
            }
            //writing over existing data
            else {
                var tsb = this.getTSB(key);
                _Kernel.krnTrace("Writing over data at " + Utils.toOct(tsb));

                //delete the file data
                this.deleteLinkedData(tsb);
            }

            //put in the new data
            //user-made file
            if (! this.isSwapFileName(fileName)) {
                this.writeData(tsb, fileData);
            }
            //swap file
            else {
                this.writeHexData(tsb, fileData, BLOCKS_FOR_SWAP);
            }

            //tell the shell (if it is a user-made file)
            if (! this.isSwapFileName(fileName)) {
                _StdOut.putText("Successfully updated ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText(Utils.hexToString(this.readLinkedData(tsb))); 
                _StdOut.advanceLine();
            }
        }

        public copy(fromName: string, toName: string) {

            //get both keys
            var fromKey = this.getKeyByFileName(fromName);
            var toKey = this.getKeyByFileName(toName);

            // could NOT add file
            if (toKey == ERROR_CODE) {
                //already told shell in this.create()
                //_StdOut.putText("Error: Disk full. Too many files in directory", ERROR_TEXT);
                return;
            }

            //get TSB from the FROM file
            var fromTsb = this.getTSB(fromKey);

            //no tsb associated = no data
            if (!this.hasTSB(fromKey)) {
                _StdOut.putText("No data in ");
                _StdOut.putText(fromName, FILE_TEXT);
                _StdOut.advanceLine();
                return;
            }

            //read the FROM file
            var fromData = Utils.hexToString(this.readLinkedData(fromTsb));

            //find a good tsb for the TO file
            var toTsb = this.findOpenBlock();
            if (toTsb == ERROR_CODE) {
                    _StdOut.putText("Error: Out of disk space ", ERROR_TEXT);
                    return;
                }
            this.setTSB(toKey, toTsb);

            //write to it
            _Kernel.krnTrace("Writing to " + Utils.toOct(toTsb));
            var wroteData = this.writeData(toTsb, fromData);

            if (wroteData == ERROR_CODE) {
                _StdOut.putText("Error: Out of disk space ", ERROR_TEXT);
                return;
            }

            // Not needed... (yet?)
            //tell the shell (if it is a user-made file)
            //if (! this.isSwapFileName(fileName)) {

            //tell the shell
            _StdOut.putText("Successfully copied from ");
            _StdOut.putText(fromName, FILE_TEXT);
            _StdOut.putText(" to ");
            _StdOut.putText(toName, FILE_TEXT);
            _StdOut.advanceLine();

            //print the contents? i say no
            //_StdOut.putText(Utils.hexToString(this.readLinkedData(toTsb))); 
            //_StdOut.advanceLine();
        }

        public delete(fileName: string) {

            var key = this.getKeyByFileName(fileName);

            //delete the file from directory
            this.setInuse(key, false);

            //delete data
            if (this.hasTSB(key)) {
                var tsb = this.getTSB(key);
                this.deleteLinkedData(tsb);    
            }
            
            //tell the shell (if it is a user-made file)
            if (! this.isSwapFileName(fileName)) {
                _StdOut.putText("Successfully deleted ");
                _StdOut.putText(fileName, FILE_TEXT);
                _StdOut.advanceLine();
            }

        }

        public rename(oldFileName: string, newFileName: string) {
            //get key
            var key = this.getKeyByFileName(oldFileName);

            //rename
            this.setData(key, Utils.stringToHex(newFileName, BYTES_FOR_DATA*HEX_WORD_SIZE));
            _StdOut.putText("File ");
            _StdOut.putText(oldFileName, FILE_TEXT);
            _StdOut.putText(" renamed to ");
            _StdOut.putText(newFileName, FILE_TEXT);
        }

        public list(parameter?: string) {
            //count files
            var count = 0;
            for (var i = 0; i < DIRECTORY_LENGTH; i++) {

                if (i == 0) {
                    //skip MBR
                }
                else if (this.isInuse(i)) {
                    var fileName = Utils.hexToString(this.getData(i));

                    //list it (if it is a user-made file) or (we're showing -all)
                    if (fileName[0] !== "." || parameter === "-a") {
                        _StdOut.putText("  "+fileName, FILE_TEXT);
                        _StdOut.advanceLine();
                        count ++;
                    }
                }
            }

            //didnt print out any files, print message
            if (count == 0) {
                _StdOut.putText("No visible files on the disk");
            }

        }


        // FUNCTIONAL FUNCTIONS

        // check filename length and characters
        public isValidFileName(fileName: string): boolean {

            //check length
            if (fileName.length > MAX_FILE_NAME_SIZE) {
                //alert("printing that its long");
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
                if (this.isInuse(i) && this.getData(i) === Utils.stringToHex(fileName, BYTES_FOR_DATA*HEX_WORD_SIZE)) {
                    
                    //return the directory location
                    _Kernel.krnTrace("File found at " +i);
                    return i;
                }
            }
            _Kernel.krnTrace("!File not found");
            return ERROR_CODE;
        }

        //if a file exists with this name, return true
        public isAFileName(fileName: string): boolean {
            //loop through directory
            for (var i = 0o000; i < DIRECTORY_LENGTH; i++) {
                
                //find used block with same file name
                if (this.isInuse(i) && this.getData(i) === Utils.stringToHex(fileName, BYTES_FOR_DATA*HEX_WORD_SIZE)) {
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
                    this.setData(i, Utils.stringToHex(fileName, BYTES_FOR_DATA*HEX_WORD_SIZE));
                    //_StdOut.putText(this.getData(i), ERROR_TEXT);
                    //_StdOut.advanceLine();

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
            _StdOut.putText("Error: Out of disk space ", ERROR_TEXT);
            _StdOut.advanceLine();
            return ERROR_CODE;
        }

        //write data in link form with given starting tsb
        //return ERROR_CODE if unsuccessful
        public writeData(startingKey: number, plainTextData: string) {
            
            //convert plaintext to hex                                                      //  100 characters long
            var hexDataLength = plainTextData.length * HEX_WORD_SIZE;                       //  200
            var numBlocksNeeded = Math.ceil(hexDataLength/(BYTES_FOR_DATA*HEX_WORD_SIZE));  //  1.6 -> 2
            var numBytesNeeded = numBlocksNeeded * BYTES_FOR_DATA; //padding                    120
            var hexData = Utils.stringToHex(plainTextData, numBytesNeeded*HEX_WORD_SIZE);   //  240

            return this.writeHexData(startingKey, hexData, numBlocksNeeded);
        }
        
        public writeHexData(startingKey: number, hexData: string, numBlocksNeeded: number) {
            var tsb = startingKey;
            var key: number;

            //each block of data storing
            for (var i = 0; i < numBlocksNeeded; i++) {
                
                var key = tsb;
                //separate hexData string into block sized pieces (60 bytes)
                var hexDataSeparated = hexData.substring(i*BYTES_FOR_DATA*HEX_WORD_SIZE, (i+1)*BYTES_FOR_DATA*HEX_WORD_SIZE);

                //insert into block
                this.setData(key, hexDataSeparated);
                this.setInuse(key, true);

                //find open block
                tsb = this.findOpenBlock();
                if (tsb == ERROR_CODE) {
                    return ERROR_CODE;
                }
                //set the tsb
                this.setTSB(key, tsb);
            }

            //the final block should not have a tsb
            this.setTSB(key, ERROR_CODE);
        }

        //given a starting key, set inuse false. Do the same for each tsb linked in chain
        public deleteLinkedData(startingKey: number) {
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
        public readLinkedData(startingKey: number): string {
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



        //SWAP FILE FUNCTIONS

        //given a pid, return the swap file name
        public swapFileName(pid: number): string {
            return ".$swap" + pid; 
        }

        //given a pid, return the swap file name
        public isSwapFileName(fileName: string): boolean {
            return fileName.includes(".$swap");
        }

        //store program string and pcb register into a 5 block string
        public toSwapFileData(programStr: string): string {
            
            //store program string
            var data = programStr;

            //pad to segment size bytes
            var padding = SEGMENT_SIZE * HEX_WORD_SIZE;
            data += "0".repeat(padding - programStr.length);

            //pad to segment size bytes
            padding = BLOCKS_FOR_SWAP * SEGMENT_SIZE * HEX_WORD_SIZE;
            data += "0".repeat(padding - data.length);

            return data;
        }

        // swap out process from memory segment to swap file on disk
        public swapOut(pid: number) {
            
            var pcb = _MemoryManager.getProcessByPID(pid);
            
            //grab memory segment
            var memory = "";
            for (var i = 0; i < SEGMENT_SIZE; i++) {
                memory += Utils.toHex(_MemoryAccessor.read(i, pcb.getBase()), HEX_WORD_SIZE);
            }
            _StdOut.putText("memory: "+memory, TEST_TEXT);
            _StdOut.advanceLine();

            //create swap file if it does not exist
            var swapFileName = this.swapFileName(pid);
            if (! this.isAFileName(swapFileName)) {
                this.create(swapFileName);
            }

            //write memory to swapfile
            var swapFileData = this.toSwapFileData(memory);
            this.write(swapFileName, swapFileData);
            _StdOut.putText("swap file data: "+swapFileData,TEST_TEXT);
            _StdOut.advanceLine();

            //change location to disk
            pcb.setSegment(STORE_ON_DISK);
        }


        // swap in process from swap file on disk to memory segment
        public swapIn(pid: number, insertSegment: number) {

            var pcb = _MemoryManager.getProcessByPID(pid);
            var swapFileName = this.swapFileName(pid);
            var key = this.getKeyByFileName(swapFileName);
            var base = SEGMENT_SIZE * insertSegment;

            //grab the swap file data
            var data = this.getData(key);
            _StdOut.putText("data: "+data, TEST_TEXT);
            _StdOut.advanceLine();

            //put in into memory segment
            for (var i = 0; i < SEGMENT_SIZE; i++) {
                var dataAsHex = data.substring(i*HEX_WORD_SIZE, (i+1)*HEX_WORD_SIZE);
                var dataAsNumber = Utils.hexStringToDecimal(dataAsHex);
                _MemoryAccessor.write(i, dataAsNumber, base);
            }

            //change location to disk
            pcb.setSegment(insertSegment);
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
            Control.updateDiskDisplay(numKey);
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
            Control.updateDiskDisplay(numKey);
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
            Control.updateDiskDisplay(numKey);
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

        //get tsb as a real number
        public getTSB(numKey: number): number {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);
            
            //get tsb (as number)
            var block = sessionStorage.getItem(key);
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX); // "010000"      "------"
            var tsbShortStr = Utils.keyToHex(tsbLongStr);            // "100"         "---"
            return Utils.octStringToDecimal(tsbShortStr);            // 0o100 or 64   -1
        }
        //get tsb but the short string version
        public getTSBString(numKey: number): string {
            //string key
            var key = Utils.toOct(numKey, OCT_WORD_SIZE);
            
            //get tsb (as string) 
            var block = sessionStorage.getItem(key);
            var tsbLongStr = block.substring(TSB_INDEX, DATA_INDEX); // "010000"      "------"
            var tsbShortStr = Utils.keyToHex(tsbLongStr);            // "100"         "---"
            return tsbShortStr;
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
