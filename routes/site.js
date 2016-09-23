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

router.get('/id:id', function (req, res){
    res.render('site/index');
});

router.get('/add', function (req, res){
    res.render('site/add');
});

router.post('/save', function(req, res, next) {

    var site = new Object();
    site.user_id = req.body.user_id;
    site.title = req.body.site_title;
    site.menu_type = req.body.site_menu_type;
    site.theme = req.body.site_theme;

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
                        //todo
                    }
                });
            });

        }
    });

    res.redirect('/user/id'+site.user_id+'/profile');
});

module.exports = router;
