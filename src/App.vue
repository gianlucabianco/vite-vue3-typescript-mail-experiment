<template>

  <h1>Vite + Vue 3 powered Mail Inbox</h1>
  <!-- start the server on the port 8000 via: -->
  <!-- json-server --watch db.json --port 8000 -->
  <Suspense>
    <!--
      This is sugar.
      Main table is automatically put inside the Suspense #default slot.
      Write less, produce more :D
    -->
    <MainTable />
    <template #fallback>
      Loading ...
    </template>
  </Suspense>

</template>

<script>
import MainTable from './components/MainTable.vue';
import useEmailSelection from './composables/use-email-selection';

export default {
  name: 'App',
  components: {
    MainTable,
  },
  setup() {
    return {
      emailSelection: useEmailSelection(),
    }
  }
};
</script>

<style
  lang="css"
  src="./app.css"
></style>