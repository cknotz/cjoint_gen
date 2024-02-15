// Conjoint design with restrictions
////////////////////////////////////

// Draws heavily on Matthew Graham's example code & a solution from stackoverflow

// Arrays containing all attribute levels:
var EducationArray = ["High school","No formal","Graduate degree","4th Grade","College degree","Two-year college","8th grade"]; 
var GenderArray = ["Male","Female"];
var OriginArray = ["Iraq","France","Sudan","Germany","Philippines","Poland","Mexico","Somalia","China","India"];
var Reason1Array = ["Seek better job","Escape persecution","Reunite with family"];
var Reason2Array = ["Seek better job","Reunite with family"];
var Job1Array = ["Nurse","Child care provider","Gardener","Construction worker","Teacher","Janitor","Waiter","Doctor","Financial analyst","Computer programmer","Research scientist"]; 
var Job2Array = ["Nurse","Child care provider","Gardener","Construction worker","Janitor","Waiter"]; 
var PlansArray = ["Contract with employer","Interviews with employer","Will look for work","No plans to look for work"];
var PriorArray = ["Once as tourist","Once w/o authorization","Never","Many times as tourist","Six months with family"];
var LanguageArray = ["Tried English, but unable","Used interpreter","Fluent English","Broken English"]
var ExpArray = ["None","1-2 years","3-5 years","5+ years"]

// Fisher-Yates shuffle:
function shuffle(array){
for (var i = array.length - 1; i > 0; i--){ 
  var j = Math.floor(Math.random() * (i + 1));
  var temp = array[i]; 
  array[i] = array[j];
  array[j] = temp; }
  return array; 
}

// Shuffle a vector, choose the first entry:
function shuffle_one(theArray){ 
    var out = shuffle(theArray);
    var out = out[0]; 
    return(out);
}

// Builds profile pair & accounts for implausible combinations
//////////////////////////////////////////////////////////////
function genprof(){

// Profile "rump"
var sw1 = [1,shuffle_one(EducationArray),shuffle_one(GenderArray),shuffle_one(OriginArray),shuffle_one(ExpArray),shuffle_one(PlansArray),shuffle_one(PriorArray),shuffle_one(LanguageArray)];
var sw2 = [2,shuffle_one(EducationArray),shuffle_one(GenderArray),shuffle_one(OriginArray),shuffle_one(ExpArray),shuffle_one(PlansArray),shuffle_one(PriorArray),shuffle_one(LanguageArray)];

// Exclusion of reason, conditional on origin
if (sw1.includes("Iraq") || sw1.includes("Somalia") || sw1.includes("Sudan")) {
  sw1_end = [shuffle_one(Reason1Array)];
  sw1.push(sw1_end);
} else {
  sw1_end = [shuffle_one(Reason2Array)];
  sw1.push(sw1_end)
}
if (sw2.includes("Iraq") || sw2.includes("Somalia") || sw2.includes("Sudan")) {
  sw2_end = [shuffle_one(Reason1Array)];
  sw2.push(sw2_end);
} else {
  sw2_end = [shuffle_one(Reason2Array)];
  sw2.push(sw2_end)
};

// Exclusion of job, conditional on education
if (sw1.includes("No formal") || sw1.includes("4th grade") || sw1.includes("8th grade") || sw1.includes("High school")) {
  sw1_end = [shuffle_one(Job2Array)];
  sw1.push(sw1_end);
} else{
  sw1_end = [shuffle_one(Job1Array)];
  sw1.push(sw1_end);
};
if (sw2.includes("No formal") || sw2.includes("4th grade") || sw2.includes("8th grade") || sw2.includes("High school")) {
  sw2_end = [shuffle_one(Job2Array)];
  sw2.push(sw2_end);
} else{
  sw2_end = [shuffle_one(Job1Array)];
  sw2.push(sw2_end);
}

// Building profiles
var profiles = []
profiles.push(sw1);
profiles.push(sw2);
return(profiles);
};

// checks for equality 
function checker(){
test = genprof();
if (test[0]==test[1]){
  console.log("Identical profiles, doing over!");
  test = genprof();
  checker();
  return(test);
} else {
  return(test);
}
};

// Number of choice tasks
var ncomps = 13080;

// combine profiles to "deck" seen by individual respondent (necessary when using this code within an online survey)
deck = []; // captures profile deck
for (let i = 0; i <= ncomps; i++){
x = checker();
deck.push(x);
};

deck = deck.flat(); // flatten array to table
console.log(deck)

// EXPORT TO CSV (from stackoverflow)
/////////////////////////////////////

// adds dim names
deck.unshift(["ProfileNo","Education","Gender","Origin","Experience","Plans","Prior","Language","Reason","Job"]); 

    
// Convert to CSV string
function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map(v => v.replaceAll('"', '""'))  // escape double colons
    .map(v => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
};  
file = arrayToCsv(deck);

// Download contents as a file (source: https://stackoverflow.com/a/68146412)
function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
};
downloadBlob(file, 'cjoint_profiles.csv', 'text/csv;charset=utf-8;');