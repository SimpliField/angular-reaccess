# sf-reaccess

AngularJS tools to customize users interfaces based on their rights on the REST
 API.

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

IT will display add/edit/delete buttons depending on the user rights comparing
 to the methods and pathes set for the given predefined rights.

Predefined rights are set in your application configuration like this:
 ```js
angular.module('myApp')
  .config(['$sfReaccessServiceProvider', 'profileService', function($sfReaccessServiceProvider) {

    // Setting templated rights
    $sfReaccessServiceProvider.setPredefinedRights({
      'USER_ADD':  [{
        path: '/users/:id',
        rights: ['GET', 'POST']
      }],
      'USER_EDIT':[{
        path: '/users/:id',
        rights: ['PUT']
      }],
      'USER_DELETE':  [{
        path: '/users/:id',
        rights: ['GET', 'DELETE']
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

## Note for Express users

If you use Express for your backend, you may be interested by the
 [`express-reaccess`](https://github.com/SimpliField/express-reaccess)
 middleware.
 
