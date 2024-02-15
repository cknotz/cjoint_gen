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

// Builds initial profile pair & accounts for implausible combinations
//////////////////////////////////////////////////////////////////////
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

// Generates single profile pair using genprof() and checks for equality 
/////////////////////////////////////////////////////////////////////////
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
var ncomps = 2;

// This creates profile pairs and writes attributes to Qualtrics embedded data (Qualtrics.SurveyEngine.setEmbeddedData...)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
for (let i = 0; i <= ncomps; i++){

// Creates one profile pair using checker() function
profpair = checker()
  
Qualtrics.SurveyEngine.setEmbeddedData("choice"+i+"_edu1", profpair[0][1]); // attribute #1 (education), first profile
Qualtrics.SurveyEngine.setEmbeddedData("choice"+i+"_edu2", profpair[1][1]); // attribute #1 (education), second profile
// ... and so on...

};

