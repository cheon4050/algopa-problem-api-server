export const RECOMMEND_DEFAULT_PROBLEM = `
    match (c:CATEGORY)
    CALL{
        with c
        match(c)<-[:main_tag]-(p:PROBLEM)
        where p.level <= 10
        return p limit 1
    }
    match(p)-[:sub_tag]-(c2:CATEGORY)
    return p, [c.name]+collect(c2.name), rand() as ra 
    order by ra limit toInteger($limit)
`;

export const GET_RECENT_SOLVED_PROBLEMS = `
    match(u:USER {email: $email, provider: $provider})-[r:solved]->(p:PROBLEM)
    return p.id
    order by r.date desc limit 10
`;

export const RECOMMEND_FIRST_PROBLEM = `
call{
    match (p:PROBLEM)-[r:solved]-(u:USER {email: $email, provider: $provider})
    return p
    order by r.date desc limit 10
}
with collect(p.level) as plevel, count(p) as  pcount
with toIntegerList([x in plevel where x > 10|x*1.2]+[x in plevel where x <= 10]) as plist, pcount
with reduce(total = 0, n IN plist | total + n)/pcount as UserLevel
match(p:PROBLEM)-[:main_tag]->(c:CATEGORY),(p)-[:sub_tag]-(c2:CATEGORY), (u:USER {email: $email, provider: $provider})
where not (p)<-[:solved]-(u)
return p, [c.name]+collect(c2.name), p.level, UserLevel
order by abs(p.level-UserLevel) limit toInteger($limit)
`;
//다음으로 풀면 좋은 문제 추천
export const RECOMMEND_NEXT_PROBLEM = `
match(u:USER {email:$email, provider: $provider})
call{
    with u
    match(u)-[r:solved]->(p:PROBLEM)
    // where (p)-[:recommend]-(:COMPANY{name:$company})
    return p
    order by r.date desc limit 10
}
call{
    with p, u
    match(p)-[r:solved]-(u), (p)-[:main_tag]->(c:CATEGORY), (c)<-[:main_tag]-(p1:PROBLEM)
    with p, max(p1.level) as maxlevel, c, u, r
    where p.level = maxlevel   
    match (c)-[:next]->(c1:CATEGORY)<-[:main_tag]-(p1:PROBLEM)
    where not (p1)<-[:solved]-(u) and p1.level <=p.level
    return p1, r.date as rdate, c1
    order by abs(p1.level-p.level) limit 2
    union
    with p, u
    match(p)-[r:solved]-(u)
    where r.try >= 4
    match(p)-[:main_tag]->(c:CATEGORY), (c)<-[:main_tag]-(p1:PROBLEM)
    where p.level > p1.level
    return p1, r.date as rdate, c as c1
    order by p1.level desc limit 2
    union
    with p, u
    match(p)-[r:solved]-(u)
    where r.try < 4
    match(p)-[:main_tag]->(c:CATEGORY), (c)<-[:main_tag]-(p1:PROBLEM)
    where p.level <= p1.level
    return p1, r.date as rdate, c as c1
    order by p1.level limit 2
}
match(p1)-[:main_tag]-(c1:CATEGORY)
optional match(p1)-[:sub_tag]-(c2:CATEGORY)
return distinct p1, [c1.name]+collect(c2.name), rdate
order by rdate desc limit toInteger($limit)
`;

//이전 버전 다음으로 풀면 좋은 문제 추천
// export const RECOMMEND_NEXT_PROBLEM = `
//     match (p:PROBLEM {id: $problem_number})-[:main_tag]->(c:CATEGORY), (u:USER {email: $email, provider: $provider})
//     match (p1:PROBLEM)-[:main_tag]->(c)
//     where p.level <= p1.level and not (u)-[:solved]->(p1)
//     return p1
//     union
//     match(p:PROBLEM {id:$problem_number})-[:main_tag]->(c:CATEGORY),(c:CATEGORY)-[:next]->(c1:CATEGORY), (u:USER {email: $email, provider: $provider})
//     match(c1)<-[:main_tag]-(p2:PROBLEM)
//     where not (u)-[:solved]->(p2)
//     return p2 as p1
// `;

//진행률이 낮은 문제 추천
export const RECOMMEND_LESS_PROBLEM = `
match(u:USER {email: $email, provider: $provider})
// 진행률이 낮은 유형순으로 유형 정렬
call{
    with u
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:solved]-(u) 
    with collect(c.name) as name
    match(c1:CATEGORY)
    where not c1.name in name
    return c1 as c
    order by c.order
    union
    with u
    match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:solved]-(u)
    with count(p) as p1, c, u
    match(c)<-[r:main_tag]-(p)
    with p1/tofloat(count(r)) as progress, c, u
    match (c)<-[:main_tag]-(p)
    match(u)
    where not (u)-[:solved]->(p)
    return c
    order by progress, c.order 
}
with distinct c, u
// where (c)-[:past]->(:COMPANY{name:$company})
//유저 레벨 계산
call{
    with c, u
    match (p:PROBLEM)-[r:solved]-(u)
    with p
    order by r.date desc limit 10
    with collect(p.level) as plevel, count(p) as  pcount
    with toIntegerList([x in plevel where x > 10|x*1.2]+[x in plevel where x <= 10]) as plist, pcount
    return reduce(total = 0, n IN plist | total + n)/pcount as UserLevel
}
// 유저 레벨에 맞는 문제 추천
call{
    with c, u, UserLevel
    match (p:PROBLEM)-[:main_tag]-(c)
    where not (p)-[:solved]-(u)
    return p, c as c1
    order by abs(p.level-UserLevel) limit 3
}
// 서브태그 찾기
optional match(p)-[:sub_tag]-(c2:CATEGORY)
return p, [c1.name]+collect(c2.name) limit toInteger($limit)`;

