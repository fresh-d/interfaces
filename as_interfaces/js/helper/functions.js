/*
 *File contains additional functions and not encapsulated data
 */

/**
 * Стандартный str_replace
 * @param haystack
 * @param needle
 * @param replacement
 */
function str_replace(needle, replacement, haystack) {
	var temp = haystack.split(needle);
	return temp.join(replacement);
}



/**
 * Проверяет пустой ли объект
 * @param obj
 */

function empty(obj) {
	var obj = obj || this;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function isEmpty(obj) {
	var obj = obj || this;
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }

    return false;
}


var json_decode = function(data){
	if (data == '') {
		return false;
	} else {

		switch(typeof data){
			case 'string':
				try {
					data = $.parseJSON(data)
				} catch(err) {
					console.error('isn\'t JSON');
					console.error(data);
					console.error(err);
					return false;
				}
			break;

			default:
				break;
		}		
	}
	return data;
}



//переход по ссылке и эмуляция сабмита
function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}



//
function extend(Child, Parent) {
    var F = function() { }
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.superclass = Parent.prototype
}


/**
 * Merge two objects
 * @param options
 * @param defaultOptions
 * @param recursive
 */
function obj_merge(options, defaultOptions, recursive){
	var recursive = recursive || false;
	var res = {};
	for (var option in defaultOptions) {
		if(recursive && (options[option] instanceof Object) && (defaultOptions[option] instanceof Object) ){
			res[option] = obj_merge(options[option], defaultOptions[option]);
		}else{
			res[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];
		}
	}

	return  res;
}
