'use strict';
angular.module('lr.upload', [
  'lr.upload.formdata',
  'lr.upload.iframe',
  'lr.upload.directives'
]);
angular.module('lr.upload.directives', []);
'use strict';
angular.module('lr.upload.directives').directive('uploadButton', [
  'upload',
  function (upload) {
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
      link: function (scope, element) {
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
          upload(options).then(function (response) {
            scope.onSuccess({ response: response });
            scope.onComplete({ response: response });
          }, function (response) {
            scope.onError({ response: response });
            scope.onComplete({ response: response });
          });
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
  }
]);
'use strict';
angular.module('lr.upload.formdata', []).factory('formDataTransform', function () {
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
}).factory('formDataUpload', [
  '$http',
  'formDataTransform',
  function ($http, formDataTransform) {
    return function formDataUpload(config) {
      return $http(angular.extend(config, {
        headers: { 'Content-Type': undefined },
        transformRequest: formDataTransform
      }));
    };
  }
]);
'use strict';
angular.module('lr.upload.iframe', []).factory('iFrameUpload', [
  '$q',
  '$http',
  '$document',
  '$rootScope',
  function ($q, $http, $document, $rootScope) {
    function indexOf(array, obj) {
      if (array.indexOf) {
        return array.indexOf(obj);
      }
      for (var i = 0; i < array.length; i++) {
        if (obj === array[i]) {
          return i;
        }
      }
      return -1;
    }
    function iFrameUpload(config) {
      var files = [];
      var deferred = $q.defer(), promise = deferred.promise;
      angular.forEach(config.data || {}, function (value, key) {
        if (angular.isElement(value)) {
          delete config.data[key];
          value.attr('name', key);
          files.push(value);
        }
      });
      var addParamChar = /\?/.test(config.url) ? '&' : '?';
      if (config.method === 'DELETE') {
        config.url = config.url + addParamChar + '_method=DELETE';
        config.method = 'POST';
      } else if (config.method === 'PUT') {
        config.url = config.url + addParamChar + '_method=PUT';
        config.method = 'POST';
      } else if (config.method === 'PATCH') {
        config.url = config.url + addParamChar + '_method=PATCH';
        config.method = 'POST';
      }
      var body = angular.element($document[0].body);
      var uniqueName = 'iframe-transport-' + $rootScope.$new().$id;
      var form = angular.element('<form></form>');
      form.attr('target', uniqueName);
      form.attr('action', config.url);
      form.attr('method', config.method || 'POST');
      form.css('display', 'none');
      if (files.length) {
        form.attr('enctype', 'multipart/form-data');
        form.attr('encoding', 'multipart/form-data');
      }
      var iframe = angular.element('<iframe name="' + uniqueName + '" src="javascript:false;"></iframe>');
      iframe.on('load', function () {
        iframe.off('load').on('load', function () {
          var response;
          try {
            var doc = this.contentWindow ? this.contentWindow.document : this.contentDocument;
            response = angular.element(doc.body).text();
            if (!response.length) {
              throw new Error();
            }
          } catch (e) {
          }
          form.append(angular.element('<iframe src="javascript:false;"></iframe>'));
          try {
            response = transformData(response, $http.defaults.transformResponse);
          } catch (e) {
          }
          deferred.resolve({
            data: response,
            status: 200,
            headers: [],
            config: config
          });
        });
        angular.forEach(files, function (input) {
          var clone = input.clone(true);
          input.after(clone);
          form.append(input);
        });
        angular.forEach(config.data, function (value, name) {
          var input = angular.element('<input type="hidden" />');
          input.attr('name', name);
          input.val(value);
          form.append(input);
        });
        config.$iframeTransportForm = form;
        $http.pendingRequests.push(config);
        function transformData(data, fns) {
          var headers = [];
          if (angular.isFunction(fns)) {
            return fns(data, headers);
          }
          angular.forEach(fns, function (fn) {
            data = fn(data, headers);
          });
          return data;
        }
        function removePendingReq() {
          var idx = indexOf($http.pendingRequests, config);
          if (idx !== -1) {
            $http.pendingRequests.splice(idx, 1);
            config.$iframeTransportForm.remove();
            delete config.$iframeTransportForm;
          }
        }
        form[0].submit();
        promise.then(removePendingReq, removePendingReq);
      });
      form.append(iframe);
      body.append(form);
      return promise;
    }
    return iFrameUpload;
  }
]);
'use strict';
angular.module('lr.upload').factory('upload', [
  '$window',
  'formDataUpload',
  'iFrameUpload',
  function ($window, formDataUpload, iFrameUpload) {
    var support = {
        fileInput: !(new RegExp('(Android (1\\.[0156]|2\\.[01]))' + '|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' + '|(w(eb)?OSBrowser)|(webOS)' + '|(Kindle/(1\\.0|2\\.[05]|3\\.0))').test($window.navigator.userAgent) || angular.element('<input type="file">').prop('disabled')),
        fileUpload: !!($window.XMLHttpRequestUpload && $window.FileReader),
        formData: !!$window.FormData
      };
    function upload(config) {
      if (support.formData && !config.forceIFrameUpload) {
        return formDataUpload(config);
      }
      return iFrameUpload(config);
    }
    upload.support = support;
    return upload;
  }
]);