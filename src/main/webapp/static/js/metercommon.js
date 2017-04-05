function getMeters() {
    var meterMap = {};
    // load meter
    $.ajax({
        url: "/meter/meter_map",
        async:false, 
        type: "get",
    }).done(function(data) {
        meterMap = data;
    }).fail(function(data) {});
    // load meter end
    return meterMap;
}