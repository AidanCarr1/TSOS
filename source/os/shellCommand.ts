module TSOS {
    export class ShellCommand {
        constructor(public func: any,
                    public command: string = "",
                    public description: string = "", //for help command
                    public manual: string = "") { //for man command
        }
    }
}
