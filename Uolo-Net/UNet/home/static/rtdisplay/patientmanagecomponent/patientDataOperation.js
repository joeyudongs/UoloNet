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

// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

//数据访问对象
//var oPatientdataModel = new sap.ui.model.odata.ODataModel("/proxy/http/192.168.9.19:8080/bods.svc",true,"","",null,true,true,true,"",true);

/////////////////////////////////////////////////////
//获取医生分类数据
//var doctorLevellist_Patient;
//function getDoctorLevelsuccess_Patient(bResult) {
//    //alert("成功查询的获取医生分类数据");
//    //var results=new Array();
//    doctorLevellist_Patient = bResult.results; 				
//    console.log(doctorLevellist); 
//	//填充医生分类选择树
//    //addtreechild();
//}
//
//function getDoctorLevelerror_Patient(bResult) {
//    console.log('---Get Data error-----');
//    //alert("错误返回的结果: " + bResult);
//    console.log(bResult.message);
//}
//
////获取医生分类数据，填充医生分类选择树
//function GetDoctorLevel_Patient(){	
//    PublicDataAccessModel.read("/DoctorLevel?token="+token+"&$orderby=LevelIndex asc", {success: getDoctorLevelsuccess_Patient, error: getDoctorLevelerror_Patient});
//}
/////////////////////////////////////////////////

////////////////////////////////////////////////
//获取医院数据,填充医院选择框
var hospitallist_patient;
function getHospitalsuccess_Patient(bResult) {
    //alert("成功查询的获取医院数据");    
    hospitallist_patient = bResult.results;
    //console.log(hospitallist_patient);
    
    //填充医院选择框
	setPatientHospital();
	setPatientNativePlaceCombo();//肿瘤类型
	 for(var n=0;n<current_userRole.length;n++){
    	if(current_userRole.length > 1){
			if(((current_userRole[n].RoleName == "Doctor") && (current_userRole[n+1].RoleName == "HospitalAdmin")) ||
			   ((current_userRole[n].RoleName == "HospitalAdmin") && (current_userRole[n+1].RoleName == "Doctor")) ){
			   		//获取当前医生所有患者主数据,填充患者显示列表
				    //GetpatientAllDataFromID(current_userid);
			   	    GetpatientAllDataFromIDAjax(current_userid);
				    break;
			};
    	}else{
    		if(current_userRole[n].RoleName == "SysAdmin"){
				//获取所有患者主数据,填充患者显示列表
			    //GetpatientAllData();
    			GetpatientAllDataAjax();
			    break;
			}else if(current_userRole[n].RoleName == "Patient"){
				if(hospitallist_patient != null){
					patientHospitalBrowse.setValue(hospitallist_patient[0].HospitalName);
				};
				break;
			}else if(current_userRole[n].RoleName == "Doctor"){
				//获取当前医生所有患者主数据,填充患者显示列表
			    //GetpatientAllDataFromID(current_userid);
				GetpatientAllDataFromIDAjax(current_userid);
			    break;
			};
    	};
    };
};
function getHospitalerror_Patient(bResult) {
    console.log('---Get Data error-----');
    //alert("错误返回的结果: " + bResult);
};

//获取医院数据,填充医院选择框
function GetHospital_Patient(){
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token,{success: getHospitalsuccess_Patient, error: getHospitalerror_Patient});
};

//根据指定医院ID获取指定医院数据,填充医院选择框
function GetHospitalFromHospitalID_Patient(hospitalid){
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token+"&$filter=RecId eq '"+hospitalid+"'",{success: getHospitalsuccess_Patient, error: getHospitalerror_Patient});
};
//////////////////////////////////////////////

