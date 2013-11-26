'use strict';

describe('UploadForm', function () {

  var $compile, $rootScope, iFrameUpload;

  beforeEach(function () {
    angular.mock.module('lr.upload.iframe');

    inject(function ($injector) {
      $compile = $injector.get('$compile');
      $rootScope = $injector.get('$rootScope');
      iFrameUpload = $injector.get('iFrameUpload');
    });
  });

  it('should display fileupload', function () {
    /*$scope.uploadOptions = {};
    var element = $compile('<form upload-form="uploadOptions"><form>')($scope);
    $scope.$digest();

    expect(element.html()).toContain('iframe');*/
  });
});
