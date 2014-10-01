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
        inject(function($filter, $log) {

        assert.equal($filter('sfReaccess')('PLOP_PLOP'), false);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('PLOP_PLOP', undefined, true), false);
        assert.equal($log.error.logs.length, 1);
        assert.equal($log.debug.logs.length, 1);
        $log.reset();
      }));

      it('should provide debug infos in local debug mode',
        inject(function($filter, $log) {
      }));

    });

    describe('with global debug', function() {

      beforeEach(function() {
        // Creating a fake app
        angular.module('fakeApp', ['simplifield.reaccess'])
          .config(function(sfReaccessServiceProvider) {
            sfReaccessServiceProvider.debug(true);
          });

        module('fakeApp');
      });

      it('should provide debug infos',
        inject(function($filter, $log) {
        assert.equal($filter('sfReaccess')('PLOP_PLOP'), false);
        assert.equal($log.error.logs.length, 1);
        assert.equal($log.debug.logs.length, 1);
        $log.reset();
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
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foot',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), false);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 2);
        $log.reset();

      }));

      it('should return false for unmatched methods',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo',
          methods: ['HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), false);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 2);
        $log.reset();

      }));

      it('should return true if everything match',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), true);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), true);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 2);
        $log.reset();

      }));

    });

    describe('with several rights in filter input', function() {

      beforeEach(function() {
        // Creating a fake app
        angular.module('fakeApp', ['simplifield.reaccess'])
          .config(function(sfReaccessServiceProvider) {
            sfReaccessServiceProvider.setPredefinedRights({
              'A_SIMPLE_RIGHT': {
                'path': '/foo',
                methods: ['OPTIONS', 'HEAD', 'GET']
              },
              'ANOTHER_SIMPLE_RIGHT': {
                'path': '/bar',
                methods: ['OPTIONS', 'HEAD', 'GET']
              }
            });
          });

        module('fakeApp');
      });

      it('should return true if everything match',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }, {
          path: '/bar',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        assert.equal($filter('sfReaccess')([
          'A_SIMPLE_RIGHT',
          'ANOTHER_SIMPLE_RIGHT'
        ]), true);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')([
          'A_SIMPLE_RIGHT',
          'ANOTHER_SIMPLE_RIGHT'
        ], undefined, true), true);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 4);
        $log.reset();

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
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foot/2',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), false);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 2);
        $log.reset();

      }));

      it('should return false for unmatched methods',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo/1',
          methods: ['HEAD', 'GET']
        }]);

        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), false);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), false);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 2);
        $log.reset();

      }));

      it('should return true if everything match',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo/:id',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT'), true);
        $log.assertEmpty();

        assert.equal($filter('sfReaccess')('A_SIMPLE_RIGHT', undefined, true), true);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 3);
        $log.reset();

      }));

      it('should return true with a templated right if everything match',
        inject(function($filter, $log, sfReaccessService) {

        sfReaccessService.setRights([{
          path: '/foo/:id',
          methods: ['OPTIONS', 'HEAD', 'GET']
        }]);

        sfReaccessService.setValues([{
          id: 1
        }]);

        assert.equal($filter('sfReaccess')('A_TEMPLATED_RIGHT', {id: 1}), true);
        $log.assertEmpty();


        assert.equal($filter('sfReaccess')('A_TEMPLATED_RIGHT', {id: 1}, true), true);
        assert.equal($log.error.logs.length, 0);
        assert.equal($log.debug.logs.length, 4);
        $log.reset();

      }));

    });

  });

});
