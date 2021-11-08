# 개인 맞춤 코딩테스트 학습 서비스 - 알고파(algopa)

Software Maestro 12기 LIMO팀(이종아, 고동천, 박효진) 서비스 `알고파`의 Back-end 레포지토리입니다.

## URL 🚦

- Service : https://algopa.io/
- GitLab: https://git.swmgit.org/swm-12/12_swm06/algopa-problem-api-server

## 프로젝트 목표 🍀

- 빠른 시간 내에 코딩 테스트에 합격하고자 하는 사람들에게 코딩테스트 준비를 효율적으로 할 수 있게 한다.
- 코딩 테스트 공부 리뷰를 보다 수월하게 할 수 있게 한다.

## 주요 기능 소개 ✨

### 1. **코딩테스트 준비 로드맵**

기업에서 출제하는 코딩테스트 문제들의 출제 경향을 분석하여 제작한 로드맵을 제공하여, 사용자가 자연스럽게 코딩테스트를 준비할 수 있게 합니다.<br/>
효율적인 문제 풀이 순서를 제공하여 코딩 테스트에 투자하는 시간을 줄일 수 있게 합니다.

- 어떤 유형부터 공부해야 하는지, 유형마다 어떤 문제들이 있는지 확인할 수 있습니다.
- 사용자가 취업하길 희망하는 기업에서 자주 출제하는 유형의 문제를 로드맵으로 제공합니다.
- 유형 오답률, 문제 풀이 유무 또한 확인할 수 있습니다. 풀이 이력을 기반으로 표시됩니다.
- 문제를 풀이할 때 마다 풀이 기록이 반영되어 표시됩니다.

### 2. **사용자 맞춤 문제 추천**

사용자 개인의 풀이 이력에 맞춰 문제를 추천해주어, 사용자가 문제를 고르는 시간을 절약할 수 있게 합니다.

- 사용자의 실력은 다음을 고려하여 파악합니다.

  1. 최근에 사용자가 풀이한 문제 20개를 기준으로 계산합니다.
  2. 문제 풀이를 한 문제의 레벨을 기준으로 오답률과 풀이 시간을 고려하여 문제의 레벨에 가중치를 더합니다.
     - 가중치를 매기는 방식
       1. 풀이 시간 1시간 이내 and 오답률 50% 이하 : `+2`
       2. 풀이 시간 1시간 이내 or 오답률 50% 이하 : `+1`
       3. 풀이 시간 1시간 초과 or 오답률 80% 이상 : `-1`
       4. 풀이 시간 1시간 초과 and 오답률 80% 이상 : `-2`
       5. 이외의 경우는 문제의 레벨 그대로 반영
  3. 가중치를 더한 값들의 평균을 낸 값이 사용자의 코딩 테스트 레벨로 정해집니다.
     <br/><br/>

- 사용자의 실력을 파악해 다음과 같은 문제를 추천합니다.

  1. 사용자 코딩 테스트 레벨을 고려한 새로운 유형의 문제
  2. 오답률이 높은 유형의 문제
  3. 진행률이 낮은 유형의 문제
  4. 다음으로 풀면 좋은 문제
     <br/><br/>

- 사용자가 취업을 희망하는 기업이 있다면 해당하는 기업에 따라 자주 출제되는 유형의 맞춤 문제 추천을 제공합니다.

### 3. **문제 풀이 작성 과정 자동 기록**

사용자의 코드 작성 과정을 시스템에서 자동으로 기록해주어, 사용자가 문제 풀이 과정을 리뷰하기 쉽게 합니다.

1. 문제 풀이 과정을 자동으로 시스템에서 기록합니다.

   - 사용자가 에디터에 입력을 시작하면 키 입력 이벤트 들을 `Queue`에 저장합니다.
   - 사용자가 키 입력을 1초 이상 멈추면 `Queue`에 저장된 모든 데이터를 서버에 전송합니다.
   - 서버는 전송받은 데이터를 `Document DB`에 저장합니다.
   - 풀이 과정 중 사용자가 중요하다고 판단되는 시점에 간단한 메모를 입력할 수 있습니다.
     <br/><br/>

