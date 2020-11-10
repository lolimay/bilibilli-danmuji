// ref: https://github.com/lovelyyoshino/Bilibili-Live-API/blob/f06ebfd945700a87f421e7277219d6d8e2abc784/API.WebSocket.md
const zlib = require('zlib');

const readInt = (buffer, start, len) => {
  let result = 0
  for (let i = len - 1; i >= 0; i--) {
    result += Math.pow(256, len - i - 1) * buffer[start + i]
  }
  return result;
}

const decode = (blob) => {
  const buffer = new Uint8Array(blob);
  const packetLen = readInt(buffer, 0, 4);
  const headerLen = readInt(buffer, 4, 2);
  const op = readInt(buffer, 8, 4);

    switch (op) {
        case 3: // 房间人气
            return { type: 'popularity', data: readInt(buffer, 16, 4) };
        case 5: // 消息
            const buff = zlib.inflateSync(buffer.slice(headerLen));
            const decoded = new TextDecoder('utf-8').decode(buff);
            return { type: 'message', data: JSON.parse(decoded.slice(decoded.indexOf('{'))) };
        default:
            return { type: 'unknown' };
    }
};

module.exports = {
  decode
};
