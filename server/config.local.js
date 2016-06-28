/**
 * Created by chrisenabled on 6/28/16.
 * Js to override values in config.json for local environment.
 */

var ipAddresses = require('../server/utils/generateIpAddresses');

module.exports = {
  host: ipAddresses.getIpAddresses()[0]
};
