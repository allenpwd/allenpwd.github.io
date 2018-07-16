// JavaScript Document
window.onload=init;

var array;
var temp;
var score=0;
function init(){
	//初始化二维数组
	array=new Array([],[],[],[]);
	temp=new Array([],[],[],[]);
	//创建、初始化表格
	var body=document.getElementById("main");
	body.onkeydown=key;
	var text=body.innerHTML+"<center><table>";
	for(var x=0;x<4;x++)
	{
		text+="<tr>";
		for(var y=0;y<4;y++)
		{
			text+="<td id="+(x*4+y)+"></td>";
		}
		text+="</tr>";
	}
	text+="</table><br/><input type=button onclick='start()' value='重新开始'/></center>";
	body.innerHTML=text;
	start();
}

function start(){
	for(var x=0;x<4;x++)
	{
		for(var y=0;y<4;y++)
		{
			array[x][y]=0;
		}
	}
	//清空表格单元文本
	//开始时需要随机出现一个单
	score=0;
	var h1=document.getElementById("h1");
	h1.innerText="得分:"+score;
	arise();
	updateTable();
}

function key(){
	var same=true;
	for(var x=0;x<4;x++)
	{
		for(var y=0;y<4;y++)
		{
			temp[x][y]=array[x][y];
		}
	}
	var lu=[0,1,2,3];
	var rd=[3,2,1,0];
	switch(event.keyCode)
	{
		case(37):
			lr(array,[0,1,2,3],true);
			break;
		case(38):
			ud(array,lu,true);
			break;
		case(39):
			lr(array,rd,true);
			break;
		case(40):
			ud(array,rd,true);
			break;
	}
	
	if(isSame(temp,array)==false)
	{
		arise();
		updateTable();
	}
	else if(isOver())
	{
		var h1=document.getElementById("h1");
		h1.innerText=h1.innerText+"  游戏结束！";
	}
}

function isOver(){
	var same=true;
	for(var x=0;x<4;x++)
	{
		for(var y=0;y<4;y++)
		{
			temp[x][y]=array[x][y];
		}
	}
	lr(temp,[0,1,2,3],false);
	if(isSame(temp,array)==false)
	{
		return false;
	}
	lr(temp,[3,2,1,0],false);
	if(isSame(temp,array)==false)
	{
		return false;
	}
	ud(temp,[0,1,2,3],false);
	if(isSame(temp,array)==false)
	{
		return false;
	}
	ud(temp,[3,2,1,0],false);
	if(isSame(temp,array)==false)
	{
		return false;
	}
	return true;
}

function isSame(temp,array){
	for(var x=0;x<4;x++)
	{
		for(var y=0;y<4;y++)
		{
			if(temp[x][y]!=array[x][y])
			{
				return false;
			}
		}
	}
	return true;
}

function addScore(x,y){
	score+=array[x][y];
	var h1=document.getElementById("h1");
	h1.innerText="得分:"+score;
	var tdNode=document.getElementById(x*4+y);
	tdNode.style.left="0px";
	tdNode.style.top="0px";
	float(x,y,0);
}

//根据数组更新表格
function updateTable(){
	for(var x=0;x<4;x++)
	{
		for(var y=0;y<4;y++)
		{
			var td=document.getElementById(4*x+y);
			var text=array[x][y];
			if(text==0)
			{
				td.className="";
				td.innerText="";
			}
			else
			{
				td.className="bg"+text;
				td.innerText=text.toString();
			}
		}
	}
}

function lr(array,maps,flag){
	for(var x=0;x<4;x++)
	{
		var num=0;
		//往左排
		for(i=0;i<4;i++)
		{
			if(array[x][maps[i]]!=0)
			{
				array[x][maps[num]]=array[x][maps[i]];
				num++;
			}
		}
		var i=0;
		while(i<num-1)
		{
			if(array[x][maps[i]]==array[x][maps[i+1]])
			{
				array[x][maps[i]]*=2;
				if(flag)
					addScore(x,maps[i]);
				for(var j=i+1;j<num-1;j++)
				{
					array[x][maps[j]]=array[x][maps[j+1]];
				}
				array[x][maps[num-1]]=0;
			}
			i++;
		}
		while(num<4)
		{
			array[x][maps[num]]=0;
			num++;
		}
	}
}

function ud(array,maps,flag){
	for(var x=0;x<4;x++)
	{
		var num=0;
		for(var i=0;i<4;i++)
		{
			if(array[maps[i]][x]!=0)
			{
				array[maps[num]][x]=array[maps[i]][x];
				num++;
			}
		}
		var i=0;
		while(i<num-1)
		{
			if(array[maps[i]][x]==array[maps[i+1]][x])
			{
				array[maps[i]][x]*=2;
				if(flag)
					addScore(maps[i],x);
				for(var j=i+1;j<num-1;j++)
				{
					array[maps[j]][x]=array[maps[j+1]][x];
				}
				array[maps[num-1]][x]=0;
			}
			i++;
		}
		while(num<4)
		{
			array[maps[num]][x]=0;
			num++;
		}
	}
}

//随机插入一个单元格
function arise(){
	var ar=[];
	var x,y,num;
	var numArr=[2,2,2,2,2,2,2,2,4];	
	for(var i=0;i<16;i++)
	{
		x=parseInt(i/4);
		y=i%4;
		if(array[x][y]==0)
		{
			ar.push(i);
		}
	}
	if(ar.length==0)
	{
		return;
	}
	num=numArr[parseInt(Math.random()*numArr.length)];
	var ran=ar[parseInt(Math.random()*ar.length)];
	x=parseInt(ran/4);
	y=ran%4;
	array[x][y]=num;
}

function float(x,y,time){
	if(time>5)
		return;
	time++;
	window.setTimeout("float("+x+","+y+","+time+")",50);
	tdNode=document.getElementById(x*4+y);
	var l=parseInt(tdNode.style.left)-1;
	var t=parseInt(tdNode.style.top)-1;
	tdNode.style.left=l+"px";
	tdNode.style.top=t+"px";
}


