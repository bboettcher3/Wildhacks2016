#Wildhacks 2016

##Master plan
We want to try to create a home security web app with three main components:
1. We want to be able to register a new user, which involves registering a username, password, and creating a model of the user in question. This consists of taking a 360 degree video, sliced into various images of the user, which are then uploaded as training data.
2. We want to be able to display the live output of a webcam (could be local, could be some other device), with realtime feedback of: if a person is in the frame, and if the person is a registered user. If there is a person in the frame that is not a registered user, within a margin of error, then we will send a text message via the Twilio API. 
3. We want to show some sort of backend representing the logs of who was detected over time (to add a very visual way of seeing who was "in the house" and when). This will be a representation of the data we have gathered over time.
