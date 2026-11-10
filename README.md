# BlackJack Web

HTML, CSS, JavaScript, jQuery, Bootstrap으로 만든 블랙잭 웹 게임입니다.

## 사용 기술

- HTML5, CSS3, JavaScript
- jQuery 1.12.4, Bootstrap 3.3.6
- Eclipse, Apache Tomcat 10.1

## 주요 기능

- 카드 분배, Hit·Stand, 점수 계산 및 승패 판정
- 포인트 베팅 및 결과에 따른 정산
- 라운드별 카드 이미지, 점수, 승패, 포인트 증감 기록
- 누적 승패 및 획득·차감 포인트 조회

## 실행 방법

1. 저장소를 내려받아 Eclipse에서 기존 프로젝트로 가져옵니다.
2. 프로젝트에 Java 21과 Tomcat 10.1을 설정합니다.
3. `src/main/webapp/index.html`을 `Run As → Run on Server`로 실행합니다.

## 참고 사항

- 초기 포인트는 10,000 P입니다.
- 새로고침하면 포인트와 기록이 초기화됩니다.
- 기록 팝업을 불러오기 위해 HTTP 서버에서 실행해야 합니다.
- CDN 사용으로 인터넷 연결이 필요합니다.
