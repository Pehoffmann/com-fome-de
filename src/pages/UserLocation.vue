!<template>
  <b-row class="justify-content-center">
    <b-col cols="6" class="bg-info p-3 rounded-lg">
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
    </b-col>
  </b-row>
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
    new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(-23.5489, -46.6388)
        )
      }
    );
  },
  computed: {
    state() {
      return this.name.length >= 4;
    },
    invalidFeedback() {
      if (this.name.length > 0) {
        return "Enter at least 4 characters.";
      }
    }
  },
  methods: {
    localizarBotaoPressionado() {
      if (navigator.geolocation) {
        this.isLoading = true;
        navigator.geolocation.getCurrentPosition(
          position => {
            this.getEnderecoFrom(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          error => {
            this.error =
              "Localziador não conseguiu achar seu endereço. Por favor digite manualmente.";
            console.log(error.message);
          }
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
</style>
