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
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- load from user input.", "Load checks and runs the user's program.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
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
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
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
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
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
            //this.promptStr = ""; // "temporary" fix to Professor Labouseur's OCD
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
            var locations = ["Hancock 3007", "Arby's mobile order spot #6", "The short urinal", "308 Negra Arroyo Lane", "The dungeon", "I have no clue", "Hopefully the library", "Dublin, Ireland", "The neighborhood electrical box", "The back of an Uber", "Eddie Munson's trailer", "An elevator with way too many people in it", "The Chuck E Cheese ticket blaster", "Wing Kingdom", "Monk's Cafe", "i3n7a1s9i4m7u0l8a1t6i2o5n"];
            var randomNum = Math.floor(Math.random() * locations.length);
            _StdOut.putText("" + locations[randomNum]);
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
            var userProgramStr = document.getElementById("taProgramInput").value;
            //turn input into a list
            userProgramStr = userProgramStr.toUpperCase();
            TSOS.Utils.trim(userProgramStr);
            var userProgramList = userProgramStr.split(" ");
            var decimalList = [];
            var validDigits = "0123456789ABCDEF";
            var isValid = true;
            //check each hex
            for (var i = 0; i < userProgramList.length; i++) {
                var hex = userProgramList[i];
                //skip empty strings
                if (hex == "") {
                    userProgramList.splice(i, 1);
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
                    var currentDecimal = TSOS.Utils.hexStringToDecimal(hex);
                    //_StdOut.putText("0x"+ hex + ":" + currentDecimal + ", "); //test
                    decimalList[decimalList.length] = currentDecimal;
                }
            }
            //if its valid, load it
            if (isValid && userProgramList.length > 0) {
                _StdOut.putText("Valid Hex");
                _StdOut.advanceLine();
                _Memory.setMemoryDec(decimalList, 0x0000);
                _StdOut.putText("Loaded into main memory");
            }
            else {
                _StdOut.putText("Invalid Hex");
                return;
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map