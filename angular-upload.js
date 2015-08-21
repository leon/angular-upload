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
        data: '=?data',
        url: '@',
        id: '@',
        param: '@',
        method: '@',
        onUpload: '&',
        onSuccess: '&',
        onError: '&',
        onComplete: '&'
      },
      link: function (scope, element, attr) {
        var el = angular.element(element);
        var fileInput = angular.element('<input id="' + scope.id + '" type="file" />');
        el.append(fileInput);
        fileInput.on('change', function uploadButtonFileInputChange() {
          // without this, iframeUpload always upload the first time picked file
          var fileInput = angular.element(this);
          if (fileInput[0].files && fileInput[0].files.length === 0) {
            return;
          }
          var options = {
              url: scope.url,
              method: scope.method || 'POST',
              forceIFrameUpload: scope.$eval(attr.forceIframeUpload) || false,
              data: scope.data || {}
            };
          options.data[scope.param || 'file'] = fileInput;
          scope.$apply(function () {
            scope.onUpload({ files: fileInput[0].files });
          });
          upload(options).then(function (response) {
            scope.onSuccess({ response: response });
            scope.onComplete({ response: response });
          }, function (response) {
            scope.onError({ response: response });
            scope.onComplete({ response: response });
          });
        });
        // Add required to file input and ng-invalid-required
        // Since the input is reset when upload is complete, we need to check something in the
        // onSuccess and set required="false" when we feel that the upload is correct
        if ('required' in attr) {
          attr.$observe('required', function uploadButtonRequiredObserve(value) {
            var required = value === '' ? true : scope.$eval(value);
            fileInput.attr('required', required);
            element.toggleClass('ng-valid', !required);
            element.toggleClass('ng-invalid ng-invalid-required', required);
          });
        }
        if ('accept' in attr) {
          attr.$observe('accept', function uploadButtonAcceptObserve(value) {
            fileInput.attr('accept', value);
          });
        }
        if (upload.support.formData) {
          var uploadButtonMultipleObserve = function () {
            fileInput.attr('multiple', !!(scope.$eval(attr.multiple) && !scope.$eval(attr.forceIframeUpload)));
          };
          attr.$observe('multiple', uploadButtonMultipleObserve);
          attr.$observe('forceIframeUpload', uploadButtonMultipleObserve);
        }
      }
    };
  }
]);
'use strict';
angular.module('lr.upload.formdata', []).factory('formDataTransform', function () {
  return function formDataTransform(data) {
    var formData = new FormData();
    // Extract file elements from within config.data
    angular.forEach(data, function (value, key) {
      // If it's an element that means we should extract the files
      if (angular.isElement(value)) {
        var files = [];
        // Extract all the Files from the element
        angular.forEach(value, function (el) {
          angular.forEach(el.files, function (file) {
            files.push(file);
          });
          // Reset input value so that we don't upload the same files next time
          el.value = '';
        });
        // Do we have any files?
        if (files.length !== 0) {
          // If we have multiple files we send them as a 0 based array of params
          // file[0]=file1&file[1]=file2...
          if (files.length > 1) {
            angular.forEach(files, function (file, index) {
              formData.append(key + '[' + index + ']', file);
            });
          } else {
            formData.append(key, files[0]);
          }
        }
      } else {
        // If it's not a element we append the data as normal
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
      // Apply FormData transform to the request
      config.transformRequest = formDataTransform;
      // Set method to POST if not defined
      config.method = config.method || 'POST';
      // Extend the headers so that the browser will set the correct content type
      config.headers = angular.extend(config.headers || {}, { 'Content-Type': undefined });
      return $http(config);
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
      // Extract file elements from the within config.data
      angular.forEach(config.data || {}, function (value, key) {
        if (angular.isElement(value)) {
          delete config.data[key];
          value.attr('name', key);
          files.push(value);
        }
      });
      // If the method is something else than POST append the _method parameter
      var addParamChar = /\?/.test(config.url) ? '&' : '?';
      // XDomainRequest only supports GET and POST:
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
      // Generate a unique name using getUid() https://github.com/angular/angular.js/blob/master/src/Angular.js#L292
      // But since getUid isn't exported we get it from a temporary scope
      var uniqueScope = $rootScope.$new();
      var uniqueName = 'iframe-transport-' + uniqueScope.$id;
      uniqueScope.$destroy();
      var form = angular.element('<form></form>');
      form.attr('target', uniqueName);
      form.attr('action', config.url);
      form.attr('method', config.method || 'POST');
      form.css('display', 'none');
      if (files.length) {
        form.attr('enctype', 'multipart/form-data');
        // enctype must be set as encoding for IE:
        form.attr('encoding', 'multipart/form-data');
      }
      // Add iframe that we will post to
      var iframe = angular.element('<iframe name="' + uniqueName + '" src="javascript:false;"></iframe>');
      // The first load is called when the javascript:false is loaded,
      // that means we can continue with adding the hidden form and posting it to the iframe;
      iframe.on('load', function () {
        iframe.off('load').on('load', function () {
          // The upload is complete and we not need to parse the contents and resolve the deferred
          var response;
          // Wrap in a try/catch block to catch exceptions thrown
          // when trying to access cross-domain iframe contents:
          try {
            var doc = this.contentWindow ? this.contentWindow.document : this.contentDocument;
            response = angular.element(doc.body).text();
            // Google Chrome and Firefox do not throw an
            // exception when calling iframe.contents() on
            // cross-domain requests, so we unify the response:
            if (!response.length) {
              throw new Error();
            }
          } catch (e) {
          }
          // Fix for IE endless progress bar activity bug
          // (happens on form submits to iframe targets):
          form.append(angular.element('<iframe src="javascript:false;"></iframe>'));
          // Convert response into JSON
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
        // Add all existing data as hidden variables
        angular.forEach(config.data, function (value, name) {
          var input = angular.element('<input type="hidden" />');
          input.attr('name', name);
          input.val(value);
          form.append(input);
        });
        // Move file inputs to hidden form, adding files last, as this is a
        // requirement for uploading to S3
        angular.forEach(files, function (input) {
          // Clone the original input also cloning it's event
          // @fix jQuery supports the option of cloning with events, but angular doesn't
          // this means that if you don't use jQuery the input will only work the first time.
          // because when we place the clone in the originals place we will not have a
          // change event hooked on to it.
          var clone = input.clone(true);
          // Insert clone directly after input
          input.after(clone);
          // Move original input to hidden form
          form.append(input);
        });
        config.$iframeTransportForm = form;
        // Add the config to the $http pending requests to indicate that we are doing a request via the iframe
        $http.pendingRequests.push(config);
        // Transform data using $http.defaults.response
        function transformData(data, fns) {
          // An iframe doesn't support headers :(
          var headers = [];
          if (angular.isFunction(fns)) {
            return fns(data, headers);
          }
          angular.forEach(fns, function (fn) {
            data = fn(data, headers);
          });
          return data;
        }
        // Remove everything when we are done
        function removePendingReq() {
          var idx = indexOf($http.pendingRequests, config);
          if (idx !== -1) {
            $http.pendingRequests.splice(idx, 1);
            config.$iframeTransportForm.remove();
            delete config.$iframeTransportForm;
          }
        }
        // submit the form and wait for a response
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