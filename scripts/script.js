const wizzApp = {
  category: [
    // ANIMALS
    [
      // CHICKEN
      {
        type: 'chicken',
        wordsArr: [],
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

// ALL OUR ANIMAL STUFF STUFF
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

function getWords(wordType, animal) {
  return $.ajax({
    url: `https://api.datamuse.com//words?${wordType}${animal}`,
    dataType: 'json',
    method: 'GET'
  })
}
const wordTypeKey = ['rel_jjb=', 'rel_jja=', 'rel_trg=', 'ml='];

const chickenObjArr = [];
for (let i = 0; i <= 3; i++) {
  chickenObjArr.push(getWords(wordTypeKey[i], 'chicken'));
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

// GAME PLAY STUFF

// TIMER FUNCTION
// const timeLeft = 3;
// const elem = document.getElementsByClassName('.timer');
// let timerId = setInterval(countdown, 1000);

// function countdown() {
//   if (timeLeft == -1) {
//     clearTimeout(timerId);
//     hideOverlay();
//   } else {
//     // elem.innerHTML(`<p>${timeLeft}</p>`);
//     timeLeft--;
//   }
// }



// START GAME



const goToNextScreen = (btnName, currentScreen, nextScreen, main) => {
  $(btnName).on('click', function () {
    $(currentScreen).addClass('hide')
    $(nextScreen).removeClass('hide')
    $('.countdown-overlay').removeClass('hide')
    $(main).removeClass('hide')
    $(function () {
      var timer = setInterval(function () {
        $('.three-sec-timer').html(function (i, html) {

          if (parseInt(html) > 0) {
            return parseInt(html) - 1;
          }
          else {
            $('.countdown-overlay').addClass('hide')
          }
        });

      }, 1000);
    });
  });
}



// function handleTimer() {
//   if (count === 0) {
//     clearInterval(timer);
//     hideOverlay();
//   } else {
//     $('.timer').html(count);
//     count--;
//   }
// }

// let count = 3;
// let timer = setInterval(function () { handleTimer(count); }, 1000);

function startGamePlay() {
  goToNextScreen('.start-btn', '.intro-screen', '.game-play-screen', '.game-center');
}

startGamePlay();


// DOCUMENT READY: Initialise quiz when DOM is ready and loaded
// $(function () {
//   wizzApp.init();
// });