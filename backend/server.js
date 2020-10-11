const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

var flash = require('express-flash');
var session = require('express-session')

const routes=require('./routes/routes')

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./cert/privateKey.cer', 'utf8');
var certificate = fs.readFileSync('./cert/fullChain.cer', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const app = express();
const port = process.env.PORT || 80;

// your express configuration here

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  return next();
});

mongoose
  .connect(
    process.env.dbURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use(session({ secret: 'session secret key' }))
app.use(flash())

// app.use('/api/users', users);
// app.use('/api/incident',incident);

// app.use('/api/news',news)
app.use(routes)

//app.use('/contacts', contacts);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'client', 'build', 'index.html') 
    );
  });
}


if (process.env.SERVER_ENV === 'LOCALHOST') {
  var httpServer = http.createServer(app);
  httpServer.listen(8080);
}
if (process.env.SERVER_ENV === 'PRODUCTION') {
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(5000);
}

