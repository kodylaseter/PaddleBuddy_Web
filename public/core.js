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

    var lineCoords = [

    ];

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);



    $scope.map.addListener('rightclick', function(e) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        addToLine(lat, lng);
        //addPoint(lat, lng);
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
        refreshLine();
    }
    function addPoint(lat, lng) {
        var data = {lat: lat, lng: lng};
        $http.post('/api/points', data)
            .success(function(data) {
                console.log('success!!!');
            })
            .error(function(data) {
                console.log('Error: ');
            });
        console.log('add point called');
    }
    function refreshLine() {
        var flightPath = new google.maps.Polyline({
            path: lineCoords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        flightPath.setMap($scope.map);
    }


});