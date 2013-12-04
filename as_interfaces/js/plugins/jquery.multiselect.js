/**
 * User: fedo
 * Date: 29.07.13
 * Time: 14:40
 */

jQuery.fn.multiselect = function multiselect(options){

	//alias
	var self = this;

	self.debug = false;
	self.arguments = arguments;

	self.selectedClass = 'active';
	self.filteredClass = 'filtered';
	self.hoverClass = 'hover';

	//Elements store objects
	self.elements = {
			'multi-select': $(self),
			'multi-select-wrap': {},
			'input': {},
			'selected_values': {},
			'multi_select_list': {}, //autocomplite container
			'multi_select_text': {},
			'add': {},
			'placeholder':{},
			'item_choose' : {}
	};

	//Data store
	self.store = {};

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

		// Autocomplete initialize
		self.elements.multi_select_list.autocomplete({
			selectedClass: self.selectedClass,
			filteredClass: self.filteredClass,
			hoverClass : self.hoverClass,
			events: {
				toggleList: events.toggleList
			}
		});
		//redefine methods
		self.actions.list = self.elements.multi_select_list.list;
		self.actions.switch_list_item = self.elements.multi_select_list.switch_list_item;

		//Bind Actions

		//Click event to container
		self.elements['multi-select'].on('click', self.actions.ms_click);

		//blur input behavior
		self.elements.input.on('focus', self.actions.input_focus);

		//blur input behavior
		self.elements.input.on('blur', self.actions.input_blur);

		//key press
		self.elements.input.on('keyup', self.actions.input_keyup);

		//set min-width by placeholder
		self.css({
			'min-width': self.elements.placeholder.width() +26
		})

		return self;
	}

	//
	self.actions = {
		//Open list of tags
		//add : function(){},

		//itemChooseClick: function(){},

		//
		createTag: function(i_id, s_name, s_key){
			var s_key = s_key || self.data('key');

			//Create tag html elements: <span class="b-tag" data-item="tag" data-id="1">Toyota<a class="del" data-action="del"></a></span>
			if(typeof Tag === 'object' || typeof Tag === 'function'){
				//Tag.prototype = self;
				var o_tag = new Tag({
					attr : {
						'data-id': i_id,
						'data-name': s_name,
						'data-key': s_key
					},
					text: s_name
				});

				//redefine event of tag deleted
				o_tag.events.tagIsDeleted = events.tagIsDeleted;

				//create tag
				var res = o_tag.create();
			}else{
				if(self.debug) console.log("Tag isn't object: " + typeof Tag);
				var res = false;
			}

			return res;
		},

		//wrapper for createTag method
		addTag : function(i_id, s_name, s_key){
			var $this = self;
			
			var i_id = i_id || $(this).attr('data-id');
			var s_name = s_name || $(this).attr('data-name');
			var s_key = s_key || self.attr('data-key');
			var o_parents = self.elements['multi-select'];
			var res = false;

			//Reset .filtered mark of autocomplete list
			self.elements['multi_select_list'].find('.'+self.filteredClass).removeClass(self.filteredClass);

			//create tag
			var o_item_tag = self.actions.createTag(i_id, s_name, s_key);

			//tag exist
			if(o_item_tag){
				//add content
				self.elements.selected_values.append(o_item_tag);

				//hide list element
				self.elements.multi_select_list.find('[data-id='+i_id+']').addClass(self.selectedClass);

				//put data to store
				self.store[i_id] = s_name;

				//hide placeholder
				self.elements.placeholder.hide();

				//redefine res var
				res = true;
			}

			return res;
		},

		item_choose: function(e){
			//
			var el = $(this);
			var i_id = el.attr('data-id');
			var s_name = el.attr('data-name');
			var s_key = self.attr('data-key');
			var o_parents = self.elements['multi-select'];

			//Toggle list
			if (o_parents.find('.' + self.filteredClass).length>0){
				self.actions.list.toggle();
			}

			//run event if tag cteding
			if(self.actions.addTag(i_id, s_name, s_key)){
				events.tagIsAdded(i_id, s_name, s_key);
			}

			//clear text input after value was selected
			self.elements.input.val('');

			//close auto-complete list
			self.actions.list.close();
		},

		//click to multiselect put cursor to input
		ms_click : function(e){

			switch ($(e.target).attr('data-item')){

				//Click to item element of multiselect
				case 'item_choose':
					//variablse
					var el = $(e.target);

					//run method
					self.actions.item_choose.call(el);
				break;

				//Open list of tags
				case 'add':
					self.actions.list.toggle();
				break;

				default:
					//hide plceholder
					self.elements.placeholder.hide();

					//focus
					self.elements.input.focus();
				break;
			}
		},

		//on input focus
		input_focus : function(event){
			//animate input to current value
			$(this).animate({'min-width' : '30px'}, 200, function(){
				//add padding
				$(this).css({'padding-right': "4px"});
			});
		},

		//Action for blur input event.
		input_blur : function (event){
			if($(this).val().length == 0){
				if(self.elements.multi_select_list.find('.'+self.selectedClass).length == 0)
					self.elements.placeholder.show();

				$(this).animate({'min-width': 0}, 200, function(){
					$(this).attr('style', '');
				});
			}
		},

		//keyup
		input_keyup: function(){
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

					//emulate click. Add tag to value-list.
					if(self.elements.multi_select_list.hover_element.length) self.elements.multi_select_list.hover_element.click();

					//clear input
					self.elements.input.val('');

					return false;
					break;

				//Esc press
				case 27:
					if(self.debug) console.log('Press Esc');

					//blur input
					self.elements.input.blur();

					//close list
					self.actions.list.close();
					break;

				//default behavior
				default:
					if(self.debug) console.log('Press Default Key');

					//variables
					var s_text = self.elements.input.val();
					var txt = self.elements.multi_select_text;

					//
					$(this).animate('250', {width: '100%'});

					txt.text(s_text);
					$(this).width(txt.width()+10);

					var shown=0; //кол-во показанных элементов
					if(s_text.length >= 1) {
						//проверяем совпадение инпута со списком
						var re=new RegExp(s_text, "i");

						self.elements.item_choose.each(function(){
							var item_choose = $(this);
							if (item_choose.text().search(re)>=0){
							//if (/^s_text./.test(item_choose.text())){
								item_choose.removeClass(self.filteredClass); //показываем элемент
								shown++;
							}else{
								item_choose.addClass(self.filteredClass); //скрываем если нет совпадений для элемента
							}
						})

						//показываем автокомплит если он нужен
						if (
							shown>0 && //Если коунтер найденных элементов > 0
							!self.actions.list.status() //Статус списка автокомплита - true. Т.е. список показываеться.
						) {
							//
						self.actions.switch_list_item(0);

							//show list
							self.actions.list.open();
						}
					}else{
						//показываем элемент
						self.elements.item_choose.removeClass(self.filteredClass);

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
	 * Events
	 */
	//public event
	self.events = {} //

	//private events
	var events = {
		//
		tagIsAdded: function tagIsAdded(i_id, s_name, s_key){
			if(self.debug) console.log(arguments.callee.name + ': ' + i_id + '; ' + s_name + '; ' + s_key);

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		//
		tagIsDeleted : function tagIsDeleted(o_tag){
			if(self.debug) console.log(arguments.callee.name + ': Tag is deleted');

			//initialize action of tag deleting
			var i_id = o_tag.attr('data-id');
			var s_name = o_tag.attr('data-name');
			var s_key = o_tag.attr('data-key');

			//Remove active selector from multi-select list
			 self.elements.multi_select_list.find("[data-id="+i_id+"]."+self.selectedClass ).removeClass(self.selectedClass);

			//remove tag
			o_tag.remove();

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](i_id, s_name, s_key);
			}
		},

		//Mirror for open/close autoloader list
		toggleList: function toggleList(b_status){
			var b_status = b_status || self.elements.multi_select_list.list.status();

			if(b_status){
				self.elements['multi-select'].addClass(self.selectedClass);
			}else{
				self.elements['multi-select'].removeClass(self.selectedClass);
			}

			//if user event is function, run it
			if(typeof self.events[arguments.callee.name] === 'function'){
				self.events[arguments.callee.name](b_status);
			}
		}
	}
	/**
	 * End Events
	 */



	return self.__construct(options)
}
