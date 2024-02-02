const Discord = require("@kamkam1_0/discord.js")
const getUptime = require('../utils/getUptime')

module.exports = {
    async execute(bot , receiving, Langue){
        let uptime = getUptime()
        
        let embed = new Discord.Embed()
        .setTitle(Langue["bot_s1"])
        .addFields(
            {name: Langue["Nom"], value: bot.user.username, inline: true},
            {name: Langue["ID"], value: bot.user.id, inline: true},
            {name: "\u200b", value: "\u200b", inline: false},
            {name: Langue["Photo de profil"], value: bot.user.avatarURL, inline: true},
            {name: Langue["Uptime"], value: uptime, inline: true},
            {name: "\u200b", value: "\u200b", inline: false},
            {name: "Guild count", value: `${bot.guilds.length}`, inline: true},
            {name: "Users count", value: `${bot.guilds.map(g => g.members.length).reduce((a, b) => (a + b))}`, inline: true},
        )
        .setFooterText(`${bot.user.tag}`)
        .setFooterIconURL(bot.user.avatarURL)
        .setThumbnail(bot.user.avatarURL)
        .setColor("341eb3")
        .setTimestamp()
        
        receiving.reply({embeds: [embed]}).catch(err => {})
    }
}

module.exports.help = {
    dm: true,
    cooldown: 2,
    langues: true
}