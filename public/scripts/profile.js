import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, deleteField } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

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


// Profile Vue App
const profileApp = Vue.createApp({
    data() {
        return {
            showHeader: false,
            warning: false,
            username:null,
            telehandle: null,
            birthday: null,
            bio: null,
            listings: null
        }
    },
    created() {
        onAuthStateChanged(auth, async(user) => {
            if (user) {
                setupUI(user);
                // User is signed in
                const user_id = user.uid;
                const userBioRef = doc(db,"userBio",user_id);
                const userBioSnap = await getDoc(userBioRef);
                if (userBioSnap.exists()) {
                    // Retrieve Username
                    this.username = userBioSnap.data()['username'];
                    this.telehandle = userBioSnap.data()['telehandle'];
                    var birthday = userBioSnap.data()['birthday'];
                    this.bio = userBioSnap.data()['bio'];
                    birthday = birthday.split("-")[2] + "/" + birthday.split("-")[1] + "/" + birthday.split("-")[0];
                    this.birthday = birthday;
                    // Draw user-specific listings
                    const listingRef = doc(db,"listing",this.username);
                    const listingSnap = await getDoc(listingRef);

                    if (listingSnap.exists()) {
                        this.listings = listingSnap.data();
                    };

                } else {
                    alert("Can't find User Account Data! Please setup your profile!")
                    location.href="./setup.html"
                }

            } else {
                setupUI();
                location.href="./login.html";
            }
        });

        this.showHeader = true;
    }
});

profileApp.component('typing-title',{
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
            sentence: "My Profile",
            typeSpeed: 75,
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

profileApp.component('user-listing',{
    props: {
        username: {
            type: String,
            required: true
        },
        item: {
            type: Object,
            required: true
        }
    },
    template:
    /*html*/
    `
    <li>
        <div class="timeline-time text-white fw-bold">{{postdate}}</div>
        <div class="timeline-body text-dark card">
            <div class="timeline-header">
                <span class="itemname fw-bold card-title lh-base">{{itemname}}</span>
            </div>
            <div class="timeline-content">
                <p class="card-text lh-base">{{itemdesc}}</p> 
            </div>
            <div class="remove-listing pt-3">
                <button type="button" class="btn-sm btn-outline-danger" v-on:click="removeListing">Remove</button>
                <span class="date-posted text-muted float-end lh-sm pt-4">Expiry Date: {{expirydate}}</span>
            </div>
        </div>
    </li>
    `,
    methods: {
        async removeListing() {
            if (confirm("Are you sure? You will not be able to recover this listing!")) {
                const listingRef = doc(db,'listing',this.username);
                const itemname = this.item['itemname'];
                await updateDoc(listingRef, {
                    [itemname]: deleteField()
                });
                location.reload();
            }
        }
    },
    computed: {
        postdate() {
            let dateofpost = this.item['postdate'].toDate().toDateString();
            dateofpost = dateofpost.split(" ")[2] + " " + dateofpost.split(" ")[1] + " " + dateofpost.split(" ")[3];
            return dateofpost;
        },
        itemname() {
            return this.item['itemname'];
        },
        expirydate() {
            let expiry = this.item['expirydate'];
            expiry = expiry.split("-").reverse().join("/");
            return expiry;
        },
        itemdesc() {
            return this.item['itemdesc'];
        }
    }
})


profileApp.mount('#profile-app');