(function () {
	'use strict';

	var CartService = function () {
		var cartService = {
			items: []
		};
		cartService.push = function (item) {
			var isDuplicated = false;
			cartService.items.forEach(function (data) {
				if (data.id === item.id) {
					isDuplicated = true;
					return;
				}
			});
			if (!isDuplicated) {
				cartService.items.push(item);
			}
		};
		cartService.remove = function (id) {
			for (var i = 0; i < cartService.items.length; i++) {
				if (cartService.items[i].id === id) {
					cartService.items.splice(i, 1);
					return;
				}
			}
		};
		return cartService;
	};

	var ModelCtrl = function ModelCtrl($scope, RainbowAPI) {
		$scope.products = [];

		$scope.getClass = function (pClass) {
			return pClass.toLowerCase().replace(':', ' ');
		};

		RainbowAPI.getProducts().then(function (data) {
			$scope.products = data;

			var residential = angular.element('#btnResidencial');
			var subSections = angular.element('.subContainer-buttons');
			var commercial = angular.element('#btnCommercial');
			var itemProduct = angular.element('.itemProduct');

			var onResidentialClick = function() {
				subSections.toggle('slow');
			};

			/*var onCommercialClick = function() {
				subSections.css('display', 'none');
				itemProduct.each(function(a, b) { 
					if (angular.element(b).hasClass('commercial')) { 
						console.log( angular.element(itemProduct.find('commercial')))  
					}  
				}); 
			};*/

			residential.on('click', onResidentialClick);
			commercial.on('click', onCommercialClick);
			angular.element('#Container').mixItUp();
			//residential.click();
		});
	};

	var ModelsDetail = function ModelsDetail($scope, $stateParams, RainbowAPI, CartService) {
		$scope.sProd = [{ id: '1' }];

		$scope.convertType = function (type) {
			if (!type) { return ''; }
			return type.replace(':', ' ');
		};

		$scope.quote = function () {
			CartService.items.push($scope.product);
			var message = angular.element('.message-successful');
			message.show(300).delay(6000).hide(200);
			console.log(message);
			//alert('Agregado');
		};

		RainbowAPI.getProducts().then(function (data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].id === $stateParams.id) {
					$scope.product = data[i];
					if (i === 0) {
						$scope.last = data[data.length];
					} else {
						$scope.last = data[i-1];
					}
					if (i === data.length) {
						$scope.last = data[0];
					} else {
						$scope.last = data[i+1];
					}
				}
			}
		});

	};

	angular.module('rainbowApp')
		.factory('CartService', [CartService])
		.controller('ModelCtrl', ['$scope','RainbowAPI', ModelCtrl])
		.controller('ModelDetailCtrl', ['$scope', '$stateParams', 'RainbowAPI', 'CartService', ModelsDetail]);
})();
