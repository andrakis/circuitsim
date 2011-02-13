$Sim(function($) {
	$.name("OR Gate");

	$.html(")");

	$.input(["a", "b"], function(self, a, b) {
		self.setCurrent(a || b);
	});
});