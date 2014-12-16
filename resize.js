#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    gm = require('gm')
    program = require('commander')
    _ = require('lodash'),
    exifGps = require('./exif-gps.js'),
    Promise = require('bluebird')

    imagemagick = gm.subClass({imageMagick: true})

program
    .option('-r, --ratio <n>', 'ratio', undefined, parseInt)
    .option('--resize', 'resize')
    .parse(process.argv);


var dir = program.args[program.args.length - 1],
    options = {
        ratio: program.ratio || 32
    }


function buildOutput(path, exif, data) {
    data = data || {};

    var output = {
        'src': path,
        'caption': data.caption || '',
        'credit': data.credit || '',
        'width': exif.ExifImageWidth,
        'height': exif.ExifImageLength
    };

    if (data.marker) {
        output.marker = {
            'coordinates': data.marker.coordinates,
            'title': data.marker.title || '',
            'size': data.marker.size || 'small',
            'symbol': data.marker.symbol || ''
        }
    }

    return output;
}

imagemagick.prototype.exif = function (cb) {
    this.identify(function (err, value) {
        var exif = _.omit(value.Properties, function (v, key) {
            return key.indexOf('exif:') !== 0
        });

        _.forIn(exif, function (value, key) {
            exif[key.replace('exif:', '')] = value;
        });
        cb && cb(exif);
    })
    return this;
}

function resize (filepath, options) {
    var deferred = Promise.pending();

    var ratio = options.ratio + '%',
        dirname = path.dirname(filepath);
    /*
        resizedName = path.basename(filepath).toLowerCase()
        extName = path.extname(resizedName)

    resizedName = path.basename(resizedName, extName) + extName
    var resizedPath = path.join(dirname, resizedName);
   */

    var resizedPath = filepath;

    imagemagick(filepath)
        .options({imageMagick: true})
        .resize(ratio)
        //.autoOrient()
        .write(resizedPath, function (err) {
            if (!err) {
                deferred.fulfill(resizedPath);
            } else {
                deferred.reject()
            }
        })

    return deferred.promise
}

function extractOutput (path) {
    var deferred = Promise.pending();

    imagemagick(path).exif(function (exif) {
        var gps = exifGps(exif),
            data = {};

        if (gps.latitude && gps.longitude) {
            data.marker = {
                coordinates: [gps.longitude, gps.latitude]
            }
        }

        deferred.fulfill(buildOutput(path, exif, data));
    });

    return deferred.promise;
}

function main (directory) {
    var images = [],
        output = [];

    fs.readdir(directory, function (err, files) {
        files.forEach(function (file) {
            filepath = path.join(directory, file);
            images.push(resize(filepath, options))
        });

        Promise.settle(images).then(function (results) {
            var resized = [];
            results.forEach(function (result) {
                if (result.isFulfilled()) {
                    resized.push(extractOutput(result.value()));
                }
            });

            Promise.settle(resized).then(function (results) {
                var output = results.map(function (result) {
                    return result.value();
                });

                console.log(JSON.stringify(output));
            });
        });
    });

}

main(dir)
