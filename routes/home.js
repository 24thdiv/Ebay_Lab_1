/**
 * Created by Divya Patel on 9/19/2016.
 */

var mysql = require('./mysql.js');
var ejs = require('ejs');
var fecha = require('fecha');
function homepage(req,res){

        var data = {
            "user_id" : req.session.user_id,
            "email" : req.session.email,
            "fname" : req.session.fname,
            "lld"   : req.session.lld
        }

        ejs.renderFile('./views/home.ejs',data, function (err, result) {

            if (err)
                res.send("An error occured to get home page");
            else
                console.log('getting home page');
            res.end(result);


        });

}


function getAllItems(req,res) {


    var query = "select * from product_details where isAuction='No' and quantity>0";
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

function getProductDetails(req,res) {

    var product_id = req.query.id;
    console.log("Product ID "+ product_id);


    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "product_id" : product_id
    }

    ejs.renderFile('./views/productPage.ejs',data, function (err, result) {

        if (err)
            res.send("An error occured to product page page");
        else
            console.log('getting product page');
        res.end(result);


    });


}




exports.homepage = homepage;
exports.getAllItems = getAllItems;
exports.getProductDetails = getProductDetails;