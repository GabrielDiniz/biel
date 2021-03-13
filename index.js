const fs = require('fs');
const wa = require('whatsapp-web.js');
const Queue = require('./Queue');
const qrcode = require('qrcode-terminal');



const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const queue = new Queue();
const client = new wa.Client({ puppeteer: { headless: false }, session: sessionCfg });
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});


client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    let proc = queue.getItem(msg.id.remote);
    let resp = proc.processa(msg.body).then((resp)=>{
        if(resp instanceof Array){
            resp.forEach((m)=>{
                msg.reply(m);
            });
        }else{
            msg.reply(resp);
        }
    });
});

client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});
