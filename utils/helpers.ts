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
    name: obj[field]
  }));
  return transformed.map((obj) => {
    const { id, name } = obj;
    return { id, name } as GenericObject;
  });
}

export const getFormattedExpenseData = (data: any[], expenseCategories?: any[]) => {
  const transformedData = data.map(item => ({
    ...item,
    combinedAmount: `${item.amount} ${item.currencyText}`,
    expenseTypeId: expenseCategories ? getSelectedItemName(item.expenseTypeId, expenseCategories) : item.expenseTypeId
  }));

  return transformedData;
}

export function getSelectedItemName(itemId: number | string, items: any []) {
  const item = items.find(i => i.id === itemId);
  return item ? item.name : null;
}


