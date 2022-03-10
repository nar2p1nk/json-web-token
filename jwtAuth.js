const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const sqlite = require('better-sqlite3');

const ExtractJwt = passportJWT.ExtractJwt;
const jwtStrategy = passportJWT.Strategy;

const db = new sqlite('users.db');

const users = db.prepare(`SELECT * FROM user `).get();

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'tasmine';

const strategy = new jwtStrategy(jwtOptions,(payload,next)=>{
    console.log('payload received',payload);

    const user = users[_.findIndex(users,{id:payload.id})]
    if(user){next(null,user)}
    else{next(null,false)}
});

module.exports = strategy;

db.close()
