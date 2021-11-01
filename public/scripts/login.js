import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiklfN2NrneTSJd_KlxsDh439nMjYb6GY",
    authDomain: "wad2-foodshare.firebaseapp.com",
    projectId: "wad2-foodshare",
    storageBucket: "wad2-foodshare.appspot.com",
    messagingSenderId: "837663248289",
    appId: "1:837663248289:web:856889a8e60f87803145e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const loginApp = Vue.createApp({});

loginApp.component('typing-title',{
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
            sentence: "Login",
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
})

loginApp.component('login-form',{
    template:
    // /*html*/
    `<form id="login-form" @submit.prevent="onSubmit">
        <div class="form-floating mb-4">
            <input class="form-control" id="inputEmail" v-model="inputEmail" type="email" placeholder="name@example.com" />
            <label for="inputEmail">Email address</label>
        </div>
        <div class="form-floating mb-4">
            <input class="form-control" id="inputPassword" v-model="inputPassword" type="password" placeholder="Password" />
            <label for="inputPassword">Password</label>
        </div>
        <div class="d-grid">
            <button type="submit" class="btn btn-primary">Login</button>
        </div>
    </form>`,
    data() {
        return {
            inputEmail:'',
            inputPassword:''
        }
    },
    methods: {
        onSubmit() {
            signInWithEmailAndPassword(auth, this.inputEmail, this.inputPassword).then((userCredential) => {
                const user = userCredential.user;
                alert("Login Successful!");
                location.href="./profile.html";
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
        }
    }
});

loginApp.mount('#login-app');