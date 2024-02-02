module.exports = () => {
    let seconds = +(process.uptime()).toFixed(0)
    let minutes = getReal(seconds / 60)
    let hours = getReal(minutes / 60)
    let days = getReal(hours / 24)
    
    let times = { days, hours,  minutes, seconds }
    let biggestUptime = Object.entries(times).filter(entry => entry[1])[0]
    
    return `${biggestUptime[1]} ${biggestUptime[0]}`
}

function getReal(value){
    if (!value) {
        return 0
    }

    if (String(value).includes('.')) {
        return +(String(value).split('.')[0])
    }

    return value
}