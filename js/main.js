/* global $, console */

'use strict';

// state.station property defines the station to be used instead of the default channel's station

$(document).ready(function() {

	var self = this;
	var recentStation = null;
	var $stationLink = null;
	var $stationLinks = $('.station-links a');
	var $infoLinks = $('.info-link');
	var $playButton = $('.play-button');
	var $inputRange = $('input[type="range"]');

	var $player = $('.player');
	var currentTheme = '';

	var states = {
		def: {
			station: {
				name: 'Select a station',
				url: '',
				alias: ''
			}
		},
		infoLink: {
			toggle: false
		},
		player: {
			isPlaying: !$player.get(0).paused
		}
	};

	var station = states.def.station;

	var themes = {
		'station-def-con-radio': {
			childThemes: ['dark']
		},
		'dark': {
			switchable: true
		}
	};

	// Decorate station links with addiotional info links
	$stationLinks.parent().append('<small class="info-link">-info</small>');

	initRangeOutput();

	function initRangeOutput(argument) {
		var el, newPoint, newPlace, offset, width;

		var mouseX;

		// Select all range inputs, watch for change
		$inputRange.change(onRangeInput);

		$inputRange.mousemove(onRangeInput);

		$inputRange.mouseover(function(event) {
			$inputRange.next('output').fadeIn('fast');
		});

		$inputRange.mouseout(function(event) {
			$inputRange.next('output').fadeOut('slow');
		});

		$inputRange[0].addEventListener('input', onRangeInput);

		$inputRange.trigger('mousemove');

		function onRangeInput(event) {

			el = $(event.target);

			width = el.width();

			var thumbWidth = 43;

			mouseX = event.clientX || 0;

			newPoint = (el.val() - el.attr('min')) / (el.attr('max') - el.attr('min'));

			offset = el[0].offsetLeft || 0;

			if (mouseX && offset) {

				newPlace = mouseX - offset - width - thumbWidth / 2; // || Math.min(Math.max(width * newPoint, 0), width - thumbWidth) - width - thumbWidth + offset;

				console.log(mouseX, offset, newPlace);
				// console.log('newPoint =', newPoint, width);

				el
					.next('output')
					.css({
						left: newPlace
					})
					.text(el.val());
			}

			if ( el.val() ) {
				setPlayerVolume( $player[0], el.val() / 100);
			}

		}
	}

	function initPlayer() {
		initDefaultStation();
	}

	function initDefaultStation() {
		var hash = window.location.hash.toLowerCase().substring(1);
		$stationLink = $('.station-links a').filter(function() {
			return $(this).text().toLowerCase() === hash || $(this).attr('data-alias') === hash;
		});
		// console.log('hash: ', hash, 'stationLink: ', $stationLink);
		if ($stationLink.length !== 0) {
			activateStationLink($stationLink);
		} else {
			// FIXME	
			// var $defaultLink = $('.station-links a')[1];
			// console.log('default station link: ', $defaultLink);
			// activateStationLink($defaultLink);
		}
	}

	function setPlayerVolume(player, volume) {
		player.volume = volume;
	}

	function initStation(stationName, stationUrl, stationAlias) {
		// console.log($('.station-name').text(), stationName);
		toggleTheme('station-' + stationAlias);
		$('.station-name').text(stationName);
		$('.station-name-bg').text(stationName);
		$player.attr('src', stationUrl).get(0).play();
	}

	function toggleTheme(themeAlias) {
		var switchable = themes[themeAlias] && themes[themeAlias].switchable;
		//  var forceSwitch = switchable ? undefined : undefined;
		if (!themeAlias || (currentTheme === themeAlias && !switchable)) {
			return;
		}
		currentTheme = themeAlias;
		$('body').toggleClass(themeAlias);
		themeActions(themeAlias);
	}

	function themeActions(themeAlias) {
		// console.log('tme actions for ' + themeAlias);
		if (themes[themeAlias] && themes[themeAlias].childThemes && themes[themeAlias].childThemes[0]) {
			toggleTheme(themes[themeAlias].childThemes[0]);
			//console.log('toggleTheme ' + themes[themeAlias].childThemes[0]);
		}
	}

	function activateStationLink($link) {
		$('.chosen-one').removeClass('chosen-one');
		$link.parent().addClass('chosen-one');
		initStation($link.text(), $link.attr('href'), $link.attr('data-alias'));
	}

	function getInfoLink($infoLink) {
		var $link = $infoLink.parent().find('a');
		var name = $link.attr('data-name');
		var url;
		console.log('Station: ' + name);

		if (!name) {
			return;
		}

		if (name === '4duk') {
			url = 'http://4duk.ru/4duk/playerPage.action?play=false';
		} else {
			// http://somafm.com/groovesalad/songhistory.html
			url = 'http://somafm.com/' + name + '/songhistory.html';
		}
		return url;
	}

	// function onHoverInfoLink($infoLink, evt) {
	//     // console.dir(evt);
	// }

	// 2. A little bit of JS magic to properly reposition the modal once it has been resized:
	// source: https://trueg.wordpress.com/2012/10/12/and-now-for-something-completely-different-resizable-bootstrap-modals/
	// $('.modal').on('resize', (event, ui) => {
	//     ui.element.css('margin-leftuui.size.width'/2);
	//     ui.element.css('margin-topuui.size.height'/2);
	//     ui.element.css('top0%');
	//     ui.element.css('left0%');

	//     $(ui.element).find('.modal-body').each(function() {
	//       $(this).css('max-height', 400 + ui.size.height - ui.originalSize.height);
	//     });
	// });

	// // Now just enable resize on all modals or on whatever modal you want:
	// $('.modal').resizable();


	function onInfoLink($infoLink, evt) {
		var radioframe = document.getElementById('fradioframe');
		var tip = document.getElementById('fradiotooltip');

		radioframe.setAttribute('src', getInfoLink($infoLink));
		tip.style.top = evt.clientY + 10 + 'px';
		tip.style.display = 'block';
	}

	$stationLinks.bind('click', evt => {
		evt.preventDefault();
		activateStationLink($(evt.currentTarget));
	});

	$infoLinks.bind('click', evt => {
		evt.preventDefault();
		onInfoLink($(evt.currentTarget), evt);
	});

	$playButton.bind('click', evt => {
		evt.preventDefault();

		var p = $player.get(0);

		console.log('recentStation = ' + recentStation);
		// pause
		if (states.player.isPlaying) {
			console.log('pause: ' + p.src);
			recentStation = p.src;
			p.src = '';
			// $player.pause();
			// $player.currentTime = 0;
			// play
		} else {
			console.log('play: ' + p.src);
			p.src = recentStation;
			p.play();
		}

		states.player.isPlaying = !states.player.isPlaying;

		console.log('recentStation = ' + recentStation);

	});

	// $infoLinks.bind('mouseover', evt => {
	//     evt.preventDefault();
	//     onHoverInfoLink($(evt.currentTarget), evt);
	// });

	$('[data-role="theme-switcher"]').bind('click', () => {
		toggleTheme('dark');
	});

	initStation(station.name, station.url, station.alias);

	initPlayer();

});

(() => console.log('arrow'))();