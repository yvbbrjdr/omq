const youtube = require('./youtube.js');

youtube.query('seyana').then((info) => {
  console.log(info);
});
