# Lake map

Lake map is a web application that lets you find out the most interesting places on Lake Maggiore and plan your vacations!

This application has been created as a project for Udacity Front End Web Developer NanoDegree.

## Language used

* HTML5
* CSS3
* Javascript

## APIS implemented

* Google Maps
* FourSquare

## Features

These are the main features (please note that the project is still under development):

- [X] Bower for retrieving jQuery and Knockout libraries
- [X] Knockout.js filtering for places and categories
- [ ] Firebase database for storing places

### Online version

You can see the online optimized version at [https://wildboni.github.io/lake-map/public/index.html](https://wildboni.github.io/lake-map/public/index.html).

### Running locally

1. Clone the GitHub repository

  ```
  git clone https://github.com/WildBoni/lake-map.git
  ```

2. Open the public/index.html file in your browser
###### If you would like to recreate the working environment, do as follows:

3. Install [Node.js](https://nodejs.org/)

4. Install [Bower](https://bower.io/)

5.  Open command line and
  ``` sh
  $> cd /path/to/your-project-folder
  $> npm install
  ```
###### Now gulp.js and all its dependencies are ready to run!

6. Navigate to your project folder and

  ```
  $ bower install
  ```
###### This will download bower dependencies used in the project (Jquery and Knockout)

7. To eventually update the libraries in the app folder, navigate to your project folder and

  ```
  $ gulp
  ```
###### This will copy Jquery and Knockout files from Bower folder to the app folder

### Useful links and resources
* [Google Maps APIs](https://developers.google.com/maps/documentation/javascript/adding-a-google-map)
* [Knockout.js documentation](http://knockoutjs.com/documentation/introduction.html)
* [Udacity Google Maps APIs course repository](https://github.com/udacity/ud864)
* Marker icons are courtesy of some website I unfortunately forgot... Sorry about that.
* References to StackOverflow discussions and other coding solution are commented inside the code
