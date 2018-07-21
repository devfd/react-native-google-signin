import React, { Component } from 'react';

import {
  View,
  NativeAppEventEmitter,
  NativeModules,
  requireNativeComponent,
  ViewPropTypes,
  Platform,
} from 'react-native';

const { RNGoogleSignin } = NativeModules;

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';

export const isSigninCancellation = error => {
  return (IS_IOS && error.code === '-5') || (IS_ANDROID && error.code === '12501');
};

class GoogleSignin {
  signinIsInProcess = false;

  async signIn(params) {
    if (this.signinIsInProcess) {
      return Promise.reject(new Error('RNGoogleSignin: Previous sign in still in progress.'));
    }
    this.signinIsInProcess = true;

    await this.hasPlayServices(params);
    await this._configure(params);

    try {
      const user = await RNGoogleSignin.signIn();
      return user;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      this.signinIsInProcess = false;
    }
  }

  async hasPlayServices({ autoResolveGooglePlayError = true }) {
    if (IS_IOS) {
      return true;
    } else {
      return RNGoogleSignin.playServicesAvailable(autoResolveGooglePlayError);
    }
  }

  async _configure(params = {}) {
    if (IS_IOS && !params.iosClientId) {
      return Promise.reject(new Error('RNGoogleSignin: Missing iOS app ClientID'));
    }

    if (params.offlineAccess && !params.webClientId) {
      return Promise.reject(new Error('RNGoogleSignin: offline use requires server web ClientID'));
    }

    return RNGoogleSignin.configure(params);
  }

  async getCurrentUser(params) {
    try {
      await this._configure(params);
      const user = await RNGoogleSignin.getCurrentUser();
      return user;
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  async signOut() {
    return await RNGoogleSignin.signOut();
  }

  async revokeAccess() {
    return await RNGoogleSignin.revokeAccess();
  }
}

export const GoogleSigninSingleton = new GoogleSignin();
