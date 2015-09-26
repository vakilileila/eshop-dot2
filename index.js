var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var favicon = require('serve-favicon');
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(require("express-ejs-layouts"));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/dbDota');
var db = mongoose.connection;

db.on('error', function (error) {
    console.error('mongodb connection error')
    console.error(error.toString());
});

db.once('open', function callback() {
    console.log('mongodb open');
});

app.get('/', function (req, res) {
    res.render('./index.ejs', {
        title: 'Hello ejs', names: [
            'ali', 'hassan', 'hossein'
        ]
    });
});

app.get('/heroSets', function (req, res) {
    res.render('./heroSets.ejs', {title: 'heroSets'});
});
app.get('/aboutUs', function (req, res) {
    res.render('./aboutUs.ejs', {title: 'About Us'});
});

app.get('/createHero', function (req, res) {
    res.render('./createHero');
});

var Hero = mongoose.model('Hero', {
    name: String,
    imageUrl: String,
    category: {},
    itemName: String
});

app.post('/createHero', function (req, res) {
    var newHero = new Hero(req.body);
    newHero.save(function (err) {
        if (err) {
            console.log(err);
            res.end('new hero failed ...');
            return;
        }
        res.end('New Hero added successfully');
    });
});

app.get('/heros', function (req, res) {
    Hero.find().exec(function (err, heros) {
        if (err) {
            console.log(err);
            res.end('Fetching data failed...');
            return;
        }

        res.render('./heros.ejs', {heros: heros});
    });
});

app.listen(3030);

console.log('port 3030 is listening ...');