/**
 * Created by Divya Patel on 9/27/2016.
 */
var mysql = require('./mysql.js');
var ejs = require('ejs');
var fecha = require('fecha');

function sellItem(req,res) {

    var pro_name = req.param("pro_name");
    var pro_desc = req.param("pro_desc");
    var quantity = req.param("quantity");
    var price = req.param("price");
    var isAuction = req.param("isAuction");
    var user_id = req.session.user_id;
    var query;
    console.log("Is Auction is ");
    console.log(isAuction);

   if(isAuction=="No") {
       query = "insert into product_details (product_name,price,quantity,details,seller_user_id,isAuction,created_date) values ('" + pro_name + "','" + price + "','" + quantity + "','" + pro_desc + "'," + user_id + ",'" + isAuction + "',sysdate())";
       console.log("Query is "+query);
   }
   else if(isAuction=="Yes") {

       var auctionenddate = new Date(new Date().getTime()+(4*24*60*60*1000));
       var newauctionEnd = fecha.format(auctionenddate, 'YYYY-MM-DD HH:mm:ss');
       query = "insert into product_details (product_name,price,quantity,details,seller_user_id,isAuction,auction_startdate,auction_enddate,created_date) values ('" + pro_name + "','" + price + "','" + quantity + "','" + pro_desc + "'," + user_id + ",'" + isAuction + "',sysdate(),'"+newauctionEnd+"',sysdate())";
       console.log("Query is "+query);
   }

    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err)
            var json_res = {"statusCode" : 401};
            res.send(json_res);
        }
        else{

            var json_res = {"statusCode" : 200};
            res.send(json_res);

        }


    },query);


}


function getSellItems(req,res) {

        var user_id = req.session.user_id;
        var query="select * from product_details where quantity>0 and seller_user_id="+user_id;

        mysql.fetchData(function (err,result) {

            if(err){
                console.log(err);
                var json = {"statusCode":401};
                res.send(json);
            }
            else{

                    var query1 = "select P.product_id,P.product_name, P.details, O.order_date,O.order_id,O.buyer_id, U.first_name, U.last_name,O.quantity, O.total from order_details as O,product_details as P, user_details as U where O.seller_id = "+req.session.user_id+" and O.product_id = P.product_id and O.buyer_id=U.user_id and O.isAuction='No'";
                    mysql.fetchData(function (err,result1) {

                        if(err){


                        }
                        else{

                            var json = {"statusCode": 200, "data": result, "datasold": result1};
                            console.log(result);
                            res.send(json);
                        }


                    },query1);



            }

        },query);

}

exports.sellItem = sellItem;
exports.getSellItems = getSellItems;