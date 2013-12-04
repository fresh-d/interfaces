/**
 * User: fedo
 * Date: 02.08.13
 * Time: 10:34
 * Директива обрабатывает данные измененные после UI-события мультиселекта
 */
AvtosilaApp.directive(
	'multiselect',
	function(){
		return {
			restrict: 'A',
			link: function($scope, element, attrs){
				console.log('Directive multiselect:');

				var s_key = attrs['key'] || 'options';
				//init model
				if(typeof $scope.search[s_key] === 'undefined')
					$scope.search[s_key] = {};

				var o_ms = element.multiselect({
					events: {
						tagIsAdded: function(i_id, s_name, el_key){
								$scope.$apply(function(){
								$scope.search[el_key][i_id] = s_name;
							});
						},
						tagIsDeleted: function(i_id, s_name, el_key){
							$scope.$apply(function(){
								delete $scope.search[el_key][i_id];
							});
						}
					},
					actions: {
						/*rebuildTags : function(o_data){
							//delete all exist tags
							$scope.ui_elements[attrs['key']][0].elements.selected_values.find('[data-item=tag]').remove();

							//show tag in list 
							$scope.ui_elements[attrs['key']][0].elements.item_choose.removeClass('active');

							for(var _item in o_data){
								this.addTag(_item, o_data[_item], attrs['key']);
							}

							//check object
							if(typeof $scope.search[attrs['key']] === 'object' && empty($scope.search[attrs['key']])){
								//show placeholder if obj is empty
								$scope.ui_elements[attrs['key']][0].elements.placeholder.show();
							}
						}*/
					},
					debug: DEBUG
				});

				if( typeof $scope.ui_elements[attrs['key']] === 'undefined'){
					$scope.ui_elements[attrs['key']] = [];
				}

				$scope.ui_elements[attrs['key']].push(o_ms);


				$scope.ui_elements[attrs['key']].rebuildTags = function(o_data){
					//delete all exist tags
					if(! $.isEmptyObject($scope.ui_elements[attrs['key']][0].elements.selected_values.find('[data-item=tag]')))
						$scope.ui_elements[attrs['key']][0].elements.selected_values.find('[data-item=tag]').remove();

					//show tag in list
					if(! $.isEmptyObject($scope.ui_elements[attrs['key']][0].elements.item_choose))
						$scope.ui_elements[attrs['key']][0].elements.item_choose.removeClass('active');

					for(var _item in o_data){
						$scope.ui_elements[attrs['key']][0].actions.addTag(_item, o_data[_item], attrs['key']);
					}

					//check object
					if(typeof $scope.search[attrs['key']] === 'object' && empty($scope.search[attrs['key']])){
						//show placeholder if obj is empty
						$scope.ui_elements[attrs['key']][0].elements.placeholder.show();
					}
				}
			}
		}
	}
)