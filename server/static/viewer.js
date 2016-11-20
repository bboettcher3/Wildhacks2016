"use strict";

var shouldSkip = false;
var recording = false;
var positive = true;

var interval = 750;

/**
  * Called to initialize the viewer and screenshotter loop.
  */
function initViewer() {
  // Grab elements, create settings, etc.
  var video = document.getElementById("cameraVideoInput");

  //sendText("+16467501926", "Picture test", "http://25.media.tumblr.com/tumblr_m2x49zIpu11qze0hyo1_1280.jpg");
  //sendText("+13129526796", "Picture test", "http://i.imgur.com/GK5HtG9.jpg");

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("Camera is supported!");

    //Enumerate all devices - for debugging info
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
        });
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
    });

    //What are we requesting from the user? Typically HD video, if possible.
    var constraints = {
        video: {
            width: 1280,
            height: 720
        }
    };

    //Actually request the camera and display it (if permitted)
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
      video.focus(); //force focus so blur works

      //Take a screenshot every time interval - only do this when permitted
      console.log("Setting an interval!");
      setInterval(snapshot1, interval);
    });
  }
}

/**
  * Called to initialize the viewer and screenshotter loop.
  */
function initViewer2() {
    onBlur();

    // Grab elements, create settings, etc.
    var video2 = document.getElementById("cameraVideoInput2");

    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Camera is supported!");

        //Enumerate all devices - for debugging info
        navigator.mediaDevices.enumerateDevices()
        .then(function(devices) {
            devices.forEach(function(device) {
                console.log(device.kind + ": " + device.label +
                            " id = " + device.deviceId);
            });
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });

        var constraints = {
            video: {
                width: 320,
                height: 180
            }
        };

        //Actually request the camera and display it (if permitted)
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            video2.src = window.URL.createObjectURL(stream);
            video2.play();

            //Take a screenshot every time interval - only do this when permitted
            console.log("Setting an interval!");
            setInterval(snapshot2, interval);
        });
    }
}

function onBlur() {
  var video = document.getElementById("cameraVideoInput");
  $("#cameraVideoInput").css('-webkit-filter', "blur(15px)");
  video.pause();
  shouldSkip = true;
}

function onFocus() {
  var video = document.getElementById("cameraVideoInput");
  $("#cameraVideoInput").css('-webkit-filter', "blur(0px)");
  video.play();
  shouldSkip = false;
}

function startRecording(bool) {
  console.log("Starting recording!");
  recording = true;
  positive = bool;
}

function stopRecording() {
  console.log("Stopping recording!");
  recording = false;
}

function snapshot1() { snapshot("cameraVideoInput"); }

function snapshot2() { snapshot("cameraVideoInput2"); }

/**
  * This function takes a frame from the video stream and saves it as a
  * collection of bytes. This can then be sent to the Clarifai API.
  */
function snapshot(id) {
    if(shouldSkip) return;
    //console.log("Taking a snapshot!");

    //Actual video recording element
    var video = document.getElementById(id);

    //A canvas upon which we'll draw
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = video.videoWidth / 2;      //This needs to be the actual
    canvas.height = video.videoHeight / 2;    //video dimensions..

    //Draw the image - no need for error checking since this method is only
    //called when the stream is open & valid
    //context.drawImage(video, 0, 0);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
                             0, 0, canvas.width, canvas.height);

    //Get the bytes of the image
    var bytes = canvas.toDataURL("image/png").split(",")[1];
    //console.log("Image data: " + bytes);

    var bytesArr = [bytes];

    if(recording) {
      addImages(bytesArr, "George", positive);
      console.log("Uploaded a new image!");
    } else {
      //Do an actual API call - need to pass to something that has API
      var results = predict(bytes);
      //console.log("Got prediction");
    }

    bytes = null;
    bytesArr = null;
    canvas = null;
    context = null;
    //console.log("Did an API call!");
    //console.log(results);
}
