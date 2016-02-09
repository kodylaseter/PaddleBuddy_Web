pbWeb.controller('mapController', function($scope, $http) {
    var initLatLng = new google.maps.LatLng(33.7550,-84.3900);
    var mapOptions = {
        zoom: 6,
        center: initLatLng
    };
    var riverPath = new google.maps.Polyline();
    var pathPoints = [];
    var lineCoords = [];

    //region Rivers
    $scope.rivers = [];
    function getRivers() {
        $http.get('/api/rivers')
            .success(function(data) {
                $scope.rivers = data;
            })
            .error(function() {
                console.log('error getting rivers');
            });

    }
    getRivers();
    $scope.addRiver = function() {
        if ($scope.riverName != '') {
            var river = {
                name: $scope.riverName
            };
            $http.post('/api/rivers', river)
                .success(function (data) {
                    getRivers();
                    $scope.riverName = '';
                })
                .error(function () {
                    console.log('error posting new river')
                });
        }
    };

    $scope.idSelectedRiver = null;
    $scope.setSelected = function (riverIndex) {
        $scope.idSelectedRiver = riverIndex;
    };

    function getSelectedRiverId() {
        return $scope.rivers[$scope.idSelectedRiver]._id;
    }

    //endregion

    //region Map
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.map.addListener('rightclick', function(e) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        addToLine(lat, lng);
    });
    //endregion

    //region Points
    $scope.addPoints = function() {
        if ($scope.idSelectedRiver != null) {
            if (lineCoords.length > 0) {
                $http.post('/api/points', lineCoords)
                    .success(function(data) {

                    })
                    .error(function() {
                        console.log('error submitting points');
                    });
            } else showToast('error', "No points added!");
        } else showToast('error', "No river selected!");

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
    //endregion

    //region Line
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