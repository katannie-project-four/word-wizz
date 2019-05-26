//NAMESPACE: To keep app contained
const wizApp = {}

// =============== GLOBAL STATES  =============== //
wizApp.guessedWords = [];
wizApp.totalScore = [];
wizApp.currentRoundNum = 0;
wizApp.nextRoundNum = 1;
wizApp.category = [
  // ANIMALS
  [
    { //chicken
      type: `Chicken`,
      words: [`kfc`, `wing`],
      score: 0
    },
    { //cow
      type: `Cow`,
      words: [`steak`, `moo`],
      score: 0
    },
    { //fish
      type: `Fish`,
      words: [`wet`, `ocean`],
      score: 0
    }
  ]
];

// Animal References
wizApp.animalCategory = wizApp.category[0];
wizApp.chicken = wizApp.animalCategory[0];
wizApp.cow = wizApp.animalCategory[1];
wizApp.fish = wizApp.animalCategory[2];

wizApp.finalChickenWords = wizApp.chicken.words;
wizApp.finalCowWords = wizApp.cow.words;
wizApp.finalFishWords = wizApp.fish.words;

wizApp.chickenResultsAPI = [];
wizApp.cowResultsAPI = [];
wizApp.fishResultsAPI = [];


// =============== API CALLS  =============== //
//Keys needed for iterating through the four different endpoints
wizApp.wordTypeKey = [`rel_jjb=`, `rel_jja=`, `rel_trg=`, `ml=`];

// Function to filter through array to remove duplicate words
wizApp.uniqueArr = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) >= index;
  })
};

wizApp.getWords = (wordType, animal) => {
return $.ajax ({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: `json`,
    method: `GET`
  })
};

// Chicken API call
wizApp.compiledChickenArray = [];
for (let i = 0; i <= 3; i++) {
  chickenResultsAPI = [];
  wizApp.chickenResultsAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `chicken`));
}
$.when(...wizApp.chickenResultsAPI).then((...chickenWords) => {
  const pulledArray = chickenWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(chick => {
      wizApp.compiledChickenArray.push(chick.word);
    });
  }
  cleanChickenResultsAPI = wizApp.uniqueArr(wizApp.compiledChickenArray);
  wizApp.chicken.words.push(...cleanChickenResultsAPI);
});


// Cow API call
wizApp.compiledCowResultsAPI = [];
for (let i = 0; i <= 3; i++) {
  wizApp.cowResultsAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `cow`));
}
$.when(...wizApp.cowResultsAPI).then((...cowWords) => {
  const pulledArray = cowWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(cow => {
      wizApp.compiledCowResultsAPI.push(cow.word);
    });
  }
  cleanCowResultsAPI = wizApp.uniqueArr(wizApp.compiledCowResultsAPI);
  wizApp.cow.words.push(...cleanCowResultsAPI);
});


// Fish API call
wizApp.compiledFishResultsAPI = [];
for (let i = 0; i <= 3; i++) {
  wizApp.fishResultsAPI.push(wizApp.getWords(wizApp.wordTypeKey[i], `fish`));
}
$.when(...wizApp.fishResultsAPI)
  .then((...fishWords) => {
    const pulledArray = fishWords.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((fish) => {
        wizApp.compiledFishResultsAPI.push(fish.word)
      });
    }
    cleanFishResultsAPI = wizApp.uniqueArr(wizApp.compiledFishResultsAPI);
    wizApp.fish.words.push(...cleanFishResultsAPI)
  });


// =============== GAME FUNCTIONS  =============== //

//Form to handle user's guesses
wizApp.handleSubmit = (animalCategoryay, animalScore) => {
  console.log(`round starting ${wizApp.currentRoundNum}`);
  // grabs the user's input
  let userInput = $(`input`).val().toLowerCase();
  //reset input field to nothing after user submits
  $(`input`).val(``);
  //check user's guess against current list and if correct, add one
  if (animalCategoryay.includes(userInput) && !wizApp.guessedWords.includes(userInput)) {
      animalScore.score += 1;
      wizApp.guessedWords.push(userInput);
    //append correct guesses and colour them green
    $(`.user-guesses`).append(`<li class="correct">${userInput}</li>`);
    //update score .;[]
    $(`.score-counter`).html(`<p>${animalScore.score}</p>`);
  } else {
    //if inputs do not match, still append but leave red
    $(`.user-guesses`).append(`<li>${userInput}</li>`);
  }
};

