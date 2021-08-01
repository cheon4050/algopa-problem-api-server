export const GET_ALL_PROBLEMS = `
    match(p:Problem)
    return p
`;

export const GET_SOLVED_PROBMELS = `
    match(p:Problem), (u:User {email: $email, provider: $provider})
    where (u)-[:Solved]->(p)
    return p
`;

export const GET_NOT_SOLVED_PROBLEMS = `
    match(p:Problem), (u:User {email: $email, provider: $provider})
    where not (u)-[:Solved]->(p)
    return p
`;

export const CREATE_SOLVED_RELATION = `
    match(p:Problem {id: $problemid})
    merge(u:User {email: $email, provider: $provider})
    merge (u)-[:Solved {try: $attemptCount, date: $time}]->(p)
`;
