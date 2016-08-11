/*
 ----------------------------------
 ! BITWISE OPERATORS! be cautious !
 ----------------------------------
 */


class roleManager {
  private roles = ['all', 'general', 'manageSettings'];

  public addRoles(newRoles : string[]) {
    this.roles = this.roles.concat(newRoles);
  }

  public generateBinary(data : string[]) : number {
    let result = 0;
    data.forEach(role => {
      let ind = this.roles.indexOf(role);
      if (ind >= 0) {
        result += (1 << ind);
      }
    });
    return result;
  }

  public checkBinary(bin : number, require : string[]) {
    // check if admin
    if (bin & 1 == 1 || require.length == 0) {
      return true;
    }
    // check no rights
    if (bin === 0) {
      return false;
    }
    // check requires
    let binCheck = this.generateBinary(require);
    return (binCheck & bin) == binCheck;
  }

  public checkUserAuth(user? : any, require? : string[]) {
    if ( !user ) { return Promise.reject(); }
    return new Promise((resolve, reject) => {
      if (this.checkBinary(user.auth, require)) {
        resolve(true);
        return true;
      }
      user.getRoles((err, roles) => {
        if (err) {
          reject(err);
          return err;
        }
        let result = this.checkBinary(roles.reduce((result, item) => { return result | item.auth; }, roles[0].auth), require);
        if ( result ) {
          resolve(true);
          return true
        }
        reject(false);
        return false;
      });
    });

  }
}

export const auth = new roleManager();
