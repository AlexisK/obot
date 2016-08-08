export class Connection {
  public service: any;
  constructor(private _name: string, private _connectFn: () => any) {}

  public connect(): any {
    console.log(`Connecting to ${this._name}`);
    return this.service = this._connectFn();
  }
}
