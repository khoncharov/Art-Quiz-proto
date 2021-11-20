/* Modedl */

// --- Quiz classes
class Task {
  constructor(taskInfo) {
    this.data = taskInfo;
    this.options = this.generateTaskOptions(); // <Array> of "image" index
  }

  getTaskID() {
    return +this.data.imageNum;
  }

  getAuthor() {
    return this.data.author;
  }

  getPaintingName() {
    return this.data.name;
  }

  getYear() {
    return this.data.year;
  }

  getImgNum() {
    return this.data.imageNum;
  }

  getOptions() {
    return this.options;
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  generateTaskOptions() {
    const arr = [this.getTaskID()];
    while (arr.length < 4) {
      const num = Math.floor(Math.random() * 241);
      if (!arr.includes(num)) {
        arr.push(num);
      }
    }
    this.shuffle(arr);
    return arr;
  }
}

class Quiz {
  constructor(data) {
    this.tasks = null;
    this.data = data;
    this.quizProgress = null;
  }

  resetProgress() {
    this.quizProgress = new Array(10).fill(0);
  }

  generateNewQuiz(group) {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      const taskInfo = this.data.image[i + group * 10];
      tasks.push(new Task(taskInfo));
    }
    this.tasks = {
      task: tasks,
    };
    this.resetProgress();
  }

  checkUserGuess(taskIndex, userGuess) {
    const result = this.tasks.task[taskIndex].getImgNum() === userGuess;
    this.quizProgress[taskIndex] = +result;
    return result;
  }

  getResult() {
    return this.quizProgress;
  }

  getImgURL(index, size) {
    if (size === "full") {
      return `./assets/pic/full/${index}full.webp`;
    }
    if (size === "box") {
      return `./assets/pic/img/${index}.webp`;
    }
  }
}

class QuizFactory {
  constructor(data) {
    this.data = data;
  }

  createArtistsQuiz() {
    return new ArtistsQuiz(this.data);
  }
  createPaintingQuiz() {
    return new PaintingsQuiz(this.data);
  }
}

class ArtistsQuiz extends Quiz {
  constructor(data) {
    super(data);
  }

  getTaskQuestion(index) {
    return `Какую из картин написал<br>${this.tasks.task[index].getAuthor()}?`;
  }

  getTaskOptions(index) {
    const options = this.tasks.task[index].getOptions();
    const formattedOpt = options.map((i) => {
      return `${i}::${this.getImgURL(this.data.image[i].imageNum, "box")}`;
    });
    return formattedOpt;
  }
}

class PaintingsQuiz extends Quiz {
  constructor(data) {
    super(data);
  }

  getTaskQuestion() {
    return `Кто автор этой картины?`;
  }

  getTaskImg(index) {
    const imgNum = this.tasks.task[index].getImgNum();
    return this.getImgURL(imgNum, "full");
  }

  getTaskOptions(index) {
    const options = this.tasks.task[index].getOptions();
    const formattedOpt = options.map((i) => {
      return `${i}::${this.data.image[i].author}`;
    });
    return formattedOpt;
  }
}
// --- End of Quiz classes

// --- Quiz results class
class QuizResults {
  constructor() {
    this._groups =
      JSON.parse(localStorage.getItem("resultInGroup")) ?? new Array(24).fill(-1);
  }

  get groups() {
    return this._groups;
  }
  set groups(value) {
    this._groups = value;
    localStorage.setItem("resultInGroup", JSON.stringify(value));
  }

  getGroupResult(index) {
    return this.groups[index];
  }

  setGroupResult(index, value) {
    const results = this.groups;
    results[index] = value;
    this.groups = results;
  }
}
// --- End of Quiz results class

// --- Application settings class
class AppSettings {
  constructor() {
    this._options = JSON.parse(localStorage.getItem("options")) ?? {
      soundsEnabled: false,
      volume: 1, // 0 - 1
      timeLimitEnabled: false,
      timeLimit: 30, // [5 - 30] step 5 seconds
    };
  }

  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
    localStorage.setItem("options", JSON.stringify(value));
  }
}
// --- End of Application settings class

/* View */

class View {
  createHomePage() {
    const content = document.createElement("div");
    content.id = "home-page";
    content.innerHTML = `      
      <header class="home-header">
        <h1 class="logo">Art quiz</h1>
      </header>

      <main class="home-main">
        <div class="controls">
          <button class="uiBtn" id="artists-quiz-btn">Художники</button>
          <button class="uiBtn" id="paintings-quiz-btn">Картины</button>
          <button class="uiBtn" id="settings-btn">Настройки</button>
        </div>
      </main>

      <footer class="home-footer">
        <div class="footer-container">
          <a class="link" href="https://github.com/khoncharov/" title="Мой github">
            <img class="github-logo" src="/assets/svg/github.svg" alt="github logo" />
          </a>          
          <a class="link" href="https://rs.school/js/" title="RSSchool курс JS">
            <img
              class="rss-logo"
              src="/assets/svg/rs_school_js.svg"
              alt="rsschool logo"
            />
          </a>
          <p class="creation-year">2021</p>
        </div>
      </footer>`;
    return content;
  }

