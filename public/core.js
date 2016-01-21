var pbWeb = angular.module('pbWeb', ['uiGmapgoogle-maps']);
    //.config(function(uiGmapGoogleMapApiProvider) {
    //    uiGmapGoogleMapApiProvider.configure({
    //        key: 'AIzaSyBIuCKiNReJwTU4frhP3ndPyvdrZt60pJU',
    //        //libraries: 'weather,geometry,visualization'
    //    });
    //});

function mainController($scope, $http) {
    $scope.test = "blah";
    $scope.map = {
        center: {
            latitude: 45,
            longitude:-73
        },
        zoom: 8
    }

    $http.get('/api/points')
        .success(function(data) {
            $scope.points = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.addPoint = function() {
        var formData = {
            lat: $scope.formDataLat,
            long: $scope.formDataLong
        };
        $http.post('/api/points', formData)
            .success(function(data) {
                $scope.formDataLat = '';
                $scope.formDataLong = '';
            })
            .error(function(data) {
                console.log('Error: ');
            });
        console.log('add point called');
    };

}