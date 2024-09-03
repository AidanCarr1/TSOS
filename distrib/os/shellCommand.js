var TSOS;
(function (TSOS) {
    class ShellCommand {
        func;
        command;
        description;
        manual;
        constructor(func, command = "", description = "", //for help command
        manual = "") {
            this.func = func;
            this.command = command;
            this.description = description;
            this.manual = manual;
        }
    }
    TSOS.ShellCommand = ShellCommand;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shellCommand.js.map