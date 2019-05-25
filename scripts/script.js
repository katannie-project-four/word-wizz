
const wizzApp = {}

wizzApp.category = [
  // ANIMALS
  [
    // CHICKEN
    {
      type: 'Chicken',
      wordsArr: [],
      score: 0
    },
    // COW
    {
      type: 'Cow',
      wordsArr: [],
      score: 0
    },
    // FISH
    {
      type: 'Fish',
      wordsArr: [],
      score: 0
    }
  ]
]

wizzApp.totalScore = [];
// ALL OUR ANIMAL STUFF
wizzApp.animalArr = wizzApp.category[0];
wizzApp.chickenObj = wizzApp.animalArr[0];
wizzApp.cowObj = wizzApp.animalArr[1];
wizzApp.fishObj = wizzApp.animalArr[2];

wizzApp.finalChickenWordsArr = wizzApp.chickenObj.wordsArr;
wizzApp.finalCowWordsArr = wizzApp.cowObj.wordsArr;
wizzApp.finalFishWordsArr = wizzApp.fishObj.wordsArr;



// FILTER THROUGH ARRAY TO REMOVE DUPLICATES
wizzApp.uniqueArr = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) >= index;
  });
};

wizzApp.wordTypeKey = ['rel_jjb=', 'rel_jja=', 'rel_trg=', 'ml='];

wizzApp.chickenObjArr = [];
wizzApp.cowObjArr = [];
wizzApp.fishObjArr = [];

wizzApp.getWords = (wordType, animal) => {
  return $.ajax({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: 'json',
    method: 'GET'
  })
}

for (let i = 0; i <= 3; i++) {
  wizzApp.chickenObjArr.push(wizzApp.getWords(wizzApp.wordTypeKey[i], 'chicken'));

}

for (let i = 0; i <= 3; i++) {
  wizzApp.cowObjArr.push(wizzApp.getWords(wizzApp.wordTypeKey[i], 'cow'));

}

for (let i = 0; i <= 3; i++) {
  wizzApp.fishObjArr.push(wizzApp.getWords(wizzApp.wordTypeKey[i], 'fish'));

}


wizzApp.compiledChickenArr = [];

$.when(...wizzApp.chickenObjArr)
  .then((...chickenWordsArr) => {
    const pulledArray = chickenWordsArr.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((chick) => {
        wizzApp.compiledChickenArr.push(chick.word)
      });
    }
    cleanChickenArr = wizzApp.uniqueArr(wizzApp.compiledChickenArr);
    wizzApp.chickenObj.wordsArr.push(...cleanChickenArr)
  });


wizzApp.compiledCowArr = [];

$.when(...wizzApp.cowObjArr)
  .then((...cowWordsArr) => {
    const pulledArray = cowWordsArr.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((cow) => {
        wizzApp.compiledCowArr.push(cow.word)
      });
    }
    cleanCowArr = wizzApp.uniqueArr(wizzApp.compiledCowArr);
    wizzApp.cowObj.wordsArr.push(...cleanCowArr)
  });

wizzApp.compiledFishArr = [];

$.when(...wizzApp.fishObjArr)
  .then((...fishWordsArr) => {
    const pulledArray = fishWordsArr.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((fish) => {
        wizzApp.compiledFishArr.push(fish.word)
      });
    }
    cleanFishArr = wizzApp.uniqueArr(wizzApp.compiledFishArr);
    wizzApp.fishObj.wordsArr.push(...cleanFishArr)
  });


// === GAME ===//

//Form
wizzApp.handleSubmit = (animalArray, animalScore) => {
  // grabs the user's input
  let userInput = $('input').val().toLowerCase();
  //reset input field to nothing
  $('input').val('');
  //check user's guess against current list and if correct, add one
  if (animalArray.includes(userInput)) {
    animalScore.score += 1;

    //append correct guesses and colour them green
    $('.user-guesses').append(`<li class="correct">${userInput}</li>`);
    //update score .;[]
    $('.score-counter').html(`<p>${animalScore.score}</p>`)
    console.log(animalScore)
  } else {
    //if inputs do not match, still append but leave red
    $('.user-guesses').append(`<li>${userInput}</li>`)
  }
};


// START GAME
wizzApp.currentRoundNum = 0;
wizzApp.nextRoundNum = 1;

// wizzApp.roundOne = () => {
//   $(`.intro-screen`).addClass(`hide`);
//   $(`.game-play-screen`).removeClass(`hide`);
//   $(`.game-center`).removeClass(`hide`);
//   // $(`.next-round-btn`).on(`click`, roundTwo());
//   wizzApp.playGameRound(wizzApp.chickenObj);
//   $('h2 span').html(`${wizzApp.currentRoundNum += 1}`);
// }

