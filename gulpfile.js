var gulp = require('gulp');
var babel = require('gulp-babel');

var clean = require('gulp-clean');
var zip = require('gulp-zip');
var merge = require('merge-stream');


gulp.task('clean', function () {
    console.log('cleaning');
    var build = gulp.src('build', {read: false})
        .pipe(clean());
    var dist = gulp.src('dist', {read: false})
        .pipe(clean());

    return merge(build, dist);
});

gulp.task('build', ['clean'], function() {
    console.log('building');
    var index = gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0'],
        }))
        .pipe(gulp.dest('build'));
    var package = gulp.src('package.json')
        .pipe(gulp.dest('build'))

    var app = gulp.src('app/**')
        .pipe(babel({
            presets: ['es2015', 'stage-0'],
            ignore: "*.json"
        }))
        .pipe(gulp.dest('build/app'));
    var ebextensions = gulp.src('.ebextensions/**', {dot:true})
                        .pipe(gulp.dest('build/.ebextensions'));
    return merge(index,package,app, ebextensions);
});

gulp.task('zip', ['build'], function() {
    return gulp.src('build/**', {dot:true})
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});
