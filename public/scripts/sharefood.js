// Firebase: Get Listings
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBiklfN2NrneTSJd_KlxsDh439nMjYb6GY",
    authDomain: "wad2-foodshare.firebaseapp.com",
    projectId: "wad2-foodshare",
    storageBucket: "wad2-foodshare.appspot.com",
    messagingSenderId: "837663248289",
    appId: "1:837663248289:web:856889a8e60f87803145e0"
};

// Draw all documents from Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const querySS = await getDocs(collection(db, "listing"));

class Card {
    constructor(username,telehandle,itemname,itemdesc,expirydate,postdate,imgurl) {
        this.username = username;
        this.telehandle = telehandle;
        this.itemname = itemname;
        this.itemdesc = itemdesc;
        this.expirydate = expirydate;
        this.postdate = postdate;
        this.imgurl = imgurl;
    }
}

// Load all listings
// Search and filter
// Onclick (Card) -> Emit (Parent) -> Recipe Card


const sharefoodApp = Vue.createApp({
    data() {
        return {
            userInput: '',
            allListings:[],
            cards:[],
            recipelist: null
        }
    },
    methods: {
        onSearch() {
            this.cards = [];
            for (let index in this.allListings) {
                if (this.allListings[index].itemname.replace(' ','').toLowerCase().includes(this.userInput.toLowerCase())) {
                    this.cards.push(this.allListings[index]);
                }
            }
        }
    },
    created() {
        querySS.forEach((doc) => {
            const username = doc.id;
            const AllUserListings = doc.data();
            for (let item in AllUserListings) {
                let telehandle = AllUserListings[item]['telehandle'];
                let itemName = item;
                let desc = AllUserListings[item]['itemdesc'];
                let expiry = AllUserListings[item]['expirydate'];
                expiry = expiry.split("-").reverse().join("/"); 
                let dateofpost = AllUserListings[item]['postdate'].toDate().toDateString()
                dateofpost = dateofpost.split(" ")[2] + " " + dateofpost.split(" ")[1] + " " + dateofpost.split(" ")[3];
                let foodImage = AllUserListings[item]['imglink'];
                let card = new Card(username,telehandle,itemName,desc,expiry,dateofpost,foodImage)
                this.allListings.push(card);
                this.cards.push(card);
            }
        })
    }
});

sharefoodApp.component('typing-title',{
    template:
    // /*html*/
    `<div class="typing-container">
        <span>
            <span id="sentence" class="typed-text">{{charCurrent}}</span>
            <span class="input-cursor"></span>
        </span>
    </div>`,
    data() {
        return {
            char: '',
            sentence: "Marketplace",
            typeSpeed: 100,
            charIndex: 0
        }
    },
    methods: {
        typeText() {
            if (this.charIndex < this.sentence.length) {
                if (!this.typeStatus) {
                    this.typeStatus = true;
                }
                this.char += this.sentence.charAt(this.charIndex);
                this.charIndex++;
                setTimeout(this.typeText, this.typeSpeed);
            } else {
                this.typeStatus = false;
            }
        }
    },
    created() {
        setTimeout(this.typeText, this.typeSpeed);
    },
    computed: {
        charCurrent() {
            return this.char;
        }
    }
});

sharefoodApp.component('listings', {
    props: {
        list: {
            type: Object,
            required: true
        }
    },
    template:
    /*html*/
    `
    <div class="col d-flex">
        <div class="card shadow-sm flex-fill pink-outline foodCard">
        <img :src="imgSrc" max-width="100%" height="225" style='object-fit: cover;'>
            <div class="card-body text-white" style="background-color: #202731;" :id="id">
                <h5 class="card-title">{{list.itemname}}</h5>
                <span><small class="text-muted">by {{list.username}}</small></span>
                <p class="card-text desc pt-3">{{list.itemdesc}}</p>
                <p class="card-text">Expiry Date: {{list.expirydate}}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <a :href="'https://telegram.me/' + teleHandle">        
                            <img src="assets/telegram.png" style="max-height: 30px;" class='float-right me-4'>
                        </a>
                        <a v-on:click="show()" style="cursor:pointer;">
                            <img src="assets/cook.png" style="max-height: 30px;" class='float-right me-4'>
                        </a>
                    </div><br>
                    <small class="text-muted">Posted On: {{list.postdate}}</small>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            obj:this.list,
            id:this.list.itemname.replace(/\s/g, ""),
            imgSrc: this.list.imgurl,
            teleHandle: this.list.telehandle.replace('@','')
        }
    },
    methods: {
        show() {
            setFoodRecipe(this.list);
        }
    }
})

function setFoodRecipe(obj) {
    featureCard(obj);
    let title = obj.itemname;
    fetch(`https://edamam-recipe-search.p.rapidapi.com/search?q=${title}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
            "x-rapidapi-key": "de8964660emsh08aefa323e04f22p1e8addjsn2594ccf33838"
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        var recipeArr = data.hits;
        if (!recipeArr.length){
            let p = document.createElement("p");
            p.setAttribute('class', 'text-danger font-italic');
            let text = document.createTextNode("Sorry, we couldn't find any relevant recipes for you :(");
            p.appendChild(text);
            document.getElementById('recipeArea').appendChild(p);
        }
        for (let recipeObj of recipeArr.slice(0,3)){
            AddRecipeCard(recipeObj);
        }
    })
    .catch(err => {
        let p = document.createElement("p");
        p.setAttribute('class', 'text-danger font-italic');
        let text = document.createTextNode("Sorry, we couldn't find any relevant recipes for you :(");
        p.appendChild(text);
        document.getElementById('recipeArea').appendChild(p);
        console.error(err);
    });
};

function featureCard(obj){
    let title = obj.itemname;
    let desc = obj.itemdesc;
    let user = obj.username;
    let id = obj.itemname.replace(/\s/g, "");

    document.getElementById('featuredCard').innerHTML = 
    /*html*/
    `
    <div class="card my-3 justify-content-center flex-fill">
        <div class="card-body pink-outline">
            <h3 class="card-title text-white text-center">${title}</h3>
            <p class="card-text text-white text-center pt-2">${desc}</p>
            <p class="card-text text-center text-muted">by ${user}</p>
            <p class="text-center">
                <a href="#${id}" class="card-link">
                    <button class='btn btn-outline-light fs-6 fw-bold'>Return Back</button>
                </a>
            </p>
            <hr>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 flex-fill" id="recipeArea"></div>
        </div>
    </div>
    `;
}

function AddRecipeCard(obj){
    let cal = parseInt(obj.recipe.calories);
    let imgSrc = obj.recipe.image;
    let name = obj.recipe.label;
    let time = obj.recipe.totalTime;
    let url = obj.recipe.url;
    console.log(url);

    document.getElementById('recipeArea').innerHTML +=
    /*html*/
    `
    <div class="col d-flex">
        <div class="card pink-outline flex-fill">
            <img class="card-img-top" src="${imgSrc}">
            <div class="card-body text-white d-flex flex-column text-center" style="background-color: #202731;">
                <h5 class="card-title flex-fill text-white">${name}</h5>
                <p class="card-text">${time} mins to prepare</p>
                <p class="card-text text-muted">${cal} Calories</p>
                <a href="${url}" class="card-link mt-auto">
                    <button class='btn btn-outline-info fs-5'>Get the Recipe!</button>
                </a>
            </div>
        </div>
    </div>
    `;
}

sharefoodApp.mount('#sharefood-app');





