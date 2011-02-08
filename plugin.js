var __plugin_ids = 0;

function Plugin () {
	var self = this;

	self._id = __plugin_ids++;
	self._name = "(Untitled plugin " + self.id + ")";
	self._html = "<span>?</span>";
	self._jquery_callbacks = {};
}

Plugin.prototype.name = function(name) {
	this._name = name;
};

Plugin.prototype.html = function(html) {
	this._html = html;
};

Plugin.prototype.click = function(callback) {
	this._jquery_callbacks["click"] = callback;
};

Plugin.prototype.New = function() {
	var source = this;
	return function (location) {
		var self = this;

		self.type = source;
		self.id = source._name + ":" + __plugin_ids++;
		self.location = location;

		self.getHtml = function() {
			var html = source._html;
			if (typeof html != "string") 
				html = html(self);

			html = jQuery(html);

			for (var type in source._jquery_callbacks) {
				(function(_type, _callback, _target) {
					html.bind(_type, function() {
						_callback(_target);
					});
				})(type, source._jquery_callbacks[type], self);
			}

			self.getHtml = function() { 
				return html;
			};
		};
	};
};
