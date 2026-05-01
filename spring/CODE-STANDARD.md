# CODE-STANDARD.md — 코드 표준

> 이 문서는 **모든 슬라이드·예제·실습·핸드아웃에 등장하는 Java/SQL/XML 코드의 단일 출처(Single Source of Truth)** 입니다.
> 자료 폴더의 [`MavenMember`](./자료/code/MavenMember), [`MavenBoard`](./자료/code/MavenBoard) 두 프로젝트를 기반으로 하되, **현재 과정의 스택(Spring + MySQL)** 에 맞춰 변환합니다.
>
> **핵심 원칙**: 학생에게 완성품을 한 번에 보여주지 않습니다. 차시가 진행될수록 테이블·클래스·SQL이 ALTER/REFACTOR 되는 **진화 과정 자체가 학습 내용**입니다.

---

## 1. 명명 표준

| 자리 | 표준 | 이유 |
|------|------|------|
| **패키지 루트** | `com.smhrd` | 자료 일관성 (학원 표준) |
| **하위 패키지** | `com.smhrd.controller`, `com.smhrd.service`, `com.smhrd.mapper`, `com.smhrd.domain` | Spring MVC 6계층 매핑 |
| **테이블 prefix** | `my` (예: `mymember`, `myboard`, `myreply`) | 자료 따름 |
| **Mapper namespace** | 인터페이스 풀 클래스명 (`com.smhrd.mapper.MemberMapper`) | Spring + MyBatis 표준 |
| **Mapper XML 위치** | `src/main/resources/com/smhrd/mapper/MemberMapper.xml` | 인터페이스와 같은 경로 |
| **Lombok 사용** | `@Data`, `@AllArgsConstructor`, `@RequiredArgsConstructor`, `@NonNull` | 자료 따름 |

---

## 2. 최종(완성) 도메인 — 학생에게는 한 번에 안 보여줌

### 2.1 Member (mymember)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | VARCHAR(50) PK | 로그인 ID |
| `pwd` | VARCHAR(100) | BCrypt 해시 (60자 + 여유) |
| `nick` | VARCHAR(30) | 표시명 |
| `course` | VARCHAR(50) | 수강 과정명 |
| `created_at` | DATETIME | 가입 시각 |

### 2.2 Board (myboard)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `num` | INT PK AUTO_INCREMENT | 글 번호 |
| `title` | VARCHAR(100) | 제목 |
| `writer` | VARCHAR(50) | 작성자 (mymember.id 참조) |
| `content` | TEXT | 본문 |
| `created_at` | DATETIME | 작성 시각 |
| `view_count` | INT DEFAULT 0 | 조회수 |
| `photo` | VARCHAR(200) | 첨부 파일명 (NULL 가능) |

### 2.3 Reply (myreply)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `num` | INT PK AUTO_INCREMENT | 댓글 번호 |
| `content` | VARCHAR(500) | 댓글 본문 |
| `boardnum` | INT FK | 글 번호 |
| `writer` | VARCHAR(50) | 작성자 |
| `created_at` | DATETIME | 작성 시각 |

---

## 3. 진화 지도 — 차시별 변경

