/* 方法:Array.remove(dx)
* 功能:删除数组元素.
* 参数:dx删除元素的下标.
* 返回:在原数组上修改数组
*/
//经常用的是通过遍历,重构数组.
Array.prototype.remove=function(dx)
{
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
	if(this[i]!=this[dx])
	{
	this[n++]=this[i]
	}
	}
	this.length-=1
}

/////////////////////////////////////////////////////
//获取医生分类数据
var doctorLevellist;
function getDoctorLevelsuccess(bResult) {
    //alert("成功查询的获取医生分类数据");
    //var results=new Array();
    doctorLevellist = bResult.results;
    //console.log(doctorLevellist); 
	//填充医生分类选择树
    addtreechild();
}

function getDoctorLevelerror(bResult) {
    console.log('---Get Data error-----');
    //alert("错误返回的结果: " + bResult);
    //console.log(bResult.message);
}

//获取医生分类数据，填充医生分类选择树
function GetDoctorLevel(){	
    PublicDataAccessModel.read("/DoctorLevel?token="+token+"&$orderby=LevelIndex asc", {success: getDoctorLevelsuccess, error: getDoctorLevelerror});
}
/////////////////////////////////////////////////

////////////////////////////////////////////////
//获取医院数据,填充医院选择框
var hospitallist;
function getHospitalsuccess(bResult) {
	odoctorTable.setBusy(false);
    //alert("成功查询的获取医院数据");
    hospitallist = bResult.results;
	//填充医院选择框
	setdoctorHospital();
    for(var n=0;n<current_userRole.length;n++){
    	if(current_userRole.length > 1){
			if(((current_userRole[n].RoleName == "Doctor") && (current_userRole[n+1].RoleName == "HospitalAdmin")) ||
			   ((current_userRole[n].RoleName == "HospitalAdmin") && (current_userRole[n+1].RoleName == "Doctor")) ){
			   		//获取指定医院所有医生数据,填充医生显示表格
					//GetdoctorAllDataFromHospitalID(current_hospitalID);
			   		GetdoctorAllDataFromHospitalIDAjax(current_hospitalID);
					break;
			};
    	}else{
    		if(current_userRole[n].RoleName == "SysAdmin"){
				//获取医生数据,填充医生选择框
			    //GetdoctorAllData();
			    GetdoctorAllDataAjax();
			    break;
			};
    	};
    };
};

function getHospitalAccountManagesuccess(bResult) {
    //alert("成功查询的获取医院数据");
    hospitallist = bResult.results;
	//填充医院选择框
	setdoctorHospitalEdit();
	
	//获取当前医生的信息,填充医生信息显示窗口
    GetdoctorDataFromDoctorlID(current_userid);		        
};

function getHospitalerror(bResult) {
	odoctorTable.setBusy(false);
    console.log('---Get Data error-----');
    //alert("错误返回的结果: " + bResult);
};

//获取全部医院数据,填充医院选择框
function GetHospital(){
	//TODO
	odoctorTable.setBusy(true);
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token,{success: getHospitalsuccess, error: getHospitalerror});
};

//根据指定医院ID获取指定医院数据,填充医院选择框
function GetHospitalFromHospitalID(hospitalid){
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token+"&$filter=RecId eq '"+hospitalid+"'",{success: getHospitalsuccess, error: getHospitalerror});
};

//根据指定医院ID获取指定医院数据,填充医院选择框
function GetHospitalFromHospitalIDAccountManage(hospitalid){
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token+"&$filter=RecId eq '"+hospitalid+"'",{success: getHospitalAccountManagesuccess, error: getHospitalerror});
};
//////////////////////////////////////////////

