!<template>
  <div>
    <NavBar />
    <UserLocationForm />
  </div>
</template>

<script>
import UserLocationForm from "../components/UserLocationForm.vue";
import NavBar from "../components/NavBar.vue";
export default {
  name: "Home",
  components: {
    UserLocationForm,
    NavBar
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>

<style></style>
