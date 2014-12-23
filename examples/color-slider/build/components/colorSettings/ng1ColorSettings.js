(function(){
    angular.module('colorSlider').directive('ng1ColorSettings', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/colorSettings/colorSettings.html',
            controller: Ng1ColorSettingsCtrl,
            controllerAs: 'ctrl',
            require: '^baseComponent',
            link: function (scope, lElement, attrs, base) {
                scope.ctrl.base = base;
            }
        };
    });

    var Ng1ColorSettingsCtrl = function (colorUtil, $log) {
        this.colorUtil = colorUtil;
        this.$log = $log;

        this.hue = 0;
    };

    Ng1ColorSettingsCtrl.$inject = ['colorUtil', '$log'];

    Ng1ColorSettingsCtrl.prototype.hueToHash = function(hue) {
        return this.colorUtil.hslToHash(hue / 100, 0.7, 0.4);
    };

    Ng1ColorSettingsCtrl.prototype.setParentColor = function() {
        var hash = this.hueToHash(this.hue);
        this.$log.info("setting the base component's background color to " + hash);
        this.base.setBackgroundColor(hash);
    };

})();