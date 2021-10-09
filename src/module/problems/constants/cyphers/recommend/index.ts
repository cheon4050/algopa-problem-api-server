export const RECOMMEND_DEFAULT_PROBLEM = `
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
    return p, c
    order by p.level limit toInteger($limit)
`;

export const GET_RECENT_SOLVED_PROBLEMS = `
    match(u:USER {email: $email, provider: $provider})-[r:solved]->(p:PROBLEM)
    return p.id
    order by r.date desc limit 10
`;

export const RECOMMEND_FIRST_PROBLEM = `
    match (c:CATEGORY)<-[:main_tag]-(p:PROBLEM), (u:USER {email: $email, provider: $provider})
    where not (u)-[:solved]->(p)
    return p, c
    order by c.order limit toInteger($limit)
`;

export const RECOMMEND_NEXT_PROBLEM = `
    match (p:PROBLEM {id: $problem_number})-[:main_tag]->(c:CATEGORY), (u:USER {email: $email, provider: $provider})
    match (p1:PROBLEM)-[:main_tag]->(c)
    where p.level <= p1.level and not (u)-[:solved]->(p1)
    return p1 
    union
    match(p:PROBLEM {id:$problem_number})-[:main_tag]->(c:CATEGORY),(c:CATEGORY)-[:next]->(c1:CATEGORY), (u:USER {email: $email, provider: $provider})
    match(c1)<-[:main_tag]-(p2:PROBLEM)
    where not (u)-[:solved]->(p2)
    return p2 as p1
`;

export const RECOMMEND_LESS_PROBLEM = `
    match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider}) 
    with collect(c.name) as name
    match(c1:CATEGORY)
    where not c1.name in name
    match(c1)<-[:main_tag]-(p:PROBLEM)
    return p, c1 as c
    order by c1.order
    union
    match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider}) 
    with count(p) as p1, c
    match(c)<-[r:main_tag]-(p)
    with p1/tofloat(count(r)) as progress, c
    match (c)<-[:main_tag]-(p)
    match(u:USER {email: $email, provider: $provider}) 
    where not (u)-[:solved]->(p)
    return p, c
    order by progress, c.order 
`;

export const RECOMMEND_WRONG_PROBLEM = `
    match(u:USER {email: $email, provider: $provider})
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[r:solved]-(u)
    with toFloat(count(r))/sum(r.try) as failureRate, c
    match (c)<-[:main_tag]-(p)
    match(u:USER {email: $email, provider: $provider})
    where not (u)-[:solved]->(p)
    return p, c
    order by failureRate limit toInteger($limit)
`;
export const RECOMMEND_DESIREDCOMPANY_PROBLEM = `
    match(u:USER{email: $email, provider: $provider}),(co:COMPANY{name:$company})<-[:past]-(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
    where not (p)<-[:solved]-(u)
    with p.id as pi ,rand() as ra, c, p
    return p, c 
    order by ra limit toInteger($limit)
`;

export const NEXT_RECOMMEND_SIMILAR_PROBLEM = `
call{
    match(p:PROBLEM{id:$id})-[r:main_tag]-(mainc:CATEGORY)
    match(p)-[r1:sub_tag]-(subc:CATEGORY)
    with (count(r)+count(r1))as cr, p, mainc, subc
    match(u:USER{email:$email, provider:$provider}),(p1:PROBLEM)-[r2]-(c3:CATEGORY)
    where (((p1)-[:sub_tag]-(subc) and (p1)-[:main_tag]-(mainc)) or (p1)-[:main_tag]-(mainc)) and not p.id = p1.id and not (p1)-[:solved]-(u)
    with p1, count(r2) as cr2, cr, p
    where cr2 <= cr
    return p1
    order by cr2 desc, abs(p.level - p1.level)
union
    match(u:USER{email:$email, provider:$provider})
    match(p:PROBLEM{id:$id})-[r:main_tag]-(mainc:CATEGORY)
    match(p1:PROBLEM)-[:main_tag]-(mainc)
    where not (p1)-[:solved]-(u) and not p1.id =p.id
    return p1
    order by  abs(p.level - p1.level)
}
match(p1)-[:main_tag]-(cate:CATEGORY)
optional match (p1)-[:sub_tag]-(cate2:CATEGORY)
return distinct p1,  [cate.name]+collect(cate2.name) limit toInteger($limit/2)
`;

export const NEXT_RECOMMEND_NEW_CATEGORY_PROBLEM = `
call{
    match(u:USER{email:$email, provider:$provider})
    match(p:PROBLEM{id:$id})-[:main_tag]-(c:CATEGORY)
    match(c)-[:next]->(c1:CATEGORY)
    match(c1)-[:main_tag]-(p1:PROBLEM)
    where not (u)-[:solved]-(p1)
    return p1
    order by abs(p.level-p1.level)
}
match(p1)-[:sub_tag]-(c2:CATEGORY)
match(p1)-[:main_tag]-(c1:CATEGORY)
return p1, [c1.name]+ collect(c2.name) limit toInteger($limit)
`;