////////////////////////////////////////////////
//获取当前医生所有患者主数据,填充患者显示表格
var patientAllDatalist;
var patientListData = {navigation:[]};
var patientTableData = {navigationtable:[]};
function getpatientAllsuccess(bResult) {
    //alert("成功查询的获取患者数据");
	patientAllDatalist = bResult.results;
	for(var i=0;i<patientListData.navigation.length;i++){
		patientListData.navigation.remove(i);//删除下标为 i 的元素
		patientTableData.navigationtable.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<patientAllDatalist.length;i++){
		patientListData.navigation[i] = {
			Address_: patientAllDatalist[i].Address_,
			Addressinfo: patientAllDatalist[i].Addressinfo,
			Age_: patientAllDatalist[i].Age_,
            LoginID: patientAllDatalist[i].LoginID,
			LoginPwd: patientAllDatalist[i].LoginPwd,
			title: patientAllDatalist[i].Name,
            PatientNamePinyin: patientAllDatalist[i].NamePinyin,
			Phone: patientAllDatalist[i].Phone,
            Sex_: patientAllDatalist[i].Sex_,
			Country: patientAllDatalist[i].Country,
			NativePlace: patientAllDatalist[i].NativePlace,
            QR: patientAllDatalist[i].QR,
            Portrait: patientAllDatalist[i].Portrait,
            DoctorID: patientAllDatalist[i].DoctorID,
			HospitalID: patientAllDatalist[i].HospitalID,
			RecId: patientAllDatalist[i].RecId,
            icon : "sap-icon://employee",
            iconInset : false,
            type : "Active",
            unread: true,
            press: "Content pressed"
		};
		var xbsex = "男";
		if(patientAllDatalist[i].Sex_ == "DOC_docotrAdd_Sex_B"){
			xbsex = "女";
		}
		
		var sage = patientAllDatalist[i].Age_;
		var csrq = "";
		if(sage != ""){
			sage =  sage.substring(6, (sage.length - 2));
			var objDate=new Date(parseInt(sage));
			csrq = objDate.Format("yyyy-MM-dd");
		};
		
		var address = "";
		if(patientAllDatalist[i].Address_ != ""){
			var Addresslist = patientAllDatalist[i].Address_.split('.');
			address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
			address = address + patientAllDatalist[i].Addressinfo;
		};
		
		var HospitalName="";
		if(hospitallist_patient != null){
				for(var m=0;m<hospitallist_patient.length;m++){
					//HospitalName = hospitallist_patient[m].RecId;
					if(patientAllDatalist[i].HospitalID == hospitallist_patient[m].RecId){
						HospitalName = hospitallist_patient[m].HospitalName;
						break;
					};
				};
		};
		
		patientTableData.navigationtable[i] = {
			number:i+1,
			Address: address,			
			Age_: csrq,            
			PatientName: patientAllDatalist[i].Name,
            PatientNamePinyin: patientAllDatalist[i].NamePinyin,
			Phone: patientAllDatalist[i].Phone,			
            Sex_: xbsex,
			Country: patientAllDatalist[i].Country,
			NativePlace: patientAllDatalist[i].NativePlace,
            Doctor: patientAllDatalist[i].DoctorID,
			Hospital:HospitalName,
			RecId: patientAllDatalist[i].RecId
		};
	};
    //console.log(patientAllDatalist);
    
    if(RefreshpatientData){
    	RefreshpatientData = false;
		//单击刷新后的操作    	
		//初始化患者列表中显示的数据
        //initialisePatientList();
        
        //向患者表格中填充数据
        iniPatientTableMasterData();
    }else{
    	//初始化患者列表中显示的数据
        //initialisePatientList();
        
        //向患者表格中填充数据
        iniPatientTableMasterData();
    }
}
function getpatientAllerror(bResult) {
    console.log('---Get Data error-----');
    //alert("错误返回的结果: " + bResult);
}
//用ajax 获取当前医生所有患者主数据,填充患者显示表格
function getpatientAllAjax(bResult) {
    //alert("成功查询的获取患者数据");
	patientAllDatalist = bResult.data;
	for(var i=0;i<patientListData.navigation.length;i++){
		patientListData.navigation.remove(i);//删除下标为 i 的元素
		patientTableData.navigationtable.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<patientAllDatalist.length;i++){
		patientListData.navigation[i] = {
			Address_: patientAllDatalist[i].Address_,
			Addressinfo: patientAllDatalist[i].Addressinfo,
			Age_: patientAllDatalist[i].Age_,
            LoginID: patientAllDatalist[i].LoginID,
			LoginPwd: patientAllDatalist[i].LoginPwd,
			title: patientAllDatalist[i].Name,
            PatientNamePinyin: patientAllDatalist[i].NamePinyin,
			Phone: patientAllDatalist[i].Phone,
            Sex_: patientAllDatalist[i].Sex_,
			Country: patientAllDatalist[i].Country,
			NativePlace: patientAllDatalist[i].NativePlace,
            QR: patientAllDatalist[i].QR,
            Portrait: patientAllDatalist[i].Portrait,
            DoctorID: patientAllDatalist[i].DoctorID,
			HospitalID: patientAllDatalist[i].HospitalID,
			RecId: patientAllDatalist[i].RecId,
            icon : "sap-icon://employee",
            iconInset : false,
            type : "Active",
            unread: true,
            press: "Content pressed"
		};
		var xbsex = "男";
		if(patientAllDatalist[i].Sex_ == "DOC_docotrAdd_Sex_B"){
			xbsex = "女";
		}
		var sage = patientAllDatalist[i].Age_;
		var csrq = "";
       	if(typeof(sage) == "undefined"){
        }else{
        	if(sage != ""){
				//sage =  sage.substring(6, (sage.length - 2));
				//var objDate=new Date(parseInt(sage));
				var objDate=new Date(sage);
				csrq = objDate.Format("yyyy-MM-dd");
			};
        };
		var address = "";
		if(patientAllDatalist[i].Address_ != ""){
			var Addresslist = patientAllDatalist[i].Address_.split('.');
			address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
			address = address + patientAllDatalist[i].Addressinfo;
		};
		
		var HospitalName="";
		if(hospitallist_patient != null){
			for(var m=0;m<hospitallist_patient.length;m++){
				//HospitalName = hospitallist_patient[m].RecId;
				if(patientAllDatalist[i].HospitalID == hospitallist_patient[m].RecId){
					HospitalName = hospitallist_patient[m].HospitalName;
					break;
				};
			};
		}
		
		patientTableData.navigationtable[i] = {
			number:i+1,
			Address: address,			
			Age_: csrq,            
			PatientName: patientAllDatalist[i].Name,
            PatientNamePinyin: patientAllDatalist[i].NamePinyin,
			Phone: patientAllDatalist[i].Phone,			
            Sex_: xbsex,
			Country: patientAllDatalist[i].Country,
			NativePlace: getNativePlaceName(patientAllDatalist[i].NativePlace),
            Doctor: patientAllDatalist[i].DoctorID,
			Hospital:HospitalName,
			RecId: patientAllDatalist[i].RecId
		};
	};
    //console.log(patientAllDatalist);
    
    if(RefreshpatientData){
    	RefreshpatientData = false;
		//单击刷新后的操作    	
		//初始化患者列表中显示的数据
        //initialisePatientList();
        
        //向患者表格中填充数据
        iniPatientTableMasterData();
    }else{
    	//初始化患者列表中显示的数据
        //initialisePatientList();
        
        //向患者表格中填充数据
        iniPatientTableMasterData();
    }
};



