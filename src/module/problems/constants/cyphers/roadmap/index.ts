export const GET_ROADMAP_PROBLEMS_CYPHER = `
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM), (u:USER{email:$email, provider: $provider})
    where not (u)-[:solved]->(p)
    return p, false as solved, c
    union
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM), (u:USER{email:$email, provider: $provider})
    where (u)-[:solved]->(p)
    return p, true as solved, c
`;

export const GET_ROADMAP_CATEGORIES_CYPHER = `
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider}) 
    with count(p) as p1, c
    match(c)-[r:main_tag]-(p)
    with p1/tofloat(count(r)) as progress,c
    match(u:USER {email: $email, provider: $provider})
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[r:solved]-(u)
    with 1-toFloat(count(r))/sum(r.try) as failureRate, progress ,c, count(c) as solvedCount, collect(c.name) as name
    match(c1:CATEGORY)<-[:main_tag]-(p:PROBLEM)
    where c1.name in name
    return failureRate, progress, c, solvedCount, count(p) as problemCount
    union 
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider}) 
    with collect(c.name) as name
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
    where not c.name in name
    return 1.0 as failureRate, 0.0 as progress, c, 0 as solvedCount, count(c) as problemCount
`;

export const GET_ROADMAP_EDGES_CYPHER = `
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "main_tag" 
    return r
`;

export const GET_DEFAULT_ROADMAP_CYPHER = `
    match (c: CATEGORY) <-[:main_tag]-(p:PROBLEM)
    return c as p, count(p) as p1
    union 
    match ()-[r]->() 
    where type(r) = "next" or type(r) = "main_tag" 
    return r as p, 0 as p1
`;

export const GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER = `
    match (p:PROBLEM)-[:main_tag]->(c:CATEGORY)
    return p, c, count(p)
`;
