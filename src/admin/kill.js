const Discord = require("@kamkam1_0/discord.js")

module.exports = {
    async execute(bot, receiving){
        if(receiving.user.id !== bot.config["general"]["creatorId"]) return

        const embed = new Discord.Embed()
        .setColor("RED")
        .setDescription("Êtes-vous sur de vouloir éteindre le bot sans possibilité de redémarrage à distance ?")

        const boutton = new Discord.Button()
        .setEmoji("✅")
        .setCustomID("kill")
        .setStyle("DANGER")

        const boutton2 = new Discord.Button()
        .setEmoji("❌")
        .setCustomID("not_kill")
        .setStyle("SECONDARY")

        let msg = await receiving.reply({embeds: [embed], components: [boutton, boutton2]}).catch(err => {})
        
        bot.awaitInteractions({channel_id: msg.channel_id, message_id: msg.id, time: 15, id: ["kill", "not_kill"], number: 1, user_id: bot.config.general["creatorId"]})
        .then(int => {
            msg.delete()

            if(!int[0]) return
            if(int[0].custom_id === "kill") {
                int[0].info("Le bot s'éteint !", "send").then(() => process.exit()).catch(err => {})
            }
            if(int[0].custom_id === "not_kill") {
                int[0].info("Le bot ne s'éteindra pas !", "send").catch(err => {})
            }
        })
        .catch(err => msg.delete())
    }
}

module.exports.help = {
    dm: true,
    langues: true
}