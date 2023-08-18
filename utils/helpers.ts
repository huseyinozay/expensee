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


export const getFormattedExpenseData = (data: any[]) => {
  const transformedData = data.map(item => ({
    ...item,
    combinedAmount: `${item.amount} ${item.currencyText}`
  }));

  return transformedData;
}
