export const GET_ONE_USER = `
    match (u:User {email: $email, provider: $provider})
    return u
`;

export const CREATE_USER = `
    merge (u:User {email: $email, provider: $provider, isInit: false})
    return u
`;

export const INIT_USER_SUCCESS = `
    match(u:User {email:$email, provider:$provider})
    set u.isInit = true
`;
