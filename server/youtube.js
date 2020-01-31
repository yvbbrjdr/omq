const youtubedl = require('youtube-dl');

exports.query = (q) => {
  return new Promise((resolve, reject) => {
    youtubedl.getInfo(q, (err, info) => {
      if (err) {
        youtubedl.getInfo('ytsearch:' + q, (err, info) => {
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
      } else {
        resolve({
          title: info.title,
          uploader: info.uploader,
          url: info.webpage_url,
          thumbnail: info.thumbnail
        });
      }
    });
  });
};
