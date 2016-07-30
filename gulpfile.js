var gulp = require('gulp');
var browser = require('browser-sync');
var browserSync = browser.create();

gulp.task('server', ['build'], function() {
    browserSync.init({
        server: './app/www/',
        port: 3000
    });
    gulp.watch('./app/**/*.*', function(file) {
        console.log(file.path);
        browserSync.reload();
    })
});

gulp.task('build', function() {
    return gulp.src([

        ], {
            base: 'app/'
        })
        .pipe(gulp.dest('app/www/'))
});


gulp.task('clean', function() {
	const clean = require('gulp-clean');
	return gulp.src('./app/www/')
		.pipe(clean());
});
