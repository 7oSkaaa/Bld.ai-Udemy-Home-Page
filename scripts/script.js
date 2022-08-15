// the data that stored in the jsonbin
var fetched_data;

// the current active tab
let curr_tab = 'python';

// width for explore button 
const tabs_width = {
    'python': '8rem',
    'excel': '8rem',
    'web': '12rem',
    'js': '10rem',
    'data': '10rem',
    'aws': '10rem',
    'draw': '8rem',
}

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
            fetched_data = data;
            load_courses(curr_tab);
        });
}

function rating(rate) {
    // create stars rating
    let rating_stars = '';
    rating_stars += `<span class="rating">${rate.toPrecision(2)}  </span>`
    rating_stars += `<span class="stars">`
    for (let i = 0; i < 4; i++)
        rating_stars += `<i class="fa fa-star stars"></i>\n`;
    rating_stars += '<i class="fa fa-star-half-full stars"></i>\n';
    rating_stars += `</span>`;
    return rating_stars;
}

function load_courses(tab, search_text = '') {
    const course_data = fetched_data.record[tab];
    let courses_to_add = document.createElement('div');
    courses_to_add.className = 'courses';
    courses_to_add.innerHTML = `
        <h3 class="courses-desc">${course_data.header}</h3>
        <p class="courses-desc">${course_data.description}</p>
        <button class="explore">Explore ${document.getElementById(`${tab}_label`).innerText}</button>
        <div class="courses-cards" id = "courses_records">
        ${course_data.courses.filter(course => course.title.toLowerCase().includes(search_text.toLowerCase())).map(course => (`
            <div class="_card">    
                <div class="_card-img">
                    <img src="${course.image}" alt="${course.title}" />
                </div>
                <h4>${course.title}</h4>
                <p class="author">${course.instructors[0].name}</p>
                <div class="rating">
                    ${rating(course.rating)}
                </div>
                <p class="price">E£${course.price}</p>
            </div>
        `)).join('\n')}
        </div>
    `;
    // put courses cards in courses selector
    let courses = document.getElementById('courses-selector');
    courses.replaceChild(courses_to_add, courses.childNodes[0]);
}

fetch_data();

for (const tab of tabs){
    const tab_button = document.getElementById(tab);
    tab_button.addEventListener("click", () => {
        curr_tab = tab;
        load_courses(curr_tab);
    });
}

const search_button = document.getElementById("search_button");
search_button.addEventListener("click", (e) => {
    e.preventDefault();
    const search_word = document.getElementById("search_bar_input").value;
    load_courses(curr_tab, search_word);
    document.getElementById("courses_records").scrollIntoView({behavior: "smooth", block: "start"});
});

const search_bar = document.getElementById("search_bar_input");
search_bar.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        document.getElementById("search_button").click();
    }
})