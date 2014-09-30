var dayColor,
    content = $('#content')[0];

var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

var pages = {};

function loadDay(number) {
    $('#content').html('');

    var name = 'day-' + number,
        bubble = $('.' + name);

    dayColor = bubble.find('a').css('background-color');

    $('ul.days li').removeClass('active');
    bubble.addClass('active');
    $("#map").css("border-color", dayColor);


    var page = pages[name]
    if (page === undefined) {
        page = new Page();
        pages[name] = page;

        $.getJSON('./data/' + name + '.json', function (data) {
            var blocks = data.blocks;
            blocks.forEach(function (b) {
                var block = factory(b);
                page.push(block);
            });
            page.render();
        });
    }
    else {
        page.render()
    }
}


function factory(block) {
    var Constructor = Block[block.type];
    return new Constructor(block.args);
}

function Page () {
    this.blocks = [];
}

Page.prototype.push = function (block) {
    this.blocks.push(block);
};

Page.prototype.render = function () {
    this.blocks.forEach(function (b) {
        var g = new Pure('g');
        content.appendChild(g.node);
        b.render(g);
    });
};

Page.prototype.tearDown = function () {
    this.blocks.forEach(function (b) {
        b.tearDown();
    });
};

var Block = {};

/* Block Text */
Block.text = function (args) {
    this.text = args.text;
};

Block.text.prototype.render = function (g) {
    g.node.classList.add('text');
    var u = new Pure('u-1');

    u.addTo(g);

    var p = document.createElement('p');
    p.innerHTML = this.text;

    u.addChild(p);
};

/* Block Image */
Block.image = function (args) {
    this.images = args.images;

    var layers = [];
    this.images.forEach(function (image) {
        if (image.marker) {
            if (!image.marker.color) {
                image.marker.color = rgb2hex(dayColor);
            }
            var marker = new Marker(image.marker);
            image.marker = marker;
            layers.push(marker.feature);
        }
    }, this);

    this.group = L.featureGroup(layers).addTo(map);
};

Block.image.prototype.render = function (g) {
    g.node.classList.add('pure-image');

    var gallery = Gallery({
        headline: '',
        medias: this.images
    });

    React.renderComponent(gallery, g.node)
};

Block.image.prototype.tearDown = function () {
    this.group.clearLayers();
};

Block.title = function (args) {
    this.title = args.title;
    this.subtitle = args.subtitle;
};

Block.title.prototype.render = function () {
    var g = new Pure('g'),
        u = new Pure(['u-1', 'title']);

    g.className = 'title';

    var h1 = document.createElement('h1'),
        h2 = document.createElement('h2');

    h1.innerHTML = this.title;
    h2.innerHTML = this.subtitle;

    u.addChild(h1).addChild(h2);
    u.addTo(g);
};


/* Helper to create pure blocks */
var Pure = function (type) {
    var className;
    if (typeof type === 'string') {
        className = 'pure-' + type;
    } else {
        type = type.map(function (t) { return 'pure-' + t; })
        className = type.join(' ')
    }
    this.node = document.createElement('div');
    this.node.className = className;
};

Pure.prototype.addTo = function (node) {
    node.node.appendChild(this.node);
    return this;
};

Pure.prototype.addChild = function (node) {
    this.node.appendChild(node);
    return this;
};


/* Create Marker */
var Marker = function (args, node) {
    this.properties = args;
    this.feature = L.mapbox.featureLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            coordinates: this.properties.coordinates
        },
        properties: {
            title: this.properties.title,
            description: this.properties.description,
            // one can customize markers by adding simplestyle properties
            // https://www.mapbox.com/foundations/an-open-platform/#simplestyle
            'marker-size': this.properties.size,
            'marker-color': this.properties.color,
            'marker-symbol': this.properties.symbol
        }
    });
};

Marker.prototype.attachTo = function (node) {
    this.feature.addEventListener('mouseover', (function () {
        node.style.borderWidth = '10px'
        node.style.borderColor = this.properties.color
    }).bind(this));
    this.feature.addEventListener('mouseout', (function () {
        node.style.borderWidth = '0px';
    }).bind(this));
    this.feature.addEventListener('click', (function () {
        $(node).trigger('click');
    }).bind(this));
};
