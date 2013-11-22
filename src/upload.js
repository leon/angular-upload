'use strict';

angular.module('lr.upload').factory('upload', function ($window, formDataUpload, iFrameUpload) {
  var support = {
    // Detect file input support, based on
    // http://viljamis.com/blog/2012/file-upload-support-on-mobile/
    // Handle devices which give false positives for the feature detection:
    fileInput: !(
      new RegExp(
        '(Android (1\\.[0156]|2\\.[01]))' +
        '|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' +
        '|(w(eb)?OSBrowser)|(webOS)' +
        '|(Kindle/(1\\.0|2\\.[05]|3\\.0))'
      ).test($window.navigator.userAgent) || angular.element('<input type="file">').prop('disabled')
    ),

    // The FileReader API is not actually used, but works as feature detection,
    // as e.g. Safari supports XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads:
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
});
