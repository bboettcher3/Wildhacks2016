from twilio.rest import TwilioRestClient

# put your own credentials here
ACCOUNT_SID = "AC7d3a1f9c124dbc11105f054d1ac7750b"
AUTH_TOKEN = "8e728097cdc05edba05d9f65e7c08164"

client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN)

#Sends a text message to "_to", with the message "_body", and the optional
#image url "_image".
def sendMessage(_to, _body, _image=None):
    if(_image == None):
        client.messages.create(
            to=_to,
            from_="+19179245975",
            body=_body
        )
    else:
        client.messages.create(
            to=_to,
            from_="+19179245975",
            body=_body,
            media_url=_image
        )

if __name__ == "__main__":
    sendMessage("+18473373932", "Sup Nate")
    #sendMessage("+16467501926", "Hello world!")
