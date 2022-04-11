<template>
  <div class="pages">
    {{userMessage}}
    <span v-if="!noData">
    
      <p>Click on an entry's image below to view its deity page.</p>
      
      <!-- This is the table that holds all the available pages, sorted by date modified -->
      <table id="deityTable">
        <tr v-for="deity in deities" v-bind:key="deity.id">
        
          <td>
            <a :href="deity_link(deity.id)">
              <img :src="deity.cover" class="DeityCover">
            </a>
          </td>
          
          
          <td class="DeityName"><a :href="deity_link(deity.id)">{{deity.name}}</a></td>
          <td class="DeityDate">Last modified: {{deity.dateModified}}</td>
           
        </tr>
      </table>
    
    </span>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import start from '@/components/start.vue'

import axios from "axios";

export default {
  //Helpful resources:
  // https://stackoverflow.com/questions/59817814/vue-typeerror-this-is-undefined
  // https://stackoverflow.com/questions/51516084/how-do-i-add-a-google-font-to-a-vuejs-component#51517799
  
  name: 'PagesView',
  
  components: {
    
  },
  
  data() 
  {
    return {
      //This holds each deity object retrieved from the API
      deities: [], 
      noData: true,
      userMessage: "Loading..."
    }
  },
  
  methods: {
    retrieve_deities: function()
    {
      let URL = "http://localhost:5000/api/";
      
      axios.get(URL + "deity", {}).then(function(response)
      {
        this.deities = response.data;
        this.noData = false;
        this.userMessage = "";
      }.bind(this),
      function(error)
      {
        console.log(error);
        this.userMessage = "Unable to connect to the API; it's likely offline.";
      }.bind(this));
      
    },
    
    deity_link: function(id)
    /** Returns a link to the deity's page. */
    {
      let URL = "http://localhost:8080/pages/" + id;
      return URL;
    }
  },
  
  //Called when the page fully loads
  mounted()
  {
    this.retrieve_deities();
  }
  
}
</script>

<style scoped>
  a
  {
    text-decoration: none;
    color: #2c3e50;
  }
  
  #deityTable
  {
    margin: auto;
    border: 3px dotted;
  }
  
  .DeityCover 
  {
    width: 150px; /* Use Bootstrap img-responsive here */
    transition: width 0.1s ease-out;
  }
  
  .DeityCover:hover
  {
    width: 175px;
  }
  
  .DeityName
  {
    font-size: 1.5em;
    padding-left: 35px;
    padding-right: 35px;
  }
  
  .DeityDate
  {
    width: 150px;
    /*background-color: grey;*/
  }
</style>