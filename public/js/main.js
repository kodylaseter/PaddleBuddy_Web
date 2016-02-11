/**
 * Created by Kody on 2/9/2016.
 */
var pbWeb = angular.module('pbWeb', ['ngRoute']);

pbWeb.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'mainController'
        })
        .when('/map', {
            templateUrl: 'templates/map.html',
            controller: 'mapController'
        });
});

pbWeb.controller('mainController', function($scope) {
    $scope.message = 'Home';
});

pbWeb.controller('mapController', function($scope, $http) {
    var initLatLng = new google.maps.LatLng(33.7550,-84.3900);
    var mapOptions = {
        zoom: 6,
        center: initLatLng
    };
    var riverPath = new google.maps.Polyline();
    var lineCoords = [];
    var modifying = 0;

    //region Rivers
    $scope.rivers = [];
    function getRivers() {
        modifying = 1;
        $http.get('/api/rivers')
            .success(function(data) {
                $scope.rivers = data;
                modifying = 0;
            })
            .error(function() {
                console.log('error getting rivers');
            });

    }
    getRivers();
    $scope.addRiver = function() {
        if ($scope.riverName != '') {
            modifying = 1;
            var river = {
                name: $scope.riverName
            };
            $http.post('/api/rivers', river)
                .success(function (data) {
                    getRivers();
                    $scope.riverName = '';
                    modifying = 0;
                })
                .error(function () {
                    console.log('error posting new river')
                });
        }
    };

    $scope.idSelectedRiver = null;
    $scope.setSelected = function (riverIndex) {
        $scope.idSelectedRiver = riverIndex;
        refresh();
    };

    function getSelectedRiverId() {
        return $scope.rivers[$scope.idSelectedRiver].id;
    }

    //endregion

    //region Map
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.map.addListener('rightclick', function(e) {
        if (modifying) {
            showToast('error', 'Modifying database, try again');
        } else {
            if ($scope.idSelectedRiver == null) {
                showToast('error', 'Select a river first!');
            } else {
                var lat = e.latLng.lat();
                var lng = e.latLng.lng();
                addPoint(lat, lng, getSelectedRiverId());
            }
        }
    });
    //endregion

    //region Points
    function addPoint(lat, lng, id) {
        if (modifying) showToast('error', 'Modifying database, try again')
        else {
            if ($scope.idSelectedRiver == null) showToast('error', "Select a river first!");
            else {
                modifying = 1;
                var data = {
                    lat: lat,
                    lng: lng,
                    river_id: id
                };
                $http.post('/api/points', data)
                    .success(function(data) {
                        console.log("point success");
                        modifying = 0;
                        refresh();
                    })
                    .error(function () {
                        console.log('error submitting point')
                    });
            }
        }
    }
    //endregion

    //region Line

    function refresh() {
        modifying = 1;
        console.log('refresh');
        $http.get('/api/points/' + getSelectedRiverId())
            .success( function(data) {
                lineCoords = data;
                riverPath.setMap(null);
                riverPath = new google.maps.Polyline({
                    path: lineCoords,
                    geodesic: true,
                    strokeColor: '#E57373',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: $scope.map
                });
                modifying = 0;
            })
            .error( function() {
                showToast('error', 'Error refreshing data')
            });

    }
    //endregion

    //region Toast
    function showToast(type, text) {
        if (type == 'warning') {
            $('#toast').css('background-color', '#EF6C00')
        } else if (type == 'error') {
            $('#toast').css('background-color', '#EF5350')
        } else if (type == 'success') {
            $('#toast').css('background-color', '#4DB6AC')
        }
        $('#toast').text(text);
        $('#toast').fadeIn(400).delay(2000).fadeOut(400);
    }
    //endregion
});