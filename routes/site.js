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

router.get('/id:id/page/id:page_id', function (req, res){

    var site_id = req.params.id;
    var page_id = req.params.page_id;
    var site = new Object();

    var sql = 'SELECT * ' +
        'FROM sites ' +
        'WHERE id = ' + site_id + ' ' +
        'LIMIT 1';
    pool.query(sql, function(error, sites_rows) {

        site = sites_rows[0];

        var site_id = site.id;
        site.pages = [];
        var sql = 'SELECT * ' +
            'FROM pages ' +
            'WHERE site_id = ' + site_id + ' ' +
            'ORDER BY update_date DESC';
        pool.query(sql, function (error, pages_rows) {
            site.pages = pages_rows;
            res.render('site/page', {site: site, page_id: page_id});
        });
    });
});

router.get('/id:id/page/id:page_id/edit', function (req, res){

    var site_id = req.params.id;
    var page_id = req.params.page_id;
    var site = new Object();

    var sql = 'SELECT * ' +
        'FROM sites ' +
        'WHERE id = ' + site_id + ' ' +
        'LIMIT 1';
    pool.query(sql, function(error, sites_rows) {

        site = sites_rows[0];

        var site_id = site.id;
        site.pages = [];
        var sql = 'SELECT * ' +
            'FROM pages ' +
            'WHERE site_id = ' + site_id + ' ' +
            'ORDER BY update_date DESC';
        pool.query(sql, function (error, pages_rows) {
            site.pages = pages_rows;
            res.render('site/edit_page', {site: site, page_id: page_id});
        });
    });
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
