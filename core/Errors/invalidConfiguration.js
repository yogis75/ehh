class InvalidConfiguration extends Error{
    constructor(message){
        this.message = message;
        this.name = "Invalid Configuration"
    }
}

export {InvalidConfiguration}