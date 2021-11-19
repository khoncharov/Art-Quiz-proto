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
    return new Quiz();
  }
}

class Quiz {
  constructor(groupNum) {
    this.group = groupNum;
  }
}
