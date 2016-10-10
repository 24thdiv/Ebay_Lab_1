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
            "req_quantity": req_quan,
            "loginhandle":req.session.handle
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
            "req_quantity": 1,
            "loginhandle":req.session.handle
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
                console.log("Order id is --------------------"+orderId);
                var orderDetails = [];
                var productDetails = [];
                for(var i=0;i<product.length;i++){

                    var product_id = product[i].product_id;
                    var req_quantity = product[i].req_quantity;
                    var total = product[i].total;
                    var isAuction = product[i].isAuction;
                    var buyer_id = req.session.user_id;
                    var seller_id = product[i].seller_user_id;
                    var orderObj = [orderId,product_id,req_quantity,total,isAuction,buyer_id,seller_id,fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss')];
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

                var query2 = "INSERT INTO order_details (order_id, product_id,quantity,total,isAuction,buyer_id,seller_id,order_date) VALUES ?";

                mysql.storeData(function (err,result2) {

                    if(err){
                        console.log(err);
                        var json = {"statusCode":401};
                        res.send(json);
                    }
                    else{

                        console.log("RESULT 2");
                        console.log(result2);
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
                                            console.log("Order id id "+orderId);
                                            var json = {"statusCode":200, "data": orderId};
                                            res.send(json);
                                        }
                                    },query4);
                                }
                                else{
                                    console.log("ALL SUCCESSFULLY COMPLETED");
                                    var json = {"statusCode":200,"data": orderId};
                                    res.send(json);
                                }
                            }

                        },query3,[productDetails]);
                    }

                },query2,[orderDetails]);
            }

        },query1);



}








function orderDetails(req,res) {


    var orderId = req.query.orderId;
    console.log("Order Id "+orderId);

/*
    var query = "SELECT * FROM ebay_db.order_details where order_id="+orderId;
    console.log("Query is "+query);
    var json={};
    mysql.fetchData(function (err,result) {

        if(err){

            console.log(err);
            json = {"statusCode":401};


        }
        else{

            json={"statusCode":200, "data":result};


        }


    },query);
*/

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "order" : orderId,
        "loginhandle":req.session.handle
    };


    ejs.renderFile('./views/OrderCompleted.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to get order page");
        else
            console.log('getting order page');
        res.end(result);


    });



}


function loadOrder(req,res) {


    var orderId = req.param("order");
    console.log("Order Id "+orderId);


     var query = "SELECT P.product_name, O.order_id, P.details, O.quantity as rq, O.total FROM product_details as P, order_details as O where order_id="+orderId+" and P.product_id=O.product_id";
     console.log("Query is "+query);
     var json={};
     mysql.fetchData(function (err,result) {

     if(err){

        console.log(err);
        json = {"statusCode":401};
         res.send(json);

     }
     else
     {

        json={"statusCode":200, "data":result};
        res.send(json);
     }


     },query);



}

function getPurchaseOrderPage(req,res) {

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "loginhandle":req.session.handle
        
    };


    ejs.renderFile('./views/purchaseOrder.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to get order page");
        else
            console.log('getting order page');
        res.end(result);


    });



}



function loadPurchase(req,res) {


    var query = "select P.product_id,P.product_name, P.details, O.order_date,O.order_id,O.buyer_id, U.first_name, U.last_name,O.quantity, O.total, O.isAuction from order_details as O,product_details as P, user_details as U where O.buyer_id="+req.session.user_id+" and O.product_id = P.product_id and O.seller_id=U.user_id order by order_id";
    console.log("Query is "+query);
    mysql.fetchData(function (err,result) {

        if(err){

            console.log(err);
            json = {"statusCode":401};
            res.send(json);
        }
        else if(result.length>0){

            var orderIdArray = [];
            for(var i=0;i<result.length;i++){
                orderIdArray.push(result[i].order_id);
            }
            console.log("Order id before");
            console.log(orderIdArray);
            var distintctOrderId = [];
            for(var x= 0; x < orderIdArray.length; x++){
                if(distintctOrderId.indexOf(orderIdArray[x]) == -1)distintctOrderId.push(orderIdArray[x]);
            }
            console.log("Order id after");
            console.log(distintctOrderId);

            var OrdersDetails = [];

            for(var i=0;i<distintctOrderId.length;i++){

                var Order = {"orderId": distintctOrderId[i], "ordertotal": 0, "orders":[]};
                var total = 0;
                for(var j=0;j<result.length;j++){

                    if(Order.orderId==result[j].order_id){
                        total = total + result[j].total;
                        Order.orders.push(result[j]);
                    }
                }
                Order.ordertotal = total;
                OrdersDetails.push(Order);
            }

            console.log("--------------------OrderDetails---------------------------");
            console.log(OrdersDetails);
            console.log("--------------------OrderDetails---------------------------");

            json = {"statusCode":200, "order": OrdersDetails};
            res.send(json);


        }
        else{

            console.log(err);
            json = {"statusCode":201};
            res.send(json);

        }


    },query);


}

function auctionjob() {

    console.log("Auction job");
    var query="select * from product_details where isAuction='Yes' and auction_enddate<sysdate() and bid_user_id!=''";
    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
        }
        else if(result.length>0){

            var query1 = "insert into order_master (buyer_id,total_price) values ("+result[0].bid_user_id+","+result[0].bid_price+")";
            console.log("Query1 is "+query1);
            mysql.fetchData(function (err,result1) {

                if(err){
                    console.log(err);
                }
                else{

                    var orderId= result1.insertId;
                    console.log("Order id is "+orderId);


                    var query3 = "insert into order_details (order_id,product_id,quantity,total,isAuction,buyer_id,seller_id,order_date) values ("+orderId+","+result[0].product_id+",1,"+result[0].bid_price+",'Yes',"+result[0].bid_user_id+","+result[0].seller_user_id+",sysdate())";
                    console.log("Query3 is "+query3);
                    mysql.fetchData(function (err,result3) {

                        if(err){
                            console.log(err);

                        }
                        else{

                            var query4 = "update product_details set quantity=0, isAuction='Sold' where product_id="+result[0].product_id;
                            console.log("Query4 is"+query4);
                            mysql.fetchData(function (err,result4) {

                                if(err){
                                    console.log(err);
                                }
                                else{

                                    console.log("ALL SUCCESSFULLY DONE IN AUCTION");
                                }

                            },query4);
                        }


                    },query3);

                }

            },query1);


        }

    },query);



}

exports.auctionjob=auctionjob;
exports.loadPurchase =loadPurchase;
exports.getPurchaseOrderPage = getPurchaseOrderPage;
exports.loadOrder=loadOrder;
exports.orderDetails= orderDetails;
exports.confirmOrder= confirmOrder;
exports.getpaymentPage = getpaymentPage;
exports.loadPaymentPage = loadPaymentPage;