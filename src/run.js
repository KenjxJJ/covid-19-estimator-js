
const data = {
    region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
   };

   const { periodType, timeToElapse, reportedCases } = data;

function computeInfectedPersonsThen( timeFactor, currentlyInfected, periodType ){
    let _factor = 0;
    let numberOfDays = 0;

    switch (periodType){
      case "days":
        _factor = computeInfectionFactor(timeFactor);
      case "weeks":
       numberOfDays = 7*timeFactor;
        _factor = computeInfectionFactor(numberOfDays);  
      case "months":
         numberOfDays = 30*timeFactor;
        _factor = computeInfectionFactor(numberOfDays);
        console.log(_factor);
    } 
    
    let infectionsByRequestedTime = currentlyInfected * (2**_factor);
    return infectionsByRequestedTime;
  }
  
  function computeInfectionFactor(factor){
      return parseInt(factor/3);
    }
  
console.log( timeToElapse + " "+ "months" );

console.log(computeInfectedPersonsThen(timeToElapse, (reportedCases*10), "months" ));