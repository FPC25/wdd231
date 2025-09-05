// creating courses list
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

// creating DOM elements 
const allButton = document.querySelector('#all-btn');
const wddButton = document.querySelector('#wdd-btn');
const cseButton = document.querySelector('#cse-btn');
const filterButton = document.querySelectorAll('.filter-btn');
const container = document.querySelector('#showcase');
const summary = document.querySelector('#courses-summary');

function credits(courses_array) {
    const completedCredits = courses_array.reduce((total, item) => item.completed ? total + item.credits : total, 0);
    const totalCredits = courses_array.reduce((total, item) => total + item.credits, 0);

    return { completed: completedCredits, total: totalCredits }
}

function filtering(string_filter) {
    const filtered = courses.filter(item => item.subject === string_filter);
    ({ completed: completedCredits, total: totalCredits } = credits(filtered));

    return { filteredCourses: filtered, completed: completedCredits, total: totalCredits };
}

function filterCourses(event){
    let filteredCourses = [];
    let completed = 0;
    let total = 0;
    const btn = event.currentTarget;

    filterButton.forEach(b => b.classList.remove('selected'));

    btn.classList.toggle('selected');

    if (btn.id === 'wdd-btn') {
        ({ filteredCourses, completed, total } = filtering('WDD'));
    } 
    else if (btn.id === 'cse-btn') {
        ({ filteredCourses, completed, total } = filtering('CSE'));
    } else if (btn.id === 'all-btn') {
        ({ completed, total } = credits(courses));
        filteredCourses = courses;
    }

    container.innerHTML = '';

    filteredCourses.forEach(course => {
        const symbol = course.completed ? '\u2713' : '';
        container.innerHTML += `
            <div class="course-card ${course.completed ? 'done' : 'not-done'}">
                ${symbol} ${course.subject} ${course.number}
            </div>
        `;
    });

    summary.innerHTML = `
        <p class="credits">Total credits for the <strong>${filteredCourses.length}</strong> courses above: <strong>${total}</strong></p>
        <p class="credits">Credits completed: <strong>${completed}</strong> out of <strong>${total}</strong></p>
    `;
}

// adding select up when clicked behavior to filter button 
filterButton.forEach(btn => {
    btn.addEventListener('click', filterCourses)
  
});

filterCourses({ currentTarget: allButton });