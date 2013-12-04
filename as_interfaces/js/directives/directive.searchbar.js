AvtosilaApp.directive(
	'searchbar',
	function(){
		return {
			restrict: 'A',
			link: function($scope, element, attrs){
				if(DEBUG) console.log('Directive searchBar:');

				var o_sb = element.searchbar({
					events: {
						//add Event
						tagIsAdded: function(i_id, s_name, el_key){
							//Актуализируем scope после добавления тега
							console.log($scope.search[el_key]);
							$scope.$apply(function(){
								$scope.search[el_key][i_id] = s_name;
							});
						},

						//delete Event
						tagIsDeleted: function(i_id, s_name, el_key){
							$scope.$apply(function(){
								delete $scope.search[el_key][i_id];
							});
						},

						setScope: function(obj){
							$scope.$apply(function(){
								var obj = obj || $scope.search;
								$scope.search=obj;
							});
						},

						clearScope: function(){
							var obj = {};
							for(var i in $scope.search) obj[i] = {};

							$scope.$apply(function(){
								$scope.search=obj;
							});
						},

						//
						keyUp: function(s_val){
							var o_autocomplete = $scope.ui_elements[attrs['key']].elements.autocomplete;
							
							$.ajax({
								type: 'GET',
								data: {search: s_val},
								url: PATH_MAP.autocomplete + '?search=' + s_val,
								success: function(data) {

									var o_data = json_decode(data);

									var list = o_autocomplete.buildAutocompleteList(o_data)

									if(list){
										o_autocomplete.html(list);
										$scope.ui_elements[attrs['key']].actions.list.open()
									}
									else {
										$scope.ui_elements[attrs['key']].actions.list.close()
									}

								},
								statusCode: {
									404: function(data) {
										console.log('Нет такой страницы:');
										console.log(data)
									},
									500: function(data) {
										console.log('Ошибка сервера:');
										console.log(data)
									}
								}
							});
						}
					},
					actions: {
						rebuildTags : function(optional_attributes){
							var self = $scope.ui_elements[attrs['key']];
							//remove all defined tags
							self.elements.selected_values.find('[data-item=tag]').remove();
							self.tag_store={};

							for(var _item_search in $scope.search ){
								for(var _item in  $scope.search[_item_search]){
									var i_id, s_name, s_key;
									if(typeof $scope.search[_item_search][_item] === 'object'){
										s_name = $scope.search[_item_search][_item]['name'];
										i_id = $scope.search[_item_search][_item]['id'];
										optional_attributes =  $scope.search[_item_search][_item]['value'];
									}else{

										s_name = $scope.search[_item_search][_item];
										optional_attributes =  {};
									}

									self.actions.addTag( i_id = i_id || _item, s_name, s_key = _item_search, optional_attributes);
								}
							}

							//check input status and change view
							if(self.actions.checkTag()) 	self.actions.input.expand();
							else {
								self.actions.input.collapse();
							}
						}
					},
					debug: DEBUG
				});

				if( typeof $scope.ui_elements[attrs['key']] === 'undefined'){
					$scope.ui_elements[attrs['key']] = [];
				}

				$scope.ui_elements[attrs['key']].push(o_sb);

				$scope.ui_elements[attrs['key']] = o_sb;
			}
		}
	}
)