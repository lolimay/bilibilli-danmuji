const XiaoAi = require('xiaoai-tts');

async function say(text) {
    const client = new XiaoAi(process.env.XIAOAI_USERNAME, process.env.XIAOAI_PASSWORD);
    const devices = await client.getDevice();

    for (const { deviceID } of devices) {
        client.useDevice(deviceID);
        client.say(text);
    }
}

module.exports = {
    say
}
