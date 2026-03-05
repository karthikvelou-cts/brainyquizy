export const getPagination = (page = 1, limit = 10, maxLimit = 50) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), maxLimit);
  const skip = (parsedPage - 1) * parsedLimit;

  return { page: parsedPage, limit: parsedLimit, skip };
};

export const parseAmount = (amount = 10, maxAmount = 50) => {
  const parsed = parseInt(amount, 10);
  if (Number.isNaN(parsed) || parsed < 1) return 10;
  return Math.min(parsed, maxAmount);
};

export const opentdbResponse = (results = [], response_code = 0, extra = {}) => ({
  response_code,
  results,
  ...extra,
});
