/**
 * Created by Divya Patel on 9/19/2016.
 */
var bcrypt = require('bcryptjs');
var ejs = require("ejs");
var mysql = require('./mysql.js');
var logger = require('./log.js');
var shortid = require('shortid');


function login(req, res) {

    logger.eventlog.info(req.session.user_id+"-SignInPage-User redirected to sign in page");
    ejs.renderFile('./views/SignIn.ejs', function (err,result) {

        if(err)
            res.send("An error occured to get signIn page");
        else
            console.log('getting sign in page');
            res.end(result);

    });

}

function checklogin(req,res){

		var email = req.param("email");
		var password = req.param("password");


     /*   var salt = bcrypt.genSaltSync(10);
        var passwordToCompare = bcrypt.hashSync(password, salt);
      */
        var query ="select user_id,last_login_date, first_name,password from user_master where email = '" + email + "'";
       var q = "select * from user_master";
        console.log("Query:: " + query);

        mysql.fetchData(function(err,result){

            if(err){

                console.log(err);
                throw err;
            }
            else{

                console.log("Results-------");
                console.log(result);
                console.log("End Result---------");

                var json =  JSON.stringify(result);
                console.log(json);
                console.log("End Stirngify-------");


                if(result.length >0){
                    if(bcrypt.compareSync(password, result[0].password)) {

                        console.log("Result SignIn query");
                        console.log(result);
                        req.session.user_id = result[0].user_id;
                        req.session.email = email;
                        req.session.fname = result[0].first_name;
                        var ld = result[0].last_login_date.toString();
                        var date = ld.split('GMT');
                        console.log(date);

                        req.session.lld = date[0];

                        console.log("session user_id " + req.session.user_id);
                        console.log("session email " + req.session.email);
                        console.log("session fname " + req.session.fname);
                        console.log("session last login " + req.session.last_login_date);
                        var querylogin = "update user_master set last_login_date = sysdate() where user_id =" + result[0].user_id;
                        console.log("Query login " + querylogin);
                        mysql.fetchData(function (err, result1) {

                            if (err) {
                                console.log(err);
                                throw err;
                            }
                            else {
                                console.log("Result 1 login date--------");


                                var query2 = "select * from user_details where user_id="+req.session.user_id;
                                mysql.fetchData(function (err,result2) {

                                    if(err){

                                        console.log(err);
                                        throw  err;

                                    }
                                    else{

                                        req.session.handle = result2[0].handle;
                                        console.log("Login handle "+req.session.handle);
                                        var json_responses = {"statusCode": 200, "data": result};
                                        logger.eventlog.info(req.session.user_id+"-Login"+"-User logged in");
                                        res.send(json_responses);


                                    }

                                },query2);


                            }

                        }, querylogin);
                    }
                }
                else {
                    console.log("Invalid Login");
                    var json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }
            }
  

        },query);


        /*console.log("bcrypt password "+ passwordToSave );
        var bcr = bcrypt.compareSync("ivya", passwordToSave);
        console.log(" check password "+bcr)
*/

}


function registerUser(req,res){

    var email = req.param("email");
    var password = req.param("password");
    var fname = req.param("fname");
    var lname = req.param("lname");
    var phone = req.param("phone");
    var address = req.param("address");
    var city = req.param("city");
    var state = req.param("state");
    var pin = req.param("pin");

    var salt = bcrypt.genSaltSync(10);
    var passwordToSave = bcrypt.hashSync(password, salt);

    var query = "insert into user_master (email,password,created_date,last_login_date,first_name) values ('"+email+"','"+passwordToSave+"',sysdate(),sysdate(),'"+fname+"')";
    console.log("Query is " + query);

    mysql.fetchData(function(err,result){

        if(err){

            // already email registered
            console.log(err);
            var json_responses = {"statusCode" : 401};
            res.send(json_responses);
        }
        else{

                var id = result.insertId;
                console.log("Inserted Id " + id);
               console.log(result);
                req.session.user_id =  id;
                req.session.email = email;
                req.session.fname = fname;

                var handle = fname+"-"+shortid.generate();
                console.log("Handle is "+handle);
                var querydetails = "insert into user_details (user_id,first_name,last_name,mobile_no,created_date,updated_date,address,city,state,pin_code,handle) values ("+id+",'"+fname+"','"+lname+"','"+phone+"',sysdate(),sysdate(),'"+address+"','"+city+"','"+state+"','"+pin+"','"+handle+"')";
                 console.log("Query is " + querydetails);
                  mysql.fetchData(function (err,result1) {
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        else{
                            console.log("inserted in user details table");
                            console.log(result1);
                            logger.eventlog.info(req.session.user_id+"-Register"+"-User Registered")
                            var json_responses = {"statusCode" : 200, "data":result};
                            res.send(json_responses);


                        }


                  },querydetails);


        }


    },query);


}


function logout(req,res){

    logger.eventlog.info(req.session.user_id+"-Logout"+"-User Logout");
    req.session.destroy();
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.redirect("/");

}


exports.login = login;
exports.logout = logout;
exports.checklogin = checklogin;
exports.registerUser = registerUser;