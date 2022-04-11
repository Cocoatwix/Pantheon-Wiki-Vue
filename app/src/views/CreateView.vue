<template>
  <div class="createpage">
    <h2>Create a Page</h2>
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
    
    <button id="createButton" v-on:click="create_page()">Create Page</button>
    <button id="viewButton" v-if="newPage != ''"><a :href="newPage">View Page</a></button>
  </div>
</template>

<script>
//Helpful resources:
// https://www.w3schools.com/js/js_dates.asp
// https://www.w3schools.com/jsref/jsref_splice.asp

import axios from "axios";

export default {
  name: "CreateView",
  
  data()
  {
    return {
      URL: "http://localhost:5000/api/",
      defaultCover: "https://live.staticflickr.com/65535/51987665882_3bccf04bf5_w.jpg",
      
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
      newPage: ""
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
    
    create_page: function()
    /** Sends a POST request to the server to create a new page. */
    {
      //Adding spaces in blank headers for formatting
      for (let header in this.newDeity.headers)
      {
        if (this.newDeity[header] == "")
          this.newDeity[header] = " ";
      }
      
      if (this.newDeity["cover"] == "")
        this.newDeity["cover"] = this.defaultCover;
      
      //Get a free ID to use
      axios.get(this.URL + "free/id", {})
      .then(function(response)
      {
        //console.log(response.data.id);
        this.newDeity.id = response.data.id.toString();
        
        //Now, send the POST request with our newly created deity
        axios.post(this.URL + "deity", this.newDeity, {})
        .then(function()
        {
          this.userMessage = "Created new page successfully!";
          setTimeout(this.clear_userMessage, 3000);
          
          //Shows the button to view the created page
          this.newPage = "pages/" + this.newDeity.id;
        
          this.newDeity = {
            id: "",
            name: "",
            cover: "",
            gallery: [],
            headers: [" "],
            descriptions: [""],
            rating: "0",
            dateModified: this.get_date()
          };
          this.currentParagraph = 0;
          this.numberOfParagraphs = 1;
        }.bind(this),
        function(error)
        {
          this.userMessage = "Unable to create new page.";
          console.log(error);
        }.bind(this));
        
      }.bind(this),
      function(error)
      {
        this.userMessage = "Unable to retrieve a free ID for this page.";
        console.log(error);
      }.bind(this));
    },
    
    clear_userMessage: function()
    /** Makes sure any messages given to the user clear themselves. */
    {
      this.userMessage = "";
    },
  },
  
  mounted()
  {
    this.newDeity.dateModified = this.get_date();
    //console.log(this.newDeity.dateModified);
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
  
  #createButton
  {
    width: auto;
  }
  
  #viewButton
  {
    width: auto;
  }
</style>