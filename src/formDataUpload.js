'use strict';

angular.module('lr.upload.formdata', [])

  // Convert all data properties to FormData,
  // if they are a jqLite element, extract the files from the input
  .factory('formDataTransform', function () {
    return function formDataTransform(data) {
      var formData = new FormData();
      angular.forEach(data, function (value, key) {
        if (angular.isElement(value)) {
          var files = [];
          angular.forEach(value, function (el) {
            angular.forEach(el.files, function (file) {
              files.push(file);
            });
          });
          if (files.length !== 0) {
            if (files.length > 1) {
              angular.forEach(files, function (file, index) {
                formData.append(key + '[' + index + ']', file);
              });
            } else {
              formData.append(key, files[0]);
            }
          }
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    };
  })

  .factory('formDataUpload', function ($http, formDataTransform) {
    return function formDataUpload(config) {
      return $http(angular.extend(config, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: formDataTransform
      }));
    };
  });
