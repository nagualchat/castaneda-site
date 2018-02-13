<template>
  <div id="app">

		<b-navbar type="dark" variant="dark">
			<b-navbar-brand href="#">Список перепросмотра</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button size="sm" class="my-2 my-sm-0" 
          @click="debug = !debug" :variant="debug == false ? 'secondary' : 'success'">Отладка</b-button>
        </b-nav-form>
      </b-navbar-nav>
		</b-navbar>

    </br>
 
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col col md="10">
              <div class="content">
                <tree :list="tree"/>
              </div>
              <div class="content" v-show="debug == true">
                <pre>{{tree}}</pre>
              </div>
            </b-col>
        </b-row>
    </b-container>

  </div>
</template>

<script>
import Tree from "./components/Tree.vue";
export default {
  name: "app",
  components: {
    Tree
  },
  data() {
    return {
      debug: false,
      tree: [
        {
          id: "d92edc0d-4c88-49f0-af1b-322b7c0adb34",
          name: "Категория 1",
          node: []
        },
        {
          id: "840034a1-c9ad-4e8e-9e36-01cd4abc23dd",
          name: "Категория 2",
          node: [
            {
              id: "e3ab93b2-b7e6-4419-ba1a-a7e220271f91",
              name: "Джон Смит 2-1",
              node: [
                {
                  id: "00bf39c3-397e-40ff-9051-abc302e903f9",
                  name: "Джон Смит 2-1-1",
                  node: []
                }
              ]
            },
            {
              id: "1c3fcc65-5254-4405-8406-6a22aed3dc37",
              name: "Категория 2-2",
              node: [
                {
                  id: "b16ef7c9-10b8-427b-b4c4-d5abdfb6b8f0",
                  name: "Джон Смит 2-2-1",
                  node: []
                },
                {
                  id: "b0796eb0-39d0-4ecd-97f7-ccec4e51bc9e",
                  name: "Джон Смит 2-2-2",
                  node: []
                },
                {
                  id: "d7f0bea8-89d5-43ba-a5cf-921b794b9986",
                  name: "Джон Смит 2-2-3",
                  node: []
                }
              ]
            }
          ]
        },
        {
          id: "66da99d3-0044-4fce-9257-be00ebf263be",
          name: "Категория 3",
          node: []
        }
      ]
    };
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
</style>
