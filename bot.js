const { MessageAttachment, EmbedBuilder, Client, GatewayIntentBits, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ClientUser, AttachmentBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
var cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers] });

// async function guildCommandCreate(guildid) {
//     //if guildid is array
//     if (Array.isArray(guildid)) {
//         for (let i = 0; i < guildid.length; i++) {
//             await guildCommandCreate(guildid[i]);
//         }
//     } else {
//         const thatguild = client.guilds.cache.get(guildid);
//         let commands

//         if (thatguild) {
//             commands = thatguild.commands
//         } else {
//             commands = client.applications?.commands
//         }

//         commands?.create({
//             name: 'create tempvoice',
//             description: "ปรับโหมดการแจ้งเตือนสลากกินแบ่งฯ"
//         }, guildid)

//         //return good
//         return true;
//     }
// }

function elementCount(arr, value) {
    var count = 0;
    arr.forEach(function (v) { (v === value && count++); });
    return count;
}

let userlist = [];

async function getallmemberinvoicechannel() {
    //get all voice channel in guild 1074539591832440832
    const guild = client.guilds.cache.get('1074539591832440832');
    //console all channel name
    const channels = await guild.channels.cache;
    console.log(channels.size);
    //get every id on type 2 (channels is json object)
    console.log(channels.get('1074539591832440838').name);
    //write to file
    // fs.writeFile('channels.json', JSON.stringify(channels), function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    for (const [key, value] of channels) {
        if (value.type == '2') {
            if(value.id != '1074539591832440838') {
                //count member in voice channel
                let members = value.members.size;
                let mutecount = 0;
                let tempmember = [];
                //get all member in voice channel
                value.members.forEach(member => {
                    // console.log(member.user.username);
                    // //is user open mic
                    // if (member.voice.selfMute == true) {
                    //     //add user to userlist
                    //     userlist.push(member.user.username);
                    //     //if username in userlist have more than 5 time
                    //     if (elementCount(userlist, member.user.username) > 5) {
                    //         //kick user
                    //         member.voice.setChannel('1074539591832440838');
                    //     }
                    // }
                    if (member.voice.selfMute == true) {
                        mutecount++;
                        tempmember.push(member.user.username);
                    }
                    if (mutecount == members) {
                        //push tempmember to userlist
                        for (let i = 0; i < tempmember.length; i++) {
                            userlist.push(tempmember[i]);
                        }
                    }
                    if (elementCount(userlist, member.user.username) > 5) {
                        //move user
                        member.voice.setChannel('1074539591832440838');
                    }
                });
            }
        }
        console.log(key, value.name);
    }
    //get every id on type 2 (channels is json object)
    // const channels = guild.channels.cache.filter(channel => channel.type === 'voice');
    // console.log(channels.size);
    // channels.forEach(channel => {
    //     //console.log(channel.name);
    //     //get all member in voice channel
    //     channel.members.forEach(member => {
    //         console.log(member.user.username);
    //     });
    // });
}

async function getallmemberintovoicechannel() {
    //get all voice channel in guild 1074539591832440832
    const guild = client.guilds.cache.get('1074539591832440832');
    //console all channel name
    const channels = await guild.channels.cache;
    console.log(channels.size);
    //get every id on type 2 (channels is json object)
    console.log(channels.get('1074539591832440838').name);
    //write to file
    // fs.writeFile('channels.json', JSON.stringify(channels), function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    for (const [key, value] of channels) {
        if (value.type == '2') {
            if(value.id != '1074539591832440838') {
                //count member in voice channel
                let members = value.members.size;
                let mutecount = 0;
                let tempmember = [];
                //get all member in voice channel
                value.members.forEach(member => {
                    // console.log(member.user.username);
                    // //is user open mic
                    // if (member.voice.selfMute == true) {
                    //     //add user to userlist
                    //     userlist.push(member.user.username);
                    //     //if username in userlist have more than 5 time
                    //     if (elementCount(userlist, member.user.username) > 5) {
                    //         //kick user
                    //         member.voice.setChannel('1074539591832440838');
                    //     }
                    // }
                    if (member.voice.selfMute == true) {
                        mutecount++;
                        tempmember.push(member.user.id);
                    }
                    // if (mutecount == members) {
                    //     //push tempmember to userlist
                    //     for (let i = 0; i < tempmember.length; i++) {
                    //         userlist.push(tempmember[i]);
                    //     }
                    // }
                    // if (elementCount(userlist, member.user.username) > 5) {
                    //     //move user
                    //     member.voice.setChannel('1074539591832440838');
                    // }
                });
                if (mutecount == members) {
                    console.log(key, value.name);
                    //push tempmember to userlist
                    for (let i = 0; i < tempmember.length; i++) {
                        //userlist.push(tempmember[i]);
                        //move user to 1074539591832440838
                        try {
                            guild.members.cache.get(tempmember[i]).voice.setChannel('1074539591832440838');
                        } catch (error) {
                            console.log(error);
                            console.log('is gone');
                        }
                        //wait 1 second sleep not work
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }
            }
        }
    }
}

client.once('ready', () => {
    // client.guilds.cache.forEach(async function (guild) {

    //     try {
    //         guild.commands.fetch().then(async function (commands) {
    //             if (commands.size != 13) {
    //                 await guildCommandDelete(guild);
    //                 await guildCommandCreate(guild.id);
    //             }
    //         });
    //     } catch (error) {
    //         console.log('error: ' + error);
    //     }
    // });
    // client.user.setPresence({ activities: [{ name: 'PWisetthon.com Discord Bot Lab Version' }], status: 'online' });
    // client.users.fetch('133439202556641280').then(dm => {
    //     dm.send('Bot เริ่มต้นการทำงานแล้ว')
    // });
    console.log('I am ready!');
    // get location of deploy
    fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(json => {
            console.log(json);
            client.user.setPresence({ activities: [{ name: 'Deployed at ' + json.city + ' ' + json.regionName + ' ' + json.country + ' ISP ' + json.org }], status: 'online' });
        })
        .catch(err => {
            console.log(err);
            client.user.setPresence({ activities: [{ name: 'a guy move people to main meeting room at 17:30' }], status: 'online' });
        });
    // cron.schedule('*/1 * * * *', () => {
    //     getallmemberinvoicechannel();
    // });
    cron.schedule('30 17 * * 1-5', () => {
        getallmemberintovoicechannel();
    });
});

client.login(process.env.BOT_TOKEN);