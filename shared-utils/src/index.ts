export * from "./rbac";
export * from "./contracts";

export const shiftInArray = <T>(
  arr: T[],
  fromIndex: number,
  toIndex: number
) => {
  const copy = [...arr];
  const element = copy[fromIndex];
  copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, element);

  return copy;
};

export const insertAtIndex = <T>(item: T, arr: T[], index: number) => {
  const copy = [...arr];
  copy.splice(index, 0, item);
  return copy;
};
