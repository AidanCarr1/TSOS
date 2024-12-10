/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        // Properties
        promptStr = ">";
        commandList = [];
        curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        apologies = "[sorry]";
        //public locations: string[] = ["Hancock 3007", "Arby's mobile order spot #6", "The short urinal", "308 Negra Arroyo Lane", "The dungeon", "I have no clue", "Hopefully the library", "Dublin, Ireland", "The neighborhood electrical box", "The back of an Uber", "Eddie Munson's trailer", "An elevator with way too many people in it", "The Chuck E Cheese ticket blaster", "Wing Kingdom", "Monk's Cafe", "i3n7a1s9i4m7u0l8a1t6i2o5n"];
        locations = [];
        constructor() {
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.", "Ver displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.", "Help displays a list of (hopefully) valid commands.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.", "Shutdown shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.", "Cls clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.", "Man displays the manual page for a given shell command. You just used it, nice job.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.", "Trace turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.", "Rot13 does a rot13 obfuscation on a given string");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.", "Prompt sets the prompt to the given string.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.", "Date displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays the current location... kinda.", "Whereami displays your totally accurate location.");
            this.commandList[this.commandList.length] = sc;
            this.locations = ["Hancock 3007", "Arby's mobile order spot #6", "The short urinal", "308 Negra Arroyo Lane",
                "The dungeon", "I have no clue", "Hopefully the library", "Dublin, Ireland", "The neighborhood electrical box",
                "The back of an Uber", "Eddie Munson's trailer", "An elevator with way too many people in it",
                "The Chuck E Cheese ticket blaster", "Wing Kingdom", "Monk's Cafe", "i3n7a1s9i4m7u0l8a1t6i2o5n",
                "The pumpkin patch", "The bottom of a wet pile of leaves", "The dairy isle"];
            // palindrome <string>
            sc = new TSOS.ShellCommand(this.shellPalindrome, "palindrome", "<string> - Decides if <string> is a palindrome.", "Palindrome determines if the given string is a palindrome or not.");
            this.commandList[this.commandList.length] = sc;
            // status <string>
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - makes <string> the new status message.", "Status updates the status message to the given string.");
            this.commandList[this.commandList.length] = sc;
            //bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- test the blue screen of death.", "BSOD displays the blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- load from user input.", "Load puts the user's program into memory and assigns it a pid.");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - run a process given the process identification.", "Run executes a process given the process identification.");
            this.commandList[this.commandList.length] = sc;
            //clear mem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- clear all memory segments.", "Clearmem clears every memory segment.");
            this.commandList[this.commandList.length] = sc;
            //ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- display all processes and their states.", "Ps shows the PID and state for each process.");
            this.commandList[this.commandList.length] = sc;
            //quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- sets the round robin quantum (default is 6).", "Quantum allows the round robin quantum to be changed.");
            this.commandList[this.commandList.length] = sc;
            //run all
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- runs all unfinished programs at once.", "Runall runs all unfinished programs in memory at once.");
            this.commandList[this.commandList.length] = sc;
            //kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - kill a process given the process identification.", "Kill terminates a process given the process identification.");
            this.commandList[this.commandList.length] = sc;
            //kill all
            sc = new TSOS.ShellCommand(this.shellKillall, "killall", "- kills all programs in memory.", "Killall terminates programs in memory at once.");
            this.commandList[this.commandList.length] = sc;
            // FILE COMMANDS
            //format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- format the disk.", "Format initializes the disk.");
            this.commandList[this.commandList.length] = sc;
            //create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - create a file with the given name.", "Create makes a file and stores it on the disk.");
            this.commandList[this.commandList.length] = sc;
            //read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - read and display contents of the given file.", "Read dispalys the data of a file on the disk.");
            this.commandList[this.commandList.length] = sc;
            //write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", '<filename> "data" - write data into the given file.', "Write inputs data from given quotes into a file on the disk.");
            this.commandList[this.commandList.length] = sc;
            //delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", '<filename> - destroy a given file.', "Delete the file. obviously.");
            this.commandList[this.commandList.length] = sc;
            //copy
            sc = new TSOS.ShellCommand(this.shellCopy, "copy", '<filename> <new filename> - copies contents to a new file.', "Copy contents from one file to a newly declared one.");
            this.commandList[this.commandList.length] = sc;
            //rename
            sc = new TSOS.ShellCommand(this.shellRename, "rename", '<filename> <new filename> - give a file a new name.', "Rename a given file to a new, ~cooler~ name.");
            this.commandList[this.commandList.length] = sc;
            //ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", '[-a] - list the files currently stored on disk.', "List the files currently stored on disk.");
            this.commandList[this.commandList.length] = sc;
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr, PROMPT_TEXT);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args, cmd); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else if (cmd === "") {
                    _StdOut.advanceLine();
                    this.putPrompt();
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args, cmd) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            //check for a new line ...
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            //small spacing after command is done executing
            //(not extra space when at the top of the canvas)
            if (_StdOut.currentYPosition > _StdOut.currentFontSize) {
                _StdOut.advanceLine(0.5);
            }
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 3. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 3.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // CORRECTION to original code 
            // making EVERYTHING lowercase destorys <string> authenticity
            // 3.2 Lowercase JUST the command
            cmd = cmd.toLowerCase();
            // 3.3 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ", ERROR_TEXT);
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, doofus,", ERROR_TEXT);
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of Camden, NJ.", ERROR_TEXT);
            }
            else {
                _StdOut.putText("Type 'help' for help.", ERROR_TEXT);
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                topic = topic.toLowerCase();
                var index = 0;
                var found = false;
                var manualDesc = "";
                //find if the <topic> is a valid command in the command list
                while (!found && index < _OsShell.commandList.length) {
                    if (_OsShell.commandList[index].command === topic) {
                        found = true;
                        //set description to the command's man description attribute
                        manualDesc = _OsShell.commandList[index].manual;
                        break;
                    }
                    else {
                        ++index;
                    }
                }
                if (found) {
                    _StdOut.putText(manualDesc);
                }
                else {
                    _StdOut.putText("No manual entry for " + topic + ".");
                }
                //empty <topic>
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                setting = setting.toLowerCase();
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        shellDate(args) {
            //get the current date and print it
            let currentDate = new Date();
            _StdOut.putText(currentDate.toDateString() + ". " + currentDate.toLocaleTimeString());
        }
        shellWhereami(args) {
            //choose from a random list of locations
            var randomNum = Math.floor(Math.random() * _OsShell.locations.length);
            _StdOut.putText("" + _OsShell.locations[randomNum]);
        }
        shellPalindrome(args) {
            if (args.length > 0) {
                //make the parameter into one string (without spaces)
                var word = "";
                for (let i = 0; i < args.length; i++) {
                    word += args[i].toUpperCase();
                }
                //create a backwards version
                var backwards = "";
                for (let j = 0; j < word.length; j++) {
                    backwards = word[j] + backwards;
                }
                //do the backwards and forwards versions match?
                if (backwards === word) {
                    _StdOut.putText("It is a palindrome!");
                }
                else {
                    _StdOut.putText("Nope, not a palindrome.");
                }
            }
            else {
                _StdOut.putText("Usage: palindrome <string>  Please supply a string.");
            }
        }
        shellStatus(args) {
            if (args.length > 0) {
                //make the parameter into one string (with spaces)
                var newStatus = args[0];
                for (let i = 1; i < args.length; i++) {
                    newStatus += " " + args[i];
                }
                //update the HTML
                document.getElementById("divStatus").innerHTML = "<p> Status: " + newStatus + "</p>";
                //feedback
                _StdOut.putText("Status updated.");
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        shellBsod() {
            //blue -> death
            _DrawingContext.paintItBlue();
            _Kernel.krnShutdown();
            //shutdown is not always reliable here
        }
        shellLoad() {
            //check for availible segment or if there is memory and we arent over writing program
            var segment = _MemoryManager.whereIsSpace();
            if (segment == ERROR_CODE) {
                //Storing in disk!
                if (!_krnDiskDriver.isFormatted) {
                    _StdOut.putText("Error: No space in memory.", ERROR_TEXT);
                    _StdOut.advanceLine();
                    _StdOut.putText("Format disk to store more programs. Use command: format");
                    _StdOut.advanceLine();
                    return;
                }
                _Kernel.krnTrace("Memory full. Looking to store on disk");
                segment = STORE_ON_DISK;
            }
            var userProgramStr = document.getElementById("taProgramInput").value;
            //turn input into string with no spaces or /n
            userProgramStr = userProgramStr.toUpperCase();
            var programStr = userProgramStr.replaceAll(" ", "");
            programStr = programStr.replaceAll("\n", "");
            var decimalList = [];
            var validDigits = "0123456789ABCDEF";
            var isValid = true;
            //each hex must be 2 digits long
            if (programStr.length % 2 != 0) {
                isValid = false;
            }
            //check each hex
            for (var i = 0; i < programStr.length - 1; i += 2) {
                var hex = programStr.substring(i, i + 2);
                //both digits must be valid hex digits
                if (!validDigits.includes(hex[0]) || !validDigits.includes(hex[1])) {
                    isValid = false;
                }
                else {
                    var currentDecimal = TSOS.Utils.hexStringToDecimal(hex);
                    decimalList[decimalList.length] = currentDecimal;
                }
            }
            //input is too long
            if (decimalList.length > SEGMENT_SIZE) {
                _StdOut.putText("Error: Input is too large for memory segments", ERROR_TEXT);
                return;
            }
            //if its valid, load it
            else if (isValid && programStr.length > 1) {
                //for storing in memory...
                if (segment != STORE_ON_DISK) {
                    //clear old process
                    _MemoryAccessor.clearSegment(segment);
                    //create PCB, location = disk
                    var pid = _MemoryManager.newProcess(decimalList, segment);
                    //load into main memory
                    _MemoryAccessor.writeSegment(decimalList, segment);
                    _Kernel.krnTrace("Loaded into segment " + segment);
                    //return PID
                    _StdOut.putText("Process ID: " + pid);
                    //update memory display accordingly
                    TSOS.Control.updateMemoryDisplay();
                }
                //for storing on disk...
                else {
                    //create PCB, location = disk
                    var pid = _MemoryManager.newProcess(decimalList, segment);
                    //load onto disk
                    var swapFileName = _krnDiskDriver.swapFileName(pid);
                    var swapFileData = _krnDiskDriver.toSwapFileData(programStr);
                    //create swap file
                    _krnDiskDriver.create(swapFileName);
                    _krnDiskDriver.write(swapFileName, swapFileData);
                    _Kernel.krnTrace("Loaded onto disk");
                    //return PID
                    _StdOut.putText("Process ID: " + pid);
                }
            }
            else {
                _StdOut.putText("Error: Invalid Hex", ERROR_TEXT);
                return;
            }
        }
        //run the given process
        shellRun(args) {
            if (args.length > 0) {
                //convert arg to number
                var stringPID = args[0];
                var numPID = +stringPID;
                var intPID = Math.floor(numPID);
                //pid is an integer and is runable
                if (!isNaN(numPID) && numPID == intPID && _MemoryManager.isRunable(numPID)) {
                    //run the given pid
                    _StdOut.putText("Running program...");
                    _StdOut.advanceLine();
                    var pcb = _MemoryManager.getProcessByPID(numPID);
                    //add pcb to the ready queue
                    _MemoryManager.readyQueue.enqueue(pcb);
                    pcb.setState("READY");
                }
                //pid does not exist or isnt a number
                else {
                    _StdOut.putText("Error: Please supply a valid <pid>.", ERROR_TEXT);
                }
            }
            else {
                _StdOut.putText("Usage: run <pid>  Please supply a process identification.");
            }
        }
        //loop thru each segment, clearing all memory
        shellClearmem() {
            for (var i = 0x0; i < NUM_OF_SEGMENTS; i++) {
                //kill the program in that segment
                var targetPCB = _MemoryManager.segmentList[i];
                if (targetPCB === undefined) {
                    //there is not process in this segment
                }
                else if (_MemoryManager.isKillable(targetPCB.pid)) {
                    //kill it!
                    var systemCall = new TSOS.Interrupt(KILL_PROCESS_IRQ, [targetPCB]);
                    _KernelInterruptQueue.enqueue(systemCall);
                }
                //reset memory to 0x00's
                _MemoryAccessor.clearSegment(i);
                _MemoryManager.segmentList[i] = undefined;
            }
            //update memory display accordingly
            TSOS.Control.updateMemoryDisplay();
        }
        //shows all pids and their states
        shellPs() {
            for (var i = 0; i < _MemoryManager.pidCounter; i++) {
                _StdOut.putText("PID " + i + ": " + _MemoryManager.getProcessByPID(i).getState());
                _StdOut.advanceLine();
            }
        }
        //let user set the round robin quantum
        shellQuantum(args) {
            if (args.length > 0) {
                //convert arg to number
                var stringQuantum = args[0];
                var numQuantum = +stringQuantum;
                var intQuantum = Math.floor(numQuantum);
                //quantum is a valid number
                if (!isNaN(intQuantum) && intQuantum > 0) {
                    //set quantum
                    _Scheduler.setQuantum(intQuantum);
                    _StdOut.putText("Quantum set to " + intQuantum);
                }
                //pid does not exist or isnt a number
                else {
                    _StdOut.putText("Error: Please supply a valid <int>.", ERROR_TEXT);
                }
            }
            else {
                _StdOut.putText("Usage: quantum <int>  Please supply an integer.");
            }
        }
        //run all unran process
        shellRunall() {
            //go through all processes
            for (var i = 0; i < _MemoryManager.pidCounter; i++) {
                //only add to queue if it is resident
                var nextPCB = _MemoryManager.getProcessByPID(i);
                if (nextPCB.getState() === "RESIDENT") {
                    _MemoryManager.readyQueue.enqueue(nextPCB);
                    nextPCB.setState("READY");
                }
            }
        }
        //kill a given process
        shellKill(args) {
            if (args.length > 0) {
                //convert arg to number
                var stringPID = args[0];
                var targetPID = +stringPID;
                var intPID = Math.floor(targetPID);
                //pid is an integer and is killable
                if (!isNaN(targetPID) && targetPID == intPID && _MemoryManager.isKillable(targetPID)) {
                    //kill it!
                    var systemCall = new TSOS.Interrupt(KILL_PROCESS_IRQ, [_MemoryManager.getProcessByPID(targetPID)]);
                    _KernelInterruptQueue.enqueue(systemCall);
                    //tell shell
                    _StdOut.putText("Process " + targetPID + " terminated.");
                    _StdOut.advanceLine();
                }
                //pid does not exist or isnt a number
                else {
                    _StdOut.putText("Error: Please supply a valid <pid>.", ERROR_TEXT);
                }
            }
            else {
                _StdOut.putText("Usage: kill <pid>  Please supply a process identification.");
            }
        }
        //terminate all (killable) processes in memory
        shellKillall() {
            //go through each segment
            for (var i = 0; i < NUM_OF_SEGMENTS; i++) {
                //go through all processes
                for (var i = 0; i < _MemoryManager.pidCounter; i++) {
                    var pid = i;
                    //only kill if killable
                    if (_MemoryManager.getProcessByPID(pid).getState() !== "TERMINATED" && _MemoryManager.isKillable(pid)) {
                        //kill it!
                        var systemCall = new TSOS.Interrupt(KILL_PROCESS_IRQ, [_MemoryManager.getProcessByPID(pid)]);
                        _KernelInterruptQueue.enqueue(systemCall);
                        //tell shell
                        _StdOut.putText("Process " + pid + " terminated.");
                        _StdOut.advanceLine();
                    }
                }
            }
        }
        shellFormat() {
            //could add args, see challenge [58]
            if (_krnDiskDriver.isFormatted) {
                _StdOut.putText("Disk is already formatted");
            }
            else {
                _krnDiskDriver.format();
                _StdOut.putText("Disk formatted!");
            }
        }
        shellCreate(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 0) {
                //replace spaces with _
                var fileName = args.join("_");
                //create file if it is valid
                if (_krnDiskDriver.isValidFileName(fileName)) {
                    _krnDiskDriver.create(fileName);
                }
            }
            else {
                _StdOut.putText("Usage: create <filename>  Please supply a file name.");
            }
        }
        shellRead(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 0) {
                // is it a real file?
                var fileName = args[0];
                if (!_krnDiskDriver.isAFileName(fileName)) {
                    _StdOut.putText("Error: Could not find the file ", ERROR_TEXT);
                    _StdOut.putText(fileName, FILE_TEXT);
                    return;
                }
                _krnDiskDriver.read(args[0]);
            }
            else {
                _StdOut.putText("Usage: read <filename>  Please supply a file name.");
            }
        }
        shellWrite(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 1) {
                // is it a real file?
                var fileName = args[0];
                if (!_krnDiskDriver.isAFileName(fileName)) {
                    _StdOut.putText("Error: Could not find the file ", ERROR_TEXT);
                    _StdOut.putText(fileName, FILE_TEXT);
                    return;
                }
                //get data
                var rawData = args.slice(1).join(" ");
                var firstQuote = rawData.indexOf('"');
                var secondQuote = rawData.indexOf('"', firstQuote + 1);
                //not enough quotes found
                if (firstQuote == ERROR_CODE || secondQuote == ERROR_CODE) {
                    _StdOut.putText('Usage: write <filename> "data"  Please supply a file name.');
                    return;
                }
                //write data to the file
                var refinedData = rawData.substring(firstQuote + 1, secondQuote);
                _krnDiskDriver.write(fileName, refinedData);
            }
            else {
                _StdOut.putText('Usage: write <filename> "data"  Please supply a file name.');
            }
        }
        shellCopy(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 1) {
                // is file filename a real file?
                var readingFileName = args[0];
                if (!_krnDiskDriver.isAFileName(readingFileName)) {
                    _StdOut.putText("Error: Could not find the file ", ERROR_TEXT);
                    _StdOut.putText(readingFileName, FILE_TEXT);
                    return;
                }
                //new file
                //replace spaces with _
                var writingFileName = args.slice(1).join("_");
                //is it a valid file name?
                if (!_krnDiskDriver.isValidFileName(writingFileName)) {
                    return;
                }
                // is it unique?
                if (_krnDiskDriver.isAFileName(writingFileName)) {
                    _StdOut.putText("Error: File already exists ", ERROR_TEXT);
                    _StdOut.putText(writingFileName, FILE_TEXT);
                    return;
                }
                //create & copy file if it is valid
                _krnDiskDriver.create(writingFileName);
                _krnDiskDriver.copy(readingFileName, writingFileName);
            }
            else {
                _StdOut.putText("Usage: copy <from filename> <to filename> Please supply two file names.");
            }
        }
        shellDelete(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 0) {
                // is it a real file?
                var fileName = args[0];
                if (!_krnDiskDriver.isAFileName(fileName)) {
                    _StdOut.putText("Error: Could not find the file ", ERROR_TEXT);
                    _StdOut.putText(fileName, FILE_TEXT);
                    return;
                }
                //delete that fucker!
                _krnDiskDriver.delete(fileName);
            }
            else {
                _StdOut.putText("Usage: delete <filename>  Please supply a file name.");
            }
        }
        shellRename(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length > 1) {
                // is it a real file?
                var fileName = args[0];
                if (!_krnDiskDriver.isAFileName(fileName)) {
                    _StdOut.putText("Error: Could not find the file ", ERROR_TEXT);
                    _StdOut.putText(fileName, FILE_TEXT);
                    return;
                }
                //get new name
                var newFileName = args.slice(1).join("_");
                // is it unique?
                if (_krnDiskDriver.isAFileName(newFileName)) {
                    _StdOut.putText("Error: File already exists ", ERROR_TEXT);
                    _StdOut.putText(newFileName, FILE_TEXT);
                    return;
                }
                //rename
                _krnDiskDriver.rename(fileName, newFileName);
            }
            else {
                _StdOut.putText("Usage: rename <old filename> <new filename>  Please supply a file name.");
            }
        }
        shellLs(args) {
            if (!_krnDiskDriver.isFormatted) {
                _StdOut.putText("Error: Disk is not formatted. Use command: format", ERROR_TEXT);
            }
            else if (args.length == 0) {
                _krnDiskDriver.list();
            }
            //list all
            else if (args[0] === "-a") {
                _krnDiskDriver.list("-a");
            }
            //invalid parameters
            else {
                _StdOut.putText("Usage: ls [-a]");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map