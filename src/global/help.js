const Discord = require("@kamkam1_0/discord.js")

module.exports = {
    async execute(bot , receiving, Langue, Langue2){
        let precision;
        
        if(receiving.receivingType === "interaction") precision =  receiving.options.length ? receiving.options[0].value: undefined
        if(receiving.receivingType === "message") precision = receiving.content.split(" ")[2]

        let embed = new Discord.Embed()
        .setColor("PURPLE")
        
        if(precision){
            let commandt = bot.handler.getCommand(precision)

            if(commandt){
                let commandLanguage = commandt.help.langues?.find(lan => lan.languageCode === Langue.languageCode) || commandt.help.langues?.find(lan => lan.languageCode === "en-US") || Langue
                
                let p;
                switch(commandt.help.dm){
                    case(true):
                        p = `${Langue2["server"]} && ${Langue2["dm"]}`
                    break;
                    case(false):
                        p = Langue2["server"]
                    break;
                    case(null):
                        p = Langue2["dm"]
                    break;
                    default:
                        p = Langue2["server"]
                    break;
                }
                
                embed
                .setTitle("⁉️ " + Langue2["Commande"] + " " + commandt.help.name + " ⁉️")

                let text = `__${Langue2["Nom de la commande"]}__ : ${commandt.name}\n\n__${Langue2["Description de la commande"]}__ : ${commandLanguage["commands"][`${commandt.name}_description`]}\n\n__${Langue2["Cooldown"]}__ : ${commandt.help.cooldown}\n\n__${Langue2["Accessibilité"]}__: ${p}`

                let aliases = commandt.help.aliases
                if(aliases) text += `\n\n__${Langue2["Aliaces de la commande"]}__: \`\`${aliases.toString()}\`\``
                
                if(commandt.help.raccourcis){
                    let raccourci = ""
                    commandt.help.raccourcis.forEach(rac => {
                        if(String(rac) === "[object Object]") raccourci += `\n-> ${Object.keys(rac)[0]} (${Object.values(rac)[0]})`
                        else raccourci += `\n-> ${rac}`
                    })
                    text += `\n\n__${Langue2["Raccourcis"]}__: \`\`\`${raccourci}\`\`\``
                }

                if(commandLanguage["commands"][`${commandt.help.name}_composition`]) text += `\n\n__${Langue2["Composition de la commande"]}__: \`\`${commandLanguage["commands"][`${commandt.help.name}_composition`]}\`\``
                
                if(commandLanguage["commands"][`${commandt.help.name}_usage`]) text += `\n\n__${Langue2["Différentes utilisations de la commande"]}__: \`\`\`${commandLanguage["commands"][`${commandt.help.name}_usage`]}\`\`\``

                embed.setDescription(text)
                
                receiving.reply({embeds: [embed]}).catch(err =>{})
                
            }else base_protocole(bot, embed, Langue, receiving, Langue2)
        }else base_protocole(bot, embed, Langue, receiving, Langue2)
    }
}

function base_protocole(bot, embed, Langue, receiving, Langue2){
    let toadd = receiving.user_id === bot.config.general.creatorId 
    ? bot.handler.handlers.map(ha => ha.name)
    : bot.handler.handlers.filter(handler => handler.name.toLowerCase() !== 'admin').map(ha => ha?.name).filter(Boolean)

    toadd = toadd.map((name, acc) => {
        return {position: acc, name: name}
    })
    let dirs_t = bot.handler.getHandler(bot.handler.names.find(e => e.toLowerCase() === toadd.find(e => e.position === 0).name.toLowerCase())).getCommands()

    embed
    .setTitle(`${Langue2["Aide"]} ${toadd.find(e => e.position === 0).name}`)
    .setFooterText(`${toadd.map(ha => `${ha.name} -> ${Number(ha.position)+1}/${Math.max(...toadd.map(ha => Number(ha.position)+1))}`).join("\n")}`)
    .setColor("BLUE")
    dirs_t.forEach(command => {
        if(!command.help.langues) embed.addField(command.name, Langue["commands"][`${command.name}_description`])
        else{
            let systemLanguage = bot.handler.getLanguages().find(lan => lan.languageCode === Langue.languageCode) || bot.handler.getLanguages().find(lan => lan.languageCode === "en-US") || Langue
            embed.addField(command.name, systemLanguage["commands"][`${command.name}_description`])
        }
        if(embed.fields.length === 25 || embed.fields.length === dirs_t.length) send_protocole(bot, embed, receiving, Langue, Langue2)
    })
}

