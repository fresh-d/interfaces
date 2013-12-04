/**
 * fedo (fresh)
 * jQuery plugin
 * Multi-files input emulate
 * special for aquaproject
 * @param options
 * @returns {*}
 */
$.fn.attachFile = function(options){
	var	self = $(this);
	var count = 1;
	self.options = {
		debug: true
	};

	var __construct = function(options){
		$.extend(self, options, true);

		//check form settings
		var form = self.parents('form');
		if(form.attr('method') != 'post')form.attr({'method':'post'});
		if(form.attr('enctype') != 'multipart/form-data')form.attr({'enctype':'multipart/form-data'});

		//Bind Events
		$(document).on('click', '[data-file-list-item]', function(){});

		$(document).on('click', '[data-file-delete]', self.actions.deleteItem);

		$(document).on('change', '[data-file]', self.actions.inputChange);

		var vocabulary = self.find('[data-vocabulary]');
		if(vocabulary.length > 0){
			self.options.vocabulary = JSON.parse(vocabulary.attr('data-vocabulary'));
		}

		return self;
	}

	self.actions = {
		deleteItem	: function(e){
			if(typeof e == 'object') e.preventDefault();
			var file_path = $(this).attr('data-file-delete');
			self.find('[data-files-list-item="'+file_path+'"]').remove();

			self.events.change();
		},

		inputChange: function() {
			var el = $(this),
				fullPath = el.val(),
				new_file_input = el.clone();

			var	o_item = getListItem(fullPath, el);

			new_file_input.insertBefore($("[data-label]"));

			self.find('[data-files-list]').append(o_item.append());

			self.events.change();
		}
	};

	self.events = {
		change: function(){
			if(self.options.debug) console.log('inputChange');

			if(self.find('[data-files-list-item]').length > 0) {
				self.find('[data-file-empty]').hide();

				self.find('[data-label]').text(self.options.vocabulary['more']);
			} else {
				self.find('[data-file-empty]').show();

				self.find('[data-label]').text(self.options.vocabulary['default']);
			}
		}
	}

	var getFileName = function(fullPath){
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);

		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}

		return filename;
	}


	var getListItem = function(fullPath, file_input){

		 var filename = getFileName(fullPath);

		var div = $("<div>", {class : "file-name", "data-files-list-item": filename})
				.append(
					$("<a>", {class: 'file-del', "data-file-delete": filename})
				).append(
					filename
				)
				.append(
					file_input.attr({'name': "file_"+count, class: ""}).css({opacity: 0})
				);
		count++;
		return div;
	}

	return __construct();
}