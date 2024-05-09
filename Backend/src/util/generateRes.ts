export const generateRes = (
  data: any,
  count?: number,
  page?: number,
  limit?: number
) => {
  if (!data || data.length == 0) return null;

  if (data && !(data.length > 0)) return data;

  return {
    currentPage: page,
    count,
    totalPage: count && limit ? Math.ceil(count / limit) : 0,
    data,
  };
};
