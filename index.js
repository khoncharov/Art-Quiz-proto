/* Modedl */

// --- Quiz results class
class QuizResults {
  constructor() {}
}
// --- End of class

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
// --- End of class

// --- Quiz model class
class AppModel {
  constructor() {}
}
// --- End of class

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
        <a href="https://github.com/khoncharov/">My Githup</a>
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
      <main>
        <h2>Settings</h2>
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
        <button>Score</button>
        <span>Groups</span>
        <button id="home-page-btn">Home</button>
      </header>
      <main>
        <!-- Looks like array -->
        <div class="group-card" style="background-color: aquamarine">
          <h3>Group 1</h3>
          <p>7/10</p>
          <img src="./assets/img/default100.jpg" alt="Group cover" />
        </div>
        <div class="group-card" style="background-color: aquamarine">
          <h3>Group 10</h3>
          <p>-/10</p>
          <img src="./assets/img/default100.jpg" alt="Group cover" />
        </div>
      </main>`;
    return content;
  }
}

/* Controler */

class AppController {
  constructor() {
    this.view = new View();
    this.model = new AppModel();
    this.settings = new AppSettings();
  }

  init() {
    this.btnHandlerHome();
  }

  render(pageNode) {
    const viewPort = document.querySelector("#app");
    viewPort.innerHTML = "";
    viewPort.appendChild(pageNode);
  }

  // User actions handlers
  //
  btnHandlerHome = () => {
    // Create page basic layout
    const pageNode = this.view.createHomePage();
    // Add page events
    const btnSettings = pageNode.querySelector("#settings-btn");
    btnSettings.addEventListener("click", this.btnHandlerSettings);
    const btnArtistsQuiz = pageNode.querySelector("#artists-quiz-btn");
    btnArtistsQuiz.addEventListener("click", this.btnHandlerArtistsQuiz);
    const btnPaintingsQuiz = pageNode.querySelector("#paintings-quiz-btn");
    btnPaintingsQuiz.addEventListener("click", this.btnHandlerPaintingsQuiz);
    //
    this.render(pageNode);
  };
  btnHandlerArtistsQuiz = () => {
    // Create page basic layout
    const pageNode = this.view.createGroupsPage();
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.btnHandlerHome);
    //
    this.render(pageNode);
  };
  btnHandlerPaintingsQuiz = () => {
    // Create page basic layout
    const pageNode = this.view.createGroupsPage();
    // Add page events
    const btnHome = pageNode.querySelector("#home-page-btn");
    btnHome.addEventListener("click", this.btnHandlerHome);
    //
    this.render(pageNode);
  };

  btnHandlerSettings = () => {
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
        this.playSound("click");
      }
    });
    const volume = pageNode.querySelector("#volume-level");
    volume.addEventListener("change", (e) => {
      this.changePageVolume(document, e.target.value);
      this.playSound("snap");
    });
    const timeLimit = pageNode.querySelector("#time-limit");
    timeLimit.addEventListener("change", (e) => {
      if (e.target.value < 5) {
        e.target.value = 5;
      } else if (e.target.value > 30 || e.target.value === "") {
        e.target.value = 30;
      }
    });
    const btnHome = pageNode.querySelector("#home-btn");
    btnHome.addEventListener("click", this.btnHandlerHome);
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
  playSound(name) {
    switch (name) {
      case "click":
        document.getElementsByTagName("audio")[0].play();
        break;
      case "snap":
        document.getElementsByTagName("audio")[1].play();
        break;
    }
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
