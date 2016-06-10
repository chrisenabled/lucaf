module.exports = function(Photo) {
	
	Photo.beforeRemote('create', function(context, user, next) {
	    context.args.data.dateCreated = Date.now();
	    next();
  	});
};
