import WORD_DATA from './word.json';

const database = [...WORD_DATA];
let count = 1;
export default function findMatchWords(_word) {
  return new Promise((resolve, reject) => {
    console.log(count++);
    if (!_word) {
      reject('Word is empty');
    }
    resolve(
      database
      .filter(
        (word) => {
          const regex = new RegExp(_word, 'gi');
          return word.word.match(regex)
        }
      )
      .sort(
        (a, b) => {
          return b.frequency - a.frequency;
        }
      )
    );
  });
}