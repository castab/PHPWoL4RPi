(function() {
    angular.module('app', ['ngRoute'])
    .controller('mainCtrl', ['$http', '$q', function($http, $q) {
        
        vm = this;
        vm.hosts = [];
        vm.refreshAllStatusLoading = false;
        vm.wakeAllLoading = false;

        vm.sendWake = function(host) {
            _.forEach(vm.hosts, function(h) {
                if ((h.deviceType == 'workstation') && (host == h)) {
                    $http.post('wol_action.php', h)
                    .then(function(resp) {
                        //console.log(resp);
                        h.alert = true;
                        h.alertSuccess = true;
                        h.alertMessage = "Wake request sent.";
                    }, function(error) {
                        //console.log(error);
                        h.alert = true;
                        h.alertFailure = true;
                        h.alertMessage = error.data.error;
                    })   
                    
                }
            });
        }

        vm.sendWakeAll = function() {
            vm.wakeAllLoading = true;
            var promises = [];
            _.forEach(vm.hosts, function(host) {
                if (host.deviceType == 'workstation') {
                        promises.push(
                        $http.post('wol_action.php', host)
                        .then(function (resp) {
                            host.alert = true;
                            host.alertSuccess = true;
                            host.alertMessage = "Wake request sent.";
                        }, function(error) {
                            host.alert = true;
                            host.alertFailure = true;
                            host.alertMessage = error.data.error;
                        })
                    );
                }   
            })
            $q.all(promises)
            .then(function(resp) {
                vm.wakeAllLoading = false;
            }, function(error) {
                console.log(error);
            });
        }

        vm.checkAlertsForWake = function() {
            var isAlertPresent = false;
            _.forEach(vm.hosts, function(host) {
                if (host.alert && (host.alert = true)) {
                    isAlertPresent = true;
                    $('[data-toggle="popover"]').popover();
                    return false;
                }
            });
            if (!isAlertPresent) {
                $('[data-toggle="popover"]').popover('hide');
                $('[data-toggle="popover"]').popover('disable');
                $('[data-toggle="popover"]').popover('dispose');
            };
            return isAlertPresent;
        }

        vm.getNetworkStatus = function() {
            vm.refreshAllStatus();
        }

        vm.refreshAllStatus = function() {
            vm.refreshAllStatusLoading = true;
            var promises = [];
            _.forEach(vm.hosts, function(host) {
                host.isNetworkStatusLoading = true;
                host.isActive = false;
                host.isNotActive = false;
                promises.push(
                    $http.post('ping_action.php', host)
                    .then(function(resp) {
                        host.isNetworkStatusLoading = false;
                        if (resp.data.status == "OK" || (resp.data.status == "Response(s) failed" && resp.data.packetLoss < 100)) {
                            host.isActive = true;
                        } else {
                            host.isNotActive = true;
                        }
                    }, function(error) {
                        console.log('Error getting network status.')
                        host.isNetworkStatusLoading = false;
                        host.isNotActive = true;
                    })
                );
            })
            $q.all(promises)
            .then(function(resp) {
                vm.refreshAllStatusLoading = false;
            }, function(error){
                console.log(error);
            });
        }

        $http.get('hosts.json').then(
            function(resp) {
                vm.hosts = resp.data.hosts;
                vm.getNetworkStatus();
            },
            function(error) {
                console.log('Error fetching hosts');
            }
        );
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl: "hostList.html",
            controller: "mainCtrl",
            controllerAs: "vm"
        })
    }])
})();