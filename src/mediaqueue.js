const youtube = require('./youtube');

exports.MediaQueue = class {
  constructor() {
    this.que = [];
  }

  async push(username, query, video) {
    const info = await youtube.query(query);
    info['video'] = video;
    for (const i = 0; i < this.que.length; ++i)
      if (this.que[i]['username'] === username) {
        this.que[i]['queue'].push(info);
        return;
      }
    this.que.push({
      username: username,
      queue: [info]
    });
  }

  pop() {
    if (this.que.length === 0)
      return null;
    const q = this.que.shift();
    const ret = q['queue'].shift();
    ret['username'] = q['username'];
    if (q['queue'].length > 0)
      this.que.push(q);
    return ret;
  }

  getQueue() {
    return this.que;
  }
};