//获取当前医生所有患者主数据,填充患者显示列表
function GetpatientAllDataFromID(doctorid){
	//获取患者数据 
	//PublicDataAccessModel.read("/Patient?token="+token+"&$filter=DoctorID eq '"+doctorid+"' &$orderby=CreatedDateTime desc",{success: getpatientAllsuccess, error: getpatientAllerror});
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=NativePlace ne '' &$orderby=CreatedDateTime desc",{success: getpatientAllsuccess, error: getpatientAllerror});
};

//用ajax 获取当前医生所有患者主数据,填充患者显示列表
//http://192.168.9.19:8080/custom/query?token=?&action=listpatient&option=?        列出所有患者，参数为医生ID
function GetpatientAllDataFromIDAjax(doctorid){
	//TODO
	patientTableMaster.setBusy(true);
	$.ajax({
			type: "get",
			async: false,
			url:serverurl+"/custom/query",
			dataType: "json",
			data: {
				token: token,
				action: "listpatient",
				option: doctorid
			},
			success: function (data) {
				patientTableMaster.setBusy(false);
				console.log(data);
				getpatientAllAjax(data);
			},
			timeout: 5000,
			error: function () {
				patientTableMaster.setBusy(false);
				//alert('查询的信息失败');
			}
		});
};


//获取所有患者主数据,填充患者显示列表
function GetpatientAllData(){
	//获取患者数据
//	PublicDataAccessModel.read("/Patient?token="+token+"&$orderby=CreatedDateTime desc",{success: getpatientAllsuccess, error: getpatientAllerror});
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=NativePlace ne '' &$orderby=CreatedDateTime desc",{success: getpatientAllsuccess, error: getpatientAllerror});
};

