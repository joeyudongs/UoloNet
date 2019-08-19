//添加医生

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

jQuery.sap.require("sap.m.MessageToast");

//请输入医生账户
var doctorAccount = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '医生账户系统自动生成',maxLength:20});
//请输入医生姓名
var doctorName = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生姓名 ...',maxLength:40});

//医生性别单选框组
var oGenderRadioButton1 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_A"), selected: true});//'男'
var oGenderRadioButton2 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_B"), selected: false});//'女'
var doctorGender = new sap.m.HBox({
				items:[
					oGenderRadioButton1,
					oGenderRadioButton2
				]
});
//请选择医生出生年月
//var doctorAge = new sap.m.DateTimeInput({placeholder : "请选择医生出生年月",type : "Date"});
var doctorAge = new sap.m.DatePicker({dateValue: new Date(), valueFormat: "yyyy-MM-dd", displayFormat: "long"});

//请输入医生国籍
var doctorNational = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生国籍 ...',maxLength:25});

//医生职称单选框组
var oLevelRadioButton1 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_AA"), selected: true});//主任医师
var oLevelRadioButton2 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_AB"), selected: false});//副主任医师
var oLevelRadioButton3 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_BA"), selected: false});//主治医师
var oLevelRadioButton4 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_BB"), selected: false});//医师
var doctorLevel = new sap.m.HBox({
				items:[
					oLevelRadioButton1,
                    oLevelRadioButton2,
                    oLevelRadioButton3,
					oLevelRadioButton4
				]
});

//是否是医院管理员复选框
var doctormanageCBox = new sap.m.CheckBox({text:'是医院管理员',tooltip:'是医院管理员',checked:false});

//请输入帐户密码
var doctorpwd = new sap.m.Input({type: sap.m.InputType.Password,placeholder: '请输入帐户密码 ...',maxLength:30});

//请输入详细地址
var doctorAddressD = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入详细地址 ...',maxLength:80});
//请输入医生联系电话
var doctorPhone = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生联系电话 ...',maxLength:30});
//请输入医生联系传真
var doctorFax = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生联系传真 ...',maxLength:30});
//医生所属医院
var doctorHospital = new sap.m.ComboBox({
//            items: [
//                new sap.ui.core.Item({
//                    key: "4E9669261BAE4ADDBEA09379F749BA11",
//                    text: "湖南省肿瘤医院"
//                }),
//                new sap.ui.core.Item({
//                    key: "4B9669261BAE4ADDBEA09379F749BA13",
//                    text: "中南大学湘雅二医院"
//                })
//            ]
    });

var odoctorQR = new sap.m.Image({
        src: "data:image/gif;base64,R0lGODlhHwAeANU/AO1SReW2N+14Kf3YACOAulrAWtTW02Gh1uPIx/BkVFXKXu3t7bjZuoi9R7nV8fbOG8fBulSlWvh8ZlW0WvTu0aG8QqK92sGkdcWjoPr5+WyrUUaiV7q0oHWs2vrTCYOeiJ94QulCOYK34ceNifHEJfLWRuLf3tomHUWUzeQxLf/cDc1+dtzCOqKzo83o92mxbPSSjP/ohspCL2K1WG7Ga+k5NIGfWcbKKcu5ceTPBvDKAJfRkIyvjVvEXeV4af///yH5BAEAAD8ALAAAAAAfAB4AAAb/wJ9wSPwtDBCMEmJYFJ/QXwYx8kmuWIlvBMlEoaZVIptNmBMrw5eIObvfZkACgFn/MIA8/J3vj74jfYJycYMAIYh/TxCIiIaGjYg1NRBFCzYhNZGbk42TNSmhmiZELQogKZ+SNQkwrhICsbKzF0MLLwozMqmTKQAICy7CCxQlOg8PHh4DAyoPTj8QPQWnoikJCw4i29sOGSXKzOIqlT88CgXTuykhJg4HHdwdBxYUKuLjOFIv09Q2JydguIDXoaDBAw5i4GOmgkWGW/2ogTiBQASKAxgzHkAhgsLCZs8WzIjYQ4MMBBs1Zrxo7+MDEyILyJR5CiWKmzhxHmi58OWtzJkye8xA0IFATpwEOnj8SGJBhhdAZ+5wQMBozqoJPw5waC5qUANFq4pNylOcBxX6ok3wWoCGAQtjCVgwUWKhsgflfrKlweCtBQsGGFT46OFBAGg/WkxYu3eH4xcRcuC7+4ADkQURFrOduXiw2cKGEQuBkJkx2wkzlg1QVpgEiXJFWpQ2DXTCjdWUXVuOInuxb84NKD9wTWL3Fw4bIsz2zQIZcRIBjK8x8SG58ggbKjyHfkGNHSIGqm9IHqB8gAvdvXx/cgQCh/dMREMJAgA7",
        alt: "test image",
        decorative: false,
        width: "100px",
        height: "100px",
        densityAware: false
    });
