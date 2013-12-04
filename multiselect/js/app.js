//определяем функцию фильтрации клавиш
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // Разрешаем backspace, tab, delete, стрелки, обычные цифры и цифры на дополнительной клавиатуре
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

//Object contains collection of interactive UI-elements
var MODEL = {
	set: function(s_name, data){
		//Create an empty object
		if(typeof s_name === 'string' || typeof s_name === 'number'){
			if(typeof this[s_name] === 'undefined'){
				this[s_name] = [];
			}else{
				//this[s_name].pushStack(data);
			}
		}

		//set data
		this[s_name].push(data);
	},
	get: function(s_name){
		return typeof this[s_name] !== 'undefined' ? this[s_name] : false;
	}
};


$(function() {

	/*multiselect*/
	$('[data-multi-select]').each(function(){
		var	el = $(this),
				o = el.multiselect({/*debug: true*/}),
				name =  'multiselect';

		if(name=el.attr('data-multi-select')){}
		
		MODEL.set(name, o);
	});

	/*group-multiselect*/
	$('[data-group-multi-select]').each(function(){
		var el = $(this);
		var o = el.groupmultiselect({/*debug: true*/});
		MODEL.set('groupmultiselect', o);
	});

	//ScrollPane must be initialize
	$("[data-extended-params]").hide();
});