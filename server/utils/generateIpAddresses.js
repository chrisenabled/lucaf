/**
 * Created by chrisenabled on 6/28/16.
 */

var os = require('os');
var ifaces = os.networkInterfaces();


module.exports = {
  getIpAddresses : function () {
    var ipAddresses = [];
    Object.keys(ifaces).forEach(function (ifname) {
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
        ipAddresses.push(iface.address);
      });
    });
    return ipAddresses;
  }
};
