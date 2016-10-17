/**
 * Created by Divya Patel on 10/16/2016.
 */
var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('Unit Test', function(){
    
    it('Check Login', function(done) {
        request.post(
            'http://localhost:3000/checklogin',
            { form: { email: 'dev@gmail.com',password:'123456' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });


    it('Check Login Invalid', function(done) {
        request.post(
            'http://localhost:3000/checklogin',
            { form: { email: 'dev@gmail.com',password:'12356' } },
            function (error, response, body) {
                assert.equal(401, response.statusCode);
                done();
            }
        );
    });




    it('Order', function(done) {
        request.post(
            'http://localhost:3000/loadOrder',
            { form: { order: 4} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });


    it('Order Invalid', function(done) {
        request.post(
            'http://localhost:3000/loadOrder',
            { form: { order: 100} },
            function (error, response, body) {
                assert.equal(201, response.statusCode);
                done();
            }
        );
    });


    it('Product Details', function(done) {
        request.post(
            'http://localhost:3000/getProductDetails',
            { form: { product_id: 4} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });



    it('Product Details Invalid', function(done) {
        request.post(
            'http://localhost:3000/getProductDetails',
            { form: { product_id: 3000} },
            function (error, response, body) {
                assert.equal(201, response.statusCode);
                done();
            }
        );
    });


 
    it('All Items', function(done) {
        request.post(
            'http://localhost:3000/getAllItems',
            { form: { } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });



    it('User Handle', function(done) {
        request.post(
            'http://localhost:3000/loaduserPage',
            { form: { handle: 'DevShah'} },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });


   it('User Handle Invalid', function(done) {
        request.post(
            'http://localhost:3000/loaduserPage',
            { form: { handle: 'Hash-sXjC'} },
            function (error, response, body) {
                assert.equal(201, response.statusCode);
                done();
            }
        );
    });






});