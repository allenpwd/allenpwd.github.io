
var me=true;
var over=false;

//棋盘的状态，1：黑子，2：白子，0：空闲
var chessBoard = [];
for(var i=0;i<15;i++){
	chessBoard[i]=[];
	for(var j=0;j<15;j++){
		chessBoard[i][j] = 0;
	}
}

//可赢情况
var count=0;//可赢情况的序号
var wins=[];//若wins[1][1][1]=true,表示第一种可赢情况包含（1，1）这个点
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
//竖的可赢情况
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//横的可赢情况
for(var i=0;i<11;i++){
	for(var j=0;j<15;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j][count]=true;
		}
		count++;
	}
}
//正斜的可赢情况
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//反斜的可赢情况
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}

console.log("有"+count+"种赢法！");

//每种可赢情况的进度统计
var myWin=[];
var computerWin=[];
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}

var chess=document.getElementById("chess");
var context=chess.getContext('2d');
context.strokeStyle="#B9B9B9";

window.onload=function(){
	drawChessBoard();
}

var drawChessBoard = function() {
	for(var i=0;i<15;i++){
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
		context.stroke();
	}
}

function oneStep(i, j, me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		gradient.addColorStop(0,"#0A0A0A");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();
}

chess.onclick=function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k]=6;//表示电脑第count中可赢情况不可能发生
				if(myWin[k]==5){
					alert("你赢了");
					over=true;
				}
			}
		}if(!over){
			me=!me;
			computerAI();
		}
	}
}

var computerAI = function(){
	var myScore=[];
	var computerScore=[];
	var max=0;
	var u=0,v=0;

	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}

	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}

						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k]=6;//表示电脑第count中可赢情况不可能发生
			if(computerWin[k]==5){
				alert("计算机赢了");
				over=true;
			}
		}
	}if(!over){
		me=!me;
	}
}
