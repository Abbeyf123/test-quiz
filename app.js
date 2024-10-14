let questionContainer = document.querySelector("#question-container");
let regenerate = document.querySelector("#regenerate");
let startButton = document.querySelector("#start-btn");
let spinner = document.querySelector("#spinner-container");

// Initialize the counters outside the event listener
let correctCount = 0;
let wrongCount = 0;
let swiper;
let totalQuestion = 0;

startButton.addEventListener("click", () => {
  fetchQuestions();
});

// function to attach swiper
function attachSwipper() {
  swiper = new Swiper(".swiper", {
    loop: false,
    navigation: {
      nextEl: "#nav-right",
      prevEl: "#nav-left",
    },
    keyboard: true,
    initialslide: 0,
  });
}

// Function to attach event listeners to dynamically added answers
function attachListeners() {
  const answers = document.querySelectorAll(".answer");
  const answersDiv = document.querySelectorAll("#answer-div");

  answers.forEach((answer) => {
    // Attach the 'change' event listener to each answer checkbox
    answer.addEventListener("change", (event) => setEvent(event));
  });

  answersDiv.forEach((answerdiv) => {
    // Attach the 'change' event listener to each answer checkbox
    answersDiv.addEventListener("click", setEvent());
  });
}

// Updated setEvent function to handle the event object properly
function setEvent(event) {
  const answer = event.target; // Use the event target to get the answer element
  totalQuestion++;

  if (answer.checked) {
    // Find the parent container of the current question
    const questionContainer = answer.closest(".question-1");
    const allAnswersInQuestion = questionContainer.querySelectorAll(".answer");

    // Show correct or wrong feedback for the current question
    const correct = questionContainer.querySelector(".correct");
    const wrong = questionContainer.querySelector(".wrong");
    const realAnswer = questionContainer.querySelector(".real-answer");

    // Check if the selected answer is correct or wrong
    if (answer.id === "correct-answer") {
      correct.classList.remove("hidden");
      correctCount++;
    } else if (answer.id === "wrong-answer") {
      wrong.classList.remove("hidden");
      realAnswer.classList.remove("hidden");
      wrongCount++;
    }

    // Update the correct and wrong answer counters
    updateCounters();
  }
}

// function to display the the finish elements when clicked it is set as onclick in the finish button
function finish() {
  updateCounters();
  questionContainer.innerHTML = "";
  questionContainer.innerHTML = `
          <div class="swiper-slide">
          <div class="content w-full flex justify-center mt-10">
            <div
              class="question-1 border w-[400px] flex flex-col justify-center items-center text-center py-3 px-3 rounded-lg bg-white shadow mb-3"
            >
              <h1 class="capitalize font-bold text-left w-full pl-3 border-b pb-2 text-xl mb-3">
                Quiz game
              </h1>
              <div class="pl-3">
                <p class="tracking-wide text-left">
                  Your total wrong answers is 
                  <span class="font-bold text-red-500 ">${wrongCount}</span>
                </p>

                <p class="tracking-wide text-left">
                  Your total Correct answers is 
                  <span class="font-bold text-green-500 ">${correctCount}</span>
                </p>

                <p>
                  Your total answered Questions is
                  <span class="font-bold total-counter">${totalQuestion}</span>
                </p>
              </div>
              <div class="mt-3">
                <button
                  class="bg-blue-900 text-white px-3 py-1 border rounded hover:bg-blue-900/60 outline-none"
                  id="regenerate"
                  onclick="fetchQuestions()"
                >
                  Play more...
                </button>
              </div>
            </div>
          </div>
        </div>
  `;
}

// Function to update the counters in the HTML
function updateCounters() {
  const correctCounterElements = document.querySelectorAll(".correct-counter");
  const wrongCounterElements = document.querySelectorAll(".wrong-counter");
  const totalCountElements = document.querySelectorAll(".total-counter");

  correctCounterElements.forEach((element) => {
    element.textContent = correctCount;
  });

  wrongCounterElements.forEach((element) => {
    element.textContent = wrongCount;
  });
  totalCountElements.forEach((element) => {
    element.textContent = correctCount + wrongCount;
  });
}

// Function to generate and display questions
function setQuestion(input) {
  return input
    .map((result, index) => {
      const allAnswers = [...result.incorrect_answers, result.correct_answer];

      const shuffledAnswers = allAnswers
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      return `
        <div class="swiper-slide">
          <div class="content w-full flex justify-center mt-3">
            <div class="question-1 border w-[400px] flex flex-col justify-center items-center text-center py-3 px-3 rounded-lg bg-white shadow mb-3">
              <!-- Header with correct and wrong counters -->
              <div class="head flex justify-between w-full">
                <span class="font-bold text-green-500 border rounded-full p-3 border-green-500 correct-counter">${correctCount}</span>
                <h2 class="font-bold text-lg">Quiz Game </h2>
                <span class="font-bold text-red-500 border rounded-full p-3 border-red-500 wrong-counter">${wrongCount}</span>
              </div>
              
              <!-- Labels for correct and wrong answers -->
              <div class="head flex justify-between w-full">
                <span class="font-bold text-green-500">correct answers</span>
                <span class="font-bold text-red-500">wrong answers</span>
              </div>

              <!-- Progress and difficulty -->
              <span class="px-2 py-1 text-blue-400">${index + 1}/25</span>
              <span class="text-blue-900 mt-3">Difficulty: ${
                result.difficulty
              }</span>

              <!-- Question text -->
              <p class="mt-3">${result.question}</p>
              
              <!-- Category -->
              <h4 class="bg-blue-900 text-white w-max p-2 capitalize mt-5 rounded-md mb-2">${
                result.category
              }</h4>
              
              <!-- Answer feedback (correct/wrong) -->
              <div class="assesments mb-4">
                <span class="font-bold text-red-500 text-md uppercase  hidden wrong">wrong</span>
                <span class="font-bold text-green-500 text-md hidden uppercase correct">correct</span>
                <span class="font-bold text-green-500 text-md uppercase hidden block real-answer">correct answer: ${
                  result.correct_answer
                }</span>
              </div>
              
              <!-- Answer choices -->
              <div class="answers w-full text-white">
                ${shuffledAnswers
                  .map((answer) => {
                    const isCorrect = answer === result.correct_answer;
                    return `
                      <div class="content-1 bg-blue-900 flex justify-left items-center px-2 py-2 space-x-2 mb-2 rounded-md
                      id="answer-div"
                      >
                        <input
                          type="checkbox"
                          id="${isCorrect ? "correct-answer" : "wrong-answer"}"
                          class=" accent-blue-300 answer outline-none"
                        />
                        <span>${answer}</span>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
              <button
                  class="bg-blue-900 text-white px-3 py-1 border rounded hover:bg-blue-900/60 outline-none"
                  id="regenerate"
                  onclick="finish()"
                >
                  Finish
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// Fetching the data from the API
const url = "https://opentdb.com/api.php?amount=25";
async function fetchQuestions() {
  spinner.classList.remove("hidden");
  correctCount = 0;
  wrongCount = 0;
  totalQuestion = 0;
  try {
    const req = await fetch(url);
    if (!req.ok) throw new Error(req.statusText);
    spinner.classList.add("hidden");
    const res = await req.json();
    attachSwipper();
    // Populate the question container with the generated HTML
    questionContainer.innerHTML = "";
    questionContainer.innerHTML = setQuestion(res.results);

    // After the HTML is rendered, attach the event listeners to the answers
    attachListeners();
    swiper.update();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}