  createSettingsPage(data) {
    const content = document.createElement("div");
    content.id = "settings-page";
    content.innerHTML = `
      <header>
        <nav class="navBar">
          <button class="uiBtn" id="home-btn">Назад</button>
          <h2 class="pageCaption">Настройки</h2>
        </nav>
      </header>
      <main>
        <div class="settings-container">
       
          <section class="setting-item">
            <h3 class="settingCaption">Звуки</h3>
            <label for="sounds-enabled">
              <span class="settingDescription">включить</span>
              <input id="sounds-enabled" type="checkbox" name="vol-off"
                ${data.soundsEnabled ? "checked" : ""} />
            </label>
          </section>

          <section class="setting-item">
            <h3 class="settingCaption">Громкость</h3>
            <input id="volume-level" type="range" name="volume" min="0.1" max="1" step="0.1"
              value="${data.volume}"/>
          </section>

          <section class="setting-item">
            <h3 class="settingCaption">Время</h3>
            <label for="time-limit-enabled">
              <span  class="settingDescription">включить</span>
              <input type="checkbox" name="time-off" id="time-limit-enabled"
                ${data.timeLimitEnabled ? "checked" : ""} />
            </label>
          </section>

          <section class="setting-item">
            <h3 class="settingCaption">Секунд</h3>
            <div> 
              <button
                class="stepBtn"
                id="step-down-btn"
                type="button"                
              >&#8211;</button>
              <input class="settingDescription timeLimitInput" type="number" id="time-limit" min="5" max="30" step="5"
                name="time" value="${data.timeLimit}" readonly/> 
              <button
                class="stepBtn"
                id="step-up-btn"
                type="button"                
              >+</button>
            </div>
          </section> 
        </div>
        <div class="settingsControls-container">
          <button class="settingCtrlBtn" id="save-settings-btn">Сохранить</button>
          <button class="settingCtrlBtn" id="default-settings-btn">По умолчанию</button>
        </div>
      </main>
      <audio preload="auto">
        <source src="/assets/sounds/button-30.mp3" type="audio/mpeg">
      </audio>
      <audio preload="auto">
        <source src="/assets/sounds/button-16.mp3" type="audio/mpeg">
      </audio>`;
    return content;
  }

  createGroupsPage() {
    let groupList = "";
    for (let i = 0; i < 12; i++) {
      const groupNum = i + 1;
      groupList += `
        <li>
          <div class="groupCard bwCard" id="group-card-${i}">
            <h3 class="cardCaption">Группа ${groupNum}</h3>
            <p class="cardCaption groupScore hidden"></p>              
          </div>
        </li>`;
    }
    const content = document.createElement("div");
    content.id = "quiz-groups-page";
    content.innerHTML = `
      <header>               
        <nav class="navBar">
          <button class="uiBtn" id="home-page-btn">Назад</button>          
          <h2 class="pageCaption">Группы</h2>
          <button class="uiBtn">Счёт</button>  
        </nav>
      </header>
      <main>
        <ul>
          ${groupList}                    
        </ul>        
      </main>`;
    return content;
  }

  createQuizPage() {
    const content = document.createElement("div");
    content.id = "quiz-contest-page";
    content.innerHTML = `
      <header class="header">
        <nav class="navBar">
          <button class="uiBtn" id="back-btn">Назад</button>
          <span class="timer">30</span>
          <span class="taskCounter">&#8249;&#8249; 5 &#8250;&#8250;</span>
        </nav>        
      </header>
      <div class="progressBar">
        <span class="bullet rightAnswer"></span>
        <span class="bullet wrongAnswer"></span>
        <span class="bullet rightAnswer"></span>
        <span class="bullet wrongAnswer"></span>
        <span class="bullet"></span>
        <span class="bullet"></span>
        <span class="bullet"></span>
        <span class="bullet"></span>
        <span class="bullet"></span>
        <span class="bullet"></span>
      </div>
      <main class="main">
        <section class="taskCard" id="quiz-task-0">
          <div class="taskQuestion-container">
            <h3 class="taskQuestion">Кто автор этой картины?</h3>
          </div>
          <div class="taskImg-container">
            <img class="taskImg" src="../assets/pic/img/2.webp" alt="Painting" />
          </div>
          <div class="taskBtn-container">
            <button class="taskBtn">Карл Юнг</button>
            <button class="taskBtn">Жак Лакан</button>
            <button class="taskBtn">Зигмунд Фрейд</button>
            <button class="taskBtn">Жан Бодрияр</button>
          </div>
        </section>
        <div class="overlay hidden"></div>
        <div class="result-container hidden" id="quiz-task-result">
          <div class="resultBadge failBadge"></div>
          <img class="resultImg" src="../assets/pic/full/12full.webp" alt="Painting" />
          <div class="paintingCaption">Девочка на шаре</div>
          <div class="paintingAthor">Пабло Пикассо, 1905</div>
          <button class="uiBtn">Продолжить</button>
        </div>
        <div id="quiz-result"></div>
      </main>`;
    return content;
  }

