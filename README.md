# sample-yelp-ext
Sample yelp extension for mailchimp email platform in nodeJS

To start:
`npm install`
`npm start`

Tunnel your local host using ngrok or host your app on any external server, use it as your extension endpoint when registering your extension.

This extension sample service is deployed here: https://extensionexample.herokuapp.com/

It is testable using 2 methods:
1. send a POST request to the service using your method of choice, either curl, or using postman
2. Go through the installation flow of an extension inside the extension zone, then open the email editor and try to add it to the draft email campaign that you created.
