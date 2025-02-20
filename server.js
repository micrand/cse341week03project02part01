const express = require('express');
const bodyParser = require('body-parser')

const mongodb = require('./config/db');

// OAuth implementation
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3002;

app
    .use(bodyParser.json())
    .use(session({
        secret:"secret" ,
        resave: false ,
        saveUninitialized: true ,
    }))

    .use(passport.initialize())

    .use(passport.session())

    .use((req, res, next) => {
        res.setHeader('Acces-Control-Allow-Origin', '*');
        res.setHeader(
            'Acces-Control-Allow-Headers',
            'Origin, X-Request-with, Content-Type, Accept, Z-Key'
        );
        res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: '*'}))
    .use("/", require('./routes/index'));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    function(accesToken, refreshToken, profile, done) {
        //User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return done(null, profile)
        //});
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged  in as ${req.session.user.displayName}` : "Logged Out")});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session:false}),
    (req, res)  => {
        req.session.user = req.user;
        res.redirect('/');
    });

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, ()=> {console.log(`Application running on port ${process.env.PROJECT_URL}:${port}`)});
    }
});
