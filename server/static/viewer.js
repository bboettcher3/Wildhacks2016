/**
  * Called to initialize the viewer and screenshotter loop.
  */
function initViewer() {
  // Grab elements, create settings, etc.
  var video = document.getElementById('cameraVideoInput');

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
          setInterval(snapshot, 1000);
      });

  }
}

/**
  * This function takes a frame from the video stream and saves it as a
  * collection of bytes. This can then be sent to the Clarifai API.
  */
function snapshot() {
  console.log("Taking a snapshot!");

  //Actual video recording element
  var video = document.getElementById('cameraVideoInput');

  //A canvas upon which we'll draw
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  //Draw the image - no need for error checking since this method is only
  //called when the stream is open & valid
  context.drawImage(video, 0, 0);

  //Get the bytes of the image
  var bytes = canvas.toDataURL('image/png');
  //console.log("Image data: " + bytes);

  //Do an actual API call - need to pass to something that has API
  //app.inputs.create_image_from_base64(base64_bytes=bytes);
  var results = predict(bytes);
  console.log("Did an API call!");
  console.log(results);
}
