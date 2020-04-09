
const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};

  const {
    reportedCases, timeToElapse, totalHospitalBeds,
    avgIncomeInUSD, avgDailyIncomePopulation, periodType
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
    return Math.round(0.15 * infected);
  }

  // Function computes number of avaialble beds for the severe cases
  function availableBedsThen(severeCases, totalHospitalBedsAvailable) {
    // Basing on 35% availability
    let hospitalBedsAvailableThen = 0;
    let hospitalBedsAvailable = 0;

    hospitalBedsAvailable = Math.round(0.35 * totalHospitalBedsAvailable);

    // After severe case consideration
    hospitalBedsAvailableThen = hospitalBedsAvailable - severeCases;
    return hospitalBedsAvailableThen;
  }

  // Function that  computes severe Positive Cases in need for ICU
  function severePositiveCasesForICU(severe) {
    return Math.round(0.05 * severe);
  }

  // Function that computes severe positive cases in need for ventilation
  function severePositiveCasesForVentilation(severe) {
    return Math.round(0.02 * severe);
  }

  // Function computes total amount in a certain period of time(days)
  // from a time frame in days, weeks, months
  function computeEconomicLossFactor(timeFactor, avgIncome) {
    return avgIncome * timeFactor;
  }

  // Function that computes the money lost in a certain period
  function computeEconomicLoss(majority, infected, avgIncome, timeFactor, periodTypeDays) {
    let dollarsInFlight = 0;
    let avgLossFactor = 0;
    let numberOfDays = 0;

    switch (periodTypeDays) {
      case 'days':
        avgLossFactor = computeEconomicLossFactor(timeFactor, avgIncome);
        break;
      case 'weeks':
        numberOfDays = 7 * timeFactor;
        avgLossFactor = computeEconomicLossFactor(numberOfDays, avgIncome);
        break;
      case 'months':
        numberOfDays = 30 * timeFactor;
        avgLossFactor = computeEconomicLossFactor(numberOfDays, avgIncome);
        break;
      default:
    }

    dollarsInFlight = infected * majority * avgLossFactor;

    return dollarsInFlight;
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

  impact.dollarsInFlight = computeEconomicLoss(avgDailyIncomePopulation,
    impact.infectionsByRequestedTime, avgIncomeInUSD, timeToElapse, periodType);

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

  severeImpact.dollarsInFlight = computeEconomicLoss(avgDailyIncomePopulation,
    severeImpact.infectionsByRequestedTime, avgIncomeInUSD, timeToElapse, periodType);

  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