var oButtonQR = new sap.m.Button({text:"生成二维码",width:"100px",type : sap.m.ButtonType.Emphasized});    
    oButtonQR.attachPress(function(){
        //alert("生成二维码")
        odoctorQR.setSrc("data:image/gif;base64,R0lGODlhHAAeANU/AJ+go4aZtKK2111cXT2g1thLFqfN5DCBuliLwPz6+YOf0e3s7NHR0bS0tODg35aly3l5eIC21TEyMmqZzouKjIKJnMjJyb3c7j2t20K452CBrnONuy6L2UlNTyBZpKSwvDWVzD94riCJxVO16tLd5vLx8UJ2uSFlp1xviefl5BtztNfX1r28uqysrMHAwFOx2tzb2zOm5W1tbfL2+vb19MXR4Hes55tELxdTmtjFvLfC3WGVypSVmNvm9IV+gf///yH5BAEAAD8ALAAAAAAcAB4AAAb/wJ9wOCxZGJYEccls/iwWWCPlrDJpLVeLAVtxS9amg7FIJBap1GKxYq3CwkUyYaHIBviBjOfSLqxdCQ0yMhAUFBUVFBAyHRAAPAxODA4LPjKIAQ+bDwoBFTx3EBAWTDBRMj48Gw8CNToCsQIPoBR6Mm9DCVuYq5sKrpybAhqgeBBKQg0sPhQAGwrR0Z2eAZ4+Gjw8ei1CNBQ8EC0a0tETNQob6hQ3GgEaLRADEGDMjwE7ChP7Ezs9OhoQ+CiAQt2GAC0G+GCRYJGPBgER7Nixzx+JCQMHINAQQoOGBqN4OGDE40PHgBMNCEAQYuCNk5o2NNjGwwIjAAE6hghxQMWE/xA4bhS48YFEDYPuElJocKlFzhMeTpzYYUDFhxw3Ohi4gAAqjhMBWMxrsKhBAA/qTBiYQSLCAhYoQEQQAaKuChUBXOhxEa5BCxOsTCA4MGFBAxQiIlx4QYAAiAMHPojFxcNHixYHEJiAfKAGRMUvMITG8PiAlg4yaGjjs4MuCBECWoRIPAMEAQy4X09YQcHRjwYAZDD4UFcugAPFLzTOkAGDYwsrBnRo8MOSjAYwIjQOYLsxCA4cCDBvHCEFAAkdwPwAIA9GdtsjcGPgYGMCB+YxyjPoIIFHkTs+LOBABMwVGJ4N92VQXgoDoEcDERZ00AEFC5RQQwQjFBhDhhHUQFaDAw1KIMkSDfAnXAIlkGDAigaQQAINNLDAnwTUNVGiBBJQYEEJZphBQwqD4DidFQzIgKME84Bjh4QS4gJHCUEK2UEeYz0IhxAlMNACBT5A0MwWVjIRBAA7");
    });

