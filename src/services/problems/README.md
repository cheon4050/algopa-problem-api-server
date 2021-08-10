# 목차

1. [Social Login](#Social-Login)
2. [Get a social account email](#Get-a-social-account-email)
3. [Verificate a token](#Verificate-a-token)
4. [Sign-a-token](#Sign-a-token)

> 본 기능에서는 모든 response의 실제 상태 값은 정상 값(200 or 201)로 통일된다.
>
> 결과의 성공 및 실패는 Response Body의 `success`값으로 결정된다.
>
> 실패할 경우 `success`는 false가 되며 `result`에는 에러 코드와 에러 상태 코드가 담긴다.
>
> 아래에서 설명하는 모든 Response와  Error 객체는 `result`에 담기는 값을 뜻한다.

# Social Login

Social Login을 위한 기능입니다.

### URL: `auth/v1/login/:provider`

### Method: `GET`

### Headers

- Authorization: 소셜 제공 업자<small>provider</small>에게서 얻은 Auth Code

### Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 |

### Response

| Name        | Type   | Required | Description                   |
| ----------- | ------ | -------- | ----------------------------- |
| email       | string | true     | 유저의 소셜 계정 이메일       |
| accessToken | string | true     | 유저의 소셜 계정 Access Token |

#### Example

```json
{
  "email": "whddk4415@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndoZGRrNDQxNUBnbWFpbC5jb20iLCJwcm92aWRlciI6Imdvb2dsZSIsImlhdCI6MTYyNjQ0MTQzOCwiZXhwIjoxNjI2NTI3ODM4fQ"
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


# Get a social account email

유저에게 제공된 소셜 제공 업체<small>provider</small>의 Access Token을 이용하여 유저의 소셜 계정 이메일을 얻을 수 있는 기능입니다.

### URL: `auth/v1/social/email/:provider`

### Method: `GET`

### Headers

- Authorization: 소셜 제공 업자<small>provider</small>에게서 얻은 Auth Code

### Parameters

| Name     | Type   | Description                                      |
| -------- | ------ | ------------------------------------------------ |
| provider | string | 소셜 로그인 시 선택한 값, google, GitHub 중 하나 |

### Response

| Name        | Type   | Required | Description                   |
| ----------- | ------ | -------- | ----------------------------- |
| email       | string | true     | 유저의 소셜 계정 이메일       |
| accessToken | string | true     | 유저의 소셜 계정 Access Token |

#### Example

```json
{
  "email": "whddk4415@gmail.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndoZGRrNDQxNUBnbWFpbC5jb20iLCJwcm92aWRlciI6Imdvb2dsZSIsImlhdCI6MTYyNjQ0MTQzOCwiZXhwIjoxNjI2NTI3ODM4fQ"
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

# Sign a token

제공된 데이터를 미리 정의한 JWT Secret Key값으로 Encode하는 기능입니다.

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

