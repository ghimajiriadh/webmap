/**
 * Created by home on 16/11/2017.
 */

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.transform([10.18338,36.890662 ], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
    })
});
