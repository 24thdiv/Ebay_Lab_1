/**
 * Created by Divya Patel on 9/28/2016.
 */


var product = angular.module('product', ['ngMessages']);

product.controller('product', function($scope, $http,$interval) {




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

                var items = data.data;
                for(var i=0;i<items.length;i++){

                    var today = new Date();
                    if(items[i].isAuction=='Yes' && new Date(items[i].auction_enddate) < today)
                        items.splice(i, 1);
                }

                $scope.allItems = items;
                console.log("After opration");
                console.log(items);


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
                console.log("-------itemDetails-----------------------------");
                console.log($scope.itemDetail);
                console.log($scope.itemDetail[0].isAuction);
                $scope.item = data.data;
                var items = data.data
                $scope.quantity = items[0].quantity;
                $scope.price = items[0].price;
                $scope.req_quantity = 1;
                console.log("Start Date is--------");
                console.log(new Date($scope.itemDetail[0].auction_startdate));
                var id = document.getElementById("timer");

                if($scope.itemDetail[0].isAuction==='Yes') {

                    //$interval(getTimeRemaining(id, new Date($scope.itemDetail[0].auction_enddate), 1000));
                    initializeClock('timer', new Date($scope.itemDetail[0].auction_enddate));

                }

            }

        }).error(function(error) {
            console.log(error);
        });
    }


    function getTimeRemaining(endtime){
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }


    function initializeClock(id, endtime){
        var clock = document.getElementById(id);
        var timeinterval = setInterval(function(){
            var t = getTimeRemaining(endtime);
            clock.innerHTML = t.days + ' days ' +
                t.hours +' hours '+
                t.minutes +' minutes ' +
                t.seconds+' seconds remaining' ;
            if(t.total<=0){
                clearInterval(timeinterval);
                window.location.href='/';
            }
        },1000);
    }


    $scope.addtoShoppingCart = function () {

        $scope.quantity_error = false;
        $scope.already = false;
        var product_id =window.product_id;
        var quantity = Number($scope.quantity);
        var price = $scope.price;
        var item = $scope.item;
        var req_quantity = Number(document.getElementById("req_quantity").value);
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
                    console.log("status code ="+data.statusCode);
                    alert("Plase Try after some time.");

                }else if(data.statusCode==201){
                    console.log("status code ="+data.statusCode);
                    $scope.already = true;

                }

                else {
                    console.log("status code ="+data.statusCode);
                    console.log("after getting page in success");
                    window.location.href = '/getShoppingCart';

                }

            }).error(function (error) {
                console.log(error);
            });


        }
    }


    $scope.makeBid = function () {

        $scope.bid_done = false;
        $scope.bid_error = false;
        var product_id =window.product_id;
     //   var new_bid_price = $scope.new_bidprice;
       var new_bid_price = document.getElementById("bid").value;
        var current_price = $scope.itemDetail[0].bid_price;
        console.log("new Bid price "+new_bid_price);
        console.log("Current bid "+current_price);
        console.log("Product id "+product_id);
        if(new_bid_price<=current_price || isNaN(new_bid_price)){
            $scope.bid_error = true;
            return;
        }

        $http({
            method: "POST",
            url: '/makeBid',
            data:{

                "product_id":product_id,
                "bid" : new_bid_price
            }

        }).success(function (data) {

            if (data.statusCode == 401) {

                alert("Plase Try after some time.");

            }
            else{

               // $scope.new_bidprice = new_bid_price;
                $scope.bid_done = true;

                $scope.itemDetail[0].bid_price = new_bid_price;

            }

        }).error(function (error) {
            console.log(error);
        });






    }


    $scope.buyItem = function () {

        $scope.quantity_error = false;
        var product_id =window.product_id;
        var quantity = Number($scope.quantity);
        var price = $scope.price;
        var item = $scope.item;
        //var req_quantity = Number($scope.req_quantity);
        var req_quantity = document.getElementById("req_quantity").value;
        console.log("req_quantity "+ req_quantity);
        console.log("availble quantity "+ quantity);
        console.log("buy item get shopping cart controller")
        if(req_quantity>quantity || req_quantity==undefined || req_quantity=="0") {
            $scope.quantity_error = true;
            return;
        }
        else{




            console.log("in http call shopping cart controller");
            console.log("product_id" + product_id);
            window.location.href='/getpaymentPage?buy=yes&itemID='+item[0].product_id+'&req='+req_quantity;



        }

    }


    $scope.removeitem = function (index) {


        var product_id = $scope.cartItems[index].product_id;

        $http({
            method: "DELETE",
            url: '/deleteItemfromcart',
            params:{

                "product_id":product_id
            }

        }).success(function (data) {

            if (data.statusCode == 401) {

                alert("Plase Try after some time.");

            }
            else{
                console.log("data");

                var grandtotal = 0;
                $scope.cartItems.splice(index, 1);
                for(i=0;i<$scope.cartItems.length;i++){


                    grandtotal = grandtotal + $scope.cartItems[i].total;
                }
                $scope.grandTotal = grandtotal;


            }

        }).error(function (error) {
            console.log(error);
        });




    }



    $scope.loadShoppingCart = function () {

        console.log("Load shopping cart controller");
        $scope.cartempty = false;
        $scope.already = false;

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
        var quantity = Number(this.quantity);
        console.log(quantity);
        var validate = true;
        if(quantity>Number($scope.cartItems[index].tq)){
            var name = $scope.cartItems[index].product_name;
            alert("Product "+name+" does not have enough quantity ");
            validate = false;

           document.getElementById("quantity-"+index).value = $scope.cartItems[index].rq;
            return;
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

            console.log("INVALID");
            document.getElementById("quantity-"+index).value = $scope.cartItems[index].rq;
           // alert("Please Enter valid Quantity");

        }
    }


    $scope.loadPaymentPage = function () {

        var buy = window.buy;
        console.log("Buy "+buy);
        if(buy=='yes') {
            var product_id = window.product_id;
            var req_quantity = window.req_quantity;
            console.log("product id " + product_id);
            console.log("req_ quantity " + req_quantity);
            var data = {

                "product_id": product_id,
                "req_quantity" : req_quantity,
                "buy" : 'yes'
            };
        }
        else{

            var data = {

                "buy" : 'no'
            };
        }

            $http({
                method: "POST",
                url: '/loadPaymentPage',
                data: data

            }).success(function (data) {

                if (data.statusCode == 401) {

                    console.log(data);
                    console.log("status code 401");
                    

                }
                else {
                    console.log('----------------------------------------------------------')
                    console.log(data.product);
                    console.log('----------------------------------------------------------')
                    console.log(data.user);
                    console.log('----------------------------------------------------------')
                    $scope.product = data.product;
                    $scope.user = data.user;

                    var grandtotal = 0;


                        for(var i=0;i<data.product.length;i++){
                            grandtotal = grandtotal + data.product[i].total;
                            console.log("GrandTotla "+grandtotal);
                        }

                    $scope.grandtotal = grandtotal;
                    //$scope.quantity = $scope.product[0].req_quantity;

                }

            }).error(function (error) {
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


    $scope.loadsearchItems = function () {


        $scope.got = false;
        $scope.ngot =false;

        var search  = window.search;
        $scope.search = search;
        console.log("Search result is "+search);

        $http({
            method: "POST",
            url: '/loadsearchpage',
            data: {

                "search":search
            }

        }).success(function (data) {

            if (data.statusCode == 401) {

                console.log(data);

                console.log("status code 401");


            }
            else if(data.statusCode==201) {

                console.log("No result found");
                $scope.ngot=true;
                $scope.got=false;

            }
            else{

                $scope.allItems = data.data;
                $scope.got = true;
                $scope.ngot = false;

            }

        }).error(function (error) {
            console.log(error);
        });




    }


    $scope.confirmOrder = function () {

        $scope.alert = false;

        var cardnumber = $scope.cardnumber;
        var expMonth = $scope.expMonth;
        var expYear = $scope.expYear;
        var cvv = $scope.cvv;
        var buy = window.buy;
        $scope.cvv_invalid='';
        $scope.number_invalid='';
        $scope.date_invalid='';
        var date = new Date();
        var currMonth = date.getMonth();
        var currYear = date.getFullYear();
        var check =false;

        if(expYear>currYear){
            check = true;
        }
        else if(expYear==currYear){
            if(expMonth>=currMonth)
                check = true;
            else
                $scope.date_invalid = "Enter Valid Dates"

        }
        else{
            $scope.date_invalid = "Enter Valid Dates"

        }

        if(!validateCardNumber(cardnumber)) {
            $scope.number_invalid = "Please Enter 16 digit Number";
        }

        if(!validateCCV(cvv)){
            $scope.cvv_invalid = "Enter 3 Digits Only";
        }

        if(check && validateCardNumber(cardnumber) && validateCCV(cvv)) {
            console.log("aLL CHECKED" + check)



            $http({
                method: "POST",
                url: '/confirmOrder',
                data: {

                    "product":$scope.product,
                    "buy" : buy,
                    "grandtotal": $scope.grandtotal
                }

            }).success(function (data) {

                if (data.statusCode == 200) {

                    console.log(data);

                    console.log("status code 200");
                    var orderId = data.data;
                    console.log("Order id "+orderId);
                    alert(orderId);
                    window.location.href="/orderDetails?orderId="+orderId;
                    
                }
                
                else{

                    console.log("status code 401");
                    $scope.alert = true;
                }

            }).error(function (error) {
                console.log(error);
            });





        }


    }



    $scope.loadOrderPage = function () {


        var order = window.order;
        console.log(" Order is "+order);

        $http({
            method: "POST",
            url: '/loadOrder',
            data: {

                "order" : order
            }

        }).success(function (data) {

            if (data.statusCode == 200) {

                console.log(data.data);
                console.log("DAta ");
                $scope.orderdetails = data.data;
                var grand =0;
                for(var i=0;i<$scope.orderdetails.length;i++){
                    grand = grand + $scope.orderdetails[i].total;
                }

                $scope.grand = grand;

            }

            else{

                console.log("Status Code 401");

            }

        }).error(function (error) {
            console.log(error);
        });



    }



    $scope.loadPurchasePage = function () {

        $scope.noitems = false;

        $http({
            method: "POST",
            url: '/loadPurchase'

        }).success(function (data) {

            if (data.statusCode == 200) {

                var orderDetails = data.order;
                console.log(orderDetails);
                $scope.orderDetails = orderDetails;

            }
            else if(data.statusCode==201){
             
                console.log("Status Code 201 no purchase history");
                $scope.noitems = true;
            
            }else{
            
                console.log("Status Code 401");
            
            }

        }).error(function (error) {
            console.log(error);
        });
        
    }



    function validateCardNumber(number) {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number))
            return false;

        return true;
    }

    function validateCCV(number) {
        var regex = new RegExp("^[0-9]{3}$");
        if (!regex.test(number))
            return false;

        return true;
    }


});