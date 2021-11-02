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

export const GET_100ROADMAP_PROBLEMS_CYPHER = `
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"}), (u:USER{email:$email, provider: $provider})
    where not (u)-[:submit{isSolved:true}]->(p)
    return p, false as solved, c
    union
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"}), (u:USER{email:$email, provider: $provider})
    where (u)-[:submit{isSolved:true}]->(p)
    return p, true as solved, c
`;
export const GET_100ROADMAP_CATEGORIES_CYPHER = `
match(u:USER {email: $email, provider: $provider}) 
call{
    with u
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"}),(p)<-[:submit{isSolved:true}]-(u) 
    with collect(c.name) as name
    match(c1:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
    where not c1.name in name
    return 1.0 as failureRate, 0.0 as progress, c1 as c2 , 0 as solvedCount, count(p) as problemCount
    union
    with u
    match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"}),
    (p)<-[:submit{isSolved:true}]-(u)
    with distinct p, c, u
    with distinct count(p) as solvedCount, c, u
    match(c)<-[r:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
    with solvedCount/tofloat(count(r)) as progress , c, solvedCount, count(p) as problemCount,u
    with c as c1, progress, solvedCount, problemCount, u
    call{
        with u, c1
        match(c1)
        match(c1)-[:main_tag]-(p:PROBLEM)
        match(u)-[r:submit{isSolved:true}]-(p)-[:recommend]-(m:ROADMAP)
        with u, c1, count(r) as solvedCount
        match(c1)-[:main_tag]-(p1:PROBLEM)
        match(u)-[r:submit]-(p1)-[:recommend]-(m:ROADMAP)
        return c1 as c2, 1 - toFloat(solvedCount)/count(r) as failureRate
    }
    with failureRate, c2, progress, solvedCount, problemCount, u
    return failureRate, progress, c2, solvedCount, problemCount
}
return  failureRate, progress, c2, solvedCount, problemCount
order by c2.order
`;
//이전 버전 100RoadMap
// export const GET_100ROADMAP_CATEGORIES_CYPHER = `
//     call{
//         match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         match(p)<-[:solved]-(u:USER {email: $email, provider: $provider})
//         with count(p) as p1, c
//         match(c)-[r:main_tag]-(p)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         with p1/tofloat(count(r)) as progress,c
//         match(u:USER {email: $email, provider: $provider})
//         match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         match(p)<-[r:solved]-(u)
//         with 1-toFloat(count(r))/sum(r.try) as failureRate, progress ,c, count(c) as solvedCount, collect(c.name) as name
//         match(c1:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         where c1.name in name
//         return failureRate, progress, c, solvedCount, count(p) as problemCount
//         union
//         match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         match(p)<-[:solved]-(u:USER {email: $email, provider: $provider})
//         with collect(c.name) as name
//         match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
//         where not c.name in name
//         return 1.0 as failureRate, 0.0 as progress, c, 0 as solvedCount, count(c) as problemCount
//     }
//     with failureRate, progress, c, solvedCount, problemCount
//     return failureRate, progress, c, solvedCount, problemCount
//     order by c.order
// `;

export const GET_100ROADMAP_EDGES_CYPHER = `
    match ()-[r:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
    return r
`;

export const GET_COMPANY_ROADMAP_PROBLEMS_CYPHER = `
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company}), (u:USER{email:$email, provider: $provider})
    where not (u)-[:submit{isSolved:true}]->(p)
    return p, false as solved, c
    union
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company}), (u:USER{email:$email, provider: $provider})
    where (u)-[:submit{isSolved:true}]->(p)
    return p, true as solved, c
`;
export const GET_COMPANY_ROADMAP_CATEGORIES_CYPHER = `
match(u:USER {email: $email, provider: $provider}) 
call{
    with u
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company}),(p)<-[:submit{isSolved:true}]-(u) 
    with collect(c.name) as name
    match(c1:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
    where not c1.name in name
    return 1.0 as failureRate, 0.0 as progress, c1 as c2 , 0 as solvedCount, count(p) as problemCount
    union
    with u
    match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company}),
    (p)<-[:submit{isSolved:true}]-(u)
    with distinct p, c, u
    with distinct count(p) as solvedCount, c, u
    match(c)<-[r:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
    with solvedCount/tofloat(count(r)) as progress , c, solvedCount, count(p) as problemCount,u
    with c as c1, progress, solvedCount, problemCount, u
    call{
        with u, c1
        match(c1)
        match(c1)-[:main_tag]-(p:PROBLEM)
        match(u)-[r:submit{isSolved:true}]-(p)-[:recommend]-(m:COMPANY{name:$company})
        with u, c1, count(r) as solvedCount
        match(c1)-[:main_tag]-(p1:PROBLEM)
        match(u)-[r:submit]-(p1)-[:recommend]-(m:COMPANY{name:$company})
        return c1 as c2, 1 - toFloat(solvedCount)/count(r) as failureRate
    }
    return failureRate, progress, c2, solvedCount, problemCount
}
return  failureRate, progress, c2, solvedCount, problemCount
order by c2.order
`;
//이전 버전 기업 로드맵
// export const GET_COMPANY_ROADMAP_CATEGORIES_CYPHER = `
// call{
//     match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
//     match(p)<-[:solved]-(u:USER {email: $email, provider: $provider})
//     with count(p) as p1, c
//     match(c)-[r:main_tag]-(p)<-[:recommend]-(m:COMPANY{name:$company})
//     with p1/tofloat(count(r)) as progress,c
//     match(u:USER {email: $email, provider: $provider})
//     match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
//     match(p)<-[r:solved]-(u)
//     with 1-toFloat(count(r))/sum(r.try) as failureRate, progress ,c, count(c) as solvedCount, collect(c.name) as name
//     match(c1:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
//     where c1.name in name
//     return failureRate, progress, c, solvedCount, count(p) as problemCount
//     union
//     match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
//     match(p)<-[:solved]-(u:USER {email: $email, provider: $provider})
//     with collect(c.name) as name
//     match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
//     where not c.name in name
//     return 1.0 as failureRate, 0.0 as progress, c, 0 as solvedCount, count(c) as problemCount
// }
// with failureRate, progress, c, solvedCount, problemCount
//     return failureRate, progress, c, solvedCount, problemCount
//     order by c.order
// `;

export const GET_COMPANY_ROADMAP_EDGES_CYPHER = `
    match ()-[r:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
    return r
`;

export const GET_DEFAULT_ROADMAP_CYPHER = `
    match (c: CATEGORY)<-[:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
    return c as p, count(p) as p1
    order by p.order asc
    union 
    match ()-[r:main_tag]-(p:PROBLEM)-[:recommend]->(m:ROADMAP{name:"DEFAULT"})
    return r as p, 0 as p1
`;

export const GET_DEFAULT_ROADMAP_PROBLEMS_CYPHER = `
    match (m:ROADMAP{name:"DEFAULT"})<-[:recommend]-(p:PROBLEM)-[:main_tag]->(c:CATEGORY)
    return p, c, count(p)
`;

export const GET_COMPANY_DEFAULT_ROADMAP_CYPHER = `
    match (c: CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
    return c as p, count(p) as p1
    order by p.order asc
    union
    match ()-[r:main_tag]-(p:PROBLEM)<-[:recommend]-(m:COMPANY{name:$company})
    return r as p, 0 as p1
`;

export const GET_COMPANY_DEFAULT_ROADMAP_PROBLEMS_CYPHER = `
    match (m:COMPANY{name:$company})-[:recommend]->(p:PROBLEM)-[:main_tag]->(c:CATEGORY)
    return p, c, count(p)
`;
