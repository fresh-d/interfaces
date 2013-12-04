/**
 *
 */

var slider_directive = function(){
		return {
			restrict: 'A',
			link: function($scope, element, attrs){
				if(DEBUG) console.log('Directive slider:');
				var o_data_value = element.jattr('data-value');

				var o_option = element.diapason_slider({
					events: {
						//add Event. Checkbox set
						change: function(event, ui){
							$scope.$apply(function(){
								$scope.search[attrs.key][attrs.key] = {
									name:o_data_value.label + ui.values[0] +"-"+ui.values[1],
									id: ui.values[0]+'-'+ui.values[1]
								}
							});
						}
					},

					elements: {},

					debug: DEBUG
				});

				$scope.ui_elements[attrs.key]=o_option;
			}
		}
	}

AvtosilaApp.directive(
	'slider',
	slider_directive
);

