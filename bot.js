const { REST , Routes , MessageAttachment, EmbedBuilder, Client, GatewayIntentBits, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ClientUser, AttachmentBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
var cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

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
let allmemberready = false;
let todaydate = 0;

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
            if (value.id != '1074539591832440838') {
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

let onlineMembersinchannel = false;
async function getallmemberintovoicechannel() {
    if(onlineMembersinchannel == true) {
        return true;
    }
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
    //get count of all member online
    const getallmember = await guild.members.fetch({ withPresences: true });
    let onlineMembers = await getallmember.filter((online) => !online.user.bot && (online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd")).size;
    //get count of all member in voice channel id 1074539591832440838
    onlineMembersinchannel = channels.get('1074539591832440838').members.size;
    if (allmemberready == true && todaydate == new Date().getDate()) {
        console.log('it already early');
        return true;
    }
    if (onlineMembersinchannel == onlineMembers && todaydate != new Date().getDate()) {
        console.log('all member in voice channel');
        allmemberready = true;
        todaydate = new Date().getDate();
        return true;
    } else {
        console.log('new member online');
        allmemberready = false;
    }
    //if user 1074879322143330335,1073167244646948904,1051058825152700416,960152136816156752 one of them is in voice 1074539591832440838
    if (channels.get('1074539591832440838').members.has('1074879322143330335') || channels.get('1074539591832440838').members.has('1073167244646948904') || channels.get('1074539591832440838').members.has('1051058825152700416') || channels.get('1074539591832440838').members.has('960152136816156752')) {
        console.log('someone is in voice channel');
    }
    for (const [key, value] of channels) {
        if (value.type == '2') {
            if (value.id != '1074539591832440838') {
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
                    // console.log(key, value.name);
                    //push tempmember to userlist
                    for (let i = 0; i < tempmember.length; i++) {
                        //userlist.push(tempmember[i]);
                        //move user to 1074539591832440838
                        try {
                            guild.members.cache.get(tempmember[i]).voice.setChannel('1074539591832440838');
                            //get user name
                            console.log(guild.members.cache.get(tempmember[i]).user.username);
                        } catch (error) {
                            console.log(error);
                            console.log('is gone');
                        }
                        //wait 0.5 sec
                        // await new Promise(r => setTimeout(r, 500));
                        //wait random sec
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 501) + 500));
                    }
                }
            }
        }
    }
}

let userlists = {};
let useridlist = [];

