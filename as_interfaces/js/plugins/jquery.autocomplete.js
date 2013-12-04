/**
 * User: fedo
 * Date: 01.08.13
 * Time: 15:54
 */
/*
* New Tag - it's a specials helpers object for build html of each item tag, bind actions and event
*/
$.fn.autocomplete = function(options){

	var self = this;

	//set default options
	self.selectedClass = 'active';
	self.filteredClass = 'filtered';
	self.hoverClass = 'hover';

	self.elements=	{
		autocomplete: self,
		item_choose: self.find('[data-item=item_choose]')
	};

	self.debug = false;

	//Constructor
	self.__construct = function(options){
		if(typeof options == 'object')
			$.extend(true, self, options ); //merge options

		return self;
	}

	//Объект управляет раскрывающимся списком автокомплита
	self.list = {
		open: function(){
			self.elements.autocomplete.slideDown(200, function(){
				events.toggleList(true);
			});
		},

		close: function(){
			self.elements.autocomplete.slideUp(200, function(){
				events.toggleList(false);
			});
		},

		toggle: function(){
			self.elements.autocomplete.slideToggle(200, function(){
				events.toggleList(self.list.status());
			});
		},

		status: function(){
			return self.elements.autocomplete.css('display') == 'none' ? false : true;
		}
	}

	//build html-list of autocomplete
	self.buildAutocompleteList = function (o_data){
		var a_list = [];
		var res = false;

		for(var _key_words in o_data){
			var _a_tag_list = o_data[_key_words];
			var li = $("<li>", {
				'data-item' : 'item_choose',
				'data-value':  JSON.stringify(_a_tag_list)
			})
			a_list.push(li.text(_key_words));
		}

		if(a_list.length) var res =  $('<ul>').append(a_list);

		return res;
	}

	//
	self.switch_list_item = function(event){

		var filtered_list = self.find('[data-item=item_choose]').not('.filtered').not('.active');

		//Define indexes. Standard index() method of JQ, don't work
		var index = -1;
		for(var _item=0; _item < filtered_list.length; _item++){
			if($(filtered_list[_item]).hasClass(self.hoverClass)){
				var index = _item;
				break;
			}
		}

		filtered_list.eq(index).removeClass(self.hoverClass);

		//increment/decrement of index
		if(event == 'prev'){
			var new_index = index-1;
		}else if(event='next'){
			var new_index = index+1;
		}else if(typeof event === 'number'){
			var new_index = parseInt(event);
		}else{
			//do nothing
		}

		//Check index
		if(index > filtered_list.length || index < -1){
			new_index = index;	//return old value of index
		}

		return self.elements.autocomplete.hover_element = filtered_list.eq(new_index).addClass(self.hoverClass);
	}

	var events = {
		'toggleList' : function toggleList(b_status){
			if(self.debug) console.log('');

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](b_status);
			}

			return b_status;
		}
	}
	self.events = {}

	return self.__construct(options);
}

/*
* End New Tag
*/