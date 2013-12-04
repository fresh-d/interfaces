/**
 * Директива price
 */

AvtosilaApp.directive(
	'price',
	function(){
		return {
			restrict: 'A',
			link: function($scope, element, attrs){
				if(DEBUG) console.log('Directive diapason price:');
				var o_data_value = element.jattr('data-value');

				var o_option = element.diapason_price({
					events: {
						change: function(store){
							$scope.$apply(function(){
								console.log(store);
								$scope.search[attrs.key][attrs.key] = //only one price diapason available
									{
										name: (!$.isEmptyObject(store.price_from) && store.price_from.value ? store.price_from.name+": "+ store.price_from.value : '')
											+ " " +
										(!$.isEmptyObject(store.price_to) && store.price_to.value ? store.price_to.name+": "+ store.price_to.value : '' )
											+ " " +
										(!$.isEmptyObject(store.currency) ? store.currency.name : ''),

										value: store
									}
								//$scope.search[attrs.key]['name'] = store;
							});
						}
					},

					elements: {},

					debug: DEBUG
				});
			}
		}
	}
);

