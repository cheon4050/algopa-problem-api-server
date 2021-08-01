export const GET_ROADMAP_CYPHER = `
    match(p)
    where labels(p)[0] = "Problem" or labels(p)[0] = "Category"
    return p
    union
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "IN" 
    return r as p
    union
    match (u:User {email: $email, probider: $provider})
    match (p1:Problem)
    match (u) -[r2:Solved]->(p1)
    return r2 as p
`;

export const GET_DEFAULT_ROADMAP_CYPHER = `
    match(p)
    where labels(p)[0] = "Problem" or labels(p)[0] = "Category"
    return p
    union 
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "IN" 
    return r as p
`;
