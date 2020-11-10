const { onPageWebSocket } = require('./lib/ws');

onPageWebSocket(({ type, data }) => {
  switch (type) {
    case 'popularity':
        console.log(`当前人气：${ data }.`);
      break;
    case 'message':
        switch (data.cmd) {
          case 'DANMU_MSG':
            console.log(`${data.info[2][1]} 说 ${data.info[1]}`);
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
