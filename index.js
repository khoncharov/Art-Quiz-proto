/* Modedl */

// import { AppState } from "./js/app-states";

class AppModel {}

class AppSettings {}

/* View */

class View {
  constructor() {
    // this.appState = new AppState();
  }

  showHomePage() {
    const content = document.createElement("div");
    content.innerHTML = `
      <header>
        <h1>Art-Quiz</h1>
      </header>
      <main>
        <button>Artists quiz</button>
        <br />
        <br />
        <button>Paintings quiz</button>
        <br />
        <br />
        <button>Settings</button>
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

  showSettingsPage() {
    const content = document.createElement("div");
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
        <button>Cancel</button>
        <button>Save</button>
        <button>Default</button>
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

  run() {
    this.render(this.view.showHomePage());
    this.render(this.view.showSettingsPage());
  }

  render(page) {
    const viewPort = document.querySelector("#app");
    viewPort.innerHTML = "";
    viewPort.appendChild(page);
  }
}

/* App init */

const app = new AppController();
app.run();
