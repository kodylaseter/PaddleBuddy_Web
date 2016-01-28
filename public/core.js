var pbWeb = angular.module('pbWeb', []);
    //.config(function(uiGmapGoogleMapApiProvider) {
    //    uiGmapGoogleMapApiProvider.configure({
    //        key: 'AIzaSyBIuCKiNReJwTU4frhP3ndPyvdrZt60pJU',
    //        //libraries: 'weather,geometry,visualization'
    //    });
    //});

pbWeb.controller('MapController', function($scope, $http) {
    var initLatLng = new google.maps.LatLng(33.7550,-84.3900);
    var mapOptions = {
        zoom: 6,
        center: initLatLng
    };
    var riverPath = new google.maps.Polyline();
    var pathPoints = [];
    var lineCoords = [];
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.map.addListener('rightclick', function(e) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        addToLine(lat, lng);
    });
    $http.get('/api/points')
        .success(function(data) {
            $scope.points = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.submitData = function() {
        $http.post('/api/points', lineCoords)
            .success(function() {
                console.log('success!!!');
            })
            .error(function() {
                console.log('Error: ');
            });
    };
    function addToLine(lat, lng) {
        lineCoords.push({lat: lat, lng: lng});
        pathPoints.push(new google.maps.Circle({
            fillColor: '#0000FF',
            fillOpacity: 0.8,
            center: lineCoords[lineCoords.length - 1],
            radius: 50,
            map: $scope.map
        }));
        refreshLine();
    }
    function refreshLine() {
        riverPath.setMap(null);
        riverPath = new google.maps.Polyline({
            path: lineCoords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: $scope.map
        });
    }
    function clearPoints() {
        for (var i = 0; i < pathPoints.length; i++) {
            pathPoints[i].setMap(null);
        }
        pathPoints = [];
    }
    $scope.addPoints = function() {
        if (lineCoords.length > 0) {
            $http.post('/api/points', lineCoords)
                .success(function(data) {
                    console.log('')
                })
                .error(function() {
                    console.log('error submitted points');
                });
        } else console.log('lineCoords length < 1');
    };
    $scope.removePoint = function() {
        if (pathPoints.length > 0) {
            lineCoords.pop();
            pathPoints.pop().setMap(null);
            refreshLine();
        }
    };
    $scope.clearPoints = function() {
        lineCoords = [];
        clearPoints();
        refreshLine();
    };

});