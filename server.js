const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser")
const jwt = require('jwt-simple')
const ExtractJwt = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy

app.use(bodyParser.json())

const SECRET = "2lagkaggkaalgkagliLIKSalfa"

const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader("authorization"),
   secretOrKey: SECRET,
}
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
   if(payload.sub=== "kennyS") done(null, true);
   else done(null, false);
});

passport.use(jwtAuth);

const requireJWTAuth = passport.authenticate("jwt",{session:false});

app.get("/", requireJWTAuth, (req, res) => {
  res.send("Go to do !!!");
});

const loginMiddleware = (req, res, next) => {
  if (req.body.username === "kennyS" && req.body.password === "123") next()
  else res.send('Not allowed')  
}

app.post("/login", loginMiddleware, (req, res) => { 
   const payload = {
     sub: req.body.username,
     iat: new Date().getTime()
   }
   res.send(jwt.encode(payload, SECRET))
});

app.listen(4000); 