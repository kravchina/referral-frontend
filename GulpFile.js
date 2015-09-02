
var gulp = require('gulp'),
    awspublish = require('gulp-awspublish'),
    argv = require('yargs').argv,
    parallelize = require("concurrent-transform"),
    config = require('read-config')(__dirname + '/GulpConfig.json'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-minify-css'),
    ngHtml2Js = require("gulp-ng-html2js"),
    webserver = require('gulp-webserver'),
    replace = require('gulp-replace');

var environmentName = argv.env ? argv.env : 'local',
    environment = config.environment[environmentName],
    buildPath = 'build/' + environmentName;


gulp.task('publish', ['build'], function() {
    var publisher = awspublish.create({
        params: {
            Bucket: environment.amazon_aws_bucket
        },
        accessKeyId: config.amazonAws.accessKeyId,
        secretAccessKey: config.amazonAws.secretAccessKey
    });

    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src(buildPath + '/**/*')
        .pipe(parallelize(publisher.publish(headers, {force: true}), 10))
        .pipe(awspublish.reporter());
});

gulp.task('run', ['build', 'watch', 'server']);

gulp.task('build', ['build-js','build-css', 'build-templates', 'copy-files']);

gulp.task('build-js', function() {
    var process = gulp.src([
            'src/js/lib/ui-router-tabs.js',
            'src/js/lib/localize.js',
            'src/js/lib/ng-infinite-scroll.min.js',
            'src/js/lib/angular-file-upload.js',
            'src/js/lib/jspdf.js',
            'src/js/lib/jspdf.plugin.addimage.js',
            'src/js/lib/jspdf.plugin.cell.js',
            'src/js/lib/jspdf.plugin.from_html.js',
            'src/js/lib/jspdf.plugin.split_text_to_size.js',
            'src/js/lib/jspdf.plugin.standard_fonts_metrics.js',
            'src/js/lib/FileSaver.min.js',
            'src/js/lib/mask.js',
            'src/js/lib/angular-payments.min.js',
            'src/js/lib/jquery.placeholder.js', 
            'src/js/lib/bootstrap.min.js', 
            'src/js/lib/bootstrap-tabcollapse.js', 
            'src/js/lib/moment.js', 
            'src/js/lib/daterangepicker.js',
            'src/js/lib/isteven-multi-select.js',
            'src/js/app.js',
            'src/js/controllers/**/*',
            'src/js/directives/**/*',
            'src/js/services/**/*']);

        for(variable in environment) {
            var key = variable.toUpperCase(),
                value = environment[variable];

            process = process.pipe(
                replace('{{' + key + '}}', value));
        }

    process = process
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'));

    if(environment.minify) {
        process = process
            .pipe(uglify());
    }
    
    process = process
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildPath));

    return process;
});

gulp.task('build-css', function() {
    return gulp.src([
            'src/css/custom.css',
            'src/css/daterangepicker-bs3.css',
            'src/css/isteven-multi-select.css'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildPath));
});

gulp.task('copy-files', function(){
    gulp.src('src/index.html')
        .pipe(gulp.dest(buildPath));

    gulp.src('src/img/**/*')
        .pipe(gulp.dest(buildPath + '/img'));

    gulp.src('src/i18n/**/*')
        .pipe(gulp.dest(buildPath + '/i18n'));

    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(buildPath + '/fonts'));
});

gulp.task('build-templates', function(){
    gulp.src('src/partials/**/*.html')
        .pipe(ngHtml2Js({
            moduleName: "dentalLinksPartials",
            prefix: "partials/"
        }))
    .pipe(concat('partials.js'))
    .pipe(gulp.dest(buildPath));
});

gulp.task('server', ['build'], function(){
    gulp.src(buildPath)
        .pipe(webserver({
            livereload: config.devServer.livereload,
            host: config.devServer.host,
            port: config.devServer.port,
            open: config.devServer.openInBrowser
        }));
});

gulp.task('watch', function(){
    gulp.watch('src/**/*.*', ['build']);
});
