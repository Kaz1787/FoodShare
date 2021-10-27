var lat=0;
var lan=0;

const app = Vue.createApp({
    data() {
        return {
            address: '',
            errormsg: '',
            cardsArr: [],
            needsArr: []
        }
    },
    methods: {
        searchFoodBank(){
            let input = this.address;
            fetch(`https://www.givefood.org.uk/api/2/foodbanks/search/?address=${input}`)
            .then(response =>{
                return response.json();
            })
            .then(data => {
                this.cardsArr= data.slice(0,6);
                this.errormsg = [];
                this.getDetails(data[0].slug);
            })
            .catch(error =>{
                this.errormsg = "Apologies, we can't seem to locate you :(";
            })
        },
        getDetails(slug){
            fetch(`https://www.givefood.org.uk/api/2/foodbank/${slug}/`)
            .then(response => {
                return response.json();
            }).then(data =>{
                lat = parseFloat(data.lat_lng.split(',')[0]);
                lon = parseFloat(data.lat_lng.split(',')[1]);
                showMap(lat, lon);
                featureCard(data);
            })
        }

    },
    created(){
        fetch('https://www.givefood.org.uk/api/2/needs/')
        .then(response =>{
            return response.json();
        })
        .then(data =>{
            this.needsArr = data.slice(0,3);
            for (obj of data.slice(0,3)){
                let date = obj.found.split('T')[0].split('-')
                obj.newdate = `${date[2]}/${date[1]}/${date[0]}`;
            }
            this.getDetails(data[0].foodbank.slug);
        })
    }

})

app.component('food-bank-card', {
    props: ['name', 'distance', 'address', 'slug'],
    template: `
    <div class="col-lg-4 col-md-6 my-2 d-flex">
        <div class="card pink-outline flex-fill" @click='clickBank(slug)' @mouseover='hoverCard' @mouseout='outCard' :style='{border:border}'>
            <div class="card-body">
                <h3 class="card-title">{{ name }}</h3>
                <h6 class="card-subtitle mb-2 text-muted fst-italic">{{ distance }}m away</h6>
                <p class="card-text">{{ address }}</p>
                <a href="#map" class="text-muted">View on Map</a>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            border: "1px solid #F7CACA"
        }
    },
    methods: {
        clickBank(slug){
            fetch(`https://www.givefood.org.uk/api/2/foodbank/${slug}/`)
            .then(response => {
                return response.json();
            }).then(data =>{
                lat = parseFloat(data.lat_lng.split(',')[0]);
                lon = parseFloat(data.lat_lng.split(',')[1]);
                showMap(lat, lon);
                featureCard(data);
            })
        },
        hoverCard(){
            this.border="2px solid #6979fa";
        },
        outCard(){
            this.border= "1px solid #F7CACA";
        }
    }
})

app.component('food-needs-card', {
    props: ['name', 'needs', 'newdate', 'slug'],
    template: `
        <div class="col-lg-4 col-md-6 mb-2 d-flex">
            <div class="card pink-outline flex-fill" @click='clickNeeds(slug)' @mouseover='hoverCard' @mouseout='outCard' :style='{border:border}'>
                <div class="card-body">
                    <h3 class="card-title">{{ name }}</h3>
                    <h6 class="card-subtitle mb-2 text-muted fst-italic">{{ newdate }}</h6>
                    <p class="card-text">{{ needs }}</p>
                    <a href="#map" class="text-muted">View on Map</a>
                </div>
            </div>
        </div>
    `,
    data(){
        return {
            border: "1px solid #F7CACA"
        }
    },
    methods: {
        clickNeeds(slug){
            fetch(`https://www.givefood.org.uk/api/2/foodbank/${slug}/`)
            .then(response => {
                return response.json();
            }).then(data =>{
                lat = parseFloat(data.lat_lng.split(',')[0]);
                lon = parseFloat(data.lat_lng.split(',')[1]);
                showMap(lat, lon);
                featureCard(data);
            })
        },
        hoverCard(){
            this.border="2px solid #6979fa";
        },
        outCard(){
            this.border= "1px solid #F7CACA";
        }
    }
})

const vm = app.mount('#app');

Vue.createApp({
    data() {
        return {
            char: '',
            typeStatus: false,
            sentence: "Find The Right Food Bank For You",
            typeSpeed: 100,
            charIndex: 0
        }
    },
    methods: {
        typeText() {
            if (this.charIndex < this.sentence.length){
                if (!this.typeStatus){
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
    created(){
        setTimeout(this.typeText, this.typeSpeed);
    },
    computed: {
        charCurrent() {
            return this.char;
        }
    }
}).mount('#app2')

function initMap() {
    var loc = {lat:lat, lng: lan};

    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: loc}
    );
}

function showMap(latitude, longitude){
    loc = {lat:latitude, lng: longitude};
    map = new google.maps.Map(
    document.getElementById('map'), {zoom: 18, center: loc});
    marker = new google.maps.Marker({position: loc, map: map});
}

function featureCard(data){
    document.getElementById('details').innerHTML = data.name;
    document.getElementById('detailsbody').innerHTML = `
        <h4>${data.address}</h4>
        <hr>
        <p><strong>Needs:</strong> ${data.need.needs}</p>
        <br>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <a href="#top" class="text-muted">Back to Top</a>
    `
}

function changeBtnName(obj){
    if (obj.innerHTML == "Show Details"){
        obj.innerHTML = "Hide Details";
    } else {
        obj.innerHTML = "Show Details";
    }
}
