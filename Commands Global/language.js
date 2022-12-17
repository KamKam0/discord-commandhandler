const autorisation = "ADMINISTRATOR"
module.exports = {
    async execute(bot , receiving, Langue){
        const fs = require("fs")
        const Discord = require("Discord.js")
        
        if(!receiving.member.haspermission(autorisation)) return receiving.error(Langue["perm_commande"])

        let Language
        if(receiving.typee === "slash"){
            Language = receiving.data.options.find(int => int.name === "language") ? receiving.data.options.find(int => int.name === "language").value: undefined
        }
        if(receiving.typee === "message"){
            Language = receiving.content.split(" ")[2]
        }

        if(!bot.sql) return receiving.error("La base de donnée SQL n'est pas initialisée")
        
        bot.sql.query(`SELECT * FROM general WHERE ID = '${receiving.guild.vguild_id}'`, function(err, vraibdd){
            if(Language === vraibdd[0]["Language"]) return receiving.error(Langue["la_1"] + " " + Language).catch(err =>{})
    
            if(!bot.langues.find(e => e.Langue_Code) || !Language){
                let embed = new Discord.Embed()
                .setTitle(Langue["l_1"])
                .setColor('LIGHT_GREY')
                let text = ""
                bot.langues.forEach(f => {
                    text += `\n\n__${Langue["Langue"]}__: **${Langue["Langue_Code"]}**`
                })
                embed.setDescription(text)
                receiving.reply({embeds: [embed]})
                return
            }
    
            bot.sql.query(`UPDATE general SET Language = '${Language}' WHERE ID = '${receiving.guild.vguild_id}'`)
            receiving.guild.db_language = Language
            receiving.success(bot.langues.find(e => e.Langue_Code)["la_3"])
            .catch(err => {})
        })
    }
}

module.exports.help = {
    cooldown: 10,
    autorisation: autorisation,
    options: [
        {
          name: "language",
          required: true,
          type: 3
        }
    ]
}