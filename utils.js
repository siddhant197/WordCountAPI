const fetch = require('node-fetch');

function getWordsObject(content){
    let wordsObj = {}; 
    let word = "";
    for(let i=0;i<content.length;i++){
        let char = content[i].toLowerCase();
        if(char.match(/[a-z]/g)){
        word+=char;
        }else{
        if(word!=""){
            wordsObj[word] ? wordsObj[word]+=1 : wordsObj[word]=1;
        }
        word="";
        }
    }
    return wordsObj;
}

function getTopTenWords(wordsObj){
var parsedKeys = Object.keys(wordsObj).sort(function (a, b) { return wordsObj[b] - wordsObj[a]; });
return parsedKeys.slice(0,10);
}

async function fetchApiData(keyword){
const param = "?key=dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9&lang=en-en&text="+keyword;
const response = await fetch("https://dictionary.yandex.net/api/v1/dicservice.json/lookup"+param);
const json = await response.json();
if(json.def.length<=0) return {syn: 'No Synonyms Found',pos: 'POS not found'};
let synObj = getSynonyms(json.def[0]);
return {
    syn: synObj.length>0 ? synObj : 'No Synonyms Found',
    pos: json.def[0].pos
};
}

function getSynonyms(wordDataObj){
let synArray = [];
if(wordDataObj.tr!=undefined){
    for(var i in wordDataObj.tr){
    for(var j in wordDataObj.tr[i].syn){
        synArray.push(wordDataObj.tr[i].syn[j].text);
    }
    }
}
return synArray;
}

function createJSON(wordText, wordCount, wordSynonyms, wordPos){
    return {
        "Word": wordText,
        "Output": {
        "CountOfOccurrence": wordCount,
        "Synonyms": JSON.stringify(wordSynonyms),
        "Pos": wordPos
        }
    };
}

module.exports = {getWordsObject, getTopTenWords, fetchApiData, createJSON};