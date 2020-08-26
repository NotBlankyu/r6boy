const Discord = require('discord.js')
const R6API = require('r6api.js');
var db = require('quick.db')
const r6api = new R6API('cipagi1379@delotti.com', 'Y4gCrDcAe9gqzNc');



module.exports.run = async (client, message, args) => {
    const username = args[0] || db.get(`User_${message.member.id}.name`)
    const platform = 'uplay';
    const region = args[1] || 'emea'
    const id = await r6api.getId(platform, username).then(el => el[0].userId).catch(e => {
        return message.channel.send('An error happen while getting the user, please make sure it exists.')
    })
    const stats = await r6api.getStats(platform, id).then(el => el[0]);
    const rankStats = await r6api.getRank(platform, id,);

    var operators = [];
    var playTimes = [];
    var rankArray = [];

    for(var i in stats.pvp.operators)
        operators.push([i, stats.pvp.operators [i]]);
    for(var i in operators){
        playTimes.push([parseInt(operators[i][1].playtime),i])
    }
    for(var i in rankStats[0].seasons){
        rankArray.push([rankStats[0].seasons [i]]);
    }
    
    playTimes.sort(function(a,b){return b[0] - a[0]})

    const name = args[0] || db.get(`User_${message.member.id}.name`)
    const kda = Math.round(((stats.pvp.general.kills+stats.pvp.general.assists)/stats.pvp.general.deaths + Number.EPSILON) * 100) / 100
    const wr = Math.round((stats.pvp.general.wins/stats.pvp.general.losses + Number.EPSILON) * 100) / 100
    const playTime = Math.round((stats.pvp.general.playtime/3600 + Number.EPSILON) * 100) / 100
    const mostOp = operators[playTimes[0][1]][1]
    let currentMmr
    let maxMmr
    let rank
    switch (region.toLowerCase()) {
        case "eu":
            currentMmr = rankArray[0][0].regions.emea.current.mmr
            maxMmr = rankArray[0][0].regions.emea.max.mmr
            rank = rankArray[0][0].regions.emea.current.name
            break;
        case "na":
            currentMmr = rankArray[0][0].regions.ncsa.current.mmr
            maxMmr = rankArray[0][0].regions.ncsa.max.mmr
            rank = rankArray[0][0].regions.ncsa.current.name
            break;
        case "apac":
            currentMmr = rankArray[0][0].regions.apac.current.mmr
            maxMmr = rankArray[0][0].regions.apac.max.mmr
            rank = rankArray[0][0].regions.apac.current.name
            break;
            

    
        default:
            currentMmr = rankArray[0][0].regions.emea.current.mmr
            maxMmr = rankArray[0][0].regions.emea.max.mmr
            rank = rankArray[0][0].regions.emea.current.name
            break;
            
    }
    
    
    const headShot = Math.round((stats.pvp.general.headshots/stats.pvp.general.kills + Number.EPSILON) * 100) / 100
    
    const embed = new Discord.MessageEmbed()
    .setTitle(`${name} Stats`)
    .setDescription(`**KDA**: ${kda}\n**HeadShot:** ${headShot}\n**Wr**: ${wr}\n**PlayTime**: ${playTime}h\n**Most played Op**: ${mostOp.name}\n**Rank**: ${rank}\n**Current Mmr**: ${currentMmr}\n**Max Mmr**: ${maxMmr}`)
    .setThumbnail(mostOp.badge)


    message.channel.send(embed)
}