var express = require('express');
var app = express();
var handlebars = require('express3-handlebars')
                .create({defaultLayout: 'main',
                        helpers: {
                            section: function (name, options) {
                                if (!this._sections) this._sections = {};
                                this._sections[name] = options.fn(this);
                                return null;
                            }
                        }
                });

var fortune = require('./lib/fortune.js');
var tours = require('./example-jsons/tours');
var getWeatherData = require('./lib/getWeatherData');


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.use(function (req, res, next) {
    if (!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData;
    next();
});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    var randomFortune = 
        fortune[Math.floor(Math.random()*fortune.length)];
    res.render('about', {fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'});
});

app.get('/greeting', function (req, res) {
    res.render('about', {
        message: 'welcome',
        style: req.query.style
    });
});

app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s= '';
    for (var name in req.headers) {
        s+= name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
});

app.get('/api/tours', function (req, res) {
    res.json(tours);
});

/*not sure how this works*/

app.post('/process-contact', function (req, res) {
    console.log('Received contact form ' + req.body.name + ' <' + req.body.email + '> ');
    res.redirect(303, '/thank-you');
});

app.use((express.static(__dirname + '/public')));

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press ctrcl-c to terminate');
});