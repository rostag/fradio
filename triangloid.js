var Triangloid;
(function() {
    //Private:
    function defaults(opt, def) {
        return (typeof opt !== 'undefined') ? opt : def;
    }
    //Public:
    Triangloid = function(options) {
        if (typeof options === 'undefined') {
            options = {};
        }
        this.options = {
            cellsize: defaults(options.cellsize, 150),
            bleed: defaults(options.cellsize, 150),
            cellpadding: defaults(options.cellpadding, 0.1 * options.cellsize || 15)
        };
    }
    Triangloid.prototype.trianglifyImage = function(imageData, imageWidth, imageHeight) {
        return new Triangloid.TrianglifiedImage(this.options, imageData, imageWidth, imageHeight);
    }
    Triangloid.TrianglifiedImage = function(options, data, width, height) {
        this.rawData = data;
        this.options = options;
        this.width = width;
        this.height = height;
        this.pattern = new Triangloid.TrianglifiedImage.Pattern(this.options, width, height);
    }
    Triangloid.TrianglifiedImage.prototype.getSVG = function() { //Serializes, wraps and returns SVG as base64 data URI code
        this.svg = this.generateSVG();
        var s = new XMLSerializer();
        this.svgString = s.serializeToString(this.svg);
        this.base64 = btoa(this.svgString);
        this.dataUri = 'data:image/svg+xml;base64,' + this.base64; //Wraps base64 code with appropriate metadata
        this.dataUrl = 'url(' + this.dataUri + ')';
        return this.dataUri;
    }
    Triangloid.TrianglifiedImage.prototype.generateSVG = function() { //Generates and populates an SVG with triangles with appropriate color and returns SVG as a node string, meant to be executed internally, by TrianglifyImage.prototype.getSVG
        var options = this.options;
        var data = this.rawData;
        var width = this.width;
        var height = this.height;
        var elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var svg = d3.select(elem);
        svg.attr("width", this.width);
        svg.attr("height", this.height);
        svg.attr('xmlns', 'http://www.w3.org/2000/svg');
        var group = svg.append("g");
        this.pattern.polygons.forEach(function(d) {
            var x = Math.round((d[0][0] + d[1][0] + d[2][0]) / 3); //Finds central(mean) point of the triangle corners
            var y = Math.round((d[0][1] + d[1][1] + d[2][1]) / 3);
            if (x < 0) { //If the point is outside the image boundary, set it just on the edge to get a color
                x = 0;
            } else if (x >= width) {
                x = width - 1;
            }
            if (y < 0) {
                y = 0;
            } else if (y >= height) {
                y = height - 1;
            }
            var pixelIndex = x + (y * width);
            var c = "rgb(" + data[pixelIndex].join(",") + ")"; //Sets color of the triangle to the color of the median point
            var g = group.append("path").attr("d", "M" + d.join("L") + "Z").attr({
                fill: c,
                stroke: c
            });
        });
        console.log(svg.node());
        return svg.node();
    }

    Triangloid.TrianglifiedImage.Pattern = function(options, width, height) {
        this.options = options;
        this.width = width;
        this.height = height;
        this.polygons = this.generatePolygons();
    }
    Triangloid.TrianglifiedImage.Pattern.prototype.generatePolygons = function() {
        var options = this.options;
        var cellsX = Math.ceil((this.width + options.bleed * 2) / options.cellsize);
        var cellsY = Math.ceil((this.height + options.bleed * 2) / options.cellsize);

        var vertices = d3.range(cellsX * cellsY).map(function(d) {
            var col = d % cellsX;
            var row = Math.floor(d / cellsX);
            var x = Math.round(-options.bleed + col * options.cellsize + Math.random() * (options.cellsize - options.cellpadding * 2) + options.cellpadding);
            var y = Math.round(-options.bleed + row * options.cellsize + Math.random() * (options.cellsize - options.cellpadding * 2) + options.cellpadding);
            return [x, y];
        });
        return d3.geom.voronoi().triangles(vertices);
    }
})();
