module.exports = {
    async execute(bot , receiving, Langue){
        const Discord = require("@kamkam1_0/discord.js")
        let precision
        
        if(receiving.typee === "slash") precision =  receiving.data.options ? receiving.data.options[0].value: undefined
        if(receiving.typee === "message") precision = receiving.content.split(" ")[2]

        let embed = new Discord.Embed()
        .setColor("PURPLE")
        
        let VID = receiving.user.id
        let type_s = await bot.vstatus(bot, VID)

        if(precision){
            let commandt;
                    
            if(type_s === "ALL") commandt = bot.handler.GetCommand(precision)
            if(type_s === "VIP") commandt = bot.handler.GetCommand_fi(precision) || bot.handler.GetHandler("VIP").GetCommand(precision)
            if(type_s === "Admin") commandt = bot.handler.GetCommand_fi(precision) || bot.handler.GetHandler("Admin").GetCommand(precision)
            if(type_s === "User") commandt = bot.handler.GetCommand_fi(precision)

            if(commandt){
                if(commandt.help.nsfw && type_s !== "ALL") return base_protocole(bot, embed, type_s, Langue, receiving)
                let p = commandt.help.type
                if(!p) p = "Serveur"
                if(p.includes("PV")) p = p.replace("PV", "Privé")
                if(p.includes("Server")) p = p.replace("Server", "Serveur")
                embed
                .setTitle("⁉️ " + Langue["Commande"] + " " + commandt.help.name + " ⁉️")

                let text = `__${Langue["Nom de la commande"]}__ : ${commandt.help.name}\n\n__${Langue["Description de la commande"]}__ : ${Langue["Help"][`${commandt.help.name}_description`]}\n\n__${Langue["Autorisation pour exéctuer la commande"]}__ : ${commandt.help.autorisation || Langue["no_auto"]}\n\n__${Langue["Cooldown"]}__ : ${commandt.help.cooldown}\n\n__${Langue["Accessibilité"]}__: ${p}`

                let aliases = commandt.help.aliases
                if(aliases) text += `\n\n__${Langue["Aliaces de la commande"]}__: \`\`${aliases.toString()}\`\``
                
                if(commandt.help.raccourcis){
                    let raccourci = ""
                    commandt.help.raccourcis.forEach(rac => {
                        if(String(rac) === "[object Object]") raccourci += `\n-> ${Object.keys(rac)[0]} (${Object.values(rac)[0]})`
                        else raccourci += `\n-> ${rac}`
                    })
                    text += `\n\n__${Langue["Raccourcis"]}__: \`\`\`${raccourci}\`\`\``
                }

                if(Langue["Help"][`${commandt.help.name}_composition`]) text += `\n\n__${Langue["Composition de la commande"]}__: \`\`${Langue["Help"][`${commandt.help.name}_composition`]}\`\``
                
                if(Langue["Help"][`${commandt.help.name}_usage`]) text += `\n\n__${Langue["Différentes utilisations de la commande"]}__: \`\`\`${Langue["Help"][`${commandt.help.name}_usage`]}\`\`\``

                embed.setDescription(text)
                
                receiving.reply({embeds: [embed]}).catch(err =>{})
                
            }else base_protocole(bot, embed, type_s, Langue, receiving)
        }else base_protocole(bot, embed, type_s, Langue, receiving)

    }
}

function base_protocole(bot, embed, type_s, Langue, receiving){
    let toadd = []
    if(type_s === "ALL") toadd = bot.handler.handlers.map(ha => ha.name)
    else toadd = bot.handler.handlers.filter(ha => (translate_level(type_s) >= translate_level(ha.level)) && ha.name !== "NSFWS" ).map(ha => ha.name)

    toadd = toadd.map((name, acc) => {
        return {position: acc, name: name}
    })
    
    let dirs_t = bot.handler.GetHandler(bot.handler.names.find(e => e.toLowerCase() === toadd.find(e => e.position === 0).name.toLowerCase())).GetCommands()
    let number = dirs_t.length


    embed
    .setTitle(`${Langue["Aide"]} ${toadd.find(e => e.position === 0).name}`)
    .setFooterText(`${toadd.map(ha => `${ha.name} -> ${Number(ha.position)+1}/${Math.max(...toadd.map(ha => Number(ha.position)+1))}`).join("\n")}`)
    .setColor("BLUE")


    dirs_t.forEach(command => {
        const file = command
        embed.addField(file.name, Langue["Help"][`${file.name}_description`])
        if(embed.fields.length === 25 || embed.fields.length === number) send_protocole(embed, receiving, Langue)
    })
}

function send_protocole(embed, receiving, Langue){
    const Discord = require("@kamkam1_0/discord.js")
    let buttonleft = new Discord.Button()
    .setCustomID("help_left")
    .setStyle("SECONDARY")
    .setEmoji("◀️")
    let buttonright = new Discord.Button()
    .setCustomID("help_right")
    .setStyle("SECONDARY")
    .setEmoji("▶️")
    receiving.reply({embeds: [embed], components: [buttonleft, buttonright]}).catch(err => console.log(err))
}

function translate_level(level){
    if(typeof level === "number") return level
    level = String(level).toLowerCase()
    let convert = {
        "user": 0,
        "vip": 1,
        "admin": 2,
        "superadmin": 3
    }
    let transfo = convert[level]
    return transfo
}

module.exports.help = {
    type: "Server and PV",
    cooldown: 3,
    options: [
        {
          name: "option",
          required: false,
          type: 3
        }
    ]
}