let qfactory = new QuizFactory();
let aquiz = qfactory.createArtistsQuiz();
let pquiz = qfactory.createPaintingQuiz();

let group = 0;
let t = 7;
// - pause -
aquiz.generateNewQuiz(group);
pquiz.generateNewQuiz(group);

aquiz.getTaskQuestion(1);
aquiz.getTaskOptions(1);
// quizProgress => progress
