/**
 * Директива options обслуживает чекбоксы и радиобатоны
 */

AvtosilaApp.directive(
	'options',
	function(){
		return {
			restrict: 'A',
			link: function($scope, element, attrs){
				if(DEBUG) console.log('Directive options:');

				var o_value = element.jattr('data-value') || {};
				var s_method_name = attrs['type'] || 'checkbox';
				var o_option = element[s_method_name]({
					events: {
						//add Event. Checkbox set
						isChecked: function(i_id, s_name, el_key){

							$scope.$apply(function(){
								$scope.search[el_key][i_id] = s_name;
							});
						},

						//delete Event. Checkbox unset
						isUnchecked: function(i_id, s_name, el_key){
							$scope.$apply(function(){
								delete $scope.search[el_key][i_id];
							});
						}
					},
					debug: DEBUG
				});

				//push UI-element to model
				if( typeof $scope.ui_elements[o_value['key']] === 'undefined'){
					$scope.ui_elements[o_value['key']] = [];
				}
				$scope.ui_elements[o_value['key']].push(o_option);

				//additional functions for item object of UI

				//Ф-я актуализирует состояние чекбоксов относительно модели $scope.search.options
				$scope.ui_elements[o_value['key']].rebuildOptions = function(newValue){
					$($scope.ui_elements[o_value['key']]).each(function(){
						var el = $(this);
						var o_data = el.jattr('data-value');
						if(typeof newValue[o_data.id] !== 'undefined'){
							el.prop('checked', true);
						}else{
							el.prop('checked', false);
						}
					});
				};
			}
		}
	}
)

AvtosilaApp.directive(
	'optionsGroup',
	function(){
		return {
			restrict: 'A',
			link: function ($scope, element, attrs){

				if(DEBUG) console.log('Directive optionsGroup:');
				var s_key = attrs['key'] || 'options';
				var o_value = element.jattr('data-value') || {};
				var s_method_name = 'checkbox';//attrs['type'] || 'checkbox';

				//init model
				if(typeof $scope.search[s_key] === 'undefined')
					$scope.search[s_key] = {};

				//define variables
				var
						_elements = element.find('[data-item]'),
						group;

				if(_elements.length > 0){
					group = element;
					element = _elements;
				}else{
					group = element
				}

				var o_option = element[s_method_name]({
					elements:{
						group: group
					},
					events: {
						//add Event. Checkbox set
						isChecked: function(i_id, s_name, el_key){
							$scope.$apply(function(){
								$scope.search[el_key][i_id] = s_name;
							});
						},

						//delete Event. Checkbox unset
						isUnchecked: function(i_id, s_name, el_key){
							$scope.$apply(function(){
								delete $scope.search[el_key][i_id];
							});
						}
					},
					debug: DEBUG
				});

				//push UI-element to model
				if( typeof $scope.ui_elements[s_key] === 'undefined'){
					console.warn('New ui_element: '+s_key);
					$scope.ui_elements[s_key] = [];
				}

				$scope.ui_elements[s_key].push(o_option);

				//additional functions for item object of UI
				//Ф-я актуализирует состояние чекбоксов относительно модели $scope.search.options
				$scope.ui_elements[s_key].rebuildTags = function(newValue){
					for(var i=0; i< $scope.ui_elements[s_key].length; i++){
						$scope.ui_elements[s_key][i].each(function(){
							var el = $(this);
							var o_data = el.length ? el.jattr('data-value') : {};

							if(o_data && typeof newValue !== 'undefined' && typeof newValue[o_data.id] !== 'undefined'){
								if(el.attr('type'))
									el.prop('checked', true);
								else
									el.addClass($scope.ui_elements[s_key][0].activeClass);
							}else{
								if(el.attr('type'))
									el.prop('checked', false);
								else
									el.removeClass($scope.ui_elements[s_key][0].activeClass);
							}
						})
					}
				};
			}
		}
	}
)