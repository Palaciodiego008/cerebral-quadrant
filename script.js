document.addEventListener("DOMContentLoaded", () => {
  toggleSpinner(true);
  setTimeout(() => {
    setupForm().then(() => {
      toggleSpinner(false);
      document.querySelector('.container').style.display = 'block';
    });
  }, 1000);
});

async function fetchQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error; // Propagar el error para manejo externo
  }
}

function createQuestionElement(question, index, rasgoMapping) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";
  const questionP = document.createElement("p");
  questionP.textContent = question.question;
  questionDiv.appendChild(questionP);

  question.options.forEach((option, optionIndex) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "option";
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question${index + 1}`;
    input.value = rasgoMapping[index][optionIndex];
    label.appendChild(input);
    label.append(option);
    optionDiv.appendChild(label);
    questionDiv.appendChild(optionDiv);
  });

  return questionDiv;
}

async function setupForm() {
  try {
    const data = await fetchQuestions();
    const questions = data.questions;
    const rasgoMapping = getRasgoMapping();
    const form = document.getElementById("questionnaire-form");
    questions.forEach((question, index) => {
      const questionElement = createQuestionElement(
        question,
        index,
        rasgoMapping
      );
      form.appendChild(questionElement);
    });
    setupRadioListeners();
    setupModalCloseEvent();
  } catch (error) {
    console.error("Error setting up form:", error);
  }
}

function setupRadioListeners() {
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      // Get the question container for the radio button
      let questionContainer = radio.closest(".question");

      if (questionContainer) {
        questionContainer
          .querySelectorAll(".option")
          .forEach((optionContainer) => {
            optionContainer.style.backgroundColor = ""; //
          });

        const optionContainer = radio.closest(".option");
        if (optionContainer) {
          optionContainer.style.backgroundColor = "yellow";
        }
      }
    });
  });
}

function setupModalCloseEvent() {
  const closeModalButton = document.querySelector(".close");
  closeModalButton.addEventListener("click", () => toggleModal(false));
}

function toggleModal(show) {
  const modal = document.getElementById("modal");
  modal.style.display = show ? "flex" : "none";
}

function calculateResults() {
  const formData = new FormData(document.getElementById("questionnaire-form"));
  const counts = { CI: 0, LI: 0, LD: 0, CD: 0 };
  for (let value of formData.values()) {
    if (counts.hasOwnProperty(value)) counts[value]++;
  }
  updateResults(counts);
  toggleModal(true);
}

const categoryDescriptions = {
  CI: {
    description:
      "CI: Cortical Izquierdo. Características: Lógico, Analítico, Basado en hechos, Práctico.",
  },
  LI: {
    description:
      "LI: Límbico Izquierdo. Características: Organizador, Planificador, Detallista, Cuidadoso.",
  },
  LD: {
    description:
      "LD: Límbico Derecho. Características: Comunicador, Interpersonal, Afectivo, Emocional.",
  },
  CD: {
    description:
      "CD: Cortical Derecho. Características: Visionario, Holístico, Intuitivo, Integrador.",
  },
};

function updateResults(counts) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2 class='result-title'>Resultados</h2><br>";
  const resultsContent = Object.entries(counts)
    .map(
      ([key, value]) => `
          <h3 class='result-value'>${key}: ${value * 20}</h3>
          <p class='description-result'>${categoryDescriptions[key].description}</p>
      `
    )
    .join("");

  resultsDiv.insertAdjacentHTML("beforeend", resultsContent);

  const videoContent = `
      <video width="100%" height="auto" controls autoplay muted style="margin-top: 23px;">
        <source src="./assets/CEREBRO_CURSOBIENESTAR.mp4" type="video/mp4">
      </video>
  `;

  resultsDiv.insertAdjacentHTML("beforeend", videoContent);
}

function getRasgoMapping() {
  return [
    ["CI", "LI", "LD", "CD"],
    ["CD", "LD", "CI", "LI"],
    ["LD", "LI", "CD", "CI"],
    ["LI", "CI", "LD", "CD"],
    ["CD", "LD", "LI", "CI"],
    ["LD", "LI", "CD", "CI"],
    ["CI", "LI", "CD", "LD"],
    ["LI", "CI", "LD", "CD"],
    ["CI", "CD", "LI", "LD"],
    ["LD", "CI", "CD", "LI"],
    ["LI", "CI", "LD", "CD"],
    ["LD", "CI", "LI", "CD"],
  ];
}

function toggleSpinner(show) {
  const spinner = document.getElementById("spinner");
  spinner.style.display = show ? "block" : "none";
}
