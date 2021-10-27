import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        setupUI(user);
    
    } else {
        // User is signed out
        setupUI();
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



// Setup App
const setupApp = Vue.createApp({});

setupApp.component('typing-title',{
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
            sentence: "Setup My Profile",
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

setupApp.component('setup-form',{
    template:
    // /*html*/
    `
    <form id="setup-form" @submit.prevent="onSubmit">
        <div class="row">
            <div class="col-md-6">
                <div class="form-floating mb-4">
                    <input class="form-control" id="inputUsername" type="text" v-model="inputUsername" placeholder="Enter your username" required/>
                    <label for="inputUsername">Username</label>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-floating mb-4">
                    <input class="form-control" id="inputTeleHandle" v-model="inputTeleHandle" type="text" placeholder="Enter your Telegram Handle" required/>
                    <label for="inputTeleHandle">Telegram Handle</label>
                </div>
            </div>
        </div>

        <div class="form-floating mb-4">
            <input class="form-control" id="inputBirthday" v-model="inputBirthday" type="date" placeholder="Enter your birthday" required/>
            <label for="inputBirthday">Birthday</label>
        </div>

        <div class="form-floating mb-4">
            <textarea class="form-control" id="inputBio" v-model="inputBio" placeholder="Describe your interests and hobbies" required></textarea>
            <label for="inputBio">Profile Biography</label>
        </div>

        <div class="mt-4 mb-0">
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Setup My Profile</button> 
            </div>
        </div>
    </form>
    `,
    data() {
        return {
            inputUsername:'',
            inputTeleHandle:'',
            inputBirthday:'',
            inputBio:''
        }
    },
    methods: {
        onSubmit() {
            onAuthStateChanged(auth, async(user) => {
                if (user) {
                    // User is signed in
                    const user_id = user.uid;
                    const inputUsername = this.inputUsername;
                    const inputTelehandle = this.inputTeleHandle;
                    const inputBirthday = this.inputBirthday;
                    const inputBio = this.inputBio;
                    // Get all username in database
                    const usernameQuery = await getDocs(collection(db, "listing"));
                    const allUsernames = [];
                    
                    usernameQuery.forEach((doc) => {
                        allUsernames.push(doc.id);
                    });

                    if (allUsernames.includes(inputUsername)) {
                        alert("This username is already taken. Please choose another name.")
                    } else {
                        const userBioRef = doc(db,"userBio",user_id);
                        const userBioSnap = await getDoc(userBioRef);

                        if (userBioSnap.exists()) {
                            // if have, alert user that the existing username in database cannot be changed
                            alert("Profile has already been registered in database!");
                            location.href = "./profile.html"; 
                        } else {
                            await setDoc(doc(db, "userBio", user_id), {
                                username: inputUsername,
                                telehandle: inputTelehandle,
                                birthday: inputBirthday,
                                bio: inputBio
                            })
                            .then (()=>{
                                alert("You have successfully set up your profile!");
                                location.href = "./profile.html";
                            })
                            .catch ((error) => {
                                alert("Error: " + error);
                            });
                        }
                    }
                }
            });
        }
    }
})

setupApp.mount('#setup-app');