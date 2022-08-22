// the data that stored in the jsonbin
let fetched_data = {
    'python': {},
    'excel': {},
    'web': {},
    'js': {},
    'data': {},
    'aws': {},
    'draw': {}
};

// the current active tab
let curr_tab = 'python';

// number of cards in each column
let n_cards = 4;

// tabs in page
const tabs = [
    'python',
    'excel',
    'web',
    'js',
    'data',
    'aws',
    'draw',
];

function fetch_data() {
    // we need to featch all data once in first time of page loading not every time when we change tab
    fetch(`https://api.jsonbin.io/v3/b/62f9008d5c146d63ca6df68c`)
        .then(response => response.json())
        .then(data => {
            for (let tab of tabs)
                fetched_data[tab] = data.record[tab];
            load_courses(curr_tab);
        });
}

function rating(rate) {
    // create dynamic stars rating
    const full_star = `<i class="fa fa-star stars"></i>\n`;
    const empty_star = `<i class="fa-regular fa-star stars"></i>\n`;
    const half_star = `<i class="fa fa-star-half-full stars"></i>\n`;
    let rating_stars = ``
    let stars_left = 5;
    rating_stars += `<span class="rating">${rate.toPrecision(2)}  </span>`
    rating_stars += `<span class="stars">`
    for (let i = 0; i < Math.floor(rate); i++, stars_left--)
        rating_stars += full_star;
    if (Math.floor(rate) === parseInt(rate, 10))
        rating_stars += half_star, stars_left--;
    while (stars_left--)
        rating_stars += empty_star;
    rating_stars += `</span>`;
    return rating_stars;
}

// create card for each course
function create_card(course) {
    if (!course) return '';
    let card = document.createElement('div');
    card.innerHTML = `
        <div class="col-lg-3 col-md-4 col-sm-12">
            <div class="_card">
                <div class="_card-img">
                    <img src="${course.image}" alt="${course.title}" />
                </div>
                <h4>${course.title}</h4>
                <div class="_card_information">
                    <p class="author">${course.instructors[0].name}</p>
                    <div class="rating">
                        ${rating(course.rating)}
                    </div>
                    <p class="price">E£${course.price}</p>
                </div>
            </div>
        </div>
    `;
    return card.innerHTML;
}

// create n-cards in each row
function create_row_cards(courses, index) {
    let row_cards = ``;
    for (let card = 0; card < n_cards; card++)
        row_cards += `${create_card(courses[index++])}\n`;
    return row_cards;
}

// To make active class on the first course
function is_active(row_number) {
    return (row_number === 0 ? "active" : "");
}

// Create courses carousel
function create_courses(courses, search_text) {
    if (!courses) return '';
    let filtered_courses = courses.filter(course => course.title.toLowerCase().includes(search_text.toLowerCase()));
    let rows = Math.ceil(filtered_courses.length / n_cards);
    let courses_html = ``;
    let index = 0;
    for (let row = 0; row < rows; row++, index += n_cards) {
        courses_html += `
            <div class="carousel-item ${is_active(row)}">
                <div class="row">
                    ${create_row_cards(filtered_courses, index)}
                </div>
            </div>
        `;
    }
    return courses_html;
}

// Create Buttons if there are more than 4 courses
function create_buttons(courses, search_text) {
    if (!courses) return '';
    let filtered_courses = courses.filter(course => course.title.toLowerCase().includes(search_text.toLowerCase()));
    if (filtered_courses.length <= n_cards) return '';
    let buttons = `
        <div class="row">
            <div class="col-12">
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselHeader" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselHeader" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    `;
    return buttons;
}

// Draw courses in the page
function load_courses(tab, search_text = '') {
    const course_data = fetched_data[tab];
    let courses_to_add = document.createElement('div');
    courses_to_add.innerHTML = `
        <h3 class="courses-desc">${course_data.header}</h3>
        <p class="courses-desc">${course_data.description}</p>
        <button class="explore">Explore ${document.getElementById(`${tab}_label`).innerText}</button>
        <div class="courses-cards" id = "courses_records">
            <div class="container">
                <div class="row mx-auto my-auto">
                    <div class="container_ carousel slide" id="carouselHeader" data-ride="carousel" data-interval="false">
                        <div class="carousel-inner" role="listbox">
                            ${create_courses(course_data.courses, search_text)}
                        </div>
                    </div>
                </div>
                ${create_buttons(course_data.courses, search_text)}
            </div>
        </div>
    `;
    // put courses cards in courses selector
    let courses = document.getElementById('courses-selector');
    courses.replaceChild(courses_to_add, courses.childNodes[0]);
}

// changing number of cards in each row when screen size is changed
const changeNCourses = (n) => {
    n_cards = n;
    const search_word = document.getElementById("search_bar_input").value;
    load_courses(curr_tab, search_word);
};

// for know how many cards we need to show in each row
const mediaQuery = () => {
    let screens = [
        window.matchMedia("(min-width: 100px) and (max-width: 599px)"),
        window.matchMedia("(min-width: 600px) and (max-width: 699px)"),
        window.matchMedia("(min-width: 700px) and (max-width: 1000px)"),
        window.matchMedia("(min-width: 1200px)")
    ];
    screens.forEach((screen, index) => {
        screen.addListener((x) => { 
            if (x.matches) changeNCourses(index + 1) });
            if (screen.matches) 
                changeNCourses(index + 1);
    });
};

// main functions

// to fetch data from the server
fetch_data();

// for swapping tabs
for (const tab of tabs){
    const tab_button = document.getElementById(tab);
    tab_button.addEventListener("click", () => {
        curr_tab = tab;
        load_courses(curr_tab);
    });
}

// Search bar functionality
const search_button = document.getElementById("search_button");
search_button.addEventListener("click", (e) => {
    e.preventDefault();
    const search_word = document.getElementById("search_bar_input").value;
    load_courses(curr_tab, search_word);
    document.getElementById("section_view").scrollIntoView({behavior: "smooth", block: "start"});
});

const search_bar = document.getElementById("search_bar_input");
search_bar.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        document.getElementById("search_button").click();
    }
});

function handleValueChange(e) {
    load_courses(curr_tab, e.value);
}

// media query for changing number of courses
mediaQuery();