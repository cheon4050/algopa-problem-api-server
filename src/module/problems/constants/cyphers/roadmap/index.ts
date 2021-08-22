export const GET_ROADMAP_PROBLEMS_CYPHER = `
    match (c:Category)<-[:IN]-(p:Problem), (u:User{email:$email, provider: $provider})
    where not (u)-[:Solved]->(p)
    return p, false as solved, c
    union
    match (c:Category)<-[:IN]-(p:Problem), (u:User{email:$email, provider: $provider})
    where (u)-[:Solved]->(p)
    return p, true as solved, c
`;

export const GET_ROADMAP_CATEGORIES_CYPHER = `
    match(c:Category)<-[:IN]-(p:Problem)<-[:Solved]-(u:User {email: $email, provider: $provider}) 
    with count(p) as p1, c
    match(c)-[r:IN]-(p)
    with p1/tofloat(count(r)) as progress,c
    match(u:User {email: $email, provider: $provider})
    match(c:Category)<-[:IN]-(p:Problem)<-[r:Solved]-(u)
    with 1-toFloat(count(r))/sum(r.try) as failureRate, progress ,c, count(c) as solvedCount, collect(c.name) as name
    match(c1:Category)<-[:IN]-(p:Problem)
    where c1.name in name
    return failureRate, progress, c, solvedCount, count(p) as problemCount
    union 
    match(c:Category)<-[:IN]-(p:Problem)<-[:Solved]-(u:User {email: $email, provider: $provider}) 
    with collect(c.name) as name
    match(c:Category)<-[:IN]-(p:Problem)
    where not c.name IN name
    return 1.0 as failureRate, 0.0 as progress, c, 0 as solvedCount, count(c) as problemCount
`;

export const GET_ROADMAP_EDGES_CYPHER = `
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "IN" 
    return r
`;

export const GET_DEFAULT_ROADMAP_CYPHER = `
    match (c: Category) <-[:IN]-(p:Problem)
    return c as p, count(p) as p1
    union 
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "IN" 
    return r as p, 0 as p1
`;

export const GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER = `
    match (p:Problem)-[:IN]->(c:Category)
    return p, c, count(p)
`;
