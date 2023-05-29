!<template>
  <b-row class="justify-content-center">
    <b-col cols="6" class="bg-info p-3 rounded-lg">
      <div class="bg-success">
        <span
          >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus
          illo, exercitationem dolorum, quam laboriosam culpa minima excepturi
          magnam molestiae et doloremque beatae tempore nobis eos, at eveniet
          dolores omnis? Quam!</span
        >
      </div>
      <b-form-group
        id="fieldset-1"
        description="Nos permita saber seu endereço."
        label-for="input-1"
        valid-feedback="Obrigado!"
      >
        <b-input-group class="mt-3">
          <b-form-input
            id="input-1"
            placeholder="Digite seu endereço"
            v-model="name"
            trim
          >
          </b-form-input>
          <template #append>
            <b-input-group-text>
              <span @click="localizarBotaoPressionado">
                <b-icon icon="pin-map-fill"></b-icon
              ></span>
            </b-input-group-text>
          </template>
        </b-input-group>
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
export default {
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
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log("Latitude:", position.coords.latitude);
            console.log("Longitude:", position.coords.longitude);
          },
          error => {
            console.log(error.message);
          }
        );
      }
      console.log("Seu navegador não suporta a geolocalização.");
    }
  },
  data() {
    return {
      name: ""
    };
  }
};
</script>

<style></style>
