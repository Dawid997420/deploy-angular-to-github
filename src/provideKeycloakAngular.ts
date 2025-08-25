import {
  provideKeycloak,
  createInterceptorCondition,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition
} from 'keycloak-angular';

// 1. Warunek dla produkcyjnego API (na Railway)
const prodApiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^https:\/\/hoffman-shop-v0-production\.up\.railway\.app(\/.*)?$/i
});

// 2. Warunek dla lokalnego API
const localApiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^http:\/\/localhost:8080(\/.*)?$/i
});

// 3. Konfiguracja Keycloak + oba warunki
export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: 'https://dockerfile-production-c869.up.railway.app/',
      realm: 'hoffmanshop',
      clientId: 'HoffmanShop-PKCE-Client'
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + 'silent-check-sso.html',
      redirectUri: window.location.origin + '/starter'
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 60000
      })
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [prodApiCondition, localApiCondition]  // 👈 oba warunki tutaj
      }
    ]
  });
