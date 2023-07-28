import i18n from "@/plugins/i18n";
export const expenseStatus = {
  1: i18n.t("labels.processing"),
  2: i18n.t("labels.ready"),
  3: i18n.t("labels.waiting"),
  4: i18n.t("labels.approved"),
  5: i18n.t("labels.rejected"),
  6: i18n.t("labels.archived"),
  7: i18n.t("labels.completed"),
  8: i18n.t("labels.missingData"),
  9: i18n.t("labels.inQueue"),
  10: i18n.t("labels.waitingForPayment"),
  11: i18n.t("labels.errorInPayment"),
  12: i18n.t("labels.paymentCompleted"),
  13: i18n.t("labels.loading"),
  14: i18n.t("labels.infoRequired"),
  15: i18n.t("labels.uploadError"),
};

export const paymentMethods = {
  0: i18n.t("labels.personalCreditCard"),
  1: i18n.t("labels.enterpriseCreditCard"),
  2: i18n.t("labels.paidByCompany"),
  3: i18n.t("labels.cash"),
  4: i18n.t("labels.cashAdvance"),
};
