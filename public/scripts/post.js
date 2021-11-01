import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBiklfN2NrneTSJd_KlxsDh439nMjYb6GY",
    authDomain: "wad2-foodshare.firebaseapp.com",
    projectId: "wad2-foodshare",
    storageBucket: "wad2-foodshare.appspot.com",
    messagingSenderId: "837663248289",
    appId: "1:837663248289:web:856889a8e60f87803145e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Dynamic Navbar
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};

// Authentication
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        setupUI(user);
    
    } else {
        // User is signed out
        setupUI();
        window.alert("Please login to list your trade!");
        document.location.href="./login.html";
    }
});

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth).then(() => {
    // Sign-out successful.
    window.alert("You have successfully signed out!")
  }).catch((error) => {
    // An error happened.
  });
});


// Post App
const postApp = Vue.createApp({});

postApp.component('typing-title',{
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
            sentence: "List My Item",
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
})

postApp.component('listing-form',{
    template:
    /*html*/
    `
    <form id="listing-form" @submit.prevent="onSubmit">
        <div class="px-1 pb-2">
            <span class="text-white">Upload Item Image</span>
        </div>
        <div class="form-group">
            <div class="px-1">
                <input type="file" class="form-control-file text-white" id="upload-image" v-on:change="addImage" required>
            </div>
            <br>
            <div class="img-container">
                <img id="myImg" :style="[showImg ? {'display':'block'} : {'display':'none'}]" :src="imgSrc">
            </div>
        </div>
        <div class="px-1 pb-2">
            <span class="text-white">Item Name</span>
        </div>
        <div class="form-group mb-3">
            <input class="form-control" id="item-name"
            v-model="inputItemName" maxlength="30" required>
        </div>
        <div class="px-1 pb-2">
            <span class="text-white">Expiry Date</span>
        </div>
        <div class="form-group mb-3">
            <input class="form-control" id="expiry-date" v-model="inputExpiryDate" type="date" required>
        </div>
        <div class="px-1 pb-2">
            <span class="text-white">Item Description</span>
        </div>
        <div class="form-group mb-3">
            <textarea class="form-control" id="item-desc" v-model="inputItemDesc" placeholder="Pickup Location / Amount, Servings or Weight of food items / Halal, Non-Halal, Vegetarian, Vegan" maxlength="160" required></textarea>
        </div>
        <div class="mt-4 mb-0">
            <div class="d-grid">
                <button type="submit" class="btn btn-primary" id="upload">List My Item</button> 
            </div>
        </div>
    </form>   
    `,
    data() {
        return {
            inputItemName:null,
            inputExpiryDate: null,
            inputItemDesc: null,
            showImg: false,
            imgSrc:''
        }
    },
    methods: {
        addImage(e) {
            var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxzbjaxue/image/upload';
            var CLOUDINARY_UPLOAD_PRESET = 'gnyfkxt8';
            this.showImg = true;
            var file = e.target.files[0];
            var formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            axios({
                url: CLOUDINARY_URL,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            }).then((res) => {
                this.imgSrc = res.data.secure_url;
            }).catch((error) => {
            })
        },
        onSubmit() {
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    // User is signed in
                    const user_id = user.uid;
                    const userBioRef = doc(db,"userBio",user_id);
                    const userBioSnap = await getDoc(userBioRef);
                    if (userBioSnap.exists()) {
                        // Retrieve Username
                        const username = userBioSnap.data()['username'];
                        const telehandle = userBioSnap.data()['telehandle'];
                        const inputItemName = this.inputItemName;
                        const inputItemDesc = this.inputItemDesc;
                        const inputExpiryDate = this.inputExpiryDate;
                        const imgSrc = this.imgSrc;

                        await setDoc(doc(db,'listing',username),{
                            [inputItemName]: {
                                itemname: inputItemName,
                                itemdesc: inputItemDesc,
                                expirydate: inputExpiryDate,
                                imglink: imgSrc,
                                telehandle: telehandle,
                                postdate: serverTimestamp()
                            }
                        }, {merge:true})
                        .then (()=>{
                            alert("Your listing has been created!");
                            this.showImg = false;
                            location.href="./sharefood.html";
                        })
                        .catch ((error) => {
                            alert("Error: " + error);
                        });

                    } else {
                        alert("Can't find User Account Data! Please setup your profile!")
                        location.href="./setup.html"
                    }
                }
            });
        }
    }
});

postApp.mount('#post-app');