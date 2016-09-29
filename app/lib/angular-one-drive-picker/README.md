angular-one-drive-picker
=====================

Angular directive that interact with the OneDrive Picker API :
* [OneDrive Picker SDK Docs](https://dev.onedrive.com/sdk/javascript-picker-saver.htm)

**Requirements:** AngularJS 1.2+

# Installation

1. Using Bower (recommended)

  ```Bash
  bower install angular-one-drive-picker --save
  ```

2. Manually

Download [https://github.com/Vivify-Ideas/angular-one-drive-picker/archive/master.zip](https://github.com/Vivify-Ideas/angular-one-drive-picker/archive/master.zip)


# Usage

1. Include OneDrive refefence to SDK

  ```html
  <script type="text/javascript" src="https://js.live.net/v5.0/OneDrive.js" id="onedrive-js" client-id="APP_ID"></script>
  ```

2. Include the OneDrive Picker as a dependency for your app

  ```js
  angular.module('myApp', ['angular-one-drive-picker'])
  ```

3. Configure the plugin (see below **configuration** section)

4. Create a scope to handle files that will be selected

  ```js
  angular.module('myApp', ['angular-one-drive-picker'])

  .controller('ExampleCtrl', ['$scope', function ($scope) {
     $scope.files = [];

     $scope.onPicked = function (data) {
       angular.forEach(data.values, function (file, index) {
         $scope.files.push(file);
       });
     }
  }]);
  ```

5. Add the directive to your HTML element

  ```html
  <a href="javascript:;" angular-one-drive-picker after-select="onPicked(data)">Open my OneDrive Drive</a>
  ```

6. That's it, you're done!


# Configuration

In order to work, OneDrive Picker needs to connect to the OneDrive API using an application client ID and redirect URI. For more information on how to create an application, please refer to [https://account.live.com/developers/applications](https://account.live.com/developers/applications). To do so, you'll need to configure the app.


### Using configure(options)

```js
angular.module('myApp', ['angular-one-drive-picker'])

.config(['angularOneDriveSettingsProvider', function (angularOneDriveSettingsProvider) {

  angularOneDriveSettingsProvider.configure({
    client_id    : 'YOUR_CLIENT_ID',
    redirect_uri : 'YOUR_REDIRECT_URI',
    linkType     : 'webViewLink or downloadLink'
    multiSelect  : 'true or false'
  });
}])
```

# Callbacks

The directive provide you 2 callbacks that you can use in order to work with the Picker.

### onPicked and onCancel

This callback is triggered after you select files and click on the `select` button from the Picker.

```js
angular.module('myApp', ['angular-one-drive-picker'])

.controller('ExampleCtrl', ['$scope', function ($scope) {
  $scope.onPicked = function (data) {
    // data contains the list of OneDrive files.
  }
  $scope.onCancel = function () {
    // after modal is closed with cancel button you can do something.
  }
}]);
```

```html
<a href="javascript:;" angular-one-drive-picker after-select="onPicked" after-cancel="onCancel">Open my OneDrive Drive</a>
```

# License
Licensed under the MIT license
