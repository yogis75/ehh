class ModuleNotFound extends Error{
    super()
    constructor(message){
        this.message = message;
        this.name = "Invalid Configuration"
    }
}

export {ModuleNotFound}