module.exports = {
    async execute(bot , receiving, Langue){
        const Discord = require("@kamkam1_0/discord.js")

        if(receiving.typee === "message") return receiving.error("Pour exécuter la commande feedback, vous devez passer pour la commande slash")

        const TextInput = new Discord.TextInput()
        .setCustomID("Feedback_content")
        .setLabel("Contenu de votre feedback")
        .setMaxLength(1500)
        .setMinLength(20)
        .setPlaceHolder("Mettez ici le contenu de votre feedback")
        .setRequired(true)
        .setStyle("long")

        const Modal = new Discord.Form()
        .setCustomID("Modal Feedback")
        .setTitle("Feedback")
        .AddTextInputs(TextInput)

        receiving.reply({modal: Modal}).catch(err => {})

        bot.awaitInteractions({id: "Modal Feedback", user_id: receiving.user_id, number: 1})
        .then(int => {
            if(!int[0]) return
            const Discord = require("@kamkam1_0/discord.js")
            let feedback = int[0].components.find(e => e.components[0].custom_id === "Feedback_content").components[0].value
            let c = bot.channels.get(bot.config.general["fbackchannel"])
            if(!c){
                int[0].error(Langue["feedback_1"]).catch(err =>{})
                bot.SendMessage(bot.creator.channel_id, {content: Langue["feedback_2"]})
                return
            }
            if(!feedback || String(feedback).trim().length === 0) return int[0].error(Langue["feedback_7"]).catch(err =>{})
            if(feedback.length > 1500) return int[0].error(Langue["feedback_3"]).catch(err =>{})
            let embed = new Discord.Embed()
            .setTitle("Nouveau feedback de " + int[0].user.username)
            .setThumbnail(int[0].user.avatarURL)
            .setFooterText("User ID:" + " " + `${int[0].user.id}`)
            .addField("Contenu du feedback", feedback)
            .setColor("BLUE")
            const RespondButton = new Discord.Button()
            .setCustomID("Response_ticket_button")
            .setEmoji("📥")
            .setStyle("DANGER")
            c.send({embeds: [embed], components: [RespondButton]}).catch(err =>{ })
            int[0].success(Langue["feedback_6"]).catch(err =>{})
        })
    }
}

module.exports.help = {
    type: "Server and PV",
    autorisation: "AUCUNE",
    cooldown: 86400,
    langues: require("../Utils/getLangues")()
}