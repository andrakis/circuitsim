var __plugin_ids = 0;

function Plugin () {
	var self = this;

	self._id = __plugin_ids++;
	self._name = "(Untitled plugin " + self.id + ")";
	self._html = "<span>?</span>";
	self._jquery_callbacks = {};
	// Default implementation - simply set outputs and inputs, 1 to 1 relationship
	self._attachOutputToHandler = function(from, to) {
	};
	self._inputs = [];	// Default
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
	assert(callback, "Callback required!");
	this._jquery_callbacks["click"] = callback;
};

Plugin.prototype.input = function(names, callback) {
	assert(callback, "Callback required!");
	if (typeof names == "string") names = [names];

	
};

Plugin.prototype.New = function() {
	var source = this;
	var constructor = function () {
		var self = this;

		self.type = source;
		self.id = source._name + __plugin_ids++;
		self.current = false;
		self._inputs = {};
		self._outputs = [];

		self.$ = jQuery("<div class='plugin ui-widget-content'></div>");
		self.$.attr('plugin_id', self.id);

		var special = jQuery("<div class='special'></div>");
		var visual  = jQuery("<div class='visual'></div>");
		self.$.append(special).append(visual);

		for (var type in source._jquery_callbacks) {
			(function(_type, _callback, _target) {
				self.$.bind(_type, function() {
					if (!$Ignore(_type)) {
						_callback(_target);
					}
				});
			})(type, source._jquery_callbacks[type], self);
		}

		self.update = function() {
			var html = source._html;
			if (typeof html != "string") 
				html = html(self);
			visual.html(html);
		};

		self.updateLogic = function() {
			
		};

		self.getCurrent = function() { return self.current; };
		self.setCurrent = function(value) {
			if (self.current != value) {
				self.current = value;
				self.update();
				// TODO: Pass to connections
			}
		}

		self.attachOutputTo = function(to) {
			source._attachOutputToHandler(self, to);
			self.update();
		};

		self.update();
	};
	source.New = function() {
		return new constructor();
	};
	return new constructor();
};
