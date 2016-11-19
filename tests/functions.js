var app = new Clarifai.App(
  '{Kb1pJ001acqRnepht0tcVX-tS21TmBuenEmosual}',
  '{ZI4mcw64qdj5lia9RHYeNWegaOX37kbphTrakwtl}'
);

var video = document.getElementById("cameraVideoInput");

function addConcept(name) {
    if (model = app.models.get("allowed") == null) {
        model = app.models.create(model_id="allowed", concepts=[name]);    
    } else {
        model.add_concepts([name]);
    }
}

function addImages(byteArray, name) {
    //app = ClarifaiApp(appInfo["client_id"], appInfo["client_secret"]);
    
    //import images for the user
    for (var i = 0; i < byteArray.length; i++) {
        app.inputs.create_image_from_base64(byteArray[i], concepts=[name]);
    }
    
    addConcept(name);
    model = model.train();
}

function predict(byteArray) {
    var result = app.models.get("allowed").predict_by_base64(byteArray);
    var results = result.get("outputs")[0].get("data").get("concepts");
    for (var i = 0; i < results.length; i++) {
        console.log( results[i].get("name") );
    }
}
/*            
var captureImage = function() {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = document.createElement("img");
        img.src = canvas.toDataURL();
        predict(img.src);
        console.log("got here");
        setTimeout("captureImage()",1000);
}; */