| 버전 | 차시 | 스키마 변경 | 클래스 변경 | 학생이 배우는 것 |
|------|------|-----------|-----------|--------------|
| **v2** | auth-v2-raw (원시 회원/로그인) | `CREATE TABLE mymember(id PK, pwd VARCHAR(20))` | `Member { id, pwd }` | 최소 컬럼·평문 비교 / **기본 폼 = 데이터 계약** |
| **v3** | auth-v3-secure (BCrypt+세션) | `ALTER TABLE mymember MODIFY pwd VARCHAR(100)` | (필드 동일, 의미만 해시로) | **컬럼 길이 변경**, 기존 데이터 마이그레이션 고민 |
| **v4** | auth-v4-clean (인터셉터) | (변경 없음) | `Member` 변경 없음 | 코드 정리, 표시용 필드 필요시 `nick` 추가 — `ALTER TABLE mymember ADD COLUMN nick VARCHAR(30)` |
| **v5** | board-v5-minimal (Create/Read) | `CREATE TABLE myboard(num PK AI, title, writer, content)` | `Board { num, title, writer, content }` | **새 테이블**, AUTO_INCREMENT |
| **v6** | board-v6-secure (Update/Delete + 본인확인) | `ALTER TABLE myboard ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP` | `Board` 에 `createdAt` 필드 추가 | **DEFAULT 활용**, 기존 row 어떻게? |
| **v7** | board-v7-paging | (변경 없음 — SQL `LIMIT ?, ?` 만 추가) | `Board` 변경 없음, `Paging` 클래스 신설 | 도메인 외 보조 클래스 |
| **◆** | **team-frontpage-handoff** *(전환점)* | (변경 없음) | (변경 없음) | **외부 FrontPage 적용** — 폼 name 만 맞으면 디자인은 갈아끼움. 팀 분업 시뮬레이션 |
| **v8** | rest-v8-conversion | (변경 없음 — Controller 만 두 종) | `Board` 변경 없음 | 같은 모델, 다른 컨트롤러 |
| **v9** | rest-v9-async-comment | `CREATE TABLE myreply(num PK AI, content, boardnum FK, writer, created_at)` | `Reply { num, content, boardnum, writer, createdAt }` | **새 테이블 + FK** |
| **v10** | rest-v10-extras (조회수+첨부) | `ALTER TABLE myboard ADD COLUMN view_count INT DEFAULT 0`, `ADD COLUMN photo VARCHAR(200)` | `Board` 에 `viewCount`, `photo` 추가 | **ALTER 두 번**, NULL 허용, UPDATE 시 동적 SQL |

> ⚠️ **이 표가 슬라이드/예제/실습의 단일 진실**입니다. 어떤 차시가 어떤 컬럼을 가지는지 의심나면 이 표 확인.

### 3.1 「같은 데이터(네이밍)」 — 3 트랙이 만나는 지점

팀 프로젝트는 한 사람이 모두 짜지 않습니다. 동시에 세 갈래가 움직입니다 — **같은 데이터 이름** 만 공유하면 됩니다.

```
              [공유 약속]
              필드 = id, pwd, nick
              ┌───────┴───────┐
              │               │
     ┌────────┴────┐   ┌──────┴───────┐   ┌────────┴────────┐
     │ Frontend    │   │  Backend     │   │      DB         │
     │ 트랙         │   │  트랙        │   │   트랙          │
     ├─────────────┤   ├──────────────┤   ├─────────────────┤
     │ 디자인 폼    │   │ 빈 HTML +    │   │ CREATE TABLE    │
     │ <input      │   │ Controller   │   │   mymember(     │
     │  name="id"> │   │ + DTO Member │   │     id, pwd,    │
     │  name="pwd">│   │ + Service    │   │     nick )      │
     │  CSS / 디자인│   │ + Mapper     │   │ + INSERT 가데이터│
     │ 집중        │   │ 로직 집중     │   │ + SELECT 검증    │
     └─────────────┘   └──────────────┘   └─────────────────┘
              │               │               │
              └───────┬───────┴───────┬───────┘
                      ↓               ↓
              ◆ HANDOFF — 세 트랙이 "같은 이름" 으로 만남
              {id, pwd, nick} 가 폼/DTO/컬럼 모두에 등장
```

**한 줄 원칙**: **같은 데이터에 같은 이름을 쓰면, 세 사람이 동시에 일해도 시스템이 합쳐진다.**

이 원칙을 v2 회원가입 폼부터 박고, ◆ team-collaboration 차시에서 직접 시뮬레이션 경험.

### 3.2 ◆ team-collaboration 차시 — 3 트랙 동시 진행 시뮬레이션

**위치**: board-v7-paging 다음, rest-v8 이전 (Part 5 끝/Part 6 시작 사이의 전환점)

**왜 여기?**: 인증·게시판 CRUD 가 모두 끝난 시점. 세 관점에서 같은 데이터를 다뤄볼 충분한 모델이 쌓여 있음.

**학습 목표**:
1. 팀 프로젝트가 어떻게 분업되는지 안다 (Front / Back / DB)
2. 세 트랙이 「같은 데이터 이름」 으로 만난다는 원칙을 이해한다
3. 한 트랙씩 직접 시뮬레이션 해보며 팀 멤버의 일을 체험한다

