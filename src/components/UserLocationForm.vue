!<template>
  <div>
    <div class="br-16 mt-5 p-5 bg-danger mx-4 ">
      <div class="text-center mb-4">
        <h1 class="fonte-primaria fonte-bold text-white">
          Find Your favorite place here!
        </h1>
        <h3 class="fonte-secundaria fonte-semi-bold text-white">
          Selecione 3 coisas
        </h3>
      </div>
      <div class="bg-light br-16 m-form p-3">
        <div class="bg-danger">
          <span v-show="error">{{ error }}</span>
        </div>
        <b-form-group
          id="fieldset-1"
          description="Nos permita saber seu endereço."
          label-for="input-1"
          valid-feedback="Obrigado!"
        >
          <b-input-group class="mt-3">
            <b-form-input
              id="autocomplete"
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
        </b-form-group>
      </div>
      <div class="d-flex justify-content-center mt-3 m-form br-16">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      endereco: "",
      error: "",
      isLoading: false
    };
  },

  mounted() {
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
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
  },
  computed: {},
  methods: {
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
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBiiEWnvf7qxpopvFwg6ytCc_VrCX9k6kc`
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
