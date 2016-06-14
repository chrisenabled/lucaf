/**
 * Created by chrisenabled on 6/11/16.
 */

var server = require('../server');
var ds = server.dataSources.lucafPostgres;
var lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Admin', 'Photo', 'Project', 'Work'];

// create database tables for models if they do not exist or update any property changes.
ds.autoupdate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] in ', ds.adapter.name);
});
