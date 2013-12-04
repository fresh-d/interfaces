/**
 * User: fedo
 * Date: 02.08.13
 * Time: 13:02
 * method get attribute which contained json string and return object
 */
$.fn.jattr = function(s_attr_name, o_value){

	var self = this;

	var res = false;

	var __construct = function(s_attr_name, o_value){

		//get value
		if(s_attr_name && !o_value){
			//single obj
			if (self.length == 1){
				if(typeof $(self).attr(s_attr_name) !== 'undefined')
					res =json_decode($(self).attr(s_attr_name));
			}
			//collection
			else if(self.length >1){
				res = [];
				self.each(function(){
					res.push(json_decode($(this).attr(s_attr_name)));
				})
			}else{
				//no more
			}
		}
		//set value
		else if(s_attr_name && o_value){
			//temporary unavailable
		}else{}

		return res;
	}

	var json_decode = function(data){
		if (data == '') {
			return false;
		} else {
			try {
				data = $.parseJSON(data)
			} catch(err) {
				console.log('isn\'t JSON');
				console.log(data);
				return false;
			}
		}
		return data;
	}

	return __construct(s_attr_name, o_value);
}