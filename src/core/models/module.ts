export class Module {
  public connection: any = {connect:() => {}};

  constructor(obj: any) {
    Object.assign(this, obj);
  }
}
