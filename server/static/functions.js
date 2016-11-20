var client_id = "Kb1pJ001acqRnepht0tcVX-tS21TmBuenEmosual";
var client_secret = "ZI4mcw64qdj5lia9RHYeNWegaOX37kbphTrakwtl";

var app = new Clarifai.App(client_id, client_secret);
var modelID = "f45a71fde569475084d4eecdcad177e0";
model = app.models.get(modelID);

var video = document.getElementById("cameraVideoInput");

var access_token = "";
var expire_time = 0;

/**
    * Authorizes a user with our given client ID and secret.
    * Call this before doing any API calls- and call reauthorize() for any API
    * call thereafter.
    */
function authorize() {
    console.log("[Re]authorizing user.");
    app.getToken().then(
        function(token) {
            //Our new access token for API calls
            access_token = token.access_token;

            //Check against this- if time > expire_time, renew before calling.
            expire_time = (new Date).getTime() + token.expires_in;

            //Refresh our access token.
            app.setToken(access_token);
        }, function(error) {
            console.log("Failed to authenticate.");
            console.log(error);
        }
    );
}

/**
    * If our current token is expired, then renew it.
    */
function reauthorize() {
    if((new Date).getTime() >= expire_time) {
        authorize();
    }
}
/*
function addConcept(name) {
    if(app.models.get("allowed") == null) {
        app.models.create(model="allowed", conceptsData=[name]);
    } else {
        app.models.get("allowed").mergeConcepts([name]);
    }
}*/

/**
    * Adds an array of images (in base64_bytes representation) to the model
    */
function addImages(imageArray, name) {
    reauthorize();

    var images = [];

    for(var i = 0; i < imageArray.length; i++) {
        images.push({base64: imageArray[i], concepts: [{id: name, value: true}]});
    }
    // Create images in app, for model to use
    app.inputs.create(images).then(createModel);

    // Create or retrieve model "allowed", add concept if needed
    function createModel(inputs) {
        app.models.get(modelID).then(
            app.models.initModel(modelID).then(model.addConcepts({name})),
            app.models.create(modelID, [name]).then(trainModel)
        );
    }

    // Train model
    function trainModel(model) {
        model.train().then(predict(imageArray));
    }
        /*app.inputs.create({
            base64: imageArray[i],
            concepts: [name]
        }).then(
            function(inputs) {
                //Add it to the model
            }, function(error) {
                console.log("Failed to add image " + i + " to model.");
                console.log(error);
            }
        )
    }

        //import images for the user
        for (var i = 0; i < byteArray.length; i++) {
            app.inputs.create({
                base64: byteArray,
                concepts: [name]
            });
        } */

        //mergeConcepts(name);
        /*app.inputs.mergeConcepts([
            {
                id: client_id,
                concepts: [
                    {
                        id: name
                    }
                ]
            },
        ]);
        app.models.get(modelID).train();*/
}

/**
  * Given a base64_bytes representation of an Image, returns the predictions
  * of what concepts the image contains.
  * @return: an array of results
  */
function predict(byteArray, datasetName=null) {
  reauthorize();

  var dataset = null;
  switch(datasetName) {
    case "general":
      dataset = Clarifai.GENERAL_MODEL; break;
    default:
      dataset = null;
  }

  //If we have that dataset, use it.
  if(dataset != null) {
    console.log("Using dataset " + dataset);
    app.models.predict(dataset, {base64: byteArray}).then(
      function(response) {
        //console.log("Got " + datasetName + " model data!");
        //console.log("Image contains:");
        var concepts = response.data.outputs[0].data.concepts;
        var hasPerson = false;

        var output = "";
        for(var i = 0; i < concepts.length; i++) {
          if(concepts[i].name == "person" || concepts[i].name == "people") {
            //console.log("person");
            hasPerson = true;
            break;
          }
          //console.log(concepts[i].name + " ");
          output += " " + concepts[i].name;
        }

        //console.log("Image contains: " + output);

        if(hasPerson)
          console.log("Image most likely contains a person!");
        else
          console.log("Image likely doesn't have a person.");
      }, function(error) {
        console.log("Failed to get " + datasetName + " model!");
        console.log(error);
      }
    );
  } else { //If not, then go with our custom one.
    app.models.get(modelID).then(
      function(model) {
        //console.log(Object.getOwnPropertyNames(model));
        model.predict({base64: byteArray}).then(
          function(response) {
            var concepts = response.data.outputs[0].data.concepts;

            var output = "";
            for(var i = 0; i < concepts.length; i++) {
              output += " " + concepts[i].name + " (p= " + concepts[i].value + ")";
            }
            console.log(output);
          }, function(error) {
            console.log("Failed getting prediction!");
            console.log(error);
          }
        );
      }, function(error) {
        console.log("Failed getting model!");
        console.log(error);
      }
    );
  }
}
