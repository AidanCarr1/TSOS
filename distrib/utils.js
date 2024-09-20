/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    class Utils {
        static trim(str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        }
        static rot13(str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }
        //take a hex number string ("1A") and return the decimal equivalent (26)
        static hexStringToDecimal(hexStr) {
            var decimalValue = 0;
            var hexChars = "0123456789ABCDEF";
            var power = 0;
            //start from last digit, move left
            for (var i = hexStr.length - 1; i >= 0; i--) {
                var currentDigitValue = hexChars.indexOf(hexStr[i]);
                decimalValue += Math.pow(0x10, power) * currentDigitValue;
                power++;
            }
            return decimalValue;
        }
        //take a number (26) and return the hex equivalent string ("0x1A")
        static toHex(decimal) {
            // 221   0   26     number
            var hexRaw = decimal.toString(16); // dd    0   1a     hex
            hexRaw = hexRaw.toUpperCase(); // DD    0   1A     upper
            //if (hexRaw.length == 1) {
            //    hexRaw = "0" + hexRaw;          // DD   00   1A     add 0
            //}
            return hexRaw;
            //return "0x" + hexRaw;               //0xDD 0x00 0x1A    add 0x
        }
    }
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map