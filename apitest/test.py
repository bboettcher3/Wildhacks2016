from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage
import json

app = ClarifaiApp()

model = app.models.get('general-v1.3')

image1 = ClImage(url='https://samples.clarifai.com/metro-north.jpg')

#dict
result = model.predict([image1])

print
results = result.get("outputs")[0].get("data").get("concepts")
print "Image contains:"
for r in results:
    print "\t", r.get("name"), "with p=", r.get("value")
