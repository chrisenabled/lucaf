/**
 * Created by cahmed on 6/14/16.
 */
// Module for routing requests to appropriate controller.

module.exports = function(app) {

  var homeController = require('../controllers/homeController')(app);
  var adminController = require('../controllers/adminController')(app);
  var photoController = require('../controllers/photoController')(app);
  var projectController = require('../controllers/projectController')(app);
  var workController = require('../controllers/workController')(app);
  var memberController =  require('../controllers/memberController')(app);
  var lucaFGroupController =  require('../controllers/lucafGroupController')(app);

  app.use('/', homeController);
  app.use('/admin', adminController);
  app.use('/photo', photoController);
  app.use('/project', projectController);
  app.use('/work', workController);
  app.use('/member', memberController);
  app.use('/lucafgroup',lucaFGroupController);

};
