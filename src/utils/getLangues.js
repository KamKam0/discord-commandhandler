const fs = require("node:fs")
const os = require('node:os')

module.exports = () => {
    let symbol;
    if(os.platform() === "darwin") symbol = "/"
    if(os.platform() === "win32") symbol = "\\"
    let path = require.resolve("../langues/eng.json").split(symbol)
    path.pop()
    path = path.join(symbol)
    let files = fs.readdirSync(path).filter(e => e.endsWith("json")).map(e => require(`../langues/${e}`)).filter(e => e["languageCode"] && e["commands"] && e["options"] && e["choices"])
    return files
}