**4단계 구조**:
- **⚠️ 불편**: 「혼자서 화면·서버·DB 를 다 짜고 있는데, 팀 프로젝트가 시작되면 어떻게 분업하나?」
- **🛠️ 도구**: 「같은 데이터 이름」 — 약속만 정해두면 세 트랙이 동시에 일할 수 있다
- **💻 적용**: 학생이 세 트랙을 한 번씩 짧게 시뮬레이션
  - Front 트랙: 디자인 폼 HTML/CSS (name 만 맞추면 OK)
  - Back 트랙: 빈 HTML + Controller + Service + Mapper (DTO 필드명만 맞추면 OK)
  - DB 트랙: 테이블 설계 + INSERT 가데이터 + SELECT 로 검증 (컬럼명만 맞추면 OK)
- **🔄 Before/After**: 혼자 만든 시스템 vs 세 트랙이 "같은 이름" 으로 만나 합쳐진 시스템

**팀 워크플로 그림** — 같은 시간, 세 트랙 병렬:
```
시각 →
[Front 트랙]   wireframe → CSS → 디자인 폼 ─┐
                                            │
[Back 트랙]    DTO → Service → Mapper ──────┼──→ ◆ 합치기
                                            │     (이름이
[DB 트랙]      ERD → CREATE → 가데이터 ─────┘      같으니
                                                  자연 합쳐짐)
```

**세 트랙별 「같은 데이터」 출현 위치**:

| 트랙 | 어디에 등장 | 예시 |
|------|----------|------|
| Front | `<input name="...">` | `<input name="id">`, `<input name="pwd">`, `<input name="nick">` |
| Back | DTO 필드명 + 폼 바인딩 | `private String id; private String pwd; private String nick;` |
| DB | 테이블 컬럼명 | `mymember(id VARCHAR(50), pwd VARCHAR(100), nick VARCHAR(30))` |

**시뮬레이션 시나리오**:
- 강의 자료에 미리 준비된 「디자인된 회원가입 페이지 HTML」 (Front 트랙 산출물)
- 학생이 짠 Backend (Controller/Service/Mapper) — v2~v4 누적
- 학생이 짠 SQL — v2~v4 의 mymember 테이블
- 세 가지를 합쳐서 「내가 한 사람이지만, 팀이라면 세 사람이 동시에 했을 일」 을 깨닫게 함

**파일명**: `slides/team-collaboration.html` (Part 약어: `team`, 색상 클래스 미정 — 회색 권장)

**기호**: ◆ (전환점, 새 패러다임 등장)

**중요 — 학생 메시지**:
- 「오늘 한 일은 모두 한 사람이 했지만, 이 모양 그대로 세 사람이 나눠 할 수 있다」
- 「세 트랙이 만날 때 깨지지 않으려면 처음부터 같은 이름을 약속하자」
- 「이게 곧 팀 프로젝트의 출발선이다 — 후속 과정에서 만난다」

**자료 참고**: 이 차시 작성 시 `자료/code/MavenMember`, `자료/code/MavenBoard` 의 실제 SMHRD 학습 프로젝트 구조를 참고. 그 프로젝트들은 한 사람이 모두 짠 형태이지만, 본 차시에서 그 코드를 「세 트랙 산출물의 합」 으로 재해석.

---

## 4. 클래스 진화 — 각 버전 코드

### 4.1 Member.java 진화

#### v2 — 최소
```java
package com.smhrd.domain;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class Member {
    private String id;
    private String pwd;
}
```

#### v3 — pwd 길이 변경 (필드는 그대로, DB 만 ALTER)
```java
// 클래스 코드 동일 — 다만 pwd 가 BCrypt 해시 (60자 내외)
```

#### v4 — nick 추가
```java
@Data @AllArgsConstructor @NoArgsConstructor
public class Member {
    private String id;
    private String pwd;
    private String nick;     // ← 추가 (ALTER TABLE 동시)
}
```

