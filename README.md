# YelpCamp App
This is an application to share places known as campgrounds, each campground show title, description, price, location and author. All users have access to the campgrounds index page where they can 
type for a specific campground title, they can see all campgrounds datails information and reviews left by other users.

This application was used with javascript for the front-end as well as the back-end. The application comes with authentication, authorization, user with role publisher can create campgrounds and 
upload multiple images, all user have a simple profile page where they can change the profile photo, users can leave review to the campgroudns and save them in their favorite sections.

![Yelpcamp Homepage image](https://res.cloudinary.com/emanueltejada/image/upload/v1618423385/Test/Home_tir3yy.png)

![Yelpcamp Homepage image](https://res.cloudinary.com/emanueltejada/image/upload/v1621995693/Test/Yelpcamp_Index_page_lasaq2.png)

## Technology used
  
  * HTML, CSS, JS
  * Bootstrap
  * Node.js
  * Express
  * MongoDB
  * Mapbox API
  
## Install Guide

 You can see the app live project here [YelpCamp](https://protected-badlands-88004.herokuapp.com/) or folow the steps below to install locally.
  
  There are several things needed in order to run the app locally. 
  You can start by downloading the code or clone the repository.
  
  Once you've downloaded the repository you can run the command below on your terminal inside the project directory.
  
  ```javascript
    npm install
  ```
  
  ## Installations and API needed
  Create first the .env file in the root directory to save all your enviroment variables.
  
  You will need to install and create different accounts to get the api credentials needed to have access to differents features of the application.
  
  First you need node js installed on your machine, Node.js is the JavaScript engine that we use to run the applications backend.
  Go to the Node.js official website to download the LTS version for Windows: [https://nodejs.org/en/download/](https://nodejs.org/en/download/). 
  You can follow the step by step tutorial at this link [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
   
   The application use mongoDB as database, You can use mongodb compass and connect it to the mongodb atlas with your atlas url or use mongo db locally.
  You can follow the step by step tutorial at this link [https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328](https://nodejs.org/en/download/) to use mongo db locally or use this
  youtube link to set mongo db atlas [https://zarkom.net/blogs/how-to-use-a-mongodb-atlas-database-in-your-nodejs-app-1051](mongoDB Atlas). 
  
  Once you set up your MongoDB, use the url in the app in the .env file.
  * DB_URL=mongodb+srv: mongoURL
  
  You need to create a mapbox account [https://account.mapbox.com/auth/signup/](https://account.mapbox.com/auth/signup/). and go to the tokens page.
  * MAPBOX_TOKEN= yourmapboxtoke
 
  cloudinary api credential to store images, you just need to create an account here [Cloudinary](https://cloudinary.com/users/register/free).
  Once you have created the account you can go to your dashboard where you can find the three important pieces to have access to cloudinary from
  your application.
  
  * CLOUDINARY_CLOUD_NAME=yourcloudinarycloudname
  * CLOUDINARY_KEY=yourcloudinarykey
  * CLOUDINARY_SECRET=yourcloudinarysecret
  
  The secret used in the session config.
  *SECRET=randomsecret 
  
  Once you have done all the step above we are ready to run the application using the terminal navigate to the root directory and type the following command on your terminal and hit enter, this will launch the app.
  
  ```javascript
    node app.js
  ```

 
