import { Token } from "@angular/compiler";

export const environment = {
    production: true,
    apiBaseUrl: 'http://localhost:3000/api',
    tokenKey: 'token',
    userKey: 'user',

    endpoints: {
        login: '/users/logear',
        register: '/users',
    },
};
