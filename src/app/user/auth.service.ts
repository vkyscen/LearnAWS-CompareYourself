import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";
import { User } from "./user.model";

const POOL_DATA = {
  UserPoolId: "ap-south-1_qDByvS3A4",
  ClientId: "22pjosoesl31gt3c38cirsq9h5",
};

const userPool = new CognitoUserPool(POOL_DATA);
@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;
  constructor(private router: Router) {}
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password,
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: "email",
      Value: user.email,
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(
      user.username,
      user.password,
      attrList,
      null,
      (err, result) => {
        if (err) {
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          return;
        }
        if (result) {
          this.authDidFail.next(false);
          this.authIsLoading.next(false);
          console.log(result);
          this.registeredUser = result.user;
        }
      }
    );
    return;
  }
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
    };
  }
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password,
    };
    this.authStatusChanged.next(true);
    return;
  }
  getAuthenticatedUser() {}
  logout() {
    this.authStatusChanged.next(false);
  }
  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe((auth) =>
      this.authStatusChanged.next(auth)
    );
  }
}
