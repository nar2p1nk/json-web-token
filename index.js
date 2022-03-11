const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const bodyParser = require('body-parser');
const port = 8000;
const passport = require('passport');
const strategy = require('./jwtAuth');
const database = require('./database');
const flash = require('express-flash');
const sqlite = require('better-sqlite3');
const session = require('express-session');

const sqliteStore = require('better-sqlite3-session-store')(session);

const userDb = new sqlite('users.db',{log:console.log()});
const db = new sqlite('sessions.db');

const users = database.db.prepare(`SELECT * FROM user`);
app.use(express.static('public'))
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
passport.use(strategy);

app.use(flash())

app.use(session({
  secret:'cartooney looney',
  resave:false,
  store: new sqliteStore({
    client:db,
    expired:{
      clear:true,
      intervalMs: 1000 * 60 * 15
    }
  }),
}))

app.get('/login',(req,res,next)=>{
  res.render('login.ejs')
})

app.post('/login',(req,res)=>{
//  if(req.body.name && req.body.password){
    const name = req.body.name;
    const password = req.body.password
//  }

  const user = userDb.prepare(`
  SELECT * FROM user WHERE username = ?`).get(name);
 // if(!user){res.status(401).json({error:'no user found'})};

  if(bcrypt.compareSync(password, hashedPassword)){
    const payload = {id:user.id};
    const token = jwt.sign(payload,jwtOptions.secretOrKey);
    res.json({status:'ok',token:token});
  }//else{res.status(401).json({error:"password did not match"})};



})

app.get('/',(req,res)=>{
    res.json({message:"Express is down"})
})

app.get('/secret',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const name = req.body.name
  res.json({
    secret:'success! you can\'t see this without a jw token',
    username:name
  })
})

app.get('/secretDebug',(req,res,next)=>{
  console.log(req.get('Authorization'));
  next();
},(req,res)=>{
  res.json('debugging')
})

database.db.close()

app.listen(port,()=>{
    console.log(`server at localhost:${port}`)
})
