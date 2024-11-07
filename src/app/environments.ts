interface OAuth {
    appId: string,
    appSecret: string,
    redirectUri: string
}

export const VKAuth: OAuth = {
    appId: '52624512',
    appSecret: 'Zb2BcO62aJTjOZwXUjrX',
    redirectUri: 'https://statisticsusers.web.app/user'
}

export const OKAuth: OAuth = {
    appId: '512002120657',
    appSecret: 'CCNMFFLGDIHBABABA',
    redirectUri: 'https://statisticsusers.web.app/user'
}

export const AuthSource = {
    vk: 'vk',
    ok: 'ok'
}

export const getLinksForLogin = (source: OAuth, sourceName: string): string => {
    return `client_id=${source.appId}&redirect_uri=${source.redirectUri + `?source=${sourceName}`}&scope=friends&v=5.199`;
};