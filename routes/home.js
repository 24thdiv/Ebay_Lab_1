/**
 * Created by Divya Patel on 9/19/2016.
 */
var logger= require('./log.js');
var mysql = require('./mysql.js');
var ejs = require('ejs');
var fecha = require('fecha');
function homepage(req,res){

        var data = {
            "user_id" : req.session.user_id,
            "email" : req.session.email,
            "fname" : req.session.fname,
            "lld"   : req.session.lld,
            "loginhandle":req.session.handle
        };

    logger.eventlog.info(req.session.user_id+"-HomePage"+"-User redirected to home page");
        ejs.renderFile('./views/home.ejs',data, function (err, result) {

            if (err)
                res.send("An error occured to get home page");
            else
                console.log('getting home page');
            res.end(result);


        });

}


function getAllItems(req,res) {


    var user_id= req.session.user_id;
    console.log("user_id "+user_id);
    if(user_id==undefined)
    {
        var query = "select * from product_details where quantity>0";
    }
    else{
        var query = "select * from product_details where quantity>0 and seller_user_id!="+user_id;
    }


    console.log("Query is "+query);

    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
           
            var json = {"statusCode": 401};
            res.send(json);
        }
        else if(result.length>0){
            console.log("All product Result");
            console.log(result);
          
            var json = {"statusCode": 200, "data":result};
            res.send(json);
        }
        else{

            console.log("result");
            console.log(result);
           
            var json = {"statusCode":201};
            res.send(json);
        }

    },query);



}

function getProductDetailsPage(req,res) {


    if(!req.session.user_id) {

        res.redirect("/signIn");
    }
    else{


        var product_id = req.query.id;
        console.log("Product ID "+ product_id);


        var data = {
            "user_id" : req.session.user_id,
            "email" : req.session.email,
            "fname" : req.session.fname,
            "lld"   : req.session.lld,
            "product_id" : product_id,
            "loginhandle":req.session.handle
        };

        logger.eventlog.info(req.session.user_id+"-ProductClick"+product_id+"-User click on product");
        ejs.renderFile('./views/productPage.ejs',data, function (err, result) {

            if (err)
                res.send("An error occured to product page page");
            else
                console.log('getting product page');
            res.end(result);


        });



    }


}

function getProductDetails(req,res) {

    var product_id = req.param("product_id");

    var query = "select * from product_details where product_id="+product_id;
    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
          
            json = {"statusCode" : 401};
            res.send(json);
        }
        else if(result.length>0){

            console.log("Product Details-----------------------------------------")
            console.log(result);
            var query1 = "select first_name,last_name,handle from user_details where user_id="+result[0].seller_user_id;
            mysql.fetchData(function (err,result1) {

                if(err){
                   
                    console.log(err);
                    json = {"statusCode" : 401};
                    res.send(json);
                }
                else{
                    console.log("Product details");
                    console.log(result1);
                    result[0].first_name = result1[0].first_name;
                    result[0].last_name = result1[0].last_name;
                    result[0].handle = result1[0].handle;
                   
                    var json = {"statusCode" : 200, "data":result};
                    res.send(json);

                }

            },query1);

        }
        else{
            console.log(result);
            
            var json = {"statusCode" : 201};
            res.send(json);
        }

    },query);
}

function addtoShoppingCart(req,res) {

    logger.eventlog.info(req.session.user_id+"-AddToCart"+"-User click on Add to cart button");
    console.log("In addto shopping cart route");
    var item = req.param("item");
    var req_quantity = req.param("req_quantity");
    console.log(" req_quantity "+req_quantity);
    console.log("Item");
    console.log(item);
    var totalPrice = Number(req_quantity)*Number(item[0].price);
    console.log("total Price "+ totalPrice);

    console.log("In routes of getshopping cart");
    var user_id = req.session.user_id;
    var query1 = "select * from cart where product_id="+item[0].product_id+" and user_id="+req.session.user_id;

    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
            var json = {"statusCode" : 401};
            res.send(json);

        }
        else if(result.length>0){
            console.log(result);
            console.log("already in cart");
            var  json = {"statusCode" : 201};
            res.send(json);


        }
        else{

            var query = "insert into cart (user_id,product_id,quantity,price) values ("+user_id+","+item[0].product_id+",'"+req_quantity+"','"+totalPrice+"')"
            console.log("Inserting product to cart");
            console.log("Query is "+query);

            mysql.fetchData(function (err,result1) {

                if(err){
                    console.log(err);
                    var json = {"statusCode" : 401};
                    res.send(json);
                }
                else{
                    console.log(result1);
                    var json = {"statusCode" : 200};
                    res.send(json);
                }

            },query);

        }


    },query1);






}