async function send_protocole(bot, embed, receiving, Langue, Langue2){
    let buttonleft = new Discord.Button()
    .setCustomID("help_left")
    .setStyle("Secondary")
    .setEmoji("◀️")
    let buttonright = new Discord.Button()
    .setCustomID("help_right")
    .setStyle("Secondary")
    .setEmoji("▶️")
    let msg = await receiving.reply({embeds: [embed], components: [buttonleft, buttonright]}).catch(err => {})
    if(receiving.receivingType === "interaction"){
        msg = await receiving.getOriginalResponse()
    }
    let collector = bot.commands.collectInteractions({channel_id: msg.channel_id, message_id: msg.id, time: 3*1000, id: ["help_right", "help_left"], user_id: receiving.user_id})
    collector.once("end", () => {
        if(receiving.receivingType === "interaction") receiving.deleteReply()
        if(receiving.receivingType === "message") msg.delete()
    })
    collector.on("collecting", (bo, da) => {
        let positions = da.message.embeds[0].footer.text.split("\n").map(text => {
            return {position: Number(text.split("->")[1].split("/")[0].trim()) - 1, name: text.split("->")[0].trim(), current: da.message.embeds[0].title.split(" ")[1].trim() === text.split("->")[0].trim() ? true : false}
        })
        
        if(positions.find(h => h.current).position === 0 && da.custom_id === "help_left"){
            positions.find(h => h.position === 0).current = false
            positions.find(h => h.position === Number(Math.max(...positions.map(h => h.position)))).current = true
        }
        else if(positions.find(h => h.current).position === Math.max(...positions.map(h => h.position)) && da.custom_id === "help_right"){
            positions.find(h => h.position === 0).current = true
            positions.find(h => h.position === Number(Math.max(...positions.map(h => h.position)))).current = false
        }
        else{
            let inital = positions.find(h => h.current).position
            positions.find(h => h.position === inital).current = false
            positions.find(h => h.position === ((da.custom_id === "help_left") ? (inital - 1) : (inital + 1))).current = true
        }

        let name = positions.find(h => h.current).name

        let embed = new Discord.Embed()
        .setTitle(`${Langue2["Aide"]} ${name}`)
        .setColor("BLUE")
        .setFooterText(da.message.embeds[0].footer.text)

        let dirs_t = bo.handler.getHandler(bo.handler.names.find(e => e.toLowerCase() === name.toLowerCase())).getCommands()
        dirs_t.forEach(command => {
            if(!command.help.langues) embed.addField(command.name, Langue["commands"][`${command.name}_description`])
            else{
                let systemLanguage = bot.handler.getLanguages().find(lan => lan.languageCode === Langue.languageCode) || bot.handler.getLanguages().find(lan => lan.languageCode === "en-US") || Langue
                embed.addField(command.name, systemLanguage["commands"][`${command.name}_description`])
            }
        })
        
        da.message.modify({embeds: [embed], components: [buttonleft, buttonright]}).catch(err => console.log(err))
        
        da.reply({ephemeral: true, content: Langue2["h_2"]}).then(() => {
            setTimeout(() => {
                da.deleteReply().catch(err => {})
            }, 3 * 1000)
        }).catch(err => {console.log(err)})
    })
}

module.exports.help = {
    dm: true,
    cooldown: 3,
    options: [
        {
            name: "option",
            required: false,
            type: 3
        }
    ],
    langues: true
}