#### 최종 (v∞ 후속 과정)
```java
@Data @AllArgsConstructor @NoArgsConstructor
public class Member {
    private String id;
    private String pwd;
    private String nick;
    private String course;       // 후속 과정에서
    private LocalDateTime createdAt;
}
```

### 4.2 Board.java 진화

#### v5 — 최소 4 컬럼
```java
package com.smhrd.domain;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class Board {
    private int num;
    private String title;
    private String writer;
    private String content;
}
```

#### v6 — createdAt 추가
```java
@Data @AllArgsConstructor @NoArgsConstructor
public class Board {
    private int num;
    private String title;
    private String writer;
    private String content;
    private LocalDateTime createdAt;   // ← 추가
}
```

#### v10 — viewCount, photo 추가
```java
@Data @AllArgsConstructor @NoArgsConstructor
public class Board {
    private int num;
    private String title;
    private String writer;
    private String content;
    private LocalDateTime createdAt;
    private int viewCount;             // ← v10
    private String photo;              // ← v10 (NULL 가능)
}
```

### 4.3 Reply.java (v9 신설)

```java
package com.smhrd.domain;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class Reply {
    private int num;
    private String content;
    private int boardnum;
    private String writer;
    private LocalDateTime createdAt;
}
```

---

## 5. SQL 진화 — 각 버전별 마이그레이션

### 5.1 v2 — 회원 최소
```sql
CREATE TABLE mymember (
  id  VARCHAR(50)  PRIMARY KEY,
  pwd VARCHAR(20)  NOT NULL
);
```

### 5.2 v3 — pwd 길이 확장 (BCrypt)
```sql
ALTER TABLE mymember MODIFY COLUMN pwd VARCHAR(100) NOT NULL;
```

### 5.3 v4 — nick 추가
```sql
ALTER TABLE mymember ADD COLUMN nick VARCHAR(30) AFTER pwd;
```

### 5.4 v5 — 게시판 최소
```sql
CREATE TABLE myboard (
  num     INT          PRIMARY KEY AUTO_INCREMENT,
  title   VARCHAR(100) NOT NULL,
  writer  VARCHAR(50)  NOT NULL,
  content TEXT         NOT NULL
);
```

### 5.5 v6 — created_at 추가
```sql
ALTER TABLE myboard ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
```

### 5.6 v9 — 댓글 신설
```sql
CREATE TABLE myreply (
  num        INT          PRIMARY KEY AUTO_INCREMENT,
  content    VARCHAR(500) NOT NULL,
  boardnum   INT          NOT NULL,
  writer     VARCHAR(50)  NOT NULL,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (boardnum) REFERENCES myboard(num) ON DELETE CASCADE
);
```

### 5.7 v10 — 조회수·첨부 추가
```sql
ALTER TABLE myboard
  ADD COLUMN view_count INT DEFAULT 0,
  ADD COLUMN photo      VARCHAR(200) NULL;
```

---

## 6. Mapper XML 패턴

### 6.1 namespace
```xml
<mapper namespace="com.smhrd.mapper.MemberMapper">
```

### 6.2 statement id 표준
| 동작 | id |
|------|-----|
| 등록 | `insert` |
| 단건 조회 | `selectOne` |
| 목록 조회 | `selectList` |
| 수정 | `update` |
| 삭제 | `delete` |
| 카운트 | `count` |

### 6.3 v5 BoardMapper.xml (최소)
```xml
<mapper namespace="com.smhrd.mapper.BoardMapper">
  <insert id="insert" parameterType="com.smhrd.domain.Board">
    INSERT INTO myboard (title, writer, content)
    VALUES (#{title}, #{writer}, #{content})
  </insert>

  <select id="selectList" resultType="com.smhrd.domain.Board">
    SELECT num, title, writer, content FROM myboard ORDER BY num DESC
  </select>

  <select id="selectOne" parameterType="int" resultType="com.smhrd.domain.Board">
    SELECT num, title, writer, content FROM myboard WHERE num = #{num}
  </select>
</mapper>
```

### 6.4 v6 — Update/Delete + created_at 추가
- `selectList`/`selectOne` 의 SELECT 절에 `created_at` 추가
- `update`, `delete` statement 추가

