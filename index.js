const axios = require('axios');
const {getWordsObject, getTopTenWords, fetchApiData, createJSON} = require('./utils.js');

async function getFileData(){
    let response = await axios.get("http://norvig.com/big.txt");
    let content = response.data;
    let topTenWordDetailsArray = [];

    // get words object from whole response content
    let wordsObj = getWordsObject(content);
    // find top ten words 
    let topTen = getTopTenWords(wordsObj);

    for(let iwrd=0; iwrd<topTen.length; iwrd++){
      let word = topTen[iwrd];

      // fetch api details like synonyms, pos for a word
      let apiData = await fetchApiData(word);

      // create json object for each word includin all required details
      let getJson = createJSON(word, wordsObj[word], apiData.syn, apiData.pos);

      //add details of top ten words to single array object
      topTenWordDetailsArray.push(getJson);
    }
    console.log(topTenWordDetailsArray);
    return topTenWordDetailsArray;
}

getFileData();
