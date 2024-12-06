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
        static toHex(decimal, padding) {
            //error code
            if (decimal == ERROR_CODE) {
                var hex = "-";
                if (padding > 1) {
                    hex = hex.repeat(padding);
                }
                return hex;
            }
            //normal numbers:                   // 221   0   26     number
            var hexRaw = decimal.toString(16); // dd    0   1a     hex
            hexRaw = hexRaw.toUpperCase(); // DD    0   1A     upper
            //padding
            var zeros = "";
            if (padding > hexRaw.length) {
                zeros = "0".repeat(padding - hexRaw.length);
            }
            hexRaw = zeros + hexRaw; // DD   00   1A     add 0
            return hexRaw;
        }
        static numToChar(decimal) {
            return String.fromCharCode(decimal);
        }
        static charToNum(character) {
            return character.charCodeAt(0);
        }
        //take string "Hello" convert to WORDSIZE2 Hex string ""
        static stringToHex(str, rPadding) {
            var hexString = "";
            //convert each char to hex value
            for (var i = 0; i < str.length; i++) {
                var char = str[i];
                var num = this.charToNum(char);
                var hexChar = this.toHex(num, HEX_WORD_SIZE);
                hexString += hexChar;
            }
            //return string of all hex values
            hexString += "0".repeat(rPadding - hexString.length);
            return hexString;
        }
        //take a number (26) and return the oct equivalent string ("0c32")
        static toOct(decimal, padding) {
            //error code
            if (decimal == ERROR_CODE) {
                var oct = "-";
                if (padding > 1) {
                    oct = oct.repeat(padding);
                }
                return oct;
            }
            // 256    0   26   number
            var octRaw = decimal.toString(8); // 400    0   32   octal
            if (padding == OCT_WORD_SIZE && octRaw.length < padding) {
                var extra0s = "0".repeat(padding - octRaw.length);
                return (extra0s + octRaw);
            }
            return octRaw;
        }
        static keyToHex(key) {
            //_Kernel.krnTrace("start key to hex");
            var hex = "";
            for (var i = 0; i < key.length; i += HEX_WORD_SIZE) {
                var anOct = key.substring(i, i + HEX_WORD_SIZE + 1);
                if (anOct === "--") {
                    hex += "-";
                }
                else {
                    hex += anOct[1];
                }
            }
            //_Kernel.krnTrace("end key to hex");
            return hex;
        }
        //convert hex ASCII to readable english
        static hexToString(longHex) {
            var str = "";
            for (var i = 0; i < longHex.length; i += HEX_WORD_SIZE) {
                //get two characters from long hex
                var hex = longHex.substring(i, i + HEX_WORD_SIZE);
                //convert to decimal value (0 means end of word)
                var num = this.hexStringToDecimal(hex);
                if (num == 0) {
                    return str;
                }
                //convert ASCII decimal to ASCII char
                var char = String.fromCharCode(num);
                str += char;
            }
            return str;
        }
        static keyToLongHex(key) {
            _Kernel.krnTrace("start key to long hex");
            var hex = "";
            for (var i = 0; i < key.length; i++) {
                var anOct = key.charAt(i);
                if (anOct === "-") {
                    hex += "--";
                }
                else {
                    hex += "0" + anOct;
                }
            }
            _Kernel.krnTrace("end key to hex");
            return hex;
        }
        //not tested!
        //take a oct number string ("100") and return the decimal equivalent (64)
        static octStringToDecimal(octStr) {
            var decimalValue = 0;
            var octChars = "01234567";
            var power = 0;
            // if (octStr === "---") {
            //     return ERROR_CODE;
            // }
            //start from last digit, move left
            for (var i = octStr.length - 1; i >= 0; i--) {
                var currentDigitValue = octChars.indexOf(octStr[i]);
                decimalValue += Math.pow(0o10, power) * currentDigitValue;
                power++;
            }
            return decimalValue;
        }
    }
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=utils.js.map