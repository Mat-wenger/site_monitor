exports.definition = {
	config: {
		columns: {
		    "name": "string",
		    "value": "string",
		    "display_order": "string",
		    "timestamp": "string"
		},
		adapter: {
			type: "sql",
			collection_name: "metrics"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			remove: function(){
				Ti.API.warn('remove the collection here');
				var db=Ti.Database.open('_alloy_');
				var deleteRecords=db.execute('DELETE FROM metrics');
				Ti.API.info('Affected Rows    '+db.getRowsAffected());
				db.close();
				}
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};