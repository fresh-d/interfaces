/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.diapason_slider = function(options){

	//alias
	var self = this;

	self.activeClass = 'active';

	//debug mode
	self.debug = false;

	//Elements store objects
	self.elements = {
		slider: self,
		label: {} //holder for checkbox group
	};

	self.default_attr = {}

	//Data store
	self.store = {};

	//
	self.actions = {
		//
		sliderCreate:	function sliderCreate( event, ui){
			var _o = self.slider('option');
			self.find(".ui-slider-handle").eq(0).addClass("ui-slider-from").html("<i></i>");
			self.find(".ui-slider-handle").eq(1).addClass("ui-slider-to").html("<i></i>");
			self.actions.sliderSlide( event, {values: [self.default_attr.from, self.default_attr.to]});
		},

		//
		sliderSlide:	function sliderSlide(event, ui){
			var from = ui.values[0];
			var to = ui.values[1];
			//if(from==to)	return false;

			self.find(".ui-slider-from i").text(from);//.css({'left': self.find(".ui-slider-from").offset().left - 23});
			self.find(".ui-slider-to i").text(to);
			//return [from-23, to+23]
		},

		//reinitialize slider
		setDefault: function(){
			self.slider('destroy');
			self.actions.init();
		},

		init: function(){
			var o_data = self.default_attr = self.elements.slider.jattr('data-value');

			self.elements.slider.slider({
				range: true,
				min:		parseInt(o_data.min),
				max:	parseInt(o_data.max),
				step:	parseInt(o_data.step),
				values:[parseInt(o_data.from), parseInt(o_data.to)],
				slide: self.actions.sliderSlide,
				create: self.actions.sliderCreate,
				change: events.change
			});

			return self;
		}
	}



	/**
	 * Events
	 */

	//public event
	self.events = {}

	//private events
	var events = {
		change : function change( event, ui ) {
			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](event, ui);
			}
		}
	}

	/**
	 * End Events
	 */

	//
	self.__construct = function(options){
		//merge options
		var options = $.extend(true, self, options);

		self.actions.init();

		return self;
	}

	return self.__construct(options)
}
