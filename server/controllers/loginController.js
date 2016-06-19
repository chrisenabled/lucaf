/**
 * Created by cahmed on 6/14/16.
 */


var express = require('express');
var router = express.Router();
var dsConfig = require('../datasources.json');

module.exports = function (app) {
  var User = app.models.Admin;

  // middleware that is specific to this router
  router.use(function timeLog(req, res, next) {
    next();
  });
  //login page
  router.get('/', function(req, res) {
    var credentials = dsConfig.emailDs.transports[0].auth;
    res.render('login/login', {
      email: credentials.user,
      password: credentials.pass
    });
  });
  // register user
  router.get('/register', function(req, res) {
    res.render('login/registration-form', {});
  });
  // forgot password
  router.get('/forgot-password', function(req, res) {
    res.render('login/forgot-password-form', {});
  });
  //log a user in
  router.post('/login', function(req, res) {
    User.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        res.render('login/response', {
          title: 'Login failed',
          content: err,
          redirectTo: '/',
          redirectToLinkText: 'Try again'
        });
        return;
      }

      res.render('home/home', {
        email: req.body.email,
        accessToken: token.id
      });
    });
  });
  //show password reset form
  router.get('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    res.render('login/password-reset', {
      accessToken: req.accessToken.id
    });
  });
  //send an email with instructions to reset an existing user's password
  router.post('/request-password-reset', function(req, res, next) {
    User.resetPassword({
      email: req.body.email
    }, function(err) {
      if (err) return res.status(401).send(err);

      res.render('login/response', {
        title: 'Password reset requested',
        content: 'Check your email for further instructions',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    });
  });
  //reset the user's password
  router.post('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);

    //verify passwords match
    if (!req.body.password ||
      !req.body.confirmation ||
      req.body.password !== req.body.confirmation) {
      return res.sendStatus(400, new Error('Passwords do not match'));
    }

    User.findById(req.accessToken.userId, function(err, user) {
      if (err) return res.sendStatus(404);
      user.updateAttribute('password', req.body.password, function(err, user) {
        if (err) return res.sendStatus(404);
        console.log('> password reset processed successfully');
        res.render('login/response', {
          title: 'Password reset success',
          content: 'Your password has been reset successfully',
          redirectTo: '/',
          redirectToLinkText: 'Log in'
        });
      });
    });
  });
  //verified
  app.get('/verified', function(req, res) {
    res.render('login/verified');
  });

  return router;
};
