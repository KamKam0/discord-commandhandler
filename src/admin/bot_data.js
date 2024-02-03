const Discord = require("@kamkam1_0/discord.js")
const os = require("node:os")
const getUptime = require('../utils/getUptime')

module.exports = {
    async execute(bot, receiving){
        if(receiving.user.id !== bot.config["general"]["creatorId"]) return

        let embed = new Discord.Embed()
        .setColor("RED")

        let defTime = getUptime()
        let average = 0
        let type
    
        if(receiving.receivingType === "interaction"){
            type = receiving.options.find(int => int.name === "1") ? receiving.options.find(int => int.name === "1").value: undefined
        }
        if(receiving.receivingType === "message"){
            type = receiving.content.split(" ")[2]
        }

        switch(type){
            case("memory"):
                embed.setTitle("Bot Data - Memory")
                embed.addFields(
                    {name: "Memory used", value: Number(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' Mb', inline: true},
                    {name: "Memory total", value: Number(os.totalmem() / 1024 / 1024).toFixed(2) + " Mb", inline: true}
                )
            break;
            case("pc"):
                embed
                .setTitle("Bot Data - PC")
                .addFields(
                    {name: "architecture", value: os.arch(), inline: true},
                    {name: "OS", value: os.platform(), inline: true},
                    {name: "Version OS", value: `${os.type()} ${os.release()}`, inline: true}
                )
            break;
            case("processor"):
                os.cpus().forEach(cpu => average += cpu.speed )
                average = average / os.cpus().length
                embed
                .setTitle("Bot Data - Processor")
                .addFields(
                    {name: "Name of processor", value: os.cpus()[0].model, inline: true},
                    {name: "Cores of processor", value: os.cpus().length + " cores", inline: true},
                    {name: "Clock Avergarde", value: average + " MHz", inline: true},
                )
            break;
            case("versions"):
                embed
                .setTitle("Bot Data - Versions")
                .addFields(
                    {name: "Version of Node.js", value: process.version, inline: true},
                    {name: "Version of Discord.js", value: Discord.version, inline: true},
                )
            break;
            case("guildsize"):
                embed
                .setTitle("Bot Data - GuildSize")
                .addFields(
                    {name: "Guild count", value: `${bot.guilds.length}`, inline: true},
                    {name: "Users count", value: `${bot.guilds.map(g => g.membercount).reduce((a, b) => (a + b))}`, inline: true},
                )
            break;
            case("uptime"):
                embed
                .setTitle("Bot Data - Uptime")
                .addFields(
                    {name: "Uptime", value: defTime, inline: true},
                )
            break;
            default:
                os.cpus().forEach(cpu => average += cpu.speed )
                average = average / os.cpus().length
                embed
                .setTitle("Advanced informations about the bot")
                .addFields(
                    {name: "Name", value: "\`\`\`" + bot.user.username + "\`\`\`", inline: true},
                    {name: "Id", value: "\`\`\`" + bot.user.id + "\`\`\`", inline: true},
                    {name: "Name of processor", value: "```" + os.cpus()[0].model + "```", inline: true},
                    {name: "Cores of processor", value: "```" + os.cpus().length + " cores"  + "```", inline: true},
                    {name: "Clock Avergarde", value: "```" + average + " MHz"  + "```", inline: true},
                    {name: "Memory used", value: "\`\`\`" +Number(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + ' Mb' + "\`\`\`", inline: true},
                    {name: "Memory total", value: "\`\`\`" +Number(os.totalmem() / 1024 / 1024).toFixed(2) + " Mb" + "\`\`\`", inline: true},
                    {name: "architecture", value: "\`\`\`" +os.arch() + "\`\`\`", inline: true},
                    {name: "OS", value: "\`\`\`" +os.platform() + "\`\`\`", inline: true},
                    {name: "Version OS", value: `\`\`\`${os.type()} ${os.release()}\`\`\``, inline: true},
                    {name: "Version of Node.js", value: "\`\`\`" +process.version + "\`\`\`", inline: true},
                    {name: "Version of Discord.js", value: "\`\`\`" + Discord.version + "\`\`\`", inline: true},
                    {name: "Ping", value: `\`\`\`${Date.now() - Date.parse(new Date(receiving.timestamp).toUTCString("fr"))}\`\`\``, inline: true},
                    {name: "Guild count", value: `\`\`\`${bot.guilds.length}\`\`\``, inline: true},
                    {name: "Users count", value: `\`\`\`${bot.users.length}\`\`\``, inline: true},
                    {name: "Uptime", value: `\`\`\`${defTime}\`\`\``, inline: true},
                    {name: "\u200b", value: "\u200b", inline: true},
                    {name: "\u200b", value: "\u200b", inline: true},
                )
                .setColor("RED")
                            
            break;
        }

        receiving.reply({embeds: [embed]}).catch(err =>{})
    }
}

module.exports.help = {
    dm: true,
    langues: true
}