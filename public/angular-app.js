//https://www.termsfeed.com/privacy-policy/dd84d1c9d81d8cc8444a6069335c535a
var app = angular.module('Productsearch', ['ngAria','ngAnimate','ngMaterial','ui.bootstrap','angular-svg-round-progressbar']);
app.controller('formController',['$timeout','$scope', '$http', function($timeout,$scope, $http){
	$timeout(function() {
		    $('[data-toggle="tooltip"]').each(function(index) {
		      // sometimes the title is blank for no apparent reason. don't override in these cases.
		      if ($(this).attr("title").length > 0) {
		        $( this ).attr("data-original-title", $(this).attr("title"));
		      }
		    });
		    $timeout(function() {
		      // finally, activate the tooltips
		      $(document).tooltip({ selector: '[data-toggle="tooltip"]'});
		    }, 500);
		}, 1500);

	$scope.keyword='';
	$scope.whereCameFrom = '';
	$scope.location_btn = "here";
	$scope.result = {};
	$scope.justReset = 1;
	$scope.noresult = false;
	$scope.nowishlist = false;
	$scope.detailBtnFlag=0;
	$scope.selectedItemObj = {};
	$scope.selectedCategory = 'all';
	$scope.selectedCondition = {};
	$scope.selectedShipping = {};
  $scope.geojson ='';

	$scope.service = {};
	$scope.service.flag = 0;


	$scope.itemList = {};


	$scope.progress = false;
	$scope.wishListFlag = 0;
	$scope.submit_btn = 0;

	$scope.showResults = function(){
		$scope.detailBtnFlag=1;
		$scope.nowishlist = false;
		if($scope.submit_btn==0){
			$scope.wishListFlag = 0;
			$scope.service.flag = 0;
			$scope.noresult = false;
			return;
		}
		$scope.wishListFlag = 0;
		console.log('in showresults');
		if($scope.submit_btn==1 && product_data.findItemsAdvancedResponse[0].searchResult[0]['@count']>0){
			$scope.service.flag = 1;
		}
		else if($scope.noresult==false){
			$scope.service.flag = 1;
		}
		else{
			$scope.service.flag = 0;
		}
	}

	$scope.showWishlist = function(){
		$scope.service.flag = 0;
		$scope.noresult = false;
		if(localStorage.getItem("savedData")){
			var cookie = JSON.parse(localStorage.getItem("savedData"));
			if(cookie.length>0){
				$scope.wishListFlag = 1;
			}
			else{
				$scope.nowishlist = true;
			}
		}
		else{
			$scope.nowishlist = true;
		}
		$scope.itemDataFlag = 0;
	}

	$scope.localData = [];
	localStorage.setItem("savedData", JSON.stringify($scope.localData));
	$scope.add_to_wishlist = function(obj){
		$scope.localData = JSON.parse(localStorage.getItem("savedData"));
		console.log($scope.localData);
		var i = 0;
		var found = false;
		for(i = 0; i < $scope.localData.length; i++) {
		    if ($scope.localData[i].itemId[0] == obj.itemId[0]) {
		        found = true;
		        break;
		    }
		}
		if(found){
			$scope.localData.splice(i, 1);
			localStorage.removeItem("savedData");
			localStorage.setItem("savedData", JSON.stringify($scope.localData));
		}
		else{
			$scope.localData.push(obj);
			localStorage.removeItem("savedData");
			localStorage.setItem("savedData", JSON.stringify($scope.localData));
		}
	}

	$scope.check_localStorage = function(obj_id){
		if(localStorage.getItem("savedData")){
			var cookie = JSON.parse(localStorage.getItem("savedData"));
				if(cookie.length==0 && $scope.wishListFlag==1){
					$scope.nowishlist = true;
				}
				else{
					$scope.nowishlist = false;
				}
			return cookie.some(item=> item.itemId[0]===obj_id)
		}
		else{
			return false;
		}
	}

	$scope.totalShopping = function(){
						var cookie = JSON.parse(localStorage.getItem("savedData"));
						var sum = 0;
						for(var i = 0; i < cookie.length; i++) {
							sum+=Number(cookie[i].sellingStatus[0].currentPrice[0].__value__);
						}
						return sum.toFixed(2);
					}

///submit///

  	$scope.submit = function(){
  		$scope.detailBtnFlag=1;
  		$scope.submit_btn = 1;
  		$scope.wishListFlag = 0;
  		$scope.progress = true;
			console.log("setText");
			var pin= angular.element(document.getElementsByName('geojson')[0]).val();
			console.log(pin);
			var pin= angular.element(document.getElementsByName('geojson')[0]).val();
			var i=0;
			var url_contents = "";

			//add keyword to the url
			var keyword = $scope.keyword;
  		url_contents = "?keywords=" + keyword;

			if($scope.selectedCategory != "all")
			{
				var category = $scope.selectedCategory;
				url_contents+="&categoryId="+category;
			}
  			// url_contents+="&categoryId="+$scope.selectedCategory;
			if($scope.location_btn){
  			if($scope.location_btn=="here"){
  				//fetchLocation();
  				//url_contents+="&buyerPostalCode="+$scope.currentZip;
					url_contents+="&buyerPostalCode="+pin;
  			}
  			else if($scope.location_btn=="radiozip"){
  				url_contents+="&buyerPostalCode="+$scope.hereText;
  			}
  		}
			if($scope.distance){
				//$url= $url."&itemFilter(".$i.").name=MaxDistance&itemFilter(".$i.").value=".$dis;
				var dis = "&itemFilter("+i+").name=MaxDistance&itemFilter("+i+").value="+$scope.distance;
				i=i+1;
				url_contents+=dis;
  			//strQuery+="&Distance="+$scope.distance;
  		}
  		else{
				var dis = "&itemFilter("+i+").name=MaxDistance&itemFilter("+i+").value=10";
				i=i+1;
				url_contents+=dis;
  			// strQuery+="&Distance=10";
  		}
  		if($scope.selectedShipping){
  			if($scope.selectedShipping.local){
					var str_loc = "&itemFilter("+i+").name=LocalPickupOnly&itemFilter("+i+").value=true";
					i=i+1;
					url_contents+=str_loc;
  				//strQuery+="&Local="+$scope.selectedShipping.local;
  			}
  			if($scope.selectedShipping.free){
					var str_free ="&itemFilter("+i+").name=FreeShippingOnly&itemFilter("+i+").value=true";
					i=i+1;
  				// strQuery+="&Free="+$scope.selectedShipping.free;
					url_contents+=str_free;
  			}
  		}
  		if($scope.selectedCondition){
				var arr = [];
				var len = arr.length;
				var url_add ="";
				console.log("length:"+$scope.selectedCondition.length);
  			if($scope.selectedCondition.new){
					arr.push('New');
  				//url_contents+="&New="+$scope.selectedCondition.new;
  			}
  			if($scope.selectedCondition.used){
					arr.push('Used');
  				//url_contents+="&Used="+$scope.selectedCondition.used;
  			}
  			if($scope.selectedCondition.unspecified){
					arr.push('Unspecified');
  				//url_contents+="&Unspecified="+$scope.selectedCondition.unspecified;
  			}
				len = arr.length;
				if(len==1)
        {
					url_add+= "&itemFilter("+i+").name=Condition&itemFilter("+i+").value(0)="+arr[0];
          //$url= $url."&itemFilter(".$i.").name=Condition&itemFilter(".$i.").value(0)=".$condition[0];
          //$i=$i+1;
					i=i+1;
        }
      	else if(len==2){
					url_add+= "&itemFilter("+i+").name=Condition&itemFilter("+i+").value(0)="+arr[0];
					url_add+="&itemFilter("+i+").value(1)="+arr[1];
					i=i+1;
        // $url= $url."&itemFilter(".$i.").name=Condition&itemFilter(".$i.").value(0)=".$condition[0];
        // $url= $url."&itemFilter(".$i.").value(1)=".$condition[1];
        // $i=$i+1;
      	}
      	else if(len==3)
        {
					url_add+= "&itemFilter("+i+").name=Condition&itemFilter("+i+").value(0)="+arr[0];
					url_add+="&itemFilter("+i+").value(1)="+arr[1];
					url_add+="&itemFilter("+i+").value(2)="+arr[2];
					i=i+1;
				// 	$url= $url."&itemFilter(".$i.").name=Condition&itemFilter(".$i.").value(0)=".$condition[0];
        // $url= $url."&itemFilter(".$i.").value(1)=".$condition[1];
        // $url= $url."&itemFilter(".$i.").value(2)=".$condition[2];
        // $i=$i+1;
        }
				console.log(url_add);
				url_contents+=url_add;
  		}
			console.log(url_contents);


			var req_url = "http://localhost:8081/getProducts"+url_contents;
      $http({method: 'GET' , url: req_url}).then(
			function(response){
          try{
					$scope.product = response;
					product_data = $scope.product.data;
					console.log(product_data);
					var count = product_data.findItemsAdvancedResponse[0].searchResult[0];
				  if(count['@count']!=0){
								console.log('product_data');
								console.log(product_data.findItemsAdvancedResponse);
								$scope.itemList = count.item;
								console.log($scope.itemList);
								$scope.progress = false;
					}
					else{
								console.log('inside');
								$scope.noresult = true;
								//$scope.datareceived = false;
								$scope.service.flag = 0;
								$scope.progress = false;
								return
					}
				}
					catch(err){
							console.log("errored");
					}

					$scope.service.flag = 1;
					$scope.viewby = 10;
					console.log($scope.itemList);
				  	$scope.totalItems = $scope.itemList.length;
				  	$scope.itemsPerPage = 10;

				  	$scope.currentPage = 1;
				  	$scope.maxSize = 5; //Number of pager buttons to show

  			},
	  		function(error){
	 			console.log("Unable to connect to server");
		 	}
	 	);
  	};
  	$scope.progress = false;
  	$scope.itemDataFlag = 2;


  	$scope.itemDetails = function(obj, clickedPage){
  		$scope.selectedProductID = obj.itemId[0];
  		$scope.selectedItemObj = obj;
  		console.log($scope.selectedProductID);
  		$scope.detailBtnFlag=0;
  		$scope.progress = true;
  		$scope.whereCameFrom = clickedPage;
  		// var itemUrl = "?itemID=";
  		// itemUrl+=obj.itemId[0];
  		// itemUrl+="&Keyword="+$scope.keyword;
			var itemUrl_demo = "?itemID=";
			var itemUrl = "?ItemID=";
  		itemUrl+=obj.itemId[0];
			itemUrl_demo+=obj.itemId[0];
  		itemUrl_demo+="&Keyword="+$scope.keyword;
			var item_pic = "?q=";
			//item_pic +=$scope.keyword;
			item_pic += obj.title[0];
			var item_similar = "?itemId=";
			item_similar+=obj.itemId[0];
			//here
  		$scope.service.flag = 0;
  		$scope.wishListFlag = 0;
  		$scope.itemDataFlag = 1;
  		$scope.itemData = {};
			var req_item_url = "http://localhost:8081/getitems"+itemUrl;
  		//$http.get("http://ebay-app-236704.appspot.com/itemDetail"+itemUrl).then(
			$http({method: 'GET' , url: req_item_url}).then(
			// $http.get("http://localhost:8081/getitems"+itemUrl).then(
  		function(res){
  			console.log("h3");
  			$scope.itemData = res.data;
  			//console.log($scope.itemData);
				var data = $scope.itemData;
				var itemspec = data.Item.ItemSpecifics;
				var list = itemspec.NameValueList;
  			$scope.ItemSpecificsList = list;
  			$scope.progress = false;
  		},
  		function(error){
 			console.log("Unable to connect to server");
	 	}
	 	);



	 	$scope.showDetails = function(){
	 		console.log('showDetails');
	 		var a = $scope.service.flag;
	 		var b = $scope.wishListFlag;
	 		$scope.service.flag = 0;
	 		$scope.wishListFlag = 0;
	 		$scope.progress = true;
	 		$timeout(function(){
	 			$scope.detailBtnFlag=0;
		 		if (a==1){
		 			$scope.progress = false;
			 		$scope.itemDataFlag = 1;
			 		$scope.whereCameFrom = 'results';
		 		}
		 		if (b==1){
		 			$scope.progress = false;
			 		$scope.itemDataFlag = 1;
			 		$scope.whereCameFrom = 'wishlist';
		 		}
	 		},500)
	 	};

    $scope.ischosen = function(objID){return (objID!=obj.itemId[0])? false: true;} ;

	 	$scope.showTable = function(){
	 		$scope.itemDataFlag = 0;
	 		$scope.progress = true;
		 		$timeout(function(){
		 			$scope.detailBtnFlag=1;
	 				$scope.progress = false;
					if($scope.whereCameFrom=='results'){
		 			$scope.service.flag = 1;
			 		}
			 		else if($scope.whereCameFrom=='wishlist'){
			 			$scope.wishListFlag = 1;
			 		}
	 				console.log("showTableinTO");
	 			},500)
	 		console.log('showTable');
	 	};
    // FB.ui(method: 'share',display: 'popup',quote: "Buy "+itemData.Item.Title+" at "+itemData.Item.CurrentPrice.Value+" from link below.", href: $scope.itemData.Item.ViewItemURLForNaturalSearch,}, function(response){});
	 	$scope.share = function(){
  			// var shareMsg = "Buy "+$scope.itemData.Item.Title+" at "+$scope.itemData.Item.CurrentPrice.Value+" from link below.";
  			FB.ui({
			        method: 'share',
			        display: 'popup',
			        quote: "Buy "+$scope.itemData.Item.Title+" at "+$scope.itemData.Item.CurrentPrice.Value+" from link below.",
			        href: $scope.itemData.Item.ViewItemURLForNaturalSearch,
			    }, function(response){});
  		};

	 	//$http.get("http://ebay-app-236704.appspot.com/googlePhotos"+itemUrl).then(
		var image_url = "http://localhost:8081/photos"+item_pic;
		$http({method: 'GET' , url: image_url}).then(
		function(resp){
				var j=0;
  			$scope.gallery = resp.data.items;
  			$scope.api_img = [];//use dict instead
				do{
					$scope.api_img.push($scope.gallery[j].link);
					j=j+1;
				}
				while(j<$scope.gallery.length);
  		},
  		function(e){
 			console.log("No connection to server");
	 	}
  		);
     var similar_url = "http://localhost:8081/getsimilar"+item_similar;
			$http({method: 'GET' , url: similar_url}).then(
			//$http.get("http://localhost:8081/getsimilar"+item_similar).then(
  		function(resp){
  			console.log("similar items");
  			$scope.similarItems = resp.data.getSimilarItemsResponse.itemRecommendations.item;
				// console.log($scope.similarItems);
				console.log($scope.similarItems);
				// var cnt =0;
				// do{
				// 	$scope.similarItems[cnt].timesLeft = Number($scope.similarItems[cnt].timeLeft.substring($scope.similarItems[cnt].timeLeft.lastIndexOf("P") + 1, $scope.similarItems[cnt].timeLeft.lastIndexOf("D")));
				//  	cnt=cnt+1;
				//  }
				// while(cnt<20);
  			// for(var i=0;i<20;i++){
  			// 	$scope.similarItems[i].timesLeft = Number($scope.similarItems[i].timeLeft.substring($scope.similarItems[i].timeLeft.lastIndexOf("P") + 1, $scope.similarItems[i].timeLeft.lastIndexOf("D")));
  			// }
  			console.log($scope.similarItems);
  			$scope.limit=5;
			  $scope.toggleshow = function(){
				if($scope.similarItems.length> 5 && $scope.similarItems.length!=$scope.limit)
					$scope.limit = $scope.similarItems.length;
				else
					$scope.limit = 5;
			};

			// $scope.showMore=function(){
			// 	$scope.limit = $scope.similarItems.length;
			// };
			// $scope.showLess = function(){
		  //    $scope.limit = 5;
			// };

  		},
  		function(error){
 			console.log("Unable to connect to server");
	 	}
  		);
      //convert to if else
			console.log('convert to if else');
			try{
	  		$scope.ShipCost = obj.shippingInfo[0].shippingServiceCost[0].__value__;
				console.log($scope.ShipCost);
	  		}
	  		catch(err){}
	  		try{
	  		$scope.ShipLocation = obj.shippingInfo[0].shipToLocations[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.Handling = obj.shippingInfo[0].handlingTime[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.Expedite = obj.shippingInfo[0].expeditedShipping[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.OneShip = obj.shippingInfo[0].oneDayShippingAvailable[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.returns = obj.returnsAccepted[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.feedbackScore = obj.sellerInfo[0].feedbackScore[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.feedPercent = obj.sellerInfo[0].positiveFeedbackPercent[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.starRating = obj.sellerInfo[0].feedbackRatingStar[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.topRated = obj.sellerInfo[0].topRatedSeller;
	  		}
	  		catch(err){}
	  		try{
	  		$scope.storeName = obj.storeInfo[0].storeName[0];
	  		}
	  		catch(err){}
	  		try{
	  		$scope.storeURL = obj.storeInfo[0].storeURL[0];
	  		}
	  		catch(err){}
  	};

  	$scope.reset_all = function(){
  		$scope.keyword = '';
  		$scope.selectedCondition.new = '';
  		$scope.selectedCondition.used = '';
  		$scope.selectedCondition.unspecified = '';
  		$scope.selectedShipping.local = '';
  		$scope.selectedShipping.free = '';
  		$scope.distance = '';
  		$scope.location_btn = 'here';
  		$scope.hereText = '';
  		$scope.selectedCategory = 'all';
  		$scope.wishListFlag = 0;
  		$scope.itemDataFlag = 2;
  		$scope.service.flag = 0;
  		$scope.progress = false;
  		$scope.submit_btn = 0;
		$scope.itemList = {};
		$scope.service = {};
		$scope.dropDownList = [];
		$scope.whereCameFrom = '';
		$scope.itemData = {};
		$scope.similarItems = [];
		$scope.gallery = [];
		$scope.selectedProductID = 0;
		$scope.justReset = 0;
		$scope.noresult = false;
		$scope.detailBtnFlag=0;
		$scope.selectedItemObj = {};
  	}

}]);
