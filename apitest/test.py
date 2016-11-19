from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

app = ClarifaiApp()

model = app.models.get('general-v1.3')

image1 = ClImage(url='https://samples.clarifai.com/metro-north.jpg')

model.predict([image1])
