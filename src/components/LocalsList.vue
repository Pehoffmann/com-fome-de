!<template>
  <div>
    <b-row class="br-16 mt-5 p-5 bg-success mx-4 ">
      <b-col class="bg-white">
        <div class="bg-light br-16 p-3">
          <b-form-group
            id="fieldset-1"
            description="Nos permita saber seu endereço."
            label-for="input-1"
            valid-feedback="Obrigado!"
          >
            <b-input-group class="mt-3">
              <b-form-input
                id="autocomplete-1"
                placeholder="Digite seu endereço"
                v-model="endereco"
                trim
              >
              </b-form-input>
              <template #append>
                <b-input-group-text>
                  <span @click="localizarBotaoPressionado">
                    <b-icon
                      v-if="!isLoading"
                      style="width: 1.5rem; height: 1.5rem;"
                      icon="geo-alt-fill"
                    >
                    </b-icon>
                    <b-spinner
                      v-else
                      style="width: 1.5rem; height: 1.5rem;"
                    ></b-spinner>
                  </span>
                </b-input-group-text>
              </template>
            </b-input-group>
            <b-row>
              <b-col>
                <b-form-select v-model="type" :options="options1">
                </b-form-select>
              </b-col>
              <b-col>
                <b-form-select v-model="radious" :options="options2">
                </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <b-button variant="outline-primary" @click="realizarBusca"
            >Buscar restaurantes proximos</b-button
          >
          <div class="bg-info" style="max-height: 300px; overflow: auto;">
            <div v-for="lugar in places" :key="lugar.id">
              <h5>{{ lugar.name }}</h5>
              <span>{{ lugar.vicinity }}</span>
            </div>
          </div>
        </div>
      </b-col>
      <b-col class="bg-black" ref="map"> </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      apiKey: "AIzaSyBiiEWnvf7qxpopvFwg6ytCc_VrCX9k6kc",
      endereco: "",
      error: "",
      isLoading: false,
      lat: 0,
      lng: 0,
      type: "",
      radious: "",
      options1: [{ value: "restaurant", text: "Restaurante" }],
      options2: [
        { value: 3, text: "3KM" },
        { value: 5, text: "5KM" },
        { value: 10, text: "10KM" },
        { value: 15, text: "15KM" },
        { value: 20, text: "20KM" }
      ],
      places: []
    };
  },

  mounted() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete-1"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-23.5489, -46.6388)
        )
      }
    );
    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      this.showUserLocalizacaoNoMapa(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      this.endereco = place.formatted_address;
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
    });
  },
  computed: {},
  methods: {
    realizarBusca() {
      console.log(this.lat, this.lng, this.type, this.radious);
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        this.lat
      },${this.lng}&type=${this.type}&radius=${this.radious * 1000}&key=${
        this.apiKey
      }`;

      axios
        .get(URL)
        .then(response => {
          this.places = response.data.results;
          this.mostrarLocaisNoMapa();
          console.log(response);
        })
        .catch(error => {
          this.error = error.message;
          console.log(error.message);
        });
    },
    mostrarLocaisNoMapa() {
      const map = new google.maps.Map(this.$refs["map"], {
        zoom: 15,
        center: new google.maps.LatLng(this.lat, this.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      const infoWindow = new google.maps.InfoWindow();

      for (let i = 0; i < this.places.length; i++) {
        const lat = this.places[i].geometry.location.lat;
        const lng = this.places[i].geometry.location.lng;
        const placeID = this.places[i].place_id;

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map
        });

        google.maps.event.addListener(marker, "click", () => {
          const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${this.apiKey}&place_id=${placeID}`;
          axios
            .get(URL)
            .then(response => {
              if (response.data.error_message) {
                this.error = response.data.error_message;
              } else {
                const place = response.data.result;
                infoWindow.setContent(`<div class="">
                 <span>
                  <b class="text-center">${place.name}</b>
                 </span> <br>
                 <span>${place.formatted_address}<br></span>
                 <span>${place.formatted_phone_number}<br></span>
                  </div>`);
                infoWindow.open(map, marker);
              }
              console.log(response.data.result);
            })
            .catch(error => {
              this.error = error.message;
              console.log(error.message);
            });
        });
      }
    },
    localizarBotaoPressionado() {
      if (navigator.geolocation) {
        this.isLoading = true;
        const options = {
          maximumAge: 10000,
          timeout: 5000,
          enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(
          position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.getEnderecoFrom(
              position.coords.latitude,
              position.coords.longitude
            );
            this.showUserLocalizacaoNoMapa(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          error => {
            this.error =
              "A geolocalização não conseguiu achar seu endereço. Por favor digite manualmente.";
            console.log(error.message);
          },
          options
        );
      } else {
        this.error = error.message;
        console.log("Seu navegador não suporta a geolocalização.");
      }
    },
    getEnderecoFrom(lat, long) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${this.apiKey}`
        )
        .then(response => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
            console.log(response.data.error_message);
          } else {
            this.endereco = response.data.results[0].formatted_address;
            console.log(response.data.results[0].formatted_address);
          }
        })
        .catch(error => {
          this.error = error.message;
          console.log(error.message);
        });
      this.isLoading = false;
    },
    showUserLocalizacaoNoMapa(lat, long) {
      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map
      });
    }
  }
};
</script>

<style>
.pac-icon {
  display: none;
}
.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
.pac-item:hover {
  background-color: #ececec;
}

.pac-item-query {
  font-size: 16px;
}

#map {
  width: 100%;
  height: 250px;
}
</style>
