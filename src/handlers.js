const Handler = require("./handler")
const systemLanguages = require("./utils/getLangues")()

class Handlers{
    #systemLanguages

    constructor(langues){

        this.names = []
        this.langues = langues
        this.handlers = this.automaticAdd()
        this.#systemLanguages = systemLanguages
    }

    addLanguage(json){
        let validatedData = null;
        try{
            validatedData = JSON.parse(json)
        }catch(err){
            return this
        }
        if(!validatedData["commands"] || !validatedData["choices"] || !validatedData["options"] || !validatedData["languageCode"] || !validatedData["langue"]) return this
        this.#systemLanguages.push(validatedData)
        return this
    }

    getLanguages(){
        return this.#systemLanguages
    }

    automaticAdd(){
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

    addHandler(name, level){
        if(!name || typeof name !== "string" || name.length > 50 || !level || typeof level !== "string" || level.length > 50) return "invalid name or level"
        if(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "already existing"
        const vc = new Handler(name, level, this.langues)
        let datas = vc.getAll()
        this.names.push(datas.name)
        this.handlers.push(datas.to_push)
    }

    deleteHandler(name){
        if(!name || typeof name !== "string") return "invalid name"
        if(!this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return "no handler for this name"
        this.names.splice(this.names.indexOf(this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())), 1)
        this.handlers.splice(this.handlers.indexOf(this.handlers.find(e => String(e.name).toLowerCase()=== String(name).toLowerCase())), 1)
    }

    getHandler(name){
        if(!name || typeof name !== "string") return null
        if(!this.names.find(e => String(e).toLowerCase() === String(name).toLowerCase())) return null
        return this.handlers.find(c => String(c.name).toLowerCase() === String(name).toLowerCase())
    }

    deploy(){
        const fs = require("node:fs")
        if(fs.readdirSync(`${process.cwd()}`).includes("Handler")) if(fs.readdirSync(`${process.cwd()}/Handler`).filter(e => !["Systeme", "Events", "Admin", "Process", ".DS_Store"].includes(e)[0])) fs.readdirSync(`${process.cwd()}/Handler`).filter(e => !["Systeme", "Events", "VIP", "Admin", "Process", ".DS_Store"].includes(e)).forEach(dir => {
            if(!this.getHandler(dir)) this.addHandler(dir, "User")
            fs.readdirSync(`${process.cwd()}/Handler/${dir}`).filter(e => e!==".DS_Store").forEach(command => {
                let path = `${process.cwd()}/Handler/${dir}/${command}`
                let file = require(path)
                this.getHandler(dir).addCommand(command.split(".")[0], file, path, dir)
            })
        })
    }

    getCommand(namee){
        let cmd;
        this.names.forEach(name => {
            let commandsHandler = this.handlers.find(c => c.name === name)
            if(!cmd && commandsHandler?.getCommand(namee)) cmd = commandsHandler?.getCommand(namee)
        })
        if(!cmd) cmd = null
        return cmd
    }

    getCommands(){
        let commands = []
        this.names.forEach(name => {
            let commandsHandler = this.handlers.find(c => c.name === name)
            if(commandsHandler) commands.push(...commandsHandler.getCommands())
        })
        return commands
    }

    getCommandfi(namee){
        let cmd;
        this.names.filter(na => !(/(Admin|VIP)/gm).test(na)).forEach(name => {
            let commandsHandler = this.handlers.find(c => c.name === name)
            if(!cmd && commandsHandler?.getCommand(namee)) cmd = commandsHandler?.getCommand(namee)
        })
        if(!cmd) cmd = null
        return cmd
    }

    getCommandsfi(){
        let commands = []
        this.names.filter(na => !(/(Admin|VIP)/gm).test(na)).forEach(name => {
            let commandsHandler = this.handlers.find(c => c.name === name)
            if(commandsHandler) commands.push(...commandsHandler.getCommands())
        })
        return commands
    }

    async analyse(bot, receiving){
        let type_s = await bot._userStatus(receiving.user_id)
        let name;
        let command;

        if(receiving.receivingType === "message") name = receiving.content.split(bot.user.id)[1].slice(1).split(" ").filter(e => e !== "")[0]
        else if(receiving.receivingType === "interaction") name = receiving.name

        if(!name) return
        
        if(type_s.value === 4 || type_s.value === 3) command = this.getCommand(name)
        if(type_s.value === 1) command = this.getCommandfi(name) || this.getHandler("VIP").getCommand(name)
        if(type_s.value === 2) command = this.getCommandfi(name) || this.getHandler("Admin").getCommand(name)
        if(type_s.value === 0) command = this.getCommandfi(name)
        
        let Langue = this.#findLangue(bot, receiving)


        let languageSystem = this.#systemLanguages.find(lan => lan.languageCode === Langue.languageCode) || this.#systemLanguages.find(lan => lan.languageCode === bot.config.general.language) || this.#systemLanguages.find(lan => lan.languageCode === "en-US")

        if(command){
            if(command.help.message === false && receiving.receivingType === "message") return

            if(receiving.guild_id && command.onlydm) return receiving.reply({content: languageSystem["la_239"], ephemeral: true}).catch(err => {})
            if(!receiving.guild_id && !command.dm_permission) return receiving.reply({content: languageSystem['la_326'], ephemeral: true}).catch(err => {})
            
            if(receiving.user_id !== bot.config.general["ID createur"] && command.help.cooldown){
                if(bot.cooldown && bot.cooldown.GetCooldown("global")) if(bot.cooldown.GetCooldown("global").GetUser(receiving.user_id, [])) return bot.warn_se(languageSystem["cold_err3"].replace("00", bot.cooldown.GetCooldown("global").GetUser(receiving.user_id, []).GetTime()), receiving).catch(err => {})
                if(bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}])){
                    
                    if(bot.cooldown.GetCooldown("verif").GetUser(receiving.user_id, [{command: command.name}])) return
                    
                    bot.cooldown.GetCooldown("verif").AddUser({id: receiving.user_id, properties: [{command: command.name}], time: bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}]).GetTime()})
                    return receiving.warn(languageSystem["cold_err"].replace("00", bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}]).GetTime() + " seconds")).catch(err => {console.log(err)})
                }
                
                if(bot.cooldown && bot.cooldown.GetCooldown("global")) bot.cooldown.GetCooldown("global").AddUser({id: receiving.user_id, time: 10})
                bot.cooldown.GetCooldown("commands").AddUser({id: receiving.user_id, properties: [{command: command.name}], time: Number(command.help.cooldown)})
            }

            if(command.name === "help") command.execute(bot, receiving, Langue, languageSystem)
            else if(command.help.langue) Langue = languageSystem
            
            if(command.name !== "help") command.execute(bot, receiving, Langue)
        }

        if(!command && receiving.receivingType === "interaction"){
            bot.commands.delete(bot.user.id, receiving);
            receiving.info(languageSystem["Int_err"]).catch(err => {})
            return
        }
    }

    #findLangue(bot, receiving){
        let LangueIntern;
        if(receiving.guild_id){
            let baseFoundLanguage = bot.langues.find(lan => lan.languageCode === receiving.guild.preferred_locale)
            if(baseFoundLanguage) LangueIntern = baseFoundLanguage
            else LangueIntern = bot.langues.find(lan => lan.languageCode === bot.config.general.language)
        }else if (receiving.typee === "slash"){
            let baseFoundLanguage = bot.langues.find(lan => lan.languageCode === receiving.locale)
            if(baseFoundLanguage) LangueIntern = baseFoundLanguage
            else bot.langues.find(lan => lan.languageCode === bot.config.general.language)
        }else LangueIntern = bot.langues.find(lan => lan.languageCode === bot.config.general.language)
        return LangueIntern
    }
}

module.exports = Handlers