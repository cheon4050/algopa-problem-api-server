# 목차

1. [Get Roadmap](#Get Roadmap)
2. [Get Recommendations Problems](#Get Recommendations Problems)
3. [Get User History](#Get User History)

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

### Headers

- Authorization: 소셜 제공 업자<small>provider</small>에게서 얻은 Auth Code
                email, provider 전달

### Authorization이 없는 경우

### Headers

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
|          |        |                   |


### Response

| Name        | Type   | Required | Description                   |
| ----------- | ------ | -------- | ----------------------------- |
| problems    | Array  | true     | 로드맵 문제 정보       |
| categories  | Array  | true     | 로드맵 카테고리 정보 |
| edges       | Array  | true     | 로드맵 relationships 정보 |


#### Example

```json
{
    "problems": [
        {
            "nodeId": 26,
            "number": 2748,
            "level": 5,
            "link": "https://www.acmicpc.net/problem/2748",
            "title": "피보나치 수 2",
            "categories": ["DP"]
        },
        {
            "nodeId": 27,
            "number": 14501,
            "level": 7,
            "link": "https://www.acmicpc.net/problem/14501",
            "title": "퇴사",
            "categories": ["DP"]
        },
    "categories": [
        {
            "nodeId": 12,
            "name": "트리",
        },
        {
            "nodeId": 7,
            "name": "그리디",
        },
        {
            "nodeId": 18,
            "name": "최단경로",
        },
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

### Authorization이 있는 경우

### Headers

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| email    | string | 유저의 소셜 계정 이메일                     |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 | 

### Response

| Name        | Type   | Required | Description                   |
| ----------- | ------ | -------- | ----------------------------- |
| problems    | Array  | true     | 로드맵 문제 정보       |
| categories  | Array  | true     | 로드맵 카테고리 정보 |
| edges       | Array  | true     | 로드맵 relationships 정보 |

#### Example

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


### Error

1. 401: `Unauthorized`

   - Authorization에 담긴 Code가 잘못된 경우 발생한다.

     **Example**

     ```json
     {
       "code": "INVALID_SOCIAL_TOKEN",
       "statusCode": 401
     }
     ```

2. 400: `Bad Request`

   - 잘못된 provider가 온 경우 발생한다.

     **Example**

     ```json
     {
       "code": "INVALID_PROVIDER",
       "statusCode": 400
     }
     ```


# Get Recommendations Problems

추천 타입에 맞는 문제 리스트들을 가져오는 기능입니다.
### URL: `problems/v1/recommendation?type=[next, less, wrong]&limit=[default=20]`

### Method: `GET`

### Headers

- Authorization: 소셜 제공 업자<small>provider</small>에게서 얻은 Auth Code
                email, provider 전달

### Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| type     | string | 추천 받을 타입 선택[next, less, wrong] |
| limit    | string | 추천 받을 문제의 개수           |

### Response

| Name        | Type   | Required | Description                   |
| ----------- | ------ | -------- | ----------------------------- |
| nodeId      | int    | true     | 문제 node의 고유 id       |
| number      | int    | true     | 백준 문제의 고유 number    |
| title       | string | true     | 문제의 제목          |
| level       | number | true     | 문제의 난이도         |
| link        | string | true     | 문제의 링크          |
| categories  | Array  | true     | 문제 카테고리        |

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
        "title": "피보나치 수 2
        "categories": ["DP"]
    }
]
```

### Error

1. 401: `Unauthorized`

   - Authorization에 담긴 Code가 잘못된 경우 발생한다.

     **Example**

     ```json
     {
       "code": "INVALID_SOCIAL_TOKEN",
       "statusCode": 401
     }
     ```

2. 400: `Bad Request`

   - 잘못된 provider가 온 경우 발생한다.

     **Example**

     ```json
     {
       "code": "INVALID_PROVIDER",
       "statusCode": 400
     }
     ```

# Verificate a token

JWT가 정상적인지 확인하는 기능입니다.

### URL: `auth/v1/verification/token`

### Method: `POST`

### Request

| Name           | Type    | Required | Description                                  |
| -------------- | ------- | -------- | -------------------------------------------- |
| token          | string  | true     | 정상인지 확인하기 위한 JWT 토큰              |
| isRefreshToken | boolean | false    | JWT가 Refresh Token인지 여부, default: false |

### Response

| Name     | Type   | Required | Description                                       |
| -------- | ------ | -------- | ------------------------------------------------- |
| email    | string | true     | 유저의 email                                      |
| provider | string | true     | 유저 계정의 소셜 제공 업체, google, github중 하나 |

#### Example

```json
{
  "email": "whddk4415@gmail.com",
  "provider": "google"
}
```

### Error

1. 400: `Bad Request`

   - JWT가 정의된 secret 키 값으로 디코딩이 되지 않는 경우 발생한다.

     **Example**

     ```json
     {
       "code": "INVALID_ACCESS_TOKEN",
       "statusCode": 400
     }
     ```

     ```json
     {
       "code": "INVALID_REFRESH_TOKEN",
       "statusCode": 400
     }
     ```

2. 401: `Unauthorized`

   - JWT가 만료된 경우 발생한다.

     **Example**

     ```json
     {
       "code": "EXPIRED_ACCESS_TOKEN",
       "statusCode": 401
     }
     ```

     ```json
     {
       "code": "EXPIRED_REFRESH_TOKEN",
       "statusCode": 401
     }
     ```

# Get User History

User의 풀이이력을 가져오는 기능입니다.

### URL: `auth/v1/sign/token`

### Method: `POST`

### Request

| Name           | Type    | Required | Description                                       |
| -------------- | ------- | -------- | ------------------------------------------------- |
| email          | string  | true     | 유저의 이메일                                     |
| provider       | string  | true     | 유저 계정의 소셜 제공 업체, google, github중 하나 |
| isRefreshToken | boolean | false    | 변환할 JWT가 refresh token인지 여부               |

### Response

| Name  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| token | string | true     | 변환된 JWT  |

#### Example

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndoZGRrNDQxNUBnbWFpbC5jb20iLCJwcm92aWRlciI6Imdvb2dsZSIsImlhdCI6MTYyNjQ0MTQzOCwiZXhwIjoxNjI2NTI3ODM4fQ"
}
```

