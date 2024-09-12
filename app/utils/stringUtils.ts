export default class StringUtils {

  static isEmpty(value: string): boolean {
    value.replace(/s+/g, ' ').trim();
    return value === '';
  }
}