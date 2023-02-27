module.exports = () => {
    const fs = require("node:fs")
    let symbol;
    if(require("node:os").platform() === "darwin") symbol = "/"
    if(require("node:os").platform() === "win32") symbol = "\\"
    let path = require.resolve("../Langues/eng.json").split(symbol)
    path.pop()
    path = path.join(symbol)
    let files = fs.readdirSync(path).filter(e => e.endsWith("json")).map(e => require(`../Langues/${e}`)).filter(e => e["Langue_Code"] && e["Help"] && e["Options"] && e["Choices"])
    return files
}