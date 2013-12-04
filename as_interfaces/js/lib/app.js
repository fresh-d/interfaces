
//Main module
var AvtosilaApp = angular.module('AvtosilaApp', ['searchModules']);

//
angular.module('searchModules', [])

.factory('SearchInputService', function($scope) {
	return function($scope){

	};
});

/**
 * Контроллер связывает изменение данных UI-элементов между собой
 * Напр. изменение состояния мультиселекта должно повлечь за собой изменение поисковой строки
 */
AvtosilaApp.controller(
		'AppCtrl',
		[
			'$scope',
			function ($scope, $element) {
				if(DEBUG) console.log('AppCtrl is run');

				var self = this;

				//define default values
				$scope.search = {
					models: {},
					brands: {},
					colors: {},
					options: {},
					bodies: {},
					drives: {},
					transmissions: {},
					year_diapason : {},
					mileage_diapason : {},
					engine_diapason: {},
					price_diapason: {},
					regions: {},
					fuel: {}

				}
				$scope.ui_elements = {};
				$scope.actions = {};

				$scope.actions.change_search_input = function(){
					//rebuild summary input search
					if(typeof $scope.ui_elements.searchbar !== 'undefined')
						$scope.ui_elements.searchbar.actions.rebuildTags();

					//search result
					$.ajax({
						type: 'GET',
						data: {search: $scope.search},
						url: PATH_MAP.autocomplete || '/ajax/searchcar',
						success: function(html) {
							$("[data-item=search_results]").html(html)
						},
						statusCode: {
							404: function(data) {
								console.warn('Нет такой страницы:');
								console.log(data)
							},
							500: function(data) {
								console.warn('Ошибка сервера:');
								console.log(data)
							}
						}
					});
				}

				/**
				 * Function generate default action
				 * _models_  - is not cars model, it is a data-model pattern
				 * @param item - key of $scope.search
				 * @param self - link to controller
				 */
				$scope.actions.change_models_default = function(item, self){
					var callback = function(newValue, oldValue, scope){
						if(DEBUG) console.log('$scope.search.'+item+' is changed:');
						if(DEBUG) console.log($scope.search);

						//rebuild models tag of models
						if(typeof $scope.ui_elements[item] !== 'undefined' && typeof $scope.ui_elements[item].rebuildTags !== 'undefined'){
							$scope.ui_elements[item].rebuildTags(newValue);
						}else{
							if(DEBUG) console.error('No ui elements: ' + item);
						}
						$scope.actions.change_search_input();
					}

					return callback;
				}

				$scope.actions.change_brands = function(newValue, oldValue, scope){

					//build and run default actions
					new $scope.actions.change_models_default('brands', self)(newValue, oldValue, scope);
					
					//Replace models multiselect
					var o_data={
						model: 'Models',
						condition: newValue
					};

					$.ajax({
						type: 'GET',
						data: o_data,
						url: PATH_MAP.models || '/ajax/models',
						success: function(html) {
							console.log();
							if(html){
								$scope.ui_elements.models[0].elements.multi_select_list.find('ul').html(html);
							}
						},
						statusCode: {
							404: function(data) {
								console.warn('Нет такой страницы:');
								console.log(data)
							},
							500: function(data) {
								console.warn('Ошибка сервера:');
								console.log(data)
							}
						}
					});
				}



				//
				$scope.actions.change_year_diapason =
				$scope.actions.change_price_diapason =
				$scope.actions.change_mileage_diapason =
				$scope.actions.change_engine_diapason =
					function(newValue, oldValue, scope){
						if(DEBUG) console.log('$scope.search.diapason_* is changed:');
						if(DEBUG) console.log(newValue);

						if($.isEmptyObject(newValue)){
							for(var key in oldValue) 	break;

							if(key)
								$scope.ui_elements[key].actions.setDefault();
						}

						if(typeof $scope.ui_elements.searchbar !== 'undefined')
							$scope.ui_elements.searchbar.actions.rebuildTags({'data-value': JSON.stringify(newValue)});
					}

				//set controllers method to scope
				//$scope[arguments.callee.name]  = self;

				for(var _item in $scope.search)
				{
					if(typeof $scope.actions['change_'+_item] === 'function'){
						//set callback function
						var callback = $scope.actions['change_'+_item];
					}else{
						//set callback function. If Callback function undefined use default change_models_default.
						var callback = new $scope.actions.change_models_default(_item, self);
					}

					//Ставим наблюдение за изменением модели
					$scope.$watch('search.'+_item, callback, true);
				}
			}
		]
);