// Set-up for cycling through the rounds
wizApp.round = () => {
  $(`.intro-screen`).addClass(`hide`);
  $(`.game-play-screen`).removeClass(`hide`);
  $(`.game-center`).removeClass(`hide`);
  wizApp.currentRoundNum += 1;
  wizApp.nextRoundNum += 1;
  $(`h2 span`).html(`${wizApp.currentRoundNum}`);
  if (wizApp.currentRoundNum === 1) {
    wizApp.displayGameCountdown(wizApp.chicken);
  } else if (wizApp.currentRoundNum === 2) {
    wizApp.displayGameCountdown(wizApp.cow);
  } else if (wizApp.currentRoundNum === 3) {
    wizApp.displayGameCountdown(wizApp.fish);
  };
};

// Countdown screen for each round
wizApp.displayGameCountdown = animalObj => {
  $(`.score-counter`).html(`<p>${animalObj.score}</p>`);
  $(`.countdown-overlay`).removeClass(`hide`);
  //reset input field to nothing before each round
  $(`input`).val(``);
  let timeLeft = 3;
  let timer = setInterval(function() {
    $(`.three-sec-timer`).html(timeLeft);
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 3;
      wizApp.playGame(animalObj);
      window.clearInterval(timer);
      $(`.three-sec-timer`).html(``);
    }
    //run the timer at 1 sec intervals
  }, 1000);
};

// Play the game
wizApp.playGame = animalObj => {
  $(`.category-word`).html(`${animalObj.type}`);
  $(`.countdown-overlay`).addClass(`hide`);
  //start timer for the game rounds
  let timeLeft = 20;
  let timer = setInterval(function() {
    $(`.play-timer`).html(timeLeft);
    timeLeft -= 1;
    if (timeLeft === 0) {
      $(`.game-play-screen`).addClass(`hide`);
      window.clearInterval(timer);
      $(`.play-timer`).html(``);
      wizApp.displayRoundResultScreen(animalObj);
      //reset the guessedWords to an empty array for next round
      wizApp.guessedWords = [];
    }
  }, 1000);
};

// Display user score for the round
wizApp.displayRoundResultScreen = (animalObj) => {
  //update values and display round results
  $(`.round-result-screen p span`).html(`${animalObj.score}`);
  wizApp.totalScore.push(animalObj.score);
  $(`h2 span`).html(`${wizApp.currentRoundNum}`);
  if (wizApp.currentRoundNum === 3) {
    $(`.next-round-btn`).html(`Go to your results!`).on(`click`, function () {
      wizApp.displayTotalScoreScreen();
    });
  } else {
    $(`.next-round-btn span`).html(`${wizApp.nextRoundNum}`);
  }
  $(`.round-result-screen`).removeClass(`hide`);
  $(`form`).attr(`id`, `round-${wizApp.nextRoundNum}`)
}

// Display final user score
wizApp.displayTotalScoreScreen = () => {
  $(`.final-result-screen`).removeClass(`hide`);
  $(`.game-center`).addClass(`hide`);
  const sum = wizApp.totalScore.reduce((total, a) => total + a, 0);
  $(`p span`).html(`${sum}`);
};

// Event listeners for game functionality
wizApp.eventListeners = () => {
  // Start the first round on click of start button
  $(`.start-btn`).on(`click`, function () {
    wizApp.round();
  });
  // If user is on rounds 1 or 2, go to next round
  if (wizApp.currentRoundNum < 3) {
    $(`.next-round-btn`).on(`click`, function () {
      $(`.round-result-screen`).addClass(`hide`);
      $(`li`).addClass(`hidden`);
      wizApp.round();
    });
  } // If on final round (3), go to the final results score screen
  else if (wizApp.currentRoundNum === 3) {
    $(".next-round-btn").on("click", function() {
      console.log("end gamebtn being clicked");
      $(".game-center").addClass("hide");
      $(".game-play-screen").addClass("hide");
      $(".round-result-screen").addClass("hide");
      $(".final-result-screen").removeClass("hide");
      wizApp.displayTotalScoreScreen();
    });
  };
   
  // Form handling for user user guesses
  $(`form`).on(`submit`, function (event) {
    // Prevent the default behaviour
    event.preventDefault();
    const round = event.target.id;
    if (round === `round-one`) {
      wizApp.handleSubmit(wizApp.finalChickenWords, wizApp.chicken);
    } else if (round === `round-2`) {
      wizApp.handleSubmit(wizApp.finalCowWords, wizApp.cow);
    } else {
      wizApp.handleSubmit(wizApp.finalFishWords, wizApp.fish);
    } 
  });

  // Reset the game when play again button is clicked
  $(`.play-again-btn`).on(`click`, function() {
    console.log(`clicked reset btn`);
    window.location.reload();
  });
};

// Initialise the game
wizApp.init = () => {
  wizApp.eventListeners();
};

// DOC READY: Only run when DOM elements have loaded
$(function () {
  wizApp.init();
});
