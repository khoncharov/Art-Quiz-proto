// export class AppState {
class AppState {
  constructor() {
    this.page_1 = false;
    this.page_2 = false;
    this.page_3 = false;
    this.page_4 = false;
  }

  show(page) {
    for (let item of this) {
      console.log(item);
    }
    // homePageVisible: true,
    // settingsVisible: false,
    // quizCategoryVisible: false,
  }
}

const x = new AppState();

x.show();
