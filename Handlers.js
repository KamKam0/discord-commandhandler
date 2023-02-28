const Handler = require("./Handler")
class Handlers{
    constructor(name, langues){
        this.names = []
        this.langues = langues
        this.systemLanguages = require("./Utils/getLangues")()
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
        const fs = require("node:fs")
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

    async Analyse(bot, receiving){
        let type_s = await bot.__userStatus(receiving.user_id)
        let name;
        let command;

        if(receiving.typee === "message") name = receiving.content.split(bot.user.id)[1].slice(1).split(" ").filter(e => e !== "")[0]
        else if(receiving.typee === "slash") name = receiving.data.name

        if(name === undefined) return

        let discordCommandOriginal = bot.commands.find(cmd => cmd.name === name || Object.values(cmd.name_localizations).includes(name))

        if(discordCommandOriginal || receiving.typee === "message"){
            if(type_s.value === 4 || type_s.value === 3) command = this.GetCommand(discordCommandOriginal?.name || name)
            if(type_s.value === 1) command = this.GetCommand_fi(discordCommandOriginal?.name || name) || this.GetHandler("VIP").GetCommand(discordCommandOriginal?.name || name)
            if(type_s.value === 2) command = this.GetCommand_fi(discordCommandOriginal?.name || name) || this.GetHandler("Admin").GetCommand(discordCommandOriginal?.name || name)
            if(type_s.value === 0) command = this.GetCommand_fi(discordCommandOriginal?.name || name)
        }
        
        let Langue = await this.#findLangue(bot, receiving)
        let languageSystem = this.systemLanguages.find(lan => lan.Langue_Code === Langue.Langue_Code) || this.systemLanguages.find(lan => lan.Langue_Code === bot.config.general.language) || this.systemLanguages.find(lan => lan.Langue_Code === "en-US")

        if(command){
            if(receiving.guild_id && command.onlydm) return receiving.reply({content: languageSystem["la_239"], ephemeral: true}).catch(err => {})
            if(!receiving.guild_id && !command.dm_permission) return receiving.reply({content: languageSystem['la_326'], ephemeral: true}).catch(err => {})
            
            if(receiving.user_id !== bot.config.general["ID createur"] && command.help.cooldown){
                if(bot.cooldown && bot.cooldown.GetCooldown("global")) if(bot.cooldown.GetCooldown("global").GetUser(receiving.user_id, [])) return bot.warn_se(languageSystem["cold_err3"].replace("00", bot.cooldown.GetCooldown("global").GetUser(receiving.user_id, []).GetTime()), receiving).catch(err => {})
                if(bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}])){
                    
                    if(bot.cooldown.GetCooldown("verif").GetUser(receiving.user_id, [{command: command.name}])) return
                    
                    bot.cooldown.GetCooldown("verif").AddUser({id: receiving.user_id, properties: [{command: command.name}], time: bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}]).GetTime()})
                    return bot.warn_se(languageSystem["cold_err"].replace("00", bot.cooldown.GetCooldown("commands").GetUser(receiving.user_id, [{command: command.name}]).GetTime()), receiving).catch(err => {})
                }
                
                if(bot.cooldown && bot.cooldown.GetCooldown("global")) bot.cooldown.GetCooldown("global").AddUser({id: receiving.user_id, time: 10})
                bot.cooldown.GetCooldown("commands").AddUser({id: receiving.user_id, properties: [{command: command.name}], time: Number(command.help.cooldown)})
            }

            if(command.name === "help") command.execute(bot, receiving, Langue, command.help.langues.find(la => la.Langue_Code === Langue.Langue_Code))
            else if(command.help.langues && command.help.langues[0] && command.help.langues.find(la => la.Langue_Code === Langue.Langue_Code)) Langue = command.help.langues.find(la => la.Langue_Code === Langue.Langue_Code)
            
            if(command.name !== "help") command.execute(bot, receiving, Langue)
        }

        if(!command && receiving.typee === "slash"){
            bot.commands.delete(bot.user.id, receiving);
            receiving.info(languageSystem["Int_err"]).catch(err => {})
            return
        }
    }

    async #findLangue(bot, receiving){
        let Langue;
        if(receiving.guild_id){
            let datasGuild = (await bot.sql.select("general", {ID: receiving.guild_id}))?.[0]
            if(datasGuild) Langue = bot.langues.find(lan => lan.Langue_Code === datasGuild.Language)
            else Langue = bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
        }else if (receiving.typee === "slash"){
            Langue = bot.langues.find(lan => lan.Langue_Code === receiving.locale)
            if(!Langue) bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
        }else Langue = bot.langues.find(lan => lan.Langue_Code === bot.config.general.language)
        return Langue
    }
}

module.exports = Handlers