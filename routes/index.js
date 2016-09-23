var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');

var pool = mysql.createPool({
  "host": "eu-cdbr-west-01.cleardb.com",
  "user": "b0bd6590a971c5",
  "password": "5388152b",
  "database": "heroku_479693d37aa70d6",
  "connectionLimit": 10
});

router.get('/', function(req, res){
    res.render('index');
});

router.post('/auth', function(req, res, next) {

  var new_user = req.body;

  pool.query("SELECT * FROM users WHERE social_id=" + new_user.social_id + " LIMIT 1", function(error, rows) {
    var user = rows[0];
    if(rows.length == 0){
      pool.query('INSERT INTO users SET ?', new_user, function(err, result) {
        if (err) {
          throw err;
        }else{
          var user_id = result.insertId;
          pool.query("SELECT * FROM users WHERE id=" + user_id + " LIMIT 1", function(error, rows) {
            var user = rows[0];
            res.send(user);
          });
        }
      });
    }else{
      res.send(user);
    }
  });

});

module.exports = router;
