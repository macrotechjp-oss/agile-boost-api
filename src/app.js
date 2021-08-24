const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const config = require('./config/config.json')[app.get('env')];


/**
 * --------------- GENERAL SETUP ---------------
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}))


/**
 * --------------- SESSION SETUP ---------------
 */
const sessionStore = new MySQLStore({
	host: config.host,
	port: config.port,
	user: config.username,
	password: config.password,
  database: config.database,
});
app.use(session({
	key: 'agile_boost_cookie',
	secret: 'c7652de9-c9df-6f55-99da-b268e5560990',
  store: sessionStore,
  cookie: { maxAge : 86400000 },  // 1day
	resave: false,
	saveUninitialized: false
}));


/**
 * --------------- PASSPORT AUTHENTICATION ---------------
 */
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


/**
 * --------------- ROUTES ---------------
 */
// Swagger：APIドキュメント
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Junit：APIユニットテスト
app.use('/test', express.static('coverage/lcov-report'));
// API：バージョン1
app.use('/api/v1', require('./routes/v1/index'));


/**
 * --------------- ERROR HANDLE ---------------
 */
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;