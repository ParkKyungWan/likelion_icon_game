
var canvas = document.getElementById("playground");
var ctx = canvas.getContext("2d");

var playing = false; //게임이 진행중인지 확인하는 변수
var start = false; //게임을 시작하기 전인지 확인
var player = {x:20,y:35,color:"black",speed:1.5,length:10,score:0}; //플레이어 정보

var right = false; 
var left = false;  //좌우이동 상태
/*var up = false;
var down = false;*/ //위아래 이동은 아직 안씀




//키보드 조작 관련
document.addEventListener("keydown", push, false); //누르는지 확인
document.addEventListener("keyup", pull, false);  //놓았는지 확인


function push(key) { //누를 때
    if(key.keyCode == 68) { //D
        right = true;
    }else if(key.keyCode == 65) {//A
        left = true; 
    }/*else if(key.keyCode == 87){//W
        up = true;
    }else if(key.keyCode == 83){//S
       down = true;
    }*/  
}

function post_to_url(path, params, method) { //자바스크립트에서 post를 사용하는 함수 (https://differentiate.tistory.com/m/15)
    method = method || "post"; // Set method to post by default, if not specified.
 
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
 
        form.appendChild(hiddenField);
    }
 
    document.body.appendChild(form);
    form.submit();
}



function pull(key) { //놓을 때
                        
    if(key.keyCode == 68) {
        right = false;
    }else if(key.keyCode == 65) {
        left = false;
    }/*else if(key.keyCode == 87){
        up = false;
    }else if(key.keyCode == 83){
        down = false;
    }*/
    if(key.keyCode == 32){
        if(!start&&!playing){
            start = true;
            playing = true;

            document.getElementById('text').style.display = "none";
            document.getElementById('playground').style.display = "block";
        }
        else if(start&&!playing){
            post_to_url("/ending/", {"score":player.score,'csrfmiddlewaretoken': token});


            playing = true;
            player.score = 0;
            document.getElementById('text').style.display = "none";
            document.getElementById('text2').style.display = "none";
            document.getElementById('playground').style.display = "block"
        }
    }
}


function refresh(color) { //주기적인 refresh 를 위한 함수
    ctx.clearRect(0,0,canvas.width, canvas.height );
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function circle(x,y,length,color) { // 원을 그리는 함수
    y = canvas.height-y;
    ctx.beginPath();
    ctx.arc(x, y, length, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function item()
{
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = "/static/likelion.png";
    this.width = 40;
    this.height = 40;
    this.speed = 0.1;
} //장애물 생성 틀
var items = [];  //생성된 장애물들이 쌓일 곳

function check(a,b){
    return !(a.x > b.x + b.width || 
        a.x + a.length < b.x ||
        canvas.height-a.y > b.y + b.height ||
        canvas.height-a.y + a.length < b.y
    );
}
//메인 함수 (반복적으로 재생 됨)
function main(){
    
    if (!playing&&start) { //게임중이 아닐경우
        document.getElementById('text').style.display = "block";
        document.getElementById('text2').style.display = "block";
        document.getElementById('text2').innerHTML = "점수: "+player.score;
        document.getElementById('playground').style.display = "none"
        return;
    }else if(!playing&&!start){
        document.getElementById('text').style.display = "block";
        document.getElementById('playground').style.display = "none";
        return;
    }
    

    refresh("white"); //배경 refresh

    document.getElementById('scoreboard').innerHTML = "점수: "+player.score;
    
    //키보드 버튼을 누르면 플레이어 이동
    if (right && player.x <= canvas.width - player.length ) { //오른쪽 이동
        player.x += player.speed;

    }else if (left && player.x >= player.length) { //왼쪽 이동
        player.x -= player.speed;
    }
    /*
    if (up && player.y <= 450 - player.length) { //위로 이동
        player.y += player.speed;
    }else if (down && player.y >= player.length) { //아래로 이동
        player.y -= player.speed;
    }
    */
    circle(player.x, player.y, player.length, player.color);//플레이어 그리기
    
    for(let item_ of items){ //아이템들을 이동시키자
        if(item_.y<canvas.height){ //맨 아래까지 떨어졌는지 확인
            ctx.drawImage(item_.image,item_.x,item_.y,
                item_.width,item_.height);
            item_.y += item_.speed;
            item_.speed*=1.0025; 
        }else{  //맨 아래까지 떨어졌다면 점수를 주자
            player.score+=10;
            for(var i = 0; i<items.length;i++){
                if(items[i].x == item_.x &&items[i].y == item_.y){
                    items.splice(i,1); //점수가 된 멋사는 사라져야해....
                    break;
                } 
            }
        }
        if(check(player,item_)){ //충돌했다면 게임 종료
            playing = false;
            items = []
            player.x=20;
            player.y=35;
            break; 
        }
    }
}
setInterval(main,3); //메인 함수를 반복재생
setInterval(function(){
    if(playing){
        const newitem = new item();
        items.push(newitem);
        newitem.speed = Math.random()*2+1;
        newitem.x = (Math.random()*canvas.width-40);
        newitem.y = 0
    }
},70) //장애물들을 꾸준히 생성 (주기: 1초)

