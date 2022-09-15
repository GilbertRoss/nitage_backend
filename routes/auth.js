let express = require('express');
let router = express.Router();
require('dotenv').config()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', (req, res) => {
  const {username, password} = req.body;
  if(!CreadentialsCheck(username, password)){
    res.status(401).end()
  }

  const token = jwt.sign({username}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRATION,
  })

  console.log({"token": token});

  res.cookie("token", token, {maxAge: process.env.JWT_EXPIRATION * 1000})
  res.end()
});

router.post('/register', (req,res) => {
  const {username, password} = req.body;
  if(!checkUserExistence(username)){
    insertUser(username, password);
    res.statusMessage = "User registred successfully!"
    res.status(200).end()
  }

  res.statusMessage = "Username already exists!"
  res.status(400).end();
})

module.exports = router;
