let express = require('express');
let router = express.Router();
const Db_Handler = require('../handlers/db_handler')
const JWTAuthorize = require('../middlewares/authenticateJWT') 

/* GET home page. */
router.get('/invoices', JWTAuthorize.authenticateJWT ,async function(req, res, next) {
  
  res.json({
    "invoices": await Db_Handler.getInvoices()
  })
});

router.patch('/invoices', JWTAuthorize.authenticateJWT,async function(req, res, next){
  const {id, date} = req.body;
  try{
    Db_Handler.updateInvoice(date, id);
    res.json({
      "message": "Update successfull"
    })
  }catch(err){
    res.json({
      "error": err
    })
  }


  
})

module.exports = router;
