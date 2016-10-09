/**
 * Created by Divya Patel on 9/26/2016.
 */

var mySell = angular.module('mySellList', ['ngMessages']);

mySell.controller('mySellList', function($scope, $http){

    $scope.sellItem = function () {

        window.location.href = '/sellItemPage';

    }

    $scope.addItemtoSell = function () {

        init();

        var pro_name = $scope.pro_name;
        var pro_desc = $scope.pro_desc;
        console.log($scope);
        var price = $scope.price;
        var isAuction = $scope.isAuction;
        var check = true;
        console.log("Is Auction is ");
        console.log(isAuction);
        var quantity;
        if(isAuction=='Yes')
            quantity='1';
        else
            quantity = document.getElementById("qua").value;

        console.log("Quantity "+quantity);


        if(pro_name==undefined){
            check = false;
            $scope.name_invalid = true;
        }

        if(pro_desc==undefined){
            check = false;
            $scope.desc_invalid = true;
        }

        if(quantity==undefined || quantity=='0'){
            check = false;
            $scope.quantity_invalid = true;
        }

        if(price==undefined || price=='0'){
            check = false;
            $scope.price_invalid = true;
        }

        if(isAuction==undefined){
            check = false;
            $scope.auction_invalid = true;
        }

        if(check==false)
            return;

        var qun = /^\d{1,10}$/;
        if((quantity.match(qun)))
        {}
        else
        {
            $scope.qun_wrong = true;
            check = false;
        }

        var pri = /^\d{1,10}$/;
        if((price.match(pri)))
        {}
        else
        {
            $scope.price_wrong = true;
            check = false;
        }

        if(check){

            $http({
                method : "POST",
                url : '/sellItem',
                data : {
                    "pro_name": pro_name,
                    "pro_desc": pro_desc,
                    "quantity" : quantity,
                    "price" : price,
                    "isAuction" : isAuction
                }
            }).success(function(data) {

                if (data.statusCode == 401) {

                    $scope.fail_model = true;

                }
                else
                {
                    $scope.success_model = true;
                }

            }).error(function(error) {
                console.log(error);
            });




        }

    }


    $scope.loadSellItems  = function () {

        init();
        console.log("In Load Sell Items controller method");

        $http({
            method : "POST",
            url : '/getSellItems'
           
        }).success(function(data) {

            if (data.statusCode == 401) {


            }
            else if(data.statusCode==201)
            {

            }
            else {
                console.log("Result");
                console.log(data.data);
                $scope.sellItems = data.data;
                $scope.solditems = data.datasold;
            }

        }).error(function(error) {
            console.log(error);
        });



    }

    $scope.searchItems = function () {


        var search = $scope.searchstring;
        console.log("Serach string is "+search);

        if(search==undefined)
            console.log("undefined");
        else if(search=='')
            console.log("space");
        else{

            if(search.match(/[^\w\s]/)){
                console.log("invalid");
            }
            else{
                console.log("valid");

                window.location.href='/getsearchpage?search='+search

            }
        }


    }

    function init() {

        $scope.name_invalid = false;
        $scope.desc_invalid= false;
        $scope.price_invalid = false;
        $scope.quantity_invalid = false;
        $scope.auction_invalid = false;
        $scope.qun_wrong = false;
        $scope.price_wrong = false;
        $scope.success_model = false;
        $scope.fail_model = false;
    }







});