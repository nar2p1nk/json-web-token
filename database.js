const bcrypt = require('bcrypt');
const sqlite3 = require('better-sqlite3');
const _ = require('lodash');
const db = new sqlite3('users.db');

db.prepare(`CREATE TABLE IF NOT EXISTS user(
id INTEGER PRIMARY KEY,
username TEXT NOT NULL,
password TEXT NOT NULL
)`).run()


function createUser(username,password){
    const hashedPassword = bcrypt.hashSync(password, 10)
    db.prepare(`INSERT INTO user(username,password) VALUES(?,?)`).run(username,hashedPassword);
}



module.exports = {createUser,db}

