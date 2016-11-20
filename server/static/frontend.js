var _URL = window.URL || window.webkitURL;
console.clear();
var byteArray;

$(function() {
    byteArray = [];
    $("input[type=file]").on("change", function(e) {
        /*var p = $("p.byteArray").empty();*/
        var file = this.files;
        $.when.apply($, $.map(file, function(img, i) {
            return new $.Deferred(function(dfd) {
                var image = new Image();
                $(image).on("load", i, function(e) {
                    var canvas = document.createElement("canvas"),
                        context = canvas.getContext("2d");
                    canvas.height = this.height;
                    canvas.width = this.width;

                    context.drawImage(this, 0, 0);

                    /*p.append("<a href=\"" + canvas.toDataURL() + "\" target=\"_blank\"></a>");*/
                    dataURL = canvas.toDataURL();
                    byteArray.push(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
                    dfd.resolve();
                    URL.revokeObjectURL(this.src);
                });
                image.src = URL.createObjectURL(img);
                return dfd.promise();
            }).promise()
        }))/*.then(function() {
            p.find("a").each(function() {
                console.log(this.href + "\n");
                p.append(this.href + "<br>")
            })
        })*/
    });
})/*
$("#images").change(function (e) {
    var inp = document.getElementById("images");
    byteArray = [];
    var i = 0;
    for (; i < inp.files.length; i++) {
        var file = inp.files.item(i);
        var img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function () {
            var canvas = document.getElementById("canvas2");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL("image/png");
            byteArray.push(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        }
    }
});*/
function check() {
    if (typeof byteArray === "undefined" || byteArray.length == 0) alert("Please select at least one image.");
    else if (document.getElementById("concept").value == "") alert("Please enter your first name.");
    else if (document.getElementById("pos").checked == false && document.getElementById("neg").checked == false) alert("Please select positive or negative classification.");
    else {
      addImages(byteArray, document.getElementById("concept").value, document.getElementById("pos").checked == true);
      byteArray = [];
      $("#images").val("");
    }
}
