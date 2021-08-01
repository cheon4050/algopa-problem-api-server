export const GET_USER_HISTORY = `
    match (u:User {email: $email, provider: $provider})
    match (p:Problem)
    match (u) -[r:Solved]->(p)
    return p, r
`;
