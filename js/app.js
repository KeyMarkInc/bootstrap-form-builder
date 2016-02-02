$(document).ready(function() {
    setup_draggable();

    $("#copy-to-clipboard").on("click", function() {
        var $header = 
            '<!DOCTYPE html>'
            +'<head>\n'
            +'<meta http-equiv="content-type" content="text/html; charset=utf-8">'
            +'<link rel="stylesheet" type="text/css" href="' + bootstrapcss + '">'
            +'<title>Forms InMotion</title>'
            +'<meta name="description" content="Forms InMotion">'
            +'</head>'
            +'<body>'
            +'<div class="container" id="form">';
        var $footer = '</div>'
            +'<script type="text/javascript" href="'+ jqueryjs + '"></script>'
            +'<script type="text/javascript" href="'+ jqueryuijs + '"></script>'
            +'<script type="text/javascript" href="'+ parsleyjs + '"></script>'
            +'<script type="text/javascript">'+ parsleyActivate + '</script>'
            +'</body>'
            +'</html>';
        var $copy = $(".form-body").parent().clone().appendTo(document.body);
        $copy.find(".tools").remove();
        $.each(["draggable", "droppable", "sortable", "dropped",
            "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function(i, c) {
            $copy.find("." + c).removeClass(c);
        });
        var html = html_beautify($header + $copy.html() + $footer);

        $modal = get_modal(html).modal("show");
        $modal.find(".btn").html("Download HTML");
        //$modal.find(".btn").remove();
        $modal.find(".modal-title").html("Copy HTML");
        $modal.find(":input:first").select().focus();
        $('#modalButton').click(function(){
            var a = window.document.createElement('a'); //create new anchor for download
            var ua = navigator.userAgent.toLowerCase(); //check browser UA to see if it's Safari or Chrome
            var isSafari = false;
            if (ua.indexOf('safari') != -1) {
                if (ua.indexOf('chrome') > -1) {
                    isSafari = false;
                } else {
                    isSafari = true;
                }
            }

            var data = new Blob([html], {type: 'text/html'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (data !== null) {
                window.URL.revokeObjectURL(data);
            }
            a.href = window.URL.createObjectURL(new Blob([data], {type: 'text/html'}));
            if (isSafari) {
                window.open(a.href, 'result.html', 'toolbars=0,width=400,height=320,left=200,top=200,scrollbars=1,resizable=1');
            }else{
                a.download = "result.html";
            }
            document.body.appendChild(a);
            try {
                if (isSafari) {
                    window.open(a.href,'result.html', 'toolbars=0,width=600,height=600,left=200,top=200,scrollbars=1,resizable=1');
                }else{
                    a.click();
                }
            }
            catch (e){
                console.log('There was an error generating the file.')
            }
            document.body.removeChild(a);
        });

        $copy.remove();
        return false;
    })
});

var setup_draggable = function() {
    $( ".draggable" ).draggable({
        appendTo: "body",
        helper: "clone"
    });
    $( ".droppable" ).droppable({
        accept: ".draggable",
        helper: "clone",
        hoverClass: "droppable-active",
        drop: function( event, ui ) {
            $(".empty-form").remove();
            var $orig = $(ui.draggable)
            if(!$(ui.draggable).hasClass("dropped")) {
                var $el = $orig
                    .clone()
                    .addClass("dropped")
                    .css({"position": "relative", "left": null, "right": null})
                    .appendTo(this);

                // update id
                var id = $orig.find(":input").attr("id");

                if(id) {
                    id = id.split("-").slice(0,-1).join("-") + "-"
                        + (parseInt(id.split("-").slice(-1)[0]) + 1)

                    $orig.find(":input").attr("id", id);
                    $orig.find("label").attr("for", id);
                }

                // tools
                var tools = '<ul class="tools">\
						<li><a class="edit-link">Edit HTML<a></li>\
						<li><a class="remove-link">Remove</a></li>\
						</ul>';
                    $(tools).appendTo($el);
            } else {
                if($(this)[0]!=$orig.parent()[0]) {
                    var $el = $orig
                        .clone()
                        .css({"position": "static", "left": null, "right": null})
                        .appendTo(this);
                    $orig.remove();
                }
            }
        }
    }).sortable();

};

var get_modal = function(content) {
    $('#myModal').remove();
    delete $('#myModal');
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1" id="myModal">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<a type="button" class="close"\
							data-dismiss="modal" aria-hidden="true">&times;</a>\
						<h4 class="modal-title">Edit HTML</h4>\
					</div>\
					<div class="modal-body ui-front">\
						<textarea class="form-control" id="codeTextArea"\
							style="min-height: 200px; margin-bottom: 10px;\
							font-family: Monaco, Fixed">'+content+'</textarea>\
						<a class="btn btn-success" type="button" id="modalButton">Update</a>\
					</div>\
				</div>\
			</div>\
			</div>').appendTo(document.body);
    return modal;
};

$(document).on("click", ".edit-link", function(ev) {
    var $el = $(this).parent().parent().parent();
    var $el_copy = $el.clone();

    var $edit_btn = $el_copy.find(".edit-link").parent().parent().remove();

    var $modal = get_modal(html_beautify($el_copy.html())).modal("show");
    var myCodeMirror = CodeMirror.fromTextArea(codeTextArea, {
        mode: "htmlmixed",
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: {"Ctrl-Space": "autocomplete"},
        foldGutter: {
            rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    $modal.find(":input:first").focus();
    $modal.find(".btn-success").click(function(ev2) {
        myCodeMirror.toTextArea();
        var html = $modal.find("textarea").val();
        if(!html) {
            $el.remove();
        } else {
            $el.html(html);
            $edit_btn.appendTo($el);
        }
        $modal.modal("hide");
        return false;
    })
});

$(document).on("click", ".remove-link", function(ev) {
    $(this).parent().parent().parent().remove();
});

$(document).on("click", ".make-required", function(ev) {
    console.log("Make Required")
});

var bootstrapcss = "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
var jqueryjs = '//code.jquery.com/jquery-2.2.0.min.js';
var jqueryuijs = '//code.jquery.com/ui/1.11.4/jquery-ui.min.js';
var parsleyjs = '//raw.githubusercontent.com/guillaumepotier/Parsley.js/master/dist/parsley.min.js';
var parsleyActivate = '$(document).ready(function() {$("#form").parsley().on("field:validated", function() {var ok = $(".parsley-error").length === 0;$(".bs-callout-info").toggleClass("hidden", !ok);$(".bs-callout-warning").toggleClass("hidden", ok);}).on("form:submit", function() {return false;});});';