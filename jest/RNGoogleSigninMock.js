const mockUserInfo = {
  idToken: 'mockIdToken',
  accessToken: null,
  accessTokenExpirationDate: null, // DEPRECATED, on iOS it's a time interval since now in seconds, on Android it's always null
  serverAuthCode: 'mockServerAuthCode',
  scopes: [], // on iOS this is empty array if no additional scopes are defined
  user: {
    email: 'mockEmail',
    id: 'mockId',
    givenName: 'mockGivenName',
    familyName: 'mockFamilyName',
    photo: 'mockPhotoUtl',
    name: 'mockFullName',
  },
};

jest.mock('react-native-google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve(mockUserInfo)),
    signInSilently: jest.fn(() => Promise.resolve(mockUserInfo)),
    revokeAccess: jest.fn(() => Promise.resolve(true)),
    signOut: jest.fn(() => Promise.resolve(true)),
  },
}));
