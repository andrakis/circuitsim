var __plugin_ids = 0;

function Plugin () {
	var self = this;

	self._id = __plugin_ids++;
	self._name = "(Untitled plugin " + self.id + ")";
	self._html = "<span>?</span>";
	self._jquery_callbacks = {};
}

Plugin.prototype.name = function() {
	if (arguments.length)
		this._name = arguments[0];
	return this._name;
};

Plugin.prototype.html = function() {
	if (arguments.length)
		this._html = arguments[0];
	return this._html;
};

Plugin.prototype.click = function(callback) {
	this._jquery_callbacks["click"] = callback;
};

Plugin.prototype.New = function() {
	var source = this;
	var constructor = function () {
		var self = this;

		self.type = source;
		self.id = source._name + ":" + __plugin_ids++;
		self.current = false;
		self.$ = jQuery("<div></div>");

		for (var type in source._jquery_callbacks) {
			(function(_type, _callback, _target) {
				self.$.bind(_type, function() {
					_callback(_target);
				});
			})(type, source._jquery_callbacks[type], self);
		}

		self.update = function() {
			var html = source._html;
			if (typeof html != "string") 
				html = html(self);
			self.$.html(html);
		};

		self.getCurrent = function() { return self.current; };
		self.setCurrent = function(value) { 
			self.current = value;
			self.update();
			// TODO: Pass to connections
		}

		self.update();
	};
	source.New = function() {
		return new constructor();
	};
	return new constructor();
};
