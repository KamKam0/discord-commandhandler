const autorisation = "ADMINISTRATOR"
module.exports = {
    async execute(bot , receiving, Langue){
        const Discord = require("@kamkam1_0/discord.js")
        
        if(!receiving.member.haspermission(autorisation)) return receiving.error(Langue["perm_commande"])

        let Language
        if(receiving.typee === "slash") Language = receiving.data.options?.find(int => int.name === "language") ? receiving.data.options.find(int => int.name === "language")?.value : undefined
        if(receiving.typee === "message") Language = receiving.content ? receiving.content.split(" ")[2] : undefined
        
        let vraibdd = await bot.sql.select("general", {ID: receiving.guild.id})
        if(Language === vraibdd[0]["Language"]) return receiving.error(Langue["la_1"] + " " + Language).catch(err =>{})
    
        if(!Language || !bot.langues.find(e => e.Langue_Code === Language)){
            let embed = new Discord.Embed()
            .setTitle(Langue["l_1"])
            .setColor('LIGHT_GREY')
            let text = bot.langues.map(lang => `__${lang["Langue"]}__: **${lang["Langue_Code"]}**`).join("\n\n")
            embed.setDescription(text)
            receiving.reply({embeds: [embed]})
            return
        }

        bot.sql.update("general", {Language}, {ID: receiving.guild.id})
        receiving.guild.db_language = Language
        receiving.success(bot.langues.find(e => e.Langue_Code === Language)["la_3"])
        .catch(err => {})
    }
}

module.exports.help = {
    cooldown: 10,
    autorisation: autorisation,
    options: [
        {
          name: "language",
          required: false,
          type: 3
        }
    ],
    langues: require("../Utils/getLangues")()
}