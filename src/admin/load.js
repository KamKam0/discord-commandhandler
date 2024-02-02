module.exports = {
    async execute(bot, receiving){
        if(receiving.user.id !== bdd["general"]["creatorId"]) return

        let method = receiving.content.split(" ")[2]
        let pcmd = receiving.content.split(" ")[3]

        if(!method || !pcmd) {
            return receiving.error("La méthode ou la commande n'est pas indiqué")
        }

        if(!["unload", "reload"].includes(method)) {
            return receiving.error("La méthode n'est pas correcte (unload, reload)")
        }

        let cmd = bot.handler.getCommand(pcmd)

        if(!cmd) {
            return receiving.error("La commande n'a pas été trouvée")
        }

        if(method === "unload") {
            bot.handler.getHandler(cmd.handler).removeCommand(cmd.name)
        }
        if(method === "reload") {
            bot.handler.getHandler(cmd.handler).removeCommand(cmd.name)
            bot.handler.getHandler(cmd.handler).addCommand(cmd.name, require(cmd.path), path, cmd.handler)
        }

        receiving.success(`La commande a bien été ${method}`)
    }
}
module.exports.help = {
    dm: true,
    langues: true
}