///////////////////////////////////////////////////////////////////
  //附件、图片上传
  var opicData = {
		"items" : [
			{
				// item with aggregation statuses
				"contributor" : "Dr. David Keane",
				"documentId" : "6b6ccd2f-e5c2-15b7-3b67-191564850063",
				"enableEdit" : true,
				"enableDelete" : true,
				"fileName" : "Instructions.pdf",
				"fileSize" : 60,
				"mimeType" : "application/pdf",
				"thumbnailUrl" : "",
				"uploadedDate" : "Date: 2014-07-26",
				"url" : "demokit/sample/UploadCollection/LinkedDocuments/Instructions.pdf",
				"statuses" : [{
					"title" : "Status",
					"text" : "Warning",
					"state" : sap.ui.core.ValueState.Warning
				}]
			}
		]
	};

	// create JSON model instance
	var opicModel = new sap.ui.model.json.JSONModel();

	// set the data for the model
	opicModel.setData(opicData);

	// set the model to the core
	//sap.ui.getCore().setModel(opicModel);

    //1
	var aFileTypes = ["jPg","pdf", "PNG"];

	// get current date
	var fnCurrentDate = function() {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();

		if (day < 10) {
			day = '0' + day
		};
		if (month < 10) {
			month = '0' + month
		}
		return year + '-' + month + '-' + day;
	};

	//3
	var fnChange = function(oEvent) {
		sap.m.MessageToast.show("Event change triggered");
	};
    //4
	var fnFileDeleted = function(oEvent) {
		var oData = opicModel.getData();
		var aItems = oData.items;
		var sDocumentId = oEvent.getParameter("documentId");
		var bSetData = false;

		jQuery.each(aItems, function(index) {
			if (aItems[index] && aItems[index].documentId === sDocumentId) {
				aItems.splice(index, 1);
				bSetData = true;
			};
		});
		if (bSetData === true) {
			opicModel.setData(oData);
		};
		sap.m.MessageToast.show("Event fileDeleted triggered");
	};

    //5
	var fnfilenameLengthExceed = function(oEvent) {
		sap.m.MessageToast.show("Event filenameLengthExceed triggered");
	}
    //6
	var fnFileRenamed = function(oEvent) {
		var aItems = opicModel.getData().items;
		var sDocumentId = oEvent.getParameter("documentId");

		jQuery.each(aItems, function(index) {
			if (aItems[index] && aItems[index].documentId === sDocumentId) {
				aItems[index].fileName = oEvent.getParameter("item").getFileName();
			};
		});
		opicModel.setData(opicData);
		sap.m.MessageToast.show("Event fileRenamed triggered");
	};

    //7
	var fnFileSizeExceed = function(oEvent) {
		sap.m.MessageToast.show("Event fileSizeExceed triggered");
	};
    
    //8
	var fnTypeMissmatch = function(oEvent) {
		sap.m.MessageToast.show("Event typeMissmatch triggered");
	};

    //9
	var fnUploadComplete = function(oEvent) {
		if (oEvent) {
			var oData = opicModel.getData();
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			var nDocId = jQuery.now(); // generate Id
			oItem = {
				"contributor" : "You",
				"documentId" : nDocId.toString(),
				"fileName" : sUploadedFile,
				"fileSize" : 10,
				"mimeType" : "",
				"thumbnailUrl" : "",
				"uploadedDate" : fnCurrentDate(),
				"url" : ""
			};
			oData.items.unshift(oItem);
			oModel.setData(oData);
			sap.m.MessageToast.show("Event uploadComplete triggered");
		}
	};
	
    //2
	var opicItemTemplate = new sap.m.UploadCollectionItem({
		contributor : "{contributor}",
		documentId : "{documentId}",
		enableEdit : "{enableEdit}",
		enableDelete : "{enableDelete}",
		visibleEdit : "{visibleEdit}",
		visibleDelete : "{visibleDelete}",
		fileName : "{fileName}",
		fileSize : "{fileSize}",
		mimeType : "{mimeType}",
		thumbnailUrl : "{thumbnailUrl}",
		uploadedDate : "{uploadedDate}",
		url : "{url}"
	});

	// create instance of UploadCollection and set model
	var UploadCollection = new sap.m.UploadCollection({
		maximumFilenameLength : 55,
		multiple : true,
		fileType : aFileTypes,
		items : {
			path : "/items/",
			template : opicItemTemplate
		},
		sameFilenameAllowed : false,
		// events
		change : fnChange,
		fileDeleted : fnFileDeleted,
		filenameLengthExceed : fnfilenameLengthExceed,
		fileRenamed : fnFileRenamed,
		fileSizeExceed : fnFileSizeExceed,
		typeMissmatch : fnTypeMissmatch,
		uploadComplete : fnUploadComplete
	});
//==========================================


var editableSimpleForm = new sap.ui.layout.form.SimpleForm({
    //minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "医生信息"
        }),
        new sap.m.Label({
            text: '账户'
        }),
        doctorAccount,
        new sap.m.Label({
            text: '帐户密码'
        }),
        doctorpwd,
        new sap.m.Label({
            text: '姓名'
        }),
        doctorName,
        new sap.m.Label({
            text: '性别'
        }),
        doctorGender,
        new sap.m.Label({
            text: '出生年月'
        }),
        doctorAge,
//        new sap.m.Label({
//            text: '国籍'
//        }),
//        doctorNational,
        new sap.m.Label({
            text: '职称'
        }),
        doctorLevel,
        new sap.m.Label({
            text: '联系地址'
        }),     
        new sap.m.HBox({items : [CountrySelectDoctor,ProvinceSelectDoctor,CitySelectDoctor]}),
        new sap.m.Label({
            text: ''
        }),
        doctorAddressD,
        new sap.m.Label({
            text: '联系电话'
        }),
        doctorPhone,
        new sap.m.Label({
            text: '联系传真'
        }),
        doctorFax,
        new sap.m.Label({
            text: '所属医院'
        }),
        doctorHospital,
        new sap.m.Label({
            text: ''
        }),
        doctormanageCBox
