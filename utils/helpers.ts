import {
  MasraffColorType,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import { GenericObject } from "./types";
import { useTranslation } from "react-i18next";
import i18n from "@/i18/i18";

export function filterObjectsByIdAndName(arr: any[]) {
  return arr.map((obj) => {
    const { id, name } = obj;
    return { id, name } as GenericObject;
  });
}

export function filterObjectsByIdAndValue(arr: any[]) {
  let transformed = arr.map((obj) => ({
    id: obj.id,
    name: obj.value,
  }));
  return transformed.map((obj) => {
    const { id, name } = obj;
    return { id, name } as GenericObject;
  });
}

export function filterObjectsByIdAndGivenField(arr: any[], field: string) {
  let transformed = arr.map((obj) => ({
    id: obj.id,
    name: obj[field],
  }));
  return transformed.map((obj) => {
    const { id, name } = obj;
    return { id, name } as GenericObject;
  });
}

export const getFormattedExpenseData = (
  data: any[],
  expenseCategories?: any[]
) => {
  const transformedData = data.map((item) => ({
    ...item,
    combinedAmount: `${item.amount} ${item.currencyText}`,
    expenseTypeId: expenseCategories
      ? getSelectedItemName(item.expenseTypeId, expenseCategories)
      : item.expenseTypeId,
  }));

  return transformedData;
};

export const getFormattedExpenseReportData = (data: any[]) => {
  const transformedData = data.map((item) => ({
    ...item,
    combinedAmount: `${item.totalAmount} ${item.currencyText}`,
  }));

  return transformedData;
};

export const getFormattedExpensePolicyData = (
  data: any[],
  expenseCategories?: any[]
) => {
  const transformedData = data.map((item) => ({
    ...item,
    combinedAmount: `${item.amount} ${item.currencyText}`,
    limitDifference: `${getExpenseTypeLimitDifference(item)} ${
      item.currencyText
    }`,
    expenseTypeId: expenseCategories
      ? getSelectedItemName(item.expenseTypeId, expenseCategories)
      : item.expenseTypeId,
  }));

  return transformedData;
};

const getExpenseTypeLimitDifference = (expense: any) => {
  let expenseTypeLimit = expense.expenseType.expenseTypeLimit;

  if (expense.expenseType.currency != null) {
    if (expense.expenseType.currency == expense.currency) {
      expenseTypeLimit = expense.expenseType.expenseTypeLimit;
    } else {
      expenseTypeLimit = expense.expenseType.conversionExpenseTypeLimit;
    }
  } else {
    expense.expenseType.currency == 1;
  }

  var convertionExpenseTypeLimit = expense.amount - expenseTypeLimit;
  return convertionExpenseTypeLimit;
};

export function getSelectedItemName(itemId: number | string, items: any[]) {
  const item = items.find((i) => i.id === itemId);
  return item ? item.name : null;
}

export function getIconForExpense(categoryName: string) {
  if (categoryName) {
    const lowerCaseName = categoryName.toLowerCase();

    if (lowerCaseName.includes("yemek")) return MasraffIconNames.Burger;

    if (lowerCaseName.includes("dezenfektan")) return MasraffIconNames.Clean;
    const transportKeywords = [
      "otobüs",
      "taksi",
      "arac",
      "kiralama",
      "ucak",
      "uçak",
      "mesafe",
    ];
    if (transportKeywords.some((keyword) => lowerCaseName.includes(keyword)))
      return MasraffIconNames.Airplane;

    const accommodationKeywords = ["hotel", "otel", "yatış"];
    if (
      accommodationKeywords.some((keyword) => lowerCaseName.includes(keyword))
    )
      return MasraffIconNames.Home;
  }

  return MasraffIconNames.Receipt;
}

export function formatDateToGMT(dateString: string) {
  let date = new Date(dateString);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${days[date.getUTCDay()]}, ${date.getUTCDate()} ${
    months[date.getUTCMonth()]
  } ${date.getUTCFullYear()} ${String(date.getUTCHours()).padStart(
    2,
    "0"
  )}:${String(date.getUTCMinutes()).padStart(2, "0")}:${String(
    date.getUTCSeconds()
  ).padStart(2, "0")} GMT`;
}

export function isEqual(a: any, b: any) {
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  } else {
    return a === b;
  }
}

export function statusTagPicker(statusText: string) {
  switch (statusText) {
    case i18n.t("labels.ready"):
      return MasraffColorType.Constructive;

    case i18n.t("labels.approved"):
      return MasraffColorType.Primary;

    case "labels.infoRequired":
    case i18n.t("labels.uploadError"):
    case i18n.t("labels.errorInPayment"):
    case i18n.t("labels.deleted"):
    case i18n.t("labels.rejected"):
      return MasraffColorType.Destructive;

    case i18n.t("labels.processing"):
    case i18n.t("labels.waitingForApproval"):
      return MasraffColorType.Neutral;

    default:
      return MasraffColorType.Neutral;
  }
}
export function isStringField(value: any): value is string {
  return typeof value === "string";
}