2. 사용자는 저장된 풀이 기록을 재생할 수 있습니다.

   - 서버에 저장된 모든 이벤트들을 순회하면서 풀이 과정이 재생되듯이 보여줍니다.
   - 사용자는 풀이 과정이 재생되는 것을 보면서 자신이 풀이 했던 과정을 떠올릴 수 있습니다.
   - 원한다면 풀이 과정 재생 중 특정 시점에 메모를 남길 수 있습니다.
     <br/><br/>

3. 사용자는 저장한 메모를 통해 풀이 과정을 빠르게 탐색할 수 있습니다.
   - 1.과 2.에서 입력한 메모를 선택하면 메모가 작성된 특정 시점으로 빠르게 이동할 수 있습니다.
   - 이 메모를 이용하여 사용자는 풀이 과정을 간단하게 리뷰하는 것이 가능합니다.

### 4. **문제 풀이 노트**

사용자가 별도의 에디터를 활용하여 서비스 이동없이 풀이 과정을 보다 자세하게 기록하여 풀이 과정 리뷰에 도움을 줍니다.

- 텍스트 스타일링을 적용하여 풀이 노트의 가독성을 선택할 수 있습니다.
- [3. 문제 풆이 작성 과정 자동 기록](#3-문제-풀이-작성-과정-자동-기록) 에서 추가한 메모를 풀이 노트에 추가하여 상세 설명 작성의 편의성을 제공합니다.
- 풀이 노트는 임시 저장이 가능하기 때문에 부담없이 풀이 노트를 수정할 수 있습니다.
- 사용자는 자신이 적은 풀이 노트를 보며 틀렸던 접근법이나 새로운 접근법을 상기할 수 있습니다.
- 풀이 노트는 문제마다, 시도 번호마다 작성할 수 있습니다.

## 레포지토리 설명

본 레포지토리는 `알고파`의 Microservice중 **기업 로드맵** 과 **사용자 맞춤 문제 추천** 기능 을 구현한 레포지토리입니다.

**Problem Service**는 AWS API Gateway를 통해서만 접근 가능한 private subnet 에 배포/운영됩니다.

**Problem Service**에서는 총 7가지 기능을 제공하고 있습니다.

1. [**Get Roadmap**](src/services/problems/README.md#GET-Roadmap): `GET /problems/v1/roadmap`

   algopa Roadmap 데이터를 가져오는 기능입니다.

2. [**Get Recommendations Problems**](src/services/problems/README.md#GET-Recommendations-Problems): `GET /problems/v1/recommendation`

   추천 타입에 맞는 문제 리스트들을 가져오는 기능입니다.

3. [**Get User History**](src/services/problems/README.md#GET-User-History): `GET /problems/v1/history`

   유저 풀이이력을 가져오는 기능입니다.

4. [**GET Problem Testcase**](src/services/problems/README.md#GET-Problem-Testcase): `GET /problems/v1/case`

   문제의 테스트케이스를 가져오는 기능입니다.

5. [**GET Problem Info**](src/services/problems/README.md#GET-Problem-Info): `GET /problems/v1/info`

   문제의 정보를 가져오는 기능입니다.

6. [**POST Problem Solving History**](src/services/problems/README.md#POST-Problem-Solving-History): `POST /problems/v1/history`

   사용자가 문제를 푼 데이터를 저장하는 기능입니다.

7. [**POST User Data**](src/services/problems/README.md#POST-User-Data): `POST /problems/v1/initial/history`

   유저의 회원가입 정보를 저장하는 기능입니다.

## 레포지토리 실행 방법

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

- 그래프 DB 설계
- Problem Service 추천 Cypher 구현
- 로드맵 데이터 설계 및 구현
- API 작성 및 구현
