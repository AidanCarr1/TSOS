/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public bufferHistory:string[] = [],
                    public historyPointer = 0) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    
                    //dont store a blank line
                    if (this.buffer === "") {
                        return;
                    }

                    // store in buffer history (for up/down arrow purposes)
                    this.bufferHistory.push(this.buffer);
                    this.historyPointer = this.bufferHistory.length; //resets arrow pressing for next line
                    
                    // ... and reset our buffer.
                    this.buffer = "";
                } 

                // Ctrl-C: allow the user to break the current program.
                else if (chr === "ctrlc" && _CPU.isExecuting) {

                    //tell the shell
                    _StdOut.advanceLine();
                    _StdOut.putText("Process TERMINATED with ctrl c");

                    //create an interupt to kill current process?
                    //should i kill all running processes?
                    var systemCall = new Interrupt(KILL_PROCESS_IRQ, [_CPU.currentPCB]);
                    _KernelInterruptQueue.enqueue(systemCall);
                                       
                    // ... and reset our buffer.
                    this.buffer = "";
                }    

                //normal characters 
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        }

        public putText(text, color?): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */

            //if color is set, change the color
            if (color) {
                _StrokeColor = color;
            }
            else {
                _StrokeColor = DEFAULT_STROKE_COLOR;
            }

            if (text !== "") {
                //one letter at a time
                for (var letter in text) {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text[letter]);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text[letter]);
                    this.currentXPosition = this.currentXPosition + offset;

                    //line wrap
                    if (this.currentXPosition >= _Canvas.width - _DrawingContext.measureText(this.currentFont, this.currentFontSize, "m")){
                        this.advanceLine();
                    }
                }
                
            }
        }

        public deleteText(text): void {
            _DrawingContext.eraseText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            //Move current X position backwards
            this.currentXPosition = this.currentXPosition - offset;
            //this.putText("-");
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var changeInY:number = this.currentFontSize + 
                                   _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                   _FontHeightMargin;
            this.currentYPosition += changeInY;

            // Scrolling: if position is off the canvas, move everything up
            if (this.currentYPosition > _Canvas.height){

                //IDEA (kinda) from stackoverflow
                //https://stackoverflow.com/questions/32451628/how-to-move-a-drawn-image-on-html5-canvas
                
                //create a new, temporary canvas
                var copyOfCanvas = document.createElement("canvas");
                var copyOfContext = copyOfCanvas.getContext("2d");
                copyOfCanvas.width = _Canvas.width;
                copyOfCanvas.height = _Canvas.height;

                //copy canvas onto the photocopy of current canvas
                copyOfContext.drawImage(_Canvas, 0, 0, _Canvas.width, _Canvas.height);

                //clear the REAL canvas
                this.clearScreen();
                
                //redraw photo copy of our canvas, but up a little higher onto the canvas
                _DrawingContext.drawImage(copyOfCanvas, 0, - (changeInY) , _Canvas.width, _Canvas.height);

                //make cursor go to the bottom
                this.currentYPosition = this.currentYPosition - changeInY;
            }
        }
    }
 }
