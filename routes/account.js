/**
 * Created by Divya Patel on 9/20/2016.
 */
var mysql = require('./mysql.js');
var ejs = require('ejs');
var fecha = require('fecha');

function showAccount (req,res) {

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "loginhandle":req.session.handle
    }

    ejs.renderFile('./views/account.ejs',data, function (err,result) {

        if(err)
            res.send("An error occurred to get account page");
        else
            console.log('getting account in page');
        res.end(result);

    });

}

function mySellItems(req,res) {

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "loginhandle":req.session.handle
    }
    ejs.renderFile('./views/mySellList.ejs',data, function (err,result) {

        if(err)
            res.send("An error occurred to get myselllist page");
        else
            console.log('getting mysellList in page');
        res.end(result);

    });
}


function getAccountDetails(req,res) {

        var user_id = req.session.user_id;
        console.log("user_id "+ user_id);

        var query = "select * from user_details where user_id="+user_id;
        console.log("Query is : "+query);
        mysql.fetchData(function (err,result) {

            if(err){
                console.log(err);
                throw err;
            }
            else{

                if(result.length>0){
                    var json =  JSON.stringify(result);
                    var json_response = {"statusCoe" : 200, "result" : result};
                    console.log("User_details-----------------------");
                    console.log(json_response);
                    res.send(json_response);
                }
                else{
                    console.log("No user_details found for user_id "+user_id);
                    var json_response = {"statusCode" : 401};
                    res.send(json_response);
                }

            }


        },query);

}


function changeAccountDetails(req,res) {

    var fname = req.param("fname");
    var lname = req.param("lname");
    var address = req.param("address");
    var city = req.param("city");
    var state = req.param("state");
    var country = req.param("country");
    var pin = req.param("pin");
    var bdate = new Date(req.param("bdate"));
    var ccn = req.param("ccnumber");
    var expdate = new Date(req.param("expdate"));
    var ccv = req.param("ccv");
    var phone = req.param("phone");
    var user_id = req.session.user_id;

    console.log("=============================")
    console.log(bdate);
    console.log(expdate)
    /*var year = bdate.getFullYear();
    var month = bdate.getMonth();
    var day = bdate.getDay();*/
    

    var newbdate = fecha.format(bdate, 'YYYY-MM-DD HH:mm:ss');
    var newexpdate = fecha.format(expdate, 'YYYY-MM-DD HH:mm:ss');


    console.log("new birthdate");
    console.log(newbdate);
    console.log(newexpdate);

    var query = "update user_details set first_name='"+fname+"',last_name='"+lname+"',address='"+address+"',city='"+city+"',state='"+state+"',country='"+country+"',pin_code='"+pin+"',mobile_no='"+phone+"',ccnumber='"+ccn+"',ccv='"+ccv+"',birthdate='"+newbdate+"',exp_date='"+newexpdate+"',updated_date=sysdate() where user_id="+user_id;
    console.log("Query is "+query);

    mysql.fetchData(function (err,result) {

        if(err){
            console.log(err);
            var json_res = {"statusCode" : 401};
            res.send(json_res);
        }
        else{

            var json_res = {"statusCode": 200};
            res.send(json_res);

        }

    },query)
}


function getSellItemPage(req,res) {

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "loginhandle":req.session.handle
    }

    ejs.renderFile('./views/SellItem.ejs',data, function (err,result) {

        if(err)
            res.send("An error occurred to get sell Item page");
        else
            console.log('getting sell Item in page');
        res.end(result);

    });




}

function getuserInfo(req,res) {

    var handle = req.params.username;
    console.log("Handle is "+handle);

    var data = {
        "user_id" : req.session.user_id,
        "email" : req.session.email,
        "fname" : req.session.fname,
        "lld"   : req.session.lld,
        "handle": handle,
        "loginhandle":req.session.handle
    }

    ejs.renderFile('./views/userInfo.ejs',data, function (err,result) {

        if(err)
            res.send("An error occurred to get sell Item page");
        else
            console.log('getting sell Item in page');
        res.end(result);

    });


}

function loaduserPage(req,res) {


    var handle = req.param("handle");
    console.log("Handle is "+handle);

    var loginhandle = req.session.handle;
    var query="select P.* from product_details as P, user_details as U where P.quantity>0 and U.handle='"+handle+"' and P.seller_user_id=U.user_id";
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
            var json = {"statusCode": 200, "data":result, "loginhandle":loginhandle};
            res.send(json);
        }
        else{

            console.log("result");
            console.log(result);
            var json = {"statusCode":201,"loginhandle":loginhandle};
            res.send(json);
        }

    },query);


}

exports.loaduserPage=loaduserPage;
exports.getuserInfo= getuserInfo;
exports.showAccount = showAccount;
exports.mySellItems = mySellItems;
exports.getAccountDetails = getAccountDetails;
exports.changeAccountDetails = changeAccountDetails;
exports.getSellItemPage=getSellItemPage;