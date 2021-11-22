import { QuizFactory } from "./model.js";
import { AppSettings } from "./model.js";
import { QuizResults } from "./model.js";
import { View } from "./view.js";

/* Controler */

export class AppController {
  constructor() {
    this.view = new View();
    this.quizFactory = null;
    this.quiz = null;
    this.taskTimer = null;
    this.settings = new AppSettings();
    this.results = new QuizResults();
  }

  async init() {
    try {
      const res = await fetch("./data/db.json");
      const data = await res.json();
      this.quizFactory = new QuizFactory(data);
      this.preloadGroupCovers();
      this.getHomePage();
    } catch (err) {
      console.error(err);
    }
  }

  render(pageNode) {
    const viewPort = document.querySelector("#app");
    viewPort.innerHTML = "";
    viewPort.appendChild(pageNode);
  }

  preloadGroupCovers() {
    const list = [];
    for (let i = 0; i < 24; i++) {
      const img = new Image();
      img.src = `/assets/pic/img/${i * 10 + 4}.webp`;
      list.push(img);
    }
  }

  // User actions handlers
  //
  getHomePage = () => {
    // Create page basic layout
    const pageNode = this.view.createHomePage();
    // Add page events
    const btnSettings = pageNode.querySelector("#settings-btn");
    btnSettings.addEventListener("click", this.getSettingsPage);
    const btnArtistsQuiz = pageNode.querySelector("#artists-quiz-btn");
    btnArtistsQuiz.addEventListener("click", () => {
      this.getGroupsPage("artists");
    });
    const btnPaintingsQuiz = pageNode.querySelector("#paintings-quiz-btn");
    btnPaintingsQuiz.addEventListener("click", () => {
      this.getGroupsPage("paintings");
    });
    //
    this.render(pageNode);
  };

