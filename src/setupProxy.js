// this is not an proxy configuration file, it is just named as such so that react-scripts picks it up
const multer = require('multer');
const fs = require('fs');

const DEST = 'uploads';
const ALLOWED_MIMETYPES = new Set(['image/jpeg', 'image/png']); // eslint-disable-line

const files = new Map(); // safe-name => original-name

// multer creates a filename so we limit attack vector of deleting or saving outside the directory ie `../../...filename`
const upload = multer({
  dest: DEST,
  fileFilter: (req, file, cb) => {
    const { mimetype } = file;

    if(!ALLOWED_MIMETYPES.has(mimetype)) {
      return cb(new Error('filetype not allowed'), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 10000000
  }
});

module.exports = function(app) {
  app.get('/api/files', function(req, res) {
    const { q: query } = req.query;

    const acc = [];

    files.forEach((filename, filekey) => {
      if(!query || filename.includes(query)) {
        acc.push({ filekey, filename, size: fs.statSync(`${DEST}/${filekey}`).size });
      }
    });

    res.send({ files: acc });
  });

  app.post('/api/files', upload.single('file'), function(req, res) {
    const {
      filename: filekey,
      originalname: filename,
      size
    } = req.file;

    files.set(filekey, filename);

    res.send({ filename, filekey, size });
  });

  app.delete('/api/files/:filekey', function(req, res) {
    const { filekey } = req.params;

    if (!files.has(filekey)) {
      return res.status(404).send({ msg: 'File does not exist on the server' });
    }

    fs.unlink(`${DEST}/${filekey}`, err => {
      if(err) {
        return res.status(400).send({ msg: 'Delete failed' });
      }

      files.delete(filekey);

      res.send({ filekey });
    });
  });

  app.use(function (err, req, res, next) {
    // TODO filter mesages so not all errors get to client as-is
    res.status(400).send({ msg: err.message });
  })
};
