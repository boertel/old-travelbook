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

viewer = React.renderComponent(Viewer(), document.getElementById('viewer'));

var N = 0,
    current,
    pages = {};

function loadDay(number) {
    $('#content').html('');

    var name = 'day-' + number,
        bubble = $('.' + name);

    current = name;
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
                block && page.push(block);
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
    return Constructor && new Constructor(block.args);
}

function Page () {
    this.blocks = [];
    this.layers = [];
}

Page.prototype.push = function (block) {
    this.blocks.push(block);
};

Page.prototype.render = function () {
    viewer.props.images = []
    viewer.props.length = 0

    this.blocks.forEach(function (b) {
        var g = new Pure('g');
        content.appendChild(g.node);
        if (b instanceof Block.title && !this.title) {
            this.title = b.title;
        }
        if (b instanceof Block.image) {
            this.layers = this.layers.concat(b.layers)
        }
        b.render(g);
    }, this);

    this.group = L.featureGroup(this.layers).addTo(map);
    map.fitBounds(this.group.getBounds(), {maxZoom: 14});
};

Page.prototype.tearDown = function () {
    this.blocks.forEach(function (b) {
        b.tearDown && b.tearDown();
    });

    N = 0;
    this.group.clearLayers();
    Block.image.layers = [];
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
    this.layers = [];

    this.images.forEach(function (image) {
        if (image.marker) {
            if (!image.marker.color) {
                image.marker.color = rgb2hex(dayColor);
            }
            image.marker.title = image.marker.title || image.credit;
            var marker = new Marker(image.marker);
            image.marker = marker;
            this.layers.push(marker.feature);
        }
    }, this);

};

Block.image.layers = [];

Block.image.prototype.render = function (g) {
    g.node.style.width = "100%";
    g.node.classList.add('pure-image');

    var gallery = Gallery({
        headline: pages[current].title, // HACK
        images: this.images,
        viewer: viewer,
        parentAttributes: {className: 'pure-u-1-1 pure-gallery'},
        imgAttributes: {className: ''},
    });

    React.renderComponent(gallery, g.node)
};

Block.image.prototype.tearDown = function () {
};

Block.title = function (args) {
    this.title = args.title;
    this.subtitle = args.subtitle;
};

Block.title.prototype.render = function (g) {
    var h1, h2;
    var u = new Pure(['u-1', 'title']);

    g.node.classList.add('title');

    if (this.title) {
        h1 = document.createElement('h1'),
        h1.innerHTML = this.title;
        u.addChild(h1)
    }
    if (this.subtitle) {
        h2 = document.createElement('h2');
        h2.innerHTML = this.subtitle;
        u.addChild(h2)
    }

    u.addTo(g);
};

Block.link = function (args) {
    this.name = args.name;
    this.href = args.href;
    this.type = args.type;
    this.description = args.description;
};

Block.link.prototype.render = function (g) {
    var u = new Pure(['u-1', 'link']);

    g.node.classList.add('link');

    var icon = document.createElement('span');
    icon.className = 'icon mega-octicon octicon-device-camera-video'

    var span = document.createElement('span');
    span.innerHTML = this.description + '&nbsp;&mdash;&nbsp;';

    var a = document.createElement('a');
    a.href = this.href;
    a.innerHTML = this.name;
    a.target = '_blank';

    u.addChild(icon);
    u.addChild(span);
    u.addChild(a);
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
