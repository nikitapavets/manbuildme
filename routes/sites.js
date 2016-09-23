var express = require('express');
var router = express.Router();
var mysql       = require('mysql');

var pool = mysql.createPool({
    "host": "eu-cdbr-west-01.cleardb.com",
    "user": "b0bd6590a971c5",
    "password": "5388152b",
    "database": "heroku_479693d37aa70d6",
    "connectionLimit": 10
});

router.get('/add', function (req, res){
    res.render('sites/add');
});

router.post('/save', function(req, res, next) {

    var site = new Object();
    site.user_id = req.body.user_id;
    site.title = req.body.site_title;
    site.menu_type = req.body.site_menu_type;

    var pages = [
        {'title': req.body.site_page1},
        {'title': req.body.site_page2},
        {'title': req.body.site_page3},
        {'title': req.body.site_page4},
        {'title': req.body.site_page5}
    ];


    pool.query('INSERT INTO sites SET ?', site, function(err, result) {
        if (err) {
            throw err;
        }else{
            pages.forEach(function(page){
                page.site_id = result.insertId;
                pool.query('INSERT INTO pages SET ?', page, function(err, result) {
                    if (err) {
                        throw err;
                    }else{
                        //
                    }
                });
                console.log(page);
            });

        }
    });

    res.render('index');
});

module.exports = router;
