/////////////////////////////////////////////
// Initialize Global Variables
/////////////////////////////////////////////
let triviaList = {},
  trivia = '',
  choices = [],
  score = 0;

/////////////////////////////////////////////
// Algorithmns
/////////////////////////////////////////////
function shuffleArray(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/////////////////////////////////////////////
// Data Manipulation Functions
/////////////////////////////////////////////
function getTriviaWithToken() {
  // get token first to trivia won't repeat per session (6hrs)
  $.ajax({
    url: 'https://opentdb.com/api_token.php?command=request',
    method: 'GET',
  }).then(function(response) {
    // pass the token to the getTriviaList function
    getTriviaList(response.token);
  });
}

function getTriviaList(token) {
  // get a list of trivia
  var theURL =
    'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&token=' +
    token;
  $.ajax({
    url: theURL,
    method: 'GET',
  }).then(function(response) {
    //this is where the trivia list response is

    // pass every item in an array but need to time this out later
    showTriviaOnScreen(response.results[0]);
  });
}

function showTriviaOnScreen(triviaItem) {
  // display the trivia question
  $('#trivia').append("<p class='lead'>" + triviaItem.question + '</p>');

  // push choices into an array
  var choicesArr = [];
  choicesArr.push(triviaItem.correct_answer);
  for (i in triviaItem.incorrect_answers) {
    choicesArr.push(triviaItem.incorrect_answers[i]);
  }

  // shuffle the array so that the answer is not alway the first one to show
  var newChoices = shuffleArray(choicesArr);

  // show the new array on screen
  for (i in newChoices) {
    $('#choices').append("<p class='choices-style'>" + newChoices[i] + '</p>');
  }
}

getTriviaWithToken();
