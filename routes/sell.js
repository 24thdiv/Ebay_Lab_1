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

                if(result.length>0) {
                    var json = {"statusCode": 200, "data": result};
                    console.log(result);
                    res.send(json);
                }
                else{

                    var json = {"statusCode": 201};
                    console.log(result);
                    res.send(json);
                }
            }

        },query);

}

exports.sellItem = sellItem;
exports.getSellItems = getSellItems;