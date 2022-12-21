module.exports = {
    async execute(bot, receiving){
        let method = receiving.content.split(" ")[2]
        let pcmd = receiving.content.split(" ")[3]

        if(!method || !pcmd) return receiving.error("La méthode ou la commande n'est pas indiqué")

        if(!["unload", "reload"].includes(method)) return receiving.error("La méthode n'est pas correcte (unload, reload)")

        let cmd = bot.handler.GetCommand(pcmd)

        if(!cmd) return receiving.error("La commande n'a pas été trouvée")

        let path = cmd.path

        if(method === "unload") bot.handler.GetHandler(cmd.handler).RemoveCommand(cmd.name)
        if(method === "reload") {
            bot.handler.GetHandler(cmd.handler).RemoveCommand(cmd.name)
            bot.handler.GetHandler(cmd.handler).AddCommand(cmd.name, require(path), path, cmd.handler)
        }

        receiving.success(`La commande a bien été ${method}`)
    }
}
module.exports.help = {
    type: "Server and PV",
    autorisation: "createur",
    langues: require("../Utils/getLangues")()
}