module.exports = function(Work) {
	
	Work.beforeRemote('create', function(context, user, next) {
	    context.args.data.dateCreated = Date.now();
	    next();
  	});
};
