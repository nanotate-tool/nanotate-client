/* eslint-env node */

'use strict';

const gulp = require('gulp');
const bro = require('gulp-bro');
const rename = require('gulp-rename');
const cliColor = require('cli-color');
const scriptBundle = require('./scripts/gulp/script-bundle');

gulp.task('scripts', () => {
    var bundler = async () => {
        scriptBundle.forEach((script, index) => {
            //concat files
            gulp.src(script.files)
                .on('end', () => {
                    console.log('==> Compiling script', cliColor.yellow(script.name), 'with source files', script.files)
                })
                .pipe(
                    bro({
                        transform: [
                            ['babelify',{ presets: ["@babel/preset-env"] }],
                            ['uglifyify', { global: true }]
                        ]
                    })
                )
                .pipe(rename(script.name))
                .pipe(gulp.dest(script.output)
                    .on('end', (args) => console.log('\t=> push in folder', script.output))
                );
        })
    };
    return Promise.all([bundler()]);
})