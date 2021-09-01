export const GET_USER_HISTORY = `
    match (u:USER {email: $email, provider: $provider})
    match (p:PROBLEM)
    match (u) -[r:solved]->(p)
    return p, r
`;