async function countonlinetime() {
    //if hour > 20 in monday to friday and every hour in saturday and sunday
    if (((new Date().getHours() >= 20 || new Date().getHours() < 9) && new Date().getDay() >= 1 && new Date().getDay() <= 5) || (new Date().getHours() >= 0 && new Date().getHours() <= 24 && (new Date().getDay() == 0 || new Date().getDay() == 6))) {
        //get all voice channel in guild 1074539591832440832
        const guild = client.guilds.cache.get('1074539591832440832');
        //console all channel name
        const channels = await guild.channels.cache;
        useridlist = [];
        for (const [key, value] of channels) {
            if (value.type == '2') {
                // let members = value.members.size;
                // let mutecount = 0;
                // let tempmember = [];
                //get all member in voice channel
                value.members.forEach(member => {
                    useridlist.push(member.user.id);
                    if (member.user.id == '1075637907991298078'/* || member.user.id == '1077056573966401547'*/) {
                        //if user not in userlists.id
                        if (!userlists[member.user.id] && member.presence?.status === "online") {
                            //create userlists.id
                            userlists[member.user.id] = {
                                username: member.user.username,
                                time: 1,
                                mutetime: 0
                            };
                            //send message to dm
                            // member.user.send('ระบบช่วยนับเวลาทำโอที ของคุณ ' + member.user.username + ' เปิดใช้งานแล้ว');
                            //convert minute to hour
                            let hour = Math.floor(userlists[member.user.id].time / 60);
                            let minute = userlists[member.user.id].time % 60;
                            // member.user.send('ตอนนี้คุณ ' + member.user.username + ' ทำโอทีไปแล้ว ' + hour + ' ชั่วโมง ' + minute + ' นาที');
                        } else if (userlists[member.user.id] != undefined) {
                            if (userlists[member.user.id].mutetime < 5 && member.voice.selfMute == true && member.presence?.status === "idle") {
                                //add mutetime
                                userlists[member.user.id].mutetime++;
                            } else {
                                //reset mutetime
                                if (member.presence?.status === "online" || member.voice.selfMute == false) {
                                    userlists[member.user.id].mutetime = 0;
                                }
                            }
                            if (userlists[member.user.id].mutetime == 5) {
                                //reset mutetime
                                userlists[member.user.id].time = userlists[member.user.id].time - 5;
                                // member.user.send('เราเข้าใจว่าคุณ ไม่ได้ทำโอทีแล้ว เพราะเห็นคุณตั้งสถานะเป็น ไม่อยู่ และ ปิดไมค์ เกิน 5 นาที');
                                let hour = Math.floor(userlists[member.user.id].time / 60);
                                let minute = userlists[member.user.id].time % 60;
                                // member.user.send('เวลาโอทีของคุณคือ ' + hour + ' ชั่วโมง ' + minute + ' นาที (อย่าได้ถือว่าเป็นเวลาที่คุณทำโอทีจริงๆนะ นี่เป็นเพียงเวลาที่ระบบนับเท่านั้น)');
                                userlists[member.user.id].mutetime++;
                            } else {
                                //add time
                                if (userlists[member.user.id].mutetime <= 5) {
                                    userlists[member.user.id].time++;
                                }
                                // let hour = Math.floor(userlists[member.user.id].time / 60);
                                // let minute = userlists[member.user.id].time % 60;
                                // member.user.send('ตอนนี้คุณ ' + member.user.username + ' ทำโอทีไปแล้ว ' + hour + ' ชั่วโมง ' + minute + ' นาที');
                            }
                        }
                    }
                });
            }
        }
        for (const [key, value] of Object.entries(userlists)) {
            // console.log(key, value.username, value.time);
            let hour = Math.floor(value.time / 60);
            let minute = value.time % 60;
            // console.log('ตอนนี้คุณ ' + value.username + ' ทำโอทีไปแล้ว ' + hour + ' ชั่วโมง ' + minute + ' นาที');
            // user not in any voice channel in saturday and sunday
            //if (((new Date().getHours() >= 8 && new Date().getMinutes >= 58 && new Date().getDay() > 0 && new Date().getDay() < 6) || (new Date().getHours() >= 0 && new Date().getHours() <= 23 && (new Date().getDay() == 0 || new Date().getDay() == 6))) && (useridlist.includes(key) == false || value.mutetime >= 5)) {
            if (useridlist.includes(key) == false) {
                if (value.time > 0) {
                    //send message to dm
                    client.users.fetch(key).then(dm => {
                        // dm.send('โอทีที่ผ่านมาของคุณ เวลาทำโอที ' + hour + ' ชั่วโมง ' + minute + ' นาที (อย่าได้ถือว่าเป็นเวลาที่คุณทำโอทีจริงๆนะ นี่เป็นเพียงเวลาที่ระบบนับเท่านั้น)');
                    });
                    // console.log('โอทีที่ผ่านมาของคุณ ' + value.username + ' เวลาทำโอที ' + hour + ' ชั่วโมง ' + minute + ' นาที');
                }
                //remove from userlists
                delete userlists[key];
            }
        }
    }
}

