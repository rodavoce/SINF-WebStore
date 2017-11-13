angular.module('ProductCtrl', []).controller('ProductController', function($scope, $location, $http) {
    $scope.$parent.products = {category: ['rock', 'hip pop', 'eletronic', 'jazz', 'v4p0r w4v3']};
    $scope.tagline = 'The square root of life is pi!';
    $scope.$parent.productP = true;
	$scope.validProd = true;
	var srcImg = 'views/imgs/';
	
	var id = $location.search().id;
	if(id === undefined) {
		$scope.validProd = false;
		return;
	}
	var url = "http://localhost:49822/api/Artigos?id=" + id;
	
	$http.get(url, {
        headers: {
            "content-type" : "application/json"
        }
    }).then(function (response) {
        console.log(response);

        $scope.product = response.data;
		if($scope.product === undefined) {
			$scope.validProd = false;
			return;
		}
		if($scope.product.Autor === null || $scope.product.Autor === "") $scope.product.Autor = 'Unknown';
		if($scope.product.ImgURL === null || $scope.product.ImgURL === "") $scope.product.ImgURL = srcImg + 'default/750x500.png';
		else $scope.product.ImgURL = srcImg + 'artigos/' + id + '/' + $scope.product.ImgURL;
		$scope.product.PrecoFinal = $scope.product.PrecoFinal.toFixed(2);
		$scope.valIni = $scope.product.PrecoFinal;
		$scope.availability = [];
		
		var stock = response.data.STKArm;
		for(var i = 0;i < stock.length; i++){
			var dist = response.data.Distritos[i];
			var loc = response.data.Localidades[i];
			if(stock[i] !== undefined && stock[i] > 0){
				if(dist !== undefined && dist !== ""){
					if(!$scope.availability.includes(dist))
						$scope.availability.push(dist);
				}
				else if(loc !== undefined && loc !== ""){
					if(!$scope.availability.includes(loc))
						$scope.availability.push(loc);
				}
			}
		}
		if($scope.availability.length === 0){
			$scope.availability.push('Not Available!');
		}

		if ($scope.product.idFamilia && $scope.product.idSubFamilia) {
            var url = "http://localhost:49822/api/Artigos?id=" + id +"&genero=" + $scope.product.idFamilia + "&subgenero=" + $scope.product.idSubFamilia;

            $http.get(url, {
                headers: {
                    "content-type" : "application/json"
                }
            }).then(function (response) {
            	$scope.related = [];
				//TODO Destrolhar
            	for (var i = 0; i < response.data.length; i += 4) {
					$scope.related.push(response.data.slice(i, i + 4).map(
						function (item) {
							if(item.ImgURL === null || item.ImgURL === "") 
								item.ImgURL = srcImg + 'default/500x500.png';
							else 
								item.ImgURL = srcImg + 'artigos/' + item.CodArtigo + '/' + item.ImgURL;		
						return item;
						}));
				}
			});
		}

    }, function (x) {
    });
	$scope.amount = 1;	
	$scope.changePrice = function(val){
		if($scope.amount === 0 && val < 0)return;
		$scope.amount += val;
		$scope.product.PrecoFinal = $scope.amount * $scope.valIni;
		$scope.product.PrecoFinal = $scope.product.PrecoFinal.toFixed(2);
	}
});