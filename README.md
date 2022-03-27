# 개인 맞춤 코딩테스트 학습 서비스 - 알고파(algopa)

Software Maestro 12기 LIMO팀(이종아, 고동천, 박효진) 서비스 `알고파`의 문제 추천 서버 레포지토리입니다.

## 알고파 주요 기능 소개 ✨

### 1. **코딩테스트 준비 로드맵**

기업에서 출제하는 코딩테스트 문제들의 출제 경향을 분석하여 제작한 로드맵을 제공하여, 사용자가 자연스럽게 코딩테스트를 준비할 수 있게 합니다.

### 2. **사용자 맞춤 문제 추천**

사용자 개인의 풀이 이력에 맞춰 문제를 추천해주어, 사용자가 문제를 고르는 시간을 절약할 수 있게 합니다.

### 3. **문제 풀이 작성 과정 자동 기록**

사용자의 코드 작성 과정을 시스템에서 자동으로 기록해주어, 사용자가 문제 풀이 과정을 리뷰하기 쉽게 합니다.

### 4. **문제 풀이 노트**

사용자가 별도의 에디터를 활용하여 서비스 이동없이 풀이 과정을 보다 자세하게 기록하여 풀이 과정 리뷰에 도움을 줍니다.

## 기술 스택 🛠

- Typescript
- Nest.js
- Neo4j
- AWS EC2

## 서비스 영상 :movie_camera:
[영상 링크](https://youtu.be/2iba6R8PK_Q)

## 프로젝트 참여자 👷

**이종아** [@whddk4415](https://github.com/whddk4415)
- 서비스 기획
- 인증 서버 구현
- 풀이 과정 기록 및 노트 서버 구현
- 인증, 풀이 과정 기록 서버 API 설계
- 코드 실행 기능 구현
- 문제 추천 및 로드맵 서버 초기 설계
- AWS 인프라 구축

**고동천** [@cheon4050](https://github.com/cheon4050)
- 서비스 기획
- 코딩테스트 문제 분석 및 선정
- 그래프 DB 설계
- 문제 추천 엔진 개발
- 문제 서버 API 설계 및 개발

**박효진** [@gywlsp](https://github.com/gywlsp)
- 서비스 기획
- 서비스 UI 설계
- 서비스 프론트엔드 개발
- 서비스 컨셉, 기능 소개 영상 시나리오 작성 

## 참고 사항

본 프로젝트는 기능 구현을 위해 백준 문제를 임시 데이터로 사용했습니다.
