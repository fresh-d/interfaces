/**
 * YouTube Flash-video player plugin
 * it's created html-elements for control youtube embed object
 *
 * Rewrited from youTubePlayer-jquery.1.0.js
 * fedo - studio-fresh
 */

(function($){
	
	$.fn.youTubeEmbed = function(settings){
		
		// Settings can be either a URL string,
		// or an object
		
		if(typeof settings == 'string'){
			settings = {'video' : settings}
		}
		
		// Default values
		var def = {
			width		: 640,
			progressBar	: true,
			toolBar: false,
			fullScreen: false,
			ddBar: (typeof $.fn.easydrag == 'function') ? true : false,
			controlBar: {holder: 'control'},
			volumeBar: {holder: 'volume', grade: 10},
			timeBar: {time_left: 'time_left', time_remaning: 'time_remaning'},// name : className
			playingClass: 'playing',
			pausedClass: 'paused',
			stoppedClass: 'stopped' //!!! not implemented. Options to the feature
		};

		//merge opions and extend jQuery
		//var settings = merge_options(def, settings);
		settings = $.extend(def, settings);

		//elements
		var elements = {
			originalDIV	: this,	// The "this" of the plugin
			container	: null,	// A container div, inserted by the plugin
			control		: null,	// The control play/pause button
			player		: null,	// The flash player
			progress	: null,	// Progress bar
			elapsed		: null,	// The light blue elapsed bar
			volume: null, //volume bar
			timer: null, // time bar
			toolbar: null //tool-bar container
		};
		

		try{	

			settings.videoID = settings.video.match(/v=(.{11})/)[1];
			
			// The safeID is a stripped version of the
			// videoID, ready for use as a function name

			settings.safeID = settings.videoID.replace(/[^a-z0-9]/ig,'');

		} catch (e){
			// If the url was invalid, just return the "this"
			return elements.originalDIV;
		}

		// Fetch data about the video from YouTube's API

		var youtubeAPI = 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc';

		$.get(youtubeAPI,{'q':settings.videoID},function(response){
			
			var data = response.data;
	
			if(!data.totalItems || data.items[0].accessControl.embed!="allowed"){
				
				// If the video was not found, or embedding is not allowed;
				
				return elements.originalDIV;
			}

			// data holds API info about the video:
			
			data = data.items[0];
			
			settings.ratio = 3/4;
			if(data.aspectRatio == "widescreen"){
				settings.ratio = 9/16;
			}
			
			settings.height = Math.round(settings.width*settings.ratio);

			// Creating a container inside the original div, which will
			// hold the object/embed code of the video

			elements.container = $('<div>',{class: 'flashContainer', css:{
				width	: settings.width,
				height	: settings.height
			}}).appendTo(elements.originalDIV);

			// Embedding the YouTube chromeless player
			// and loading the video inside it:

			var player = elements.container.flash({
				swf			: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3&controls=0',
				id				: 'video_'+settings.safeID,
				height		: settings.height,
				width		: settings.width,
				allowScriptAccess:'always',
				wmode		: 'transparent',
				flashvars		: {
					"video_id"		: settings.videoID,
					"playerapiid"	: settings.safeID
				}
			});

			/**
			 * Build Player
			 */

			//set tool-bar container
			elements.toolbar = $('<div>',{class: 'toolBar'})

			// We use get, because we need the DOM element
			// itself, and not a jquery object:
			elements.player = elements.container.flash().get(0);

			// Creating the blocked Div
			elements.control = $('<div>',{style: 'width: 100%; height:100%;position: absolute;top: 0;left: 0;'})
							   .appendTo(elements.container);

			// Creating the control Div. It will act as a ply/pause button
			elements.control = $('<div>',{class:'controlDiv play'})
							   .appendTo(elements.container);

			//create img thumb
			//http://img.youtube.com/vi/VIDEO_ID/0.jpg
			if(settings.imgHolder){
				elements.img = $('<div>', {class: settings.imgHolder}).html( $("<img>", {src: 'http://img.youtube.com/vi/'+settings.safeID+'/0.jpg'}));
				//adding img thumb in to container
				elements.img.appendTo(elements.container)
			}
			

			//Build controlBar.
			if(settings.controlBar){
				var a_bar = $('<div>',{class: settings.controlBar.holder});
				for(item in settings.controlBar.buttons){
					elements.control.push( $('<span>', {class: settings.controlBar.buttons[item]}).appendTo(a_bar[0]));
				}

				//add toolbar to common control elements
				a_bar.appendTo(elements.toolbar);
			}

			// If the user wants to show the progress bar:
			if(settings.progressBar){
				//Create progress-bar elements
				elements.progress =	$('<div>',{class: 'progressBar'})
									.appendTo(elements.toolbar);

				//Create elapsed elements
				elements.elapsed =	$('<div>',{class: 'elapsed'});

				//added elapsed element to progress bar
				elements.elapsed.appendTo(elements.progress);

				//drag-and-drop point
				elements.dd_element = $('<div>', {class: 'drop_point'});
				elements.dd_element.easydrag({allowYmove: false});

				// set a function to be called on a drop event
				elements.dd_element.ondrop(function(e, element){
					//console.log(e);
				});

				elements.dd_element.appendTo(elements.progress);
				//added summing elements to progress bar


				//bind click to progress-bar
				elements.progress.click(function(e){
					
					// When a click occurs on the progress bar, seek to the
					// appropriate moment of the video.
					var ratio = (e.pageX-elements.progress.offset().left)/elements.progress.outerWidth();
					var progress = ratio * 100;
					elements.elapsed.width(progress + '%');
					elements.dd_element.css({left: progress +'%'});
					elements.player.seekTo(Math.round(data.duration*ratio), true);

					if(!elements.container.hasClass(settings.playingClass)){
						// If the video is currently playing, pause it:
						elements.container.removeClass(settings.playingClass);
						elements.player.pauseVideo();
					} else {

						// If the video is not currently playing, start it:
						elements.container.addClass(settings.playingClass);
						elements.player.playVideo();

						if(settings.progressBar){
							interval = window.setInterval(function(){
								var progress = ((elements.player.getCurrentTime()/data.duration)*100);
								//move drag_and_drop element
								elements.dd_element.css({left: progress +'%'});
								
								elements.elapsed.width(
									progress +'%'
								);


							},1000);
						}
					}

					return false;
				});

			}
			
			//Build fullscreen button
			if(settings.fullScreen){
				var a_bar = $('<div>',{class: settings.fullScreen.holder});
				elements.fullscreen = $('<div>').appendTo(a_bar[0]);

				//add toolbar to common control elements
				a_bar.appendTo(elements.toolbar);
			}

			//Build volumeBar
			if(settings.volumeBar){
				var a_bar = $('<ul>',{class: settings.volumeBar.holder});
				for(var i = 1; i <= settings.volumeBar.grade; i++){
					 $('<li>').html($('<span>')).appendTo(a_bar[0]);
				}
				elements.volume = a_bar;

				//add toolbar to common control elements
				elements.volume.appendTo(elements.toolbar);
			}

			//Build timeBar
			if(settings.timeBar){
				elements.timer = $('<div>', {class: settings.timeBar.holder})
						.append($('<span>', {class: settings.timeBar.time_left}).text('00:00'))
						.append(' / ')
						.append($('<span>', {class: settings.timeBar.time_remaning}).text('00:00'));

				elements.timer.appendTo(elements.toolbar);
			}

			/**
			 * End Build Player
			 */

			//set tool-bar container to global container
			if(settings.toolBar)
				elements.toolbar.appendTo(elements.container.parent());
			
			var initialized = false;

			// Creating a global event listening function for the video
			// (required by YouTube's player API):

			window['eventListener_'+settings.safeID] = function(status){

				var interval;

				// video is loaded
				if(status==-1){
					if(!initialized){
						// Listen for a click on the control button:
						elements.control.each(function(){
							$(this).click(function(){

								// If the video is not currently playing, start it:
								if(!elements.container.hasClass(settings.playingClass)){

									//elements.control.each(function(){$(this).removeClass('play replay').addClass('pause');})
									elements.container.removeClass(settings.pausedClass, settings.stoppedClass).addClass(settings.playingClass);
									elements.player.playVideo();

									//progress bar
									if(settings.progressBar){
										interval = window.setInterval(function(){
											var progress = (elements.player.getCurrentTime()/data.duration);

											//move drag_and_drop element
											elements.dd_element.css({left: progress * 100 + '%'});

											//move progress line
											elements.elapsed.width(
												(progress*100)+'%'
											);
											//timer
												//$('.'+settings.timeBar.holder).fadeIn(250);

												var time_remaning = elements.player.getDuration();
												elements.timer.find('.'+settings.timeBar.time_remaning).text(time_remaning.toMMSS())

												var time_left = elements.player.getCurrentTime();
												elements.timer.find('.'+settings.timeBar.time_left).text(time_left.toMMSS());
											//end timer
										},1000);
									}

									//on play - hide img-preview element
									if(settings.imgHolder) elements.img.fadeOut(250);

								}
								// If the video is currently playing, pause it:
								else {

									//elements.control.each(function(){$(this).removeClass('pause').addClass('play');})
									elements.container.removeClass(settings.playingClass).addClass(settings.pausedClass);
									elements.player.pauseVideo();

									if(settings.progressBar){
										window.clearInterval(interval);
									}
								}
							});
						})

						//volume-bar
						//get all li-elements
						var a_li = elements.volume.find('li');

						//set current values of volume
						var i_volume = Math.round(elements.player.getVolume());
						for(var i = 0; i < (i_volume / settings.volumeBar.grade) ; i++){
							a_li.eq(i).addClass('active');

						}
						//add slector "current" to last element
						a_li.eq(i-1).addClass('current');

						//bind action for click in to volume
						a_li.click(function(){
							var index = $(this).index() + 1;
							var i_volume = (settings.volumeBar.grade*index);
							elements.player.setVolume(i_volume);

							a_li.addClass('active').removeClass('current');//set all to active and then deleted unwanted items
							for(var i = index; i <= a_li.length; i++){
								a_li.eq(i).removeClass('active')
							}

							//to current element added "current" selector
							$(this).addClass('current');
						})


						//
						elements.fullscreen.click(function(){
							console.log('fullscreen click');
						})

						/* hover action for volume-bar
						 * temporary comments
							elements.volume.hover(function(){
								a_li.hover(function(){
									var index = $(this).index() + 1;

									//set all to active and then deleted unwanted items
									a_li.removeClass('active');

									for(var i = 0; i < a_li.length; i++){
										if(i <  index)
											a_li.eq(i).addClass('active')
										else
											a_li.eq(i).removeClass('active')
									}
								})
							},
							function(){
								var current = elements.volume.find('.current').index();
								for(var i = 0; i < a_li.length; i++){
									if(i <=  current)
										a_li.eq(i).addClass('active')
									else
										a_li.eq(i).removeClass('active')
								}
							})
						*/

						//End volume-bar

						initialized = true;
					}else{
						// This will happen if the user has clicked on the
						// YouTube logo and has been redirected to youtube.com
						if(elements.container.hasClass('playing'))
						{


							elements.control.click();
						}
					}


				}
				
				if(status==0){ // video has ended
					elements.control.each(function(){$(this).removeClass('pause').addClass('replay');});
					elements.container.removeClass('playing');
				}
			}
			
			// This global function is called when the player is loaded.
			// It is shared by all the videos on the page:


			if(!window.onYouTubePlayerReady)
			{				
				window.onYouTubePlayerReady = function(playerID){
					var player = document.getElementById('video_'+playerID).addEventListener('onStateChange','eventListener_'+playerID);
				}
			}
		},'jsonp');

		
		return elements.originalDIV;
	}

})(jQuery);