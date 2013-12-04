/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.searchbar = function SearchBar(options){

	//alias
	var self = this;

	self.debug = false;
	self.arguments = arguments;

	self.selectedClass = 'active';
	self.filteredClass = 'filtered';
	self.hoverClass = 'hover';

	//Elements store objects
	self.elements = {
		'searchbar': $(self),
		'wrap': {},
		'search': {},
		'clear': {},
		'input': {},
		'text': {},
		'selected_values': {},
		'placeholder': {},
		'autocomplete': {},
		'item_choose': {}
	};

	//Data store
	self.store = {};
	self.tag_store = {};

	//Constructor
	self.__construct = function(options){
		//merge options
		var options = $.extend(true, self, options);

		//create collections of inner elements
		for(var _item_element in self.elements){
			var _o = self.find('[data-item='+_item_element+']');
			if(_o.length > 0){
				self.elements[_item_element] = _o;
			}
		}

		// Autocomplete initialize
		self.elements.autocomplete.autocomplete({
			selectedClass: self.selectedClass,
			filteredClass: self.filteredClass,
			hoverClass : self.hoverClass
		});
		//redefine methods
		self.actions.list = self.elements.autocomplete.list;
		self.actions.switch_list_item = self.elements.autocomplete.switch_list_item;

		//submit action
		self.on('submit', self.actions.onSubmit);

		//
		self.elements.input.on('keyup', self.actions.input_keyup);

		self.elements.input.on('focus', self.actions.inputFocus);
		self.elements.input.on('blur', self.actions.inputBlur);

		self.elements.clear.on("click", self.actions.clearInput);

		//Click event to container
		self.elements.searchbar.off('click').on('click', self.actions.sb_click);

		if(self.actions.checkTag()) 	self.actions.input.expand();
		else self.actions.input.collapse();

		return self;
	}



	/**
	 * Actions
	 */
	self.actions = {
		//
		createTag: function createTag(i_id, s_name, s_key, options_attributes){
			if(self.debug) console.log(self.arguments.callee.name + '::' + arguments.callee.name + ' method run ');

			var s_key = s_key || self.attr('data-key');

			//Create tag html elements: <span class="b-tag" data-item="tag" data-id="1">Toyota<a class="del" data-action="del"></a></span>
			if(typeof Tag === 'object' || typeof Tag === 'function'){
				var o_attr =  {
					'data-id': i_id,
					'data-name': s_name,
					'data-key': s_key
				};

				if(!$.isEmptyObject(options_attributes)){
					$.extend(o_attr, options_attributes);
				}

				//Tag.prototype = self;
				var o_tag = new Tag({
					attr : o_attr,
					text: s_name
				});

				//redefine event method of tag deleted
				o_tag.events.tagIsDeleted = events.tagIsDeleted;

				//
				var res = o_tag.create();

				if(typeof self.tag_store[res.attr('data-key')] === 'undefined'){
					self.tag_store[res.attr('data-key')] = {};
				}
				self.tag_store[res.attr('data-key')][res.attr('data-id')] = res;

			}else{
				if(self.debug) console.log("Tag isn't object: " + typeof Tag);
				var res = false;
			}

			return res;
		},

		//wrapper for createTag method
		addTag : function addTag(i_id, s_name, s_key, options_attributes){
			if(self.debug) console.log(self.arguments.callee.name + '::' + arguments.callee.name + ' method run ');

			var s_key = s_key || self.attr('data-key');
			var res = false;

			//Reset .filtered mark of autocomplete list
			//self.elements['multi-select-list'].find('.filtered').removeClass('filtered');

			//create tag element
			var o_item_tag = self.actions.createTag(i_id, s_name, s_key, options_attributes);

			//check tag exist
			if(o_item_tag){
				self.elements.selected_values.append(o_item_tag);
				self.store[i_id] = s_name;
				res = true;
			}

			return res;
		},

		//delete tag object from collection
		removeTag: function(_id, s_name, s_key){
			if(typeof self.tag_store[s_key] !== 'undefined'){
				if(typeof self.tag_store[s_key][_id] !== 'undefined'){
					self.tag_store[s_key][_id].remove();
				}
			}
		},

		inputFocus: function(){
			self.actions.input.expand();
			return true;
		},

		inputBlur: function(){
			if(!self.actions.checkTag() && !self.elements.input.val()) self.actions.input.collapse();
			return true;
		},

		clearInput: function(){
			self.events.clearScope();//set clear object
			self.actions.input.collapse();
		},

		//Check tag in store
		checkTag: function(){
			var b_trigger = false;

			if(!$.isEmptyObject(self.tag_store)){
				for(var i in self.tag_store){
					if(!$.isEmptyObject(self.tag_store[i])) {
						b_trigger = true; break;
					}
				}
			}

			return b_trigger;
		},

		//input behavior
		input: {
			collapse: function(){
				self.elements.input.val(""); //очищаем инпут
				self.elements.text.text(""); //очищаем инпут холдер
				self.elements.wrap.removeClass(self.selectedClass); //
				self.elements.placeholder.show();
			},

			expand: function(){
				//self.elements.input.val(""); //очищаем инпут
				//self.elements.text.text(""); //очищаем инпут холдер
				self.elements.wrap.addClass(self.selectedClass); //
				self.elements.placeholder.hide();
			},

			status: function(){
				 //if(b_trigger) self.actions.input.collapse();
				return self.elements.wrap.hasClass(self.selectedClass) ? true: false;
			},

			toggle: function(){
				self.elements.wrap.toggleClass(self.selectedClass); //
			}

		},

		//submit behavior
		onSubmit : function onSubmit(e){
//			if(DEBUG) console.log(self.arguments.callee.name + '::' + arguments.callee.name + ' method is ru ');

//			console.log("Submit: " + self.elements.input.val());
//
//			//Dummy
//			var	i_id = 1,
//					s_name = self.elements.input.val(),
//					s_key = 'models';
//			if(self.actions.addTag(1, s_name, s_key)){
//				//Run Event
//				events.tagIsAdded(i_id, s_name, s_key);
//			}
//
//			//unset default behavior
			e.preventDefault();

			//run event
			events.submit(self.elements.input.val());

			return true;
		},

		item_choose: function item_choose(e){
			if(self.debug) console.log(self.arguments.callee.name + '::' + arguments.callee.name + ' method is ru ');

			var o_data = $(this).jattr('data-value');

			for(var i in o_data){
				var _o_item_tag = o_data[i];

				if(_o_item_tag.id && _o_item_tag.key && _o_item_tag.name){
					if(self.actions.addTag(_o_item_tag.id, _o_item_tag.name, _o_item_tag.key)){
						//Run Event
						events.tagIsAdded(_o_item_tag.id, _o_item_tag.name, _o_item_tag.key);
					}
				}
			}

			self.actions.list.close();
		},

		//click to multiselect put cursor to input
		sb_click : function(e){
			switch ($(e.target).attr('data-item')){
				//Click to item element of multiselect
				case 'item_choose':
					//variablse
					var el = $(e.target);

					//run method
					self.actions.item_choose.call(el);
				break;

				case 'placeholder':
					//variablse
					var el = $(e.target);

					//focus
					self.elements.input.focus();
					self.actions.inputFocus();
				break;

				//other element
				default:
				break;
			}
		},

		//keyup
		input_keyup: function(event){
			
			//define index variable
			switch(event.keyCode){
				//arrow up key press
				case 38:
					if(self.debug) console.log('Press key up');
					self.actions.switch_list_item('prev');
					break;

				//arrow down key press
				case 40:
					if(self.debug) console.log('Press key down');
					self.actions.switch_list_item('next');
					break;

				//Enter key press
				case 13:
					if(self.debug) console.log('Press Enter');

					event.preventDefault();

					//emulate click. Add tag to value-list.
					if(self.elements.autocomplete.hover_element.length){
						self.elements.autocomplete.hover_element.click();
						//clear input
						self.elements.input.val('');
					}else{
						self.submit();
					}

					break;

				//Esc press
				case 27:
					if(self.debug) console.log('Press Esc');

					//blur input
					self.elements.input.blur();

					//close list
					self.actions.list.close();
					break;

				//other specials keys: alt, lr, rr, tab
				case 9	:
				case 18:
				case 39:
				case 37:
					if(self.debug) console.log('Press Spec. Key');
					break;

				//default behavior
				default:
					if(self.debug) console.log('Press Default Key');

					//variables
					var s_text = self.elements.input.val();
					var txt = self.elements.text;

					//
					$(this).animate('250', {width: '100%'});

					txt.text(s_text);
					$(this).width(txt.width()+10);

					var shown=0; //кол-во показанных элементов
					if(s_text.length >= 3) {
						//
						events.keyup(s_text);

						//показываем автокомплит если он нужен
						if (
							//shown>0 && //Если коунтер найденных элементов > 0
							!self.actions.list.status() //Статус списка автокомплита - true. Т.е. список показываеться.
						) {
							//
							self.actions.switch_list_item(0);

							//show list
							//self.actions.list.open();
						}
					}else{

						//показываем элементы
						if(!$.isEmptyObject(self.elements.item_choose)) self.elements.item_choose.removeClass(self.filteredClass);

						//close list
						self.actions.list.close();
					}
					//multiCheckPlaceholder(parent);
					break;
			}
		},

		//Dummy methods of autocomplete list
		list: {
			open: function open(){if(self.debug) console.log(self.arguments.callee.name + "::" +arguments.callee.name+ ' -> Dummy method');},
			close: function close(){if(self.debug) console.log(self.arguments.callee.name + "::" +arguments.callee.name+ ' -> Dummy method');},
			toggle: function toggle(){if(self.debug) console.log(self.arguments.callee.name + "::" +arguments.callee.name+ ' -> Dummy method');},
			status: function status(){if(self.debug) console.log(self.arguments.callee.name + "::" +arguments.callee.name+ ' -> Dummy method');}
		},

		switch_list_item: function switch_list_item(){
			if(self.debug) console.log(self.arguments.callee.name + "::" +arguments.callee.name+ ' -> Dummy function');
		}
	}
	/**
	 * End Actions
	 */



	/**
	 * Events
	 */
	self.events = {	};

	var events = {
		tagIsAdded: function tagIsAdded(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': ' + i_id + ';' + s_name + ';' + s_key);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		//delete tag event
		tagIsDeleted : function tagIsDeleted(o_tag){
			if(self.debug) console.log(arguments.callee.name + ': Tag is deleted');

			//initialize action of tag deleting
			var i_id = o_tag.attr('data-id');
			var s_name = o_tag.attr('data-name');
			var s_key = o_tag.attr('data-key');

			//remove tag
			//o_tag.remove();
			self.actions.removeTag(i_id, s_name, s_key);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		//
		keyup: function keyUp(s_val){
			if(self.debug) console.log(arguments.callee.name + ': ' + s_val);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](s_val);
			}
		},

		//
		setScope: function setScope(obj){
			if(self.debug) console.log(arguments.callee.name + ': ' + s_val);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](obj);
			}
		},

		//
		clearScope: function clearScope(){
			if(self.debug) console.log(arguments.callee.name + ': ' + s_val);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name]();
			}
		},

		//
		submit: function submit(s_val){
			if(self.debug) console.log(arguments.callee.name + ': ' + s_val);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](s_val);
			}
		}
	};
	/**
	 * End Events
	 */

	return self.__construct(options)
}
