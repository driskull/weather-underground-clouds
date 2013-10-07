define([
    "dojo/_base/declare",
    "dojo/io-query",
    "esri",
    "esri/geometry",
    "esri/tasks/locator",
    "esri/utils"
],
function (declare, ioQuery, esri) {
    var Widget = declare("modules.WUSatelliteLayer", esri.layers.DynamicMapServiceLayer, {
        constructor: function (apiKey) {
            this.key = apiKey;
            this.spatialReference = new esri.SpatialReference({
                wkid: 4326
            });
            this.loaded = true;
            this.onLoad(this);
            this.count = 0;
            this.delay = 3000;
        },
        getImageUrl: function (extent, width, height, callback) {
            var _self = this;
            var delay;
            if (this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }
            if(!_self.count){
                delay = 0;
            }
            else{
                delay = _self.delay;
            }
            this.updateTimeout = setTimeout(function () {
                var minPoint = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmin, extent.ymin, new esri.SpatialReference({
                    wkid: 102100
                })));
                var maxPoint = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmax, extent.ymax, new esri.SpatialReference({
                    wkid: 102100
                })));
                var params = {
                    minlat: Math.round(minPoint.y * 1000) / 1000, // may be issues with url length, round to correct
                    maxlat: Math.round(maxPoint.y * 1000) / 1000,
                    minlon: Math.round(minPoint.x * 1000) / 1000,
                    maxlon: Math.round(maxPoint.x * 1000) / 1000,
                    width: width,
                    height: height,
                    gtt: 107,
                    key: 'sat_vis',
                    basemap: 0,
                    borders: 0,
                    smooth: 1,
                    frame: 0,
                    num: 8,
                    delay:30,
                    timelabel: 0,
                    'timelabel.x': 0,
                    'timelabel.y': 0
                };
                _self.count++;
                callback('http://api.wunderground.com/api/' + _self.key + '/animatedsatellite/image.gif?' + ioQuery.objectToQuery(params));
            }, delay);
        }
    });
    return Widget;
});