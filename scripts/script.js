const wizzApp = {
  category: [
    [ {
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


// DOCUMENT READY: Initialise quiz when DOM is ready and loaded
// $(function () {
//   wizzApp.init();
// });

