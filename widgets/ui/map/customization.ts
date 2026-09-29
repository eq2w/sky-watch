import { Customization } from "@yandex/ymaps3-types";

export const mapCustomization : Customization = [
    {
        "tags": {
            "any": ["landscape", "admin", "landcover", "land"]
        },
        "elements": "geometry",
        "stylers": {
            "color": "#0D1117"
        }
    },
    {
        "tags": {
            "any": ["water"]
        },
        "elements": "geometry",
        "stylers": {
            "color": "#151B23"
        }
    },
    {
        "tags": {
            "any": ["poi", "address", "geographic_line", "transit", "road_5", "road_6", "road_7", "road_limited", "road_minor", "road_unclassified", "path", "road_construction", "crosswalk", "underpass", "traffic_light", "road_surface", "road_marking", "ice_road", "ferry"]
        },
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "tags": {
            "any": ["road", "road_1", "road_2", "road_3", "road_4"]
        },
        "elements": "geometry",
        "stylers": {
            "color": "#293340"
        }
    },
    {
        "tags": {
            "any": ["terrain", "land", "landscape"]
        },
        "elements": "label",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "tags": {
            "any": ["road", "road_1", "road_2", "road_3", "road_4"]
        },
        "elements": "label.icon",
        "stylers": {
            "visibility": "off"
        }
    },
]