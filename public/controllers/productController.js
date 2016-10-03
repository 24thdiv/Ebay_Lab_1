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

        var id = window.product_id;
        console.log("Product ID is: "+id);

        $http({
            method : "POST",
            url : '/getProductDetails',
            data : {
                "product_id" : id
            }

        }).success(function(data) {

            if (data.statusCode == 401) {

                alert("Plase Try after some time.");

            }
            else if(data.statusCode==201)
            {

            }
            else {
                console.log("Result");
                console.log(data.data);
               // console.log("Quantity "+$scope.quantity);
                $scope.itemDetail = data.data;
                $scope.item = data.data;
                var items = data.data
                $scope.quantity = items[0].quantity;
                $scope.price = items[0].price;
                $scope.req_quantity = 1;
            }

        }).error(function(error) {
            console.log(error);
        });
    }

    $scope.buyItem = function () {

        var quantity =  $scope.quantity;
        var price = $scope.price;
        console.log("Scope is :: ");
        console.log($scope);
        console.log("scope ends");
        console.log("Quantity :: " + $scope.quantity);
        console.log("Quantity "+quantity);

    }

    $scope.addtoShoppingCart = function () {

        $scope.quantity_error = false;
        var product_id =window.product_id;
        var quantity = $scope.quantity;
        var price = $scope.price;
        var item = $scope.item;
        var req_quantity = $scope.req_quantity;
        console.log("req_quantity "+ req_quantity);
        console.log("get shopping cart controller")
        if(req_quantity>quantity || req_quantity==undefined || req_quantity=="0") {
            $scope.quantity_error = true;
            return;
        }
        else{




            console.log("in http call shopping cart controller");
            console.log("product_id" + product_id);
            $http({
                method: "POST",
                url: '/addtoShoppingCart',
                data: {

                    "item": item,
                    "req_quantity" : req_quantity
                }

            }).success(function (data) {

                if (data.statusCode == 401) {

                    alert("Plase Try after some time.");

                }
                else {

                    console.log("after getting page in success");
                    window.location.href = '/getShoppingCart';

                }

            }).error(function (error) {
                console.log(error);
            });


        }
    }


    $scope.loadShoppingCart = function () {

        console.log("Load shopping cart controller");
        $scope.cartempty = false;

        $http({
            method: "GET",
            url: '/loadShoppingCart'

        }).success(function (data) {

            if (data.statusCode == 401) {

                alert("Plase Try after some time.");

            }
            else if(data.statusCode==201) {

                console.log("Cart is empty");
                $scope.cartfull = false;
                $scope.cartempty = true;
            }
            else{
                console.log("data");
                console.log(data.data);
                $scope.cartempty = false;
                $scope.cartfull = true;
                var grandtotal =0;

                for(i=0;i<data.data.length;i++){

                    data.data[i].total = Number(data.data[i].rq) * Number(data.data[i].price);
                    grandtotal = grandtotal + data.data[i].total;
                }
                $scope.grandTotal = grandtotal;
                $scope.cartItems = data.data;

            }

        }).error(function (error) {
            console.log(error);
        });


    }



    $scope.updateQuantity = function (index) {

        $scope.invalid_quantity = false;
        console.log("In update controller");
        console.log("Index "+index);
        var quantity = this.quantity;
        console.log(quantity);
        var validate = true;
        if(quantity>$scope.cartItems[index].tq){
            var name = $scope.cartItems[index].product_name;
            alert("Product "+name+" does not have enough quantity ");
            validate = false;
        }


        if(quantity>=0 && validate==true) {

            $http({
                method: "POST",
                url: '/updateShoppingCart',
                data: {

                    "product_id": $scope.cartItems[index].product_id,
                    "quantity" : quantity
                }

            }).success(function (data) {

                if (data.statusCode == 401) {

                    alert("Plase Try after some time.");

                }
                else {


                    console.log("cart updated");
                    $scope.cartItems[index].rq = quantity;
                    console.log("updted re  " + $scope.cartItems[index].rq);
                    var grandtotal = 0;

                    $scope.cartItems[index].total = Number($scope.cartItems[index].rq) * Number($scope.cartItems[index].price);

                    for (i = 0; i < $scope.cartItems.length; i++) {

                        grandtotal = grandtotal + $scope.cartItems[i].total;
                    }

                    console.log("Grnad total " + grandtotal);
                    $scope.grandTotal = grandtotal;


                    console.log($scope.cartItems[index]);

                }

            }).error(function (error) {
                console.log(error);
            });




        }
        else{

            alert("Please Enter valid Quantity");

        }
    }


});