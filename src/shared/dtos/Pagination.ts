export default interface PaginationAwareObject {
  total: number | any;
  data: Array<object | any> | any;
}