//        ,
//        new sap.m.Label({
//            text: '二维码'
//        }),
//        oButtonQR,
//        odoctorQR,
//        new sap.m.Label({
//            text: '照片'
//        }),
//        UploadCollection
    ]
});
editableSimpleForm.addStyleClass("vlayout");
if(jQuery.device.is.phone){
	editableSimpleForm.addStyleClass("phoneStyle");
}

var doctordata = {};
var oSaveButtonDoctor = new sap.m.Button({text:"保存",icon:"sap-icon://save"});
	oSaveButtonDoctor.attachPress(function(){
	    var Account=doctorAccount.getValue();
//        Account=Account.replace(/^\s+|\s+$/g, "");        
//        if(Account == ""){                    
//            sap.m.MessageToast.show("医生账户不能为空！");
//            return;
//        };
//        //把（英文）字符串转换为大写
//        Account = Account.toUpperCase();
//        doctorAccount.setValue(Account);
        
        var passw=doctorpwd.getValue();
        passw=passw.replace(/^\s+|\s+$/g, "");
        if(passw == ""){
            sap.m.MessageToast.show("账户密码不能为空！");
            return;
        };
        
        var name=doctorName.getValue();
        name=name.replace(/^\s+|\s+$/g, "");
        if(name == ""){
            sap.m.MessageToast.show("医生姓名不能为空！");
            return;
        };
        
        var sex = "DOC_docotrAdd_Sex_A";//男
        if(oGenderRadioButton2.getSelected()){
        	sex = "DOC_docotrAdd_Sex_B";//女
        };
        var age = (doctorAge.getDateValue()).Format("yyyy-MM-dd hh:mm:ss");//出生年月
        
        var National="";
//        National=doctorNational.getValue();
//        National=National.replace(/^\s+|\s+$/g, "");
//        if(National == ""){
//            sap.m.MessageToast.show("国藉不能为空！");        	
//            return;
//        };
        
        var Level = "DOC_oNodeRootChild_DoctorLevel_AA";//主任医师
        if(oLevelRadioButton2.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_AB";//副主任医师
        };
        if(oLevelRadioButton3.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_BA";//主治医师
        };
        if(oLevelRadioButton4.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_BB";//医师
        };
        
        var IsAdmin= false;//是医院管理员
        if(doctormanageCBox.getSelected()){
        	IsAdmin= true;
        };
        
        var Address = "";
        if(CountrySelectDoctor.getSelectedKey() != ""){
        	Address = CountrySelectDoctor.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择国家！");
           return;
        };
        
        if(ProvinceSelectDoctor.getSelectedKey() != ""){
        	Address = Address + ProvinceSelectDoctor.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择省/市！");
           return;
        };
        var items = CitySelectDoctor.getItems();
        if(items.length > 1){    
	        if(CitySelectDoctor.getSelectedKey() != ""){
	        	Address = Address + CitySelectDoctor.getSelectedKey();
	        }else{
	           sap.m.MessageToast.show("请选择城市！");
	           return;
	        };
        };
                
        var Addressinfo = doctorAddressD.getValue();
        Addressinfo=Addressinfo.replace(/^\s+|\s+$/g, "");
        if(Addressinfo == ""){
            sap.m.MessageToast.show("医生详细地址不能为空！");
            return;
        };
        
        var Phone = doctorPhone.getValue();
        Phone=Phone.replace(/^\s+|\s+$/g, "");
        if(Phone == ""){
            sap.m.MessageToast.show("医生联系电话不能为空！");
            return;
        }else{
        	if (!verifyTelNumber(Phone)) {
	            sap.m.MessageToast.show("请填写正确的电话号码!");
	            return;
	        };
        };
        
        var Fax = doctorFax.getValue();
        Fax=Fax.replace(/^\s+|\s+$/g, "");
        if(Fax != ""){
        	if (!verifyTelNumber(Fax)) {
	            sap.m.MessageToast.show("请填写正确的传真号码!");
	            return;
	        };
        };
        
        var HospitalID = "";
        if(doctorHospital.getSelectedKey() != ""){        	
        	HospitalID = doctorHospital.getSelectedKey();
        }else{
           sap.m.MessageToast.show("请选择医生所属医院！");
           return;
        };
		
		 if(token != ""){
		 	doctordata = {};
			//doctordata.LoginID = Account;//由系统自动生成
			doctordata.LoginPwd = passw;
			doctordata.Name = name;//DoctorName
			doctordata.Address_ = Address;
			doctordata.Addressinfo = Addressinfo;
			doctordata.Age_ = doctorAge.getDateValue();//出生年月   Age
			doctordata.Phone = Phone;
			doctordata.Sex_ = sex;
			doctordata.Country = National;
			doctordata.Fax = Fax;
			doctordata.HospitalID = HospitalID;
			doctordata.DoctorLevel = Level;
			//doctordata.IsAdmin = IsAdmin;//是医院管理员
			doctordata.QR = ""; //二维码
			doctordata.Portrait = "";//照片
			if(doctorAdd){
				//验证当前输入的用户账户
				//VerifyDoctorAccount(Account);
				SaveAddDoctor();
			}else{
				doctordata.LoginID = Account;
				SaveAddDoctor();
			};
         };
	});
