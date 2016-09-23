var express = require('express');
var router = express.Router();

router.get('/add', function (req, res){
    res.render('sites/add');
});

module.exports = router;
