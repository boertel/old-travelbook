function extract_num_and_denom (value) {
    var split = value.trim().split('/')
    return {
        num: parseFloat(split[0]),
        denom: parseFloat(split[1])
    }
}

function convert_to_degrees (value) {
    value = value.split(',')

    var degrees = extract_num_and_denom(value[0]),
        d = degrees.num / degrees.denom;

    var minutes = extract_num_and_denom(value[1]),
        m = minutes.num / minutes.denom;

    var seconds = extract_num_and_denom(value[2]),
        s = seconds.num / seconds.denom;

    return d + (m / 60.0) + (s / 3600.0)
}

function get (exif_data) {
    var latitude, longitude;


    gps_latitude = exif_data.GPSLatitude
    gps_latitude_ref = exif_data.GPSLatitudeRef

    gps_longitude = exif_data.GPSLongitude
    gps_longitude_ref = exif_data.GPSLongitudeRef


    if (gps_latitude && gps_latitude_ref && gps_longitude && gps_longitude_ref) {
        latitude = convert_to_degrees(gps_latitude)
        if (gps_latitude_ref !== 'N') {
            latitude *= -1;
        }

        longitude = convert_to_degrees(gps_longitude)
        if (gps_longitude_ref !== 'E') {
            longitude *= -1;
        }

    }

    return {
        latitude: latitude,
        longitude: longitude
    }
}

module.exports = get;
