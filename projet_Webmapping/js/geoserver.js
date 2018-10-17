/**
 * Created by home on 16/11/2017.
 */


//URL Geoserver
var url_geoserver = "http://localhost:8080/geoserver/wms";
//url des couches
var access_layer_adm1 = "webmapping:tun_gouvernorats_utm";
var access_layer_adm2= "webmapping:tunis_phr_8bits";
var access_layer_adm3 = "webmapping:pdv_utm";
var access_layer_adm4 = "webmapping:clients_utm";
var access_layer_adm5 = "webmapping:roads_utm";


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container
});
//déclaration des couches openlayers
var lyr_adm1 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm1, "TILED": "true"}

    })),
    title: "Gouvernorats"
});

lyr_adm1.setVisible(true);
//declaration des couches 2
var lyr_adm3 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm3, "TILED": "true"}

    })),
    title: "PDV"
});
lyr_adm3.setVisible(true);
/////////////////////////////////////////////////////////////////
var lyr_adm4 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm4, "TILED": "true"}

    })),
    title: "Client"
});
lyr_adm4.setVisible(true);
/////////////////////////////////////////////////////////////
var lyr_adm5 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm5, "TILED": "true"}

    })),
    title: "Roads"
});
lyr_adm5.setVisible(true);
/////////////////////////////////////////////////////
var lyr_adm2 = new ol.layer.Tile({
    source: new ol.source.TileWMS(({
        url: url_geoserver,
        params: {"LAYERS": access_layer_adm2, "TILED": "true"}

    })),
    title: "Tunis"
});
lyr_adm2.setVisible(true);
///////////////////////////////////
//Definition des popups pour affichage des infos
var lyr_adm6 = new ol.layer.Tile({
    source: new ol.source.OSM(({
    })),
    title: "MAP"
});
lyr_adm6.setVisible(true);

//déclaration de la liste des couches à afficher
var layersList = [lyr_adm6,lyr_adm1 ,lyr_adm2,lyr_adm3,lyr_adm4,lyr_adm5];
var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326'
        }),
        new ol.control.LayerSwitcher({tipLabel: "Layers"})
    ]),
    target: 'map',
    overlays: [overlayPopup],
    layers: layersList,
    view: new ol.View({
        projection: 'EPSG:3857',
        center: new ol.geom.Point([9.378840, 34.240721]).transform('EPSG:4326',
            'EPSG:3857').getCoordinates(),
        zoom: 7
    })
});
// Define Geometries
var point = new ol.geom.Point(
    ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857')
);
var circle = new ol.geom.Circle(
    ol.proj.transform([9.378840, 34.240721], 'EPSG:4326', 'EPSG:3857'),
    600000
);
// Features
var pointFeature = new ol.Feature(point);
var circleFeature = new ol.Feature(circle);
// Source
var vectorSource = new ol.source.Vector({
    projection: 'EPSG:4326'
});
vectorSource.addFeatures([pointFeature, circleFeature]);
// vector layer
var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});
//add layer to the map
map.addLayer(vectorLayer);


var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 100, 50, 0.3)'
    }),
    stroke: new ol.style.Stroke({
        width: 2,
        color: 'rgba(255, 100, 50, 0.8)'
    }),
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(55, 200, 150, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            width: 1,
            color: 'rgba(55, 200, 150, 0.8)'
        }),
        radius: 7
    })
});
// vector layer with the style
var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: style
});



var button = $('#pan').button('toggle');
var interaction;
$('div.btn-group button').on('click', function(event) {
    var id = event.target.id;
// Toggle buttons
    button.button('toggle');
    button = $('#'+id).button('toggle');
// Remove previous interaction
    map.removeInteraction(interaction);
// Update active interaction
    switch(event.target.id) {
        case "select":
            interaction = new ol.interaction.Select();
            map.addInteraction(interaction);
            break;
        case "point":
            interaction = new ol.interaction.Draw({
                type: 'Point',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "line":
            interaction = new ol.interaction.Draw({
                type: 'LineString',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "polygon":
            interaction = new ol.interaction.Draw({
                type: 'Polygon',
                source: vectorLayer.getSource()
            });
            map.addInteraction(interaction);
            break;
        case "modify":
            interaction = new ol.interaction.Modify({
                features: new ol.Collection(vectorLayer.getSource().getFeatures())
            });
            map.addInteraction(interaction);
            break;
        default:
            break;
    }
});

interaction = new ol.interaction.Draw({
    type: 'Point',
    source: vectorLayer.getSource()
});


//sites2g
// Vector layer
var layerVectorPoint = new ol.layer.Heatmap({
    source: new ol.source.GeoJSON({
        url: 'data/sites2g.geojson',
        projection: 'EPSG:3857'
    })
});
console.log(layerVectorPoint.getSource().getFeatures().length);
map.addLayer(layerVectorPoint);


var features;
var layerVectorPoint;
$.getJSON("data/sites2g.geojson", function(data) {
    features = new ol.format.GeoJSON().readFeatures( data, {
        featureProjection: 'EPSG:3857'
    } );
    for(x in features) {
        var props = features[x].getProperties();
        var id = props["SI"]
        features[x].setId(id);
    }
    var source = new ol.source.Vector({
        features: features
    });
    layerVectorPoint = new ol.layer.Heatmap({
        source:source
    });
    console.log(layerVectorPoint.getSource().getFeatures().length);
    map.addLayer(layerVectorPoint);
});

var button_position=$('#position');
button_position.on('click', function() {
    var position=geolocation.getPosition();
    map.getView().setCenter(position);
    map.getView().setZoom(15);
});
// Button vue globale
var vue=$('#Tunisie');
var extent=[9.54,31,9.71,37];
extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));

vue.on('click', function() {
    map.getView().fitExtent(extent,map.getSize()),
        map.getView().setZoom(7);

});

