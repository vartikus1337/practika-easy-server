# Тут немного сломанная установка

1.  Сначала переносишь `package.json` в `../` (на уровень выше)

```bash
npm install
```

2.  Потом `package.json` перекидываешь в `src/`
3.  Переходишь сам в `src`

```bash
cd ./src/
```

4.  Запускаешь `package.json`

```bash
npm start
```

## Получается:

```bash
practika-easy-server
├── node_modules
├── src
│   ├── png
│   │   ├── *.png
│   ├── *.json
│   ├── package.json
│   ├── server.js
│   ├── users.json
│   ├── utils.js
├── node_modules
├── .gitignore
├── package-lock.json
└── README.MD
```

### Писал в попыхах могут быть ошибки такие как practika
