'use strict';

describe('upload', function () {

  var $compile, $rootScope, upload;

  beforeEach(function () {
    angular.mock.module('lr.upload');

    inject(function ($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      upload = $injector.get('upload');
    });
  });

  it('should upload', function () {
    /*upload({
      url: '/upload',
      method: 'POST',
      data: {
        name: 'Leon',
        file: Blob([1,2,3])
      }
    })*/
  });
});