////////////////////////////////////////////////
//获取所有医生数据,填充医生显示表格
var doctorAlllist=[];
var doctorAllDatalist;
function getdoctorAllsuccess(bResult) {
    //alert("成功查询的获取医院数据");
	doctorAllDatalist = bResult.results;
	for(var i=0;i<doctorAlllist.length;i++){
		doctorAlllist.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<doctorAllDatalist.length;i++){
		doctorAlllist[i] = {
			Address_: doctorAllDatalist[i].Address_,
			Addressinfo: doctorAllDatalist[i].Addressinfo,
			Age: doctorAllDatalist[i].Age_,//Age
			Country: doctorAllDatalist[i].Country,
			DoctorLevel: doctorAllDatalist[i].DoctorLevel,
			DoctorName: doctorAllDatalist[i].Name,//DoctorName
			Fax: doctorAllDatalist[i].Fax,
			HospitalID: doctorAllDatalist[i].HospitalID,
			//IsAdmin: doctorAllDatalist[i].IsAdmin,
			LoginID: doctorAllDatalist[i].LoginID,
			LoginPwd: doctorAllDatalist[i].LoginPwd,
			Phone: doctorAllDatalist[i].Phone,
			Portrait: doctorAllDatalist[i].Portrait,
			QR: doctorAllDatalist[i].QR,
			RecId: doctorAllDatalist[i].RecId,
			Sex_: doctorAllDatalist[i].Sex_
		};
	};
    //console.log(doctorAllDatalist);
	if(RefreshdoctorAllData){
		RefreshdoctorAllData = false;
		//单击刷新后的操作
		oSplitApp.toDetail(doctorTablePage);
        GetdoctorfilterData(currentSelectdoctorLevel);
	}else{
		//第一次进窗口的操作
	    //填充医生显示表格
		setdoctortable();
	};
};
function getdoctorAllerror(bResult) {
    console.log('---Get Data error-----');
    //alert("错误返回的结果: " + bResult);
};
//用ajax 请求获取的指定医院所有医生数据,填充医生显示表格
function getdoctorAllAjax(bResult) {
    //alert("成功查询的获取医院数据");
	doctorAllDatalist = bResult.data;
	for(var i=0;i<doctorAlllist.length;i++){
		doctorAlllist.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<doctorAllDatalist.length;i++){
		doctorAlllist[i] = {
			Address_: doctorAllDatalist[i].Address_,
			Addressinfo: doctorAllDatalist[i].Addressinfo,
			Age: doctorAllDatalist[i].Age_,//Age
			Country: doctorAllDatalist[i].Country,
			DoctorLevel: doctorAllDatalist[i].DoctorLevel,
			DoctorName: doctorAllDatalist[i].Name,//DoctorName
			Fax: doctorAllDatalist[i].Fax,
			HospitalID: doctorAllDatalist[i].HospitalID,
			//IsAdmin: doctorAllDatalist[i].IsAdmin,
			LoginID: doctorAllDatalist[i].LoginID,
			LoginPwd: doctorAllDatalist[i].LoginPwd,
			Phone: doctorAllDatalist[i].Phone,
			Portrait: doctorAllDatalist[i].Portrait,
			QR: doctorAllDatalist[i].QR,
			RecId: doctorAllDatalist[i].RecId,
			Sex_: doctorAllDatalist[i].Sex_
		};
	};
    //console.log(doctorAllDatalist);
	if(RefreshdoctorAllData){
		RefreshdoctorAllData = false;
		//单击刷新后的操作
		oSplitApp.toDetail(doctorTablePage);
        GetdoctorfilterData(currentSelectdoctorLevel);
	}else{
		//第一次进窗口的操作
	    //填充医生显示表格
		setdoctortable();
	};
};

function getcurrentdoctorsuccess(bResult) {
    //alert("成功查询的获取医院数据");
	doctorAllDatalist = bResult.results;
	for(var i=0;i<doctorAlllist.length;i++){
		doctorAlllist.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<doctorAllDatalist.length;i++){
		doctorAlllist[i] = {
			Address_: doctorAllDatalist[i].Address_,
			Addressinfo: doctorAllDatalist[i].Addressinfo,
			Age: doctorAllDatalist[i].Age_,
			Country: doctorAllDatalist[i].Country,
			DoctorLevel: doctorAllDatalist[i].DoctorLevel,
			DoctorName: doctorAllDatalist[i].Name,
			Fax: doctorAllDatalist[i].Fax,
			HospitalID: doctorAllDatalist[i].HospitalID,
			//IsAdmin: doctorAllDatalist[i].IsAdmin,			
			LoginID: doctorAllDatalist[i].LoginID,
			LoginPwd: doctorAllDatalist[i].LoginPwd,
			Phone: doctorAllDatalist[i].Phone,
			Portrait: doctorAllDatalist[i].Portrait,
			QR: doctorAllDatalist[i].QR,
			RecId: doctorAllDatalist[i].RecId,
			Sex_: doctorAllDatalist[i].Sex_
		};
	};
	//填充医生显示窗口
    setTableSimpleFormEdit();
};

//获取当前医生的信息,填充医生信息显示窗口
function GetdoctorDataFromDoctorlID(doctorid){
	//获取医生数据
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=RecId eq '"+doctorid+"'",{success: getcurrentdoctorsuccess, error: getdoctorAllerror});
};

//获取指定医院所有医生数据,填充医生显示表格
function GetdoctorAllDataFromHospitalID(hospitalid){
	//获取医生数据
	//odataModel.read("/Doctor?token="+token+"&$filter=IsAdmin eq false &$orderby=DoctorLevel asc",{success: getdoctorAllsuccess, error: getdoctorAllerror});
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=HospitalID eq '"+hospitalid+"' &$orderby=DoctorLevel asc",{success: getdoctorAllsuccess, error: getdoctorAllerror});
};

