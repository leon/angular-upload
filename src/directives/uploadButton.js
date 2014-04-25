'use strict';

angular.module('lr.upload.directives').directive('uploadButton', function(upload) {
  return {
    restrict: 'EA',
    scope: {
      options: '=?uploadButton',
      multiple: '@',
      accept: '@',
      forceIFrameUpload: '@forceIframeUpload',
      url: '@',
      method: '@',
      onSuccess: '&',
      onError: '&',
      onComplete: '&'
    },
    link: function(scope, element) {

      var el = angular.element(element);
      var fileInput = angular.element('<input type="file" />');

      fileInput.on('change', function uploadButtonFileInputChange() {

        if (fileInput[0].files && fileInput[0].files.length === 0) {
          return;
        }

        if (!scope.options) {
          scope.options = {};
        }

        var options = {
          url: scope.url || scope.options.url,
          method: scope.method || scope.options.method || 'POST',
          forceIFrameUpload: scope.forceIFrameUpload || scope.options.forceIFrameUpload || false,
          data: scope.options.data || {}
        };

        options.data[scope.options.paramName || 'file'] = fileInput;

        upload(options).then(
          function (response) {
            scope.onSuccess({response: response});
            scope.onComplete({response: response});
          },
          function (response) {
            scope.onError({response: response});
            scope.onComplete({response: response});
          }
        );
      });

      scope.$watch('accept', function uploadButtonAcceptWatch(value) {
        fileInput.attr('accept', angular.isArray(value) ? value.join(',') : value);
      });

      el.append(fileInput);

      if (upload.support.formData) {
        scope.$watch('multiple + forceIFrameUpload', function uploadButtonMultipleWatch(value) {
          fileInput.attr('multiple', !!(value && !scope.forceIFrameUpload));
        });
      }
    }
  };
});
