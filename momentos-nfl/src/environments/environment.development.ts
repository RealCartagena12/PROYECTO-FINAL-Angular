import { Token } from "@angular/compiler";

export const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:8080/api',
    tokenKey: 'token',
    userKey: 'user',

    endpoints: {
        login: '/users/logear',
        register: '/users',
    },
};
