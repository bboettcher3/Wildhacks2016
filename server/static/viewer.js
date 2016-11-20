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

      //Take a screenshot every time interval - only do this when permitted
      console.log("Setting an interval!");
      setInterval(snapshot1, 5000);
    });
  }
}

/**
  * Called to initialize the viewer and screenshotter loop.
  */
function initViewer2() {
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
            setInterval(snapshot2, 5000);
        });
    }
}

function sendText(to, body, image=null) {
  var endpoint =
    "/text?to=" + to +
    "&body=" + escape(body) +
    "&image=" + (image == null ? "None" : escape(image));

  console.log(endpoint);

  var xml = new XMLHttpRequest();
  xml.open("GET", endpoint);
  xml.send();
}

function snapshot1() { snapshot("cameraVideoInput"); }

function snapshot2() { snapshot("cameraVideoInput2"); }

/**
  * This function takes a frame from the video stream and saves it as a
  * collection of bytes. This can then be sent to the Clarifai API.
  */
function snapshot(id) {
    //console.log("Taking a snapshot!");

    //Actual video recording element
    var video = document.getElementById(id);

    //A canvas upon which we'll draw
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    //Draw the image - no need for error checking since this method is only
    //called when the stream is open & valid
    context.drawImage(video, 0, 0);

    //Get the bytes of the image
    var bytes = canvas.toDataURL("image/png").split(",")[1];
    //console.log("Image data: " + bytes);

    //Do an actual API call - need to pass to something that has API
    //app.inputs.create_image_from_base64(base64_bytes=bytes);
    var results = predict(bytes);
    //console.log("Did an API call!");
    //console.log(results);
}