//验证当前输入的用户账户
function VerifyDoctorAccount(Account){
	sap.m.MessageToast.show("正在验证当前输入的账户数据……");
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=LoginID eq '"+Account+"'", {success: DoctorVerifyAccountsuccess, error: AddDoctorerror});
};

function DoctorVerifyAccountsuccess(bResult){	
	if(bResult.results.length == 0){
		//当前输入的医生账户不存在，可以保存数据
		SaveAddDoctor();
	}else{
		sap.m.MessageToast.show("当前输入的医生账户已经存在请重新输入！");
	};
};

	
function SaveAddDoctor(){
	if(doctorAdd){
	 	sap.m.MessageToast.show("正在添加数据……");
	    //增加数据 
	    //PublicDataAccessModel.create("/Doctor?token="+token, doctordata, {success: AddDoctorsuccess, error: AddDoctorerror});
	 	PublicDataAccessModel.create("/RTUser?token="+token, doctordata, {success: AddDoctorsuccess, error: AddDoctorerror});
	}else{
		sap.m.MessageToast.show("正在保存数据……");
	    //修改数据 
	    //PublicDataAccessModel.update("/Doctor('"+currentSelectdoctorRecId+"')?token="+token, doctordata, {success: EditDoctorsuccess, error: EditDoctorerror});
		PublicDataAccessModel.update("/RTUser('"+currentSelectdoctorRecId+"')?token="+token, doctordata, {success: EditDoctorsuccess, error: EditDoctorerror});
	};
};
	
var oCancleButtondoctor = new sap.m.Button({text:"取消",icon:"sap-icon://sys-cancel"});
	oCancleButtondoctor.attachPress(function(){
		oSplitApp.backDetail();
	});
	
var oEditButtondoctor = new sap.m.Button({text:"编辑",icon:"sap-icon://edit"});
	oEditButtondoctor.attachPress(function(){
		 oEditButtondoctor.setVisible(false);
         oSaveButtonDoctor.setVisible(true);
         //设置基本信息中各栏是否为可编辑状态
         setTableSimpleFormState(true);
         
         //医生账户字段不能编辑（这个值是系统后台自动产生的）
         doctorAccount.setEnabled(false);
	});
	
	
function AddDoctorsuccess(bResult) {
     PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();     
     sap.m.MessageToast.show("数据增加成功！");
     //所有角色数据
     if(AllRoleData.length > 0){
     	var User_Roledata = {};
     	User_Roledata.UserID = bResult.RecId;     	
     	User_Roledata.RoleID = DoctorRoleID;
     	PublicDataAccessModel.create("/User_Role?token="+token, User_Roledata, {success: AddDoctorRolesuccess, error: AddDoctorerror});
     }; 
     
     if(doctormanageCBox.getSelected()){
     	//是医院管理员
     	var User_Roledata = {};
     	User_Roledata.UserID = bResult.RecId;     	
     	User_Roledata.RoleID = HospitalAdminRoleID;     			
     	PublicDataAccessModel.create("/User_Role?token="+token, User_Roledata, {success: AddDoctorRolesuccess, error: AddDoctorerror});
     };
     doctordata.LoginID = bResult.LoginID;
     
     //bResult 存放着增加成功能的数据
     doctorAllDatalist.push({
		    Address_: bResult.Address_,
			Addressinfo: bResult.Addressinfo,
			Age_: bResult.Age_,
			Country: bResult.Country,
			CreatedBy: bResult.CreatedBy,
			CreatedDateTime: bResult.CreatedDateTime,
			Department: bResult.Department,
			DoctorLevel: bResult.DoctorLevel,
			Name: bResult.Name,
			Fax: bResult.Fax,
			HospitalID: bResult.HospitalID,
			//IsAdmin: bResult.IsAdmin,
			LastModBy: bResult.LastModBy,
			LastModDateTime: bResult.LastModDateTime,
			LoginID: bResult.LoginID,
			LoginPwd: bResult.LoginPwd,
			Phone: bResult.Phone,
			Portrait: bResult.Portrait,
			QR: bResult.QR,
			RecId: bResult.RecId,
			Sex_: bResult.Sex_
     });
     
 	if(currentSelectdoctorLevel == "All"){
		doctorAlllistPush(bResult);
	}else{
		if(bResult.DoctorLevel == currentSelectdoctorLevel ){
			doctorAlllistPush(bResult);
		}
	};
	
	//清除医生信息
	clearTableSimpleForm();
	//设置医生分类单按钮选择项
	setRadioButtonSelectedLevel();
	//存当前医生总数据
	current_doctorCount++;
}

