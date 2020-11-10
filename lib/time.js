function now(date = new Date()) {
    return date
        .toLocaleString('zh-Hans-CN', { hour12: false })
        .replace(',', '')
        .split(' ')
        .map(s => s.split('/').reverse().join('-'))
        .join(' ');
}

module.exports = {
    now
};