//用ajax 获取指定医院所有医生数据,填充医生显示表格
//http://192.168.9.19:8080/custom/query?token=?&action=listdoctor&option=?        列出所有医生，参数为医院ID
function GetdoctorAllDataFromHospitalIDAjax(hospitalid){
	$.ajax({
			type: "get",
			async: false,
			url:serverurl+"/custom/query",
			dataType: "json",
			data: {
				token: token,
				action: "listdoctor",
				option: hospitalid
			},
			success: function (data) {
				console.log(data);
				getdoctorAllAjax(data);
			},
			timeout: 5000,
			error: function () {
				//alert('查询的信息失败');
			}
		});
};

//获取所有医生数据,填充医生显示表格
function GetdoctorAllData(){
	//获取医生数据
	//PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=IsAdmin eq false &$orderby=DoctorLevel asc",{success: getdoctorAllsuccess, error: getdoctorAllerror});
	//odataModel.read("/Doctor?token="+token+"&$orderby=DoctorLevel asc",{success: getdoctorAllsuccess, error: getdoctorAllerror});
	
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=DoctorLevel ne '' &$orderby=DoctorLevel asc",{success: getdoctorAllsuccess, error: getdoctorAllerror});
};

//用ajax 获取所有医生数据,填充医生显示表格
//http://192.168.9.19:8080/custom/query?token=?&action=listalldoctor          列出所有医生
function GetdoctorAllDataAjax(){
	$.ajax({
			type: "get",
			async: false,
			url:serverurl+"/custom/query",
			dataType: "json",
			data: {
				token: token,
				action: "listalldoctor"
			},
			success: function (data) {
				console.log(data);
				getdoctorAllAjax(data);
			},
			timeout: 5000,
			error: function () {
				//alert('查询的信息失败');
			}
		});
};

//获取所有医生数据,填充医生显示表格
function GetdoctorfilterData(Level){
	//获取医生数据
	//odataModel.read("/Doctor?token="+token+"&$filter=DoctorLevel eq '"+Level+"'",{success: getdoctorAllsuccess, error: getdoctorAllerror});
	for(var i=0;i<doctorAlllist.length;i++){
		doctorAlllist.remove(i);//删除下标为 i 的元素
		i--;
	};
	var n=0;
	if(doctorAllDatalist != null){		
		for(var i=0;i<doctorAllDatalist.length;i++){
			if(Level == "All"){
				doctorAlllist[n] = {
						Address_: doctorAllDatalist[i].Address_,
						Addressinfo: doctorAllDatalist[i].Addressinfo,
						Age: doctorAllDatalist[i].Age_,
						Country: doctorAllDatalist[i].Country,
						DoctorLevel: doctorAllDatalist[i].DoctorLevel,
						DoctorName: doctorAllDatalist[i].Name,
						Fax: doctorAllDatalist[i].Fax,
						HospitalID: doctorAllDatalist[i].HospitalID,
						//IsAdmin: doctorAllDatalist[i].IsAdmin,			
						LoginID: doctorAllDatalist[i].LoginID,
						LoginPwd: doctorAllDatalist[i].LoginPwd,
						Phone: doctorAllDatalist[i].Phone,
						Portrait: doctorAllDatalist[i].Portrait,
						QR: doctorAllDatalist[i].QR,
						RecId: doctorAllDatalist[i].RecId,
						Sex_: doctorAllDatalist[i].Sex_
					};
				n++;
			}else{
				if(doctorAllDatalist[i].DoctorLevel == Level ){
					doctorAlllist[n] = {
						Address_: doctorAllDatalist[i].Address_,
						Addressinfo: doctorAllDatalist[i].Addressinfo,
						Age: doctorAllDatalist[i].Age_,
						Country: doctorAllDatalist[i].Country,
						DoctorLevel: doctorAllDatalist[i].DoctorLevel,
						DoctorName: doctorAllDatalist[i].Name,
						Fax: doctorAllDatalist[i].Fax,
						HospitalID: doctorAllDatalist[i].HospitalID,
						//IsAdmin: doctorAllDatalist[i].IsAdmin,			
						LoginID: doctorAllDatalist[i].LoginID,
						LoginPwd: doctorAllDatalist[i].LoginPwd,
						Phone: doctorAllDatalist[i].Phone,
						Portrait: doctorAllDatalist[i].Portrait,
						QR: doctorAllDatalist[i].QR,
						RecId: doctorAllDatalist[i].RecId,
						Sex_: doctorAllDatalist[i].Sex_
					};
					n++;
				}
			};
		};
		//填充医生显示表格
		setdoctortable();
	};
};
