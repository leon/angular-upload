# Angular Upload
Upload using FormData or fallback to posting to an iframe

Check the example folder to see the files that are uploaded and the express.js server that is used as the backend.

Works in all browsers, even IE6. and has no dependency on jQuery.

The code is heavily inspired by the great [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload)


**This is a prototype** so it will contain bugs, and it isn't nowhere as complete as jQuery File Upload.

## Usage
Install via bower
```sh
bower install --save angular-upload
```

Add the module to your app dependencies and include it in your page
```js
angular.module('app', [
  'lr.upload'
]);
```
```html
<script src='bower_components/angular-upload/angular-upload.min.js'></script>
```

and to your less/css if you want the upload button

```css
@import "bower_components/angular-upload/src/directives/btnUpload.less"; /* or .min.css */
```

And you are good to go!

## Usage

### Upload button
The upload button masks the normal file input and makes it look like a button

```html
<div
  class="btn btn-primary btn-upload"
  upload-button

  // Optional, object with all or some of the options below
  options="uploadOptions"

  // Mandatory, the url of the backend that is going to handle the upload
  url="/upload"

  // Optional, comma separated list or array of allowed mimetypes, defaults to allowing all types
  accept="{{acceptTypes}}"

  // Optional, Allow selecting multiple files, defaults to false
  multiple="{{allowMultiple}}"

  // Optional, force all uploads through the iframe solution, defaults to false
  force-iframe-upload="{{forceIframeUpload}}"

  on-success="onSuccess(response)" // Optional callback
  on-error="onError(response)" // Optional callback
  on-complete="onComplete(response)" // Optional, callback (called on both on-success and on-error)

>Fileupload</div>
```

### Alternative usage scenarios
#### The upload service
The upload service that is used behind the scenes in the upload button.
It can be used in a controller by injecting `upload`

```html
<body ng-app="app" ng-controller="AppCtrl">
    <input name="myFile" type="file" />
</body>
```

```js
angular.module('app').controller('AppCtrl', function ($scope, upload) {
  $scope.doUpload = function () {
    upload({
      url: '/upload',
      data: {
        anint: 123,
        aBlob: Blob([1,2,3]), // Only works in newer browsers
        aFile: $scope.myFile, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
      }
    }).then(
      function (response) {
        console.log(response.data); // will output whatever you choose to return from the server on a successful upload
      },
      function (response) {
          console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
      }
    );
  }
});
```

## Build it yourself!
angular-upload is built with grunt and has a express backend for testing.

Start by installing npm if you don't have it already

via homebrew or homepage (http://nodejs.org/download/)
```sh
brew install nodejs
```
then
```sh
npm install -g grunt-cli karma-cli
```
then from within angular-upload
```sh
npm install && bower install
```
then you can start the testserver up with
```sh
grunt webserver
```

and you can access it through http://localhost:9001 and test the uploader

To run the tests
```sh
grunt test
```

or run in autotest mode

```sh
grunt autotest
```

And when you're done minify it
```sh
grunt package
```
