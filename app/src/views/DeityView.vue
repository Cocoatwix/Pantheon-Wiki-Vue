<template>
  <div class="deity">

    <div v-if="bodyData != ''">{{bodyData}}</div>
    <img :src="cover" id="deityCover" v-if="cover != ''">
    <span v-for="(description, index) in descriptions" v-bind:key="description"
    class="DeitySpan">
      <h2 v-if="headers[index] != ' '">
        {{headers[index]}}
      </h2>
      <p>
      {{description}}
      </p>
    </span>
    
    <br>
    <br>
    <span v-if="!noData">
      <span id="deleteDeity" v-on:click="delete_deity()">{{deleteMessage}}</span>
      <span id="modifyDeity">
        <a :href="'http://localhost:8080/modifypage/' + id">Modify Page</a>
      </span><br><br>
      <a title="This page is dedicated to the public domain via CC0." href="https://creativecommons.org/publicdomain/zero/1.0/"><img width="64" alt="CC0 button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CC0_button.svg/64px-CC0_button.svg.png"></a><br>
      <span id="copyright">Created by Zach Strong.</span><br>
    </span>
    <br>
    <br>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import start from '@/components/start.vue'

//Helpful resources:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// https://stackoverflow.com/questions/46198654/vue-on-div-click-go-to-url-defined-in-data

import axios from "axios";

export default {

  name: 'DeityView',
  
  components: {
    
  },
  
  data() 
  {
    return {
      //Data related to the deity
      bodyData: "Loading page...",
      noData: true,
      deleteMessage: "Delete Page",
      
      URL: "http://localhost:5000/api/",
      
      id: this.$route.params.id,
      name: "",
      cover: "",
      headers: [],
      descriptions: []
    }
  },
  
  methods: {
    get_deity_info: function(id)
    { 
      axios.get(this.URL + "deity/" + id, {}).then(function(response)
      {
        if (response.data.length == 0) //If the requested deity doesn't exist
        {
          this.bodyData = "404 Page Not Found";
        }
        else
        {
          //Unpacking data from response
          ({name: this.name, 
          cover: this.cover,
          headers: this.headers,
          descriptions: this.descriptions} = response.data[0]);
          
          this.bodyData = "";
          this.noData = false;
        }
      }.bind(this),
      function(error)
      {
        console.log(error);
        this.bodyData = "Unable to connect to API; it's likely offline.";
      }.bind(this));
    },
    
    delete_deity: function()
    /** Confirms that the user wants to delete the page, then deletes it. */
    {
      console.log(this.id);
      if (this.deleteMessage == "Delete Page")
        this.deleteMessage = "Click again to confirm delete";
      
      else
      {
        axios.delete(this.URL + "deity/" + this.id, {})
        .then(function()
        {
          //Redirect back to page list
          window.location.href = "/";
        },
        function(error)
        {
          this.deleteMessage = "Unable to delete page";
          console.log(error);
        }
        .bind(this));
      }
    }
  },
  
  //Called when the page fully loads
  mounted()
  {
    this.get_deity_info(this.id);
  }
  
}
</script>

<style scoped>
  a
  {
    text-decoration: none;
    color: #333399;
  }
  
  a:hover
  {
    text-decoration: underline;
  }
  
  .deity
  {
    margin: auto;
    width: 80%;
  }
  
  .DeitySpan
  {
    text-align: left;
  }
  
  #deityCover
  {
    float: right;
    border: 3px solid;
    margin: 5%;
  }
  
  #deleteDeity
  {
    margin-right: 50px;
    color: #993333;
    cursor: pointer;
  }
  
  #deleteDeity:hover
  {
    text-decoration: underline;
  }
  
  #copyright
  {
    font-size: 0.75em;
    color: grey;
  }
</style>