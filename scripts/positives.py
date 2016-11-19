"""
Simple example showing Clarifai Custom Model training and prediction

This file contains the positives for each person
"""

#Provided code
#from clarifai_basic import ClarifaiCustomModel
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

# instantiate clarifai client
clarifai = ClarifaiCustomModel()

concept_name = 'nate'

# find some positive and negative examples
NATE_POSITIVES = [
  '../photos/Nate/nate.jpg',
  '../photos/Nate/nate01.jpg',
  '../photos/Nate/nate02.jpg',
  '../photos/Nate/nate03.jpg',
  '../photos/Nate/nate04.jpg',
]

# add the positive example images to the model
for positive_example in NATE_POSITIVES:
  clarifai.positive(positive_example, concept_name)


# negatives are not required but will help if you want to discriminate between similar concepts
#add negatives here if wanted

# add the negative example images to the model
#for negative_example in PHISH_NEGATIVES:
#  clarifai.negative(negative_example, concept_name)

# train the model
clarifai.train(concept_name)


NATE_EXAMPLES = [
  '../photos/Nate/nate05.jpg'
]

NOT_NATE = [
  'https://clarifai-test.s3.amazonaws.com/2141620332_2b741028b3.jpg'
]

# If everything works correctly, the confidence that true positive images are of Phish should be
# significantly greater than 0.5, which is the same as choosing at random. The confidence that true
# negative images are Phish should be significantly less than 0.5.

# use the model to predict whether the test images are Phish or not
for test in NATE_EXAMPLES + NOT_NATE:
  result = clarifai.predict(test, concept_name)
  print result['status']['message'], "%0.3f" % result['urls'][0]['score'], result['urls'][0]['url']

# Our output is the following. Your results will vary as there are some non-deterministic elements
# of the algorithms used.

# Success 0.797 http://phishthoughts.com/wp-content/uploads/2012/07/photo-1-11-e1342391144673.jpg
# Success 0.706 http://bobmarley.cdn.junip.com/wp-content/uploads/2014/10/DSC01226-e1311293061704.jpg
# Success 0.356 http://farm3.static.flickr.com/2161/2141620332_2b741028b3.jpg
# Success 0.273 http://www.mediaspin.com/joel/grateful_dead230582_15-52.jpg
