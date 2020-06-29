import ContxtSdk from '@ndustrial/contxt-sdk';

const contxtSdk = new ContxtSdk({
    config: {
        auth: {
            clientId: 'ENfYXBnFrFlNgnRffIr64RqTAguFYidQ',
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

