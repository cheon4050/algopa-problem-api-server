# 목차

1. [GET Roadmap](#GET-Roadmap)
2. [GET Recommendations Problems](#GET-Recommendations-Problems)
3. [GET User History](#GET-User-History)
4. [GET Problem Testcase](#GET-Problem-Testcase)
5. [GET Problem Info](GET-Problem-Info)
6. [POST Problem Solving History](#POST-Problem-Solving-History)
7. [POST User Data](#POST-User-Data)

> 본 기능에서는 모든 response의 실제 상태 값은 정상 값(200 or 201)로 통일된다.
>
> 결과의 성공 및 실패는 Response Body의 `success`값으로 결정된다.
>
> 실패할 경우 `success`는 false가 되며 `result`에는 에러 코드와 에러 상태 코드가 담긴다.
>
> 아래에서 설명하는 모든 Response와 Error 객체는 `result`에 담기는 값을 뜻한다.

# GET Roadmap

Roadmap 데이터를 가져오는 기능입니다.

### URL: `problems/v1/roadmap/`

### Method: `GET`

### Headers

- Authorization: 로그인 or 회원가입 시 발급된 JWT 토큰 스트링

### Query Parameters

| Name | Type   | Description      |
| ---- | ------ | ---------------- |
| type | string | 기업 로드맵 타입 |

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
| order        | int    | true     | 카테고리 순서               |
| failureRate  | float  | false    | 유저의 해당 카테고리 오답률 |
| progressRate | float  | false    | 유저의 해당 카테고리 진행률 |
| problemCount | int    | true     | 전체 문제 수                |
| solvedCount  | int    | false    | 푼 문제 수                  |

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
            {
            "nodeId": 397,
            "id": 7490,
            "level": 11,
            "link": "https://www.acmicpc.net/problem/7490",
            "title": "0 만들기",
            "categories": [
                "백 트래킹"
            ],
            "isSolved": false
        },
        {
            "nodeId": 402,
            "id": 1051,
            "level": 8,
            "link": "https://www.acmicpc.net/problem/1051",
            "title": "숫자 정사각형",
            "categories": [
                "완전 탐색"
            ],
            "isSolved": false
        },
    ]
    "categories": [
        {
            "nodeId": 0,
            "name": "구현",
            "order": 1,
            "problemCount": 1,
            "failureRate": 1,
            "progressRate": 0,
            "solvedCount": 0
        },
        {
            "nodeId": 2,
            "name": "완전 탐색",
            "order": 2,
            "problemCount": 5,
            "failureRate": 1,
            "progressRate": 0,
            "solvedCount": 0
        },
        {
            "nodeId": 6,
            "name": "DP",
            "order": 3,
            "problemCount": 2,
            "failureRate": 1,
            "progressRate": 0,
            "solvedCount": 0
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

# GET Recommendations Problems

추천 타입에 맞는 문제 리스트들을 가져오는 기능입니다.

### URL: `problems/v1/recommendation`

### Method: `GET`

### Headers

- Authorization: 로그인 or 회원가입 시 발급된 JWT 토큰 스트링

### Query Parameters

| Name      | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| type      | string | 추천 받을 타입 선택[next, less, wrong] |
| limit     | string | 추천 받을 문제의 개수                  |
| company   | string | 추천 받고 싶은 기업                    |
| problemId | int    | 풀이한 문제 번호                       |

### Response

| Name       | Type     | Required | Description                 |
| ---------- | -------- | -------- | --------------------------- |
| nodeId     | int      | true     | 문제 노드의 고유 ID         |
| number     | int      | true     | 문제 번호                   |
| title      | string   | true     | 문제 제목                   |
| level      | int      | true     | 문제 난이도                 |
| link       | string   | true     | 문제 링크                   |
| categories | string[] | true     | 문제가 속한 카테고리들 이름 |

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

# GET User History

유저의 풀이이력을 가져오는 기능입니다.

### URL: `problems/v1/history`

### Method: `GET`

### Headers

- Authorization: 로그인 or 회원가입 시 발급된 JWT 토큰 스트링

### Response

| Name       | Type     | Required | Description                 |
| ---------- | -------- | -------- | --------------------------- |
| nodeId     | int      | true     | 문제 노드의 고유 ID         |
| number     | int      | true     | 문제 번호                   |
| title      | string   | true     | 문제 제목                   |
| level      | int      | true     | 문제 난이도                 |
| link       | string   | true     | 문제 링크                   |
| tryCount   | int      | true     | 문제 풀이 시도 횟수         |
| date       | date     | true     | 문제 풀이 일시              |
| categories | string[] | true     | 문제가 속한 카테고리들 이름 |

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
  }
]
```

# GET Problem Testcase

문제의 테스트 케이스를 가져오는 기능입니다.

### URL: `problems/v1/case/:id`

### Method: `GET`

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | int  | 문제 id     |

### Response

| Name   | Type     | Required | Description           |
| ------ | -------- | -------- | --------------------- |
| input  | string[] | true     | 테스트 케이스 입력 값 |
| answer | string[] | true     | 테스트 케이스 답      |

#### Example

```json
[
  {
    "input": "3\n1\n4\n5\n7\n9\n6\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30",
    "answer": "2\n8"
  }
]
```

# GET Problem Info

문제의 정보를 가져오는 기능입니다.

### URL: `problems/v1/info/:id`

### Method: `GET`

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | int  | 문제 id     |

### Response

| Name        | Type   | Required | Description          |
| ----------- | ------ | -------- | -------------------- |
| number      | int    | true     | 문제의 고유 id       |
| title       | string | true     | 문제의 제목          |
| link        | string | true     | 문제의 링크          |
| level       | int    | true     | 문제의 난이도        |
| categories  | string | true     | 문제의 카테고리 이름 |
| contentHTML | string | true     | 문제의 본문 HTML     |

#### Example

```json
[
  {
    "id": 2798,
    "level": 4,
    "link": "https://www.acmicpc.net/problem/2798",
    "title": "블랙잭",
    "categories": ["완전 탐색"],
    "contentHTML": "<div class=\"container content\">\n<div class=\"no-print\" style=\"width: 100%;\"><script async=\"\" src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script><ins class=\"adsbygoogle\" data-ad-client=\"ca-pub-8806842758252812\" data-ad-format=\"horizontal\" data-ad-slot=\"1129585289\" style=\"display:block;\"></ins><script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script></div><div class=\"margin-bottom-20 no-print\"></div>\n<div class=\"row\">\n<div class=\"col-md-12\">\n<div id=\"result_log\"></div>\n</div>\n<div class=\"col-md-12\">\n<ul class=\"nav nav-pills no-print problem-menu\"><li class=\"active\">\n<a target=\"_blank\" href=\"https://www.acmicpc.net/problem/2798\">2798번</a>\n</li><li><a target=\"_blank\" href=\"https://www.acmicpc.net/submit/2798\">제출</a></li><li><a target=\"_blank\" href=\"https://www.acmicpc.net/problem/status/2798\">맞은 사람</a></li><li><a target=\"_blank\" href=\"https://www.acmicpc.net/short/status/2798\">숏코딩</a></li><li><a target=\"_blank\" href=\"https://www.acmicpc.net/problem/history/2798\">재채점 결과</a></li><li><a target=\"_blank\" href=\"https://www.acmicpc.net/status?from_problem=1&amp;problem_id=2798\">채점 현황</a></li><li class=\"dropdown\"><a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" id=\"drop5\" role=\"button\">강의<b class=\"caret\"></b></a><ul aria-labelledby=\"drop5\" class=\"dropdown-menu\" id=\"menu2\" role=\"menu\"><li><a class=\"lecture-request\" href=\"#\" tabindex=\"-1\">강의 요청하기</a></li></ul></li></ul>\n</div>\n<div class=\"col-md-12\">\n<div class=\"page-header\">\n<h1><span class=\"printable\">\n\t2798번\n - </span><span id=\"problem_title\">블랙잭</span>\n<span class=\"problem-label problem-label-source\">출처</span><span class=\"problem-label problem-label-multilang\">다국어</span> <div class=\"btn-group pull-right problem-button\">\n</div>\n</h1>\n</div>\n</div>\n<div class=\"col-md-12\"><div class=\"table-responsive\"><table class=\"table\" id=\"problem-info\"><thead><tr><th style=\"width:16%;\">시간 제한</th><th style=\"width:16%;\">메모리 제한</th><th style=\"width:17%;\">제출</th><th style=\"width:17%;\">정답</th><th style=\"width:17%;\">맞은 사람</th><th style=\"width:17%;\">정답 비율</th></tr></thead><tbody><tr><td>1 초 </td><td>128 MB</td><td>74431</td><td>34403</td><td>26854</td><td>45.328%</td></tr></tbody></table></div></div>\n<div id=\"problem-body\">\n<div class=\"col-md-12\">\n<section class=\"problem-section\" id=\"description\">\n<div class=\"headline\">\n<h2>문제</h2>\n</div>\n<div class=\"problem-text\" id=\"problem_description\">\n<p>카지노에서 제일 인기 있는 게임 블랙잭의 규칙은 상당히 쉽다. 카드의 합이 21을 넘지 않는 한도 내에서, 카드의 합을 최대한 크게 만드는 게임이다. 블랙잭은 카지노마다 다양한 규정이 있다.</p>\n<p>한국 최고의 블랙잭 고수 김정인은 새로운 블랙잭 규칙을 만들어 상근, 창영이와 게임하려고 한다.</p>\n<p>김정인 버전의 블랙잭에서 각 카드에는 양의 정수가 쓰여 있다. 그 다음, 딜러는 N장의 카드를 모두 숫자가 보이도록 바닥에 놓는다. 그런 후에 딜러는 숫자 M을 크게 외친다.</p>\n<p>이제 플레이어는 제한된 시간 안에 N장의 카드 중에서 3장의 카드를 골라야 한다. 블랙잭 변형 게임이기 때문에, 플레이어가 고른 카드의 합은 M을 넘지 않으면서 M과 최대한 가깝게 만들어야 한다.</p>\n<p>N장의 카드에 써져 있는 숫자가 주어졌을 때, M을 넘지 않으면서 M에 최대한 가까운 카드 3장의 합을 구해 출력하시오.</p>\n</div>\n</section>\n</div>\n<div class=\"col-md-12\">\n<section class=\"problem-section\" id=\"input\">\n<div class=\"headline\">\n<h2>입력</h2>\n</div>\n<div class=\"problem-text\" id=\"problem_input\">\n<p>첫째 줄에 카드의 개수 N(3 ≤ N ≤ 100)과 M(10 ≤ M ≤ 300,000)이 주어진다. 둘째 줄에는 카드에 쓰여 있는 수가 주어지며, 이 값은 100,000을 넘지 않는 양의 정수이다.</p>\n<p>합이 M을 넘지 않는 카드 3장을 찾을 수 있는 경우만 입력으로 주어진다.</p>\n</div>\n</section>\n</div>\n<div class=\"col-md-12\">\n<section class=\"problem-section\" id=\"output\">\n<div class=\"headline\">\n<h2>출력</h2>\n</div>\n<div class=\"problem-text\" id=\"problem_output\">\n<p>첫째 줄에 M을 넘지 않으면서 M에 최대한 가까운 카드 3장의 합을 출력한다.</p>\n</div>\n</section>\n</div>\n<div class=\"col-md-12\">\n<section class=\"problem-section\" id=\"limit\" style=\"display:none;\">\n<div class=\"headline\">\n<h2>제한</h2>\n</div>\n<div class=\"problem-text\" id=\"problem_limit\">\n</div>\n</section>\n</div>\n<div class=\"col-md-12\">\n<div class=\"row\">\n<div class=\"col-md-6\">\n<section id=\"sampleinput1\">\n<div class=\"headline\">\n<h2>예제 입력 1\n\t\t\t\t\t\t\t<button class=\"btn btn-link copy-button\" data-clipboard-target=\"#sample-input-1\" style=\"padding: 0px;\" type=\"button\">복사</button>\n</h2>\n</div>\n<pre class=\"sampledata\" id=\"sample-input-1\">5 21\n5 6 7 8 9\n</pre>\n</section>\n</div>\n<div class=\"col-md-6\">\n<section id=\"sampleoutput1\">\n<div class=\"headline\">\n<h2>예제 출력 1\n\t\t\t\t\t\t\t<button class=\"btn btn-link copy-button\" data-clipboard-target=\"#sample-output-1\" style=\"padding: 0px;\" type=\"button\">복사</button>\n</h2>\n</div>\n<pre class=\"sampledata\" id=\"sample-output-1\">21\n</pre>\n</section>\n</div>\n</div>\n</div>\n<div class=\"col-md-12\">\n<div class=\"row\">\n<div class=\"col-md-6\">\n<section id=\"sampleinput2\">\n<div class=\"headline\">\n<h2>예제 입력 2\n\t\t\t\t\t\t\t<button class=\"btn btn-link copy-button\" data-clipboard-target=\"#sample-input-2\" style=\"padding: 0px;\" type=\"button\">복사</button>\n</h2>\n</div>\n<pre class=\"sampledata\" id=\"sample-input-2\">10 500\n93 181 245 214 315 36 185 138 216 295\n</pre>\n</section>\n</div>\n<div class=\"col-md-6\">\n<section id=\"sampleoutput2\">\n<div class=\"headline\">\n<h2>예제 출력 2\n\t\t\t\t\t\t\t<button class=\"btn btn-link copy-button\" data-clipboard-target=\"#sample-output-2\" style=\"padding: 0px;\" type=\"button\">복사</button>\n</h2>\n</div>\n<pre class=\"sampledata\" id=\"sample-output-2\">497\n</pre>\n</section>\n</div>\n</div>\n</div>\n<div class=\"col-md-12\">\n<section class=\"problem-section\" id=\"hint\" style=\"display: none;\">\n<div class=\"headline\">\n<h2>힌트</h2>\n</div>\n<div class=\"problem-text\" id=\"problem_hint\">\n</div>\n</section>\n</div>\n<div style=\"display: none;\">\n<div id=\"problem-lang-base64\">W3sicHJvYmxlbV9pZCI6IjI3OTgiLCJwcm9ibGVtX2xhbmciOiIwIiwidGl0bGUiOiJcdWJlMTRcdWI3OTlcdWM3YWQiLCJkZXNjcmlwdGlvbiI6IjxwPlx1Y2U3NFx1YzljMFx1YjE3OFx1YzVkMFx1YzExYyBcdWM4MWNcdWM3N2MgXHVjNzc4XHVhZTMwIFx1Yzc4OFx1YjI5NCBcdWFjOGNcdWM3ODQgXHViZTE0XHViNzk5XHVjN2FkXHVjNzU4IFx1YWRkY1x1Y2U1OVx1Yzc0MCBcdWMwYzFcdWIyZjlcdWQ3ODggXHVjMjdkXHViMmU0LiBcdWNlNzRcdWI0ZGNcdWM3NTggXHVkNTY5XHVjNzc0IDIxXHVjNzQ0IFx1YjExOFx1YzljMCBcdWM1NGFcdWIyOTQgXHVkNTVjXHViM2M0IFx1YjBiNFx1YzVkMFx1YzExYywgXHVjZTc0XHViNGRjXHVjNzU4IFx1ZDU2OVx1Yzc0NCBcdWNkNWNcdWIzMDBcdWQ1NWMgXHVkMDZjXHVhYzhjIFx1YjljY1x1YjRkY1x1YjI5NCBcdWFjOGNcdWM3ODRcdWM3NzRcdWIyZTQuIFx1YmUxNFx1Yjc5OVx1YzdhZFx1Yzc0MCBcdWNlNzRcdWM5YzBcdWIxNzhcdWI5YzhcdWIyZTQgXHViMmU0XHVjNTkxXHVkNTVjIFx1YWRkY1x1YzgxNVx1Yzc3NCBcdWM3ODhcdWIyZTQuPFwvcD5cclxuXHJcbjxwPlx1ZDU1Y1x1YWQ2ZCBcdWNkNWNcdWFjZTBcdWM3NTggXHViZTE0XHViNzk5XHVjN2FkIFx1YWNlMFx1YzIxOCBcdWFlNDBcdWM4MTVcdWM3NzhcdWM3NDAgXHVjMGM4XHViODVjXHVjNmI0IFx1YmUxNFx1Yjc5OVx1YzdhZCBcdWFkZGNcdWNlNTlcdWM3NDQgXHViOWNjXHViNGU0XHVjNWI0IFx1YzBjMVx1YWRmYywgXHVjYzNkXHVjNjAxXHVjNzc0XHVjNjQwIFx1YWM4Y1x1Yzc4NFx1ZDU1OFx1YjgyNFx1YWNlMCBcdWQ1NWNcdWIyZTQuPFwvcD5cclxuXHJcbjxwPlx1YWU0MFx1YzgxNVx1Yzc3OCBcdWJjODRcdWM4MDRcdWM3NTggXHViZTE0XHViNzk5XHVjN2FkXHVjNWQwXHVjMTFjIFx1YWMwMSBcdWNlNzRcdWI0ZGNcdWM1ZDBcdWIyOTQgXHVjNTkxXHVjNzU4IFx1YzgxNVx1YzIxOFx1YWMwMCBcdWM0ZjBcdWM1ZWMgXHVjNzg4XHViMmU0LiBcdWFkZjggXHViMmU0XHVjNzRjLCBcdWI1MWNcdWI3ZWNcdWIyOTQgTlx1YzdhNVx1Yzc1OCBcdWNlNzRcdWI0ZGNcdWI5N2MgXHViYWE4XHViNDUwIFx1YzIyYlx1Yzc5MFx1YWMwMCBcdWJjZjRcdWM3NzRcdWIzYzRcdWI4NWQgXHViYzE0XHViMmU1XHVjNWQwIFx1YjE5M1x1YjI5NFx1YjJlNC4gXHVhZGY4XHViN2YwIFx1ZDZjNFx1YzVkMCBcdWI1MWNcdWI3ZWNcdWIyOTQgXHVjMjJiXHVjNzkwIE1cdWM3NDQgXHVkMDZjXHVhYzhjIFx1YzY3OFx1Y2U1Y1x1YjJlNC48XC9wPlxyXG5cclxuPHA+XHVjNzc0XHVjODFjIFx1ZDUwY1x1YjgwOFx1Yzc3NFx1YzViNFx1YjI5NCBcdWM4MWNcdWQ1NWNcdWI0MWMgXHVjMmRjXHVhYzA0IFx1YzU0OFx1YzVkMCBOXHVjN2E1XHVjNzU4IFx1Y2U3NFx1YjRkYyBcdWM5MTFcdWM1ZDBcdWMxMWMgM1x1YzdhNVx1Yzc1OCBcdWNlNzRcdWI0ZGNcdWI5N2MgXHVhY2U4XHViNzdjXHVjNTdjIFx1ZDU1Y1x1YjJlNC4gXHViZTE0XHViNzk5XHVjN2FkIFx1YmNjMFx1ZDYxNSBcdWFjOGNcdWM3ODRcdWM3NzRcdWFlMzAgXHViNTRjXHViYjM4XHVjNWQwLCBcdWQ1MGNcdWI4MDhcdWM3NzRcdWM1YjRcdWFjMDAgXHVhY2UwXHViOTc4IFx1Y2U3NFx1YjRkY1x1Yzc1OCBcdWQ1NjlcdWM3NDAgTVx1Yzc0NCBcdWIxMThcdWM5YzAgXHVjNTRhXHVjNzNjXHViYTc0XHVjMTFjIE1cdWFjZmMmbmJzcDtcdWNkNWNcdWIzMDBcdWQ1NWMgXHVhYzAwXHVhZTVkXHVhYzhjIFx1YjljY1x1YjRlNFx1YzViNFx1YzU3YyBcdWQ1NWNcdWIyZTQuPFwvcD5cclxuXHJcbjxwPk5cdWM3YTVcdWM3NTggXHVjZTc0XHViNGRjXHVjNWQwIFx1YzM2OFx1YzgzOCBcdWM3ODhcdWIyOTQgXHVjMjJiXHVjNzkwXHVhYzAwIFx1YzhmY1x1YzViNFx1Yzg0Y1x1Yzc0NCBcdWI1NGMsIE1cdWM3NDQgXHViMTE4XHVjOWMwIFx1YzU0YVx1YzczY1x1YmE3NFx1YzExYyBNXHVjNWQwIFx1Y2Q1Y1x1YjMwMFx1ZDU1YyBcdWFjMDBcdWFlNGNcdWM2YjQgXHVjZTc0XHViNGRjIDNcdWM3YTVcdWM3NTggXHVkNTY5XHVjNzQ0IFx1YWQ2Y1x1ZDU3NCBcdWNkOWNcdWI4MjVcdWQ1NThcdWMyZGNcdWM2MjQuPFwvcD5cclxuIiwiaW5wdXQiOiI8cD5cdWNjYWJcdWM5ZjggXHVjOTA0XHVjNWQwIFx1Y2U3NFx1YjRkY1x1Yzc1OCBcdWFjMWNcdWMyMTggTigzICZsZTsmbmJzcDtOICZsZTsmbmJzcDsxMDApXHVhY2ZjIE0oMTAgJmxlOyZuYnNwO00gJmxlOyZuYnNwOzMwMCwwMDApXHVjNzc0IFx1YzhmY1x1YzViNFx1YzljNFx1YjJlNC4gXHViNDU4XHVjOWY4IFx1YzkwNFx1YzVkMFx1YjI5NCBcdWNlNzRcdWI0ZGNcdWM1ZDAgXHVjNGYwXHVjNWVjIFx1Yzc4OFx1YjI5NCBcdWMyMThcdWFjMDAgXHVjOGZjXHVjNWI0XHVjOWMwXHViYTcwLCBcdWM3NzQgXHVhYzEyXHVjNzQwIDEwMCwwMDBcdWM3NDQgXHViMTE4XHVjOWMwIFx1YzU0YVx1YjI5NCBcdWM1OTFcdWM3NTggXHVjODE1XHVjMjE4XHVjNzc0XHViMmU0LjxcL3A+XHJcblxyXG48cD5cdWQ1NjlcdWM3NzQgTVx1Yzc0NCBcdWIxMThcdWM5YzAgXHVjNTRhXHViMjk0IFx1Y2U3NFx1YjRkYyAzXHVjN2E1XHVjNzQ0IFx1Y2MzZVx1Yzc0NCBcdWMyMTggXHVjNzg4XHViMjk0IFx1YWNiZFx1YzZiMFx1YjljYyBcdWM3ODVcdWI4MjVcdWM3M2NcdWI4NWMgXHVjOGZjXHVjNWI0XHVjOWM0XHViMmU0LjxcL3A+XHJcbiIsIm91dHB1dCI6IjxwPlx1Y2NhYlx1YzlmOCBcdWM5MDRcdWM1ZDAgTVx1Yzc0NCBcdWIxMThcdWM5YzAgXHVjNTRhXHVjNzNjXHViYTc0XHVjMTFjIE1cdWM1ZDAgXHVjZDVjXHViMzAwXHVkNTVjIFx1YWMwMFx1YWU0Y1x1YzZiNCBcdWNlNzRcdWI0ZGMgM1x1YzdhNVx1Yzc1OCBcdWQ1NjlcdWM3NDQgXHVjZDljXHViODI1XHVkNTVjXHViMmU0LjxcL3A+XHJcbiIsImhpbnQiOiIiLCJvcmlnaW5hbCI6IjAiLCJodG1sX3RpdGxlIjoiMCIsInByb2JsZW1fbGFuZ190Y29kZSI6IktvcmVhbiJ9LHsicHJvYmxlbV9pZCI6IjI3OTgiLCJwcm9ibGVtX2xhbmciOiIxIiwidGl0bGUiOiJKQUNLIiwiZGVzY3JpcHRpb24iOiI8cD5JbiAmbGRxdW87QmxhY2tqYWNrJnJkcXVvOywgYSBwb3B1bGFyIGNhcmQgZ2FtZSwgdGhlIGdvYWwgaXMgdG8gaGF2ZSBjYXJkcyB3aGljaCBzdW0gdXAgdG8gbGFyZ2VzdCBudW1iZXIgbm90IGV4Y2VlZGluZyAyMS4gTWlya28gY2FtZSB1cCB3aXRoIGhpcyBvd24gdmVyc2lvbiBvZiB0aGlzIGdhbWUuPFwvcD5cclxuXHJcbjxwPkluIE1pcmtvXHUyMDFmcyBnYW1lLCBjYXJkcyBoYXZlIHBvc2l0aXZlIGludGVnZXJzIHdyaXR0ZW4gb24gdGhlbS4gVGhlIHBsYXllciBpcyBnaXZlbiBhIHNldCBvZiBjYXJkcyBhbmQgYW4gaW50ZWdlciBNLiBIZSBtdXN0IGNob29zZSB0aHJlZSBjYXJkcyBmcm9tIHRoaXMgc2V0IHNvIHRoYXQgdGhlaXIgc3VtIGNvbWVzIGFzIGNsb3NlIGFzIHBvc3NpYmxlIHRvIE0gd2l0aG91dCBleGNlZWRpbmcgaXQuIFRoaXMgaXMgbm90IGFsd2F5cyBlYXN5IHNpbmNlIHRoZXJlIGNhbiBiZSBhIGh1bmRyZWQgb2YgY2FyZHMgaW4gdGhlIGdpdmVuIHNldC48XC9wPlxyXG5cclxuPHA+SGVscCBNaXJrbyBieSB3cml0aW5nIGEgcHJvZ3JhbSB0aGF0IGZpbmRzIHRoZSBiZXN0IHBvc3NpYmxlIG91dGNvbWUgb2YgZ2l2ZW4gZ2FtZS48XC9wPlxyXG4iLCJpbnB1dCI6IjxwPlRoZSBmaXJzdCBsaW5lIG9mIGlucHV0IGNvbnRhaW5zIGFuIGludGVnZXIgTiAoMyAmbGU7IE4gJmxlOyAxMDApLCB0aGUgbnVtYmVyIG9mIGNhcmRzLCBhbmQgTSAoMTAgJmxlOyBNICZsZTsgMzAwIDAwMCksIHRoZSBudW1iZXIgdGhhdCB3ZSBtdXN0IG5vdCBleGNlZWQuPFwvcD5cclxuXHJcbjxwPlRoZSBmb2xsb3dpbmcgbGluZSBjb250YWlucyBudW1iZXJzIHdyaXR0ZW4gb24gTWlya29cdTIwMWZzIGNhcmRzOiBOIGRpc3RpbmN0IHNwYWNlLXNlcGFyYXRlZCBwb3NpdGl2ZSBpbnRlZ2VycyBsZXNzIHRoYW4gMTAwIDAwMC48XC9wPlxyXG5cclxuPHA+VGhlcmUgd2lsbCBhbHdheXMgZXhpc3Qgc29tZSB0aHJlZSBjYXJkcyB3aG9zZSBzdW0gaXMgbm90IGdyZWF0ZXIgdGhhbiBNLjxcL3A+XHJcbiIsIm91dHB1dCI6IjxwPlRoZSBmaXJzdCBhbmQgb25seSBsaW5lIG9mIG91dHB1dCBzaG91bGQgY29udGFpbiB0aGUgbGFyZ2VzdCBwb3NzaWJsZSBzdW0gd2UgY2FuIG9idGFpbi48XC9wPlxyXG5cclxuPHA+Jm5ic3A7PFwvcD5cclxuIiwiaGludCI6IiIsIm9yaWdpbmFsIjoiMSIsImh0bWxfdGl0bGUiOiIwIiwicHJvYmxlbV9sYW5nX3Rjb2RlIjoiRW5nbGlzaCJ9XQ==</div>\n</div>\n</div>\n<div class=\"col-md-12\"><section id=\"source\"><div class=\"headline\"><h2>출처</h2></div><p><a target=\"_blank\" href=\"https://www.acmicpc.net/category/45\">Contest</a> &gt; <a target=\"_blank\" href=\"https://www.acmicpc.net/category/17\">Croatian Open Competition in Informatics</a> &gt; <a target=\"_blank\" href=\"https://www.acmicpc.net/category/19\">COCI 2011/2012</a> &gt; <a target=\"_blank\" href=\"https://www.acmicpc.net/category/detail/73\">Contest #6</a> 1번</p><ul><li>문제를 번역한 사람: <a target=\"_blank\" href=\"https://www.acmicpc.net/user/baekjoon\">baekjoon</a></li><li>빠진 조건을 찾은 사람: <a target=\"_blank\" href=\"https://www.acmicpc.net/user/bupjae\">bupjae</a></li><li>문제의 오타를 찾은 사람: <a target=\"_blank\" href=\"https://www.acmicpc.net/user/eric00513\">eric00513</a>, <a target=\"_blank\" href=\"https://www.acmicpc.net/user/joonas\">joonas</a>, <a target=\"_blank\" href=\"https://www.acmicpc.net/user/otter66\">otter66</a></li></ul></section></div>\n</div>\n<div class=\"margin-bottom-20\"></div>\n<div class=\"no-print\" style=\"width: 100%;\"><script async=\"\" src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script><ins class=\"adsbygoogle\" data-ad-client=\"ca-pub-8806842758252812\" data-ad-format=\"auto\" data-ad-slot=\"1129585289\" style=\"display:block;\"></ins><script>\n(adsbygoogle = window.adsbygoogle || []).push({});\n</script></div><div class=\"margin-bottom-20 no-print\"></div>\n</div>"
  }
]
```

# POST Problem Solving history

문제 풀이 데이터를 그래프 DB에 저장하는 기능입니다.

### URL: `problems/v1/history/:id`

### Method: `POST`

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id   | int  | 문제 id     |

### Request

| Name            | Type    | Required | Description                  |
| --------------- | ------- | -------- | ---------------------------- |
| language        | string  | true     | 문제 풀이에 사용한 언어      |
| success         | boolean | true     | 전체 테스트 케이스 성공 여부 |
| isSolved        | boolean | true     | 전체 테스트 케이스 정답 여부 |
| result          | string  | true     | 테스트 케이스 채점 결과      |
| submitTimestamp | date    | true     | 코드 제출 날짜               |
| executedTime    | int[]   | true     | 코드 실행 시간               |
| memoryUsage     | int[]   | false    | 코드 실행 메모리 크기        |

#### Example

```json
{
  "language": "python",
  "success": true,
  "result": "맞았습니다!",
  "isSolved": true,
  "submitTimestamp": "2021-09-17T22:10:10",
  "solvedTime": 3600,
  "executedTime": 100
}
```

# POST User Data

유저 회원가입 데이터를 저장하는 기능입니다.

### URL: `problems/v1/initial/history`

### Method: `POST`

### Request

| Name             | Type     | Required | Description             |
| ---------------- | -------- | -------- | ----------------------- |
| email            | string   | true     | 유저 이메일             |
| provider         | string   | true     | 소셜 로그인 인증 사이트 |
| desiredCompanies | string[] | true     | 유저의 희망 기업 리스트 |

#### Example

```json
{
  "email": "cheon4050@gmail.com",
  "provider": "google",
  "desiredCompanies": ["kakao", "samsung"]
}
```
