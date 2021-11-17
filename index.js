/* Modedl */

// import { AppState } from "./js/app-states";

class AppModel {}

class AppSettings {}

/* View */

class View {
  constructor() {
    // this.appState = new AppState();
    this.currentPage = null;
  }

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

  createSettingsPage() {
    const content = document.createElement("div");
    content.id = "settings-page";
    content.innerHTML = `
      <main>
        <h2>Settings</h2>
        <section>
          <h3>Volume</h3>
          <label for="vol-off">
            <span>Turn off volume</span>
            <input type="checkbox" name="vol-off" id="vol-off" />
          </label>
          <br />
          <input type="range" name="volume" min="0" max="100" step="5" />
        </section>
        <section>
          <h3>Time limit in seconds</h3>
          <label for="time-off">
            <span>Turn off time limit</span>
            <input type="checkbox" name="time-off" id="time-off" />
          </label>
          <br />
          <input type="number" name="time" id="time" min="5" max="30" step="5" />
        </section>
        <br />
        <button id="cancel-btn">Cancel</button>
        <button>Save</button>
        <button>Default</button>
      </main>`;
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
    this.view.currentPage = this.view.createHomePage();
    this.render();
  }

  render() {
    const viewPort = document.querySelector("#app");
    viewPort.innerHTML = "";
    const pageNode = this.view.currentPage;
    this.addPageEvents(pageNode);
    viewPort.appendChild(pageNode);
  }

  btnHandlerHome = () => {
    this.view.currentPage = this.view.createHomePage();
    this.render();
  };
  btnHandlerArtistsQuiz = () => {
    this.view.currentPage = this.view.createGroupsPage();
    this.render();
  };
  btnHandlerPaintingsQuiz = () => {
    this.view.currentPage = this.view.createGroupsPage();
    this.render();
  };
  btnHandlerSettings = () => {
    this.view.currentPage = this.view.createSettingsPage();
    this.render();
  };

  addPageEvents(pageNode) {
    if (pageNode.id === "home-page") {
      // Home page events
      const btnSettings = pageNode.querySelector("#settings-btn");
      btnSettings.addEventListener("click", this.btnHandlerSettings);
      const btnArtistsQuiz = pageNode.querySelector("#artists-quiz-btn");
      btnArtistsQuiz.addEventListener("click", this.btnHandlerArtistsQuiz);
      const btnPaintingsQuiz = pageNode.querySelector("#paintings-quiz-btn");
      btnPaintingsQuiz.addEventListener("click", this.btnHandlerPaintingsQuiz);
    } else if (pageNode.id === "settings-page") {
      // Settings page events
      const btnCancel = pageNode.querySelector("#cancel-btn");
      btnCancel.addEventListener("click", this.btnHandlerHome);
    } else if (pageNode.id === "quiz-groups-page") {
      // Quiz groups page events
      const btnHome = pageNode.querySelector("#home-page-btn");
      btnHome.addEventListener("click", this.btnHandlerHome);
    }
  }
}

/* Run application */

const app = new AppController();
app.init();
