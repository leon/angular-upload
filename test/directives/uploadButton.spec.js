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
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button><button>Fileupload</button></div>')($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain('type="file"');
  });

  it('should not set required of not present', function () {
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button><button>Fileupload</button></div>')($rootScope);
    var fileElement = element.find('input');
    $rootScope.$digest();
    expect(fileElement.attr('required')).not.toBeDefined();
  });

  it('should set required', function () {
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button required="true"><button>Fileupload</button></div>')($rootScope);
    var fileElement = element.find('input');
    $rootScope.$digest();
    expect(fileElement.attr('required')).toBeDefined();
    expect(element.hasClass('ng-invalid-required')).toBe(true);
  });

  iit('should set required even if empty attribute', function () {
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button required><button>Fileupload</button></div>')($rootScope);
    var fileElement = element.find('input');
    $rootScope.$digest();
    expect(fileElement.attr('required')).toBeDefined();
    expect(element.hasClass('ng-invalid-required')).toBe(true);
  });

  it('should set accept', function () {
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button accept="image/*"><button>Fileupload</button></div>')($rootScope);
    var fileElement = element.find('input');
    $rootScope.$digest();
    expect(fileElement.attr('accept')).toEqual('image/*');
  });

  it('should set multiple', function () {
    var element = $compile('<div class="btn btn-primary btn-upload" upload-button multiple="true"><button>Fileupload</button></div>')($rootScope);
    var fileElement = element.find('input');
    $rootScope.$digest();
    expect(fileElement.attr('multiple')).toBeDefined();
  });
});