  createQuizResultPage() {
    const content = document.createElement("div");
    content.id = "quiz-result-page";
    content.innerHTML = `
      <header>
        
      </header>
      <main>

      </main>`;
    return content;
  }
}

/* Controler */

class AppController {
  constructor() {
    this.view = new View();
    this.quizFactory = null;
    this.quiz = null;
    this.settings = new AppSettings();
    this.results = new QuizResults();
  }

  init() {
    fetch("./data/db.json")
      .then((res) => res.json())
      .then((data) => {
        this.quizFactory = new QuizFactory(data);
        this.preloadGroupCovers();
        this.getHomePage();
      })
      .catch((err) => {
        console.error(err);
      });
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
    btnArtistsQuiz.addEventListener("click", this.getAGroupsPage);
    const btnPaintingsQuiz = pageNode.querySelector("#paintings-quiz-btn");
    btnPaintingsQuiz.addEventListener("click", this.getPGroupsPage);
    //
    this.render(pageNode);
  };

  getAGroupsPage = () => {
    const group = (element) => +element.id.split("-")[2];
    // Create quiz instance
    this.quiz = this.quizFactory.createArtistsQuiz();
    // Create page basic layout
    const pageNode = this.view.createGroupsPage("artists");
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.getHomePage);
    const cardsCollection = pageNode.getElementsByClassName("groupCard");
    for (let card of cardsCollection) {
      card.addEventListener("click", (e) => {
        this.getQuizPaintings(group(e.currentTarget)); // ----------------------------------
      });
      // Add cards background
      card.style.backgroundImage = `url(/assets/pic/img/${group(card) * 10 + 4}.webp)`;
      // Add results on card
      const delta = 0;
      const groupResult = this.results.getGroupResult(group(card) + delta);
      if (groupResult !== -1) {
        card.classList.remove("bwCard");
        const score = card.lastElementChild;
        score.classList.remove("hidden");
        score.textContent = `${groupResult}/10`;
      }
    }
    //
    this.render(pageNode);
  };

  getPGroupsPage = () => {
    const group = (element) => +element.id.split("-")[2];
    // Create quiz instance
    this.quiz = this.quizFactory.createPaintingQuiz();
    // Create page basic layout
    const pageNode = this.view.createGroupsPage("paintings");
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.getHomePage);
    const cardsCollection = pageNode.getElementsByClassName("groupCard");
    for (let card of cardsCollection) {
      card.addEventListener("click", (e) => {
        this.getQuizPaintings(group(e.currentTarget));
      });
      // Add cards background
      card.style.backgroundImage = `url(/assets/pic/img/${group(card) * 10 + 124}.webp)`;
      // Add results on card
      const delta = 12;
      const groupResult = this.results.getGroupResult(group(card) + delta);
      if (groupResult !== -1) {
        card.classList.remove("bwCard");
        const score = card.lastElementChild;
        score.classList.remove("hidden");
        score.textContent = `${groupResult}/10`;
      }
    }
    //
    this.render(pageNode);
  };

  getQuizPaintings = (groupIndex) => {
    // Create page basic layout
    const pageNode = this.view.createQuizPage();
    // Add page events
    const btnBack = pageNode.querySelector("#back-btn");
    btnBack.addEventListener("click", this.getPGroupsPage);
    //
    this.render(pageNode);
  };

  getSettingsPage = () => {
    // Create page basic layout
    const pageData = this.settings.options;
    const pageNode = this.view.createSettingsPage(pageData);
    // Update sounds
    this.mutePage(pageNode, !this.settings.options.soundsEnabled);
    this.changePageVolume(pageNode, this.settings.options.volume);

    // Add page events
    const soundsEnabled = pageNode.querySelector("#sounds-enabled");
    soundsEnabled.addEventListener("click", (e) => {
      this.mutePage(document, !e.target.checked);
      if (e.target.checked) {
        this.playSound(0);
      }
    });
    const volume = pageNode.querySelector("#volume-level");
    volume.addEventListener("change", (e) => {
      this.changePageVolume(document, e.target.value);
      this.playSound(1);
    });

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

    const timeLimitEnabled = pageNode.querySelector("#time-limit-enabled");
    timeLimitEnabled.addEventListener("click", (e) => {
      if (e.target.checked) {
        this.playSound(0);
      }
    });
    const btnHome = pageNode.querySelector("#home-btn");
    btnHome.addEventListener("click", this.getHomePage);
    const btnSave = pageNode.querySelector("#save-settings-btn");
    btnSave.addEventListener("click", () => {
      this.settings.options = {
        soundsEnabled: document.querySelector("#sounds-enabled").checked,
        volume: document.querySelector("#volume-level").value,
        timeLimitEnabled: document.querySelector("#time-limit-enabled").checked,
        timeLimit: document.querySelector("#time-limit").value,
      };
    });
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
    // "click"  -> 0
    // "snap"   -> 1
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
}

/* Run application */

const app = new AppController();
app.init();
