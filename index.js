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
  constructor() {
    this.getQuizesData();
    this.tasks = null;
    this.data = null;
    this.quizProgress = null;
  }

  async getQuizesData() {
    const res = await fetch("./data/db.json");
    const data = await res.json();
    this.data = data;
  }

  resetProgress() {
    this.quizProgress = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
  createArtistsQuiz() {
    return new ArtistsQuiz();
  }
  createPaintingQuiz() {
    return new PaintingsQuiz();
  }
}

class ArtistsQuiz extends Quiz {
  constructor() {
    super();
  }

  getTaskQuestion(index) {
    return `Какую из картин написал ${this.tasks.task[index].getAuthor()}?`;
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
  constructor() {
    super();
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
  constructor() {}
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
      <header>
        <h1>Art-Quiz</h1>
      </header>
      <main>
        <button id="artists-quiz-btn">Artists quiz</button>
        <br />
        <br />
        <button id="paintings-quiz-btn">Paintings quiz</button>
        <br />
        <br />
        <button id="settings-btn">Settings</button>
        <br />
        <br />
      </main>
      <footer>
        <p>2021</p>
        <a href="https://github.com/khoncharov/">My Github</a>
        <br />
        <br />
        <a href="https://rs.school/js/">RSSchool</a>
      </footer>`;
    return content;
  }

  createSettingsPage(data) {
    const content = document.createElement("div");
    content.id = "settings-page";
    content.innerHTML = `
      <header>
        <h2>Settings</h2>
      </header>
      <main>
        <section style="background-color: #ede">
          <h3>Sounds</h3>
          <label for="sounds-enabled">
            <span>Enabled</span>
            <input id="sounds-enabled" type="checkbox" name="vol-off"
              ${data.soundsEnabled ? "checked" : ""} />
          </label>
          <br />
          <br />
          <input id="volume-level" type="range" name="volume" min="0.1" max="1" step="0.1"
            value="${data.volume}"/>
        </section>
        <section style="background-color: #ede">
          <h3>Time limit for a question</h3>
          <input type="number" id="time-limit" min="5" max="30" step="5"
            name="time" value="${data.timeLimit}" /> <span>sec</span>
          <br />
          <br />
          <label for="time-limit-enabled">
            <span>Enabled</span>
            <input type="checkbox" name="time-off" id="time-limit-enabled"
              ${data.timeLimitEnabled ? "checked" : ""} />
          </label>
        </section>
        <br />
        <button id="home-btn">Home</button>
        <button id="save-settings-btn">Save</button>
        <button id="default-settings-btn">Default</button>
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
    const content = document.createElement("div");
    content.id = "quiz-groups-page";
    content.innerHTML = `
      <header>
        <h2>AQ-logo</h2>        
      </header>
      <main>
        <div>
          <button id="home-page-btn">Home</button>          
          <span>Groups</span>
          <button>Score</button>  
        </div>
        <ul>
          <li>
            <div class="group-card" style="background-color: aquamarine">
              <h3>Group 1</h3>
              <p>7/10</p>
              <img src="./assets/img/default100.jpg" alt="Group cover" />
            </div>
          </li>
          <li>
            <div class="group-card" style="background-color: aquamarine">
              <h3>Group 1</h3>
              <p>7/10</p>
              <img src="./assets/img/default100.jpg" alt="Group cover" />
            </div>
          </li>
          <li>
            <div class="group-card" style="background-color: aquamarine">
              <h3>Group 1</h3>
              <p>7/10</p>
              <img src="./assets/img/default100.jpg" alt="Group cover" />
            </div>
          </li>
          <li>
            <div class="group-card" style="background-color: aquamarine">
              <h3>Group 1</h3>
              <p>7/10</p>
              <img src="./assets/img/default100.jpg" alt="Group cover" />
            </div>
          </li>
        </ul>        
      </main>`;
    return content;
  }
}

/* Controler */

class AppController {
  constructor() {
    this.view = new View();
    // this.model = new AppModel();
    this.settings = new AppSettings();
  }

  init() {
    this.getHomePage();
  }

  render(pageNode) {
    const viewPort = document.querySelector("#app");
    viewPort.innerHTML = "";
    viewPort.appendChild(pageNode);
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
    btnArtistsQuiz.addEventListener("click", this.getArtistsQuizPage);
    const btnPaintingsQuiz = pageNode.querySelector("#paintings-quiz-btn");
    btnPaintingsQuiz.addEventListener("click", this.getPaintingsQuizPage);
    //
    this.render(pageNode);
  };

  getArtistsQuizPage = () => {
    // Create page basic layout
    const pageNode = this.view.createGroupsPage();
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.getHomePage);
    //
    this.render(pageNode);
  };

  getPaintingsQuizPage = () => {
    // Create page basic layout
    const pageNode = this.view.createGroupsPage();
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.getHomePage);
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
    const timeLimit = pageNode.querySelector("#time-limit");
    timeLimit.addEventListener("change", (e) => {
      this.playSound(1);
      if (e.target.value < 5) {
        e.target.value = 5;
      } else if (e.target.value > 30 || e.target.value === "") {
        e.target.value = 30;
      }
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
