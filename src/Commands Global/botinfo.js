module.exports = {
    async execute(bot , receiving, Langue){
        const Discord = require("@kamkam1_0/discord.js")
        
        let time = (process.uptime()).toFixed(0)
        let def;
        if(Number((time / 60 / 60 /24).toString().split(".")[0]) > 1) def =  `${(time / 60 / 60 /24).toString().split(".")[0]} jour(s) -> ${(time / 60 / 60).toString().split(".")[0]} heure(s)`
        else if(Number((time / 60 / 60).toString().split(".")[0]) > 60) def =  `${(time / 60 / 60).toString().split(".")[0]} heure(s) -> ${(time/60).toString().split(".")[0]} minute(s)`
        else if(Number((time/60).toString().split(".")[0]) > 60) def =  `${(time/60).toString().split(".")[0]} minute(s) -> ${time} seconde(s)`
        else def =  `${time} seconde(s)`
        
        let embed = new Discord.Embed()
            .setTitle(Langue["bot_s1"])
            .addFields(
                {name: Langue["Nom"], value: bot.user.username, inline: true},
                {name: Langue["ID"], value: bot.user.id, inline: true},
                {name: "\u200b", value: "\u200b", inline: false},
                {name: Langue["Photo de profil"], value: bot.user.avatarURL, inline: true},
                {name: Langue["Uptime"], value: def, inline: true},
                {name: "\u200b", value: "\u200b", inline: false},
                {name: Langue["Propriété de"], value: "KamKam#6168", inline: true},
                {name: Langue["Développé par"], value: "KamKam#6168", inline: true},
                {name: "\u200b", value: "\u200b", inline: false},
                {name: Langue["Serveur Support"], value: bot.config["general"]["inviteDiscord"], inline: true},
                {name: Langue["Sécurité"], value: Langue["SCT1"], inline: true},
                {name: "\u200b", value: "\u200b", inline: false},
                {name: Langue["Darkness"], value: Langue["Darkness1"], inline: true}
            )
            .setFooterText(`${bot.user.tag}` + " - KamKam#6168")
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
    langues: require("../utils/getLangues")()
}