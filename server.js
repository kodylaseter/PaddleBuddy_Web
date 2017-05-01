// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var port = process.env.OPENSHIFT_NODEJS_PORT || 4000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var passport = require('passport');
var flash    = require('connect-flash');
var morgan = require('morgan');             // log requests to the console (express4)
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var mysql = require('mysql');

var configDB = require('./config/database.js');
var connection = mysql.createConnection({
    host     : configDB.host,
    user     : configDB.user,
    password : configDB.password,
    port     : configDB.port,
    database : configDB.database
});

app.use(require('connect-livereload')({port: 35729}));
app.use(express.static(__dirname + '/public'));        
app.use(morgan('dev'));                          
app.use(bodyParser.urlencoded({'extended':'true'}));     
app.use(bodyParser.json());    
app.use(cookieParser()); 
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.set('port', process.env.PORT || 8080);

//passport stuff
app.use(session({
    secret: 'paddlebuddy_temp_secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//ROUTES
require('./app/routes.js')(app, passport, connection);


//launch server--------------------------------------------

app.listen(port, ip);
console.log("App listening on " + ip + ":" + port);