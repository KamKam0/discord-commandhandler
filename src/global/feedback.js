const Discord = require("@kamkam1_0/discord.js")

module.exports = {
    async execute(bot , receiving, Langue){
        if(receiving.receivingType === "message") {
            return receiving.error("Pour exécuter la commande feedback, vous devez passer pour la commande slash")
        }

        const TextInput = new Discord.TextInput()
        .setCustomID("feedback_content")
        .setLabel(Langue["feedbackContent"])
        .setMaxLength(1500)
        .setMinLength(20)
        .setPlaceHolder(Langue["feedbackPlaceHolder"])
        .setRequired(true)
        .setStyle("Long")

        const Modal = new Discord.Modal()
        .setCustomID("modal_feedback")
        .setTitle(Langue["feedbackTitle"])
        .AddTextInputs(TextInput)

        receiving.reply({modal: Modal}).catch(err => {})

        bot.commands.awaitInteractions({id: "modal_feedback", user_id: receiving.user_id, number: 1})
        .then(int => {
            if(!int[0]) return

            let feedback = int[0].getComponent("feedback_content").value
            let feedbackChannel = bot.channels.get(bot.config.general["fbackchannel"])

            if(!feedbackChannel){
                if (bot.creator?.channel_id) {
                    int[0].error(Langue["feedback_1"]).catch(err =>{})
                    bot.messages.send(bot.creator.channel_id, {content: Langue["feedback_2"]})
                    return
                }else{
                    int[0].error(Langue["feedback_1_err"]).catch(err =>{})
                    return
                }
            }

            if(!feedback || String(feedback).trim().length === 0) return int[0].error(Langue["feedback_7"]).catch(err =>{})

            if(feedback.length > 1500) return int[0].error(Langue["feedback_3"]).catch(err =>{})

            let embed = new Discord.Embed()
            .setTitle(Langue["newFeedback"] + int[0].user.username)
            .setThumbnail(int[0].user.avatarURL)
            .setFooterText(Langue["userId"] + " " + `${int[0].user.id}`)
            .addField(Langue["feedbackContentE"], feedback)
            .setColor("BLUE")

            const RespondButton = new Discord.Button()
            .setCustomID("response_ticket_button")
            .setEmoji("📥")
            .setStyle("Danger")

            feedbackChannel.send({embeds: [embed], components: [RespondButton]}).catch(err =>{ })
            int[0].success(Langue["feedback_6"]).catch(err =>{})
        })
    }
}

module.exports.help = {
    dm: true,
    cooldown: 1000 * 60 * 60 * 24,
    langues: true
}