$Sim(function($) {

	// Battery
	$.name("Battery");

	$.html(function(self) {
		return jQuery("<span>Battery</span>").css({color: (self.getCurrent() ? 'green' : 'red')});
	});

	$.click(function(self) {
		self.setCurrent(!self.getCurrent());
	});

	$.input("input", function(self, current) {
		self.setCurrent(current);
	});
});
