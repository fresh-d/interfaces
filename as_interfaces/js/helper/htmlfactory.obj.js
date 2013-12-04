/*
	 * HTML factory
	 */
	var htmlFactory = function(options){
		this.default_options = {
			tag: "div",//string
			attr: {}, //object
			innerText: "", //string
			innerHtml: '' //
		}
		this.options = null;

		this._constructor = function(options){
			if(typeof options == 'undefined') return this;

			//set options
			this.setOptions(options);
			return this.create();
		}

		this.setOptions = function(options){
			if(typeof obj_merge == 'function')
				this.options = obj_merge(options, this.default_options);
			else{
				if(DEBUG) console.log('obj_merge is not a function. Include file, which contains library of functions');
				this.options = this.default_options;
			}
			return this.options;
		}

		this.create = function(options){
			if(typeof options !== 'undefined') //
				this.setOptions(options);

			//create element
			var element = document.createElement(this.options.tag);
			var o_attr =  this.options.attr;
			for(var _item_attr in o_attr){
				element.setAttribute(_item_attr, o_attr[_item_attr]);
			}

			if(typeof this.options.innerText !== 'undefined'){
				element.innerText = this.options.innerText;
			}

			return element;
		}

		return this._constructor(options)
	}

/*
 * jQuery test
if (jQuery) {
    // jQuery is loaded
} else {
    // jQuery is not loaded
}*/
