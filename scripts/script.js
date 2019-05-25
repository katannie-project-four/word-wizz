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
      words: [`kfc`],
      score: 0
    },
    { //cow
      type: `Cow`,
      words: [`steak`],
      score: 0
    },
    { //fish
      type: `Fish`,
      words: [`wet`],
      score: 0
    }
  ]
];

//Animal Reference
wizApp.animalCategory = wizApp.category[0];
wizApp.chicken = wizApp.animalCategory[0];
wizApp.cow = wizApp.animalCategory[1];
wizApp.fish = wizApp.animalCategory[2];

wizApp.finalChickenWords = wizApp.chicken.words;
wizApp.finalCowWords = wizApp.cow.words;
wizApp.finalFishWords = wizApp.fish.words;

wizApp.chickenArr = [];
wizApp.cowArr = [];
wizApp.fishArr = [];


// =============== API CALLS  =============== //
//Keys needed for iterating through the four different endpoints
wizApp.wordTypeKey = [`rel_jjb=`, `rel_jja=`, `rel_trg=`, `ml=`];

// Filter Function through array to remove duplicate words
wizApp.uniqueArr = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) >= index;
  });
};

wizApp.getWords = (wordType, animal) => {
  return $.ajax({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: `json`,
    method: `GET`
  })
}


//Chicken API call
wizApp.compiledChickenArr = [];
for (let i = 0; i <= 3; i++) {
  chickenArr = [];
  wizApp.chickenArr.push(wizApp.getWords(wizApp.wordTypeKey[i], `chicken`));
}
$.when(...wizApp.chickenArr).then((...chickenWords) => {
  const pulledArray = chickenWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(chick => {
      wizApp.compiledChickenArr.push(chick.word);
    });
  }
  cleanChickenArr = wizApp.uniqueArr(wizApp.compiledChickenArr);
  wizApp.chicken.words.push(...cleanChickenArr);
});


//Cow API call
wizApp.compiledCowArr = [];
for (let i = 0; i <= 3; i++) {
  wizApp.cowArr.push(wizApp.getWords(wizApp.wordTypeKey[i], `cow`));
}
$.when(...wizApp.cowArr).then((...cowWords) => {
  const pulledArray = cowWords.map(word => {
    return word[0];
  });
  for (i = 0; i <= 3; i++) {
    pulledArray[i].forEach(cow => {
      wizApp.compiledCowArr.push(cow.word);
    });
  }
  cleanCowArr = wizApp.uniqueArr(wizApp.compiledCowArr);
  wizApp.cow.words.push(...cleanCowArr);
});


//Fish API call
wizApp.compiledFishArr = [];
for (let i = 0; i <= 3; i++) {
  wizApp.fishArr.push(wizApp.getWords(wizApp.wordTypeKey[i], `fish`));
}
$.when(...wizApp.fishArr)
  .then((...fishWords) => {
    const pulledArray = fishWords.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((fish) => {
        wizApp.compiledFishArr.push(fish.word)
      });
    }
    cleanFishArr = wizApp.uniqueArr(wizApp.compiledFishArr);
    wizApp.fish.words.push(...cleanFishArr)
  });


// =============== GAME FUNCTIONS  =============== //

//Form to handle user's guesses
wizApp.handleSubmit = (animalCategoryay, animalScore) => {
  // grabs the user's input
  let userInput = $(`input`).val().toLowerCase();
  //reset input field to nothing
  $(`input`).val(``);
    //check user`s guess against current list and if correct, add one
    if (
      animalCategoryay.includes(userInput) &&
      !wizApp.guessedWords.includes(userInput)
    ) {
      animalScore.score += 1;
      wizApp.guessedWords.push(userInput);

    //append correct guesses and colour them green
    $(`.user-guesses`).append(`<li class="correct">${userInput}</li>`);
    //update score .;[]
    $(`.score-counter`).html(`<p>${animalScore.score}</p>`)
  } else {
    //if inputs do not match, still append but leave red
    $(`.user-guesses`).append(`<li>${userInput}</li>`)
  }
};

// Start Game
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
  }
}

// Countdown for each round
wizApp.displayGameCountdown = animalObj => {
  $(`.score-counter`).html(`<p>${animalObj.score}</p>`);
  $(`.countdown-overlay`).removeClass(`hide`);
  let timeLeft = 1;
  let timer = setInterval(function() {
    $(`.three-sec-timer`).html(timeLeft);
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 1;
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
  //start 20second timer
  let timeLeft = 30;
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
  // Add code to change id on form here
}

wizApp.displayTotalScoreScreen = () => {
  $(`.final-result-screen`).removeClass(`hide`);
  $(`.game-center`).addClass(`hide`);
  const sum = wizApp.totalScore.reduce((total, a) => total + a, 0);
  $(`p span`).html(`${sum}`);
};

wizApp.eventListeners = () => {

  $(`.start-btn`).on(`click`, function () {
    wizApp.round();
  });

  //reset the game
  $(`.play-again-btn`).on(`click`, function() {
    console.log(`clicked reset btn`);
    window.location.reload();
  });

 if (wizApp.currentRoundNum < 3) {
    $(`.next-round-btn`).on(`click`, function () {
      $(`.round-result-screen`).addClass(`hide`);
      $(`li`).addClass(`hidden`);
      wizApp.round();
    });
  } 
  else if (wizApp.currentRoundNum === 3) {
    $(".next-round-btn").on("click", function() {
      console.log("end gamebtn being clicked");
      $(".game-center").addClass("hide");
      $(".game-play-screen").addClass("hide");
      $(".round-result-screen").addClass("hide");
      $(".final-result-screen").removeClass("hide");
      wizApp.displayTotalScoreScreen();
    });
  }

   
  //form handling user guesses
  $(`form`).on(`submit`, function (event) {
    // prevent the default behaviour
    event.preventDefault();

    const round = event.target.id;
    if (round === `round-one`) {
      wizApp.handleSubmit(wizApp.finalChickenWords, wizApp.chicken);
    } else if (round === `round-2`) {
      wizApp.handleSubmit(wizApp.finalCowWords, wizApp.cow);
    } else {
      wizApp.handleSubmit(wizApp.finalFishWords, wizApp.fish);
    } 
  })
}

wizApp.init = () => {
  wizApp.eventListeners();
}

// DOC READY: Initialise quiz when DOM is ready and loaded
$(function () {
  wizApp.init();
});
