module.exports = {
    async execute(bot, receiving, Langue){
        const Discord = require("@kamkam1_0/discord.js")
        let embed = new Discord.Embed()
        .setAuthorName(Langue["Pong"] + " 🏓")
        .setColor("GREEN")
        if(receiving.typee === "message") embed.addField(Langue["Latence Message"], `${Date.now() - Date.parse(new Date(receiving.timestamp).toUTCString("fr"))} ms`)
        if(receiving.typee === "slash") embed.addField(Langue["Latence Message"], `${Date.now() - Date.parse(receiving.createdAt)} ms`)

        receiving.reply({embeds: [embed]}).catch(err => { })
    }
}

module.exports.help = {
    autorisation: "Aucune",
    cooldown: 2,
    type: "Server & PV",
    langues: require("../Utils/getLangues")()
}