export const GET_ALL_PROBLEMS = `
    match(p:PROBLEM)
    return p
`;

export const GET_SOLVED_PROBMELS = `
    match(p:PROBLEM), (u:USER {email: $email, provider: $provider})
    where (u)-[:solved]->(p)
    return p
`;

export const GET_NOT_SOLVED_PROBLEMS = `
    match(p:PROBLEM), (u:USER {email: $email, provider: $provider})
    where not (u)-[:solved]->(p)
    return p
`;

export const CREATE_SOLVED_RELATION = `
    match(u:USER {email: $email, provider: $provider})
`;
