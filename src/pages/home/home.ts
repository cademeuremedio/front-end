import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { PostoSaude } from './postosaude';
import { NavController } from 'ionic-angular';
import jQuery from "jquery";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  infoWindows: any;
  markers: any;
  latlangs: any;
  initialMarker: any;
  search: string;
  items: any;
  filtereditems:any;
  showSugest: any;
  error: string;
  item_selecionado: any;
  headerClass: any;
  mapView: any;
  coords: any;
  stopMap: any;
  numberMarker: any;


  constructor(private geolocation: Geolocation, public httpClient: HttpClient, navCtrl: NavController) {
    this.filtereditems=[];
  }

  // reclamar = function(posto, remedio, target){
  //   var reclamar_url = 'https://cademeuremedio.herokuapp.com/denuncia/' + posto +
  //     '/' + remedio
  //   var reclamar = this.httpClient.get(reclamar_url);
  //   reclamar.subscribe(data => {
  //     this.error = '';
  //     if(data.length>0){
  //       //console.log("returned data reclamar:");
  //       console.log(data);
  //     }
  //   });
  // }

  setMapOnAll = function(map) {
    //console.log("MARKERS:");
    //console.log(this.markers);
    if(this.markers.length>0){
      for(let marker of this.markers) {
        marker.setMap(map);
      }
    }
  }

  setStyleInicial = function(){ 
    //console.log("setStyleInicial");
    //jQuery("#header").css('margin-top','200px');
    this.mapView = false;
  }
  setStyleMapa = function(){ 
    //console.log("setStyleMapa");
    //jQuery("#header").css('margin-top','20px');
    this.mapView = true;
  }

  selectItem = function(selectItem){
    console.log('selectItem');
    console.log(selectItem);
    this.search = selectItem.remedio;
    this.item_selecionado = selectItem;
    this.showSugest = false;
    this.setStyleMapa();
    this.buscarPostos();
  }

  deselectItem = function(){
    console.log("deselectItem");
    this.setMapOnAll(null);
    this.search = '';
    this.item_selecionado = '';
    this.showSugest = false;
    this.latlangs = [];
    this.markers = [];
    this.infoWindows = [];
    this.setStyleInicial(); 
  }

  filterItems = function(){
    if(this.search==''){
      this.showSugest = false;
      this.error = '';
    }else if(this.search.length>4){
      this.showSugest = true;
      var drugs_url = 'https://cademeuremedio.herokuapp.com/lista/' + this.search;
      var drugs = this.httpClient.get(drugs_url);
      drugs.subscribe(data => {
        this.error = '';
        if(data.length>0){
          if(!data[0].ERROR){
            console.log("returned data:");
            console.log(data);
            this.filtereditems = data;
          }else{
            console.log('returned error:');
            console.log(data[0].ERROR);
            this.showSugest = false;
            this.error = data[0].ERROR;
          }
        }
      });
    }
  }

  resetCenter = function(){
    console.log('recenter');
    console.log(this.initialMarker.getPosition());
    this.map.setCenter(this.initialMarker.getPosition())
  }

  closeAllInfoWindows = function () {
    if(this.infoWindows){
      for(let infoWindow of this.infoWindows) {
        infoWindow.close();
      }
    }
  }

  addMarker = function(map, title, position, info, id) {
    var flagstop = 0;
    if(this.latlangs){
      for(let row of this.latlangs) {
        if(position.lat()==row.lat()&&position.lng()==row.lng()){
          flagstop = 1;
        }
      }
    }
    if(flagstop){
      console.log("IGUAL!");
    }else{
      if(this.item_selecionado){
        console.log('this.item_selecionado');
        console.log(this.item_selecionado);
        console.log("chamando score:");
        var score_url = 'https://cademeuremedio.herokuapp.com/score/'+id+'/'+this.item_selecionado.id+'/450540';
        var score = this.httpClient.get(score_url); 
        score.subscribe(data => {
          if(data){
            //console.log(score_url);
            //console.log('numberMarker:'+data.resultado);
            //numberMarker = data.resultado;
            var numberMarker = 1;
            numberMarker = data.resultado;
            if (numberMarker==0){
              numberMarker = 1;
            }
            console.log('numberMarker: '+numberMarker);
            console.log((title=='ME'?'assets/imgs/marker-me.png':'assets/imgs/marker'+numberMarker+'.png'));
            var marker = new google.maps.Marker({
              title: title+numberMarker,
              icon: { url : (title=='ME'?'assets/imgs/marker-me.png':'assets/imgs/marker'+numberMarker+'.png') },
              animation: 4,
              position: position,
              map: map
            });

            var infoWindowContent = '<div id="content" style= "max-width: 90%;">' + 
              '<span style="font-face: arial; font-size: 14px; font-weight: bold;">' + 
                title + '</span><br/><span style="font-face: arial; font-size: 14px;">';
            var i = 0;
            if(info){
              for(let row of info) {
                if(row){
                  infoWindowContent+= row + '<br/>';
                  i++;
                }
              }
            }
            infoWindowContent+='</span><hr style="width: 90%;" />' + 
            '<div style="width: 100%: text-align: center;">' + 
            '<div id="btncontainer"><div rel="' + this.item_selecionado.id + '|' + id + '" id="reclamar" style="width: 150px;background: #BE5E9F; color: #FFF; border-radius: 5px;' + 
            'font-weight: bold;text-align: center;padding: 10px 5px;display: block; margin-left: 50px;'+ 
            '">RECLAMAR<br/>' +
            'Falta esse remédio!</div>'+
            '<div rel="' + this.item_selecionado.id + '|' + id + '" id="reclamou" style="width: 250px;background: #45AEB1;color: #FFF;border-radius: 5px;font-weight: bold;text-align: center;'+ 
            'padding: 10px 5px;display: none;margin-left: 20px;padding: 0px 10px 0px 10px;">Agradecemos a contribuição!<br>Você reclamou</div>'+
            '</div></div>'+
            '</div>';
            var infoWindow = new google.maps.InfoWindow({
              content: infoWindowContent
            });
            marker.addListener('click', () => {
              //this.stopMap = true;
              this.map.setCenter(marker.getPosition());
              this.closeAllInfoWindows();
              infoWindow.addListener('domready', () => {
                document.getElementById('reclamar').addEventListener('click', ($element) => {
                  let element = $element.target as HTMLInputElement
                  var str = jQuery(element).attr('rel');
                  var ids = str.split("|");
                  console.log(ids);
                  jQuery.get( "https://cademeuremedio.herokuapp.com/denuncia_municipio/" + ids[0] + "/" + ids[1] + '/450540', function( data ) {
                    console.log( "Reclamacao data loaded: ");
                    console.log( data );
                    jQuery('#reclamar').hide();
                    jQuery('#reclamou').show();
                  });
                });
              });
              infoWindow.open(this.map, marker);
              if(!this.infoWindows){
                this.infoWindows = [];
              }
              this.infoWindows.push(infoWindow);
            });
            if(!this.markers){
              this.markers = [];
            }
            this.markers.push(marker);
            if(!this.latlangs){
                this.latlangs = [];
            }
            this.latlangs.push(marker.getPosition());
            //console.log('marker.getPosition()');
            //console.log(marker.getPosition());
            //this.stopMap = false;

              }else{
                console.log(score_url);
                console.log("!data;");
              }
        });
      }

      if(title=='ME'){
        var marker = new google.maps.Marker({
          title: title,
          icon: { url : ('assets/imgs/marker-me.png') },
          animation: 4,
          position: position,
          map: map
        });
        this.initialMarker = marker;
      }
    }
  }

  buscarPostos = function(){
    if(!this.stopMap){
      // this.stopMap = true;
      // this.map.addListener('center_changed', () => { 
      //   this.buscarPostos();
      // });
      console.log("map.getCenter();");
      var mapCenter = this.map.getCenter();
      console.log("mapCenter.lat");
      console.log(mapCenter.lat());
      console.log("mapCenter.lng");
      console.log(mapCenter.lng());
      var places_raio = 50;
      var places_url = 'https://cademeuremedio.herokuapp.com/estabelecimentos' +
        '/latitude/' + mapCenter.lat() +
        '/longitude/' + mapCenter.lng() +
        '/raio/' + places_raio +
        '?categoria=POSTO%20DE%20SA%C3%9ADE';
      var places = this.httpClient.get(places_url); 
      places.subscribe(data => {
        var ocultarLocais = [ '6477267', '2692538', '2692090', '2692139', '2692147' ]; 
        //codCnes: CS SANTINHO, CS INGLESES,CS RATONES, CS SANTO ANTONIO DE LISBOA, CS VARGEM GRANDE
        for(let row of <PostoSaude[]>data) {
          console.log(row.nomeFantasia);
          console.log(row);
          if(ocultarLocais.indexOf(String(row.codCnes)) == -1){
            var row_position = new google.maps.LatLng(row.lat, row.long);
            var info = [ 
                (row.logradouro + ', ' + row.numero),
                (row.bairro),
                (row.telefone?row.telefone:''),
                (row.turnoAtendimento),
            ];
            this.addMarker(this.map, row.nomeFantasia, row_position, info, row.codUnidade);
          }else{
            console.log('**ocultando');
          }
        }
      },
      err => {
        console.log("Error occured.")
      });
    }
    //this.stopMap = false;
  }

    ionViewDidLoad() {
      this.geolocation.getCurrentPosition()
        .then((resp) => {
          const position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.coords = resp.coords;

          const mapOptions = {
            zoom: 13,
            center: position,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
                      {
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#ebe3cd"
                          }
                        ]
                      },
                      {
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#523735"
                          }
                        ]
                      },
                      {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                          {
                            "color": "#f5f1e6"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative",
                        "elementType": "geometry.stroke",
                        "stylers": [
                          {
                            "color": "#c9b2a6"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative.land_parcel",
                        "elementType": "geometry.stroke",
                        "stylers": [
                          {
                            "color": "#dcd2be"
                          }
                        ]
                      },
                      {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#ae9e90"
                          }
                        ]
                      },
                      {
                        "featureType": "landscape.natural",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#dfd2ae"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.attraction",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.business",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.government",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.medical",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.park",
                        "elementType": "geometry.fill",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.park",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.place_of_worship",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.school",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "poi.sports_complex",
                        "stylers": [
                          {
                            "visibility": "off"
                          }
                        ]
                      },
                      {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#f5f1e6"
                          }
                        ]
                      },
                      {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#fdfcf8"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#f8c967"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [
                          {
                            "color": "#e9bc62"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#e98d58"
                          }
                        ]
                      },
                      {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry.stroke",
                        "stylers": [
                          {
                            "color": "#db8555"
                          }
                        ]
                      },
                      {
                        "featureType": "road.local",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#806b63"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.line",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#dfd2ae"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.line",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#8f7d77"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.line",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                          {
                            "color": "#ebe3cd"
                          }
                        ]
                      },
                      {
                        "featureType": "transit.station",
                        "elementType": "geometry",
                        "stylers": [
                          {
                            "color": "#dfd2ae"
                          }
                        ]
                      },
                      {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                          {
                            "color": "#b9d3c2"
                          }
                        ]
                      },
                      {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                          {
                            "color": "#92998d"
                          }
                        ]
                      }
                    ]
                  }

          this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
          this.addMarker(this.map, "ME", position, false, false);

        }).catch((error) => {
          console.log('Erro ao recuperar sua posição', error);
        });
  }
}
