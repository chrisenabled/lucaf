/**
 * Created by chrisenabled on 6/16/16.
 */

var url = require('url');

module.exports = function () {

  function fullUrl(req) {
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl
    });
  }
  return function requestLog(req, res, next) {
    require('fs').stat(__dirname + req.url, function(err, stats) {
      var isFile = stats && stats.isFile();
      //do not process static files
      if (isFile == false) {
        var date = new Date(Date.now());
        var options = {
          weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          second: "2-digit", timeZone: 'UTC', timeZoneName : "short"
        };
        console.log('....................................');
        console.log('Request headers: ', JSON.stringify(req.headers));
        console.log('Url: ',fullUrl(req),' Time: ', date.toLocaleTimeString("en-us", options));
        console.log('....................................');
      }
      next();
    });
  };
};
