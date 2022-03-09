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
    const create = db.prepare(`INSERT INTO user(username,password) VALUES(?,?)`);
    const hashedPassword = bcrypt.hashSync(password, 10)
    create.run(username,password);
    console.log('user created')
}

module.exports = createUser

// emilia Gallantpalad
db.close()
