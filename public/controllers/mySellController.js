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
        var quantity = $scope.quantity;
        var price = $scope.price;
        var isAuction = $scope.isAuction;
        var check = true;

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


    }


    function init() {

        $scope.name_invalid = false;
        $scope.desc_invalid= false;
        $scope.price_invalid = false;
        $scope.quantity_invalid = false;
        $scope.auction_invalid = false;
        $scope.qun_wrong = false;
        $scope.price_wrong = false;
    }


});