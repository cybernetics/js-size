var Lab = require('lab');
var exec = require('child_process').exec;
var lab = exports.lab = Lab.script();
var jssize = require('../index');
var browserify = require('browserify');

var lastChar = {
    original: 'B',
    minified: 'B',
    difference: 'B',
    percent: '%'
};

lab.experiment('As module', function () {
    lab.test('Browserify', function (done) {
        var b = browserify();
        b.add('./lib/js-size.js');

        console.log('Starting browserify....');

        b.bundle(function (err, js) {
            console.log('Getting size...');
            var data = jssize(js);

            console.log('Getting table size...');
            var tableData = jssize.table(js);

            Object.keys(data).forEach(function (key) {
                var value = data[key];
                var floatValue = parseFloat(value);
                Lab.expect(typeof floatValue).to.equal('number');
                Lab.expect(isNaN(floatValue)).to.equal(false);
                Lab.expect(value.slice(-1)).to.equal(lastChar[key]);
                Lab.expect(tableData.indexOf(value)).to.not.equal(-1);
            });

            console.log('Getting cli size...');
            exec('./node_modules/.bin/browserify lib/js-size.js | ./index.js', {cwd: process.cwd()}, function (error, stdout, stderr) {
                Lab.expect(stderr, 'stderr').to.equal('');
                Lab.expect(error, 'error').to.equal(null);
                Object.keys(data).forEach(function (key) {
                    var value = data[key];
                    var displayKey = key.slice(0, 1).toUpperCase() + key.slice(1);
                    Lab.expect(stdout.indexOf(displayKey), 'stdout: ' + displayKey).to.not.equal(-1);
                    Lab.expect(stdout.indexOf(value), 'stdout: ' + value).to.not.equal(-1);
                });
                done();
            });
        });
    });
});
