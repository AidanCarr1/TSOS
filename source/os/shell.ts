/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc: ShellCommand;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.",
                                  "Ver displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.",
                                  "Help displays a list of (hopefully) valid commands.",);
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.",
                                  "Shutdown shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.",
                                  "Cls clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.",
                                  "Man displays the manual page for a given shell command. You just used it, nice job.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.",
                                  "Trace turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.",
                                  "Rot13 does a rot13 obfuscation on a given string");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.",
                                  "Prompt sets the prompt to the given string.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.",
                                  "Date displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
                                  "whereami",
                                  "- Displays the current location... kinda.",
                                  "Whereami displays your totally accurate location.");
            this.commandList[this.commandList.length] = sc;

            // palindrome <string>
            sc = new ShellCommand(this.shellPalindrome,
                                  "palindrome",
                                  "<string> - Decides if <string> is a palindrome.",
                                  "Palindrome determines if the given string is a palindrome or not.");
            this.commandList[this.commandList.length] = sc;

            // status <string>
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - makes <string> the new status message.",
                                  "Status updates the status message to the given string.");
                                  this.commandList[this.commandList.length] = sc;

            //bsod
            sc = new ShellCommand(this.shellBsod,
                                  "bsod",
                                  "- test the blue screen of death.",
                                  "BSOD displays the blue screen of death.");
                                  this.commandList[this.commandList.length] = sc;

            //load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- load from user input.",
                                  "Load puts the user's program into memory and assigns it a pid.");
                                  this.commandList[this.commandList.length] = sc;

            //load
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - run a process given the process identification.",
                                  "Run executes a process given the process identification.");
                                  this.commandList[this.commandList.length] = sc;
                                   
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args, cmd);  // Note that args is always supplied, though it might be empty.
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?, cmd?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            
            //check for a new line ...
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            //temporary fix, should change because isExecuting may last a while and mess with CLI typing'
            if (_CPU.isExecuting == false) {
                this.putPrompt();
            }
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 3. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 3.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);

            // CORRECTION to original code 
            // making EVERYTHING lowercase destorys <string> authenticity
            // 3.2 Lowercase JUST the command
            cmd = cmd.toLowerCase();

            // 3.3 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
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
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            if (args.length > 0) {

                var topic = args[0];
                topic = topic.toLowerCase();
                var index: number = 0;
                var found: boolean = false;
                var manualDesc : string = "";
                //find if the <topic> is a valid command in the command list
                while (!found && index < _OsShell.commandList.length) {
                    if (_OsShell.commandList[index].command === topic) {
                        found = true;
                        //set description to the command's man description attribute
                        manualDesc = _OsShell.commandList[index].manual;
                        break;
                    } else {
                        ++index;
                    }
                }
                if (found) {
                    _StdOut.putText(manualDesc);
                } else {
                    _StdOut.putText("No manual entry for " + topic + ".");
                }

            //empty <topic>
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                setting = setting.toLowerCase();
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
            //get the current date and print it
            let currentDate = new Date()
            _StdOut.putText(currentDate.toDateString() + ". " + currentDate.toLocaleTimeString());
        }

        public shellWhereami(args: string[]) {
            //choose from a random list of locations
            var locations: string[] = ["Hancock 3007", "Arby's mobile order spot #6", "The short urinal", "308 Negra Arroyo Lane", "The dungeon", "I have no clue", "Hopefully the library", "Dublin, Ireland", "The neighborhood electrical box", "The back of an Uber", "Eddie Munson's trailer", "An elevator with way too many people in it", "The Chuck E Cheese ticket blaster", "Wing Kingdom", "Monk's Cafe", "i3n7a1s9i4m7u0l8a1t6i2o5n"];
            var randomNum: number = Math.floor(Math.random() * locations.length);
            _StdOut.putText("" + locations[randomNum]);
        }

        public shellPalindrome(args: string[]) {
            if (args.length > 0) {
                
                //make the parameter into one string (without spaces)
                var word: string = "";
                for (let i = 0; i < args.length; i++) {
                    word += args[i].toUpperCase();
                }
                
                //create a backwards version
                var backwards: string = "";
                for (let j = 0; j < word.length; j++) {
                    backwards = word[j]+ backwards;
                }

                //do the backwards and forwards versions match?
                if (backwards === word) {
                    _StdOut.putText("It is a palindrome!");
                } else {
                    _StdOut.putText("Nope, not a palindrome.");
                }

            } else {
                _StdOut.putText("Usage: palindrome <string>  Please supply a string.");
            }
        }

        public shellStatus(args: string[]) {
            if (args.length > 0) {
                
                //make the parameter into one string (with spaces)
                var newStatus: string = args[0];
                for (let i = 1; i < args.length; i++) {
                    newStatus += " " + args[i];
                }
                //update the HTML
                (<HTMLInputElement> document.getElementById("divStatus")).innerHTML = "<p> Status: " + newStatus + "</p>";
                //feedback
                _StdOut.putText("Status updated.");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }

        public shellBsod() {
            //blue -> death
            _DrawingContext.paintItBlue();
            _Kernel.krnShutdown();  
            //shutdown is not always reliable here
        }

        public shellLoad() {
            var userProgramStr = (<HTMLInputElement> document.getElementById("taProgramInput")).value;

            //turn input into a list
            userProgramStr = userProgramStr.toUpperCase();
            Utils.trim(userProgramStr);
            var userProgramList = userProgramStr.split(" ");
            var decimalList: number[] = [];

            var validDigits = "0123456789ABCDEF";
            var isValid = true;

            //check each hex
            for (var i = 0; i < userProgramList.length; i++) {
                var hex = userProgramList[i];

                //skip empty strings
                if (hex == ""){
                    userProgramList.splice(i,1);
                    i--;
                }
                //hex must be two digits
                else if (hex.length != 2) {
                    isValid = false;
                }
                //even if one digit is invalid
                else if (!validDigits.includes(hex[0]) || !validDigits.includes(hex[1])) {
                    isValid = false;
                }
                else {
                    var currentDecimal = Utils.hexStringToDecimal(hex);
                    decimalList[decimalList.length] = currentDecimal;
                }
            }

            //if its valid, load it
            if (isValid && userProgramList.length > 0) {

                //load into memory
                _Memory.setMemoryDec(decimalList, 0x0000);
                _StdOut.putText("Loaded into main memory");
                //assign PID
                var pid = _MemoryManager.newProcess(decimalList);
                _StdOut.putText(". Process ID: " + pid);
            }

            else {
                _StdOut.putText("Invalid Hex");
                return;
            }
        }
        
        //run the given process
        public shellRun(args: string[]) {
            if (args.length > 0) {

                //convert arg to number
                var stringPID = args[0];
                var numPID = +stringPID;

                //pid is a number and exists
                if (!isNaN(numPID) && _MemoryManager.isValid(numPID)) {
                    //run the given pid
                    _StdOut.putText("Running program...");
                    _StdOut.advanceLine();
                    //use pid to find memory location, run it
                    _CPU.run(numPID);
                }
                //pid does not exist or isnt a number
                else {
                    _StdOut.putText("Please supply a valid <pid>.");
                    //_StdOut.advanceLine();
                    //this.putPrompt();
                }
            } 
            else {
                _StdOut.putText("Usage: run <pid>  Please supply a process identification.");
            }
        }
    }
}
