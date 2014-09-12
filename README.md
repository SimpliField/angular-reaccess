# sf-reaccess

AngularJS tools to customize users interfaces based on their rights on the REST
 API.

## Quick start
Consider the following template:

```html
<button
  ng-show="'ADD_USER' | sfReaccess"
  ng-click="addUser()">Add a user</button>

<div ng-repeat="user in users">
  {{ user.name }}
  <button
    ng-show="'EDIT_USER' | sfReaccess:user"
    ng-click="editUser(user)">Edit this user</button>
  <button
    ng-show="DELETE_USER' | sfReaccess:user"
    ng-click="removeUser(user)">Delete this user</button>
</div>
```

IT will display add/edit/delete buttons depending on the user rights. Those are
 set in your application configuration like this:

 ```js
angular.module('myApp')
  .config(['$sfReaccessProvider', '$q', function($sfReaccessProvider) {

    // Setting templated rights
    $sfReaccessProvider.setPredefinedRights({
      'ADD_USER':  [{
        path: '/users/:id',
        rights: ['GET', 'POST']
      }],
      'EDIT_USER':[{
        path: '/users/:id',
        rights: ['PUT']
      }],
      'DELETE_USER':  [{
        path: '/users/:id',
        rights: ['GET', 'DELETE']
      }]
    });

    // Setting how connected user rights are retrieved
    $sfReaccessProvider.setRightsSource(profileService.getRights);
  }]);
```

## Note for Express users

If you use Express for your backend, you may be interested by the
 [`express-reaccess`](https://github.com/SimpliField/express-reaccess)
 middleware.
 
