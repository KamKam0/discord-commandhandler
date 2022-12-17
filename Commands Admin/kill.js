module.exports = {
    async execute(bot, receiving){
        const Discord = require("Discord.js")
            const bdd = bot.config

            if(receiving.user.id !== bdd["Général"]["ID créateur"]) return
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
            receiving.reply({embeds: [embed], components: [boutton, boutton2]}).catch(err => {})
    }
}

module.exports.help = {
    name: "kill",
    type: "Server and PV",
    autorisation: "Creator"
}