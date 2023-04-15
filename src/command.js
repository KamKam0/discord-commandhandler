const systemeLanguages = require("./utils/getLangues")()

class Command{
    constructor(name, datas, path, handler, langues){
        this.execute = datas.execute
        this.help = datas.help
        this.path = path
        this.handler = handler
        this.name = name
        this.names = this.getNames(langues)
        this.onlydm = false
        this.dm_permission = this.#handledms(datas?.help?.dm)
        this.nsfw = datas.help.nsfw ? datas.help.nsfw : false
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

    #handledms(state){
        switch(state){
            case(null):
                this.onlydm = true
                return true
            case(true):
                return true
            default:
                return false
        }
    }
}

module.exports = Command