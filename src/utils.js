const fs = require('fs');
const multer = require('multer');
const path = require('path');

const readDataFromFile = (pathToFile) => {
  if (fs.existsSync(pathToFile)) {
    const data = fs.readFileSync(pathToFile);
    try {
      return JSON.parse(data)
    } catch {
      return [];
    }
  } else {
    console.error('No file', pathToFile)
    return [];
  }
};

const writeDataToFile = (pathFile, data) => {
  fs.writeFileSync(pathFile, JSON.stringify(data, null, 2));
};

const getNamesImgs = () => {
  let pngFiles = [];
  pngFiles = fs.readdirSync('png', (err, files) => {
      if (err) {
          console.log(err);
          return
      }
      return files.map(fileName => fileName.replace(".png", ""));
  });
  return pngFiles;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'png');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '.png');
  }
});

const upload = multer({ storage: storage });

module.exports = {
  readDataFromFile,
  writeDataToFile,
  getNamesImgs,
  upload
};