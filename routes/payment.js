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

        var query = "select P.*, U.first_name,U.last_name from product_details as P, user_details as U  where product_id = "+product_id+" and P.seller_user_id=U.user_id ";
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

        var query = "select C.product_id, P.*, U.first_name,U.last_name, C.quantity as req_quantity, C.user_id from cart as C, product_details as P, user_details as U where C.user_id="+req.session.user_id+" and C.product_id=P.product_id and P.seller_user_id=U.user_id;";

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

function confirmOrder(req,res) {

        var product = req.param("product");
        var buy = req.param("buy");
        var grandtotal = req.param("grandtotal");
        console.log("-------------------Products------------------------ ");
        console.log(product);
        console.log("-------------------Products------------------------ ");
        console.log("Buy is "+buy);

        var query1 = "insert into order_master (buyer_id,total_price) values ("+req.session.user_id+","+grandtotal+")";
        console.log("Query is "+query1);

        mysql.fetchData(function (err,result1) {

            if(err){

                console.log(err);
                var json = {"statusCode":401};
                res.send(json);

            }
            else{

                var orderId = result1.insertId;

                var orderDetails = [];
                var productDetails = [];
                for(var i=0;i<product.length;i++){

                    var product_id = product[i].product_id;
                    var req_quantity = product[i].req_quantity;
                    var total = product[i].total;
                    var isAuction = product[i].isAuction;
                    var buyer_id = req.session.user_id;
                    var seller_id = product[i].seller_user_id;
                    var orderObj = [orderId,product_id,req_quantity,total,isAuction,buyer_id,seller_id];
                    orderDetails[i] = orderObj;

                    var productName = product[i].product_name;
                    var price = product[i].price;
                    var quantity = product[i].quantity;
                    var details = product[i].details;
                    var auction_startdate = product[i].auction_startdate;
                    var auction_enddate = product[i].aunction_enddate;
                    var bid_user_id = product[i].bid_user_id;
                    var bid_price = product[i].bid_price;
                    var created_date = new Date(product[i].created_date);
                  /*  var year = created_date.getFullYear();
                    var month = created_date.getMonth();
                    var day= created_date.getDay();
                    var hour = created_date.getHours();
                    var minute = created_date.getMinutes();
                    var newdate = new Date(year,month,day,hour,minute,0,0);
*/
                    var newcreateddate = fecha.format(created_date, 'YYYY-MM-DD HH:mm:ss');



                    var productObj = [product_id,productName,price,req_quantity,details,seller_id,isAuction,auction_startdate,auction_enddate,bid_user_id,bid_price,newcreateddate];
                    productDetails[i] = productObj;
                }

                console.log("---------------------orderDetails----------------------");
                console.log(orderDetails);
                console.log("---------------------proDetails----------------------");
                console.log(productDetails);
                console.log("---------------------endDetails----------------------");

                var query2 = "INSERT INTO order_details (order_id, product_id,quantity,total,isAuction,buyer_id,seller_id) VALUES ?";

                mysql.storeData(function (err,result2) {

                    if(err){
                        console.log(err);
                        var json = {"statusCode":401};
                        res.send(json);
                    }
                    else{

                        var query3 = "insert into product_details (product_id,product_name,price,quantity,details,seller_user_id,isAuction,auction_startdate,auction_enddate,bid_user_id,bid_price,created_date) values ? on duplicate key update quantity = quantity - values(quantity)";

                        mysql.storeData(function (err,result3) {

                            if(err){

                                console.log(err);
                                var json = {"statusCode":401};
                                res.send(json);

                            }
                            else{

                                if(buy=='no') {

                                    var query4 = "delete from cart where user_id="+req.session.user_id;
                                    console.log("Query4 is "+query4);

                                    mysql.fetchData(function (err,result4) {

                                        if(err){
                                            console.log(err);
                                            var json = {"statusCode":401};
                                            res.send(json);

                                        }else{
                                            console.log("ALL SUCCESSFULLY COMPLETED");
                                            var json = {"statusCode":200};
                                            res.send(json);
                                        }
                                    },query4);
                                }
                                else{
                                    console.log("ALL SUCCESSFULLY COMPLETED");
                                    var json = {"statusCode":200};
                                    res.send(json);
                                }
                            }

                        },query3,[productDetails]);
                    }

                },query2,[orderDetails]);
            }

        },query1);



}




exports.confirmOrder= confirmOrder;
exports.getpaymentPage = getpaymentPage;
exports.loadPaymentPage = loadPaymentPage;