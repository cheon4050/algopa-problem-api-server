# 개인 맞춤 코딩테스트 학습 서비스 - 알고파(algopa)

Software Maestro 12기 LIMO팀(이종아, 고동천, 박효진) 서비스 `algopa`의 Back-end 레포지토리입니다.

<br/>

## URL 🚦

- Service : https://algopa-web.vercel.app/
- GitLab: https://git.swmgit.org/swm-12/12_swm06/algopa-problem-api-server

<br/>

## 프로젝트 목표 🍀

- 효율적인 코딩테스트 준비 유도

<br/>

## 주요 기능 소개 ✨

> 1. **코딩테스트 준비 로드맵**
>
>    코딩테스트 출제 경향을 분석하여 제작한 로드맵 을 제공하여, <br/>사용자가 자연스럽게 코딩테스트를 준비할 수 있게 합니다.
>
>    - 어떤 유형부터 공부해야 하는지, 유형마다 어떤 문제들이 있는지 확인할 수 있습니다.
>    - 유형 오답률, 문제 풀이 유무 또한 확인할 수 있습니다. 풀이 이력을 기반으로 표시됩니다.
>      <br/><br/>
>
> 2. **사용자 맞춤 문제 추천**
>
>    사용자 개인에 맞춰 문제를 추천해주어, <br/>사용자가 문제를 고르는 시간을 절약할 수 있게 합니다.
>
>    - 사용자의 실력을 파악해 다음과 같은 문제를 추천합니다.
>      1. 풀이 이력을 종합적으로 고려한 문제
>      2. 최근에 푼 문제 다음으로 풀면 좋은 문제
>      3. 오답률이 높은 유형의 문제
>      4. 적게 푼 유형의 문제
>         <br/><br/>
>
> 3. **문제 풀이 코드 작성 과정 로깅**
>
>    사용자의 코드 작성 과정을 기록해주어, <br/>사용자가 문제 풀이 과정을 리뷰하기 쉽게 합니다.
>
>    - 사용자가 서비스 내에서 문제 풀이 코드를 작성하면 시스템이 자동으로 그 과정을 로그로 저장합니다.
>    - 코드 작성 과정을 재생하여 볼 수 있습니다.
>    - 특정 시점의 코드를 볼 수 있습니다.
>    - 메모 등의 인덱싱을 이용해 원하는 로그를 빠르게 찾을 수 있습니다.
>      <br/><br/>
>
> 4. **문제 풀이 수행 노트**
>
>    사용자가 적은 메모와 해당 시점의 코드 쌍들을 종합해 수행 노트를 만들어주어, <br/>사용자가 문제 풀이 과정을 리뷰하기 쉽게 합니다.
>
>    - 코드 작성 과정 중에, 또는 로그 목록에서 로그를 선택한 후 메모를 남길 수 있습니다.
>    - 사용자가 남긴 메모와 해당 시점의 코드를 종합한 수행 노트 pdf를 확인할 수 있습니다.

<br/>

<br/>

## Description

본 레포지토리는 `algopa`의 Microservice중 **Problem Service**를 구현한 레포지토리입니다.

**Problem**는 API Gateway를 통해서만 접근 가능한 private subnet에 배포/운영됩니다.

**Problem Service**에서는 총 3가지 기능을 제공하고 있습니다.

1. [**Get Roadmap**](src/services/problems/README.md#Get-Roadmap): `GET /problems/v1/roadmap`

   algopa Roadmap 데이터를 가져오는 기능입니다.

2. [**Get Recommendations Problems**](src/services/problems/README.md#Get-Recommendations-Problems): `GET /problems/v1/recommendation?type=[next, less, wrong]&limit=[default=20]`

   추천 타입에 맞는 문제 리스트들을 가져오는 기능입니다.

3. [**Get User History**](src/services/problems/README.md#Get-User-History): `GET /problems/v1/history`

   유저 풀이이력을 가져오는 기능입니다.

## Getting Started

### Development

- Install

  ```bash
  $ npm install
  ```

- Run server

  ```bash
  $ npm run start:dev
  ```

### Production

- Image build

  ```bash
  $ docker build -t algopa-problem .
  ```

- Run container

  ```bash
  $ docker run -p 80:5003 --name algopa-problem -d --rm \
  --env PRETTY_LOG_PRINT=false \
  --env NODE_ENV=prod \
  --env DATABASE_HOST="<<DATABASE HOST>>" \
  --env DATABASE_PORT=7687 \
  --env DATABASE_DB="<<DATABASE DB>>" \
  --env DATABASE_USER="<<DATABASE USER>>" \
  --env DATABASE_PASSWORD="<<DATABASE PASSWORD>>" \
  --env DATABASE_SCHEME=neo4j+s \
  algopa-problem
  ```

## Contributors

**이종아** [@whddk4415](https://github.com/whddk4415)

- 팀장
- Problem Service 구조 설계 및 구현
- API 작성 및 구현

**고동천** [@cheon4050](https://github.com/cheon4050)

- Problem Service 추천 Cypher 구현 및 neo4j 연결
- API 작성 및 구현

