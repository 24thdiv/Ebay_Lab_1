/**
 * Created by Divya Patel on 9/23/2016.
 */

var account = angular.module('accoutMan', ['ngMessages']);

account.controller('accoutMan', function($scope, $http){

    $scope.loadData = function () {

        init();
        console.log("In controller")

        $http({
            method : "POST",
            url : '/getAccountDetails'

        }).success(function(data) {
            //checking the response data for statusCode
           console.log("Suuces");


            console.log(data);
            console.log("-------------------------------")
            console.log(data.result[0].country);
            console.log("-------------------------------")

            $scope.first_name = data.result[0].first_name;
            $scope.last_name = data.result[0].last_name;

            $scope.address = data.result[0].address;
            $scope.city = data.result[0].city;
            $scope.state = data.result[0].state;
            if(data.result[0].country!='undefined')
                $scope.country = data.result[0].country;
            $scope.mobile_no = data.result[0].mobile_no;
            $scope.ccnumber = data.result[0].ccnumber;
            if(data.result[0].birthdate!=null)
                $scope.birthdate =new Date(data.result[0].birthdate);
            $scope.ccv = data.result[0].ccv;
            $scope.pin_code = data.result[0].pin_code;
            if(data.result[0].exp_date!=null)
                $scope.exp_date = new Date(data.result[0].exp_date);


            /*var exp_date = data.result[0].exp_date;
            //var date = new Date(exp_date.getFullYear, exp_date.getMonth(),exp_date.getData());
            $scope.exp_date = data.result[0].exp_date;
*/
        }).error(function(error) {
            console.log("Error");
            console.log(error.message);
        });


    }



    $scope.changeAccountDetails = function () {

        console.log("In controller");
        init();

        var validate = true;
        
        if($scope.first_name==undefined){
            validate = false;
            $scope.first_invalid = true;
        }

        if($scope.last_name==undefined){
            validate = false;
            $scope.last_invalid = true;
        }

        if($scope.address==undefined){
            validate = false;
            $scope.address_invalid = true;
        }

        if($scope.city==undefined){
            validate = false;
            $scope.city_invalid = true;
        }

        if($scope.state==undefined){
            validate = false;
            $scope.state_invalid = true;
        }

        if($scope.pin_code==undefined){
            validate = false;
            $scope.pin_invalid = true;
        }
        
        if($scope.mobile_no==undefined){
            validate = false;
            $scope.phone_invalid = true;
        }
        
        if($scope.ccnumber==undefined){
            validate = false;
            $scope.ccnumber_invalid = true;
        }

        if($scope.exp_date==undefined){
            validate = false;
            $scope.expdate_invalid = true;
        }

        if($scope.ccv==undefined){
            validate = false;
            $scope.ccv_invalid = true;
        }

        if($scope.birthdate==undefined){
            validate = false;
            $scope.bdate_invalid = true;
        }

        if(validate==false){
            return;
        }


        var phoneno = /^\d{10}$/;
        if(($scope.mobile_no.match(phoneno)))
        {}
        else
        {
            $scope.phone_wrong = true;
            validate = false;
        }

        var pin_val = /^\d{5}$/;
        if(($scope.pin_code.match(pin_val)))
        {}
        else
        {
            $scope.pin_wrong = true;
            validate = false;
        }


        var cc_val = /^\d{16}$/;
        if(($scope.ccnumber.match(cc_val)))
        {}
        else
        {
            $scope.ccnumber_wrong = true;
            validate = false;
        }

        var ccv_val = /^\d{3}$/;
        if(($scope.ccv.match(ccv_val)))
        {}
        else
        {
            $scope.ccv_wrong = true;
            validate = false;
        }

        var today = new Date();

        if($scope.exp_date>today){

        }
        else{
            validate = false;
            $scope.expdate_wrong=true;
        }

        if(validate){

            $http({
                method : "POST",
                url : '/changeAccountDetails',
                data : {
                    "fname" : $scope.first_name,
                    "lname" : $scope.last_name,
                    "address" : $scope.address,
                    "city" : $scope.city,
                    "state" : $scope.state,
                    "country" : $scope.country,
                    "pin": $scope.pin_code,
                    "bdate": $scope.birthdate,
                    "phone" : $scope.mobile_no,
                    "ccnumber" : $scope.ccnumber,
                    "expdate" : $scope.exp_date,
                    "ccv" : $scope.ccv
                }
            }).success(function(data) {
                //checking the response data for statusCode
                if (data.statusCode == 401) {
                    console.log("status code 401");
                    $scope.fail_model = true;
                }
                else
                {
                    console.log("statuscode 200");
                    $scope.success_model = true;

                }
                }).error(function(error) {
                console.log(error);
            });




        }



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


    $scope.loaduserInfo = function () {

        var handle = window.handle;
        $scope.handle = handle;
        console.log("Handle "+handle);

        $http({
            method : "POST",
            url : '/loaduserPage',
            data : {

                "handle": handle
            }
        }).success(function(data) {

            if (data.statusCode == 401) {

                console.log("error");

            }
            else
            {

                var items =data.data;
                var loginhandle= data.loginhandle;
                $scope.items = items;
                $scope.loginhandle = loginhandle;
                if(handle==loginhandle){
                    $scope.hidebutton = true;
                }
                else{
                    $scope.hidebutton = false;
                }


            }
        }).error(function(error) {
            console.log(error);
        });



    }



    function init(){

        $scope.ccv_invalid = false;
        $scope.ccv_wrong = false;
        $scope.expdate_invalid = false;
        $scope.expdate_wrong = false;
        $scope.ccnumber_invalid= false;
        $scope.ccnumber_wrong = false;
        $scope.phone_invalid =false;
        $scope.phone_wrong = false;
        $scope.pin_invalid =false;
        $scope.pin_wrong = false;
        $scope.city_invalid = false;
        $scope.state_invalid = false;
        $scope.address_invalid =false;
        $scope.last_invalid= false;
        $scope.first_invalid = false;
        $scope.bdate_invalid = false;
        $scope.fail_model=false;
        $scope.success_model =false;

    }


});

