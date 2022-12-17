module.exports = {
    async execute(bot, receiving){
        const Discord = require("@kamkam1_0/discord.js")
        let embed = new Discord.Embed()
        const bdd = bot.config

        let action
        
        let ID
        
        let Pseudo

        if(receiving.typee === "slash"){
            action = receiving.data.options.find(int => int.name === "1") ? receiving.data.options.find(int => int.name === "1").value: undefined
            ID = receiving.data.options.find(int => int.name === "2") ? receiving.data.options.find(int => int.name === "2").value: undefined
            Pseudo = receiving.data.options.find(int => int.name === "3") ? receiving.data.options.find(int => int.name === "3").value: undefined
        }
        if(receiving.typee === "message"){
            action = receiving.content.split(" ")[2]
            ID = receiving.content.split(" ")[3]
            Pseudo = receiving.content.split(" ")[4]
        }
        
        if(ID){
            if(ID.length === 21 || ID.length === 22){
                if(ID.length === 22) ID = ID.slice(3, -1)
                else ID = ID.slice(2, -1)
                
            }
            else if(ID.length === 18) ID = ID
            else ID = undefined
        }

        if(!bot.sql) return receiving.error("La base de donnée SQL n'est pas initialisée")

        bot.sql.query(`SELECT * FROM admin`, async function(err, result){
            switch(action){
                case("add"):
                    if(receiving.user.id !== bdd["Général"]["ID créateur"]) return
                    if(result[0]) if(result.find(c => bot.decryptID(c.ID) == ID)) return receiving.error("L'ID est déjà enregistré sous le pseudo de " + result.find(c => bot.decryptID(c.ID) == ID).Pseudo).catch(err => {})
                    if(!Pseudo) Pseudo = "/"
                    bot.sql.query(`INSERT INTO admin (Pseudo, ID) VALUES ('${Pseudo}', '${bot.encryptID(ID)}')`)
                    receiving.success("L'ID a bien été enregistré en tant qu'administrateur").catch(err =>{})
                    if(bot.users.find(us => us.id === ID)){
                        let User = bot.users.find(us => us.id === ID)
                        embed.setTitle("System Notification")
                        .setAuthorName(bot.user.username)
                        .setAuthorIconURL(bot.user.avatarURL)
                        .setColor("GOLD")
                        .setDescription(`Hello ${User.username} ! This is an automatic system notification: KamKam#6168 added you on the admin list of the bot !`)
                        .setFooterText(User.username)
                        .setFooterIconURL(User.avatarURL)
                        User.send({embeds: [embed]})
                    } 
                break;
                case("remove"):
                    if(receiving.user.id !== bdd["Général"]["ID créateur"]) return
                    if(!ID || isNaN(ID)) return receiving.error("Vous avez fait une erreur dans la commande").catch(err =>{})
            
                    if(!result[0]) return receiving.error("L'ID n'est pas inscrit en tant qu'administarteur du bot du bot").catch(err =>{})
                    if(!result.find(c => bot.decryptID(c.ID) === ID)) return receiving.error("L'ID n'est pas inscrit en tant qu'administarteur du bot du bot").catch(err =>{})
            
                    bot.sql.query(`DELETE FROM admin WHERE ID = '${result.find(c => bot.decryptID(c.ID) === ID).ID}'`)
                
                    receiving.success("L'ID " + ID + " a bien été supprimé des admins du bot").catch(err =>{})
                    if(bot.users.find(us => us.id === ID)){
                        let User = bot.users.find(us => us.id === ID)
                        embed.setTitle("System Notification")
                        .setAuthorName(bot.user.username)
                        .setAuthorIconURL(bot.user.avatarURL)
                        .setColor("RED")
                        .setDescription(`Hello ${User.username} ! This is an automatic system notification: KamKam#6168 removed you from the admin list of the bot !`)
                        .setFooterText(User.username)
                        .setFooterIconURL(User.avatarURL)
                        User.send({embeds: [embed]})
                    } 
                break;
                default:
                    const Admins = result
    
                    if(!Admins[0]){
                        embed.addField("Administarteurs", "Aucun admins enregistré")
                        receiving.reply({embeds: [embed]}).catch(err =>{ })
                    }else{
                        let number = 0
                        let tout
                        
                        Admins.forEach(admin => {
                            number = number + 1
                            let Pseudo = admin.Pseudo
                            if(admin.Pseudo === "/") Pseudo = "Administrateur n°" + number
                            let prétout = `Pseudo: ${Pseudo}\nID: ${bot.decryptID(admin.ID)}`
                            
                            if(tout) tout = tout + `\n\n${prétout}`
                            else tout = prétout
                        })
    
                        embed.setDescription("```" + tout + "```")
                        receiving.reply({embeds: [embed]}).catch(err => {})
                    }
                break;
            }
            
        })
        
    }
}
module.exports.help = {
    name: "admin",
    type: "Server and PV",
    autorisation: "Créateur"
}