//用Ajax获取所有患者主数据,填充患者显示列表
//http://192.168.9.19:8080/custom/query?token=?&action=listallpatient          列出所有患者
function GetpatientAllDataAjax(){
	//TODO
	patientTableMaster.setBusy(true);
	$.ajax({
			type: "get",
			async: false,
			url:serverurl+"/custom/query",
			dataType: "json",
			data: {
				token: token,
				action: "listallpatient"
			},
			success: function (data) {
				patientTableMaster.setBusy(false);
				console.log(data);
				getpatientAllAjax(data);
			},
			timeout: 5000,
			error: function () {
				patientTableMaster.setBusy(false);
				//alert('查询的信息失败');
			}
		});
};


//////////////////////////////////////////////

//////////////////////////////////////////////
//根据患者ID获取患者主数据,填充患者显示列表
function GetpatientDataFromPatientID(patientid){	
	//获取患者数据
//	PublicDataAccessModel.read("/Patient?token="+token+"&$filter=RecId eq '"+patientid+"'",{success: getpatientIDsuccess, error: getpatientIDerror});
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=RecId eq '"+patientid+"'",{success: getpatientIDsuccess, error: getpatientIDerror});
}
//根据患者ID获取患者主数据,填充患者显示列表
function getpatientIDsuccess(bResult) {
    //alert("成功查询的获取患者数据");
	patientAllDatalist = bResult.results;
	for(var i=0;i<patientListData.navigation.length;i++){
		patientListData.navigation.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<patientAllDatalist.length;i++){
		patientListData.navigation[i] = {
			Address_: patientAllDatalist[i].Address_,
			Addressinfo: patientAllDatalist[i].Addressinfo,
			Age_: patientAllDatalist[i].Age_,
            LoginID: patientAllDatalist[i].LoginID,
			LoginPwd: patientAllDatalist[i].LoginPwd,
			title: patientAllDatalist[i].Name,
            PatientNamePinyin: patientAllDatalist[i].NamePinyin,
			Phone: patientAllDatalist[i].Phone,
            Sex_: patientAllDatalist[i].Sex_,
			Country: patientAllDatalist[i].Country,
			NativePlace: patientAllDatalist[i].NativePlace,
            QR: patientAllDatalist[i].QR,
            Portrait: patientAllDatalist[i].Portrait,
            DoctorID: patientAllDatalist[i].DoctorID,
			HospitalID: patientAllDatalist[i].HospitalID,
			RecId: patientAllDatalist[i].RecId,
            icon : "sap-icon://employee",
            iconInset : false,
            type : "Active",
            unread: true,
            press: "Content pressed"
		};
	};
	currentSelectpatientRecId = current_userid;
	//根据指定医院ID获取指定医院数据,填充医院选择框
	GetHospitalFromHospitalID_Patient(patientAllDatalist[0].HospitalID);
	//初始化患者列表中显示的数据
    initialisePatientList(currentSelectpatientRecId);
    //根据当前选择的患者id,填充患者基本信息中各栏数据（通过odata 接口获取的数据用这个方法填充数据）
    setPatientBasicInfoFromID2();
    //获取指定患者的治疗计划数据
    GetTreatmentPlanFromPatientID();
    
    getDicom();
    //TODO 点击详情的时候要重新填数据
    
    //绑定并填充病历记录数据
    bindMedicalRecordTable();
    getMedicalRecord();
    
    //设置基本信息中各栏是否为可编辑状态
    setPatientBasicInfoFromState(false);    
    
    //基本信息中编辑、保存按钮
//    oSavePatientBasicInfoButton.setVisible(false);
//    oEidtPatientBasicInfoButton.setVisible(false);
    
    //病历记录 添加/修改按钮
    MedicalRecordBtnCRUD.setVisible(false);	
    //显示患者详细信息页
    app.to(pagePatientinfo);
}
function getpatientIDerror(bResult) {
    //console.log('---Get Data error-----');
    sap.m.MessageToast.show("获取数据失败！"+bResult.message);
}
/////////////////////////////////////////////

