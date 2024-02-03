module.exports = {
    async execute(bot, receiving){
        if(receiving.user.id !== bot.config["general"]["creatorId"]) return

        let pcmd = receiving.content.split(" ")[2]

        if(!pcmd) {
            return receiving.error("La méthode ou la commande n'est pas indiqué")
        }

        let cmd = bot.handler.getCommand(pcmd)

        if(!cmd) {
            return receiving.error("La commande n'a pas été trouvée")
        }

        bot.handler.getHandler(cmd.handler).removeCommand(cmd.name)

        receiving.success(`La commande a bien été ${method}`)
    }
}
module.exports.help = {
    dm: true,
    langues: true
}