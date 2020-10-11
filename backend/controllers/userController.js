const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DynamicsConnector = require("../helpers/DynamicsHelper");
const dynamics = require('../constants/constants');
const { dynamicsTenantId, dynamicsHost, dynamicsClientId, dynamicsUserName, dynamicsPassword } = dynamics
const contact_controller=require('../controllers/contactController')
const validateLogin = require('../validation/validateLogin');
const validateSignup = require('../validation/validateSignup');
const User = require('../models/userModel');
const Donation=require('../models/donationModel')
var fs = require("fs");
const stripeSecretKey="sk_test_51HFhWxCZ2gANdoRuG0arBCkt85Zc8Txy7xt1LkPvWpxQC59ULSEFTSQiFYWcH573QOsfPq04qKR0xT3mn3fCIUuH00yODaLmOl"
const Stripe = require('stripe')(stripeSecretKey);

var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt_ = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var flash = require('express-flash');

const upload = require('../fileuploader/uploader')

const { response } = require('express');
const SMTPTransport = require('nodemailer/lib/smtp-transport');


//Sign up a user
exports.users_sign_up = async (req, res) => {
    const { errors, isValid } = validateSignup(req.body);  
    if (!isValid) {
      return res.status(400).json(errors);
    }
    try {
      const user = await User.find({ email: req.body.email }).exec();
      if (user.length > 0) {
        return res.status(409).json({ error: 'Email already exists.' });
      }
      return bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        }
        var contact_id = await contact_controller.createContact(req.body.title, req.body.firstName, req.body.lastName, req.body.email, req.body.gender, req.body.phoneNumber, req.body.streetAddress, req.body.subUrb, req.body.postCode, req.body.state, req.body.purpose)
        const newUser = new User({
          createdAt: new Date().getTime(),
          email: req.body.email,
          password: hash,          
          details_id: contact_id
        });
        return newUser
          .save()
          .then((result) => {
            res.status(201).json({ result });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      });
    } catch (err) {
      return res.status(500).json({ err });
    }
  }

  //Login a user
  exports.users_login = async (req, res) => {
    const { errors, isValid } = validateLogin(req.body);
  console.log('login')
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(401).json({
          email: 'Could not find email.'
        });
      }
  
      return bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed.'
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              title: req.body.title,
              createdAt: new Date().getTime(),
              email: req.body.email,
              userId: user._id
            },
            process.env.REACT_APP_JWT_KEY || require('../constants/constants').jwtKey,
          );
          return res.status(200).json({
            message: 'Auth successful.',
            token
          });
        }
        return res.status(401).json({
          password: 'Wrong password. Try again.'
        });
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  exports.users_get_contact = async (req, res) => {
    let payload=req.decoded
    User.findOne({ _id: payload.userId },function(err,user1){
      if(err){
          return res.status(500).send({message: "database error",error:err});
      }
      if(!user1){
          return res.status(500).send({message: "user not found"}); 
      }
      const dynamicsConnector = DynamicsConnector(
        dynamicsTenantId,
        dynamicsHost,
        dynamicsClientId,
        dynamicsUserName,
        dynamicsPassword).dynamicsWebApi;
      dynamicsConnector.retrieve(user1.details_id, "contacts", [ "jobtitle",
        "firstname",
        "lastname",
        "emailaddress1",
        "gendercode",
        "mobilephone",
        "address1_line1",
        "address1_line2",
        "address1_postalcode",
        "address1_stateorprovince",
        "new_appearancecategory",
        "new_age",
        "description",]).then(function (record) {
        let record1={
          jobtitle:record.jobtitle,
          firstname:record.firstname,
          lastname: record.lastname,
          emailaddress1: record.emailaddress1,
          gendercode: record.gendercode,
          mobilephone: record.mobilephone,
          streetAddress: record.address1_line1,
          subUrb:record.address1_line2,
          postCode:record.address1_postalcode,
          state:record.address1_stateorprovince,
          purpose:record.description,
          isAdmin:user1.isAdmin,
          filename:user1.filename,
          age:record.new_age,
          appearance:record.new_appearancecategory
        }
        return res.status(200).json({ message: 'record found',record1});
      })
      .catch(function (error) {
        return res.status(500).send({message: "contact not found"}); 
      });
    });   
    
  }

  exports.forgot_password = async(req, res, next) => {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {

       console.log(req.body.email);
        User.findOne({ email: req.body.email }, function(err, user) {
          // if (!user) {
          //   return req.flash('error', 'No account with that email address exists.');
          //   //return //res.redirect('/api/users/forgotpassword');
          // }

          if(err){
            return res.status(500).send({message: "database error",error:err});
          }
          if(!user){
              return res.status(500).send({message: "user not found"}); 
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      async function main(token, user, done) {
        // var smtpTransport = nodemailer.createTransport('SMTP', {
        //   service: 'SendGrid',
        //   auth: {
        //     user: '!!! YOUR SENDGRID USERNAME !!!',
        //     pass: '!!! YOUR SENDGRID PASSWORD !!!'
        //   }
        // });
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          //host: "Gmail",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'qavitechnologies2@gmail.com', // generated ethereal user
            pass: 'Letusqavi@123', // generated ethereal password
          },
        });
        var mailOptions = await smtpTransport.sendMail({
          to: user.email,
          from: 'qavitechnologies2@gmail.com',
          subject: 'Account Recovery',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'https://' + 'reportislamophobia.com.au/#' + '/resetpassword/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        })

        return res.status(201).send({message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'})
        // smtpTransport.sendMail(mailOptions, function(err) {
        //   req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        //   done(err, 'done');
        // });

      }
    ], function(err) {
      if (err) return next(err);
      //res.redirect('/api/users/forgotpassword');
    });
  }

  exports.reset_password = async(req, res) => {
    async.waterfall([
      function(done) {
        console.log(req.params);
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            // req.flash('error', 'Password reset token is invalid or has expired.');
            // return res.redirect('back');
            return res.status(500).send({error: 'Password reset token is invalid or has expired.'})
          }

          return bcrypt.hash(req.body.password, 10, async (error, hash) => {
            if (error) {
              return res.status(500).json({ error });
            }

            user.password = hash
            

          user.save(function(err) {
              done(err, user);
          });

          });
  
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

        });
      },
      async function main(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          //host: "Gmail",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'qavitechnologies2@gmail.com', // generated ethereal user
            pass: 'Letusqavi@123', // generated ethereal password
          },
        });
        var mailOptions = await smtpTransport.sendMail({
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        })
        res.status(201).send({message: 'Success! Your password has been changed.'})
      }
    ], function(err) {
      res.redirect('/');
    });
  }

  exports.users_image_upload=async(req,res)=>{
    try{
    upload.single('profileimage')(req,res,(err)=>{
        if(req.filetypeerror){
            return res.status(500).json({ message: 'Invalid file type' });
        }
        if(err){
            return res.status(500).json({ message: err.message });
        }        
        return res.status(201).send({message: 'file uploaded',filename:req.file.filename});
    });
    } catch(e){
        return res.status(500).json({ message: 'file upload failed' });
    }
    
}
const multiSelectHandler=(input)=>{
  let result=''
  for(let i=0;i<input.length;i++){
      var temp=input[i]+100000000
      result+=temp.toString()
      if(i<input.length-1){
          result+=','
      }
  }
  return result
}
  exports.users_edit_contact = async (req, res) => {
    let payload=req.decoded
    
    User.findOne({ _id: payload.userId },function(err,user1){
      if(err){
          return res.status(500).send({message: "database error",error:err});
      }
      if(!user1){
          return res.status(500).send({message: "user not found"}); 
      }
      let image1=''
      if(req.body.filename){
        if(req.body.filename.length>4){
        fs.readFile('uploads/'+req.body.filename,  function(err, data) {
          if (err){
            return res.status(500).json({ message: 'file uplaod failed' })
          }
          image1 = new Buffer(data, 'binary').toString('base64')
          const dynamicsConnector = DynamicsConnector(
            dynamicsTenantId,
            dynamicsHost,
            dynamicsClientId,
            dynamicsUserName,
            dynamicsPassword).dynamicsWebApi;
          let updatedUser = {entityimage:image1};
          let appearance=''
          let fname=''
          let lname=''
          req.body.appearance!==undefined ? req.body.appearance.length>0 ? appearance=multiSelectHandler(req.body.appearance):null:null
          if(req.body.name){
            if(req.body.name.length>2 && req.body.name.indexOf(' ') >= 0){
              fname=req.body.name.substr(0,req.body.name.indexOf(' '));
              lname=req.body.name.substr(req.body.name.indexOf(' ')+1)
            }
            else if(req.body.name.length>2 && req.body.name.indexOf(' ') == -1){
              fname=req.body.name
            }
          }
          req.body.name?updatedUser.firstname=fname:null
          req.body.name?updatedUser.lastname=lname:null
          req.body.appearance!==undefined? req.body.appearance.length>0 ?(updatedUser.new_appearancecategory)=appearance:(updatedUser.new_appearancecategory)=null:null
          req.body.gender!==undefined? req.body.gender<=2 ? (updatedUser.gendercode)=100000000+req.body.gender:null:null
          req.body.age!==undefined? ((Number.isInteger(req.body.age)&&req.body.age>=0) || req.body.age==null) ? (updatedUser.new_age)=req.body.age:null:null
          dynamicsConnector.update(user1.details_id, "contacts",updatedUser).then(function () {
            user1.filename=req.body.filename
            user1.save((err,doc)=>{
              if(err){
                return res.status(500).send({message: "contact not found",error});
              }
              return res.status(200).json({ message: 'record updated',doc});
            })
          })
          .catch(function (error) {
            console.log(error)
            return res.status(500).send({message: "contact not found",error}); 
          });
      });
      }
    }else{
        const dynamicsConnector = DynamicsConnector(
          dynamicsTenantId,
          dynamicsHost,
          dynamicsClientId,
          dynamicsUserName,
          dynamicsPassword).dynamicsWebApi;    
        let updatedUser = {};
        let fname=''
        let lname=''
        let appearance=''
        req.body.appearance!==undefined ? req.body.appearance.length>0 ? appearance=multiSelectHandler(req.body.appearance):null:null
        if(req.body.name){
          if(req.body.name.length>2 && req.body.name.indexOf(' ') >= 0){
            fname=req.body.name.substr(0,req.body.name.indexOf(' '));
            lname=req.body.name.substr(req.body.name.indexOf(' ')+1)
          }
          else if(req.body.name.length>2 && req.body.name.indexOf(' ') == -1){
            fname=req.body.name
          }
        } 
        
        req.body.name?updatedUser.firstname=fname:null
        req.body.name?updatedUser.lastname=lname:null
        req.body.gender!==undefined? req.body.gender<=2 ? (updatedUser.gendercode)=100000000+parseInt(req.body.gender):null:null
        req.body.appearance!==undefined? req.body.appearance.length>0 ?(updatedUser.new_appearancecategory)=appearance:(updatedUser.new_appearancecategory)=null:null
        req.body.age!==undefined? ((Number.isInteger(req.body.age)&&req.body.age>=0) || req.body.age==null) ? (updatedUser.new_age)=req.body.age:null:null
        dynamicsConnector.update(user1.details_id, "contacts",updatedUser).then(function () {
          return res.status(200).json({ message: 'record updated'});
        })
        .catch(function (error) {
          console.log(error)
          return res.status(500).send({message: "contact not found",error}); 
        });
      }
    });   
    
  }
  exports.users_donate = async (req,res)=>{
    let payload=req.decoded
    if(!req.body.tokenID || !req.body.amount){
      return res.status(500).send({message: "insufficient information provided"}); 
    }
    if(typeof req.body.amount == "number" && req.body.tokenID.length>5){
      if(req.body.amount>0.50){
        User.findOne({ _id: payload.userId },async function(err,user1){
          if(err){
            return res.status(500).send({message: "database error",error:err});
          }
          let amount1 = (req.body.amount*100)
          await Stripe.customers.create({
            email:user1.email,
            source:req.body.tokenID
          }).then(async (customer)=>{
            await Stripe.charges.create({
              amount:amount1,
              source:req.body.tokenId,
              currency:'aud',
              customer:customer.id,
              receipt_email:user1.email
            }).then(async (result2)=>{
              let newDonation = new Donation({ amount:amount1,currency:"aud",user_id:user1._id });
              await newDonation.save((err,result)=>{
                if(err){
                  return res.status(500).send({message: "database error",error:err});
                }
                return res.status(201).json({ message: 'Donation added successfully',result,result2});
              })
            }).catch((err)=>{
              console.log(err)
              return res.status(500).send({message: "Request unsuccessful"}); 
            })  
          }).catch((err)=>{
            console.log(err)
            return res.status(500).send({message: "Request unsuccessful"});
          })       
        });        
      }else{
        return res.status(500).send({message: "Donation of amount less than 0.50$ cannot be made"}); 
      }
    }else{
      return res.status(500).send({message: "Invalid information provided"});
    }
  }

  exports.users_donate_not_user = async (req,res)=>{
    //let payload=req.decoded
    if(!req.body.tokenID || !req.body.amount) {
      return res.status(500).send({message: "insufficient information provided"}); 
    }

    if(typeof req.body.amount == "number" && req.body.tokenID.length>5){
      if(req.body.amount>0.50){
        // User.findOne({ _id: payload.userId },async function(err,user1){
        //   if(err){
        //     return res.status(500).send({message: "database error",error:err});
        //   }
          let amount1 = (req.body.amount*100)
          await Stripe.customers.create({
            //email:user1.email,
            source:req.body.tokenID
          }).then(async (customer)=>{
            await Stripe.charges.create({
              amount:amount1,
              source:req.body.tokenId,
              currency:'aud',
              customer:customer.id,
              //receipt_email:user1.email
            }).then(async (result2)=>{
              let newDonation = new Donation({ amount:amount1, currency:"aud"});
              await newDonation.save((err, result)=>{
                if(err){
                  return res.status(500).send({message: "database error",error:err});
                }
                return res.status(201).json({ message: 'Donation added successfully',result,result2});
              })
            }).catch((err)=>{
              console.log(err)
              return res.status(500).send({message: "Request unsuccessful"}); 
            })  
          }).catch((err)=>{
            console.log(err)
            return res.status(500).send({message: "Request unsuccessful"});
          })               
      }else{
        return res.status(500).send({message: "Donation of amount less than 0.50$ cannot be made"}); 
      }
    }else{
      return res.status(500).send({message: "Invalid information provided"});
    }
  }
