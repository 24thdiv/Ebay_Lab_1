
var signIn = angular.module('signIn', ['ngMessages']);

signIn.controller('signInController', function($scope, $http) {

        init();


	$scope.checklogin = function(){

		 $scope.email_invalid = false;
		 $scope.password_invalid = false;


		var email = $scope.emailId;
		var password = $scope.password;

		console.log("email " + email);
		console.log("password "+ password);

        if(email==undefined || password==undefined){


        	if (email==undefined)
            	$scope.email_invalid = true;

        	if(password==undefined)
        		$scope.password_invalid = true;

		}
		else{


			$http({
				method : "POST",
				url : '/checklogin',
				data : {
					"email" : email,
					"password" : password
				}
			}).success(function(data) {
			//checking the response data for statusCode
				if (data.statusCode == 401) {
					$scope.invalid_login = true;
					
				}
				else
				{
					console.log("-------------data------");
					console.log(data.data);
					console.log("--------------data-----");
					window.location.href = '/';

				}
				//Making a get call to the '/redirectToHomepage' API
				//window.location.assign("/homepage"); 
			}).error(function(error) {
				console.log(error);
			});


		}

	}


    $scope.register = function () {

        init();

        var email_reg = $scope.email_reg;
        var email_reg_con = $scope.email_reg_con;
        var password_reg = $scope.password_reg;
        var fname = $scope.fname;
        var lname = $scope.lname;
        var phone = $scope.phone;
        var address= $scope.address;
        var city = $scope.city;
        var state = $scope.state;
        var pin = $scope.pin;

        var validate = true;

        if(email_reg==undefined){
            $scope.email_reg_invalid = true;
            validate = false;
        }

        if(email_reg_con==undefined){
            $scope.email_con_invalid = true;
            validate = false;
        }

        if(password_reg==undefined){
            $scope.password_reg_invalid = true;
            validate = false;
        }

        if(fname==undefined){
            $scope.fname_invalid = true;
            validate = false;
        }

        if(lname==undefined){
            $scope.lname_invalid = true;
            validate = false;
        }

        if(phone==undefined){
            $scope.phone_invalid = true;
            validate = false;
        }

        if(address==undefined){
            $scope.address_invalid = true;
            validate = false;
        }


        if(city==undefined){
            $scope.city_invalid = true;
            validate = false;
        }


        if(state==undefined){
            $scope.state_invalid = true;
            validate = false;
        }


        if(pin==undefined){
            $scope.pin_invalid = true;
            validate = false;
        }

        if(validate==false){
            return;
        }

        if(!(email_reg==email_reg_con)){

            $scope.email_match_invalid = true;
            validate = false;
        }


        var phoneno = /^\d{10}$/;
        if((phone.match(phoneno)))
        {

        }
        else
        {
            $scope.phone_num_invalid = true;
            validate = false;
        }

        var pinval = /^\d{5}$/;
        if((pin.match(pinval)))
        {

        }
        else
        {
            $scope.pin_wrong = true;
            validate = false;
        }

        if(validate){

            console.log("All validation completed");
            $http({
                method : "POST",
                url : '/register',
                data : {
                    "email" : email_reg,
                    "password" : password_reg,
                    "fname" : fname,
                    "lname" : lname,
                    "phone" : phone,
                    "address" : address,
                    "city": city,
                    "state": state,
                    "pin" : pin
                }
            }).success(function(data) {
                //checking the response data for statusCode
                if (data.statusCode == 401) {
                        
                        $scope.email_already = true;
                    
                }
                else
                {
                    console.log("-------------data------");
                    console.log(data.data);
                    console.log("--------------data-----");
                    window.location.href = '/';

                }
                //Making a get call to the '/redirectToHomepage' API
                //window.location.assign("/homepage");
            }).error(function(error) {
                console.log(error);
            });




        }








    }
    


    function init() {
        $scope.invalid_login = false;
        $scope.phone_invalid = false;
        $scope.phone_num_invalid = false;
        $scope.lname_invalid = false;
        $scope.fname_invalid = false;
        $scope.password_reg_invalid = false;
        $scope.email_con_invalid = false;
        $scope.email_match_invalid = false;
        $scope.email_reg_invalid = false;
        $scope.email_already = false;
        $scope.address_invalid = false;
        $scope.city_invalid = false;
        $scope.state_invalid = false;
        $scope.pin_invalid = false;
        $scope.pin_wrong = false;
    }





});