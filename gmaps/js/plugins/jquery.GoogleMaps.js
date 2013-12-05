/**
 * User: fedo (fresh)
 * Date: 05.11.13
 * Time: 15:39
 */


$.fn.googleMaps = function(options){

	var default_options = {
		//Marker settings
		"marker" : {
			"title" : "Company Name",
			"icon": './i/map-marker.png',
			"size" : [40,40],
			"anchor" : [0,40]
		},
		"address" : "г. Днепропетровск, Кирова 28-А",
		"coordinate" : false,
		"id": "Карта",
		"types": ["Карта", google.maps.MapTypeId.SATELLITE],
		"style": [] //[] || src-value './js/file.json'
	},
	self = this;
	self.oz = {},
	self.options = {};

	var __construct = function(options){
		self.options = $.extend(default_options, options, true);
		var res = false;

		if(typeof self.options.style !== 'object'){//Firstly load style. loadStyle-method will callback __constructor
			var json;
			$.get(self.options.style, self.loadStyle);
		}else{

			if(typeof self.options.coordinates == 'object'){
				self.oz =  new google.maps.LatLng(self.options.coordinates[0], self.options.coordinates[1]);
				self.init(self.oz);
			}else if(self.options.address){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'address': self.options.address}, self.geocode);
			}else{
				console.warn('Please put coordinates or address');
			}
		}

		return res;
	}

	self.loadStyle = function(s_data){

		if(typeof s_data == 'object'){
			self.options.style = s_data;
		}else if(typeof s_data == 'string'){
			try {
				self.options.style = $.parseJSON(s_data);
			} catch(err) {
				console.warn('isn\'t JSON');
				console.log(data);
				return false;
			}
		}

		__construct(self.options);
	}

	self.init = function(oz) {
		var oz = oz || new google.maps.LatLng(lat, long);

//			Map Types
//			google.maps.MapTypeId.SATELLITE
//			google.maps.MapTypeId.HYBRID
//			google.maps.MapTypeId.ROADMAP
//			google.maps.MapTypeId.TERRAIN

		var mapOptions = {
			zoom: 15,
			center: oz,
			mapTypeControlOptions: {
				mapTypeIds: self.options.types
			},
			mapTypeId: self.options.id
		};

		var map = new google.maps.Map(self[0], mapOptions);


		var styledMapOptions = {name: self.options.id};
		var customMapType = new google.maps.StyledMapType(self.options.style, styledMapOptions);


		map.mapTypes.set(self.options.id, customMapType);

		var o_markerImage = new google.maps.MarkerImage(
			self.options.marker.icon,
			new google.maps.Size(self.options.marker.size[0], self.options.marker.size[1]),
			new google.maps.Point(0, 0),
			new google.maps.Point(self.options.marker.anchor[0], self.options.marker.anchor[1])
		);

		var o_marker = {
			icon: o_markerImage,
			position: oz,
			map: map,
			title: self.options.marker.title
		};

		new google.maps.Marker(o_marker);
	}

	self.geocode = function(results, status){
		if (status == google.maps.GeocoderStatus.OK) {
			var lat, long;
			lat = results[0].geometry.location.ob;//nb
			long = results[0].geometry.location.pb;//ob
			self.oz =  new google.maps.LatLng(lat, long);
			self.init(self.oz);
		}else{
			console.warn('Check geocode');
		}
	}

	return __construct(options);
}
