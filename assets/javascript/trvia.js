/////////////////////////////////////////////
// Initialize Global Variables
/////////////////////////////////////////////
let triviaList = [],
  triviaStep = 0,
  answer = '',
  timer = 31,
  questions = 10,
  isTimerRunning = false,
  timerID = '',
  score = 0;

/////////////////////////////////////////////
// Algorithmn for shuffling array
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

function convertHTMLEntity(text) {
  const span = document.createElement('span');

  return text.replace(/&[#A-Za-z0-9]+;/gi, (entity, position, text) => {
    span.innerHTML = entity;
    return span.innerText;
  });
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
    // pass the token and the desried number of trivia to get to the getTriviaList function
    getTriviaList(response.token, 10);
  });
}

function getTriviaList(token, numberOfTrivia) {
  // pass token into the URL of API
  var theURL =
    'https://opentdb.com/api.php?amount=' +
    numberOfTrivia +
    '&category=9&difficulty=easy&token=' +
    token;
  $.ajax({
    url: theURL,
    method: 'GET',
  }).then(function(response) {
    // show first trivia on first load
    showTriviaOnScreen(response.results[triviaStep]);

    // save trivia list into a variable
    triviaList = response.results;
  });
}

function showTriviaOnScreen(triviaItem) {
  // empty container first
  $('#status').empty();
  $('#trivia').empty();
  $('#choices').empty();

  // reset and start timer again
  timer = 31;
  timerStart();

  // display the trivia question
  $('#trivia').append("<p class='lead'>" + triviaItem.question + '</p>');

  // update answer
  answer = triviaItem.correct_answer;

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

  // show game status
  //$('#timer').text(timer);
  $('#score').text(score);
  $('#questCount').text(questions);
  // incremet triviaStep to move on to next question
  questions--;
  triviaStep++;
}

function nextTrivia() {
  // check if we still have trivia unanswered
  if (triviaStep < triviaList.length) {
    showTriviaOnScreen(triviaList[triviaStep]);
  } else {
    // no more trivia
    console.log('no more trivia');

    // stop the timer
    isTimerRunning = false;
    clearInterval(timerID);

    // show game score and play again button
    $('#trivia').empty();
    $('#choices').empty();
    if (score > triviaList.length / 2) {
      $('#status').append('<h1>Well done!</h1>');
      $('#status').append(
        '<p>You answered ' +
          score +
          ' out of ' +
          triviaList.length +
          ' correctly.</p>',
      );
    } else {
      $('#status').append('<h1>Game Over!</h1>');
      $('#status').append(
        '<p>You only got ' +
          score +
          ' out of ' +
          triviaList.length +
          ' correctly.</p>',
      );
    }
    $('#status').append(
      "<button id='reload-game' class='btn btn-info'>Another One!</button>",
    );
  }
}

/////////////////////////////////////////////
// The onClick Functions
/////////////////////////////////////////////
function isCorrect(event) {
  if (convertHTMLEntity(answer) == convertHTMLEntity(event)) {
    console.log('you got it');
    return true;
  }
  console.log('not correct');
  return false;
}

function gameTime(event) {
  console.log(triviaList);
  console.log(triviaStep);
  console.log(triviaList.length);
  console.log(triviaList[triviaStep]);
  console.log(answer);
  console.log('converted answer: ' + convertHTMLEntity(answer));
  console.log('this.html = ' + $(this).html());

  // stop the timer
  isTimerRunning = false;
  clearInterval(timerID);

  // reset and start timer again
  timer = 31;
  timerStart();

  if (isCorrect($(this).html())) {
    // increment score then show next trivia
    score++;
    nextTrivia();
  } else {
    // show incorrect screen then next trivia
    nextTrivia();
  }
}

function resetGame() {
  // reset score, timer and question count
  score = 0;
  timer = 31;
  questions = 10;

  // reload browser
  window.location.reload(true);
}

function timerStart() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    timerID = setInterval(updateTimerDisplay, 1000);
  }
}

function updateTimerDisplay() {
  timer--;

  if (timer <= 0) {
    // stop the timer
    isTimerRunning = false;
    clearInterval(timerID);

    nextTrivia();
  }

  $('#timer').text(timer);
}
/////////////////////////////////////////////
// Start this shit up!
/////////////////////////////////////////////
getTriviaWithToken();
$(document).on('click', '.choices-style', gameTime);
$(document).on('click', '#reload-game', resetGame);
