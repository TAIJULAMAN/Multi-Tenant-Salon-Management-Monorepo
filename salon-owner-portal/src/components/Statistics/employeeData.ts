import { inactiveCardsConfig, newCardsConfig, returningCardsConfig, highSpendersCardsConfig, tagSegmentationCardsConfig, dailyProductionData, dailyProductionOptions, productionTrendsData, productionTrendsOptions, paymentsPerYearData, paymentsPerYearOptions, inactiveClientsList, newClientsList, returningClientsList, highSpendersList, tagSegmentationList, employeeProductionCards, employeeRemunerationCards, employeePerformanceMetrics, employeeOperationStatics } from "./data";
import { BriefcaseBusiness, Target, Award, Wallet, DollarSign, Database } from "lucide-react";

const iconMap: Record<string, any> = {
  BriefcaseBusiness, Target, Award, Wallet, DollarSign, Database
};

export const employeeStats = {
  teamOptions: ["All Team", "Sarah", "Michael"],
  inactiveCards: inactiveCardsConfig,
  newCards: newCardsConfig,
  returningCards: returningCardsConfig,
  highSpendersCards: highSpendersCardsConfig,
  tagSegmentationCards: tagSegmentationCardsConfig,
  productionCards: employeeProductionCards.map(c => ({ ...c, icon: iconMap[c.icon] })),
  remunerationCards: employeeRemunerationCards.map(c => ({ ...c, icon: iconMap[c.icon] })),
  dailyProductionData,
  dailyProductionOptions,
  productionTrendsData,
  productionTrendsOptions,
  paymentsPerYearData,
  paymentsPerYearOptions,
  inactiveClientsList,
  newClientsList,
  returningClientsList,
  highSpendersList,
  tagSegmentationList,
  performanceMetrics: employeePerformanceMetrics,
  operationStatics: employeeOperationStatics,
};
