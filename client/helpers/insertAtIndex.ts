export const insertAtIndex = <T>(item: T, arr: T[], index: number) => {
  console.log("insert", {
    item,
    arr,
    index,
  });
  const copy = [...arr];
  copy.splice(index, 0, item);
  return copy;
};
