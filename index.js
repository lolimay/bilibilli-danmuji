const { onPageWebSocket } = require('./lib/ws');
const { now } = require('./lib/time');
const { say } = require('./lib/tts');

onPageWebSocket(({ type, data }) => {
  switch (type) {
    case 'popularity':
        console.log(`[${ now() }] 当前人气值：${ data }`);
      break;
    case 'message':
        switch (data.cmd) {
          case 'DANMU_MSG':
            console.log(`[${ now() }] ${data.info[2][1]} 说 ${data.info[1]}`);
            say(`${data.info[2][1]} 说 ${data.info[1]}`);
            break;
          case 'WELCOME':
            console.log(`欢迎 ${ data.data.uname}`);
            break;
          default:
            return;
        }
    default:
        break;
  }
});
