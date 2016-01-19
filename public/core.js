var pbWeb = angular.module('pbWeb', []);

function mainController($scope, $http) {
    $scope.test = "blah";

    $http.get('/api/points')
        .success(function(data) {
            $scope.points = data;
            console.log(data);
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
    }
}