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
            .setDescription(`${Langue["Here is my invite link"]}: https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=414464658432&scope=applications.commands%20bot\n\nDiscord: ${bot.config.general.inviteDiscord}`)
            .setFooterText(`${bot.user.tag}` + " - KamKam#6168")
            .setFooterIconURL(receiving.user.avatarURL)
            .setThumbnail(bot.user.avatarURL)
            .setColor("341eb3")
            .setTimestamp()
            receiving.reply({embeds: [embed]})
    }
}

module.exports.help = {
    type: "Server and PV",
    cooldown: 2,
    langues: require("../utils/getLangues")()
}