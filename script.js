const setupScreen = document.getElementById("setupScreen");
const loadingScreen = document.getElementById("loadingScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const topicInput = document.getElementById("topicInput");

const generateBtn = document.getElementById("generateBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const currentQuestionEl = document.getElementById("currentQuestion");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");

const scoreDisplay = document.getElementById("scoreDisplay");
const explanationsContainer = document.getElementById("explanationsContainer");

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

let timer;
let timeLeft = 30;

const userAnswers = [];

/* ==========================
   QUESTION BANK
========================== */

const questionBank = {

    javascript: [
        {
            question: "Which keyword is used to declare a variable in JavaScript?",
            options: ["var", "int", "string", "define"],
            answer: "var",
            explanation: "var, let and const are used to declare variables."
        },
        {
            question: "Which method converts JSON into an object?",
            options: ["JSON.parse()", "JSON.stringify()", "parseJSON()", "convert()"],
            answer: "JSON.parse()",
            explanation: "JSON.parse() converts JSON strings into JavaScript objects."
        },
        {
            question: "Which company created JavaScript?",
            options: ["Google", "Microsoft", "Netscape", "Apple"],
            answer: "Netscape",
            explanation: "JavaScript was originally developed at Netscape."
        },
        {
            question: "Which symbol starts a single-line comment?",
            options: ["//", "/*", "#", "--"],
            answer: "//",
            explanation: "// is used for single-line comments."
        },
        {
            question: "Which keyword creates a block-scoped variable?",
            options: ["let", "var", "scope", "new"],
            answer: "let",
            explanation: "let creates variables scoped to a block."
        }
    ],

    html: [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Text Machine Language",
                "Hyper Tool Markup Language",
                "Home Text Markup Language"
            ],
            answer: "Hyper Text Markup Language",
            explanation: "HTML stands for Hyper Text Markup Language."
        },
        {
            question: "Which tag creates a hyperlink?",
            options: ["<a>", "<link>", "<href>", "<url>"],
            answer: "<a>",
            explanation: "The anchor tag (<a>) creates hyperlinks."
        },
        {
            question: "Which tag displays an image?",
            options: ["<img>", "<picture>", "<image>", "<src>"],
            answer: "<img>",
            explanation: "The img tag displays images."
        },
        {
            question: "Which tag creates a paragraph?",
            options: ["<p>", "<para>", "<text>", "<paragraph>"],
            answer: "<p>",
            explanation: "The p tag creates paragraphs."
        },
        {
            question: "Which tags represent headings?",
            options: ["<h1>-<h6>", "<head>", "<heading>", "<title>"],
            answer: "<h1>-<h6>",
            explanation: "HTML headings range from h1 to h6."
        }
    ],

    css: [
        {
            question: "What does CSS stand for?",
            options: [
                "Cascading Style Sheets",
                "Computer Style Sheets",
                "Creative Style System",
                "Color Style Syntax"
            ],
            answer: "Cascading Style Sheets",
            explanation: "CSS stands for Cascading Style Sheets."
        },
        {
            question: "Which property changes text color?",
            options: ["color", "font-color", "text-color", "foreground"],
            answer: "color",
            explanation: "The color property changes text color."
        },
        {
            question: "Which property adds space inside an element?",
            options: ["padding", "margin", "gap", "spacing"],
            answer: "padding",
            explanation: "Padding creates internal spacing."
        },
        {
            question: "Which property controls font thickness?",
            options: ["font-weight", "weight", "font-style", "bold"],
            answer: "font-weight",
            explanation: "font-weight controls how bold text appears."
        },
        {
            question: "Which display value enables Flexbox?",
            options: ["flex", "grid", "block", "inline"],
            answer: "flex",
            explanation: "display:flex activates Flexbox layout."
        }
    ]
};

/* ==========================
   EVENTS
========================== */

generateBtn.addEventListener("click", generateQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

/* ==========================
   GENERATE QUIZ
========================== */

function generateQuiz() {

    const topic = topicInput.value.trim().toLowerCase();

    if (!topic) {
        alert("Please enter a topic.");
        return;
    }

    setupScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden");

    setTimeout(() => {

        if (questionBank[topic]) {
            quizData = questionBank[topic];
        } else {
            quizData = questionBank.javascript;
        }

        currentQuestionIndex = 0;
        score = 0;
        userAnswers.length = 0;

        loadingScreen.classList.add("hidden");
        quizScreen.classList.remove("hidden");

        loadQuestion();

    }, 2000);
}

/* ==========================
   LOAD QUESTION
========================== */

function loadQuestion() {

    selectedAnswer = null;

    const question = quizData[currentQuestionIndex];

    currentQuestionEl.textContent = currentQuestionIndex + 1;

    progressBar.style.width =
        ((currentQuestionIndex + 1) / quizData.length) * 100 + "%";

    questionText.textContent = question.question;

    optionsContainer.innerHTML = "";

    question.options.forEach(option => {

        const button = document.createElement("button");

        button.classList.add("option-btn");

        button.textContent = option;

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".option-btn")
                .forEach(btn => btn.classList.remove("selected"));

            button.classList.add("selected");

            selectedAnswer = option;
        });

        optionsContainer.appendChild(button);
    });

    startTimer();
}

/* ==========================
   TIMER
========================== */

function startTimer() {

    clearInterval(timer);

    timeLeft = 30;

    timerElement.textContent = timeLeft;

    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timer);

            nextQuestion();
        }

    }, 1000);
}

/* ==========================
   NEXT QUESTION
========================== */

function nextQuestion() {

    clearInterval(timer);

    const current = quizData[currentQuestionIndex];

    if (selectedAnswer === current.answer) {
        score++;
    }

    userAnswers.push({
        question: current.question,
        selected: selectedAnswer || "Not Answered",
        correct: current.answer,
        explanation: current.explanation
    });

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

/* ==========================
   RESULTS
========================== */

function showResults() {

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    scoreDisplay.textContent =
        `${score} / ${quizData.length}`;

    explanationsContainer.innerHTML = "";

    userAnswers.forEach((item, index) => {

        const card = document.createElement("div");

        card.classList.add("explanation-card");

        card.innerHTML = `
            <h4>Question ${index + 1}</h4>
            <p><strong>Your Answer:</strong> ${item.selected}</p>
            <p><strong>Correct Answer:</strong> ${item.correct}</p>
            <p><strong>Explanation:</strong> ${item.explanation}</p>
        `;

        explanationsContainer.appendChild(card);
    });
}

/* ==========================
   RESTART
========================== */

function restartQuiz() {

    resultScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");

    topicInput.value = "";

    progressBar.style.width = "0%";
}