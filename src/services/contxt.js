import ContxtSdk from '@ndustrial/contxt-sdk';

const contxtSdk = new ContxtSdk({
    config: {
        auth: {
            clientId: 'Jlrp6SjjpTP7RlrNi8exIkCxeuWZmRDW',
            customModuleConfigs: {
                contxtAuth: {
                  env: 'production'
                }
              },
              env: 'production'
        }
    },
    sessionType: 'auth0WebAuth'
});

export default contxtSdk;

