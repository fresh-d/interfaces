
// исправляем положение контента при изменения высоты хедера
function headerResized(){
	$('[data-content="content"]')
			.css(
				"top",
				parseInt($('[data-content="header"]').css("margin-bottom"))+($('[data-content="header"]').outerHeight())
			);
};

//делаем margin:auto для контента
function contentMarginAuto(){
	$('.b-content>.main').css("margin-left",$('.b-header>.main').offset().left);
}

//считаем ширину нижней галереи по кол-ву фоток. ширина фоток стандартная, считается по первому элементу
function getGalleryWidth(){
	list=$('[data-photo-gallery="list"]');
	$(list).find('ul').css("width",$(list).find("li").length*($(list).find("li").eq(0).outerWidth()+parseInt($(list).find("li").eq(0).css("margin-right"))));
	if (parseInt($(list).find('ul').css("width"))>parseInt($(list).width())) {
		$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show();
	}
	else{
		$('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide();
	}
}

$(function() {
	// simple select widget
	//показываем/скрываем выпадающий список
	$(document).on("click",'[data-select]',function(){
		$(this).find('[data-select-list]').slideToggle("fast");
	});

	//меняем значение при клике на элементе списка
	$(document).on("click",'[data-select] [data-select-id]',function(){
		$('[data-select] [data-select-id]').removeClass("active");
		//меняем не только текстовое значение но и id (аналог value для option)
		$(this).addClass("active").parents('[data-select]').find('[data-select-value]').attr('data-select-value',$(this).attr('data-select-id')).text($(this).text());
	});


	//favorite
	$(document).on("click", "[data-car-fav]", function(){
		$(this).toggleClass("active");
		$(this).addClass("clicked");
	});

	$(document).on("mouseleave", "[data-car-fav]", function(){
		$(this).removeClass("clicked");
	});	
	// /favorite

	// /simple select widget

	// tabs

	$(document).on("click","[data-tab='tab']",function(){
		$(this).parents("[data-tabs='tab']").find("[data-tab='tab']").removeClass("active");
		$(this).parents("[data-tabs='tab']").next().find("[data-tab='content']").removeClass("active");
		$(this).addClass("active");
		$(this).parents("[data-tabs='tab']").next().find("[data-tab='content']").eq($(this).index()).addClass("active");
	})

	$("[data-tab='tab'].active").click();

	// /tabs

	// =================================================================

	$(document).on("click","[data-radio-el]",function(){
		isActive=$(this).hasClass("active");
		$(this).parents("[data-radio]").find("[data-radio-el]").removeClass("active");
		if (isActive){
			$(this).parents("[data-radio]").find("[data-radio-value]").attr("value",-1);
		}
		else{
			$(this).parents("[data-radio]").find("[data-radio-value]").attr("value",$(this).attr("data-radio-el"));
			$(this).addClass("active");
		}
	})

	// =================================================================

	// car body radio

	$(document).on("click","[data-body-radio='el']",function(){
		$(this).toggleClass("active");
		if ($(this).find("[data-body-radio='input']").val()==1) {
			$(this).find("[data-body-radio='input']").val(0);
			$(this).removeClass("activated");
			$(this).addClass("deactivated");
		}
		else {
			$(this).find("[data-body-radio='input']").val(1);
			$(this).removeClass("deactivated");
			$(this).addClass("activated");
		}

	});

	$(document).on("mouseleave","[data-body-radio='el']",function(){
		$(this).removeClass("activated deactivated");
	});


	// /car body radio

	// =================================================================

	$(window).resize(function(){
		headerResized();
		contentMarginAuto();
		getGalleryWidth();

		if (navigator.userAgent.match("MSIE 8")) {
			if ($("body").width()>1124) {
				$("body").addClass("ie-width-fix");
			}
			else {
				$("body").removeClass("ie-width-fix");
			}
		}
	});
	$(window).resize();

	$(document).on("click", '[data-hidden-phone="show"]', function(){
		$(this).hide();
		$(this).parent().find('[data-hidden-phone="phone"]').fadeIn();
		$('[data-hidden-phone="alert"]').fadeIn();
	});

	$(document).on("click", '[data-hidden-phone="more"]', function(){
		$(this).toggleClass("active");
		$(this).parent().find('[data-hidden-phone="more-phones"]').slideToggle();
	});
	
	// =================================================================

	/* переключатель Показать описание*/
	$(document).on("click",'[data-switch="btn"]',function(){
		$(this).parent().toggleClass("on").next().slideToggle("fast");
	})

	// =================================================================

	/* выделение инпута со ссылкой в блоке поделиться */
	$(document).on("click",'[data-share-link="input"]',function(){
		$(this).select();
	})

	/* ссылка поделиться */
	$(document).on("click",'[data-share="link"]',function(){
		$(this).parents('[data-share="wrap"]').find('[data-share="popup"]').fadeToggle();
	})



	// =================================================================

/*temp demo scripts*/

	$(document).on("click",".b-search-results .b-car-element, .b-frame-view .b-top-bar .description",function(){
		$(".b-search-results .b-car-element").removeClass("active");
		$(this).addClass("active");
		$(".b-frame-content-filter").hide();
		$(".b-frame-content-car").show();
		$(".b-frame-view .b-top-bar .filter").removeClass("active");
		$(".b-frame-view .b-top-bar .description").addClass("active");
	});

	$(document).on("click",".b-frame-view .b-top-bar .filter",function(){
		$(".b-frame-content-filter").show();
		$(".b-frame-content-car").hide();
		$(".b-frame-view .b-top-bar .description").removeClass("active");
		$(".b-frame-view .b-top-bar .filter").addClass("active");
	});

	$(document).on("click",".b-page-advertising",function(){
		$(".b-content").removeClass("b-content-has-ad");
		$(".b-content").find(".b-page-advertising").remove();
		$(".b-content").find(".b-advertising-right").remove();
		return false;

	});

});