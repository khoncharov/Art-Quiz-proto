/* View */

export class View {
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

  createGroupsPage(type) {
    // Cards list
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
    // Group caption
    let groupCaption;
    if (type === "artists") {
      groupCaption = "Художники";
    } else if (type === "paintings") {
      groupCaption = "Картины";
    }
    const content = document.createElement("div");
    content.id = "quiz-groups-page";
    content.innerHTML = `
      <header>               
        <nav class="navBar">
          <button class="uiBtn" id="home-page-btn">Назад</button>          
          <h2 class="pageCaption">${groupCaption}</h2>
          <button class="uiBtn hidden">Счёт</button>  
        </nav>
      </header>
      <main>
        <ul>
          ${groupList}                    
        </ul>        
      </main>`;
    return content;
  }

  createQuizAPage(settings) {
    const content = document.createElement("div");
    content.id = "quiz-contest-page";
    content.innerHTML = `
      <header class="header">
        <nav class="navBar">
          <button class="uiBtn" id="back-btn">Назад</button>
          <span class="timer ${settings.options.timeLimitEnabled ? "" : "hidden"}
            ">${settings.options.timeLimit}
          </span>
          <span class="taskCounter"></span>
        </nav>        
      </header>
      <div class="progressBar"></div>
      <main class="main">
        <section class="taskCard" id="quiz-task-0">
          <div class="taskQuestion-container">
            <h3 class="taskQuestion">***</h3>
          </div>
          <div class="taskOptionImg-container">
            <div id="option-img-0"></div>
            <div id="option-img-1"></div>
            <div id="option-img-2"></div>
            <div id="option-img-3"></div>            
          </div>          
        </section>
        <div class="overlay hidden"></div>
        <div class="result-container hidden" id="quiz-task-result">
          <div class="resultBadge failBadge"></div>
          <img class="resultImg" src="../assets/pic/full/12full.webp" alt="Painting" />
          <div class="paintingCaption">Девочка на шаре</div>
          <div class="paintingAthor">Пабло Пикассо, 1905</div>
          <button class="uiBtn" id="next-task">Продолжить</button>
        </div>
        <div class="result-container hidden" id="quiz-result">
          <div class="taskQuestion">Поздравляем!</div>
          <div class="taskQuestion">Ваш результат</div>
          <div class="quizResultBadge">
            <div class="quizScore">0</div>
          </div>
          <button class="uiBtn" id="finish-quiz">Продолжить</button>
        </div>
        
        <audio preload="auto">
          <source src="/assets/sounds/deafen.mp3" type="audio/mpeg">
        </audio>
        <audio preload="auto">
          <source src="/assets/sounds/joined.mp3" type="audio/mpeg">
        </audio>
        <audio preload="auto">
          <source src="/assets/sounds/t-notification.mp3" type="audio/mpeg">
        </audio>
      </main>`;
    return content;
  }

  createQuizPPage(settings) {
    const content = document.createElement("div");
    content.id = "quiz-contest-page";
    content.innerHTML = `
      <header class="header">
        <nav class="navBar">
          <button class="uiBtn" id="back-btn">Назад</button>
          <span class="timer ${settings.options.timeLimitEnabled ? "" : "hidden"}
            ">${settings.options.timeLimit}
          </span>
          <span class="taskCounter"></span>
        </nav>        
      </header>
      <div class="progressBar"></div>
      <main class="main">
        <section class="taskCard" id="quiz-task-0">
          <div class="taskQuestion-container">
            <h3 class="taskQuestion">Кто автор этой картины?</h3>
          </div>
          <div class="taskImg-container">
            <img class="taskImg" src="../assets/pic/img/2.webp" alt="Painting" />
          </div>
          <div class="taskBtn-container">
            <button class="taskBtn" id="option-btn-0"></button>
            <button class="taskBtn" id="option-btn-1"></button>
            <button class="taskBtn" id="option-btn-2"></button>
            <button class="taskBtn" id="option-btn-3"></button>
          </div>
        </section>
        <div class="overlay hidden"></div>
        <div class="result-container hidden" id="quiz-task-result">
          <div class="resultBadge failBadge"></div>
          <img class="resultImg" src="../assets/pic/full/12full.webp" alt="Painting" />
          <div class="paintingCaption">Девочка на шаре</div>
          <div class="paintingAthor">Пабло Пикассо, 1905</div>
          <button class="uiBtn" id="next-task">Продолжить</button>
        </div>
        <div class="result-container hidden" id="quiz-result">
          <div class="taskQuestion">Поздравляем!</div>
          <div class="taskQuestion">Ваш результат</div>
          <div class="quizResultBadge">
            <div class="quizScore">0</div>
          </div>
          <button class="uiBtn" id="finish-quiz">Продолжить</button>
        </div>

        <audio preload="auto">
          <source src="/assets/sounds/deafen.mp3" type="audio/mpeg">
        </audio>
        <audio preload="auto">
          <source src="/assets/sounds/joined.mp3" type="audio/mpeg">
        </audio>
        <audio preload="auto">
          <source src="/assets/sounds/t-notification.mp3" type="audio/mpeg">
        </audio>
      </main>`;
    return content;
  }
}