client.once('ready', async () => {
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
    const getallmember = await client.guilds.cache.get('1074539591832440832').members.fetch({ withPresences: true });
    console.log(await getallmember.filter((online) => !online.user.bot && (online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd")).size);
    //get count of all member in voice channel id 1074539591832440838
    console.log(await client.guilds.cache.get('1074539591832440832').channels.cache.get('1074539591832440838').members.size);
    // get location of deploy
    fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if (new Date().getDay() == 5) {
                client.user.setPresence({ activities: [{ name: 'See you at Monday' }], status: 'idle' });
            } else {
                try {
                    fetch('http://192.168.31.220:18765/api/speedtest/home/7')
                        .then(res => res.json())
                        .then(json2 => {
                            if(json.city === json.regionName) {
                                client.user.setPresence({ activities: [{ name: 'Deployed at ' + json.city + ' ' + json.country + ' ISP ' + json.org + ' Last Speedtest ' + parseInt(json2.latest.data.download) + '/' + parseInt(json2.latest.data.upload) + ' Mbps' }], status: 'online' });
                            } else {
                                client.user.setPresence({ activities: [{ name: 'Deployed at ' + json.city + ' ' + json.regionName + ' ' + json.country + ' ISP ' + json.org }], status: 'online' });
                            }
                        })
                } catch (error) {
                    client.user.setPresence({ activities: [{ name: 'a guy move people to main meeting room at 17:30' }], status: 'online' });
                }
            }
        })
        .catch(err => {
            console.log(err);
            if (new Date().getDay() == 5) {
                client.user.setPresence({ activities: [{ name: 'See you at Monday' }], status: 'idle' });
            } else {
                client.user.setPresence({ activities: [{ name: 'a guy move people to main meeting room at 17:30' }], status: 'online' });
            }
        });
    // cron.schedule('*/1 * * * *', () => {
    //     getallmemberinvoicechannel();
    // });
    cron.schedule('30-45/3 17 * * 1-5', () => {
        //if hour = 17 and minute = 30
        if (new Date().getHours() == 17 && new Date().getMinutes() == 30) {
            onlineMembersinchannel = false;
        }
        if((new Date().getMonth() != 9 && (new Date().getDate() != 14 || new Date().getDate() != 23)) || (new Date().getMonth() != 11 && (new Date().getDate() != 5 || new Date().getDate() != 10))) {
            getallmemberintovoicechannel();
        }
        //if this day is friday setPresence to sleep
        if (new Date().getDay() == 5) {
            client.user.setPresence({ activities: [{ name: 'See you at Monday' }], status: 'idle' });
        } else {
            client.user.setPresence({ activities: [{ name: 'a guy move people to main meeting room at 17:30' }], status: 'online' });
        }

        if (new Date().getMonth() == 11 && new Date().getDay() == 5) {
            if (nows.getDate() >= 24 && nows.getDate() <= 25) {
                // client.user.setActivity('🎄🎅🎁🎉🎊🎆🎇🧨🎈🎄', { type: 'PLAYING' });
                client.user.setPresence({ activities: [{ name: '🎄🎅🎁🎉🎊🎆🎇🧨🎈🎄' }], status: 'online' });
            } else if (nows.getDate() >= 26 && nows.getDate() <= 31) {
                // client.user.setActivity('Happy New Year ' + (nows.getFullYear() + 543), { type: 'PLAYING' });
                client.user.setPresence({ activities: [{ name: 'Happy New Year ' + (nows.getFullYear() + 543) }], status: 'online' });
            } else if (nows.getDate() == 1) {
                // client.user.setActivity('สุขสันต์วันปีใหม่ ' + (nows.getFullYear() + 543), { type: 'PLAYING' });
                client.user.setPresence({ activities: [{ name: 'สุขสันต์วันปีใหม่ ' + (nows.getFullYear() + 543) }], status: 'online' });
            }
        }
    });
    cron.schedule('* * * * *', () => {
        countonlinetime();

        let nows = new Date();
        if ((nows.getHours() == 8 && nows.getMinutes() == 25) || (nows.getHours() == 17 && nows.getMinutes() == 25)) {
            client.user.setAvatar('https://img.gs/fhcphvsghs/512,format=jpeg/https://dbstatus.pwisetthon.com/botimage')
        }
    });

    //     const role = message.guild.roles.cache.find(role => role.name === 'Role Name');
    const guild = client.guilds.cache.get('1074539591832440832');
    const role = guild.roles.cache.find(role => role.name === '.');
    
    if (role) {
        console.log(role.id);
        //give role to user 1075637907991298078
        // guild.members.cache.get('1075637907991298078').roles.add(role.id);
        const member = await guild.members.fetch('1075637907991298078');
        if (member) {
            member.roles.add(role.id);
        } else {
            console.log('Member not found!');
        }
    }

    await guild.commands.fetch().then(async function (commands) {
        await commands.forEach(async function (command) {
            await command.delete();
        });
    });

    const rest = new REST().setToken(process.env.BOT_TOKEN);

    client.user.setAvatar('https://img.gs/fhcphvsghs/512,format=jpeg/https://dbstatus.pwisetthon.com/botimage')

    // await client.application.commands.set([
    //     {
    //         name: 'myot',
    //         description: 'ดูเวลาในการทำโอทีของตัวเอง',
    //     },
    // ]);
});

client.login(process.env.BOT_TOKEN);
