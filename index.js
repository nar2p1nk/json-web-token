const app = require('express')();
const _ = require('lodash');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 8000;

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const jwtStrategy = passportJWT.Strategy;


const users = [
  {
    id: 1,
    name: 'jonathanmh',
    password: '%2yx4'
  },
  {
    id: 2,
    name: 'test',
    password: 'test'
  }
];


const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'tasmine';

const strategy = new jwtStrategy(jwtOptions,(payload,next)=>{
    console.log('payload received',jwt_payload);

    const user = users[_.findIndex(users,{id:jwt_payload.id})]
    if(user){next(null,user)}
    else{next(null,false)}
});

app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
passport.use(strategy);

app.post('/login',(req,res)=>{
//  if(req.body.name && req.body.password){
    const name = req.body.name;
    const password = req.body.password
//  }

  const user = users[_.findIndex(users,{name:name})]

  if(!user){res.status(401).json({error:'no user found'})};

  if(user.password === password){
    const payload = {id:user.id};
    const token = jwt.sign(payload,jwtOptions.secretOrKey);
    res.json({status:'ok',token:token});
  }else{res.status(401).json({error:"password did not match"})};



})



app.get('/',(req,res)=>{
    res.json({message:"Express is down"})
})

app.listen(port,()=>{
    console.log(`server at localhost:${port}`)
})