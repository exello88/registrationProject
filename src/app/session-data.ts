import { IUserInfo } from "./user-profile/profile.service";

interface IVkTokens {
    token: string | undefined,
    userId: string | undefined
}

interface IUserActivities {
    friendsCount: number | undefined,
    followersCount: number | undefined,
    subscribeCount: number | undefined
}

export let VKTokens: IVkTokens = {
    token: undefined,
    userId: undefined
}


export const user = {
    userInfo: null as IUserInfo | null,
    userActivities: {
        followersCount: undefined,
        friendsCount: undefined,
        subscribeCount: undefined
    } as IUserActivities
};