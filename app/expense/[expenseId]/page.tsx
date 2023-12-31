"use client";

import { MaText } from "@fabrikant-masraff/masraff-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ApiService from "@/app/api/route";
import { Expense } from "@/utils/types";

const api = new ApiService();

export default function ExpenseDetail() {
  const [expense, setExpense] = useState<Expense | null>(null);

  const { query, isReady } = useRouter();
  const expenseId = query.expenseId;

  useEffect(() => {
    if (isReady) {
      const fetchData = async () => {
        try {
          const result = await api.get(`v1/expenses/${expenseId}`);
          // @ts-ignore
          setExpense(result);
        } catch (error) {
          console.error("Bir hata oluştu:", error);
        }
      };

      fetchData();
    }
  }, [isReady]);
  return (
    <>
      {expense ? (
        <div>
          <p>
            <MaText className="ma-body-text-weight-bold">Kategori:</MaText>
            <MaText> {expense.expenseType?.name}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">
              Masraf Merkezi:
            </MaText>
            <MaText> {expense.ohpCodeId}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Toplam Tutar:</MaText>
            <MaText>
              {expense.amount} {expense.currencyText}
            </MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">KDV Oranı:</MaText>
            <MaText> {expense.taxPercentage}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">KDV Tutarı:</MaText>
            <MaText>
              {expense.taxAmount} {expense.currencyText}
            </MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Kurum:</MaText>
            <MaText> {expense.merchant}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Tarih:</MaText>
            <MaText> {expense.expenseDate}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Fiş No:</MaText>
            <MaText> {expenseId}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Ödeme Şekli:</MaText>
            <MaText> {expense.paymentMethod}</MaText>
          </p>
          <p>
            <MaText className="ma-body-text-weight-bold">Açıklama:</MaText>
            <MaText> {expense.note}</MaText>
          </p>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}
