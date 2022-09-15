let express = require('express');
let router = express.Router();
const Db_Handler = require('../handlers/db_handler') 

/* GET home page. */
router.get('/invoices', async function(req, res, next) {
  
  res.json({
    "invoices": await Db_Handler.getInvoices()
  })
});

module.exports = router;