function AddDoctorerror(bResult) {
    //console.log('---Add Doctor error -----');   
    sap.m.MessageToast.show("数据增加失败！"+bResult.message);
}

function AddDoctorRolesuccess(bResult) {
	PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();
     sap.m.MessageToast.show("数据增加成功！");
}

function EditDoctorsuccess(bResult) {
     PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();     
     sap.m.MessageToast.show("数据保存成功！");
     //bResult 存放着增加成功能的数据
     //console.log(bResult);
     for(var n=0;n<doctorAllDatalist.length;n++){
	        if(currentSelectdoctorRecId == doctorAllDatalist[n].RecId){     
			    doctorAllDatalist[n].Address_= doctordata.Address_;
				doctorAllDatalist[n].Addressinfo= doctordata.Addressinfo;
				var Agei = doctordata.Age_.getTime();//返回 1970 年 1 月 1 日至今的毫秒数
                var Agesa = "/Date("+ Agei +")/";
				doctorAllDatalist[n].Age_ = Agesa;
				doctorAllDatalist[n].Country= doctordata.Country;
				doctorAllDatalist[n].DoctorLevel= doctordata.DoctorLevel;
				doctorAllDatalist[n].Name= doctordata.Name;
				doctorAllDatalist[n].Fax= doctordata.Fax;
				doctorAllDatalist[n].HospitalID= doctordata.HospitalID;
				doctorAllDatalist[n].LoginID= doctordata.LoginID;
				doctorAllDatalist[n].LoginPwd= doctordata.LoginPwd;
				doctorAllDatalist[n].Phone= doctordata.Phone;
				doctorAllDatalist[n].Portrait= doctordata.Portrait;
				doctorAllDatalist[n].QR= doctordata.QR;
				doctorAllDatalist[n].Sex_= doctordata.Sex_;
				break;
	        };
     };     
	doctorAlllistEdit();
	
	oEditButtondoctor.setVisible(true);
    oSaveButtonDoctor.setVisible(false);
    //设置基本信息中各栏是否为可编辑状态
    setTableSimpleFormState(false);
    
    //处理当前是否修改了“是医院管理员”
    if(doctormanageCBox.getSelected() != currentSelectdoctorIsAdmin){
    	if(doctormanageCBox.getSelected()){
    		//用户被提升为医院管理员
	     	var User_Roledata = {};
	     	User_Roledata.UserID = currentSelectdoctorRecId;	     	
	     	User_Roledata.RoleID = HospitalAdminRoleID;
	     	PublicDataAccessModel.create("/User_Role?token="+token, User_Roledata, {success: EditDoctorRolesuccess, error: EditDoctorRoleerror});
    	}else{
    		//用户医院管理员权限被去掉
    		var deleteid = "";
    		for(var n=0;n<AllUserRoleData.length;n++){
		     	if(AllUserRoleData[n].UserID == currentSelectdoctorRecId && AllUserRoleData[n].RoleID == HospitalAdminRoleID){
		     		deleteid = AllUserRoleData[n].RecId;
		     		//删除数据
                    PublicDataAccessModel.remove("/User_Role('"+deleteid+"')?token="+token, {success: DoctorRoleRemovesuccess, error: DoctorRoleRemoverror});
		     		break;
		     	};
		    };
    	};
    };
};

function EditDoctorerror(bResult) {
    //console.log('---Add Doctor error -----');   
    sap.m.MessageToast.show("数据保存失败！"+bResult.message);
};

function EditDoctorRolesuccess(bResult) {
	PublicDataAccessModel.refresh();
    PublicDataAccessModel.refreshMetadata();
     //sap.m.MessageToast.show("数据增加成功！");
    
}

function EditDoctorRoleerror(bResult) {
     sap.m.MessageToast.show("角色数据增加出错！");
}

