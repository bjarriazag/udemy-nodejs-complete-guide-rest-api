const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const socketIO = require('./socket');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();
const MONGODB_URI =
  'mongodb+srv://barriaza:34FtAsSQr3cv@cluster-east.coyk6.mongodb.net/node-complete-guide-blog';

// Store images
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Utils
app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// Headers CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Middleware Error Handling
app.use((error, req, res) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});

// Application
const start = async () => {
  const port = 8080;
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      const server = app.listen(port, () => {
        console.log(`Listening on port ${port}!!!!!!!!`);
      });
      const io = socketIO.init(server);
      io.on('connection', () => {
        console.log('Socket: Client connected');
      });
    })
    .catch(console.error);
};

start();
