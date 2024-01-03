import Keycloak from "keycloak-js";
// Keycloak configuration
let keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOACK_AUTH,
  realm: process.env.REACT_APP_KEYCLOACK_REALM,
  clientId: process.env.REACT_APP_KEYCLOACK_CLIENT_ID,
};

const _kc = new Keycloak(keycloakConfig);

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 *@param onAuthenticatedCallback
 */

const initKeycloak = (
  onAuthenticatedCallback: () => void,
  errorCallback: (error: any) => void
) => {
  _kc
    .init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      pkceMethod: "S256",
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback();
    })
    .catch((error) => {
      console.error("Error initializing Keycloak:", error);
      errorCallback(error);
    });
};

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;
const getParsedToken = () => _kc.tokenParsed;

const getName = () => {
  return _kc.tokenParsed?.name;
};

const isLoggedIn = () => !!_kc.token;

const updateToken = (
  successCallback:
    | ((value: boolean) => boolean | PromiseLike<boolean>)
    | null
    | undefined
) => _kc.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username;
const getUserEmail = () => _kc.tokenParsed?.email;

const hasRole = (roles: any[]) => roles.some((role) => _kc.hasRealmRole(role));
const isAdminUser = () => hasRole(["manager"]);
const hasOrgAdminRole = () => hasRole(["orgadmin"]);
const hasPluginAdminRole = () => hasRole(["pluginadmin"]);
const hasAnalystRole = () => hasRole(["analyst"]);
const hasExecutiveRole = () => hasRole(["executive"]);

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
  getParsedToken,
  getName,
  isAdminUser,
  hasOrgAdminRole,
  hasPluginAdminRole,
  hasAnalystRole,
  hasExecutiveRole,
  getUserEmail,
};

export default UserService;
