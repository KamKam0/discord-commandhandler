const systemeLanguages = require("./utils/getLangues")()

class Command{
    constructor(name, datas, path, handler, langues){
        this.execute = datas.execute
        this.help = datas.help
        this.path = path
        this.handler = handler
        this.name = name
        this.names = this.getNames(langues)
        this.nsfw = datas.help.nsfw || false
        this.contexts = datas.help.contexts || null
        this.guild = datas.help.contexts || null
        this.choicesLoader = datas.choicesLoader
    }

    getNames(langues){
        let nas = []
        if(this.help.langues){
            systemeLanguages.forEach(la => {
                const Des_Lan = la["commands"]
                nas.push(Des_Lan[`${this.name}_name`])
            })
        }else{
            langues.forEach(la => {
                const Des_Lan = la["commands"]
                nas.push(Des_Lan[`${this.name}_name`])
            })
        }

        return nas
    }
}

module.exports = Command