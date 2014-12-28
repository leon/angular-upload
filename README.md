# Angular Upload
Upload files using FormData, fall back to iframe upload when FormData isn't supported

 - Works in all browsers
 - Lightweight
 - No dependency on jQuery

## Example
```html
<div
  class="btn btn-primary btn-upload"
  upload-button
  url="/upload"
  on-success="onSuccess(response)"
>Upload</div>
```

## Install
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

## Documentation over parameters

### Upload button
The upload button masks the normal file input and makes it look like a button

```html
<div
  class="btn btn-primary btn-upload"
  upload-button

  // Mandatory, the url of the backend that is going to handle the upload
  url="/upload"

  // Optional, file param name for upload
  param="file"

  // Optional, object to send as form data with the upload
  data="formData"

  // Optional, comma separated list or array of allowed mimetypes, defaults to allowing all types
  accept="{{acceptTypes}}"

  // Optional, Allow selecting multiple files, defaults to false
  multiple="{{allowMultiple}}"

  // Optional, force all uploads through the iframe solution, defaults to false and should normally not be included
  force-iframe-upload="{{forceIframeUpload}}"

  // Optional, make file input required and add ng-invalid-required if required is set to true on the input button
  required="true|false"

  on-upload="onUpload(files)" // Optional callback when uploading starts
  on-success="onSuccess(response)" // Optional callback
  on-error="onError(response)" // Optional callback
  on-complete="onComplete(response)" // Optional, callback (called on both on-success and on-error)

>Fileupload</div>
```

## Advanced documentation
The upload service that is used behind the scenes in the upload button, can be used in a controller by injecting `upload`

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
      method: 'POST',
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
