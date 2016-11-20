//var angApp = angular.module('angApp', []);
//
//angApp.controller('controller', function($scope, $http, $rootScope, $location, USER) {
//    $scope.scopedApp = new Clarifai.App(client_id, client_secret);
//    console.log(client_id);
//    
//    $scope.model = $scope.app.get(modelID);
//    
//    $scope.test = function() {
//        console.log("test Passed!");
//    } 
//}); 

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

/**
    * Adds an array of images (in base64_bytes representation) to the model
    */
function addImages(imageArray, name, bool) {
    reauthorize();

    var images = [];

    for(var i = 0; i < imageArray.length; i++) {
        images.push({base64: imageArray[i], concepts: [{id: name, value: bool}]});
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
}

/**
  * Given a base64_bytes representation of an Image, returns the predictions
  * of what concepts the image contains.
  * @return: an array of results
  */
function predict(byteArray) {
  reauthorize();

    app.models.get(modelID).then(
      function(model) {
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

