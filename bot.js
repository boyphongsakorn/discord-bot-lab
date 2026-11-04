const { REST , Routes , MessageAttachment, EmbedBuilder, Client, GatewayIntentBits, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ClientUser, AttachmentBuilder, ActivityType } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
var cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

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
    for (const [key, value] of channels) {
        if (value.type == '2') {
            if (value.id != '1074539591832440838') {
                //count member in voice channel
                let members = value.members.size;
                let mutecount = 0;
                let tempmember = [];
                //get all member in voice channel
                value.members.forEach(member => {
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
    let pausemove = true;
    //if user 1074879322143330335,1073167244646948904,1051058825152700416,960152136816156752 one of them is in voice 1074539591832440838
    if (channels.get('1074539591832440838').members.has('1074879322143330335') || channels.get('1074539591832440838').members.has('1073167244646948904') || channels.get('1074539591832440838').members.has('1051058825152700416') || channels.get('1074539591832440838').members.has('960152136816156752')) {
        console.log('someone is in voice channel');
        pausemove = false;
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
                    if (member.voice.selfMute == true) {
                        mutecount++;
                        tempmember.push(member.user.id);
                    }
                });
                if (mutecount == members) {
                    for (let i = 0; i < tempmember.length; i++) {
                        try {
                            if(guild.members.cache.get(tempmember[i]).voice.selfDeaf == false) {
                                guild.members.cache.get(tempmember[i]).voice.setChannel('1074539591832440838');
                                console.log(guild.members.cache.get(tempmember[i]).user.username);
                            }
                        } catch (error) {
                            console.log(error);
                            console.log('is gone');
                        }
                        await new Promise(r => setTimeout(r, Math.floor(Math.random() * 501) + 500));
                    }
                }
            }
        }
    }
}

client.once('ready', async () => {
    console.log('I am ready!');
    const getallmember = await client.guilds.cache.get('1074539591832440832').members.fetch({ withPresences: true });
    console.log(await getallmember.filter((online) => !online.user.bot && (online.presence?.status === "online" || online.presence?.status === "idle" || online.presence?.status === "dnd")).size);
    //get count of all member in voice channel id 1074539591832440838
    console.log(await client.guilds.cache.get('1074539591832440832').channels.cache.get('1074539591832440838').members.size);
    const dayOfWeek = new Date().getDay();
    client.user.setActivity({
        type: ActivityType.Custom,
        name: 'customstatus',
        state: dayOfWeek === 0 || dayOfWeek === 6
            ? 'Not working on weekends'
            : dayOfWeek === 5
                ? 'See you Monday'
                : 'a guy move people to main meeting room at 17:30'
    });
    fetch('http://ip-api.com/json/')
        .then(res => res.json())
        .then(json => {
            if ([0, 5, 6].includes(new Date().getDay())) {
                return;
            }
            const location = json.city === json.regionName
                ? `${json.city} ${json.country}`
                : `${json.city} ${json.regionName} ${json.country}`;
            client.user.setActivity({
                type: ActivityType.Custom,
                name: 'customstatus',
                state: `Deployed at ${location} ISP ${json.org}`
            });
        })
        .catch(err => console.log(err));
    cron.schedule('0 0 * * 0,6', () => {
        client.user.setActivity({
            type: ActivityType.Custom,
            name: 'customstatus',
            state: 'Not working on weekends'
        });
    });
    cron.schedule('30,34,38,42 17 * * 1-5', () => {
        //if hour = 17 and minute = 30
        if (new Date().getHours() == 17 && new Date().getMinutes() == 30) {
            onlineMembersinchannel = false;
        }
        // if((new Date().getMonth() != 9 && (new Date().getDate() != 14 || new Date().getDate() != 23)) || (new Date().getMonth() != 11 && (new Date().getDate() != 5 || new Date().getDate() != 10))) {
            getallmemberintovoicechannel();
        // }
        if (new Date().getDay() == 5) {
            client.user.setActivity({
                type: ActivityType.Custom,
                name: 'customstatus',
                state: 'See you Monday'
            });
        } else {
            client.user.setActivity({
                type: ActivityType.Custom,
                name: 'customstatus',
                state: 'a guy move people to main meeting room at 17:30'
            });
        }

        if (new Date().getMonth() == 11 && new Date().getDay() == 5) {
            if (nows.getDate() >= 24 && nows.getDate() <= 25) {
                client.user.setActivity({
                    type: ActivityType.Custom,
                    name: 'customstatus',
                    state: '🎄🎅🎁🎉🎊🎆🎇🧨🎈🎄'
                });
            } else if (nows.getDate() >= 26 && nows.getDate() <= 31) {
                client.user.setActivity({
                    type: ActivityType.Custom,
                    name: 'customstatus',
                    state: 'Happy New Year ' + (nows.getFullYear() + 543)
                });
            } else if (nows.getDate() == 1) {
                client.user.setActivity({
                    type: ActivityType.Custom,
                    name: 'customstatus',
                    state: 'สุขสันต์วันปีใหม่ ' + (nows.getFullYear() + 543)
                });
            }
        }
    });
    const guild = client.guilds.cache.get('1074539591832440832');
    const role = guild.roles.cache.find(role => role.name === '.');
    
    if (role) {
        console.log(role.id);
        const member = await guild.members.fetch('1075637907991298078');
        if (member && process.env.GIVEROLE == 'true') {
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
});

client.login(process.env.BOT_TOKEN);
