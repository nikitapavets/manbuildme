var gulp			= require('gulp'),
	gutil			= require('gulp-util' ),
	connect			= require('gulp-connect-php'),
	sass			= require('gulp-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	cleanCSS		= require('gulp-clean-css'),
	rename			= require('gulp-rename'),
	browserSync		= require('browser-sync'),
	concat			= require('gulp-concat'),
	uglify			= require('gulp-uglify'),
	del				= require('del'),
	imagemin		= require('gulp-imagemin'),
	pngquant		= require('imagemin-pngquant'),
	cache			= require('gulp-cache'),
	fileinclude		= require('gulp-file-include'),
	gulpRemoveHtml	= require('gulp-remove-html'),
	bourbon			= require('node-bourbon'),
	ftp				= require('vinyl-ftp'),
	server			= require('gulp-develop-server');

var options = {
	server: {
		path: 'bin/www',
		execArgv: [ '--harmony' ]
	},
	browserSync: {
		proxy: 'http://localhost:3000',
		notify: false
	}
};

gulp.task( 'server:start', function() {
	server.listen( options.server, function( error ) {
		if( ! error ) browserSync( options.browserSync );
	});
});

gulp.task( 'server:restart', function() {
	server.restart( function( error ) {
		if( ! error ) browserSync.reload();
	});
});

gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/js/libs.min.js',
		'app/js/controllers/*.js',
		'app/js/derectives/*.js',
		'app/js/main.js'
	])
	//.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(gulp.dest('public/js/'));
});

gulp.task('scriptlibs', function() {
	return gulp.src([
		'app/lib/jquery/jquery-1.11.2.min.js',
		'app/lib/materialize/js/materialize.min.js',
		'app/lib/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
		'app/lib/angular-sanitize/angular-sanitize.min.js',
		'app/lib/showdown/src/showdown.js',
		'app/lib/oauth-js/dist/oauth.js',
		'app/lib/angular-route/angular-route.js',
		'app/lib/ngstorage/ngStorage.js'
	])
	.pipe(uglify())
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['sass', 'scriptlibs', 'scripts', 'server:start'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/js/**/*.js', ['scripts'], browserSync.reload);
	gulp.watch('views/**/*.jade', browserSync.reload);
	gulp.watch('routes/**/*.js', ['server:restart']);
});

gulp.task('imagemin', function() {
	return gulp.src('public/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('public/img/'));
});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
