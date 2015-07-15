
var gulp = require('gulp'),
    awspublish = require('gulp-awspublish'),
    argv = require('yargs').argv,
    parallelize = require("concurrent-transform"),
    config = require('read-config')(__dirname + '/GulpConfig.json');

gulp.task('publish', function() {
    var publisher = awspublish.create({
        params: {
            Bucket: argv.bucket ? argv.bucket : 'dev1.dentallinks.org'
        },
        accessKeyId: config.amazonAws.accessKeyId,
        secretAccessKey: config.amazonAws.secretAccessKey
    });

    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src(['**', '!node_modules/**', '!GulpFile.js', '!GulpConfig.json', '!GulpConfig.json.sample',
        '!test/**', '!README.md', '!ProtractorConf.js', '!ProtractorConf.js.sample', ])
        .pipe(parallelize(publisher.publish(headers), 10))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());
});