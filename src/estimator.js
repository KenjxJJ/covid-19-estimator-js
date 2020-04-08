const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  
  const { reportedCases, timeToElapse, totalHospitalBeds,
     avgDailyIncomePopulation } = data;
    
  // For impact
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse, impact.currentlyInfected, periodType);
  impact.severeCasesByRequestedTime = computeSevereCases(impact.infectionsByRequestedTime);

  impact.hospitalBedsByRequestedTime = availableBedsThen(impact.severeCasesByRequestedTime ,totalHospitalBeds);

   impact.casesForICUByRequestedTime = 
       severePositiveCases(impact.infectionsByRequestedTime);

    impact.casesForVentilationByRequestedTime = 
    severePositiveCasesForVentilation( impact.infectionsByRequestedTime );
    
    impact.dollarsInFlight = computeEconomicLoss(avgDailyIncomePopulation,impact.infectionsByRequestedTime,avgIncomeInUSD, timeToElapse, periodType );
    
  // For severeImpact
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse, severeImpact.currentlyInfected, periodType);
  
  severeImpact.severeCasesByRequestedTime = computeSevereCases(severeImpact.infectionsByRequestedTime );

  severeImpact.hospitalBedsByRequestedTime = availableBedsThen(severeImpact.severeCasesByRequestedTime ,totalHospitalBeds);

  severeImpact.casesForICUByRequestedTime = 
  severePositiveCases(severeImpact.infectionsByRequestedTime);

 severeImpact.casesForVentilationByRequestedTime = 
  severePositiveCasesForVentilation( severeImpact.infectionsByRequestedTime );

  severeImpact.dollarsInFlight = computeEconomicLoss(avgDailyIncomePopulation,severeImpact.infectionsByRequestedTime,avgIncomeInUSD, timeToElapse, periodType );

    
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

      // Function computes severeCases
  function computeSevereCases( infected ){
     return 0.15 * infected;
  }

  // Function computes number of avaialble beds for the severe cases
  function availableBedsThen( severeCases, totalHospitalBeds ){
     // Basing on 35% availability
     let hospitalBedsAvailableThen = 0;
      let hospitalBedsAvailable = 0;

     hospitalBedsAvailable =  0.35 * totalHospitalBeds;

     // After severe case consideration
      hospitalBedsAvailableThen = hospitalBedsAvailable - severeCases;
       return hospitalBedsAvailableThen;
  }

    // Function that  computes severe Positive Cases in need for ICU 
    function severePositiveCasesForICU( severe ){
       return 0.05* severe;
    }

    // Function that computes severe positive cases in need for ventilation
    function severePositiveCasesForVentilation( severe ){
       return 0.02 * severe;
    }

    // Function that computes the money lost in a certain period
    function computeEconomicLoss( majority, infected, avgIncome, timeFactor, periodType){
        let dollarsInFlight = 0;
        let avgLossFactor = 0;
        let numberOfDays = 0;

        switch (periodType){
          case "days":
            _factor = computeEconomicLossFactor(timeFactor,avgIncome);
          case "weeks":
          numberOfDays = 7*timeFactor;
          avgLossFactor =  computeEconomicLossFactor(numberOfDays, avgIncome);
          case "months":
            numberOfDays = 30*timeFactor;
            avgLossFactor = computeEconomicLossFactor(numberOfDays, avgIncome);
        } 

   dollarsInFlight = infected * majority * avgLossFactor;
        
      return dollarsInFlight;
    }

    // Function computes total amount in a certain period of time(days)
    // from a time frame in days, weeks, months
    function computeEconomicLossFactor(timeFactor, avgIncome){
       return avgIncome * timeFactor;
        
    }
  return {
    data: input,
    impact: {},
    severeImpact: {}
  };
};

export default covid19ImpactEstimator;