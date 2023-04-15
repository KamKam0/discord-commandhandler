module.exports = () => {
    const fs = require("node:fs")
    let symbol;
    if(require("node:os").platform() === "darwin") symbol = "/"
    if(require("node:os").platform() === "win32") symbol = "\\"
    let path = require.resolve("../langues/eng.json").split(symbol)
    path.pop()
    path = path.join(symbol)
    let files = fs.readdirSync(path).filter(e => e.endsWith("json")).map(e => require(`../langues/${e}`)).filter(e => e["languageCode"] && e["commands"] && e["options"] && e["choices"])
    return files
}