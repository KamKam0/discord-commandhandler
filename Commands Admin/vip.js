module.exports = {
    async execute(bot, receiving){
        const Discord = require("@kamkam1_0/discord.js")
        const bdd = bot.config
        let embed = new Discord.Embed()

        let action
        
         
        let ID
        
         
        let Pseudo

        action = receiving.content.split(" ")[2]
        ID = receiving.content.split(" ")[3]
        Pseudo = receiving.content.split(" ")[4]
        
        if(ID){
            if(ID.length === 21 || ID.length === 22){
                if(ID.length === 22) ID = ID.slice(3, -1)
                else ID = ID.slice(2, -1)
                
            }
            else if(ID.length === 18) ID = ID
            else ID = undefined
        }

        if(!bot.sql) return receiving.error("La base de donnée SQL n'est pas initialisée")
        
        bot.sql.query(`SELECT * FROM vip`, async function(err, result){
            if(err) return receiving.error("Fonction VIP non activée pour ce bot")
            switch(action){
                case("add"):
                    if(receiving.user.id !== bdd["Général"]["ID créateur"]) return
                    if(!ID || isNaN(ID)) return receiving.error("Vous avez fait une erreur dans la commande ! C'est: ``vip [ID]``").catch(err =>{})
            
                    if(ID.length !== 18) return receiving.error("Vous avez fait une erreur dans la commande ! C'est: ``vip [ID]``").catch(err =>{})
                    let minute = [0, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
                    let seconde = [20, 40, 60]
                    let total = []
                    seconde.forEach(n => {
                        minute.forEach(e => {
                            if(`${e}-${n}` !== "0-20") total.push(`${e}-${n}`)
                        })
                    })
                    
                    const system = async (VID) => {
                        if(result.length === 180) return receiving.error("Vous avez atteint la limite de VIP !")

                        bot.sql.query(`SELECT * FROM viptime`, async function(err, times){
                            total.filter(e => e !== "0-20")
                            if(times[0]){
                                times = times.filter(c => c.statut === "occupé").map(e => e.statut)
                                total = total.filter(e => !times.includes(e))
                            }
                            let dispo = total[0]
                            bot.sql.query(`INSERT INTO viptime (chiffre, statut) VALUES ('${String(dispo)}', 'occupé')`)
                            if(!Pseudo) Pseudo = "/"
                            bot.sql.query(`INSERT INTO vip (Pseudo, ID, Temps) VALUES ('${Pseudo}', '${bot.encryptID(VID)}', '${dispo}')`)

                            receiving.success("Le membre a bien été enregsitré en VIP")
                            if(bot.users.find(us => us.id === ID)){
                                let User = bot.users.find(us => us.id === ID)
                                embed.setTitle("System Notification")
                                .setAuthorIconURL(bot.user.avatarURL)
                                .setAuthorName(bot.user.username)
                                .setColor("RED")
                                .setDescription(`Hello ${User.username}#${User.discriminator} ! This is an automatic system notification: KamKam#6168 added you on the VIP list of the bot !`)
                                .setFooterIconURL(bot.user.avatarURL)
                                .setFooterText(User.username)
                                User.send({embeds: [embed]}).catch(err => {})
                            } 
                        })
                           
                    }
                    if(result[0]){
                        if(result.find(c => c.ID === ID)) return receiving.error("La personne est déjà membre VIP")
                        else system(ID)
                    }else system(ID)

                    

                break;
                case("remove"):
                    if(receiving.user.id !== bdd["Général"]["ID créateur"]) return
                    if(!ID || isNaN(ID)) return  receiving.error("Vous avez fait une erreur dans la commande").catch(err =>{})
            
                    if(ID.length !== 18) return receiving.error("Vous avez fait une erreur dans la commande").catch(err =>{})
            
                    if(!result[0]) return receiving.error("L'ID n'est pas inscrit en tant que VIP du bot").catch(err =>{})
            
                    let rm = result.find(c => bot.decryptID(c.ID) === ID)
                    if(!rm) return receiving.error("L'ID n'est pas inscrit en tant que VIP du bot").catch(err =>{})

                    bot.sql.query(`DELETE FROM viptime WHERE chiffre = '${rm["Temps"]}'`)

                    bot.sql.query(`DELETE FROM vip WHERE ID = '${rm["ID"]}'`)
            
                    receiving.success("L'ID " + ID + " a bien été supprimé des VIP du bot").catch(err =>{})
                    if(bot.users.find(us => us.id === ID)){
                        let User = bot.users.find(us => us.id === ID)
                        embed.setTitle("System Notification")
                        .setAuthorIconURL(bot.user.avatarURL)
                        .setAuthorName(bot.user.username)
                        .setColor("RED")
                        .setDescription(`Hello ${User.username}#${User.discriminator} ! This is an automatic system notification: KamKam#6168 removed you the VIP list of the bot !`)
                        .setFooterIconURL(User.avatarURL)
                        .setFooterText(User.username)
                        User.send({embeds: [embed]}).catch(err => {})
                    } 
                break;
                default:
                    
                    const VIP = result
    
                    if(!VIP[0]){
                        embed.addField("VIP", "Aucun VIP enregistré")
                        receiving.reply({embeds: [embed]}).catch(err =>{
                            if(err.name === "DiscordAPIError"){
                                return
                            }
                        })
                    }else{
                        let tout
                        let number = 0
                        VIP.forEach(memb => {
                            number ++
                            let Pseudo = memb.Pseudo
                                if(memb.Pseudo === "/") Pseudo = "VIP n°" + number
                                let prétout = `Pseudo: ${Pseudo}\nID: ${bot.decryptID(memb.ID)}\nTemps plateforme: ${memb.Temps}`
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
    name: "vip",
    type: "Server and PV",
    autorisation: "Créateur"
}