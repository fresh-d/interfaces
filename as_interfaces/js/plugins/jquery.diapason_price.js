/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.diapason_price = function(options){

	//alias
	var self = this;

	self.activeClass = 'active';

	//debug mode
	self.debug = false;

	//Elements store objects
	self.elements = {
		price: $(self),
		price_from: {},
		price_to: {},
		select: $(self).find('[data-select]').singleselect({
			debug: self.debug
		})
	};

	//Data store
	self.store = {};

	//
	self.actions = {
		change: function(){
			var el = $(this);
			var key = el.attr('data-item');

			self.store[key] = {
				value: el.val(),
				name: el.attr('data-name')
			}

			events.change();
		}
	}



	/**
	 * Events
	 */

	//public event
	self.events = {}

	//private events
	var events = {

		change : function change() {

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function') {
				self.events[arguments.callee.name](self.store);
			}
		},

		currency_change : function currency_change(i_id, s_name, s_key) {

			self.store.currency = {
				 id: i_id, 
				name: s_name
			}

			events.change();

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function') {
				self.events[arguments.callee.name](i_id, s_name, s_key);
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

		//create collections of inner elements
		for(var _item_element in self.elements){
			if($.isEmptyObject(self.elements[_item_element])){
				var _o = self.find('[data-item='+_item_element+']');
				if(_o.length > 0){
					self.elements[_item_element] = _o;
				}else{
					console.log(self.elements[_item_element]);
					if(self.debug) console.log('Warning! Element '+ _item_element +' not found.');
				}
			}
		}

		self.elements.select.events = {
			change: events.currency_change
		}

		self.store.currency = self.elements.select.store;

		$(self.elements.price_from).on('change', self.actions.change);
		$(self.elements.price_to).on('change', self.actions.change);

		return self;
	}

	return self.__construct(options)
}