function DoctorRoleRemovesuccess(bResult) {
    //sap.m.MessageToast.show("数据保存成功！"+bResult.message);
	for(var n=0;n<AllUserRoleData.length;n++){
     	if(AllUserRoleData[n].UserID == currentSelectdoctorRecId && AllUserRoleData[n].RoleID == HospitalAdminRoleID){
     		AllUserRoleData.remove(n);
     	};
	};
};

function DoctorRoleRemoverror(bResult) { 
    sap.m.MessageToast.show("医院管理员角色删除失败！"+bResult.message);
}

//将修改的医生数据更新到显示列表中
function doctorAlllistEdit(){
	for(var n=0;n<doctorAlllist.length;n++){
	        if(currentSelectdoctorRecId == doctorAlllist[n].RecId){
				doctorAlllist[n].Address_= doctordata.Address_;
				doctorAlllist[n].Addressinfo= doctordata.Addressinfo;
				var Agei = doctordata.Age_.getTime();//返回 1970 年 1 月 1 日至今的毫秒数
                var Agesa = "/Date("+ Agei +")/";
				doctorAlllist[n].Age= Agesa;
				doctorAlllist[n].Country= doctordata.Country;
				doctorAlllist[n].DoctorLevel= doctordata.DoctorLevel;
				doctorAlllist[n].DoctorName= doctordata.Name;
				doctorAlllist[n].Fax=doctordata.Fax;
				doctorAlllist[n].HospitalID= doctordata.HospitalID;				
				doctorAlllist[n].LoginID= doctordata.LoginID;
				doctorAlllist[n].LoginPwd= doctordata.LoginPwd;
				doctorAlllist[n].Phone= doctordata.Phone;
				doctorAlllist[n].Portrait= doctordata.Portrait;
				doctorAlllist[n].QR= doctordata.QR;
				doctorAlllist[n].Sex_= doctordata.Sex_;
				//填充医生显示表格
	            setdoctortable();
				break;
	        }
	}
}

//填充医院选择框
function setdoctorHospital() {
	doctorHospital.removeAllItems();
	for(var i=0;i<hospitallist.length;i++){
		var keys = hospitallist[i].RecId;
		var texts = hospitallist[i].HospitalName;
        var itemtemp = new sap.ui.core.Item({
            key: keys,
            text: texts
        });
		doctorHospital.addItem(itemtemp);
	}
	
	if(hospitallist.length > 0){
		doctorHospital.setSelectedKey(hospitallist[0].RecId);
	}	
}

function setRadioButtonSelectedLevel(){
	    if(currentSelectdoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AA"){
        	//主任医师
        	oLevelRadioButton1.setSelected(true);
        	return;
        }
        if(currentSelectdoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AB"){
        	//副主任医师
        	oLevelRadioButton2.setSelected(true);
        	return;
        }
        if(currentSelectdoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BA"){
        	//主治医师
        	oLevelRadioButton3.setSelected(true)
        	return;
        }
        if(currentSelectdoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BB"){
        	//医师
        	oLevelRadioButton4.setSelected(true)
        	return;
        }
}

//将新增加的医生数据增加到显示列表中
function doctorAlllistPush(bResult){
	doctorAlllist.push({
				Address_: bResult.Address_,
				Addressinfo: bResult.Addressinfo,
				Age: bResult.Age_,
				Country: bResult.Country,
				DoctorLevel: bResult.DoctorLevel,
				DoctorName: bResult.Name,
				Fax:bResult.Fax,
				HospitalID: bResult.HospitalID,
				//IsAdmin: bResult.IsAdmin,			
				LoginID: bResult.LoginID,
				LoginPwd: bResult.LoginPwd,
				Phone: bResult.Phone,
				Portrait: bResult.Portrait,
				QR: bResult.QR,
				RecId: bResult.RecId,
				Sex_: bResult.Sex_
			});
	//填充医生显示表格
	setdoctortable();
}

//清除医生信息
function clearTableSimpleForm(){	 
    	doctorAccount.setValue("");
    	doctorName.setValue("");
    	
    	oGenderRadioButton1.setSelected(true);
    	
    	doctorAge.setDateValue(new Date());
    	
    	//doctorNational.setValue("");	        	
    	
    	//主任医师
        oLevelRadioButton1.setSelected(true);
        oLevelRadioButton2.setSelected(false);
        oLevelRadioButton3.setSelected(false);
        oLevelRadioButton4.setSelected(false);    	
        
        doctorpwd.setValue("");
       
        doctormanageCBox.setSelected(false);
        
        CountrySelectDoctor.setSelectedKey("");
        ProvinceSelectDoctor.setSelectedKey("");
        CitySelectDoctor.setSelectedKey("");
        
        doctorAddressD.setValue("");
        
        doctorPhone.setValue("");

		doctorFax.setValue("");
		
		//doctorHospital.setSelectedKey("");
		//odoctorQR.setSrc("");
};

