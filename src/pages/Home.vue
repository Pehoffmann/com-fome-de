!<template>
  <div>
    <NavBar />
    <UserLocationForm />
    <LocalsList />
  </div>
</template>

<script>
import UserLocationForm from "../components/UserLocationForm.vue";
import NavBar from "../components/NavBar.vue";
import LocalsList from "../components/LocalsList.vue";
export default {
  name: "Home",
  components: {
    UserLocationForm,
    NavBar,
    LocalsList
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