function getShoppingCart(req, res) {

    logger.eventlog.info(req.session.user_id+"-ShoppingCart"+"-User click on shopping cart");
    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "loginhandle":req.session.handle
    };
    console.log("get shopping cart routes");
    ejs.renderFile('./views/shoppingCart.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to get shopping cart page page");
        else
            console.log('getting shopping cart page');
        res.end(result);


    });


}


function loadShoppingCart(req,res) {

        console.log("Load shopping cart route");
        var query = "SELECT C.user_id, C.product_id, C.quantity as rq, P.product_name, P.details, P.price, P.quantity as tq, P.seller_user_id, U.first_name,U.last_name from cart as C, product_details as P, user_details as U where C.user_id="+req.session.user_id+" and C.product_id=P.product_id and P.seller_user_id=U.user_id";
        console.log("quert "+query);
        mysql.fetchData(function (err,result) {

            if(err){

                console.log(err);
                var json = {"statusCode":401};
                res.send(json);
            }
            else if(result.length>0){
                console.log("cart");
                console.log(result);
                var json = {"statusCode": 200, "data" : result};
                res.send(json);

            }
            else{

                console.log("empty cart");
                console.log(result);
                var json = {"statusCode":201};
                res.send(json);
            }

        },query);


}

function updateShoppingCart(req,res) {

    logger.eventlog.info(req.session.user_id+"-UpdateCart"+"-User updated quantity in cart");
    var product_id = req.param("product_id");
    var quantity = req.param("quantity");
    var user_id = req.session.user_id;

    var query = "update cart set quantity = '"+quantity+"' where product_id="+product_id+" and user_id="+user_id;

    mysql.fetchData(function (err, result) {

        if(err){
            console.log(err);
            var json = {"statusCode":401};
            res.send(json);
        }
        else{

            var json= {"statusCode": 200};
            res.send(json);

        }

    },query);

}

function deleteItemfromcart(req,res) {

    var product_id = req.param("product_id");
    logger.eventlog.info(req.session.user_id+"-DeleteFromCart"+product_id+"-User deleted item from cart");
    console.log("in delete item routs");

    console.log("Delted item id "+product_id);

    var query = "delete from cart where product_id="+product_id+" and user_id="+req.session.user_id;

    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
            var json = {"statusCode":401};
            res.send(json);

        }
        else{

            console.log(result);
            var json = {"statusCode":200};
            res.send(json);

        }

    },query);


}

function makeBid(req,res) {
    var product_id = req.param("product_id");
    logger.eventlog.info(req.session.user_id+"-MakeBid"+product_id+"-User made a bid");

    var bid = req.param("bid");
    console.log("Product_id "+product_id);
    console.log("new bid "+bid);

    var query = "UPDATE product_details SET bid_user_id="+req.session.user_id+", bid_price="+bid+" WHERE product_id="+product_id;
    console.log("query is "+query);

    mysql.fetchData(function (err,result) {

        if(err){

            console.log(err);
            var json={"statusCode": 401};
            res.send(json);

        }else{

            logger.bidlog.info(req.session.user_id+"-MakeBid-"+product_id+"-"+bid+"-User made a bid");
            var  json={"statusCode":200};
            res.send(json);

        }

    },query);


}


function getsearchpage(req,res) {

    var search = req.param("search");
    logger.eventlog.info(req.session.user_id+"-Search-"+search+"-User searched item");

    console.log("Search is "+ search);

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "search": search,
        "loginhandle":req.session.handle
    };
    console.log("get search page routes");
    ejs.renderFile('./views/searchresult.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to get search page");
        else
            console.log('getting search page');
        res.end(result);


    });


}


function loadsearchpage(req,res) {

    console.log("in load search routes");
    var search = req.param("search");
    console.log("search is"+search);

    var query ="select * from product_details where quantity>0 and seller_user_id!="+req.session.user_id+" and product_name like '%"+search+"%'";
    console.log("query is "+query);

    mysql.fetchData(function (err,result) {

        if(err){

            console.log(err);
           
            var json = {"statusCode":401};
            res.send(json);
        }
        else if(result.length>0){

            console.log("result");
            console.log(result);
           
            var json={"statusCode":200, "data":result};
            res.send(json);
        }
        else{

            console.log("result is empty");
            console.log(result);
            
            var json={"statusCode":201};
            res.send(json);

        }

    },query);

}


exports.loadsearchpage = loadsearchpage;
exports.getsearchpage = getsearchpage;
exports.makeBid = makeBid
exports.deleteItemfromcart= deleteItemfromcart;
exports.updateShoppingCart = updateShoppingCart;
exports.loadShoppingCart= loadShoppingCart;
exports.getShoppingCart = getShoppingCart;
exports.homepage = homepage;
exports.getAllItems = getAllItems;
exports.getProductDetailsPage = getProductDetailsPage;
exports.getProductDetails = getProductDetails;
exports.addtoShoppingCart = addtoShoppingCart;