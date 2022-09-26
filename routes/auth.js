let express = require('express');
let router = express.Router();
require('dotenv').config()
const Db_Handler = require('../handlers/db_handler')
let jwt = require('jsonwebtoken');
const JWTAuthorize = require('../middlewares/authenticateJWT')


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if(await Db_Handler.CreadentialsCheck(username, password)){
    const token = jwt.sign({username}, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: Math.floor(Date.now() / 1000) + (3600 * parseInt(process.env.JWT_EXPIRATION)),
    })
  
  
    res.cookie("token", `Bearer ${token}`, {maxAge: parseInt(3600 * parseInt(process.env.JWT_EXPIRATION) * 1000)})
    res.json({
      access_token: `Bearer ${token}`
    })
    res.end()
    
  }else{
    res.status(400).json({message: 'Password or username does not match'});
  }


  
});

router.post('/register', JWTAuthorize.authenticateJWT, (req,res) => {
  const {username, password} = req.body;
  console.log(username);
  console.log(password)
  if(Db_Handler.checkUserExistence(username)){
    Db_Handler.insertUser(username, password);
    res.statusMessage = "User registred successfully!"
    res.status(200).end()
  }

  res.statusMessage = "Username already exists!"
  res.status(400).end();
})

module.exports = router;