//分享患者数据操作
/////////////////////////////////////////////
//医生分类数据
var current_AllDoctorLevel_Patient;
var current_AllDoctor_Patient = {navigationTableSelectDialog:[]};
var current_AllHospital_Patient;
var current_AllUserRelation_Patient;
//存放当前勾选要分享患者id
var current_sharepatientRecIdarr=[];

//医生分类数据
function getAllDoctorLevelsuccess_Patient(bResult) {
    //alert("成功查询的获取医生分类数据");
    //var results=new Array();
    current_AllDoctorLevel_Patient = bResult.results;
}
//获取医生分类数据
function GetAllDoctorLevel_Patient(){	
    PublicDataAccessModel.read("/DoctorLevel?token="+token+"&$orderby=LevelIndex asc", {success: getAllDoctorLevelsuccess_Patient, error: getHospitalerror_Patient});
}

//获取当前所有医院数据
function GetCurrentAllHospital_Patient(){
	//获取医院数据
	PublicDataAccessModel.read("/Hospital?token="+token,{success: getAllHospitalsuccess_Patient, error: getHospitalerror_Patient});
};
function getAllHospitalsuccess_Patient(bResult) {
    //alert("成功查询的获取医院数据"); 
	//console.log(hospitallist_patient);
    current_AllHospital_Patient = bResult.results;
    for(var i=0;i<current_AllDoctor_Patient.navigationTableSelectDialog.length;i++){    	
		for(var n=0;i<current_AllHospital_Patient.length;n++){
		 	if(current_AllDoctor_Patient.navigationTableSelectDialog[i].HospitalID == current_AllHospital_Patient[n].RecId){
		 		current_AllDoctor_Patient.navigationTableSelectDialog[i].HospitalName = current_AllHospital_Patient[n].HospitalName;				
		 		break;
		 	}
		};
	};
};

//用ajax 获取所有医生数据
//http://192.168.9.19:8080/custom/query?token=?&action=listalldoctor   列出所有医生
function GetCurrentAllDoctorAjax_Patient(){
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
				//console.log(data);
				CurrentAllDoctorAjax_Patient(data);
			},
			timeout: 5000,
			error: function () {
				//alert('查询的信息失败');
			}
		});
};

//用ajax 请求获取所有医生数据
function CurrentAllDoctorAjax_Patient(bResult) {
    //alert("成功查询的获取医院数据");	
	for(var i=0;i<current_AllDoctor_Patient.length;i++){
		current_AllDoctor_Patient.navigationTableSelectDialog.remove(i);//删除下标为 i 的元素
		i--;
	};
	for(var i=0;i<bResult.data.length;i++){
		current_AllDoctor_Patient.navigationTableSelectDialog[i] = {
			number:i+1,
			RecId: bResult.data[i].RecId,
			DoctorName: bResult.data[i].Name,
			//DoctorLevel: bResult.data[i].DoctorLevel,
			HospitalID: bResult.data[i].HospitalID,
			HospitalName: ""
		};
	};
};

//获取当前所有医生患者关系表数据
function GetCurrentAllUserRelation_Patient(){	
	PublicDataAccessModel.read("/UserRelation?token="+token,{success: getAllUserRelationsuccess_Patient, error: getHospitalerror_Patient});
};
function getAllUserRelationsuccess_Patient(bResult) {
    //alert("成功查询的获取医院数据"); 
	//console.log(hospitallist_patient);
    current_AllUserRelation_Patient = bResult.results;
};

//////////////////////////////////////////////

















