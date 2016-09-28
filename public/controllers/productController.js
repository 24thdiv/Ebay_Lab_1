/**
 * Created by Divya Patel on 9/28/2016.
 */


var product = angular.module('product', ['ngMessages']);

product.controller('product', function($scope, $http) {

    $scope.getAllItems = function () {

        $http({
            method : "POST",
            url : '/getAllItems'

        }).success(function(data) {

            if (data.statusCode == 401) {


            }
            else if(data.statusCode==201)
            {

            }
            else {
                console.log("Result");
                console.log(data.data);
                $scope.allItems = data.data;
            }

        }).error(function(error) {
            console.log(error);
        });

    }
    
    $scope.productDetails = function () {

        var id = $scope.productId;
        console.log("Product ID is: "+id);


    }

});