### 6.5 v7 — paging 추가
```xml
<select id="selectListPaging" resultType="com.smhrd.domain.Board" parameterType="map">
  SELECT num, title, writer, content, created_at
  FROM myboard
  ORDER BY num DESC
  LIMIT #{startRow}, #{pageSize}
</select>

<select id="count" resultType="int">
  SELECT COUNT(*) FROM myboard
</select>
```

### 6.6 v10 — 동적 SQL (photo 선택적)
```xml
<update id="update" parameterType="com.smhrd.domain.Board">
  UPDATE myboard
  SET title = #{title}, content = #{content}
  <if test="photo != null">, photo = #{photo}</if>
  WHERE num = #{num}
</update>

<update id="incrementViewCount" parameterType="int">
  UPDATE myboard SET view_count = view_count + 1 WHERE num = #{num}
</update>
```

---

## 7. 적용해야 할 차시 매핑

코드가 등장하는 차시(슬라이드/예제/실습/핸드아웃 4종)는 본 표준에 맞춰 일괄 갱신.

| Part | 차시 | 주 영향 |
|------|------|---------|
| Part 4 (DB) | `db-*` 모두 | 테이블/Mapper 예시 → `mymember` 최소형 사용 |
| Part 5 (인증) | `auth-v2`, `auth-v3`, `auth-v4` | Member 클래스 진화 |
| Part 5 (게시판) | `board-v5`, `board-v6`, `board-v7` | Board 클래스 진화 |
| Part 6 (REST) | `rest-v8`, `rest-v9`, `rest-v10` | Board (v8 그대로) → Reply 신설 (v9) → Board ALTER (v10) |
| Part 3 (MVC) | `mvc-dto-vo-model`, `mvc-dao-repository` | 예시 도메인을 `Member` v2 형으로 |

---

## 8. 강조 포인트 — 각 진화 단계가 가르치는 것

| 단계 | 가르침 |
|------|------|
| v2 → v3 | "BCrypt 도입 시 컬럼이 길어진다 — 미리 디자인하지 못하면 ALTER 한다" |
| v3 → v4 | "표시용 닉네임이 필요해졌다 — ADD COLUMN" |
| v5 → v6 | "정렬·표시에 시각이 필요하다 — DEFAULT 절의 위력" |
| v6 → v7 | "스키마는 그대로, 쿼리만 바뀐다 — 페이징은 SQL 패턴" |
| **v7 → ◆** | "**같은 데이터 이름이 세 트랙(Front/Back/DB) 의 약속** — 약속만 같으면 세 사람이 동시에 일해도 합쳐진다. 팀 프로젝트의 출발선" |
| v8 → v9 | "새 도메인은 새 테이블 — FK 의 첫 등장" |
| v9 → v10 | "기능 두 개를 한 ALTER 에 — 그러나 의미상 분리해서 가르친다" |

각 차시의 `.pain-point` 자리에 「**이전 버전에서는 X 가 없어서 Y 가 안 됐다**」 패턴으로 동기 부여, `.new-tool` 에 ALTER 문, `.before-after` 에 스키마/SQL 비교.

---

## 9. 절대 하지 말 것

- ❌ v5 단계에 `created_at`, `view_count`, `photo` 미리 넣기 — 학생이 「왜 이 컬럼이 처음부터 있지?」 고민할 기회를 빼앗음
- ❌ 테이블 명을 슬라이드마다 다르게 쓰기 (`tb_board`, `t_board` 등) — `myboard` 로 통일
- ❌ 패키지를 `com.example` 로 쓰기 — `com.smhrd` 로 통일
- ❌ `.pain-point` 없이 ALTER 만 보여주기 — 「왜 ALTER 가 필요한가」가 핵심
- ❌ Oracle 문법 (`board_seq.nextval`, `ROWNUM`) 사용 — MySQL 기준 (`AUTO_INCREMENT`, `LIMIT`)
- ❌ 자료에 있다고 무비판 차용 — 자료는 **JSP+Servlet** 시대. 우리는 Spring 어노테이션으로

---

> 이 표준이 바뀌면 모든 코드 슬라이드를 같이 갱신해야 합니다. 변경 시 [`프로젝트-기록.md`](./프로젝트-기록.md) 에 단계 추가.
