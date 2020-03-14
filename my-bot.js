const {Wechaty, Contact, log, Message, config} = require('wechaty')
const {PuppetPadplus} = require('wechaty-puppet-padplus')
const QrcodeTerminal = require('qrcode-terminal')
const FileBox  = require('file-box')

const token = 'puppet_padplus_05dc179a94319ef4'

const puppet = new PuppetPadplus({
    token,
})

const name = 'my-bot'
const slave = '山楂流水'
const master = '山楂助手'
const slaveID = `wxid_n884s1curgiu22`
const masterID = `wxid_jestsud0sg7z22`

const bot = new Wechaty({
    puppet,
    name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
    .on('scan', onScan)
    .on('login', onLogin)
    .on('message', msg => {
        const contact = msg.from()
        const text = msg.text()
        const room = msg.room()
        const toContact = msg.to()

        console.log(`好友 : ${contact.name()}`)
        console.log(`消息 : ${text}`)
        console.log(`群聊 : ${room}`)
        console.log(`<=========>`)

        messageForward(contact, text, room, toContact);

    })
    .start().catch(console.error)


// 扫描触发
function onScan(qrcode, status) {
    QrcodeTerminal.generate(qrcode, {small: false})
}  // show qrcode on console


// 登陆触发
function onLogin(user) {
    console.log(`${user} 登陆`)
    main()
}

// 消息转发
async function messageForward(sender, text, room, accepter) {
    const contact = await bot.Contact.load(masterID)
    // 好友为主号
    if (sender.name() === (master)) {
        var text = text.toString();
        var id = text.substr(0, text.indexOf(`=>`));
        var msg = text.substr(text.indexOf(`=>`) + 2, text.length);
        console.log(`消息：` + text)
        console.log(`ID：` + id)
        console.log(`内容：` + msg)
        if (text.startsWith(`wxid_`) && !id.length == 0) {
                const search = bot.Contact.load(`${id}`);
                if (search.friend()) {
                    if (!search.self() && !search.name() === master) {
                        search.say(msg);
                    }
                }else {
                    contact.say(id + `,不存在此好友.`);
                }
        }else {
            contact.say(`非法消息.`);
        }
        // 好友非助手号,即除了本号的其他好友
    } else if (!(sender.name() === (master))) {
        contact.say(
            `${sender.id}=>`
        );
        contact.say(
            `ID   ：${sender.id},` + `\n`
            + `好友 : ${sender.name()},` + `\n`
            +`消息 : ${text},` + `\n`
            +`群聊 : ${room}` + `\n`
        );
    }
}

// 登陆执行
async function main() {
    const contact = await bot.Contact.find({name: master})
    contact.say('助手开始运行..')
}


  
 
  
