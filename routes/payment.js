/**
 * Created by Divya Patel on 10/3/2016.
 */

var mysql = require('./mysql.js');
var ejs = require('ejs');
var fecha = require('fecha');

function getpaymentPage(req,res) {



    var buy = req.param("buy");
    console.log("In getpaymentPage routes");
    console.log("Buy now "+ buy);


    if(buy=='yes'){

        var product_id = req.param("itemID");
        var req_quan = req.param("req");
        console.log("product_id "+product_id);
        console.log("req quantity "+req_quan);
        var data = {
            "user_id" : req.session.user_id,
            "email" : req.session.email,
            "fname" : req.session.fname,
            "lld"   : req.session.lld,
            "buy" : 'yes',
            "product_id" : product_id,
            "req_quantity": req_quan
        };

    }
    else {

        var data = {
            "user_id" : req.session.user_id,
            "email" : req.session.email,
            "fname" : req.session.fname,
            "lld"   : req.session.lld,
            "buy" : 'no',
            "product_id" : 1,
            "req_quantity": 1
        };

    }


    ejs.renderFile('./views/payment.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to get payment page");
        else
            console.log('getting payment page');
        res.end(result);


    });


}


function loadPaymentPage(req,res) {

    console.log("In loadpayment page");
    var buy= req.param("buy");
    console.log("buy "+buy);

    if(buy=='yes'){

        var product_id = req.param("product_id");
        var req_quantity = req.param("req_quantity");

        var query = "select P.product_id, P.product_name, P.details, P.quantity, P.price, P.seller_user_id, U.first_name,U.last_name from product_details as P, user_details as U  where product_id = "+product_id+" and P.seller_user_id=U.user_id ";
        console.log("Query is "+query);

        mysql.fetchData(function (err,result) {

            if(err){

                console.log(err);
                var json={"statusCode":401};
                res.send(json);

            }
            else{


                console.log("result");
                console.log(result);
                var seller_id = result[0].seller_user_id;
                console.log("Seller user_id "+seller_id);
                var query1 = "select * from user_details where user_id="+req.session.user_id;
                console.log("query1 "+query1);
                mysql.fetchData(function (err,result1) {

                    if(err){

                        console.log(err);
                        var json={"statusCode":401};
                        res.send(json);

                    }
                    else{

                        console.log("result1");
                        console.log(result1);
                        result[0].req_quantity = req_quantity;
                        result[0].total = Number(req_quantity)* Number(result[0].price);
                        var json = {"statusCode":200, "product":result, "user": result1};
                        res.send(json);

                    }

                },query1);





            }


        },query);

    }
    else{

        console.log("buy==no");

        var query = "select C.product_id, P.product_name, P.details, P.quantity, P.price, P.seller_user_id, U.first_name,U.last_name, C.quantity as req_quantity, C.user_id from cart as C, product_details as P, user_details as U where C.user_id="+req.session.user_id+" and C.product_id=P.product_id and P.seller_user_id=U.user_id;";

        mysql.fetchData(function (err,result) {

            if(err) {

                console.log(err);
                var json = {"statusCode": 401};
                res.send(json);
            }
            else{
                console.log("Result");
                console.log(result);
                var query1 = "select * from user_details where user_id="+req.session.user_id;
                mysql.fetchData(function (err,result1) {

                    if(err){

                        console.log(err);
                        var json = {"statusCode": 401};
                        res.send(json);
                    }
                    else{

                        console.log("result1");
                        console.log(result1);

                        for(var i=0;i<result.length;i++){
                            result[i].total = Number(result[i].req_quantity)* Number(result[i].price);

                        }
                        var json = {"statusCode":200, "product":result, "user": result1};
                        res.send(json);

                    }

                },query1);



            }

        },query);





    }


}


exports.getpaymentPage = getpaymentPage;
exports.loadPaymentPage = loadPaymentPage;