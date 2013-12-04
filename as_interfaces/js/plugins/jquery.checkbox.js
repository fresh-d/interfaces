/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.checkbox = function(options){

	//alias
	var self = this;

	self.activeClass = 'active';

	//debug mode
	self.debug = false;

	//Elements store objects
	self.elements = {
		checkbox: $(self),
		group: {} //holder for checkbox group
	};

	//Data store
	self.store = {};

	//
	self.actions = {
		//Open list of tags
		change : function(){
			var el = $(this);
			var o = $(this).jattr('data-value');

			if(typeof o.key === 'undefined' && self.elements.group.length) o.key = self.elements.group.attr('data-key');

			if( el.prop("checked")){
				events.isChecked(o.id, o.name, o.key);
			}else{
				events.isUnchecked(o.id, o.name, o.key);
			}
		},

		click : function(){
			var el = $(this);
			var o = $(this).jattr('data-value');

			if(typeof o.key === 'undefined' && self.elements.group.length) o.key = self.elements.group.attr('data-key');

			if(!el.hasClass(self.activeClass)){
				el.addClass(self.activeClass);
				events.isChecked(o.id, o.name, o.key);
			}else{
				el.removeClass(self.activeClass);
				events.isUnchecked(o.id, o.name, o.key);
			}
		}
	}



	/**
	 * Events
	 */

	//public event
	self.events = {}

	//private events
	var events = {
		addTag: function addTag(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': ' + i_id + '; ' + s_name + '; ' + s_key);

			//self.prop('checked', true);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		deleteTag : function deleteTag(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': Tag is deleted');

			//self.prop('checked', false);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		isUnchecked : function isUnchecked(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': event');

			//self.prop('checked', false);
			//console.log(self);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		isChecked : function isChecked(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': event');

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

		//Bind Actions
		//define action
		var s_action = self.attr('type') ? 'change' : 'click';

		//Click/change event to container
		self.on(s_action, self.actions[s_action]);

		return self;
	}

	return self.__construct(options)
}
