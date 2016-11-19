from clarifai.rest import ClarifaiApp

appInfo = {"client_id": "Kb1pJ001acqRnepht0tcVX-tS21TmBuenEmosual", "client_secret": "ZI4mcw64qdj5lia9RHYeNWegaOX37kbphTrakwtl"}

# create model id "model_name" and assign concepts to name
def create_model(name):
	if ((model = app.models.get("allowed")) is None):
		model = app.models.create(model_id="allowed", concepts=[name])
	else:
		model.add_concepts([name])
	return model

# byteArray is an array of image bytes, name is the name of the user who uploaded the images
def addImages(byteArray, name):
	app = ClarifaiApp(appInfo["client_id"], appInfo["client_secret"])

	# import images for the user
	for byte in byteArray:
		app.inputs.create_image_from_base64(byte, concepts=[name])

	# get/create model, add name as concept
	model = create_model(name)
	model = model.train
    
def filterPerson(byteArray):
    # import images for the user
		result = app.models.get("allowed").predict_by_base64(byteArray)
