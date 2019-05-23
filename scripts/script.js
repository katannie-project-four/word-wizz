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
  })

// function removeDuplicateUsingFilter(arr) {
//   let unique_array = arr.filter(function (elem, index, self) {
//     return index == self.indexOf(elem);
//   });
//   return unique_array
// }

// removeDuplicateUsingFilter(compiledChickenArr);

// function removeDuplicateUsingSet(arr) {
//   let unique_array = Array.from(new Set(arr))
//   return unique_array
// }

// console.log(removeDuplicateUsingSet(compiledChickenArr))
// const cleanChickenArr = [];
// $.each(compiledChickenArr, function (i, el) {
//   if ($.inArray(el, cleanChickenArr) === -1) {
//     cleanChickenArr.push(el);
//   }
// });

// const adjWordsKey = 'rel_jjb=';
// const nounWordsKey = 'rel_jja=';
// const targetWordsKey = 'rel_trg=';
// const meansLikeWordsKey = 'ml=';

// let animalType = 'chicken';

// const chickenAdjWordArr = () => {

//   getWords(chickenAdj, animalType);
// }


// const chickenNounArr = getWords(chickenNoun, animalType);

// const arrayOfUsableWords = [];

// DOCUMENT READY: Initialise quiz when DOM is ready and loaded
// $(function () {
//   wizzApp.init();
// });

