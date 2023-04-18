const Command = require("./command")
class Handler{
    constructor(name, level, langues){
        this.name = name
        this.level = level
        this.langues = langues
        this.ar = this.init()
    }

    getAll(){
        return {name: this.name, level: this.level, to_push: this}
    }

    addCommand(name, datas, path){
        if(this.ar.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())) return "already exists"
        datas.help.name = name
        const co = new Command(name, datas, path, this.name, this.langues)
        this.ar.push(co)
    }

    removeCommand(name){
        if(!name || typeof name !== "string") return "invalid name"
        this.ar.splice(this.ar.indexOf(this.ar.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())), 1)
    }

    getCommand(name){
        if(!name || typeof name !== "string") return "invalid name"
        let first_try = this.ar.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())
        let second_try = this.ar.find(cmd => cmd.names.find(na => String(na).toLowerCase() === String(name).toLowerCase()))
        if(first_try) return first_try
        else if(second_try) return second_try
        else return null
    }

    getCommands(){
        return this.ar
    }

    init(){
        if(this.name === "Admin" || this.name === "Global"){
            let liste;
            if(this.name === "Admin") liste = ["bia.js", "kill.js", "load.js"]
            if(this.name === "Global") liste = ["botinfo.js", "feedback.js", "help.js", "invite.js", "ping.js"]
            let base = []
            liste.forEach(dir => {
                let path = `./Commands ${this.name}/${dir}`
                let file = require(path)
                if(base.find(e => String(e.name).toLowerCase() === String(dir.split(".")[0]).toLowerCase())) return "already exists"
                const co = new Command(dir.split(".")[0], file, require.resolve(path), this.name, this.langues)
                base.push(co)
            })
            return base
        } else return []
    }
}

module.exports = Handler