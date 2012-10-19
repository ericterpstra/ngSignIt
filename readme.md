# AngularJS SignIt!

This is a sample CRUD appliction created with the AngularJS framework. 
It is very simple - a user picks a 'petition' from a select box, 
and fills out the three form fields.  After drawing a signature on
the canvas, clicking Save will add the form data to the *Signatories* list.

## Parse.com and StackMob
There are two different back-end database providers used in this app.
By default, the app uses neither service, but rather a simple backbone.js
model to temporarily store data. Once the browser is refreshed, the data is gone.

By adding *parse* to the end of the URL, the application will then use
Parse.com to save and retrieve signatures.  My own API keys are hard coded
in the app, but you can get your own API keys for free at http://www.parse.com

In order to use StackMob as a back-end provider, the application must be hosted
on StackMob's servers.  A StackMob account is also free (www.stackmob.com).  You can try this version
by forking this project, changing the StackMob init values, and deploying in your
own StackMob account.
