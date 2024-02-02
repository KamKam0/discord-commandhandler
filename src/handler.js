const Command = require("./command")
const fs = require("node:fs")

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
        let command = this.ar.find(e => String(e.name).toLowerCase() === String(name).toLowerCase())
        if(command) this.ar.splice(this.ar.indexOf(command), 1)
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
        if(this.name === "admin" || this.name === "global"){
            let liste;
            if(this.name === "admin"){
                let path = require.resolve("./admin/kill.js")
                liste = fs.readdirSync(path.split("kill")[0])
            }
            if(this.name === "global"){
                let path = require.resolve("./global/help.js")
                liste = fs.readdirSync(path.split("help")[0])
            }
            let base = []
            liste.forEach(dir => {
                let path = `./${this.name}/${dir}`
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