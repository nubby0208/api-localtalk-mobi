const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketLib = require('./sokets/socket.lib');
// Leo: mix v_chat
const helmet = require('helmet'); // helmet morgan body-parser mongoose
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {initCron, stopCron} = require('./cron');

const app = express();
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: "https://5aaabe4a9c76498c855e22044871c85d@o1190728.ingest.sentry.io/6311924",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);


dotenv.config();
connectDB();

// mongoose.Promise = global.Promise;  

//   const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   };

//   const conn = mongoose.connect(`${process.env.MONGO_URI}`, options,()=>{
// console.log("Connected!")
//   });

app.use(cors());
//app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.get('/api/',function(req,res){
  res.send("API " + new Date());
});
app.get('/api/test',function(req,res){
  res.send("API Test" + new Date());
});

initCron();

// v_chat mix ---------------------------------------

// adding Helmet to enhance your API's security
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//to send data from post man and any front end
app.use(bodyParser.urlencoded({ extended: false }));

// public place for img
app.use('/uploads', express.static('uploads'));

// parse an HTML body into a string
app.use(bodyParser.json());
const serviceAccount = require('./vchatappmongo-firebase-adminsdk-r81s8-00cd33ab16.json');
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yourtech-a45201.firebaseio.com"
});

const server = require("http").createServer(app);

// v_chat mix: socket - index.js
//const socketIO = require("socket.io");

//const io = socketIO(server);
//app.set('socket.io', io);

//io.onlineUsers = {};

//require("./sokets/init.socket")(io);
//require("./sokets/convs.socket")(io);
//require("./sokets/message.socket")(io);
//require("./sokets/publicRoomsSocket")(io);


// --------------------------------

const hostname = '127.0.0.1';
const port = process.env.PORT || 80;


// const server = app.listen(port, () => console.log(`Listening *: ${port}`));
// server.listen(port,hostname, () => {
//   console.log(`Listening *: ${port}`);
// });
server.listen(port, () => {
  console.log(`Listening *: ${port}`);
});

socketLib(server);
const auth = require('./routes/auth');
const user = require('./routes/user');
const analytics = require('./routes/analytics');
const prohibitedwords = require('./routes/prohibatedwords');
const blocklimitedwords = require('./routes/blocklimitedwords');
const chat = require('./routes/chat');
const pages = require('./routes/pages');

// v_chat mix
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter.js');
const likesRouter = require('./routes/likesRouter');
const conversionsRouter = require('./routes/conversionsRouter');
const messageRouter = require('./routes/messagesRouter');
const commentRouter = require('./routes/commentsRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const publicRoomRouter = require('./routes/publicRoomsRouter');
const publicRoomMessagesRouter = require('./routes/publicRoomMessagesRouter');

const settingsRouter = require('./routes/settingsRouter');
const numbersRouter = require('./routes/numbersRouter');

app.use('/api/v1/analytics', analytics);
app.use('/api/v1/auth', auth);
// app.use('/api/v1/user', user);
app.use('/api/v1/prohibited-words', prohibitedwords);
app.use('/api/v1/block-limited-words', blocklimitedwords);
app.use('/api/v1/pages', pages);
app.use('/api/v1/chat', chat);

// v_chat mix
app.use('/api/v1/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/v1/conversions', conversionsRouter);
app.use('/api/like', likesRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/comment', commentRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/v1/rooms', publicRoomRouter);
app.use('/api/v1/roomMessages', publicRoomMessagesRouter);

app.use('/api/v1/settings', settingsRouter);
app.use('/api/v1/numbers/', numbersRouter);

app.use(errorHandler);
// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
