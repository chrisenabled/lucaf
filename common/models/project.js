module.exports = function(Project) {
	
	Project.beforeRemote('create', function(context, user, next) {
	    context.args.data.dateCreated = Date.now();
	    next();
  	});
};
