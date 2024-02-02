const Discord = require("@kamkam1_0/discord.js")

module.exports = {
    async execute(bot , receiving, Langue){

        let embed = new Discord.Embed()
        .setTitle(Langue["bot_s1"])
        .setDescription(`${Langue["Here is my invite link"]}: https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=414464658432&scope=applications.commands%20bot\n\nDiscord: ${bot.config.general.inviteDiscord}`)
        .setFooterText(`${bot.user.tag}`)
        .setFooterIconURL(receiving.user.avatarURL)
        .setThumbnail(bot.user.avatarURL)
        .setColor("341eb3")
        .setTimestamp()
        
        receiving.reply({embeds: [embed]})
    }
}

module.exports.help = {
    dm: true,
    cooldown: 2,
    langues: true
}