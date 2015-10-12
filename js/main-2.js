/* global $, console, AudioContext */

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
        // console.log('tme actions for ' + themeAlias);
        if (themes[themeAlias] && themes[themeAlias].childThemes && themes[themeAlias].childThemes[0]) {
            toggleTheme(themes[themeAlias].childThemes[0]);
            //console.log('toggleTheme ' + themes[themeAlias].childThemes[0]);
        }
    }

    // Self-running screensaver module, runs only if noScreensaverPlease != true:
    var noScreensaverPlease = false;
    (function initScreensaver() {
        if (noScreensaverPlease) {
            return;
        }
        var screenSaverTimeout = 30000; // 1 min of inactivity
        var cnvs = document.createElement('canvas');
        var ctx = cnvs.getContext('2d');
        var offButton = null;
        var sw = null;
        var t = null;

        cnvs.setAttribute('style', 'display: none; position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; z-index: 1001;');

        document.body.appendChild(cnvs);
        cnvs.addEventListener('mousemove', stopAnimation);

        resetTimeout();

        function addOffButton() {
            // create switcher, or off button (only once)
            if (offButton) {
                return;
            }
            offButton = 1;
            sw = document.createElement('div');
            sw.innerHTML = 'Turn screensaver off';
            sw.setAttribute('style', 'display: block; cursor: pointer; position: absolute; bottom: 30px; margin-right:40%; margin-left:40%; padding: 10px; background: #999; opacity: 0.7; z-index: 1002; font-size: 0.9em;text-align:center;');        
            sw.addEventListener('click', function() {
                noScreensaverPlease = true;
                sw.style.opacity = '0';
                stopAnimation();
                offButton = null;
            });
            document.body.appendChild(sw);
        }

        function resetTimeout() {
            clearTimeout(t);
            t = setTimeout(animateMe, screenSaverTimeout);
        }

        function stopAnimation() {
            cnvs.style.display = 'none';
            resetTimeout();
            addOffButton();
        }

        function animateMe() {
            if(noScreensaverPlease) {
                return;
            }

            cnvs.style.display = 'block';
            //ctx.globalCompositeOperation = 'multiply';

            var sun = new Image();
            var moon = new Image();
            var earth = new Image();

            var w = 300;//cnvs.clientWidth;
            var h = 300;//cnvs.clientHeight;
            var halfW = Math.round( w / 2);
            var halfH = Math.round( h / 2);

            init();
            
            function init() {
                sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
                moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
                earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
                window.requestAnimationFrame(draw);
            }

            function draw() {
                ctx.globalCompositeOperation = 'destination-over';
                ctx.clearRect(0, 0, w, h); // clear canvas

                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.strokeStyle = 'rgba(0,153,255,0.4)';
                ctx.save();
                ctx.translate(halfW, halfH);

                // Earth
                var time = new Date();
                ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
                ctx.translate(105, 0);
                ctx.fillRect(0, -12, 50, 24); // Shadow
                ctx.drawImage(earth, -12, -12);

                // Moon
                ctx.save();
                ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
                ctx.translate(0, 28.5);
                ctx.drawImage(moon, -3.5, -3.5);
                ctx.restore();

                ctx.restore();

                ctx.beginPath();
                ctx.arc(halfW, halfH, 105, 0, Math.PI * 2, false); // Earth orbit
                ctx.stroke();

                ctx.drawImage(sun, 0, 0, w, h);

                window.requestAnimationFrame(draw);
            }
        } // animateMe
    } // init screensaver;
    )();  

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
                var x = radius * Math.cos(i);
                var y = radius * Math.sin(i);
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

    function onInfoLink($infoLink) {
        var $link = $infoLink.parent().find('a');
        var name = $link.attr('data-name');
        var url;
        console.log( 'Station: ' + name );

        if (!name) {
            return;
        }
        
        if ( name === '4duk' ) {
            url = 'http://4duk.ru/4duk/playerPage.action?play=false';
        } else {
            // http://somafm.com/groovesalad/songhistory.html
            url = 'http://somafm.com/' + name + '/songhistory.html';
        }
        window.open( url, '_blank' );
    }

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
    

    $('[data-role="theme-switcher"]').bind('click', function() {
        toggleTheme('dark');
    });
});
