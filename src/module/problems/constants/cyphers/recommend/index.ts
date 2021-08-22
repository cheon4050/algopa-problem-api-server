export const RECOMMEND_DEFAULT_PROBLEM = `
        match (p:Problem)
        return p
        order by p.level
`;

export const GET_RECENT_SOLVED_PROBLEMS = `
    match(u:User {email: $email, provider: $provider})-[r:Solved]->(p:Problem)
    return p.id
    order by r.date desc limit 10
`;

export const RECOMMEND_FIRST_PROBLEM = `
    match (c:Category)<-[:IN]-(p:Problem), (u:User {email: $email, provider: $provider})
    where not (u)-[:Solved]->(p)
    return p
    order by c.order
`;

export const RECOMMEND_NEXT_PROBLEM = `
    match (p:Problem {id: $problem_number})-[:IN]->(c:Category), (u:User {email: $email, provider: $provider})
    match (p1:Problem)-[:IN]->(c)
    where p.level <= p1.level and not (u)-[:Solved]->(p1)
    return p1 
    union
    match(p:Problem {id:$problem_number})-[:IN]->(c:Category),(c:Category)-[:next]->(c1:Category), (u:User {email: $email, provider: $provider})
    match(c1)<-[:IN]-(p2:Problem)
    where not (u)-[:Solved]->(p2)
    return p2 as p1
`;

export const RECOMMEND_LESS_PROBLEM = `
    match(c:Category)<-[r:IN]-(p:Problem)<-[:Solved]-(u:User {email: $email, provider: $provider}) 
    with collect(c.name) as name
    match(c1:Category)
    where not c1.name in name
    match(c1)<-[:IN]-(p:Problem)
    return p
    order by c1.order
    union
    match(c:Category)<-[r:IN]-(p:Problem)<-[:Solved]-(u:User {email: $email, provider: $provider}) 
    with count(p) as p1, c
    match(c)<-[r:IN]-(p)
    with p1/tofloat(count(r)) as progress, c
    match (c)<-[:IN]-(p)
    match(u:User {email: $email, provider: $provider}) 
    where not (u)-[:Solved]->(p)
    return p
    order by progress, c.order
`;

export const RECOMMEND_WRONG_PROBLEM = `
    match(u:User {email: $email, provider: $provider})
    match(c:Category)<-[:IN]-(p:Problem)<-[r:Solved]-(u)
    with toFloat(count(r))/sum(r.try) as failureRate, c
    match (c)<-[:IN]-(p)
    match(u:User {email: $email, provider: $provider})
    where not (u)-[:Solved]->(p)
    return p
    order by failureRate
`;