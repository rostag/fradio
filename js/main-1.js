/* global $, console */

'use strict';

$(document).ready(function() {
    var $player = $('.player'),
        station = {
            name: 'Select a station',
            url: '',
            alias: ''
        };
    var currentTheme = '';
    var themes = {
        'station-def-con-radio': {
            childThemes: ['dark']
        },
        'dark': {
            switchable: true
        }
    };

    initStation(station.name, station.url, station.alias);
    initLocation();

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
        console.log('tme actions for ' + themeAlias);
        if (themes[themeAlias] && themes[themeAlias].childThemes && themes[themeAlias].childThemes[0]) {
            toggleTheme(themes[themeAlias].childThemes[0]);
            console.log('toggleTheme ' + themes[themeAlias].childThemes[0]);
        }
    }

    function initVisualisation() {
        var ctx = new AudioContext();
        var audio = document.getElementById('myAudio');
        var audioSrc = ctx.createMediaElementSource(audio);
        var analyser = ctx.createAnalyser();
        // we have to connect the MediaElementSource with the analyser 
        audioSrc.connect(analyser);
        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

        // frequencyBinCount tells you how many values you'll receive from the analyser
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        // we're ready to receive some data!
        // loop
        function renderFrame() {
                requestAnimationFrame(renderFrame);
                // update data in frequencyData
                analyser.getByteFrequencyData(frequencyData);
                // render frame based on values in frequencyData
                // console.log(frequencyData)
            }
            // audio.start();
        renderFrame();

        function rotate() {
            ////////
            // a full circle
            var twoPi = 2 * Math.PI;
            var objectsCount = 12;
            var radius = 100;

            // you want to align objectsCount objects on the circular path
            // with constant distance between neighbors
            var change = twoPi / objectsCount;
            for (var i = 0; i < twoPi; i += change) {
                var x = radius * cos(i);
                var y = radius * sin(i);
                // rotation of object in radians
                var rotation = i;
                // set the CSS properties to calculated values
            }
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
        console.log($('.station-name').text(), stationName);
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
    $('.station-links a').bind('click', function(evt) {
        evt.preventDefault();
        activateStationLink($(evt.currentTarget));
    });

    $('[data-role="theme-switcher"]').bind('click', function() {
        toggleTheme('dark');
    });
});
