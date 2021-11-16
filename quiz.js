/// Quiz classes ///

class QuizFactory {
  create(type) {
    if (type === "artist") {
      return new Quiz();
    }
    if (type === "painting") {
      return new Quiz();
    }
  }
}

class QuizConstructor {
  constructor() {}

  play(groupNum) {
    return;
  }
}

class Quiz {
  constructor() {}
}

/// App settings class ///

class AppSettings {
  constructor() {
    // pass
  }

  get volume() {}
  set volume(value) {}

  turnOffVolume() {}

  get timer() {}
  set timer(value) {
    // 5 - 30 sec, 5s gap
  }

  turnOffTimer() {
    this.timer = 0;
  }
}

const settings = new AppSettings();
