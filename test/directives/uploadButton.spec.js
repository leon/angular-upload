'use strict';

describe('btnUpload', function () {

  var $compile, $rootScope;

  beforeEach(function () {
    angular.mock.module('lr.upload');

    inject(function ($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
    });
  });

  it('should display fileupload', function () {
    var element = $compile('<div class="btn-upload" upload-button><button>Fileupload</button></div>')($rootScope);
    expect(element.html()).toContain('type="file"');
  });
});
