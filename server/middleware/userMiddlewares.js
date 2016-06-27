/**
 * Created by cahmed on 6/21/16.
 */

module.exports = function (app, loopback) {

  return {
    setCurrentUser : function setCurrentUser(req, res, next) {
      if (!req.accessToken) {
        return next();
      }

      app.models.Admin.findById(req.accessToken.userId, function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new Error('No user with this access token was found.'));
        }
        console.log("userMiddleware.js:setCurrentUser -> user found " + user.email);
        var loopbackContext = loopback.getCurrentContext();
        if (loopbackContext) {
          loopbackContext.set('currentUser', user);
        }
        next();
      });
    }
  };


};
