const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};

  const {
    reportedCases, timeToElapse, totalHospitalBeds,
    region, periodType
  } = data;

  // Function computes infectionRate
  function computeInfectionFactor(factor) {
    return parseInt(factor / 3, 10);
  }

  // Function computes number of infected persons
  function computeInfectedPersonsThen(timeFactor, currentlyInfected, periodTypeDays) {
    let factor = 0;
    let numberOfDays = 0;
    switch (periodTypeDays) {
      case 'days':
        factor = computeInfectionFactor(timeFactor);
        break;
      case 'weeks':
        numberOfDays = 7 * timeFactor;
        factor = computeInfectionFactor(numberOfDays);
        break;
      case 'months':
        numberOfDays = 30 * timeFactor;
        factor = computeInfectionFactor(numberOfDays);
        break;
      default:
    }

    const infectionsByRequestedTime = currentlyInfected * (2 ** factor);
    return infectionsByRequestedTime;
  }

  // Function computes severeCases
  function computeSevereCases(infected) {
    return Math.trunc(0.15 * infected);
  }

  // Function computes number of avaialble beds for the severe cases
  function availableBedsThen(severeCases, totalHospitalBedsAvailable) {
    // Basing on 35% availability
    let hospitalBedsAvailableThen = 0;
    let hospitalBedsAvailable = 0;

    hospitalBedsAvailable = Math.ceil(0.35 * totalHospitalBedsAvailable);

    // After severe case consideration
    hospitalBedsAvailableThen = hospitalBedsAvailable - severeCases;
    return hospitalBedsAvailableThen;
  }

  // Function that  computes severe Positive Cases in need for ICU
  function severePositiveCasesForICU(severe) {
    return Math.trunc(0.05 * severe);
  }

  // Function that computes severe positive cases in need for ventilation
  function severePositiveCasesForVentilation(severe) {
    return Math.trunc(0.02 * severe);
  }

  // Function that computes the money lost in a certain period
  function computeEconomicLoss(majority, infected, avgIncome, timeFactor, periodTypeDays) {
    let dollarsInFlight = 0;
    let numberOfDays = 0;
    switch (periodTypeDays) {
      case 'days':
        dollarsInFlight = parseFloat((majority * infected * avgIncome) / timeFactor).toFixed(2);
        break;
      case 'weeks':
        numberOfDays = 7 * timeFactor;
        dollarsInFlight = parseFloat((majority * infected * avgIncome) / numberOfDays).toFixed(2);
        break;
      case 'months':
        numberOfDays = 30 * timeFactor;
        dollarsInFlight = parseFloat((majority * infected * avgIncome) / numberOfDays).toFixed(2);
        break;
      default:
    }
    return +dollarsInFlight;
  }

  // For impact
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse,
    impact.currentlyInfected, periodType);
  impact.severeCasesByRequestedTime = computeSevereCases(impact.infectionsByRequestedTime);

  impact.hospitalBedsByRequestedTime = availableBedsThen(impact.severeCasesByRequestedTime,
    totalHospitalBeds);

  impact.casesForICUByRequestedTime = severePositiveCasesForICU(impact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = severePositiveCasesForVentilation(
    impact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = computeEconomicLoss(region.avgDailyIncomePopulation,
    impact.infectionsByRequestedTime, region.avgDailyIncomeInUSD, timeToElapse, periodType);

  // For severeImpact
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = computeInfectedPersonsThen(timeToElapse,
    severeImpact.currentlyInfected, periodType);

  severeImpact.severeCasesByRequestedTime = computeSevereCases(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = availableBedsThen(
    severeImpact.severeCasesByRequestedTime, totalHospitalBeds
  );

  severeImpact.casesForICUByRequestedTime = severePositiveCasesForICU(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = severePositiveCasesForVentilation(
    severeImpact.infectionsByRequestedTime
  );

  severeImpact.dollarsInFlight = computeEconomicLoss(region.avgDailyIncomePopulation,
    severeImpact.infectionsByRequestedTime, region.avgDailyIncomeInUSD, timeToElapse, periodType);
  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
