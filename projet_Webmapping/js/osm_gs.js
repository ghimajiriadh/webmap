/**
 * Created by home on 30/11/2017.
 */



map.on('pointermove', function(event) {
    var coord3857 = event.coordinate;
    var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');

    $('#mouse3857').text(ol.coordinate.toStringXY(coord3857, 2));
    $('#mouse4326').text(ol.coordinate.toStringXY(coord4326, 5));
});

map.on('singleclick', function(evt) {
    onSingleClick(evt);
});



var clicked_coord;
var onSingleClick = function(evt) {
    var coord = evt.coordinate;
    console.log(coord);
    var str = coord;
    var source1 = access_layer_adm2;
    var source2 = access_layer_adm1;
    var layers_list = source2 + ',' + source1;
    var view = map.getView();
    var viewResolution = view.getResolution();
    url=lyr_adm1.getSource().getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        { 'INFO_FORMAT': 'text/javascript',
            'FEATURE_COUNT': 20,
            'LAYERS': layers_list,
            'QUERY_LAYERS': layers_list
        });
    console.log(url);
    if (url) { //call parseResponse(data)
        clicked_coord = coord;
        $.ajax(url,
            {dataType: 'jsonp'}
        ).done(function (data) {
            });
    }
    if(str) {
     str = '<p>' + str + '</p>';
     overlayPopup.setPosition(coord);
     content.innerHTML = str;
     container.style.display = 'block';
     }
     else{
     container.style.display = 'none';
     closer.blur();
     }
}
function parseResponse(data) {
    var poifound = 0;
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(data)
    });
    console.log((new ol.format.GeoJSON()).readFeatures(data));
    var features = vectorSource.getFeatures();
    var str=clicked_coord;
    for(x in features) {
        var id = features[x].getId();
        var props = features[x].getProperties();
        if((id.indexOf("clients")>-1) && (poifound==0))
        { str = str + '<br/>' + props["CATEGORIE"] + '<br/>' + props["CA"];
            poifound=1;
        }
        if(id.indexOf("gouvernorats")>-1)
        { str = str + '<br/>' + props["NOMG"];
// poifound=1;
            break;
        }
    }
   /* if(str) {
        var str1 = "<meta http-equiv="+"'Content-Type'"+"content="+"'text/html;charset=UTF-8'"+" />"
        str = '<p>' + str + '</p>';
        overlayPopup.setPosition(clicked_coord);
        content.innerHTML = str; //JSON.stringify(
        container.style.display = 'block';
        clicked_pois = 1;
    }
    else{
        container.style.display = 'none';
        closer.blur();
        clicked_pois = 0;
    }*/
}

var info_site='?';
var pixel = map.getPixelFromCoordinate(clicked_coord)
map.forEachFeatureAtPixel(pixel, function(feature) {
    if(info_site=='?')
        info_site = '<br/>' + feature.get('SITE_NAME') + '<br>';
//console.log(".....");
});
if(info_site!='?') str = str+info_site;

//Geolocation
var geolocation = new ol.Geolocation({
    projection: map.getView().getProjection(),
    tracking: true
});
geolocation.bindTo('projection', map.getView());
geolocation.on('change:position', function() { //real time tracking
//map.getView().setCenter(geolocation.getPosition());
//map.getView().setZoom(15);
});
// add a marker to display the current location
var marker = new ol.Overlay({
    element: document.getElementById('location'),
    positioning: 'center-center'
});
map.addOverlay(marker);
// and bind it to the geolocation's position updates
marker.bindTo('position', geolocation);
var list=[{}];
$.getJSON("data/sites2g.geojson", function(data) {

//console.log(data.features);
    $.each(data.features, function(key, valeur) {

        list.push({label:valeur.properties.SITE_NAME+"-"+valeur.properties.N_SEC,value:valeur.properties.SI})
    });
});
console.log(list);
var input = document.getElementById("sites");
var awesomplete = new Awesomplete(input, {
    minChars: 1,
    maxItems: 12,
    autoFirst: true
});
//awesomplete.list = list;

var features;
var layerVectorPoint;
var list=[];
// Auto complétion
var input = document.getElementById("sites");
var awesomplete = new Awesomplete(input, {
    minChars: 1,
    maxItems: 20,
    autoFirst: true
});
awesomplete.list = list;

function goTosite(){
    var siteID = input.value;

}
var search=$('#search');
search.on('click',function(){
    goTosite();
    return false;
});


















