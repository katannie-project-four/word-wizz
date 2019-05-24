const wizzApp = {
  category: [
    // ANIMALS
    [
      // CHICKEN
      {
        type: 'chicken',
        wordsArr: ['kfc'],
        score: 0
      },
      // COW
      {
        type: 'cow',
        wordsArr: [],
        score: 0
      },
      // FISH
      {
        type: 'fish',
        wordsArr: [],
        score: 0
      }
    ]
  ]
}

// ALL OUR ANIMAL STUFF
const animalArr = wizzApp.category[0];
const chickenObj = animalArr[0];
const cowObj = animalArr[1];
const fishObj = animalArr[2];

const finalChickenWordsArr = chickenObj.wordsArr;
const finalCowWordsArr = cowObj.wordsArr;
const finalFishWordsArr = fishObj.wordsArr;

// FILTER THROUGH ARRAY TO REMOVE DUPLICATES
const uniqueArr = function (arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) >= index;
  });
};

const wordTypeKey = ['rel_jjb=', 'rel_jja=', 'rel_trg=', 'ml='];

const chickenObjArr = [];
for (let i = 0; i <= 3; i++) {
  chickenObjArr.push(getWords(wordTypeKey[i], 'chicken'));
}

function getWords(wordType, animal) {
  return $.ajax({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: 'json',
    method: 'GET'
  })
}

const compiledChickenArr = [];

$.when(...chickenObjArr)
  .then((...chickenWordsArr) => {
    const pulledArray = chickenWordsArr.map((word) => {
      return word[0];
    })
    for (i = 0; i <= 3; i++) {
      pulledArray[i].forEach((chick) => {
        compiledChickenArr.push(chick.word)
      });
    }
    cleanChickenArr = uniqueArr(compiledChickenArr);
    chickenObj.wordsArr.push(...cleanChickenArr)
  });


// === GAME ===//

//Form
wizzApp.handleSubmit = (animalTypeArr) => {
  $('form').on('submit', function (event, animalTypeArr) {
    console.log(`ANIMAL:`, animalTypeArr);
    // prevent the default behaviour
    event.preventDefault();
    // grabs the user's input
    let userInput = $('input').val();
    //reset input field to nothing
    $('input').val('');

    //check user's guess against current list and if correct, add one
    if (animalTypeArr.includes(userInput)) {
      animalObj.score += 1;
      //append correct guesses and colour them green
      $('.user-guesses').append(`<li class="correct">${userInput}</li>`);
      //update score
      $('.score-counter').html(`<p>${animalObj.score}</p>`)
    } else {
      //if inputs do not match, still append but leave red
      $('.user-guesses').append(`<li>${userInput}</li>`)
    }
    console.log(userInput)
  })
};


// START GAME
wizzApp.startGame = () => {
  $(`.start-btn`).on(`click`, function () {
    wizzApp.roundOne();
  })
  // roundOne(`chickenObj`);
  // roundTwo();
  // roundThree();
  // endGame();
 }

wizzApp.roundOne = () => {
  wizzApp.handleSubmit(cleanChickenArr);
  $(`.intro-screen`).addClass(`hide`);
  $(`.game-play-screen`).removeClass(`hide`);
  $(`.game-center`).removeClass(`hide`);
  // $(`.next-round-btn`).on(`click`, roundTwo());
  wizzApp.playGameRound(chickenObj.type);
}

wizzApp.playGameRound = (animalObj) => {

  $(`.score-counter`).html(`<p>${{animalObj}.score}</p>`);
  $(`.countdown-overlay`).removeClass(`hide`);
  let timeLeft = 3;
  let timer = setInterval(function () {
    $('.three-sec-timer').html(timeLeft);
    timeLeft -= 1;
    if (timeLeft < 0) {
      wizzApp.playGame(animalObj);
    }
    //run the timer at 1 sec intervals
  }, 1000);
};

wizzApp.playGame = (animalWord) => {
  console.log(animalWord);
  $(`.category-word`).html(`${animalWord}`);
  $('.countdown-overlay').addClass('hide');
  //start 20second timer
  let timeLeft = 20;
  let timer = setInterval(function () {
    $('.play-timer').html(timeLeft);
    timeLeft -= 1;
    if (timeLeft === 0) {
      $('.game-play-screen').addClass('hide');
      wizzApp.showRoundResultScreen();
    }
  }, 1000);
}

wizzApp.showRoundResultScreen = (currentRoundNum, nextRoundNum) => {
  //load data for next round

  //update values and display round results
  $('.round-result-screen p span').html(`${{animalObj}.score}`);
  $(`h2 span`).html(`${currentRoundNum}`);
  $(`.next-round-btn span`).html(`${nextRoundNum}`);
  $('.round-result-screen').removeClass('hide');
}

wizzApp.init = () => {
  wizzApp.startGame();
}

// DOC READY: Initialise quiz when DOM is ready and loaded
$(function () {
  wizzApp.init();
});
