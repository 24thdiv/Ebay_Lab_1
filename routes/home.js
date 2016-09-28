/**
 * Created by Divya Patel on 9/19/2016.
 */

var ejs = require("ejs");

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

exports.homepage = homepage;