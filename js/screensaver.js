    'use strict';
    // Self-running screensaver module, runs only if noScreensaverPlease != true:
    this.fradioConfig = this.fradioConfig || {};
    fradioConfig.noScreensaverPlease = true;

    (function initScreensaver() {
            if (fradioConfig.noScreensaverPlease) {
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
                    fradioConfig.noScreensaverPlease = true;
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
                if (fradioConfig.noScreensaverPlease) {
                    return;
                }

                cnvs.style.display = 'block';
                //ctx.globalCompositeOperation = 'multiply';

                var sun = new Image();
                var moon = new Image();
                var earth = new Image();

                var w = 300; //cnvs.clientWidth;
                var h = 300; //cnvs.clientHeight;
                var halfW = Math.round(w / 2);
                var halfH = Math.round(h / 2);

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