//填充需要编辑的医生信息
function setTableSimpleForm(){
	 for(var n=0;n<doctorAlllist.length;n++){
	        if(currentSelectdoctorRecId == doctorAlllist[n].RecId){
	        	doctorAccount.setValue(doctorAlllist[n].LoginID);
	        	doctorName.setValue(doctorAlllist[n].DoctorName);
	        	
	        	oGenderRadioButton1.setSelected(true);
	        	if(doctorAlllist[n].Sex_ == "DOC_docotrAdd_Sex_B"){
	        		oGenderRadioButton1.setSelected(false);
	        		oGenderRadioButton2.setSelected(true);
	        	}
	        	
	        	var sage = doctorAlllist[n].Age;
//	        	sage =  sage.substring(6, (sage.length - 2));
//	        	var objDate=new Date(parseInt(sage));
	        	if(sage != ""){
		            var objDate=new Date(sage);
		        	doctorAge.setDateValue(objDate);
	        	};
	        	
	        	//doctorNational.setValue(doctorAlllist[n].Country);
	        	
	        	//主任医师
		        oLevelRadioButton1.setSelected(false);
		        oLevelRadioButton2.setSelected(false);
		        oLevelRadioButton3.setSelected(false);
		        oLevelRadioButton4.setSelected(false);
	        	if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AA"){
		        	//主任医师
		        	oLevelRadioButton1.setSelected(true);
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AB"){
		        	//副主任医师
		        	oLevelRadioButton2.setSelected(true);
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BA"){
		        	//主治医师
		        	oLevelRadioButton3.setSelected(true)
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BB"){
		        	//医师
		        	oLevelRadioButton4.setSelected(true)
		        }
		        
		        //当前用户名密码
				currentSelectdoctorPwd = doctorAlllist[n].LoginPwd;
		        doctorpwd.setValue(doctorAlllist[n].LoginPwd);
		        
		        //设置是不是医院管理员
		        if(currentSelectdoctorIsAdmin){
			        doctormanageCBox.setSelected(true);
		        }else{
		        	doctormanageCBox.setSelected(false);
		        };
		        
		        var Addresslist = doctorAlllist[n].Address_.split('.');
		        
		        setDefaultSelectAddressDoctor(Addresslist[0],Addresslist[1],Addresslist[2]);
		        
		        doctorAddressD.setValue(doctorAlllist[n].Addressinfo);
		        
		        doctorPhone.setValue(doctorAlllist[n].Phone);

				doctorFax.setValue(doctorAlllist[n].Fax);
				
				doctorHospital.setSelectedKey(doctorAlllist[n].HospitalID);
				
				//odoctorQR.setSrc("");
	        	break;
	        };
     };
};

//设置基本信息中各栏是否为可编辑状态
function setTableSimpleFormState(State){
        doctorAccount.setEnabled(State);
        doctorpwd.setEnabled(State);       
        doctorName.setEnabled(State);
        oGenderRadioButton1.setEnabled(State);
		oGenderRadioButton2.setEnabled(State);		
        doctorAge.setEnabled(State);        
        //doctorNational.setEnabled(State);
        
        oLevelRadioButton1.setEnabled(State);
        oLevelRadioButton2.setEnabled(State);
        oLevelRadioButton3.setEnabled(State);
        oLevelRadioButton4.setEnabled(State);
        
        doctormanageCBox.setEnabled(State);
        
        CountrySelectDoctor.setEnabled(State);
        ProvinceSelectDoctor.setEnabled(State);
        CitySelectDoctor.setEnabled(State);
        
        doctorAddressD.setEnabled(State);        
        doctorPhone.setEnabled(State);
		doctorFax.setEnabled(State);      
        doctorHospital.setEnabled(State);
        
        oButtonQR.setEnabled(State);
};

var add_doctor = new sap.m.Page({
    title : "添加医生",
    showNavButton: false,
    navButtonText: "Back",
    navButtonPress: function() {
        oSplitApp.backDetail();
    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                editableSimpleForm
            ]
        })
    ],
    footer: new sap.m.Toolbar({            
            content: [
                new sap.m.ToolbarSpacer(),
                oEditButtondoctor,
                oSaveButtonDoctor,
                oCancleButtondoctor
            ]
    })
});
add_doctor.addStyleClass("patientMasterPage");

