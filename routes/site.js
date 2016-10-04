var express = require('express');
var router = express.Router();
var mysql       = require('mysql');
var eachOf  = require('async/eachOf');
var async = require('async');

/*var pool = mysql.createPool({
    host: "eu-cdbr-west-01.cleardb.com",
    user: "b0bd6590a971c5",
    password: "5388152b",
    database: "heroku_479693d37aa70d6",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});*/
var pool = mysql.createConnection({
    host     : 'eu-cdbr-west-01.cleardb.com',
    user     : 'b0bd6590a971c5',
    password : '5388152b',
    database: "heroku_479693d37aa70d6",
    multipleStatements: true,
    //migrate: 'safe'
});

router.get('/id:id', function (req, res) {

    var site_id = req.params.id;f
    var sql = 'SELECT * ' +
        'FROM pages ' +
        'WHERE site_id = ' + site_id + ' ' +
        'ORDER BY position ' +
        'LIMIT 1';
    pool.query(sql, function(error, pages_rows) {
        res.redirect('/site/id'+site_id+'/page/id'+pages_rows[0].id);
    });
});

router.get('/id:id/page/id:page_id', function (req, res){

    var site_id = req.params.id;
    var page_id = req.params.page_id;
    var site = new Object();

    var sql = 'SELECT * ' +
        'FROM sites ' +
        'WHERE id = ' + site_id + ' ' +
        'LIMIT 1'
    pool.query(sql, function(error, sites_rows) {

        site = sites_rows[0];

        var site_id = site.id;
        site.pages = [];
        var sql = 'SELECT * ' +
            'FROM pages ' +
            'WHERE site_id = ' + site_id + ' ' +
            'ORDER BY position';
        pool.query(sql, function (error, pages_rows) {
            site.pages = pages_rows;
            site.pages.forEach(function(page){

                if(page['id'] == page_id){
                    var current_page = page;
                    var sql = 'SELECT * ' +
                        'FROM components ' +
                        'WHERE page_id = ' + page_id  + ' ' +
                        'ORDER BY position';
                    pool.query(sql, function (error, components_rows) {
                        current_page.components = components_rows;
                        var sql = 'SELECT AVG(rate) AS avg_rate ' +
                                'FROM rate ' +
                                'WHERE page_id = ' + page_id;
                        pool.query(sql, function (error, rate_rows) {
                            if(rate_rows){
                                current_page.rate = rate_rows[0].avg_rate;
                            }else{
                                current_page.rate = 0;
                            }

                            async.forEachOf(current_page.components, function (component, index, callback) {

                                if(current_page.components[index].label == 'image') {
                                    current_page.components[index].images = [];
                                    var sql = 'SELECT * ' +
                                        'FROM images ' +
                                        'WHERE component_id = ' + current_page.components[index].id + ' ' +
                                        'ORDER BY id';
                                    pool.query(sql, function (error, images_rows) {
                                        current_page.components[index].images = images_rows;
                                        callback();
                                    });
                                }else{
                                    callback();
                                }
                            }, function (error) {
                                res.render('site/page', {site: site, page_id: page_id, page: current_page});
                            });

                        })

                    });
                }
            });

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
            'ORDER BY position';
        pool.query(sql, function (error, pages_rows) {
            site.pages = pages_rows;

            res.render('site/edit_page', {site: site, page_id: page_id});
        });
    });
});

router.post('/get_page', function(req, res, next) {

    var page = new Object();

    var sql =  'SELECT * ' +
        'FROM pages ' +
        'WHERE id = ' + req.body.page_id  + ' ' +
        'LIMIT 1';
    pool.query(sql, function (error, pages_rows) {

        if(pages_rows.length > 0){

            page = pages_rows[0]

            var sql = 'SELECT * ' +
                'FROM components ' +
                'WHERE page_id = ' + req.body.page_id  + ' ' +
                'ORDER BY position';
            pool.query(sql, function (error, components_rows) {
                page.components = components_rows;

                async.forEachOf(page.components, function (component, index, callback) {

                    if(page.components[index].label == 'image') {
                        page.components[index].images = [];
                        var sql = 'SELECT * ' +
                            'FROM images ' +
                            'WHERE component_id = ' + page.components[index].id + ' ' +
                            'ORDER BY id';
                        pool.query(sql, function (error, images_rows) {
                            page.components[index].images = images_rows;
                            callback();
                        });
                    }else{
                        callback();
                    }
                }, function (error) {

                    res.send(page);
                });


            })
        }
    })

});

router.get('/add', function (req, res){
    res.render('site/add');
});

router.post('/add_rate', function(req, res, next) {
    var rate = new Object();
    rate.page_id = req.body.page_id;
    rate.user_id = req.body.user_id;
    rate.rate = req.body.rate;

    var sql = 'DELETE FROM rate ' +
            'WHERE page_id = ' + rate.page_id + ' ' +
            'AND user_id = ' + rate.user_id;
    pool.query(sql, function(err, res){
        if (err) {
            throw err;
        }else{
            pool.query('INSERT INTO rate SET ?', rate, function(err, res){
                if (err) {
                    throw err;
                }else{
                    //todo
                }
            });
        }
    });


});

router.post('/save', function(req, res, next) {

    var site = new Object();
    site.user_id = req.body.user_id;
    site.title = req.body.site_title;
    site.menu_type = req.body.site_menu_type;
    site.theme = req.body.site_theme;

    var pages = [
        {
            'title': req.body.site_page1,
            'layout': req.body.site_page1_layout,
            'position': 0,
            'update_date': 'CURRENT_TIMESTAMP'
        },

        {
            'title': req.body.site_page2,
            'layout': req.body.site_page2_layout,
            'position': 1,
            'update_date': 'CURRENT_TIMESTAMP'
        },

        {
            'title': req.body.site_page3,
            'layout': req.body.site_page3_layout,
            'position': 2,
            'update_date': 'CURRENT_TIMESTAMP'
        },

        {
            'title': req.body.site_page4,
            'layout': req.body.site_page4_layout,
            'position': 3,
            'update_date': 'CURRENT_TIMESTAMP'
        },

        {
            'title': req.body.site_page5,
            'layout': req.body.site_page5_layout,
            'position': 4,
            'update_date': 'CURRENT_TIMESTAMP'
        }
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

router.get('/id:id/update', function (req, res){

    var site_id = req.params.id;
    var site = new Object();

    var sql = 'SELECT * ' +
        'FROM sites ' +
        'WHERE id = ' + site_id + ' ' +
        'LIMIT 1';
    pool.query(sql, function(error, sites_rows) {

        site = sites_rows[0];
        site.pages = [];

        var sql = 'SELECT * ' +
            'FROM pages ' +
            'WHERE site_id = ' + site_id + ' ' +
            'ORDER BY position';
        pool.query(sql, function (error, pages_rows) {
            if(!error){
                site.pages = pages_rows;
                res.render('site/edit', {site: site});
            }else{
            }
        });
    });
});

router.post('/update', function(req, res, next) {

    var site = new Object();
    site.user_id = req.body.user_id;
    site.title = req.body.site_title;
    site.menu_type = req.body.site_menu_type;
    site.theme = req.body.site_theme;
    site.id = req.body.site_id;

    var pages = [
        {
            'title': req.body.site_page1,
            'id': parseInt(req.body.site_page1_id),
            'position': 0
        },

        {
            'title': req.body.site_page2,
            'id': parseInt(req.body.site_page2_id),
            'position': 1
        },

        {
            'title': req.body.site_page3,
            'id': parseInt(req.body.site_page3_id),
            'position': 2
        },

        {
            'title': req.body.site_page4,
            'id': parseInt(req.body.site_page4_id),
            'position': 3
        },

        {
            'title': req.body.site_page5,
            'id': parseInt(req.body.site_page5_id),
            'position': 4
        }
    ];

    var sql = 'UPDATE sites ' +
            'SET title = ?, menu_type = ?, theme = ? ' +
            'WHERE id = ?';
    pool.query(sql, [site.title, site.menu_type, site.theme, site.id], function(err, result) {
        if (err) {
            throw err;
        }else{
            pages.forEach(function(page){
                var sql = 'UPDATE pages ' +
                    'SET title = ?, position = ? ' +
                    'WHERE id = ?';
                pool.query(sql, [page.title, page.position, page.id], function(err, result) {
                    if (err) {
                        throw err;
                    }else{
                        //todo
                    }
                });
            });
        }
        res.redirect('/user/id'+site.user_id+'/profile');
    });


});

router.post('/remove', function(req, res, next) {

    var site_id = req.body.site_id;
    var user_id = req.body.user_id;

    var sql = 'DELETE FROM sites ' +
        'WHERE id = ?';
    pool.query(sql, [site_id], function(err, result) {
        if (err) {
            throw err;
        }
        res.send("ok");
    });


});

router.post('/save_page', function(req, res, next) {
    var components = req.body.pageComponents;
    var page_id = req.body.page_id;

    var sql = "DELETE " +
            "FROM components " +
            "WHERE page_id = " + page_id;

    pool.query(sql, function(err, result){

        var sql = "UPDATE pages " +
            "SET update_date = CURRENT_TIMESTAMP " +
            "WHERE id= " + page_id;
        pool.query(sql, function(err, result){

            for(var j=0; j<components.length; j++){
                if(components[j]){
                    components[j].forEach(function(component, i){
                        component.position = 100*j+i;
                        component.page_id = page_id;
                        var images = [];
                        if(component.label == 'image'){
                            images = component.images;
                            delete component.images;
                        }
                        pool.query("INSERT INTO components SET ?", component, function(err, result) {
                            if(component.label == 'image'){
                                if(images) {
                                    for (var d = 0; d < images.length; d++) {
                                        if(!images[d].id) {
                                            var image = new Object();
                                            image.img_src = images[d].img_src;
                                            image.component_id = result.insertId;
                                            pool.query("INSERT INTO images SET ?", image, function (err, result) {

                                            });
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            }

        });

    });
});


module.exports = router;
