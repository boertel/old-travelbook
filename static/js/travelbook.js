var dayColor,
    content = $('#content')[0];

$(document).keydown(function (e) {
    // left or j
    if (e.which === 37 || e.which === 74) {
    }
    if (e.which === 39 || e.which === 75) {
    }
    // right or k
});

var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

function loadDay(number) {
    $('#content').html('');

    var name = 'day-' + number,
        bubble = $('.' + name);

    dayColor = bubble.find('a').css('background-color');

    $('ul.days li').removeClass('active');
    bubble.addClass('active');
    $("#map").css("border-color", dayColor);


    $.getJSON('./data/' + name + '.json', function (data) {
        var blocks = data.blocks;
        blocks.forEach(function (b) {
            var block = factory(b);
            content.appendChild(block.render());
        });
    });
}

function factory(block) {
    var Constructor = Block[block.type];
    return new Constructor(block.args);
}

var Block = {};

/* Block Text */
Block.text = function (args) {
    this.text = args.text;
};
Block.text.prototype.render = function () {
    var g = new Pure(['g', 'text']),
        u = new Pure('u-1');

    u.addTo(g);

    var p = document.createElement('p');
    p.innerHTML = this.text;

    u.addChild(p);

    return g.node;
};

/* Block Image */
Block.image = function (args) {
    this.images = args.images;
};
Block.image.prototype.render = function () {
    var length = this.images.length,
        g = new Pure(['g', 'image']),
        u = new Pure(['u-1-1', 'gallery']);

    this.images.forEach(function (image) {
        var a = document.createElement('a'),
            img = document.createElement('img');
        a.className = 'col-' + (image.unit || '3');
        img.className = 'pure-img';
        img.src = image.src;

        a.setAttribute('data-fluidbox', true);
        a.appendChild(img);

        $(a).fluidbox();

        u.addChild(a);

        if (image.marker) {
            if (!image.marker.color) {
                image.marker.color = rgb2hex(dayColor);
            }
            var marker = new Marker(image.marker, img);
            marker.feature.addTo(map);
        }
    });
    u.addTo(g);
    return g.node;
};

/* Block Title/Subtitle */
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

    return g.node;
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
    this.feature = L.mapbox.featureLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            coordinates: args.coordinates
        },
        properties: {
            title: args.title,
            description: args.description,
            // one can customize markers by adding simplestyle properties
            // https://www.mapbox.com/foundations/an-open-platform/#simplestyle
            'marker-size': args.size,
            'marker-color': args.color,
            'marker-symbol': args.symbol
        }
    });

    if (node) {
        this.feature.addEventListener('mouseover', function () {
            node.style.borderWidth = '10px'
            node.style.borderColor = args.color;
        });
        this.feature.addEventListener('mouseout', function () {
            node.style.borderWidth = '0px';
        });
        this.feature.addEventListener('click', function () {
            $(node).trigger('click');
        });
    }

    /*
    L.featureGroup([this.feature])
        .on('click', function () { console.log('group 1'); }).addTo(map);
    */
};
