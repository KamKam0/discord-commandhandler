const Handler = require("./Handler")
class Handlers{
    constructor(name, langues){
        this.names = []
        this.langues = langues
        this.handlers = this.AutomaticAdd()
        this.bot_name = name
    }

    AutomaticAdd(){
        if(this.names.length === 0){
            let defa_eve = ["Commands Admin", "Commands Global"]
            let defaulte = []
            const conv = {
                "Global": "User",
                "Admin": "Admin"
            }
            defa_eve.forEach(de => {
                let name = de.split("Commands")[1].trim()
                if(name.includes(".")) name = name.split(".")[0]
                if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "already exists"
                const co = new Handler(name, conv[name], this.langues)
                defaulte.push(co)
                this.names.push(name)
            })
            return defaulte
        }
    }

    AddHandler(name, level){
        if(!name || typeof name !== "string" || name.length > 50 || !level || typeof level !== "string" || level.length > 50) return "invalid name or level"
        if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "already existing"
        const vc = new Handler(name, level, this.langues)
        let datas = vc.GetAll()
        this.names.push(datas.name)
        this.handlers.push(datas.to_push)
    }

    DeleteHandler(name){
        if(!name || typeof name !== "string") return "invalid name"
        if(!this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "no handler for this name"
        this.names.splice(this.names.indexOf(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())), 1)
        this.handlers.splice(this.handlers.indexOf(this.handlers.find(e => String(e.name).toLowerCase()=== String(name).toLowerCase())), 1)
    }

    GetHandler(name){
        if(!name || typeof name !== "string") return null
        if(!this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return null
        return this.handlers.find(c => String(c.name).toLowerCase() === String(name).toLowerCase())
    }

    Deploy(){
        if((/(EcoleDirecte|Pronote)/gm).test(this.bot_name)) this.AddHandler("Vip", "VIP")
        const fs = require("fs")
        if(fs.readdirSync(`${process.cwd()}`).includes("Handler")) if(fs.readdirSync(`${process.cwd()}/Handler`).filter(e => !["Systeme", "Events", "Admin", "Process", ".DS_Store"].includes(e)[0])) fs.readdirSync(`${process.cwd()}/Handler`).filter(e => !["Systeme", "Events", "VIP", "Admin", "Process", ".DS_Store"].includes(e)).forEach(dir => {
            if(!this.GetHandler(dir)) this.AddHandler(dir, "User")
            fs.readdirSync(`${process.cwd()}/Handler/${dir}`).filter(e => e!==".DS_Store").forEach(command => {
                let path = `${process.cwd()}/Handler/${dir}/${command}`
                let file = require(path)
                this.GetHandler(dir).AddCommand(command.split(".")[0], file, path, dir)
            })
        })
    }

    GetCommand(namee){
        let cmd;
        this.names.forEach(name => {
            if(!cmd && this.handlers.find(c => c.name === name).GetCommand(namee)) cmd = this.handlers.find(c => c.name === name).GetCommand(namee)
        })
        if(!cmd) cmd = null
        return cmd
    }

    GetCommand_fi(namee){
        let cmd;
        this.names.filter(na => !(/(Admin|VIP)/gm).test(na)).forEach(name => {
            if(!cmd && this.handlers.find(c => c.name === name).GetCommand(namee)) cmd = this.handlers.find(c => c.name === name).GetCommand(namee)
        })
        if(!cmd) cmd = null
        return cmd
    }

    GetAllCommands(){
        let commands = []
        this.names.forEach(name => {
            if(this.handlers.find(c => c.name === name)) commands.push(...this.handlers.find(c => c.name === name).GetCommands())
        })
        return commands
    }

    GetAllCommandsfi(){
        let commands = []
        this.names.filter(na => !(/(Admin|VIP)/gm).test(na)).forEach(name => {
            if(this.handlers.find(c => c.name === name)) commands.push(...this.handlers.find(c => c.name === name).GetCommands())
        })
        return commands
    }

    async Analyse(bot, receiving, Langue, cooldown){
        let type_s = await bot.vstatus(bot, receiving.user_id)
        let name;
        let command;
        if(receiving.typee === "message") name = receiving.content.split(bot.user.id)[1].slice(1).split(" ").filter(e => e !== "")[0]
        else if(receiving.typee === "slash") name = receiving.data.name

        if(name === undefined) return
        
        if(type_s === "ALL") command = this.GetCommand(name)
        if(type_s === "VIP") command = this.GetCommand_fi(name) || this.GetHandler("VIP").GetCommand(name)
        if(type_s === "Admin") command = this.GetCommand_fi(name) || this.GetHandler("Admin").GetCommand(name)
        if(type_s === "User") command = this.GetCommand_fi(name)

        if(command){
            if(!receiving.guild_id){
                if(command.help.type){
                    if(!command.help.type.includes("PV")){
                        if(receiving.typee === "slash") receiving.reply({content: Langue["la_326"], ephemeral: true}).catch(err => {})
                        return
                    }
                }else{
                    if(receiving.typee === "slash") receiving.reply({content: Langue["la_326"], ephemeral: true}).catch(err => {})
                    return
                }
            }

            if(receiving.user_id !== bot.config.general["ID createur"] && command.help.cooldown){
                if(cooldown && cooldown.global) if(bot.cooldown.GetCooldown("global").Get({id: receiving.user_id})) return bot.warn_se(Langue["cold_err3"].replace("00", bot.cooldown.GetCooldown("global").Get({id: receiving.user_id}).GetTime()), receiving).catch(err => {})
                if(bot.cooldown.GetCooldown("commands").Get({id: receiving.user_id, cmd: command.name})){
                    
                    if(bot.cooldown.GetCooldown("verif").Get({id: receiving.user_id, cmd: command.name})) return
                    
                    bot.cooldown.GetCooldown("verif").AddUser({id: receiving.user_id, cmd: command.name, time: bot.cooldown.GetCooldown("commands").Get({id: receiving.user_id, cmd: command.name}).GetTime(), date: Date.now()})
                    return bot.warn_se(Langue["cold_err"].replace("00", bot.cooldown.GetCooldown("commands").Get({id: receiving.user_id, cmd: command.name}).GetTime()), receiving).catch(err => {})
                }
                
                if(cooldown && cooldown.global) bot.cooldown.GetCooldown("global").AddUser({id: receiving.user_id, time: 10, date: Date.now()})
                bot.cooldown.GetCooldown("commands").AddUser({id: receiving.user_id, cmd: command.name, time: Number(command.help.cooldown), date: Date.now()})
            }

            if(command.help.langues && command.help.langues[0] && command.help.langues.find(la => la.Langue_Code === Langue.Langue_Code)) Langue = command.help.langues.find(la => la.Langue_Code === Langue.Langue_Code)
            
            command.execute(bot, receiving, Langue)
        }

        if(!command && receiving.typee === "slash"){
            bot.DeleteSlashCommand(bot.user.id, receiving);
            receiving.info(Langue["Int_err"]).catch(err => {})
            return
        }
    }
}

module.exports = Handlers