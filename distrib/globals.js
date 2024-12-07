/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in our text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
const APP_NAME = "TSauce"; // 'cause Bob and I were at a loss for a better name.
const APP_VERSION = "12.06"; // date of last edit, i will definetly forget to update this number
const CPU_CLOCK_INTERVAL = 50; // This is in ms (milliseconds) so 1000 = 1 second.
const DEFAULT_QUANTUM = 6; //cycles ofr round robin quantum
const ERROR_CODE = -1;
const TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ = 1;
const OUTPUT_CPU_IRQ = 2; //on system call, print stuff
const KILL_PROCESS_IRQ = 3; // ctrl c or kill
const OUT_OF_BOUNDS_IRQ = 4;
const CONTEXT_SWITCH_IRQ = 5; //switch pcbs in the cpus
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
//	Hardware	(host)
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory;
var _MemoryAccessor;
//	Software	(OS)
var _MemoryManager;
var _Scheduler;
//Memory CONSTANTS
const NUM_OF_SEGEMENTS = 0x03; //3 segments
const STORE_ON_DISK = 0x04; //"segment 4" - the virtual segment
const SEGMENT_SIZE = 0x100; // 0x000 to 0x0FF, 0x100 to 0x1FF, 0x200 to 0x2FF
const MEMORY_SIZE = NUM_OF_SEGEMENTS * SEGMENT_SIZE; // 3 segments of 0x100
const BASE_LIMIT_WORD_SIZE = 3; // 0x123 to 0x123 (3 chars long)
const HEX_WORD_SIZE = 2; //2 chars of hex in a byte
const HIGH_ORDER_MULTIPLIER = 0x0100; //help with little endian
const MEMORY_COLUMNS = 0x08; //how many memory spots to display per row
const DEFAULT_PRIORITY = 5; //priority might be updated later
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
const DEFAULT_STROKE_COLOR = "black";
var _StrokeColor = DEFAULT_STROKE_COLOR;
const FILE_TEXT = "blue";
const ERROR_TEXT = "maroon";
const TEST_TEXT = "darkgreen";
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelInputQueue = null;
var _KernelBuffers = null;
// Standard input and output
var _StdIn = null;
var _StdOut = null;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;
var _hardwareClockID = null;
var _krnDiskDriver = null;
const NUM_TRACKS = 4;
const NUM_SECTORS = 8;
const NUM_BLOCKS = 8;
const DISK_SIZE = NUM_TRACKS * NUM_SECTORS * NUM_BLOCKS; //0o400;
//indexes for file byte data
const INUSE_INDEX = 0; // 01  23  45  67  89  ab
const TSB_INDEX = 2; //[00][01  00  01][a9  88  8d  10  00  00  00  00]
const DATA_INDEX = 8;
const BYTES_PER_BLOCK = 64; //0o100
const BYTES_FOR_DATA = 60;
const MAX_FILE_NAME_SIZE = BYTES_FOR_DATA;
const DIRECTORY_LENGTH = 0o100;
const OCT_WORD_SIZE = 3; //3 chars per key: 0o000 -> 0o377
const BLOCKS_FOR_SWAP = Math.ceil(SEGMENT_SIZE / BYTES_FOR_DATA);
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados-ip*.js http://alanclasses.github.io/TSOS/test/ .
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
    TSOS.Control.createMemoryDisplay();
};
//# sourceMappingURL=globals.js.map