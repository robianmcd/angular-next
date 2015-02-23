/* */ 
export default function polyfillPromise(ngModule) {
    ngModule.run(['$q', '$window', function ($q, $window) {
        $window.Promise = function (executor) {
            return $q(executor);
        };

        $window.Promise.all = $q.all.bind($q);
        $window.Promise.reject = $q.reject.bind($q);
        $window.Promise.resolve = $q.when.bind($q);

        $window.Promise.race = function (promises) {
            var promiseMgr = $q.defer();

            for (var i = 0; i < promises.length; i++) {
                promises[i].then(function (result) {
                    if (promiseMgr) {
                        promiseMgr.resolve(result);
                        promiseMgr = null;
                    }
                });

                promises[i].catch(function (result) {
                    if (promiseMgr) {
                        promiseMgr.reject(result);
                        promiseMgr = null;
                    }
                });
            }

            return promiseMgr.promise;
        };

    }]);

    //Make sure the run block we just added gets executed before any other run blocks
    if (angular.isArray(ngModule._runBlocks)) {
        ngModule._runBlocks.unshift(ngModule._runBlocks.pop());
    }
}