$(document).ready(function() {
    setup_draggable();

    $("#copy-to-clipboard").on("click", function() {
        var $copy = $(".form-body").parent().clone().appendTo(document.body);
        $copy.find(".tools, :hidden").remove();
        $.each(["draggable", "droppable", "sortable", "dropped",
            "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function(i, c) {
            $copy.find("." + c).removeClass(c);
        });
        var html = html_beautify($copy.html());

        $modal = get_modal(html).modal("show");
        //$modal.find(".btn").html("Download HTML"); todo: implement file download
        $modal.find(".btn").remove();
        $modal.find(".modal-title").html("Copy HTML");
        $modal.find(":input:first").select().focus();
        $('#modalButton').click(function(){
            var textFile = null;
            var data = new Blob([html], {type: 'text/plain'});

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
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
                    .css({"position": "static", "left": null, "right": null})
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
                $('<p class="tools">\
						<a class="edit-link">Edit HTML<a> | \
						<a class="remove-link">Remove</a></p>').appendTo($el);
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

}

var get_modal = function(content) {
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1" id="">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<a type="button" class="close"\
							data-dismiss="modal" aria-hidden="true">&times;</a>\
						<h4 class="modal-title">Edit HTML</h4>\
					</div>\
					<div class="modal-body ui-front">\
						<textarea class="form-control" \
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
    var $el = $(this).parent().parent();
    var $el_copy = $el.clone();

    var $edit_btn = $el_copy.find(".edit-link").parent().remove();

    var $modal = get_modal(html_beautify($el_copy.html())).modal("show");
    $modal.find(":input:first").focus();
    $modal.find(".btn-success").click(function(ev2) {
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
    $(this).parent().parent().remove();
});