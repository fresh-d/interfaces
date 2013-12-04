$(function(){
	var ua = navigator.userAgent;
	var isiPad = /iPad/i.test(ua) || /iPhone/i.test(ua);
	if (isiPad) $("body").addClass("ipad");

	/*прокрутка фоток v2*/
	var photoSlideInt;
	var photoSlideTime=10;
	var photoSlideVal;
	var speed=10;
	var prevperc;
	$(document).on("mousemove",'[data-photo-gallery="prelist"]',function(e){
	if (isiPad) return;
		x = e.clientX-$(this).parent().offset().left;
		offset=$(this).width()-$(this).parent().width();
		percent=x/$(this).parent().width();

		if (percent<0.02) {
			percent=0;
		}

		if (percent>0.98) {
			percent=1;
		}

		if(DEBUG) console.log(Math.abs(percent-prevperc)<0.08);
		prevperc=percent;

		$(this).finish();
		$(this).css({"margin-left":-(offset*percent)});
	});

	$(document).on("mouseleave",'[data-photo-gallery="prelist"]',function(e){
		clearInterval(photoSlideInt);
	});

//	function photoSliding(el,offset,percent,speed){
//		pos=parseInt($(el).css("margin-left"))+speed*(0.5-percent);
//		if (pos<-offset) pos=-offset;
//		if (pos>0) pos=0;
//		//console.log(pos, offset);
//		$(el).css({"margin-left":pos});
//	}


	// =================================================================

	// =================================================================

	/* всплывающая фотогалерея */
	$(document).on("click",'[data-photo-gallery="list"] [data-photo-gallery-id], [data-photo-gallery="simple"] [data-photo-gallery-id], [data-photo-gallery="prelist"] [data-photo-gallery-id]',function(){
		$(this).parents("ul").find("li").removeClass("active");
		$(this).parents("li").addClass("active");

		//если клик на странице машины - активируем нужную фотку в галерее по параметру data-photo-gallery-id
		if ($(this).parents('[data-photo-gallery="prelist"]').length>0){
			$('[data-photo-gallery="list"] [data-photo-gallery-id="'+$(this).attr("data-photo-gallery-id")+'"]').click();
		}

    var tmpImg = new Image();
    tmpImg.onload = function() {
      $('[data-photo-gallery="photo"]').css("background-image","url("+tmpImg.src+")");
      $('[data-photo-gallery="wrap"]').fadeIn();
			getGalleryWidth();
    } ;
    tmpImg.src = $(this).attr("href");

		list=$('[data-photo-gallery="list"]');

		if ($(list).find("li:first").hasClass("active")){
			$('[data-photo-gallery="prev"]').fadeOut("fast");
		}
		else{
			$('[data-photo-gallery="prev"]').fadeIn("fast");
		}

		if ($(list).find("li:last").hasClass("active")){
			$('[data-photo-gallery="next"]').fadeOut("fast");
		}
		else{
			$('[data-photo-gallery="next"]').fadeIn("fast");
		}

		return false;
	});

	getGalleryWidth();

	//двигаем нижний список фоток
	$(document).on("click",'[data-photo-gallery="list-next"], [data-photo-gallery="list-prev"]', function(){
		var gallery_scroll_count=3; //кол-во элементов для прокрутки

		isnext = false;
		isprev = false;
		//выставляем флаги - какая кнопка нажата
		if ($(this).attr('data-photo-gallery')=="list-next") {
			isnext=true;
		}
		else {
			isprev=true;
		}

		list=$('[data-photo-gallery="list"]');//родитель списка
		li_width=$(list).find("li").eq(0).outerWidth()+parseInt($(list).find("li").eq(0).css("margin-right")); //ширина одного элемента
		ul_width=$(list).find('ul').width();//ширина всего списка
		pos=parseInt((list).find("ul").css("margin-left")); //текущая позиция прокрутки
		//прокручиваем на заданное кол-во элементов
		if (isnext) {
			pos-=gallery_scroll_count*li_width;
		}
		if (isprev) {
			pos+=gallery_scroll_count*li_width;
		}

		//console.log(pos+ul_width, $(list).width());

		//определяем показывать ли кнопки туда/сюда
		if (pos<0) {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').show();
		}
		else {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').hide();
		}

		if (pos+ul_width>=$(list).width()) {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show();
		}
		else {
			$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide();
		}

		//если справа/слева при прокрутке появляется дыра, делаем прокрутку на меньшее число элементов
		if (-pos>ul_width-$(list).width()) {
			pos=-(ul_width-$(list).width());
		}

		if (pos>0) {
			pos=0;
		}

		//делаем сдвиг
		$(list).find("ul").animate({"margin-left":pos})

	});

	/* кнопка закрыть */
	$(document).on("click",'[data-photo-gallery="close"]',function(){
		$('[data-photo-gallery="wrap"]').fadeOut();
	});

	$(document).on("click",'[data-photo-gallery="next"], [data-photo-gallery="prev"]',function(){
		list=$('[data-photo-gallery="list"]');

		prev=$(list).find("li.active").prev();
		next=$(list).find("li.active").next();

		if ($(this).attr('data-photo-gallery')=="next") {
			next.find("a").click();
		}
		else{
			prev.find("a").click();
		}


	});


	// =================================================================
});

