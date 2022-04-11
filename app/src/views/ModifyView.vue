<template>
  <div class="modifypage">
    <h2>Modify a Page</h2>
    <p v-if="userMessage != ''">{{userMessage}}</p>
    
    <label>Name: 
    <input v-model="newDeity.name"></label>
    
    <label>Cover photo: 
    <input v-model="newDeity.cover"></label>
    <br><br><br>
    
    <label>Enter some lore!</label>
    <br><br>
    <!-- For selecting new paragraphs -->
    <button v-on:click="change_paragraph(-1)">&laquo;</button>
    <button v-on:click="change_paragraph(1)">&raquo;</button>
    Paragraph {{currentParagraph+1}}/{{numberOfParagraphs}}
    <button v-on:click="create_paragraph()">+</button>
    <button v-on:click="delete_paragraph()">-</button>
    <br><br>
    
    <label>Heading: 
    <input v-model="newDeity.headers[currentParagraph]"></label>
    <br>
    
    <textarea rows="10" cols="50" 
    v-model="newDeity.descriptions[currentParagraph]"></textarea>
    <br>
    
    <button id="updateButton" v-on:click="update_page()">Update Page</button>
    <button id="viewButton" v-if="linkToPage != ''"><a :href="linkToPage">View Page</a></button>
  </div>
</template>

<script>
//Helpful resources:
// https://www.w3schools.com/js/js_dates.asp
// https://www.w3schools.com/jsref/jsref_splice.asp

import axios from "axios";

export default {
  name: "ModifyView",
  
  data()
  {
    return {
      URL: "http://localhost:5000/api/",
      
      newDeity: {
        id: "",
        name: "",
        cover: "",
        gallery: [],
        headers: [""],
        descriptions: [""],
        rating: "0",
        dateModified: ""
      },
      
      currentParagraph: 0,
      numberOfParagraphs: 1,
      userMessage: "",
      linkToPage: ""
    }
  },
  
  methods: {
    get_date: function()
    /** Returns a formatted date. */
    {
      let isoDate = new Date().toISOString();
      isoDate = isoDate.split("-");
      return isoDate[0] + "/" + isoDate[1] + "/" + isoDate[2].split("T")[0];
    },
    
    change_paragraph: function(incValue)
    /** Increments or decrements the current paragraph. */
    {
      //Making sure the user can only edit paragraphs they've made
      if ((this.currentParagraph + incValue >= 0) &&
          (this.currentParagraph + incValue < this.numberOfParagraphs))
        this.currentParagraph += incValue;
    },
    
    create_paragraph: function()
    /** Creates a new paragraph for the user to enter some info into. */
    {
      this.numberOfParagraphs += 1;
      this.newDeity.headers.splice(this.currentParagraph + 1, 0, "");
      this.newDeity.descriptions.splice(this.currentParagraph + 1, 0, "");
      this.currentParagraph += 1;
    },
    
    delete_paragraph: function()
    /** Removes a paragraph from our new page where the user is looking. */
    {
      this.newDeity.headers.splice(this.currentParagraph, 1);
      this.newDeity.descriptions.splice(this.currentParagraph, 1);
      
      //Making sure we don't end up going into negative paragraphs
      if (this.numberOfParagraphs > 1)
        this.numberOfParagraphs -= 1;
        
      else
      {
        this.newDeity.headers.push(" ");
        this.newDeity.descriptions.push("");
      }
      
      if (this.currentParagraph+1 > this.numberOfParagraphs)
        this.currentParagraph = this.numberOfParagraphs - 1;
    },
    
    update_page: function()
    /** Sends a PUT request to the server to update a page. */
    { 
      //Adding spaces in blank headers for formatting
      for (let header in this.newDeity.headers)
      {
        if (this.newDeity[header] == "")
          this.newDeity[header] = " ";
      }
      
      //Now, send the PUT request with our updated deity
      let {_id, id, ...rest} = this.newDeity;
      this.userMessage = "Updating Deity #" + id + " (" + _id + ")...";
      
      axios.put(this.URL + "deity/" + this.newDeity.id, rest, {})
      .then(function()
      {
        this.userMessage = "Updated page successfully!";
        setTimeout(this.clear_userMessage, 3000);
        
        //Shows the button to view the created page
        this.linkToPage = "http://localhost:8080/pages/" + this.newDeity.id;
      }.bind(this),
      function(error)
      {
        this.userMessage = "Unable to update page.";
        console.log(error);
      }.bind(this));
    },
    
    clear_userMessage: function()
    /** Makes sure any messages given to the user clear themselves. */
    {
      this.userMessage = "";
    },
  },
  
  //Once mounted, get deity information
  mounted()
  {
    axios.get(this.URL + "deity/" + this.$route.params.id, {})
    .then(function(response)
    {
      this.newDeity = response.data[0];
      this.newDeity.dateModified = this.get_date();
      this.numberOfParagraphs = this.newDeity.headers.length;
    }.bind(this),
    function(error)
    {
      this.userMessage = "Unable to retrieve page data. The webservice is likely offline.";
      console.log(error);
    }.bind(this));
  }
}

</script>

<style scoped>
  label
  {
    margin-left: 10px;
  }
  
  button
  {
    margin-left: 5px;
    margin-right: 5px;
    width: 40px;
  }
  
  a
  {
    text-decoration: none;
    color: #000000;
  }
  
  #updateButton
  {
    width: auto;
  }
  
  #viewButton
  {
    width: auto;
  }
</style>