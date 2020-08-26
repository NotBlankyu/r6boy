const Discord = require('discord.js')
var db = require('quick.db')



module.exports.run = async (client, message, args) => {
if(!args[0]){
    return message.channel.send('Please say the username. (r!set <username> )')
}
db.set(`User_${message.member.id}`,{name: args[0]})
message.channel.send(`Your default profile was set to ${args[0]}`)
}