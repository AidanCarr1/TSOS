var TSOS;
(function (TSOS) {
    class AliasCommand {
        shellCommand;
        aliasCommand;
        constructor(shellCommand = "", aliasCommand = "") {
            this.shellCommand = shellCommand;
            this.aliasCommand = aliasCommand;
        }
    }
    TSOS.AliasCommand = AliasCommand;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=aliasCommand.js.map