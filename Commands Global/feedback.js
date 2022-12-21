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
        .AddTextInputs([TextInput])

        receiving.reply({modal: Modal}).catch(err => {})
    }
}

module.exports.help = {
    type: "Server and PV",
    autorisation: "AUCUNE",
    cooldown: 86400,
    langues: require("../Utils/getLangues")()
}