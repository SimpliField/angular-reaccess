# sf-reaccess

AngularJS tools to customize users interfaces based on their rights on the REST
 API.
 
[![NPM version](https://badge.fury.io/js/angular-reaccess.svg)](https://npmjs.org/package/angular-reaccess) [![Build status](https://secure.travis-ci.org/SimpliField/angular-reaccess.svg)](https://travis-ci.org/SimpliField/angular-reaccess) [![Dependency Status](https://david-dm.org/SimpliField/angular-reaccess.svg)](https://david-dm.org/SimpliField/angular-reaccess) [![devDependency Status](https://david-dm.org/SimpliField/angular-reaccess/dev-status.svg)](https://david-dm.org/SimpliField/angular-reaccess#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/SimpliField/angular-reaccess/badge.svg?branch=master)](https://coveralls.io/r/SimpliField/angular-reaccess?branch=master) [![Code Climate](https://codeclimate.com/github/SimpliField/angular-reaccess.svg)](https://codeclimate.com/github/SimpliField/angular-reaccess) [![CodeFactor](https://www.codefactor.io/repository/github/simplifield/angular-reaccess/badge)](https://www.codefactor.io/repository/github/simplifield/angular-reaccess)

See [those slides](http://slides.com/nfroidure/reaccess) to know more about the
 `reaccess` project principles.

## Quick start
Consider the following template:

```html
<button
  ng-show="'USER_ADD' | sfReaccess"
  ng-click="addUser()">Add a user</button>

<div ng-repeat="user in users">
  {{ user.name }}
  <button
    ng-show="'USER_EDIT' | sfReaccess:user"
    ng-click="editUser(user)">Edit this user</button>
  <button
    ng-show="USER_DELETE' | sfReaccess:user"
    ng-click="removeUser(user)">Delete this user</button>
</div>
```

It will display add/edit/delete buttons depending on the user rights comparing
 to the methods and pathes set for the given predefined rights.

Predefined rights are set in your application configuration like this:
 ```js
angular.module('myApp')
  .config(['sfReaccessServiceProvider', 'profileService', function(sfReaccessServiceProvider) {

    // Setting templated rights
    $sfReaccessServiceProvider.setPredefinedRights({
      'USER_ADD':  [{
        path: '/users/:id',
        methods: ['GET', 'POST']
      }],
      'USER_EDIT':[{
        path: '/users/:id',
        methods: ['PUT']
      }],
      'USER_DELETE':  [{
        path: '/users/:id',
        methods: ['GET', 'DELETE']
      }]
    });

  }]);
```

User rights are set by using the `sfReaccessService.setRights()` method,
 they look like this:
```js
sfReaccessService.setRights([{
  path: "/users/:_id/?.*",
  methods: [
    "OPTIONS",
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ]
},{
  path: "/organisations/:organisation_id/?.*",
  methods: [
    "OPTIONS",
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ]
}]);
```

Path values are templated regular expressions. To set objects where to search
 for template expressions values, use `sfReaccessService.setValues()`:
```js
sfReaccessService.setValues([{
  _id: 1,
  organisation_id: 1
}]);
```

## Debugging

You can enable sfReaccess debug mode globally:

 ```js
angular.module('myApp')
  .config(['sfReaccessServiceProvider', function(sfReaccessServiceProvider) {

    // Set debug mode
    $sfReaccessServiceProvider.debug(true);

  }]);
```

Or locally as an argument to the angular filter:
```html
<button
  ng-show="'USER_ADD' | sfReaccess: undefined : true"
  ng-click="addUser()">Add a user</button>
```

## Contribute
To contribute to this project, first run the following to setup the development
 environment:
```sh
npm install
bower install
```

Then, run the tests and debug with Karma:
```sh
npm run dev
```

## Note for Express users

If you use Express for your backend, you may be interested by the
 [`express-reaccess`](https://github.com/SimpliField/express-reaccess)
 middleware.

## Stats

[![NPM](https://nodei.co/npm/angular-reaccess.png?downloads=true&stars=true)](https://nodei.co/npm/angular-reaccess/)
[![NPM](https://nodei.co/npm-dl/angular-reaccess.png)](https://nodei.co/npm/angular-reaccess/)
