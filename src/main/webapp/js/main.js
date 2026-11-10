$(function() {
	// 게임상태를
	//게임을 시작하면 진행중 T
	//게임을 시작안하면 준비중 F
	var game_start = false;
	
	//라운드 카운트
	var round_count = 0;
	
	//보유 포인트랑 이번 라운드 포인트
	var total_points = 10000;
	var round_points = 0;
	
	//끝난 라운드 기록
	var game_records = new Array();
	
	// 뽑히지 않은 카드목록 
	var deck = new Array();
	// 플레이어가 받는 카드목록
	var player_hand = new Array();
	// 딜러가 받는 카드목록
	var dealer_hand = new Array();
	
	//52장의 카드 deck 에 추가 , 반복문으로 어캐못하나
	/*deck[0]='2_of_clubs.png';
	deck[1]='2_of_diamonds.png';
	deck[2]='2_of_hearts.png';
	deck[3]='2_of_spades.png';*/
	
	//카드 종류랑 무늬
	var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10',
	             'jack', 'queen', 'king', 'ace'];
				 
	var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
	
	//기록 팝업 불러오기
	$("#modal_container").load("modal/records_modal.html");
	
	//기록 보기 누르면 기록 갱신
	$("#records_btn").click(function(){
		show_records();
	});
	
	//기록이랑 통계 표시
	function show_records(){
		var record_html = "";
		var wins = 0;
		var losses = 0;
		var draws = 0;
		var points_gained = 0;
		var points_lost = 0;
		
		//저장된 기록 개수만큼 반복
		for(var i=0;i<game_records.length;i++){
			//i번째 게임기록을 record에 넣음
			var record = game_records[i];
			
			//기본은 회색 , 승패랑 포인트에 따라 색 바꾸기
			var result_class = 'record_gray';
			var point_class = 'record_gray';
			
			// 승패 누적
			//record의 결과가 승리면 wins 1증가 , 패배면 losses , 무승부면 draws
			if(record.result == '승리'){
				wins++;
				result_class = 'record_green';
			}else if(record.result == '패배'){
				losses++;
				result_class = 'record_red';
			}else if(record.result == '무승부'){
				draws++;
			}
			
			//포인트 변동이 0보다 크면 얻은포인트에 더하기
			if(record.point_change > 0){
				points_gained += record.point_change;
				point_class = 'record_green';
			}else if(record.point_change < 0){
				
				//0보다 작으면 잃은포인트에 누적 , 음수를 빼니까 양수가됨
				points_lost -= record.point_change;
				point_class = 'record_red';
				
			}
			
			//포인트 숫자뒤에 P 붙여야함
			var point_text = record.point_change + ' P';
			
			//얻은 포인트면 앞에 + 도 붙임
			if(record.point_change > 0){
				point_text = '+' + point_text;
			}
			
			//기록 한줄 시작 , 회차랑 플레이어 점수 넣기
			//뒤에 계속 추가
			record_html += '<tr><td>' + record.round_count + '</td>';
			record_html += '<td class="record_hand"><strong>' + record.player_score + '</strong> ';
			
			//해당 라운드의 플레이어 카드 개수만큼 이미지 추가
			for(var j=0;j<record.player_hand.length;j++){
				record_html += '<img src="cards/' + record.player_hand[j] + '" width="35" alt="플레이어 카드"> ';
			}
			
			//플레이어 칸 끝내고 딜러 칸 시작 , 딜러 점수 넣기
			record_html += '</td><td class="record_hand"><strong>' + record.dealer_score + '</strong> ';
			
			//해당 라운드의 딜러 카드 개수만큼 이미지 추가
			for(var j=0;j<record.dealer_hand.length;j++){
				record_html += '<img src="cards/' + record.dealer_hand[j] + '" width="35" alt="딜러 카드"> ';
			}
			
			//딜러 칸 끝내고 결과랑 포인트 변동 넣기
			//마지막에 tr 닫아서 기록 한줄 끝냄
			//class 붙여서 승패랑 포인트 색상 적용
			record_html += '</td><td class="' + result_class + '">' + record.result + '</td>';
			record_html += '<td class="' + point_class + '">' + point_text + '</td></tr>';
			
		} // for문
		
		//아직 게임을 안끝냈으면
		if(game_records.length == 0){
			record_html = '<tr><td colspan="5" class="text-center">아직 완료한 게임이 없습니다.</td></tr>';
		}
		
		$('#records_body').html(record_html);
		$('#record_total').text(game_records.length);
		$('#record_wins').text(wins);
		$('#record_losses').text(losses);
		$('#record_draws').text(draws);
		$('#points_gained').text(points_gained);
		$('#points_lost').text(points_lost);
		
	} // show_records 기록용 함수
	
	// 블랙잭 점수계산 
	//calculate_score
	function calculate_score(hand){
		var score = 0; //점수 합계
		var ace_count = 0; //ace 개수
		
		
		/*// split() , 를 구분지어서 분리시켜라 -> 분리시키면 배열이됨
		var fruits = "apple, banana, orange";
		farr = fruits.split(","); // farr 배열에 넣음*/
		
		
		// card rank 별 점수계산하기
		for(var i=0;i<hand.length;i++){
			
			// split() 로 _ 구분지어서 분리
			//10_of_clubs.png --> 10  of  clubs.png 
			var card_parts = hand[i].split("_");
			var card_rank = card_parts[0];
			
			//2~10이면 해당숫자를 score에 더하기
			if(card_rank >= 2 && card_rank <= 10){
				score +=parseInt(card_rank);
			}
			
			// jack,queen,king 이면 score에 10더하기
			else if(card_rank=='jack'||card_rank=='queen'||card_rank=='king'){
				score +=10;
			}
			// ace 이면 score 에 11 더하기 , A 개수도 1증가
			else if(card_rank=='ace'){
				score +=11;
				ace_count++;
			}
		}
		
		/*if(score >21){
			if(ace_count > 0){
				score -= 10;
				ace_count--;
				//다음 두조건을 어떻게 다시확인하지? 
			}
					
		}*/
		// 21점 초과 시 A를 11점에서 1점으로함
		while(score >21 && ace_count > 0){
			score -= 10;
			ace_count--;
			
		}
		
		return score;
		
	}
	
	// 라운드 종료 ,  딜러 카드 공개, 점수와 결과 표시
	function end_round(result){
		//이미 끝났으면 정산 안하기
		if(game_start == false){
			return false;
		}
		
        //딜러 숨긴카드 공개
        var card_img = "";
        for (var i = 0;i < dealer_hand.length;i++) {
            card_img += '<img src="cards/' + dealer_hand[i] + '" width="100" alt="딜러 카드">';
        }
        // 딜러 이미지출력
        $('#dealer_cards').html(card_img);

        // 딜러 점수
        var dealerScore = calculate_score(dealer_hand);
        $('#dealer_score').text(dealerScore);
        // 플레이어 점수
        var playerScore = calculate_score(player_hand);
        $('#player_score').text(playerScore);
		
		//승패에 따라 포인트 돌려주기
		var return_points = 0;
		if(result == '승리'){
			var gained_points = round_points;
			//처음 두장으로 21이면 블랙잭 보상
			if(player_hand.length == 2 && playerScore == 21){
				gained_points = Math.round(round_points * 1.5);
			}
			return_points = round_points + gained_points;
		}else if(result == '무승부'){
			return_points = round_points;
		}
		
		total_points += return_points;
		
		$('#total_points').text(total_points);
		$('#point_input').attr('max',total_points);
		
		//이번 라운드 기록 저장
		game_records.push({
			round_count: round_count,
			//다음 라운드랑 섞이지 않게 카드목록 복사
			player_hand: player_hand.slice(0),
			dealer_hand: dealer_hand.slice(0),
			player_score: playerScore,
			dealer_score: dealerScore,
			result: result,
			point_change: return_points - round_points
		});
		show_records();
		
        //hit stand 버튼 비활성화
        $('#hit_btn').attr('disabled', true);
        $('#stand_btn').attr('disabled', true);
		
		// 승패 결과 표시
		$('#game_result').text(result);
		
		game_start = false;
		
		//포인트 다쓰면 새로고침 전까지 종료
		if(total_points <= 0){
			$('#point_input').attr('disabled',true);
			$('#start_game').attr('disabled',true);
			$('#start_game').text('게임 종료');
			$('#game_message').text('보유 포인트가 없습니다. 새로고침하면(F5) 다시 시작합니다');
			return false;
		}
		
		//다음 라운드 시작할수있게
		$('#game_message').text('');
		$('#point_input').attr('disabled',false);
		$('#start_game').attr('disabled',false);
		$('#start_game').text('다음 라운드');
		
	} // 라운드 종료 함수
	
	// 게임시작 버튼 및 유효성검사
	$('#start_game').on("click",function(){
		//게임상태 검사
		if(game_start == true){
			return false;
		}
		
		//포인트 없으면 시작 안하기
		if(total_points <= 0){
			return false;
		}
		
		
		//입력 유효성검사------------------------------------
		
		//입력 포인트
		var point=$('#point_input').val();
		//보유 포인트
		var total=total_points;
		
		//alert(point);
				
		//빈값
		if(point ==''){
			alert('포인트를 입력하세요');
			$('#point_input').focus();
			return false;
		}
		
		point=Number(point);
		
		// 숫자인지 확인
		if(isNaN(point)){
			alert("숫자를 입력하세요");
			$('#point_input').select();
			return false;
		}
		
		// 0이하 안되도록
		else if(point < 1){
			alert("1 이상의 포인트를 입력하세요");
			$('#point_input').select();
			return false;
		}
		
		// 1로 나눈 나머지가 있으면 소수
		else if(point % 1 != 0){
		    alert("포인트는 정수로 입력하세요");
			$('#point_input').select();
		    return false;
		}
		
		//보유포인트 초과해서 입력했는지
		//alert(total);
		else if(point > total){
			alert('보유 포인트를 초과해서 입력했습니다');
			$('#point_input').select();
			return false;
		}
		
		//입력 유효성검사 끝 ------------------------------------
		
		//이전 손패 비우기
		player_hand = new Array();
		dealer_hand = new Array();
		
		//매 라운드 새로운 덱 52장 준비
		deck = new Array();
		
		var index = 0;
		for(var i=0;i<ranks.length;i++){
			for(var j=0;j<suits.length;j++){
				deck[index] = ranks[i] + '_of_' + suits[j] + '.png';
				index++;
			}
		}
		
		//이전 카드랑 결과 지우기
		$('#player_cards').html('');
		$('#dealer_cards').html('');
		$('#player_score').text('?');
		$('#dealer_score').text('?');
		$('#game_result').text('-');
		$('#hit_btn').attr('disabled',true);
		$('#stand_btn').attr('disabled',true);
		
		//게임상태 true 로 변경
		game_start = true;
		
		//이번 라운드 포인트 차감
		round_points = point;
		total_points -= round_points;
		$('#total_points').text(total_points);
		
		//입력포인트랑 게임시작 버튼 잠금
		$('#point_input').attr('disabled', 'disabled');
		$('#start_game').attr('disabled', 'disabled');
		
		// round_points --> text 를 point 로 변경
		$('#round_points').text(round_points);	
		
		//게임시작하면 라운드 1증가
		round_count++;
		$('#round_count').text(round_count);
		console.log("라운드: "+round_count);
		
		/*//test 
		// 1장뽑기
		
		// deck 0~51 무작위 배열번호 선택
		var index = Math.floor(Math.random()*deck.length);
		
		//파일명 을 Card로
		var Card=deck[index];
		
		//플레이어 핸드 배열 추가
		//player_hand[0]=Card;
		//fruits.push('딸기'); //맨마지막 방에 요소 추가
		player_hand.push(Card); //추가할떄 push로 
		
		//덱에서 뽑은 카드 제거
		deck.splice(index,1); //뽑은카드 한장만 없애기
		
		//test
		console.log("뽑은 카드: ", Card);
		console.log("남은 카드 개수: ", deck.length);
		
		//이미지표시
		// <img src=''/>
				
		var card_img = '<img src="cards/' + Card + '" width="100" alt="플레이어 카드">';
		$('#player_cards').html(card_img);*/
		
		//카드분배 --------------------------------------------------
		
		// 플레이어 카드 2장 뽑기
		var card_img="";
		
		for(var i=0;i<2;i++){
			// 무작위 번호 뽑기
			var index = Math.floor(Math.random()*deck.length);
			
			var Card=deck[index];
			player_hand.push(Card);
			deck.splice(index,1);
			
			card_img += '<img src="cards/' + player_hand[i] + '" width="100" alt="플레이어 카드">';
			
			console.log("플레이어 카드: ", player_hand[i]);
			console.log("남은 카드 개수: ", deck.length);
			
		}
		//플레이어 
		$('#player_cards').html(card_img);
		
		// 딜러 카드 2장 뽑기
		card_img="";
		
		for(i=0;i<2;i++){
			// 무작위 번호 뽑기
			var index = Math.floor(Math.random()*deck.length);
						
			var Card=deck[index];
			dealer_hand.push(Card);
			deck.splice(index,1);
			
			console.log("딜러 카드: ", dealer_hand[i]);
			console.log("남은 카드 개수: ", deck.length);
						
			//딜러는 카드한장 공개 , 카드한장 뒷면으로 비공개 인데
			if(i==0){
				card_img +='<img src="cards/back.png" width="100" alt="딜러 카드">';
				continue;
			}
			// i=1 추가
			card_img += '<img src="cards/' + dealer_hand[i] + '" width="100" alt="딜러 카드">';
			
		}
		
		//딜러
		$('#dealer_cards').html(card_img);
		
		//카드분배 끝 --------------------------------------------------
		
		//블랙잭 예외처리 ---------------------------
		var blackJack = 21;
		
		var playerScore = calculate_score(player_hand);
		var dealerScore = calculate_score(dealer_hand);
		
		if(playerScore == blackJack && dealerScore == blackJack){
			end_round("무승부");
				
			// 게임시작 클릭 함수의 실행 끝내기
			return false;
			
		}
		else if(playerScore == blackJack){
			end_round("승리");
			
			return false;
		}
		else if(dealerScore == blackJack){
			end_round("패배");
			
			return false;
			
		}else{ //둘다 블랙잭아님 --> 정상진행
			game_start=true;
		}
		
		
		
		//블랙잭 예외처리 끝 ---------------------------
		
		//버튼 활성화
		$('#hit_btn').attr('disabled',false);
		$('#stand_btn').attr('disabled',false);
		
		// 블랙잭 점수계산 
		// 플레이어 점수 보여주기
		playerScore = calculate_score(player_hand);
		
		$('#player_score').text(playerScore);
		
		
	}); //on  게임시작 유효성검사
	
	//hit 버튼
	$('#hit_btn').on("click",function(){
		//게임상태
		if(game_start == false){
			return false;
		}
		
		var card_img = "";
		// 한장뽑기
		var index = Math.floor(Math.random()*deck.length);
		var Card=deck[index];	
		player_hand.push(Card);
		deck.splice(index,1);
		card_img += '<img src="cards/' + Card + '" width="100" alt="플레이어 카드">';
		
		console.log("플레이어 카드: ", Card);
		console.log("남은 카드 개수: ", deck.length);		
		//카드 이미지 출력
		$('#player_cards').append(card_img);
		//점수 갱신
		var playerScore = calculate_score(player_hand);
		$('#player_score').text(playerScore);
				
		//21점 초과시 버스트처리
		if(playerScore>21){
			//패배로 게임종료
			end_round("패배");
		}
				
	}); // hit 버튼
	
	//stand 버튼
	$('#stand_btn').on("click",function(){
		//게임상태
		if(game_start == false){
			return false;
		}
		
		//hit stand 버튼 비활성화
		$('#hit_btn').attr('disabled',true);
		$('#stand_btn').attr('disabled',true);
		
		//딜러 카드 표시 , 이거걍 앞에것만 back.jpg 니까 dealer_hand[0] 만 바꾸면되는거아님?
		//근데 이미지 표시를 html , append 로 할거니까 흠
		//지금방식은 덮어씌우기 같은데
		var card_img="";
		for(var i=0;i<dealer_hand.length;i++){
			card_img += '<img src="cards/' + dealer_hand[i] + '" width="100" alt="딜러 카드">';
		}
		// 딜러 이미지출력
		$('#dealer_cards').html(card_img);
		
		// 딜러 점수
		var dealer_Score = calculate_score(dealer_hand);
		$('#dealer_score').text(dealer_Score);
		
		
		// 딜러 규칙대로 진행
		
		while(dealer_Score < 17){
			card_img ="";
			// 한장뽑기
			var index = Math.floor(Math.random()*deck.length);
			var Card=deck[index];	
			dealer_hand.push(Card);
			deck.splice(index,1);
			card_img += '<img src="cards/' + Card + '" width="100" alt="딜러 카드">';
					
			console.log("딜러 카드: ", Card);
			console.log("남은 카드 개수: ", deck.length);		
			//카드 이미지 출력
			$('#dealer_cards').append(card_img);
			
			//점수 갱신 ,이거 calculate_score() 굳이 한번더 호출해야하나
			dealer_Score = calculate_score(dealer_hand);
			$('#dealer_score').text(dealer_Score);
						
		}
		//플레이어 점수
		var player_Score = calculate_score(player_hand);
		
		//stand 이후 서로 승패 조건문으로 구분
		if(dealer_Score>21){
			end_round("승리");
		}
		else if(dealer_Score < player_Score){
			end_round("승리");
		}
		else if(dealer_Score > player_Score){
			end_round("패배");
		}else{
			end_round("무승부");
		}
		
	}); //stand 버튼
	
	
	
}); //ready
