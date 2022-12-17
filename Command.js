class Command{
    constructor(name, datas, path, handler, langues){
        this.execute = datas.execute
        this.help = datas.help
        this.path = path
        this.handler = handler
        this.name = name
        this.names = this.getNames(langues)
        this.nsfw = datas.help.nsfw ? datas.help.nsfw : false
    }

    getNames(langues){
        let nas = []
        langues.forEach(la => {
            const Des_Lan = la["Help"]
            nas.push(Des_Lan[`${this.name}_name`])
        })

        return nas
    }
}

module.exports = Command