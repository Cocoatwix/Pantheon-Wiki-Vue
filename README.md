# Pantheon-Wiki-Vue
A simple Vue wiki app created for my COMP 2513 (Web-Centric Programming) final project.

# Prerequisites
This app uses Node v16.14.0 (with npm) and vue/cli 5.0.4. Other dependencies can be installed by running "npm install" within the "api" and "app" folders.

# How to Use
Specify a database in the api's .env file that matches the "pantheon.json" MongoDB schema found in the databases folder (the comments.json schema is currently unused). This database holds the wiki's pages and images (the pantheon.json provided is public domain; use it how you see fit!). This app was tested using a MongoDB database hosted on Clever Cloud. There are no guarantees it'll work with other providers (though I don't see why it wouldn't).
The repo also contains a Postman collection which you can use to test the api's functionality.

Once a database has been specified, navigate to the api folder and start up the webservice ("node pantheon_server.js").
Then, navigate to the app folder and start up the app ("npm run serve").

The Node webservice runs on port 5000 by default, while the Vue app runs on port 8080 by default.

Check out the GitHub wiki to see more details about the database schema and how to use it. The app itself also contains usage into on the "About" page.
