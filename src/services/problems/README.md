# 목차

1. [Get Roadmap](#Get-Roadmap)
2. [Get Recommendations Problems](#Get-Recommendations-Problems)
3. [Get User History](#Get-User-History)

> 본 기능에서는 모든 response의 실제 상태 값은 정상 값(200 or 201)로 통일된다.
>
> 결과의 성공 및 실패는 Response Body의 `success`값으로 결정된다.
>
> 실패할 경우 `success`는 false가 되며 `result`에는 에러 코드와 에러 상태 코드가 담긴다.
>
> 아래에서 설명하는 모든 Response와  Error 객체는 `result`에 담기는 값을 뜻한다.

# Get Roadmap

Roadmap 데이터를 가져오는 기능입니다.

### URL: `problems/v1/roadmap`

### Method: `GET`

### Query Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| email    | string | 유저의 소셜 계정 이메일                     |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 | 

### Response

| Name       | Type     | Required | Description                      |
| ---------- | -------- | -------- | -------------------------------- |
| problems   | object[] | true     | 문제 정보를 담은 객체 리스트     |
| categories | object[] | true     | 카테고리 정보를 담은 객체 리스트 |
| edges      | object[] | true     | 연결 정보를 담은 객체 리스트     |

#### Problem Object

| Name       | Type     | Required | Description                 |
| ---------- | -------- | -------- | --------------------------- |
| nodeId     | int      | true     | 문제 노드의 고유 ID         |
| number     | int      | true     | 문제 번호                   |
| title      | string   | true     | 문제 제목                   |
| level      | int      | true     | 문제 난이도                 |
| link       | string   | true     | 문제 링크                   |
| isSolved   | boolean  | false    | 문제 풀이 여부              |
| categories | string[] | true     | 문제가 속한 카테고리들 이름 |

#### Category Object

| Name         | Type   | Required | Description                 |
| ------------ | ------ | -------- | --------------------------- |
| nodeId       | int    | true     | 카테고리 노드의 고유 ID     |
| name         | string | true     | 카테고리 이름               |
| failureRate  | float  | false    | 유저의 해당 카테고리 오답률 |
| progressRate | float  | false    | 유저의 해당 카테고리 진행률 |

#### Edge Object

| Name | Type   | Required | Description                        |
| ---- | ------ | -------- | ---------------------------------- |
| type | string | true     | 연결 관계의 타입, next, in 중 하나 |
| from | int    | true     | 연결이 시작되는 노드의 고유 ID     |
| to   | int    | true     | 연결이 끝나는 노드의 고유 ID       |

#### Example

##### Roadmap
```json
{
    "problems": [
        {
            "nodeId": 26,
            "number": 2748,
            "level": 5,
            "link": "https://www.acmicpc.net/problem/2748",
            "title": "피보나치 수 2",
            "isSolved": true
            "categories": ["DP"]
        },
        {
            "nodeId": 27,
            "number": 14501,
            "level": 7,
            "link": "https://www.acmicpc.net/problem/14501",
            "title": "퇴사",
            "isSolved": true
            "categories": ["DP"]
        },
    ]
    "categories": [
        {
            "nodeId": 12,
            "name": "트리",
            "failureRate": 0.125,
            "progressRate": 0.3333333333333333
        },
        {
            "nodeId": 7,
            "name": "그리디",
            "failureRate": 0.5,
            "progressRate": 1
        },
        {
            "nodeId": 18,
            "name": "최단경로",
            "failureRate": 0.21428571428571427,
            "progressRate": 1
        },
    ]
    "edges": [
        {
            "from": 0,
            "to": 5,
            "type": "next"
        },
        {
            "from": 1,
            "to": 3,
            "type": "next"
        },
        {
            "from": 93,
            "to": 21,
            "type": "IN"
        },
    ]
}

```



# Get Recommendations Problems

추천 타입에 맞는 문제 리스트들을 가져오는 기능입니다.

### URL: `problems/v1/recommendation`

### Method: `GET`

### Query Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| email    | string | 유저의 소셜 계정 이메일                     |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 | 
| type     | string | 추천 받을 타입 선택[next, less, wrong] |
| limit    | string | 추천 받을 문제의 개수           |

### Response

| Name        | Type     | Required | Description                   |
| ----------- | -------- | -------- | ----------------------------- |
| nodeId      | int      | true     | 문제 노드의 고유 ID         |
| number      | int      | true     | 문제 번호                   |
| title       | string   | true     | 문제 제목                   |
| level       | int      | true     | 문제 난이도                 |
| link        | string   | true     | 문제 링크                   |
| categories  | string[] | true     | 문제가 속한 카테고리들 이름 |

#### Example

```json
[
    {
        "nodeId": 31,
        "number": 2753,
        "level": 2,
        "link": "https://www.acmicpc.net/problem/2753",
        "title": "윤년",
        "categories": ["구현"]
    },
    {
        "nodeId": 37,
        "number": 2231,
        "level": 4,
        "link": "https://www.acmicpc.net/problem/2231",
        "title": "분해합",
        "categories": ["완전 탐색"]
    },
    {
        "nodeId": 38,
        "number": 2798,
        "level": 4,
        "link": "https://www.acmicpc.net/problem/2798",
        "title": "블랙잭",
        "categories": ["완전 탐색"]
    },
    {
        "nodeId": 26,
        "number": 2748,
        "level": 5,
        "link": "https://www.acmicpc.net/problem/2748",
        "title": "피보나치 수 2",
        "categories": ["DP"]
    }
]
```

### Error

1. 401: `Unauthorized`

   - type을 보냈지만 Access Token이 없는 경우 발생한다.

     **Example**

     ```json
     {
		"message" : "Access by users who are not logged in.",
        "code" : "UNAUTHORIZED_USER"
     }
     ```


# Get User History

유저의 풀이이력을 가져오는 기능입니다.

### URL: `problems/v1/history`

### Method: `GET`

### Query Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| email    | string | 유저의 소셜 계정 이메일                     |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 | 

### Response

| Name        | Type     | Required | Description                   |
| ----------- | -------- | -------- | ----------------------------- |
| nodeId      | int      | true     | 문제 노드의 고유 ID      |
| number      | int      | true     | 문제 번호               |
| title       | string   | true     | 문제 제목              |
| level       | int      | true     | 문제 난이도             |
| link        | string   | true     | 문제 링크              |
| tryCount    | int      | true     | 문제 풀이 시도 횟수       |
| date        | date     | true     | 문제 풀이 일시            |
| categories  | string[] | true     | 문제가 속한 카테고리들 이름  |

#### Example

```json
[
    {
        "nodeId": 28,
        "number": 2156,
        "level": 10,
        "link": "https://www.acmicpc.net/problem/2156",
        "title": "포도주 시식",
        "tryCount": 3,
        "date": "2021-4-1",
        "categories": ["DP"]
    },
    {
        "nodeId": 62,
        "number": 2263,
        "level": 13,
        "link": "https://www.acmicpc.net/problem/2263",
        "title": "트리의 순회",
        "tryCount": 8,
        "date": "2021-3-18",
        "categories": ["트리"]
    },
    {
        "nodeId": 36,
        "number": 11729,
        "level": 9,
        "link": "https://www.acmicpc.net/problem/11729",
        "title": "하노이 탑 이동 순서",
        "tryCount": 1,
        "date": "2021-1-28",
        "categories": ["재귀"]
    },
    {
        "nodeId": 39,
        "number": 2503,
        "level": 6,
        "link": "https://www.acmicpc.net/problem/2503",
        "title": "숫자 야구",
        "tryCount": 1,
        "date": "2021-7-7",
        "categories": ["완전 정복탐색"]
    },
    {
        "nodeId": 76,
        "number": 2667,
        "level": 10,
        "link": "https://www.acmicpc.net/problem/2667",
        "title": "단지번호붙이기",
        "tryCount": 2,
        "date": "2021-2-4",
        "categories": ["DFS"]
    },
]
```

### Error

1. 401: `Unauthorized`

   - Authorization이 없으면 발생한다.

     **Example**

     ```json
     {
        "code" : "UNAUTHORIZED_USER"
     }
     ```
    


