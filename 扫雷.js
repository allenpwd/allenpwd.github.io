// JavaScript Document



window.onload=initData;
function initData(){
	initText=document.getElementById("main").innerHTML;
	window.oncontextmenu=function(e){
		e.preventDefault();
		//换成return false好像也可以
	}
}
var mines;//该数组存储了地雷的位置
var row=5;//表格的行数
var col=10;//表格的列数
var mineNum=8;//地雷数目
var initText;//存储初始时的body标签的HTML文本
var first=true;
function init(){
	row=parseInt(document.getElementById("row").value);
	col=parseInt(document.getElementById("col").value);
	mineNum=parseInt(document.getElementById("mineNum").value);
	first=true;
	createTable(row,col);
	var tableNode=document.getElementsByTagName("table")[0];
	initTable(tableNode);
}

//创造表格
function createTable(row,col){
	var body=document.getElementById("main");
	var text=initText+"<table>";
	for(var x=0;x<row;x++)
	{
		text=text+"<tr>";
		for(var y=0;y<col;y++)
		{
			text=text+"<td></td>";
		}
		text=text+"</tr>";
	}
	text=text+"</table>";
	
	body.innerHTML=text; 
}

//初始化表格单元的ID
function initTable(tableNode){
	var cellNum=0;
	var trs=tableNode.rows;
	for(var x=0;x<trs.length;x++)
	{
		var tds=trs[x].cells;
		for(var y=0;y<tds.length;y++)
		{
			var cellNode=tds[y];
			cellNode.id=cellNum;
			cellNode.className="off";
			cellNode.onmouseup=onMouseUp;
			cellNode.ondblclick=midCheck;
			cellNum++;
		}
	}
}

//当第一点击雷区时初始化地雷，地雷的数目是mineNum且地雷的位置不能是点击的位置
function initLandMine(mineNum,start){
	var array=new Array(row*col);
	for(var x=0;x<array.length;x++)
	{
		array[x]=false;
	}
	//mines初始化为0
	mines=new Array(row);
	for(var x=0;x<mines.length;x++)
	{
		mines[x]=new Array(col);
		for(var y=0;y<mines[x].length;y++)
		{
			mines[x][y]=0;
		}
	}
	
	for(var i=0;i<mineNum;i++)
	{
		var ranNum=0;
		do{
			ranNum=getRandom(row*col);
		}while(array[ranNum]||ranNum==start);
		array[ranNum]=true;
		var x=Math.floor(ranNum/col);
		var y=ranNum%col;
		mines[x][y]=1;
		//document.getElementById(ranNum.toString()).innerText="雷";
	}
}

function getRandom(ran){
	return Math.floor(Math.random()*ran);
}


function onMouseUp(e){
	if(e.button==3)
	{
		alert("push");
	}
	else if(e.button==0)
	{
		check(e);
	}
	else if(e.button==2)
	{
		rightCheck(e);
	}
}

//点击鼠标右键的处理函数
function rightCheck(evt){
	
	var thisSquare=getEvt(evt);
	var id=parseInt(thisSquare.id);
	var x=Math.floor(id/col);
	var y=id%col;
	var className=thisSquare.className;
	if(className=="off")
	{
		thisSquare.className="mark";
		mines[x][y]+=10;
	}
	else if(className=="mark")
	{
		thisSquare.className="off";
		mines[x][y]-=10;
	}
}

//点击鼠标中间键的处理函数
function midCheck(evt){
	var thisSquare=getEvt(evt);
	var id=parseInt(thisSquare.id);
	var x=Math.floor(id/col);
	var y=id%col;
	expand(x,y);
	if(isWin())
	{
		document.getElementById("text").innerText="恭喜你，你赢了！";
		cencal();
	}
}

function cencal(){
	var thisSquare;
	for(var i=0;i<row*col;i++)
	{
		thisSquare=document.getElementById(i);
		thisSquare.onclick="";
	}
}

function getEvt(evt){
	var thisSquare;
	if(evt){
		thisSquare=evt.target;
	}
	else{
		thisSquare=window.event.srcElement;
	}
	return thisSquare;
}

//点击鼠标左键时的处理函数
function check(evt){
	var thisSquare=getEvt(evt);	
	var id=parseInt(thisSquare.id);
	if(first)
	{
		first=false;
		initLandMine(mineNum,id);
	}
	var x=Math.floor(id/col);
	var y=id%col;
	calculate(x,y);
	if(isWin())
	{
		document.getElementById("text").innerText="恭喜你，你赢了！";
	}
}

function calculate(x,y){
	var num=0;
	var id=x*col+y;
	var thisSquare=document.getElementById(id.toString());
	if(mines[x][y]==1){
		thisSquare.className="isMine";
		document.getElementById("text").innerText="亲，你踩到地雷了！";
	}
	else if(mines[x][y]==0){
		mines[x][y]=-1;
		thisSquare.className="on";
		//计算周围的地雷数目
		if(isMine(x-1,y-1)==true)
			num++;
		if(isMine(x-1,y)==true)
			num++;
		if(isMine(x-1,y+1)==true)
			num++;
		if(isMine(x,y-1)==true)
			num++;
		if(isMine(x,y+1)==true)
			num++;
		if(isMine(x+1,y-1)==true)
			num++;
		if(isMine(x+1,y)==true)
			num++;
		if(isMine(x+1,y+1)==true)
			num++;
		if(num==0)
		{
			expand(x,y);
		}
		else
		{
			thisSquare.innerText=num;
		}
	}
}

//将点(x,y)周围的点展开，其中已经开启的和被标记的不会被点开
function expand(x,y){
	if(valid(x,y-1)==true)
			{
				if(mines[x][y-1]==0)
					calculate(x,y-1);
			}
			if(valid(x,y+1)==true)
			{
				if(mines[x][y+1]==0)
					calculate(x,y+1);
			}
			if(valid(x-1,y)==true)
			{
				if(mines[x-1][y]==0)
					calculate(x-1,y);
			}
			if(valid(x+1,y)==true)
			{
				if(mines[x+1][y]==0)
					calculate(x+1,y);
			}
			if(valid(x-1,y-1)==true)
			{
				if(mines[x-1][y-1]==0)
					calculate(x-1,y-1);
			}
			if(valid(x-1,y+1)==true)
			{
				if(mines[x-1][y+1]==0)
					calculate(x-1,y+1);
			}
			if(valid(x+1,y+1)==true)
			{
				if(mines[x+1][y+1]==0)
					calculate(x+1,y+1);
			}
			if(valid(x+1,y-1)==true)
			{
				if(mines[x+1][y-1]==0)
					calculate(x+1,y-1);
			}
}

//判断是否赢了
function isWin(){
	for(var x=0;x<mines.length;x++)
	{
		for(var y=0;y<mines[x].length;y++)
		{
			if(mines[x][y]==0)
				return false;
		}
	}
	return true;
}

//判断单元格是否是地雷
function isMine(x,y){
	if(valid(x,y)==true){
		if(mines[x][y]==1||mines[x][y]==11)
		{
			return true;
		}
	}
	return false;
}

//判断单元格是否有效
function valid(x,y){
	if(x>=0&&y>=0&&x<row&&y<col){
		return true;
	}
}



