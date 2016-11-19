var client_id = "Kb1pJ001acqRnepht0tcVX-tS21TmBuenEmosual";
var client_secret = "ZI4mcw64qdj5lia9RHYeNWegaOX37kbphTrakwtl";

var app = new Clarifai.App(client_id, client_secret);

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
  )
}

/**
  * If our current token is expired, then renew it.
  */
function reauthorize() {
  if((new Date).getTime() >= expire_time) {
    authorize();
  }
}

function addConcept(name) {
  if(app.models.get("allowed") == null) {
    app.models.create(model="allowed", conceptsData=[name]);
  } else {
    app.models.get("allowed").mergeConcepts([name]);
  }
}

/**
  * Adds an array of images (in base64_bytes representation) to the model
  */
function addImages(imageArray, name) {
  reauthorize();

  for(var i = 0; i < imageArray.length; i++) {
    app.inputs.create_image_bytes(base64_bytes=imageArray[i]).then(
        function(result) {
            app.input.add_concepts(result, [name])
        }, function(error) {
            console.log("Failed to add concept " + i + "to image");
            console.log(error);
        }
    )
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

    mergeConcepts(name);
    app.models.get("allowed").train();
}

/**
  * Given a base64_bytes representation of an Image, returns the predictions
  * of what concepts the image contains.
  * @return: an array of results
  */
function predict(byteArray) {
  reauthorize();

  app.models.get("allowed").then(
    function(model) {
      //console.log(Object.getOwnPropertyNames(model));
      model.predict(byteArray).then(
        function(response) {
          //console.log(response);
          console.log(response.data.status);
          //var results = response.get("data");
          //console.log(results);
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