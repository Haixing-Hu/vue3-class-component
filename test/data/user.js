////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

class User {
  username = '';

  password = '';

  constructor(username = '', password = '') {
    this.username = username;
    this.password = password;
  }
}

export default User;
