<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Wall</router-link>
            <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
            <router-link v-else to="/admin">Admin</router-link>
            <router-link to="/about">About</router-link>
            <a v-if="isAuthenticated" @click="logout">Logout</a>
        </div>
        <router-view />
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
    get isAuthenticated() {
        return this.$store.state.auth.user;
    }

    async logout() {
        await this.$store.dispatch("auth/logout");
        this.$router.push("/wall");
    }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    margin: 0 10px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
