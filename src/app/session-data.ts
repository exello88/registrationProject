import { IUserInfo } from "./user-profile/profile.service";

interface IVkTokens {
    token: string | null,
    userId: string | null
}

interface IUserActivities {
    friendsCount: number | null,
    followersCount: number | null,
    subscribeCount: number | null
}

export let VKTokens: IVkTokens = {
    token: null,
    userId: null
}


export const user = {
    userInfo: null as IUserInfo | null,
    userActivities: {
        followersCount: null,
        friendsCount: null,
        subscribeCount: null
    } as IUserActivities
};