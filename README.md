# Angular Upload
Upload using FormData or fallback to posting to an iframe

Check the example folder to see the files that are uploaded and the express.js server that is used as the backend.

Works in all browsers, even IE6. and has no dependency on jQuery.

The code is heavily inspired by the great [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload)


**This is a prototype** so it will contain bugs, and it isn't nowhere as complete as jQuery File Upload.

## Usage
Install via bower

  bower install --save angular-upload

Add the module to your app dependencies and include it in your page

  angular.module('app', [
    'lr-upload'
  ]);

  bower_components/angular-upload/angular-upload.min.js

and to your less/css if you want the nice button

  bower_components/angular-upload/src/directives/btnUpload.less or .css

And your good to go!

### The upload service can be used this way.

    <body ng-app="app" ng-controller="AppCtrl">
        <input name="myFile" type="file" />
    </body>

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


### Or via the upload-button directive

    <body>
      <div class="btn-upload" upload-button url="/upload" on-success="onSuccess(response)" multiple="true">
        <button class="btn btn-primary">Fileupload</button>
      </div>
    </body>

### Or by specifying using the upload-button with a normal config

    <body>
      <div class="btn-upload" upload-button="uploadConfig" on-success="onSuccess(response)">
        <button class="btn btn-primary">Fileupload</button>
      </div>
    </body>

    angular.module('app').controller('AppCtrl', function ($scope) {
        // Same config that you can send into $http
        $scope.uploadConfig = {
          url: '/upload',
          data: {
            extradata: 123
            // Will contain the file or files when sent with the upload-button
          }
        };

        $scope.onSuccess = function (response) {
          console.log(response.data);
        };
    }
