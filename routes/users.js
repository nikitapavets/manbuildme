var express = require('express');
var router = express.Router();

router.get('/profile', function (req, res){
  res.render('users/profile');
});

module.exports = router;
