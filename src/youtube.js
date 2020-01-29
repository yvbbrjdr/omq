const youtubedl = require('youtube-dl');

const youtubeRegex = /(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

exports.query = (q) => {
  if (!youtubeRegex.test(q))
    q = 'ytsearch:' + q;
  return new Promise((resolve, reject) => {
    youtubedl.getInfo(q, (err, info) => {
      if (err)
        reject(err);
      else
        resolve({
          title: info.title,
          uploader: info.uploader,
          url: info.webpage_url,
          thumbnail: info.thumbnail
        });
    });
  });
};
