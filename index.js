const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const { Client, MessageEmbed } = require("discord.js");
const { channel } = require('diagnostics_channel');


client.commands
client.prefix = "!"

client.on('ready', async () => {
  console.log(`Botun olan ${client.user.tag} hizmetinizde!`);
  client.user.setActivity("!help", {type: "PLAYING"})
  client.commands = await setCommands()
});

client.on('message', message => {
    if (message.content.toLowerCase() === "kurallar") {
        message.delete()
        const kanal = new MessageEmbed()
        .setTitle('Kurallar')
        .addField('Sunucumuzda Küfür Ne Olursa Olsun Yasaktır!', 'Cezası Mute')
        .addField('Sunucumuzda Reklam Yasaktır!', 'Cezası Sunucudan Atılma')
        .addField('Sunucumuzda Spam Yasaktır!', 'Cezası Mute')
        .setColor('GREEN')
        message.channel.send(kanal);
    }
})

//Kick Komutu
client.on('message', message => { 
    if (!message.guild) return;
    if (message.content.startsWith('!kick')) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('Bunu Yapabilmek İçin Yetkin Olması Lazım!')
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
        if (member) {
            member
                .kick()
                .then(() => {
                const log = message.guild.channels.cache.find(channel => channel.name === 'giriş-çıkış')
                 log.send(`${user.tag} kişisi atılmıştır!`);
                })
                .catch(err => {
                    message.reply('Bunu Yapamam');
                    console.error(err);
                });
        } else {
            message.reply("Bahsettiğin Kİşi Bizim Sunucumuzda Yoktur!");
        }
      } else {
        message.reply('Atılacak Kişiyi Yazmadın');
      }
    }
}); 

//Ban Komutu
client.on('message', message => {
    if (!message.guild) return;
    if (message.content.startsWith('!ban')) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('Bunu Yapabilmek İçin Yetkin Olması Lazım!')
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
        if (member) {
            member
                .ban()
                .then(() => {
                const log = message.guild.channels.cache.find(channel => channel.name === 'giriş-çıkış')
                message.channel.send(`${user.tag}, Banlandı! Press F to Pay Respects`);
                 log.send(`${user.tag} kişisi yasaklanmıştır!`);
                })
                .catch(err => {
                    message.reply('Bunu Yapamam');
                    console.error(err);
                });
        } else {
            message.reply("Bahsettiğin Kİşi Bizim Sunucumuzda Yoktur!");
        }
      } else {
        message.reply('Yasaklanacak Kişiyi Yazmadın');
      }
    }
}); 

client.on('GuildMemberAdd', member => {
    const girişçıkış = member.guild.channels.cache.get('1279512037801725993');
    girişçıkış.send(` ${member} Aramıza Katıldı Hoş Geldi!`);
});

client.on('guildMemberAdd', member => {
    try {
        let role = member.guild.roles.cache.get('1279510551797563453')
        member.roles.add(role);
    } catch(e) {
        console.log(e)
    }
});

async function setCommands() {
    commandFiles = fs.readdirSync('./commands')
    let commands = new Discord.Collection();
    commandFiles.forEach((v, i) => {
        let file = require(`./commands/${v}`)
        commands.set(v, {
            name: (file.config.name),
            desc: (file.config.desc),
            aliases: (file.config.aliases),
            run: (file.run)  
        })   
    })

    return commands;
}

client.on("message", (message) => {
    if  (
        message.content.startsWith(client.prefix) && 
        (message.content.split(' ')[0] != client.prefix && message.content != client.prefix) &&
        client.commands.find(v => (v.name == (message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))) || (v.aliases.includes(message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))))
    ) {
        let command = client.commands.find(v => (v.name == (message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))) || (v.aliases.includes(message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))))

        args = message.content.split(" ")
        args = args.slice(1, args.length) 
        command.run(client, message, args)
    }
})

client.login('');