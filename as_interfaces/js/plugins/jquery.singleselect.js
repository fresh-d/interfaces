/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.singleselect = function(options){

	//alias
	var self = this;

	self.activeClass = 'active';

	//debug mode
	self.debug = false;

	//Elements store objects
	self.elements = {
		select: $(self),
		list: {},
		value: {},
		item_choose: {}
	};

	//Data store
	self.store = {};

	//
	self.actions = {
		click: function(e){
			var key = $(e.target).attr('data-item');
			switch (key){
				case 'item_choose':
					self.actions.item_choose.call(e.target);
				break;

				default:
					self.elements.list.slideToggle("fast");
				break;
			}
		},

		item_choose: function(){
			var el = $(this);
			var i_id = el.attr('data-id');
			var s_name = el.attr('data-name');
			var s_key = self.elements.select.attr('data-key') || '';

			self.elements.item_choose.removeClass(self.activeClass);

			//меняем не только текстовое значение но и id (аналог value для option)
			el.addClass(self.activeClass);

			self.elements.value //переместились к паренту
			.attr('data-id', i_id) //изменили атрибут
			.attr('data-name', s_name) //изменили атрибут
			.text(s_name); //изменили текст

			self.elements.list.slideUp("fast");

			self.store = {
				id: i_id,
				name: s_name
			}

			events.change(i_id, s_name, s_key);
		}
	}

	/**
	 * Events
	 */
	
	//public event
	self.events = {}

	//private events
	var events = {

		change : function change(i_id, s_name, s_key) {
			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
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

		//показываем/скрываем выпадающий список
		self.elements.select.on("click", self.actions.click);

		self.elements.item_choose.eq(0).click();

		return self;
	}

	return self.__construct(options)
}
