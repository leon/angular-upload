'use strict';

angular.module('lr.upload.iframe', []).factory('iFrameUpload', function ($q, $http, $document, $rootScope) {

  function indexOf(array, obj) {
    if (array.indexOf) {
      return array.indexOf(obj);
    }

    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) {
        return i;
      }
    }
    return -1;
  }

  function iFrameUpload(config) {
    var files = [];

    var deferred = $q.defer(),
    promise = deferred.promise;

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
      iframe
        .off('load')
        .on('load', function () {
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
            deferred.reject({
              data: {
                message: 'fail to upload file!'
              }
            });
            return;
          }

          // Fix for IE endless progress bar activity bug
          // (happens on form submits to iframe targets):
          form.append(angular.element('<iframe src="javascript:false;"></iframe>'));

          // Convert response into JSON
          try {
            response = transformData(response, $http.defaults.transformResponse);
          } catch (e) {}

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

        angular.forEach(fns, function(fn) {
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
});
