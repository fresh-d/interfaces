/*
* New Tag - it's a specials helpers object for build html of each item tag, bind actions and event
*/
var Tag = function(options){
	//set default options
	this.scheme =	{
		element: 'span',
		innerElement: {},
		attr: {class:"b-tag", 'data-item': 'tag'}
	};
	this._tag = null;

	//alias
	var self = this;

	self.debug = false;

	//Constructor
	this._construct = function(options){
		if(typeof options == 'object')
			$.extend(true, this.scheme, options ); //merge options

		if(!this.scheme) console.log("Warning! Scheme of tag factory is empty");
	}

	// Create tag
	self.create = function(options){

		//merge options
		if(typeof options === 'object')
			this._construct(options);

		//create html elements
		var o_del = new htmlFactory({tag: 'a', attr: {class:"del", 'data-item': 'tag_delete'}});
		var o_tag = new htmlFactory({tag: 'span', innerText: this.scheme.text, attr: this.scheme.attr});

		//bind onClick behavior
		$(o_tag).on('click', self.clickTag);

		//add content
		o_tag = $(o_tag).append(o_del);

		//run Event
		o_tag = events.tagIsCreated(o_tag);

		return o_tag;
	}

	 self.clickTag = function(e){

		 switch ($(e.target).attr('data-item')){
			 case 'tag_delete':
				//run delete event
				events.tagIsDeleted($(this));
			 	break;
			 default:
			 	break;
		 }

		 //delete default behavior of link click
		 e.preventDefault();

		return true;
	}

	var events = {
		tagIsCreated : function tagIsCreated(element){
			if(self.debug) console.log('Tag is created');

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](element);
			}

			return element;
		},
		tagIsDeleted : function tagIsDeleted(o_tag){
			if(self.debug) console.log('Tag is deleted');

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](o_tag);
			}
		}
	}
	self.events = {}

	return this._construct(options);
}

/*
* End New Tag
*/