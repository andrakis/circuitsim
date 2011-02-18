var __plugin_ids = 0;

function Plugin () {
	var self = this;

	self._id = __plugin_ids++;
	self._name = "(Untitled plugin " + self.id + ")";
	self._html = "<span>?</span>";
	self._jquery_callbacks = {};
	self._inputs = {};
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
	var self = this;
	
	assert(callback, "Callback required!");
	if (typeof names == "string") names = [names];

	names.forEach(function(n) {
		self._inputs[n] = callback;
	});
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

		// Create helpers for input bindings
		for (var n in source._inputs) {
			(function(name) {
				var helper = $("<div class='helper link'></div>");
				helper.attr('input_name', name);
				helper.text('Link to ' + name);
				helper.click(function() {
					helper.addClass('chosen');
				});
				helper.bind('fire', function(e, from) {
					$Debug('Linked to input ' + name);
					self._inputs[name] = from;
					from.setOutput(self);
				});
				special.append(helper);
			})(n);
		}

		self.setOutput = function(out) {
			if (self._outputs.indexOf(out) == -1) 
				self._outputs.push(out);
		};

		self.$.mouseenter(function() {
			self.$.addClass('hover_source');
			for (var name in self._inputs) {
				self._inputs[name].$.addClass('hover_input');
			}
			for (var i = 0; i < self._outputs.length; i++) {
				self._outputs[i].$.addClass('hover_output');
			}
		});

		self.$.mouseleave(function() {
			self.$.removeClass('hover_source');
			/*for (var name in self._inputs) {
				self._inputs[name].$.removeClass('hover_input');
			}
			for (var i = 0; i < self._outputs.length; i++) {
				self._outputs[i].$.removeClass('hover_output');
			}*/
			jQuery(".plugin").removeClass('hover_input').removeClass('hover_output').removeClass('hover_source');
		});

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
