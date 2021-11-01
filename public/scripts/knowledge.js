Vue.createApp({
    data() {
        return {
            char: '',
            typeStatus: false,
            sentence: "Knowledge",
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
            }
            else {
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
}).mount("#app2");

Vue.createApp({
    data() {
        return {
            ans: "",
            category: 'fooddrink',
            question: "",
            launched: false,
            userInput: "",
            submitted: false,
            giveUp: false,
            questions: null,
            qnIndex: null
        }
    },
    created() {
        fetch("https://api.api-ninjas.com/v1/trivia?limit=30&category=" + this.category, {
            headers: { 'X-Api-Key': 'qpk980j1aXFfxsktlznfXw==CIjV1mWr18NxOj8a'},
            contentType: 'application/json',
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            this.questions = data;
            this.qnIndex = Math.floor(Math.random() * this.questions.length)
            this.question = this.questions[this.qnIndex].question;
            this.ans = this.questions[this.qnIndex].answer;
            if (!this.question.slice(this.question.length - 1) === '?') {
                this.question += "?";
            }
        })
    },
    methods: {
        checkAns() {
            if (this.userInput == this.ans) {
                return true;
            }
            else {
                return false;
            }
        },
        showAns() {
            return this.ans;
        },
        reset() {
            this.submitted = false;
            this.giveUp = false;
            this.userInput = "";
            this.qnIndex = Math.floor(Math.random() * this.questions.length)
            this.question = this.questions[this.qnIndex].question;
            this.ans = this.questions[this.qnIndex].answer;
            if (!this.question.slice(this.question.length - 1) === '?') {
                this.question += "?";
            }
        },
        incorrectShowAns() {
            this.submitted = false;
            this.giveUp = true;
        }
    },
    computed: {
        
    }
}).mount("#app3")

var news = Vue.createApp({
    data() {
        return {
            carouData: [],
            newsData: []
        }
    },
    created() {
        fetch("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=hunger+famine&pageNumber=1&pageSize=12&autoCorrect=true&safeSearch=true&withThumbnails=true&fromPublishedDate=null&toPublishedDate=null", {
            "method": "GET",
            "headers": {
              "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
              "x-rapidapi-key": "bcb9a2e96fmsh4632c43b994648dp14e672jsn56fac8b7bb38"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            for (anews of data.value) {
                let desc = anews.description.slice(0,100);
                anews.desc = desc;
                let dateP = anews.datePublished.slice(0,10);
                anews.dateP = dateP;
            }
            this.newsData = data.value.slice(3);
            this.carouData = data.value.slice(0, 3);
        })
        .catch(err => {
        });
    }
})

news.component('my-cards', {
    props: 
        ["imageurl", "atitle", "adatepublished", "adescription", "alink"],
    template: 
    `<div class="col d-flex my-4">
        <div class="card pink-outline flex-fill" onerror="this.src='assets/no_img.jpg'">
            <img :src="imageurl" class="card-img-top imgCard">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title flex-fill">{{atitle}}</h5>
                <p class="card-text text-muted">{{adatepublished}}</p>
                <p class="card-text">{{adescription}}...</p>
                <a :href="alink" class="card-link mt-auto">Continue Reading</a>
            </div>
        </div>
    </div>`
})

news.component('carou-item', {
    props: 
        ["imageurl", "atitle", "adescription", "alink", "i"],
    template: 
        `<div :class="i === 0 ? 'carousel-item active' : 'carousel-item' ">
        <img class="carouimg d-block w-100" style="height: 600px; opacity:0.3;" :src="imageurl" onerror="this.src='assets/no_img.jpg'">
        <div class="container">
          <div class="carousel-caption text-start">
            <h1>{{atitle}}</h1>
            <p>{{adescription}}</p>
            <p><a class="linkCarou btn btn-lg text-dark" :href="alink">Read More</a></p>
          </div>
        </div>
      </div>`
})

news.mount("#cool");