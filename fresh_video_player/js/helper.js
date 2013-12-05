/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
/*function merge_options(obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) {
		if(type obj3[attrname] === 'object'){
			obj3[attrname] = window.merge_options(obj3[attrname], obj1)
		}else{
			obj3[attrname] = obj1[attrname];
		}
	}
    for (var attrname in obj2) {
    	if(type obj3[attrname] == 'object'){
    		obj3[attrname] = window.merge_options(obj3[attrname], obj2)
    	}else{
    		obj3[attrname] = obj2[attrname];
    	}

    }
    return obj3;
}
*/



/**
 * Convert a number of seconds to time (hh:mm:ss)
 * Use - "5678".toHHMMSS()
 * return hh:mm:ss
 */
Number.prototype.toMMSS = function () {
    sec_numb    = parseInt(this);
    var hours   = Math.floor(sec_numb / 3600);
    var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
    var seconds = sec_numb - (hours * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time = minutes+':'+seconds;
    return time;
}