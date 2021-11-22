/* Model */

// --- Quiz classes

export class QuizFactory {
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

class Task {
  constructor(taskInfo, options) {
    this.data = taskInfo;
    this.options = options;
  }

  getAuthor() {
    return this.data.author;
  }

  getPaintingName() {
    return this.data.name;
  }

  getPaintingYear() {
    return this.data.year;
  }

  getImgNum() {
    return this.data.imageNum;
  }

  getOptions() {
    return this.options;
  }
}

class Quiz {
  constructor(data) {
    this.tasks = null;
    this.data = data;
    this.quizProgress = null;
    this.currentTask = 0;
  }

  getNewQuiz(group, category) {
    const tasks = [];
    for (let i = 0; i < 10; i++) {
      const index = this.getTaskRecordIndex(i, group, category);
      const taskRec = this.data.image[index];
      const taskOptions = this.generateTaskOptions(taskRec);
      tasks.push(new Task(taskRec, taskOptions));
    }
    this.tasks = {
      task: tasks,
    };
    this.resetProgress();
  }

  generateTaskOptions(taskRec) {
    // taskRec -> task record index in db
    const taskId = +taskRec.imageNum;
    const options = [taskId];
    while (options.length < 4) {
      const num = Math.floor(Math.random() * 241);
      const isNewValue = (i) => !options.includes(i);
      const isNewAuthor = (i) => {
        return this.data.image[taskId].author !== this.data.image[i].author;
      };
      if (isNewValue(num) && isNewAuthor(num)) {
        options.push(num);
      }
    }
    shuffle(options);
    return options;
  }

  resetProgress() {
    this.currentTask = 0;
    this.quizProgress = new Array(10).fill(-1);
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

  getTaskRecordIndex = (taskIndex, groupIndex, categoryIndex) => {
    const tasksPerGroup = 10;
    const groupsPerCategory = 12;
    return (
      taskIndex +
      groupIndex * tasksPerGroup +
      categoryIndex * groupsPerCategory * tasksPerGroup
    );
  };
}

class ArtistsQuiz extends Quiz {
  constructor(data) {
    super(data);
  }

  generateNewQuiz(group) {
    this.getNewQuiz(group, 0);
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

  generateNewQuiz(group) {
    this.getNewQuiz(group, 1);
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

// --- Quiz results class

export class QuizResults {
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

// --- Application settings class

export class AppSettings {
  constructor() {
    this._options = JSON.parse(localStorage.getItem("options")) ?? {
      soundsEnabled: false,
      volume: "1", // 0 - 1
      timeLimitEnabled: false,
      timeLimit: "30", // [5 - 30] step 5 seconds
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

// Functions

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
