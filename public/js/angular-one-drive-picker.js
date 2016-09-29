/*
 * angular-one-drive-picker
 *
 * Interact with the OneDrive API Picker
 * More information about the OneDrive API can be found at https://dev.onedrive.com/sdk/javascript-picker-saver.htm
 *
 * (c) 2015 Vivify Ideas
 * License: MIT
 */
(function () {
  angular.module('angularOneDrivePicker', [])

  .provider('angularOneDriveSettings', function () {
    this.client_id    = null;
    this.redirect_uri = null;
    this.linkType     = 'webViewLink';
    this.multiSelect  = true;

    /**
     * Provider factory $get method
     * Return OneDrive Picker API settings
     */
    this.$get = ['$window', function ($window) {
      return {
        client_id    : this.client_id,
        redirect_uri : this.redirect_uri,
        linkType     : this.linkType,
        multiSelect  : this.multiSelect
      }
    }];

    /**
     * Set the API config params using a hash
     */
    this.configure = function (config) {
      for (var key in config) {
        this[key] = config[key];
      }
    };
  })

  .directive('angularOneDrivePicker', ['angularOneDriveSettings', function (angularOneDriveSettings) {
    return {
      restrict: 'A',
      scope: {
        afterSelect: '=',
        afterCancel: '=?'
      },
      link: function (scope, element, attrs) {

        WL.init(angularOneDriveSettings);

        function openFileDialog() {
          WL.login({ scope: 'wl.signin onedrive.readonly' })
          .then(function(response) {
            openOneDrivePicker();
          });
        }

        function openOneDrivePicker() {
          var pickerOptions = angularOneDriveSettings;

          pickerOptions.success = scope.afterSelect;
          if (typeof scope.afterCancel === 'function') {
            pickerOptions.cancel = scope.afterCancel;
          };

          OneDrive.open(pickerOptions);
        }

        element.bind('click', function (e) {
          openFileDialog();
        });
      }
    }
  }]);
})();