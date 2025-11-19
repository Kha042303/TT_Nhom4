module.exports = (pagination, query, totalItems) => {
  // Convert page if exists
  if (query.page) {
    pagination.currentPage = parseInt(query.page) ;
  }
  if(query.limit) {
    pagination.limitItems = parseInt(query.limit) ;
  }
  pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;
  pagination.totalPage = Math.ceil(totalItems / pagination.limitItems);

  return pagination;
};
