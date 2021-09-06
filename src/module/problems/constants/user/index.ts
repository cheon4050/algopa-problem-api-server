export const GET_ONE_USER = `
    match (u:User {email: $email, provider: $provider})
    return u
`;

export const CREATE_USER = `
    merge (u:USER {email: $email, provider: $provider})
`;

export const INIT_USER_SUCCESS = `
    match(u:User {email:$email, provider:$provider})
    set u.isInit = true
`;
