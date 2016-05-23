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
    var markers = [];
    //var mapCircle = new google.maps.Marker();
    var prevPointID = null;

    //region Rivers
    $scope.rivers = [];
    function getRivers() {
        modifying = 1;
        $http.get('/api/web/rivers')
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
            $http.post('/api/web/rivers', river)
                .success(function (data) {
                    $scope.rivers = data;
                    $scope.riverName = '';
                })
                .error(function () {
                    console.log('error posting new river')
                });
            modifying = 0;
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
                var totaldata = [prevPointID, data];
                $http.post('/api/web/points', totaldata)
                    .success(function(data) {
                        modifying = 0;
                        refresh();
                    })
                    .error(function () {
                        showToast('Error', 'Error submitting point');
                    });
            }
        }
    }

    $scope.deletePoint = function() {
        $http.delete('/api/web/points/' + getNewestPoint().id)
            .success(function(data) {
                refresh();
            })
            .error(function(data) {
                console.log(data);
            });
    };

    function getNewestPoint() {
        return lineCoords[lineCoords.length - 1];
    }
    //endregion

    //region Line

    function refresh() {
        var id = getSelectedRiverId();
        modifying = 1;
        $http.get('/api/web/points/' + id)
            .success( function(data) {
                if (data[data.length -1] != null)
                    prevPointID = data[data.length - 1].id;
                lineCoords = data;
                riverPath.setMap(null);
                for (i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                if (lineCoords.length > 0) {
                    riverPath = new google.maps.Polyline({
                        path: lineCoords,
                        geodesic: true,
                        strokeColor: '#E57373',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        map: $scope.map
                    });
                    var pos = {
                        lat: getNewestPoint().lat,
                        lng: getNewestPoint().lng
                    };
                    for (i = 0; i < lineCoords.length; i++) {
                        var color = '#0000ff';
                        var scale = 3;
                        if (i == lineCoords.length - 1) {
                            color = '#00ff00';
                            scale = 4;
                        }
                        markers[i] = new google.maps.Marker({
                            position: new google.maps.LatLng({
                                lat: lineCoords[i].lat,
                                lng: lineCoords[i].lng
                            }),
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                fillOpacity: 0.8,
                                fillColor: color,
                                strokeOpacity: 1.0,
                                strokeColor: '#000000',
                                strokeWeight: 2.0,
                                scale: scale
                            },
                            map: $scope.map
                        });
                        addMarkerListener(markers[i], i);
                    }
                }
                modifying = 0;
            })
            .error( function() {
                showToast('error', 'Error refreshing data')
            });

    }
    //endregion

    var contentHTML = "<div id='content'>" +
        "<h4>Point Details</h4>" +
        "<label> Launch site?</label>" +
        "<input type='checkbox' checked='checked' style='margin-left: 10px'/>" +
        "<br>" +
        "<label> Label: </label>" +
        "<input type='text' style='margin-left: 10px'/>" +
        "<br>" +
        "<button onclick='alert()'>Submit</button>" +
        "</div>";

    var infowindow = new google.maps.InfoWindow({
        content: contentHTML
    });

    function saveData() {
        alert();
    }

    function addMarkerListener(marker, id) {
        marker.addListener('click', function() {
            infowindow.open($scope.map, marker);
        });
    }

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