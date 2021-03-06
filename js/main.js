'use strict';
// var mainDocument = $(document);

// init foundation
// $(document).foundation();

// Init all plugin when document is ready 
$(document).on('ready', function () {
	// 0. Init console to avoid error
	var method;
	var noop = function () { };
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	var contextWindow = $(window);
	var $root = $('html, body');
	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	// 1. Background image as data attribut 
	var list = $('.bg-img');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-image-src');
		list[i].style.backgroundImage = "url('" + src + "')";
		list[i].style.backgroundRepeat = "no-repeat";
		list[i].style.backgroundPosition = "center";
		list[i].style.backgroundSize = "cover";
	}
	// Background color as data attribut
	var list = $('.bg-color');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-bgcolor');
		list[i].style.backgroundColor = src;
	}

	// 2. Init Coutdown clock
	try {
		// check if clock is initialised
		$('.clock-countdown').downCount({
			date: $('.site-config').attr('data-date'),
			offset: +10
		});
	}
	catch (error) {
		// Clock error : clock is unavailable
		console.log("clock disabled/unavailable");
	}

	// 3. Show/hide menu when icon is clicked
	var menuItems = $('.all-menu-wrapper .nav-link');
	var menuIcon = $('.menu-icon, #navMenuIcon');
	var menuBlock = $('.all-menu-wrapper');
	var reactToMenu = $ ('.page-main, .navbar-sidebar, .page-cover')
	var menuLinks = $(".navbar-mainmenu a, .navbar-sidebar a");
	// Menu icon clicked
	menuIcon.on('click', function () {
		menuIcon.toggleClass('menu-visible');
		menuBlock.toggleClass('menu-visible');
		menuItems.toggleClass('menu-visible');
		reactToMenu.toggleClass('menu-visible');
		return false;
	});

	// Hide menu after a menu item clicked
	menuLinks.on('click', function () {
		menuIcon.removeClass('menu-visible');
		menuBlock.removeClass('menu-visible');
		menuItems.removeClass('menu-visible');
		reactToMenu.removeClass('menu-visible');
		return true;
	});

	// 4 Carousel Slider
	new Swiper('.carousel-swiper-beta-demo .swiper-container', {
		pagination: '.carousel-swiper-beta-demo .items-pagination',
		paginationClickable: '.carousel-beta-alpha-demo .items-pagination',
		nextButton: '.carousel-swiper-beta-demo .items-button-next',
		prevButton: '.carousel-swiper-beta-demo .items-button-prev',
		loop: true,
		grabCursor: true,
		centeredSlides: true,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		slidesPerView: 1,
		spaceBetween: 0,
		breakpoints: {
			1024: {
				slidesPerView: 1,
			},
			800: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			640: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			440: {
				slidesPerView: 1,
				spaceBetween: 0
			}
		}
	});
	// 4.1 Slideshow slider
	var imageList = $('.slide-show .img');
	var imageSlides = [];
	for (var i = 0; i < imageList.length; i++) {
		var src = imageList[i].getAttribute('data-src');
		imageSlides.push({ src: src });
	}
	$('.slide-show').vegas({
		delay: 5000,
		shuffle: true,
		slides: imageSlides,
		animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
	});
	
	// 5. Init video background
	var videoBg = $('.video-container video, .video-container object');

	// 6. Prepare content for animation
	$('.section .content .anim.anim-wrapped').wrap("<span class='anim-wrapper'></span>");

	// 7. Init fullPage.js plugin
	var pageSectionDivs = $('.page-fullpage .section');
	var headerLogo = $('.header-top .logo');
	var bodySelector = $('body');
	var sectionSelector = $('.section');
	var headerContainer = $('.hh-header');
	var slideElem = $('.slide');
	var arrowElem = $('.p-footer .arrow-d');
	var pageElem = $('.section');
	var pageSections = [];
	var pageAnchors = [];
	var nextSectionDOM;
	var nextSection;
	var fpnavItem;
	var mainPage = $('#mainpage');
	var sendEmailForm = $('.send_email_form');
	var sendMessageForm = $('.send_message_form');
	var scrollOverflow = true;
	var css3 = true;
	// disable scroll overflow on small device
	if (contextWindow.width() < 601) {
		scrollOverflow = false;
		css3 = false;
	}
	if (contextWindow.height() < 480) {
		scrollOverflow = false;
		css3 = false;
	}
	// Get sections name
	for (var i = 0; i < pageSectionDivs.length; i++) {
		pageSections.push(pageSectionDivs[i]);
	}
	window.asyncEach(pageSections, function (pageSection, cb) {
		var anchor = pageSection.getAttribute('data-section');
		pageAnchors.push(anchor + "");
		cb();
	}, function (err) {
		// Init plugin
		if (mainPage.width()) {
			// config fullpage.js
			mainPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3: css3,
				navigation: true,
				responsiveWidth: 601,
				responsiveHeight: 480,
				scrollOverflow: scrollOverflow,
				scrollOverflowOptions: {
					click: true,
					submit: true,
				},
				normalScrollElements: '.section .scrollable',
				afterRender: function () {
					// Fix video background
					videoBg.maximage('maxcover');

					// Fix for internet explorer : adjust content height
					// Detect IE 6-11
					var isIE = /*@cc_on!@*/false || !!document.documentMode;
					if (isIE) {
						var contentColumns = $('.section .content .c-columns');
						contentColumns.height(contextWindow.height())
						for (var i = 0; i < contentColumns.length; i++) {
							if (contentColumns[i].height <= contextWindow.height()) {
								contentColumns[i].style.height = "100vh";
							}
						}
					}

					// init contact form
					// Default server url
					var newsletterServerUrl = './ajaxserver/serverfile.php';
					var messageServerUrl = './ajax/contact.php';

					// Use form define action attribute
					if (sendEmailForm.attr('action') && (sendEmailForm.attr('action')) != '') {
						newsletterServerUrl = sendEmailForm.attr('action');
					}
					if (sendMessageForm.attr('action') && (sendMessageForm.attr('action') != '')) {
						messageServerUrl = sendMessageForm.attr('action');
					}

					sendEmailForm.initForm({
						serverUrl: newsletterServerUrl,
					});
					sendMessageForm.initForm({
						serverUrl: messageServerUrl,
					});

				},
				afterResize: function () {
					var pluginContainer = $(this);
					$.fn.fullpage.reBuild();
				},
				onLeave: function (index, nextIndex, direction) {
					// Behavior when a full page is leaved
					arrowElem.addClass('gone');
					pageElem.addClass('transition');
					slideElem.removeClass('transition');
					pageElem.removeClass('transition');
				},
				afterLoad: function (anchorLink, index) {
					// Behavior after a full page is loaded
					// hide or show clock

					if (index == 4 || index == 3) {
						var nav = $(".navbar-sidebar ").find('li').eq(1);
						nav.addClass('active');
					}
					if ($('.section.active').hasClass('hide-clock')) {
						headerContainer.addClass('gone');
					} else {
						headerContainer.removeClass('gone');
					}
				}
			});

		}
	});
	// Scroll to fullPage.js next/previous section
	$('.scrolldown > a, .scroll.down').on('click', function () {
		try {
			// fullpage scroll
			$.fn.fullpage.moveSectionDown();
		} catch (error) {
			// normal scroll
			$root.animate({
				scrollTop: window.innerHeight
			}, 400, function () {
			});
		}

	});

	// 8. Hide some ui on scroll
	var scrollHeight = $(document).height() - contextWindow.height();
	contextWindow.on('scroll', function () {
		var scrollpos = $(this).scrollTop();
		var siteHeaderFooter = $('.page-footer, .page-header');

		// if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
		if (scrollpos > 100) {
			siteHeaderFooter.addClass("scrolled");
		}
		else {
			siteHeaderFooter.removeClass("scrolled");
		}
	});


	// 9. Page Loader : hide loader when all are loaded
	contextWindow.on('load', function () {
		$('#page-loader').addClass('p-hidden');
		$('.section').addClass('anim');
	});

	//fetch case studides
	var caseCarousel;
	var currentId = 2;
	var fetchCaseStudies = function (id) {
		$.ajax({
			url: "http://jventures.pk/backend/wp-json/wp/v2/posts?_embed",
			data: { categories: id },
			type: "get",
			success: function (data) {
				// console.log(data);
				var animateClass = "";

				if (id == 2) {
					if (currentId == 2)
						animateClass = 'animate';
					else
						animateClass = 'animated fadeInRight';
				} else {
					animateClass = 'animated fadeInRight';
				}

				var html = '';
				var links = [];
				for (let i = 0; i < data.length; i++) {
					const item = data[i];
					links = item.content.rendered.match(/href="([^"]*")/g);
					if (links != null) {
						// links = $(links).replace("href=", "");

						if (links && links.length) {
							links = links[0].replace("href=", "");
							links.split('"').join('');
							// console.log(links)
						}
					} else {
						links = '#';
					}


					currentId = id;
					var title = item.title.rendered;
					var content = $(item.content.rendered)
						.empty("a")
						.text()
						.substr(0, 120);

					// console.log(content)
					var image = item._embedded['wp:featuredmedia'][0].source_url;

					console.log(links);
					html += `
						<div class="item ${animateClass}">
							<div class="card">
								<img class="card-img-top" src="${image}" alt="Card image cap">
								<div class="card-body">
									<h6 class="card-title text-uppercase small-text">${title}</h6>
									<p class="card-text small-text"><small>${content}</small></p>
									<a href=${links} target="_blank" class="btn btn-rounded btn-outline-primary"><small>Download</small></a>
								</div>
							</div>
						</div>
					`;
				}

				$('.js-case-studies').html(html);

				// if(id !=2) {
				$(".js-case-studies").trigger("destroy.owl.carousel");
				// return;
				// }

				caseCarousel = $(".js-case-studies");
				caseCarousel.owlCarousel({
					autoplay: true,
					loop: false,
					margin: 20,
					// nav: true,
					navContainerClass: "owl-nav case-more-nav",
					responsiveClass: true,
					responsive: {
						0: {
							items: 1
						},
						768: {
							items: 2
						},
						1000: {
							items: 3
						}
					}
				});
			},
			error: function (err) {
				console.error('FETCH_CASE_STUDIES_ERR:', err);
			}
		})
	}

	fetchCaseStudies(2);

	// change case studies

	$(".js-case-studies-tab").on('click', 'a', function (e) {
		e.preventDefault();
		$('.js-case-studies-tab').find('.active').removeClass('active');
		$(this).addClass('active');
		var id = $(this).attr('data-id');
		// currentId = id;
		fetchCaseStudies(id);
		// caseCarousel.destroy();
	});

	// partners carousel initialize
	$('.js-partners').owlCarousel({
		autoplay: true,
		loop: true,
		margin: 10,
		responsiveClass: true,
		responsive: {
			0: {
				items: 2,
			},
			320: {
				items: 2
			},
			480: {
				items: 3
			},
			552: {
				items: 4
			},
			768: {
				items: 5,
				margin: 20
			},
		}
	});

	// HOME TYPED JS
	if ($('.element').length) {
		$('.element').each(function () {
			$(this).typed({
				strings: [
					$(this).data("text1"),
					$(this).data("text2"),
					$(this).data("text3")
				],
				loop: $(this).data("loop")
					? $(this).data("loop")
					: false,
				backDelay: $(this).data("backdelay")
					? $(this).data("backdelay")
					: 2000,
				typeSpeed: 10
			});
		});
	}

	$(".image-container img:first").addClass("firstPic");
	var picLeft = $(".firstPic").width();
	var leftMove = 0;
	var step = 1;
	setInterval(function () {
	  leftMove -= step;
	  $(".firstPic").css('margin-left', leftMove); 
	  if (leftMove <= picLeft * -1 - 5) { 
		  $(".image-container img:first").remove(); 
		  $(".image-container img:first").addClass('firstPic');
		  leftMove = 0;
		  $(".image-container").append('<img  src=\"https://cdn.ushareit.com/shareit/w/ofwb/static/headModule/background/background.jpg" alt="">');
		//   setSize();
		console.log(leftMove)
		}  
	}, 50);

	$(".js-video-button").modalVideo();
});

