/**
 * Created by cahmed on 6/14/16.
 */


var express = require('express');
var router = express.Router();

module.exports = function (app) {

  // middleware that is specific to this router
  router.use(function timeLog(req, res, next) {
    var date = new Date(Date.now());
    var options = {
      weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      second: "2-digit"
    };
    console.log('Time: ', date.toLocaleTimeString("en-us", options));
    next();
  });
  //log a user out
  app.get('/logout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  return router;
};

