export const excludeFields = (
  arr: Record<string, any>[],
  excludedFields: string[]
): Record<string, any>[] => {
  return arr.map((obj) => {
    const newObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!excludedFields.includes(key)) {
        newObj[key] = value;
      }
    }
    return newObj;
  });
};
