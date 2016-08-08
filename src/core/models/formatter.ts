export class Formatter {
  constructor(public parser: (data: any) => any) {}

  public format(content: any): any {
    return this.parser(content);
  }
}
