'use strict';

describe('formDataUpload', function () {

  var $httpMock;

  beforeEach(function () {
    angular.mock.module('lr.upload.formdata');

    $httpMock = jasmine.createSpy();

    module(function ($provide) {
      $provide.value('$http', $httpMock);
    });
  });

  it('should retain headers', inject(function (formDataUpload) {

    var config = {
      headers: {
        'X-CustomHeader': 'customheader'
      }
    };

    formDataUpload(config);

    expect($httpMock).toHaveBeenCalledWith({
      headers: {
        'X-CustomHeader': 'customheader',
        'Content-Type': undefined
      },
      transformRequest : jasmine.any(Function)
    });

  }));

});
