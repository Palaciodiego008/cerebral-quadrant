console.log("Diego Dapo Developer - Hub Innovation");

document.addEventListener("DOMContentLoaded", setupForm);

async function fetchQuestions() {
  const response = await fetch("questions.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function createQuestionElement(question, index, rasgoMapping) {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");
  questionDiv.innerHTML = `
        <p>${question.question}</p>
        ${question.options
          .map(
            (option, optionIndex) => `
            <label>
                <input type="radio" name="question${index + 1}" value="${
              rasgoMapping[index][optionIndex]
            }">
                ${option}
            </label>
        `
          )
          .join("")}
    `;
  return questionDiv;
}

async function setupForm() {
  try {
    const data = await fetchQuestions();
    const questions = data.questions;
    const rasgoMapping = getRasgoMapping();

    const form = document.getElementById("questionnaire-form");
    const fragment = document.createDocumentFragment();
    questions.forEach((question, index) => {
      const questionElement = createQuestionElement(
        question,
        index,
        rasgoMapping
      );
      fragment.appendChild(questionElement);
    });
    form.appendChild(fragment);

    setupModalCloseEvent();
  } catch (error) {
    console.error("Error fetching or parsing questions.json", error);
  }
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

function setupModalCloseEvent() {
  const closeModalButton = document.querySelector(".close");
  closeModalButton.addEventListener("click", () => toggleModal(false));
}

function toggleModal(show) {
  const modal = document.getElementById("modal");
  modal.style.display = show ? "block" : "none";
}

function calculateResults() {
  const formData = new FormData(document.getElementById("questionnaire-form"));
  const counts = { CI: 0, LI: 0, LD: 0, CD: 0 };

  for (let value of formData.values()) {
    counts[value]++;
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
  // Establecer el título una vez
  resultsDiv.innerHTML = "<h2>Resultados</h2><br>";

  // Agregar los resultados con las descripciones sin sobrescribir el título
  const resultsContent = Object.entries(counts)
    .map(
      ([key, value]) => `
          <h3>${key}: ${value * 20}</h3>
          <p>${categoryDescriptions[key].description}</p>
      `
    )
    .join("");

  // Usar insertAdjacentHTML para agregar después del título
  resultsDiv.insertAdjacentHTML("beforeend", resultsContent);

  // Agregar la imagen después de los resultados
  const imageContent = `
      <img src="./assets/sides-mind.png" 
           alt="Diagrama de Dominancia Cerebral" 
           style="width: 100%; height: auto; margin-top: 23px;">
  `;

  resultsDiv.insertAdjacentHTML("beforeend", imageContent);
}
