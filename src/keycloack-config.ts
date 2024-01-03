// keycloak.ts
import Keycloak from 'keycloak-js'

const keycloakConfig = new Keycloak({
    realm: process.env.REACT_APP_KEYCLOACK_REALM,
    url: process.env.REACT_APP_KEYCLOACK_AUTH,
    clientId: process.env.REACT_APP_KEYCLOACK_CLIENT_ID,
  });
  
  export default keycloakConfig;
  