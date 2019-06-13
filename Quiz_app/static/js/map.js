    /* ==============================================
    MAP -->
    =============================================== */


    function locate_us(lat, long){ 
        "use strict";
        var locations = [];
        $.ajax({
         type : "POST",
         url: '/locations',
         contentType: 'application/json;charset=UTF-8',
         success: function(result){
            for( var store in result.stores){
                locations.push(result.stores[store])
            }

            console.log(locations);
            var map=new google.maps.Map(document.getElementById('map'), {
            zoom: 11, scrollwheel: false, navigationControl: true, mapTypeControl: false, scaleControl: false, draggable: true, 
            styles: [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#444444"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#3ac5c8"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    }
            ], 

            //window.navigator.geolocation.getCurrentPosition(
            //  new google.maps.LatLng(49.210463, -122.705501)
            //);

   
            center: new google.maps.LatLng(lat, long), 
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow=new google.maps.InfoWindow();
        var marker,
        i;
        for (i=0; i < locations.length; i++) {
            marker=new google.maps.Marker( {
                position: new google.maps.LatLng(locations[i][1], locations[i][2]), map: map, icon: locations[i][4]
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(locations[i][0]);
                    infowindow.open(map, marker);
                }
            }
            )(marker, i));
        }
            
         }
        });



       }
  
  
  window.onload = function() {

    navigator.geolocation.getCurrentPosition(locationSuccess);
    
    function locationSuccess(position) {
       var lat = position.coords.latitude;
       var long = position.coords.longitude;
       locate_us(lat, long);
    }
    
  }



  