export function filterObjectsByIdAndName(arr: any[]) {
  return arr.map((obj) => {
    const { id, name } = obj;
    return { id, name } as GenericObject;
  });
}