// 이전 버전 진행률이 낮은 문제 추천
// export const RECOMMEND_LESS_PROBLEM = `
//     match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider})
//     with collect(c.name) as name
//     match(c1:CATEGORY)
//     where not c1.name in name
//     match(c1)<-[:main_tag]-(p:PROBLEM)
//     return p, c1 as c
//     order by c1.order
//     union
//     match(c:CATEGORY)<-[r:main_tag]-(p:PROBLEM)<-[:solved]-(u:USER {email: $email, provider: $provider})
//     with count(p) as p1, c
//     match(c)<-[r:main_tag]-(p)
//     with p1/tofloat(count(r)) as progress, c
//     match (c)<-[:main_tag]-(p)
//     match(u:USER {email: $email, provider: $provider})
//     where not (u)-[:solved]->(p)
//     return p, c
//     order by progress, c.order
// `;

// 희망 기업 맞춤 문제 추천
export const RECOMMEND_DESIREDCOMPANY_PROBLEM = `
//희망 기업 기출 유형들 선정
match(u:USER{email: $email, provider: $provider}),(co:COMPANY{name:$company})<-[:past]-(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
with distinct c, u, rand() as ra
order by ra
with distinct c, u
//유저 레벨 계산
call{
    with c, u
    match (p:PROBLEM)-[r:solved]-(u)
    with p
    order by r.date desc limit 10
    with collect(p.level) as plevel, count(p) as  pcount
    with toIntegerList([x in plevel where x > 10|x*1.2]+[x in plevel where x <= 10]) as plist, pcount
    return reduce(total = 0, n IN plist | total + n)/pcount as UserLevel
}
// 유저 레벨에 맞는 문제 추천
call{
    with c, u, UserLevel
    match (p:PROBLEM)-[:main_tag]-(c)
    where not (p)-[:solved]-(u)
    return p, c as c1
    order by abs(p.level-UserLevel) limit 3
}
// 서브태그 찾기
optional match(p)-[:sub_tag]-(c2:CATEGORY)
return p, [c1.name]+collect(c2.name) limit toInteger($limit)
`;

//이전 버전 희망 기업 맞춤 문제 추천
// export const RECOMMEND_DESIREDCOMPANY_PROBLEM = `
//     match(u:USER{email: $email, provider: $provider}),(co:COMPANY{name:$company})<-[:past]-(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
//     where not (p)<-[:solved]-(u)
//     with p.id as pi ,rand() as ra, c, p
//     return p, c
//     order by ra limit toInteger($limit)
// `;

// 오답률이 높은 문제 추천
export const RECOMMEND_WRONG_PROBLEM = `
match(u:USER {email: $email, provider: $provider})
// 오답률이 큰 유형순으로 유형 정렬
call{
    with u
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[r:solved]-(u)
    return 1-toFloat(count(r))/sum(r.try) as failureRate, c
    order by failureRate desc
    union
    with u
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[:solved]-(u)
    with collect(c) as clist
    match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)
    where not c in clist
    return distinct 0 as failureRate, c
}
with distinct c, u
// where (c)-[:past]->(:COMPANY{name:$company})
//유저 레벨 계산
call{
    with c, u
    match (p:PROBLEM)-[r:solved]-(u)
    with p
    order by r.date desc limit 10
    with collect(p.level) as plevel, count(p) as  pcount
    with toIntegerList([x in plevel where x > 10|x*1.2]+[x in plevel where x <= 10]) as plist, pcount
    return reduce(total = 0, n IN plist | total + n)/pcount as UserLevel
}
// 유저 레벨에 맞는 문제 추천
call{
    with c, u, UserLevel
    match (p:PROBLEM)-[:main_tag]-(c)
    where not (p)-[:solved]-(u)
    return p, c as c1
    order by abs(p.level-UserLevel) limit 3
}
// 서브태그 찾기
optional match(p)-[:sub_tag]-(c2:CATEGORY)
return p, [c1.name]+collect(c2.name) limit toInteger($limit)
`;
// 이전 버전 오답률 높은문제 추천
// export const RECOMMEND_WRONG_PROBLEM = `
//     match(u:USER {email: $email, provider: $provider})
//     match(c:CATEGORY)<-[:main_tag]-(p:PROBLEM)<-[r:solved]-(u)
//     with toFloat(count(r))/sum(r.try) as failureRate, c
//     match (c)<-[:main_tag]-(p)
//     match(u:USER {email: $email, provider: $provider})
//     where not (u)-[:solved]->(p)
//     return p, c
//     order by failureRate limit toInteger($limit)
// `;

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
return p1, [c1.name]+ collect(c2.name) limit toInteger($limit/2)
`;
