const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  
  const { reportedCases, timeToElapse } = data;
  
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
 
  // For impact
  impact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse, impact.currentlyInfected, periodType);
  
  // For severeImpact
  severeImpact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse, severeImpact.currentlyInfected, periodType);
  

      // Function computes number of infected persons
  function computeInfectedPersonsThen( timeFactor, currentlyInfected, periodType ){
    let _factor = 0;
    switch (periodType){
      case "days":
        _factor = computeInfectionFactor(timeFactor);
      case "weeks":
        let numberOfDays = 7*timeFactor;
        _factor = computeInfectionFactor(numberOfDays);  
      case "months":
        let numberOfDays = 30*timeFactor;
        _factor = computeInfectionFactor(numberOfDays);
    } 
    
    let infectionsByRequestedTime = currentlyInfected * (2**_factor);
    return infectionsByRequestedTime;
  }

    // Function computes infectionRate
  function computeInfectionFactor(factor){
    return parseInt(factor/3);
  }

  return {
    data: input,
    impact: {},
    severeImpact: {}
  };
};

export default covid19ImpactEstimator;