  // Quiz Groups page controller
  getGroupsPage = (type) => {
    const group = (element) => +element.id.split("-")[2];
    const addGroupResult = (groupCard, displacement) => {
      const groupResult = this.results.getGroupResult(group(groupCard) + displacement);
      if (groupResult !== -1) {
        groupCard.classList.remove("bwCard");
        const score = groupCard.lastElementChild;
        score.classList.remove("hidden");
        score.textContent = `${groupResult}/10`;
      }
    };
    // Create quiz instance
    if (type === "artists") {
      this.quiz = this.quizFactory.createArtistsQuiz();
    } else if (type === "paintings") {
      this.quiz = this.quizFactory.createPaintingQuiz();
    }
    // Create page basic layout
    const pageNode = this.view.createGroupsPage(type);
    //
    // Add page events
    // - Home page btn event
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.getHomePage);
    // - Cards click event
    const cardsCollection = pageNode.getElementsByClassName("groupCard");
    for (let card of cardsCollection) {
      // -- Card
      if (type === "artists") {
        card.addEventListener("click", (e) => {
          this.getQuizArtists(group(e.currentTarget));
        });
        // -- Add cards background
        card.style.backgroundImage = `url(/assets/pic/img/${group(card) * 10 + 4}.webp)`;
        // -- Add results on card
        const displacement = 0; // Shift for resulting array
        addGroupResult(card, displacement);
      } else if (type === "paintings") {
        card.addEventListener("click", (e) => {
          this.getQuizPaintings(group(e.currentTarget));
        });
        // Add cards background
        card.style.backgroundImage = `url(/assets/pic/img/${
          group(card) * 10 + 124
        }.webp)`;
        // Add results on card
        const displacement = 12; // Shift for resulting array
        addGroupResult(card, displacement);
      }
    }
    //
    this.render(pageNode);
  };

  // Artists quiz page controller
  getQuizArtists = (groupIndex) => {
    // Create new quiz model
    this.quiz.generateNewQuiz(groupIndex);
    // Create page basic layout
    const pageNode = this.view.createQuizAPage(this.settings);
    // Update sounds
    this.mutePage(pageNode, !this.settings.options.soundsEnabled);
    this.changePageVolume(pageNode, this.settings.options.volume);
    // Initial task values
    this.setupArtistsQuiz(pageNode);
    //
    // Add page events
    //
    // - Back btn click Event
    const btnBack = pageNode.querySelector("#back-btn");
    btnBack.addEventListener("click", () => {
      this.getGroupsPage("artists");
      // Remove task timeout timer
      this.removeTaskTimer();
    });
    //
    // - Task option img click event
    for (let i = 0; i < 4; i++) {
      const container = `#option-img-${i}`;
      pageNode.querySelector(container).addEventListener("click", (e) => {
        // Remove task timeout timer
        this.removeTaskTimer();
        // Check Task answer
        const userGuess = e.target.id;
        this.showTaskAnswerCard(userGuess);
      });
    }
    //
    // - Next Task btn click event
    const btnNext = pageNode.querySelector("#next-task");
    btnNext.addEventListener("click", () => {
      // Update quiz model
      // - Next task
      this.quiz.currentTask += 1;
      // Check Quiz end condition
      if (this.quiz.currentTask > 9) {
        // Invoke Quiz results
        // Quiz end sound
        this.playSound(2);
        // Progress bar update
        this.updateProgressBar(document);
        // - Comtpute quiz result
        const quizResult = this.quiz.quizProgress.reduce(
          (acc, i) => (i === 1 ? acc + i : acc),
          0
        );
        document.querySelector(".quizScore").textContent = quizResult;
        // Save quiz result
        this.results.setGroupResult(groupIndex, quizResult); // ------------------------- shift
        // - Show golden trophy
        if (quizResult === 10) {
          const goldenTrophy = `url(/assets/svg/trophy-badge-10.svg)`;
          document.querySelector(".quizResultBadge").style.backgroundImage = goldenTrophy;
        }
        // Show Quiz results
        document.querySelector(".overlay").classList.remove("hidden");
        document.querySelector("#quiz-task-result").classList.add("hidden");
        document.querySelector("#quiz-result").classList.remove("hidden");
      } else {
        // Update page with a next task
        this.setupArtistsQuiz(document);
        document.querySelector(".overlay").classList.add("hidden");
        document.querySelector("#quiz-task-result").classList.add("hidden");
      }
    });
    //
    // - Finish Quiz button click Event
    const finishBtn = pageNode.querySelector("#finish-quiz");
    finishBtn.addEventListener("click", () => {
      this.getGroupsPage("artists");
    });
    //
    this.render(pageNode);
  };

  updateProgressBar = (pageNode) => {
    let progress = "";
    this.quiz.quizProgress.forEach((i) => {
      if (i === -1) {
        progress += `<span class="bullet"></span>`;
      } else if (i === 0) {
        progress += `<span class="bullet wrongAnswer"></span>`;
      } else if (i === 1) {
        progress += `<span class="bullet rightAnswer"></span>`;
      }
    });
    pageNode.querySelector(".progressBar").innerHTML = progress;
  };

  showTaskAnswerCard = (userGuess) => {
    const isRightAnswer = this.quiz.checkUserGuess(this.quiz.currentTask, userGuess);
    if (isRightAnswer) {
      // Add success badge to the painting
      document.querySelector(".resultBadge").classList.remove("failBadge");
      document.querySelector(".resultBadge").classList.add("successBadge");
      // Play sound
      this.playSound(1);
    } else {
      // Add fail badge to the painting
      document.querySelector(".resultBadge").classList.remove("successBadge");
      document.querySelector(".resultBadge").classList.add("failBadge");
      // Play sound
      this.playSound(0);
    }
    // Show task answer popup
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector("#quiz-task-result").classList.remove("hidden");
  };

  setupArtistsQuiz(node) {
    // Current task number
    node.querySelector(".taskCounter").textContent = this.quiz.currentTask + 1;
    // Progress bar update
    this.updateProgressBar(node);
    // Task Question
    node.querySelector(".taskQuestion").innerHTML = this.quiz.getTaskQuestion(
      this.quiz.currentTask
    );
    // Task Options
    const options = this.quiz.getTaskOptions(this.quiz.currentTask);
    options.forEach((i, n) => {
      const [id, url] = i.split("::");
      const container = `#option-img-${n}`;
      node.querySelector(container).innerHTML = `
        <img class="taskImg" id="${id}" src=".${url}" alt="Painting">`;
    });
    // Result popup
    const paintingImgURL = this.quiz.tasks.task[this.quiz.currentTask].getImgNum();
    node.querySelector(".resultImg").src = this.quiz.getImgURL(paintingImgURL, "full");
    const paintingName = this.quiz.tasks.task[this.quiz.currentTask].getPaintingName();
    node.querySelector(".paintingCaption").textContent = `${paintingName}`;
    const paintingYear = this.quiz.tasks.task[this.quiz.currentTask].getPaintingYear();
    const paintingAuthor = this.quiz.tasks.task[this.quiz.currentTask].getAuthor();
    node.querySelector(
      ".paintingAthor"
    ).textContent = `${paintingAuthor}, ${paintingYear}`;
    //
    // Task timer
    this.addTaskTimer();
  }

  // Paintings quiz page controller
  getQuizPaintings = (groupIndex) => {
    // Create new quiz model
    this.quiz.generateNewQuiz(groupIndex);
    // Create page basic layout
    const pageNode = this.view.createQuizPPage(this.settings);
    // Update sounds
    this.mutePage(pageNode, !this.settings.options.soundsEnabled);
    this.changePageVolume(pageNode, this.settings.options.volume);
    // Initial task values
    this.setupPaintingsQuiz(pageNode);
    //
    // Add page events
    //
    // - Back btn click Event
    const btnBack = pageNode.querySelector("#back-btn");
    btnBack.addEventListener("click", () => {
      this.getGroupsPage("paintings");
      // Remove task timeout timer
      this.removeTaskTimer();
    });
    //
    // - Task option img click event
    for (let i = 0; i < 4; i++) {
      const container = `#option-btn-${i}`;
      pageNode.querySelector(container).addEventListener("click", (e) => {
        // Remove task timeout timer
        this.removeTaskTimer();
        // Check Task answer
        const userGuess = e.target.data;
        this.showTaskAnswerCard(userGuess);
      });
    }
    //
    // - Next Task btn click event
    const btnNext = pageNode.querySelector("#next-task");
    btnNext.addEventListener("click", () => {
      // Update quiz model
      // - Next task
      this.quiz.currentTask += 1;
      // Check Quiz end condition
      if (this.quiz.currentTask > 9) {
        // Invoke Quiz results
        // Quiz end sound
        this.playSound(2);
        // Progress bar update --------------------------------------------- function
        this.updateProgressBar(document);
        // - Comtpute quiz result
        const quizResult = this.quiz.quizProgress.reduce(
          (acc, i) => (i === 1 ? acc + i : acc),
          0
        );
        document.querySelector(".quizScore").textContent = quizResult;
        // Save quiz result
        this.results.setGroupResult(groupIndex + 12, quizResult);
        // - Show golden trophy
        if (quizResult === 10) {
          const goldenTrophy = `url(/assets/svg/trophy-badge-10.svg)`;
          document.querySelector(".quizResultBadge").style.backgroundImage = goldenTrophy;
        }
        // Show Quiz results
        document.querySelector(".overlay").classList.remove("hidden");
        document.querySelector("#quiz-task-result").classList.add("hidden");
        document.querySelector("#quiz-result").classList.remove("hidden");
      } else {
        // Update page with a next task
        this.setupPaintingsQuiz(document);
        document.querySelector(".overlay").classList.add("hidden");
        document.querySelector("#quiz-task-result").classList.add("hidden");
      }
    });
    //
    // - Finish Quiz button click Event
    const finishBtn = pageNode.querySelector("#finish-quiz");
    finishBtn.addEventListener("click", () => {
      this.getGroupsPage("paintings");
    });
    //
    this.render(pageNode);
  };

  setupPaintingsQuiz(node) {
    // Current task number
    node.querySelector(".taskCounter").textContent = this.quiz.currentTask + 1;
    // Progress bar update
    this.updateProgressBar(node);
    // Task Painting
    const taskImg = this.quiz.getTaskImg(this.quiz.currentTask);
    node.querySelector(".taskImg").src = taskImg;
    // Task Options
    const options = this.quiz.getTaskOptions(this.quiz.currentTask);
    options.forEach((i, n) => {
      const [id, name] = i.split("::");
      const container = `#option-btn-${n}`;
      const optionBtn = node.querySelector(container);
      optionBtn.data = id;
      optionBtn.textContent = name;
    });
    // Result popup
    const paintingImgURL = this.quiz.tasks.task[this.quiz.currentTask].getImgNum();
    node.querySelector(".resultImg").src = this.quiz.getImgURL(paintingImgURL, "full");
    const paintingName = this.quiz.tasks.task[this.quiz.currentTask].getPaintingName();
    node.querySelector(".paintingCaption").textContent = `${paintingName}`;
    const paintingYear = this.quiz.tasks.task[this.quiz.currentTask].getPaintingYear();
    const paintingAuthor = this.quiz.tasks.task[this.quiz.currentTask].getAuthor();
    node.querySelector(
      ".paintingAthor"
    ).textContent = `${paintingAuthor}, ${paintingYear}`;
    //
    // Task timer
    this.addTaskTimer();
  }

  getSettingsPage = () => {
    // Create page basic layout
    const pageData = this.settings.options;
    const pageNode = this.view.createSettingsPage(pageData);
    // Update sounds
    this.mutePage(pageNode, !this.settings.options.soundsEnabled);
    this.changePageVolume(pageNode, this.settings.options.volume);
    //
    // Add page events
    //
    // - Enable sounds checkbox click event
    const soundsEnabled = pageNode.querySelector("#sounds-enabled");
    soundsEnabled.addEventListener("click", (e) => {
      this.mutePage(document, !e.target.checked);
      if (e.target.checked) {
        this.playSound(0);
      }
    });
    //
    // - Volume level change event
    const volume = pageNode.querySelector("#volume-level");
    volume.addEventListener("change", (e) => {
      this.changePageVolume(document, e.target.value);
      this.playSound(1);
    });
    //
    // - Time limit btn click event
    const stepDownBtn = pageNode.querySelector("#step-down-btn");
    stepDownBtn.addEventListener("click", (e) => {
      e.target.nextElementSibling.stepDown();
      this.playSound(1);
    });
    const stepUpBtn = pageNode.querySelector("#step-up-btn");
    stepUpBtn.addEventListener("click", (e) => {
      e.target.previousElementSibling.stepUp();
      this.playSound(1);
    });
    //
    // - Enable time limit checkbox click event
    const timeLimitEnabled = pageNode.querySelector("#time-limit-enabled");
    timeLimitEnabled.addEventListener("click", (e) => {
      if (e.target.checked) {
        this.playSound(0);
      }
    });
    //
    // - Home btn click event
    const btnHome = pageNode.querySelector("#home-btn");
    btnHome.addEventListener("click", this.getHomePage);
    //
    // - Save settings btn click event
    const btnSave = pageNode.querySelector("#save-settings-btn");
    btnSave.addEventListener("click", () => {
      this.settings.options = {
        soundsEnabled: document.querySelector("#sounds-enabled").checked,
        volume: document.querySelector("#volume-level").value,
        timeLimitEnabled: document.querySelector("#time-limit-enabled").checked,
        timeLimit: document.querySelector("#time-limit").value,
      };
      this.getHomePage();
    });
    //
    // - Return default settings btn click event
    const btnDefault = pageNode.querySelector("#default-settings-btn");
    btnDefault.addEventListener("click", () => {
      document.querySelector("#sounds-enabled").checked = false;
      document.querySelector("#volume-level").value = 1;
      document.querySelector("#time-limit").value = 30;
      document.querySelector("#time-limit-enabled").checked = false;
    });
    //
    this.render(pageNode);
  };

  // Sounds
  playSound(i) {
    // "click" "deafen"  -> 0
    // "snap"  "joined"  -> 1
    const sounds = document.getElementsByTagName("audio");
    sounds[i].currentTime = 0;
    sounds[i].play();
  }

  mutePage(pageNode, state) {
    for (const item of pageNode.getElementsByTagName("audio")) {
      item.muted = state;
    }
  }

  changePageVolume(pageNode, level) {
    for (const item of pageNode.getElementsByTagName("audio")) {
      item.volume = level;
    }
  }

  // Timer
  addTaskTimer = () => {
    if (this.settings.options.timeLimitEnabled) {
      // Initial time
      const timeStamp = Date.now();
      // Timer id
      this.taskTimer = setTimeout(this.taskTimeoutHandler, 100, timeStamp);
    }
  };

  removeTaskTimer = () => {
    if (this.settings.options.timeLimitEnabled) {
      clearTimeout(this.taskTimer);
    }
  };

  taskTimeoutHandler = (initialTime) => {
    const timeLim = +this.settings.options.timeLimit * 1000;
    const currentTime = Date.now();
    if (currentTime - initialTime >= timeLim) {
      const userGuess = "-1";
      this.showTaskAnswerCard(userGuess);
    } else {
      const timeLeft = Math.round((timeLim - currentTime + initialTime) / 1000);
      document.querySelector(".timer").textContent = timeLeft;
      this.taskTimer = setTimeout(this.taskTimeoutHandler, 100, initialTime);
    }
  };
}
