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

function stars() {
    let rating_stars = '';
    for (let i = 0; i < 4; i++)
        rating_stars += `<span class="fa fa-star stars"></span>\n`;
    rating_stars += '<span class="fa fa-star-half-full stars"></span>\n';
    return rating_stars;
}

function clear_courses() {
    let courses = document.getElementById('courses-selector');
    courses.innerHTML = '';
}

function load_courses(tab) {
    fetch(`./data/${tab}_res.json`)
        .then(response => response.json())
        .then(data => {
                const courses = document.getElementById('courses-selector');
                // header of description
                let head = document.createElement('h3');
                head.innerHTML = data.header;
                head.className = 'courses-desc';
                courses.appendChild(head);
                // paragraph of description
                let paragraph = document.createElement('p');
                paragraph.innerHTML = data.description;
                paragraph.className = 'courses-desc';
                courses.appendChild(paragraph);
                // expolore button
                let explore_button = document.createElement('button');
                explore_button.innerHTML = `Explore ${document.getElementById(`${tab}_label`).innerText}`;
                explore_button.className = 'explore';
                courses.appendChild(explore_button);
                // courses cards
                let courses_cards = document.createElement('div');
                courses_cards.className = 'courses-cards';
                for (let course of data.courses) {
                    let card = document.createElement('div');
                    card.innerHTML = `
                        <div class="card-img">
                            <img src="${course.image}" alt="${course.title}" />
                            <h4>${course.title}</h4>
                            <p class="author">${course.instructors[0].name}</p>
                            <div>
                            <span class="stars">${course.rating}</span>
                            ${stars()}
                            </div>
                            <span class="price">E£${course.price}</span>
                        </div>
                    `;
                    card.className = "card";
                    // put card in courses cards
                    courses_cards.appendChild(card);
                }
                // put courses cards in courses selector
                courses.appendChild(courses_cards);
        });
}

let curr_tab = 'python';
clear_courses();
load_courses(curr_tab);

for (const tab of tabs){
    const tab_button = document.getElementById(tab);
    tab_button.addEventListener("click", () => {
        curr_tab = tab;
        clear_courses();
        load_courses(curr_tab);
    });
}