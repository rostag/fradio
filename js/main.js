/* global $, console */
'use strict';

// state.station property defines the station to be used instead of the default channel's station

$(document).ready(function() {

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

    function initLocation() {
        var hash = window.location.hash.toLowerCase().substring(1);
        var $stationLink = $('.station-links a').filter(function() {
            return $(this).text().toLowerCase() === hash || $(this).attr('data-alias') === hash;
        });
        // console.log('hash: ', hash, 'stationLink: ', $stationLink);
        if ($stationLink.length !== 0) {
            activateStationLink($stationLink);
        }
    }

    function initStation(stationName, stationUrl, stationAlias) {
        // console.log($('.station-name').text(), stationName);
        toggleTheme('station-' + stationAlias);
        $('.station-name').text(stationName);
        $('.station-name-bg').text(stationName);
        $player.attr('src', stationUrl).get(0).play();
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

    function onInfoLink($infoLink, evt) {
    	var radioframe;
    	var tip;
    	states.infoLink.toggle = !states.infoLink.toggle; // === 'on' ? 'off' : 'on';
    	if ( states.infoLink.toggle ) {
	        radioframe = document.getElementById('fradioframe');
	        tip = document.getElementById('fradiotooltip');
	        radioframe.setAttribute('src', getInfoLink($infoLink));
	        tip.style.top = evt.clientY + 10 + 'px';
	        tip.style.display = 'block';
	        radioframe.style.display = 'block';
    	} else {
			tip.style.display = 'none';
			radioframe.style.display = 'none';
    	}

        // window.open(getInfoLink($infoLink), '_blank');
    }

    // function onHoverInfoLink($infoLink, evt) {
    //     // console.dir(evt);
    // }

// 2. A little bit of JS magic to properly reposition the modal once it has been resized:
// source: https://trueg.wordpress.com/2012/10/12/and-now-for-something-completely-different-resizable-bootstrap-modals/
// $('.modal').on('resize', function(event, ui) {
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

    var $player = $('.player');
    var currentTheme = '';

    var states = {
        def: {
            station: {
                name: 'Select a station',
                url: '',
                alias: ''
            }
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

    var $stationLinks = $('.station-links a');
    $stationLinks.parent().append('<small class="info-link">-info</small>');

    var $infoLinks = $('.info-link');

    $stationLinks.bind('click', function(evt) {
        evt.preventDefault();
        activateStationLink($(evt.currentTarget));
    });

    $infoLinks.bind('click', function(evt) {
        evt.preventDefault();
        onInfoLink($(evt.currentTarget));
    });

    // $infoLinks.bind('mouseover', function(evt) {
    //     evt.preventDefault();
    //     onHoverInfoLink($(evt.currentTarget), evt);
    // });

    $('[data-role="theme-switcher"]').bind('click', function() {
        toggleTheme('dark');
    });

    initStation(station.name, station.url, station.alias);

    initLocation();

});