(function() {
    angular.module('app', ['ngRoute'])
    .controller('mainCtrl', ['$http', function($http) {
        
        vm = this;
        vm.hosts = [];

        vm.sendWake = function(host) {
            _.forEach(vm.hosts, function(h) {
                if (host == h) {
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
            })
        }

        vm.getNetworkStatus = function() {
            _.forEach(vm.hosts, function(host) {
                host.isNetworkStatusLoading = true;
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
            })
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