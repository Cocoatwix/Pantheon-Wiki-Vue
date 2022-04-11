<!-- This is like our navigation bar for the app -->
<template>
  <div id="app">
    <nav>
      <span id="navSpan">
        <router-link to="/pages">
          <img alt="home" src="../public/img/home.png" class="navImg">Pages
        </router-link>
        <router-link to="/createpage">
          <img alt="home" src="../public/img/create.png" class="navImg">Create Page
        </router-link>
        <router-link to="/about">
          <img alt="home" src="../public/img/about.png" class="navImg">About
        </router-link>
      </span>
    </nav>
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;400&display=swap');

#app {
  font-family: "Roboto Slab", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.navImg
{
  width: 25px;
  margin-left: 20px;
  transform: translate(0px, 5px);
}

#navSpan
{
  color: #339933;
}
</style>
