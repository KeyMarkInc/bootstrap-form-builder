module.exports = function(grunt){
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {expand: true, flatten:true, src: ['node_modules/codemirror/lib/codemirror.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/lib/codemirror.css'], dest: 'css/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/theme/3024-day.css'], dest: 'css/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/hint/show-hint.css'], dest: 'css/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/foldgutter.css'], dest: 'css/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/lib/codemirror.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/mode/css/css.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/mode/javascript/javascript.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/mode/xml/xml.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/mode/htmlmixed/htmlmixed.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/hint/show-hint.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/hint/javascript-hint.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/foldcode.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/foldgutter.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/brace-fold.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/xml-fold.js'], dest: 'js/codemirror/', filter:'isFile'},
                    {expand: true, flatten:true, src: ['node_modules/codemirror/addon/fold/comment-fold.js'], dest: 'js/codemirror/', filter:'isFile'}
                ]
            }
        }
    })
};