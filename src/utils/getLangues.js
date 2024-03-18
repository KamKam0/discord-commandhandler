const fs = require("node:fs")
const os = require('node:os')

let osSymbol = '/'
if(os.platform() === "win32") {
    osSymbol = "\\"
}

module.exports = () => {
    let path = require.resolve("../langues/eng.json").split(osSymbol)
    path.pop()
    path = path.join(osSymbol)
    let files = fs.readdirSync(path).filter(e => e.endsWith("json")).map(e => require(`../langues/${e}`)).filter(e => e["languageCode"] && e["commands"] && e["options"] && e["choices"])
    return files
}