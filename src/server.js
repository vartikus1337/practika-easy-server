const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';
const NEWS_FILE = './news.json';
const GAMES_FILE = './games.json';
const COMMENTS_FILE = './comments.json';
const PASSWORD_ADMIN = 'ad';
const NICKNAME_ADMIN = 'ad';

const {readDataFromFile, writeDataToFile, upload, getNamesImgs} = require('./utils');

app.use(cors()); // Фикс AxiosError ERR_NETWORK (связанное с портом)
app.use(bodyParser.json()); // обработчик json
app.use('/png', express.static(path.join(__dirname, 'png')));
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readDataFromFile(USERS_FILE);

  if (username == NICKNAME_ADMIN && password == PASSWORD_ADMIN) {
    res.status(200).json({ isAdmin: true });
    console.log('ADMIN зашёл');
    return
  }

  const user = users.find(
    user => user.username === username && user.password === password
  );

  if (user) {
    res.status(200).json({ message: 'Login successful'});
    console.log(username, 'зашёл');
  } else {
    res.status(401).json({ message: 'Login failed'});
    console.log(username, 'Попытка входа');
  }
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const users = readDataFromFile(USERS_FILE);

  if (users.find(user => user.username === username) || username == NICKNAME_ADMIN) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const newUser = {
    username,
    password,
    email
  };

  users.push(newUser);
  writeDataToFile(USERS_FILE, users);

  res.status(201).json({ message: 'User registered successfully' });
  console.log(`Пользователь ${username} создан`)
});

app.post('/new_comment', (req, res) => {
  const { username, text, mail} = req.body;

  const newComment = {
    username,
    mail,
    text
  };

  const comments = readDataFromFile(COMMENTS_FILE);

  comments.push(newComment);
  writeDataToFile(COMMENTS_FILE, comments);

  res.status(201).json({ message: 'User registered successfully' });
  console.log(`Комментарий ${username} создан`)
});

app.get('/comments', (req, res) => {
  try {
    const comments = readDataFromFile(COMMENTS_FILE);
    comments.forEach(comment => { delete comment.mail });
    res.status(200).json(comments);
  } catch (parseErr) {
    console.error('Ошибка парсинга JSON:', parseErr);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/data', (req, res) => {
    const news = readDataFromFile(NEWS_FILE);
    const games = readDataFromFile(GAMES_FILE);
    res.status(201).json({ news, games });
});

app.post('/admin_data', (req, res) => {
  const { username, password} = req.body
  if (username !== NICKNAME_ADMIN && password !== PASSWORD_ADMIN) {
    return res.status(409).json({ message: 'Access denied' });
  }
  const users = readDataFromFile(USERS_FILE);
  const news = readDataFromFile(NEWS_FILE);
  const games = readDataFromFile(GAMES_FILE);
  const comments = readDataFromFile(COMMENTS_FILE);

  res.status(200).json({users, news, games, comments})
})

app.post('/upload', upload.single('file'), (req, res) => {
  const { username, password} = req.body
  if (username !== NICKNAME_ADMIN && password !== PASSWORD_ADMIN) {
    return res.status(409).json({ message: 'Access denied' });
  }
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.originalname}`);
});

app.get('/images', (req, res) => {
  res.status(200).json(getNamesImgs())
});

app.post('/removeImg', (req, res) => {
  const {pngDel, username, password} = req.body;
   if (username == NICKNAME_ADMIN && password == PASSWORD_ADMIN) {
      removeImg(pngDel)
   }
})

app.post('admin_update', () => {

})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});