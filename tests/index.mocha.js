describe('sfReaccess', function () {
  var assert = chai.assert;



  describe('service', function() {

    beforeEach(module('simplifield.reaccess'));

    it('should exist',
      inject(function(sfReaccessService) {

      assert(sfReaccessService);

    }));

  });

  describe('filter', function () {

    describe('with no config', function() {

      beforeEach(module('simplifield.reaccess'));

      it('should return false',
        inject(function($filter) {

        assert.equal($filter('sfReaccess')('PLOP_PLOP'), false);

      }));

    });

    describe('with simple rights', function() {

      beforeEach(function() {
        // Creating a fake app
        angular.module('fakeApp', ['simplifield.reaccess'])
          .config(function(sfReaccessServiceProvider) {
            sfReaccessServiceProvider.setPredefinedRights({
              'A_SIMPLE_RIGHT': {
                'path': '/foo',
                methods: ['OPTIONS', 'HEAD', 'GET']
              }
            });
          });

        module('fakeApp');
      });

      it('should return false for unmatched pathes',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foot',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);

      }));

      it('should return false for unmatched methods',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foo',
          methods: ['HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);

      }));

      it('should return true if everything match',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foo',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), true);

      }));

    });

    describe('with templated rights', function() {

      beforeEach(function() {
        // Creating a fake app
        angular.module('fakeApp', ['simplifield.reaccess'])
          .config(function(sfReaccessServiceProvider) {
            sfReaccessServiceProvider.setPredefinedRights({
              'A_SIMPLE_RIGHT': {
                'path': '/foo/1',
                methods: ['OPTIONS', 'HEAD', 'GET']
              },
              'A_TEMPLATED_RIGHT': {
                'path': '/foo/:id',
                methods: ['OPTIONS', 'HEAD', 'GET']
              },
              'A_COMPLEXER_TEMPLATED_RIGHT': {
                'path': '/foo/:organisation.id',
                methods: ['OPTIONS', 'HEAD', 'GET']
              },
              'A_MULTIVALUED_TEMPLATED_RIGHT': {
                'path': '/foo/:organisations.#.id',
                methods: ['OPTIONS', 'HEAD', 'GET']
              }
            });
          });

        module('fakeApp');
      });

      it('should return false for unmatched pathes',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foot/2',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);
        
        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);

      }));

      it('should return false for unmatched methods',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foo/1',
          methods: ['HEAD', 'GET']
        }]);
        
        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);

      }));

      it('should return true if everything match',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foo/:id',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);
        
        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), true);

      }));

      it('should return true with a templated right if everything match',
        inject(function($filter, sfReaccessService) {
        
        sfReaccessService.setRights([{
          path: '/foo/:id',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);
        
        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_TEMPLATED_RIGHT', {id: 1}), true);

      }));

    });

  });

});
