const wizzApp = {
  category: [
    [{
      type: 'chicken',
      wordsArr: [],
      score: 0
    },
    {
      type: 'cow',
      wordsArr: [],
      score: 0
    },
    {
      type: 'fish',
      wordsArr: [],
      score: 0
    }
    ]
  ]
}

// Declaring our game round words
const animalArr = wizzApp.category[0];
const chickenObj = animalArr[0];
const cowObj = animalArr[1];
const fishObj = animalArr[2];

const finalChickenWordsArr = chickenObj.wordsArr;

const uniqueArr = function(arr) {
  return arr.filter(function(item, index) {
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

  console.log(chickenObj);
// DOCUMENT READY: Initialise quiz when DOM is ready and loaded
// $(function () {
//   wizzApp.init();
// });