// wizzApp.roundTwo = () => {
//   $('h2 span').html(`${wizzApp.currentRoundNum += 1}`);
//   $('.game-play-screen').removeClass('hide');
//   // $('.round-result-scree').addClass('hide');
//   wizzApp.playGameRound(wizzApp.cowObj);

// }

// wizzApp.roundThree = () => {
//   wizzApp.playGameRound(wizzApp.fishObj);

// }

wizzApp.round = () => {
  $(`.intro-screen`).addClass(`hide`);
  $(`.game-play-screen`).removeClass(`hide`);
  $(`.game-center`).removeClass(`hide`);
  wizzApp.currentRoundNum += 1;
  wizzApp.nextRoundNum += 1;
  $('h2 span').html(`${wizzApp.currentRoundNum}`);
  if (wizzApp.currentRoundNum === 1) {
    wizzApp.playGameRound(wizzApp.chickenObj);
  } else if (wizzApp.currentRoundNum === 2) {
    wizzApp.playGameRound(wizzApp.cowObj);
  } else if (wizzApp.currentRoundNum === 3) {
    wizzApp.playGameRound(wizzApp.fishObj);
  }
}

wizzApp.endGame = () => {
  $('.final-result-screen').removeClass('hide');
  const sum = wizzApp.totalScore.reduce((partial_sum, a) => partial_sum + a, 0);
  $('p span').html(`${sum}`)
}

wizzApp.playGameRound = (animalObj) => {
  $(`.score-counter`).html(`<p>${animalObj.score}</p>`);
  $(`.countdown-overlay`).removeClass(`hide`);
  let timeLeft = 3;
  let timer = setInterval(function () {
    $('.three-sec-timer').html(timeLeft);
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 3;
      wizzApp.playGame(animalObj);
      window.clearInterval(timer);
      $('.three-sec-timer').html('');
    }
    //run the timer at 1 sec intervals
  }, 1000);

};

wizzApp.playGame = (animalObj) => {
  $(`.category-word`).html(`${animalObj.type}`);
  $('.countdown-overlay').addClass('hide');
  //start 20second timer
  let timeLeft = 10;
  let timer = setInterval(function () {
    $('.play-timer').html(timeLeft);
    timeLeft -= 1;
    if (timeLeft === 0) {
      $('.game-play-screen').addClass('hide');
      window.clearInterval(timer);
      $('.play-timer').html('')
      wizzApp.showRoundResultScreen(animalObj);

    }
  }, 1000);
}

wizzApp.showRoundResultScreen = (animalObj) => {
  //update values and display round results
  $('.round-result-screen p span').html(`${animalObj.score}`);
  wizzApp.totalScore.push(animalObj.score);
  $(`h2 span`).html(`${wizzApp.currentRoundNum}`);
  if (wizzApp.currentRoundNum === 3) {
    $(`.next-round-btn`).html(`Go to your results!`);
  } else {
    $(`.next-round-btn span`).html(`${wizzApp.nextRoundNum}`);
  }
  $('.round-result-screen').removeClass('hide');
  $('form').attr('id', `round-${wizzApp.nextRoundNum}`)
  // Add code to change id on form here
}

wizzApp.eventListeners = () => {
  $(`.start-btn`).on(`click`, function () {
    wizzApp.round();
  });

  if (wizzApp.currentRoundNum > 2) {
    $('.next-round-btn').on('click', function () {
      console.log('succes')
      $('.game-center').addClass('hide');
      $('.game-play-screen').addClass('hide');
      $('.round-result-screen').addClass('hide')
      $('.final-result-screen').removeClass('hide');
      wizzApp.endGame();
    })
  } else {
    $('.next-round-btn').on('click', function () {
      $('.round-result-screen').addClass('hide');
      $('li').addClass('hidden');
      console.log('no success')
      wizzApp.round();
    });
  }

  $('form').on('submit', function (event) {
    // prevent the default behaviour
    event.preventDefault();

    const round = event.target.id;
    console.log(round)
    if (round === 'round-one') {
      wizzApp.handleSubmit(wizzApp.finalChickenWordsArr, wizzApp.chickenObj);
    } else if (round === 'round-2') {
      wizzApp.handleSubmit(wizzApp.finalCowWordsArr, wizzApp.cowObj);
    } else {
      wizzApp.handleSubmit(wizzApp.finalFishWordsArr, wizzApp.fishObj);
    }
  })
}

wizzApp.init = () => {
  wizzApp.eventListeners();
}

// DOC READY: Initialise quiz when DOM is ready and loaded
$(function () {
  wizzApp.init();
});
