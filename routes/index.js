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

  var sql = 'SELECT p.id, p.title, p.update_date, p.create_date, p.rate, s.id AS site_id, s.title AS site_name, s.theme ' +
    'FROM pages AS p ' +
    'INNER JOIN sites AS s ON p.site_id = s.id ' +
    'ORDER BY p.create_date DESC ' +
    'LIMIT 5';
  pool.query(sql, function(error, pages_rows) {

    var last_pages = pages_rows;
      console.log(error);
    res.render('index', {last_pages: last_pages});
  });
});

router.post('/auth', function(req, res, next) {

  var new_user = req.body;

  pool.query("SELECT * FROM users WHERE social_id=" + new_user.social_id + " LIMIT 1", function(error, rows) {
    var user = rows[0];
    if(rows.length == 0){
      pool.query('INSERT INTO user SET ?', new_user, function(err, result) {
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
