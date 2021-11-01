import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

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

const registerApp = Vue.createApp({});

registerApp.component('typing-title',{
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
            sentence: "Register",
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

registerApp.component('signup-form',{
    template:
    // /*html*/
    `<form id="signup-form" @submit.prevent="onSubmit">
        <div class="form-floating mb-4">
            <input class="form-control" id="inputEmail" v-model="inputEmail" type="email" placeholder="name@example.com" required/>
            <label for="inputEmail">Email address</label>
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="form-floating mb-3 mb-md-0">
                    <input class="form-control" id="inputPassword" v-model="inputPassword" type="password" placeholder="Create a password" />
                    <label for="inputPassword">Password</label>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-floating mb-3 mb-md-0">
                    <input class="form-control" id="inputPasswordConfirm" v-model="inputPasswordConfirm" type="password" placeholder="Confirm password" />
                    <label for="inputPasswordConfirm">Confirm Password</label>
                </div>
            </div>
        </div>
        <div class="mt-4 mb-0">
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Create Account</button> 
            </div>
        </div>
    </form>`,
    data() {
        return {
            inputEmail:'',
            inputPassword:'',
            inputPasswordConfirm:''
        }
    },
    methods: {
        onSubmit() {
            if (this.inputPassword !== this.inputPasswordConfirm) {
                alert("Your password must be the same as your confirm password!");
            } else {
                createUserWithEmailAndPassword(auth, this.inputEmail, this.inputPassword).then((userCredential) => {
                    // Signed in 
                    alert("Account Creation Successful!");
                    location.href="./setup.html";
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
            }
        }
    }

})

registerApp.mount('#register-app');