//患者列表
function handlePress(e) {
    this.setUnread(false);
//    if(this.data("xyz") && "Content pressed" != this.data("xyz") ){
//        //oPatientSplitApp.toDetail(this.data("xyz"));
//    }                    
//    else{                    
//        //sap.m.MessageToast.show("List item was tapped!");abc
//    };
    
    patientAdd = false;
    currentSelectpatientRecId = this.data("patientid");//患者主键
    //sap.m.MessageToast.show("List item was tapped ! "+ this.data("patientid"));    
    oPatientSplitApp.toDetail(oPatientDetailPage);
    
    //根据当前选择的患者id,填充患者基本信息中各栏数据
    setPatientBasicInfoFromID();
};
function deleteItem(oEvent)
{
    var model = oEvent.mParameters.listItem.getModel();

    var deleteId = model.getProperty("", oEvent.mParameters.listItem.getBindingContext());
    var data = model.getData().navigation;
    jQuery.each(data,function(iIndex, oEntry){

        if (oEntry == deleteId) {
            data.splice(iIndex, 1);
            return false;
        }
    });
    model.setData(model.getData());
};

//var patientListData = {
//    navigation : [ {
//        RecId : "A001",
//        title : "吴东凯",
//        description : "Access the",
//        //icon : "images/placeholder_48x48.png",
//        icon : "sap-icon://employee",
//        iconInset : false,
//        type : "Active",
//        unread: true,                   
//        press: "Content pressed"
//    }, {
//        RecId : "A002",
//        title : "杨明华",
//        description : "Access travel",                    
//        icon : "sap-icon://employee",
//        iconInset : false,
//        type : "Active",
//        unread: true,                   
//        press: "Content pressed"
//    }, {
//        RecId : "A003",
//        title : "陈晨",
//        description : "Access the travel",
//        icon : "sap-icon://employee",
//        iconInset : false,
//        type : "Active",
//        unread: true,                   
//        press: "Content pressed"
//    }, {
//        RecId : "A004",
//        title : "杨丽芬",
//        description : "Report your work accidents",
//        icon : "sap-icon://employee",
//        iconInset : false,
//        type : "Active",
//        unread: true,
//        press: "Content pressed"
//    }, {
//        RecId : "A005",
//        title : "Settings",
//        description : "Change your travel",
//        icon : "sap-icon://employee",
//        //iconInset : true,//显示小图标
//        iconInset : false,//显示大图标
//        type : "Active",
//        unread: true,
//        press: "Content pressed"
//    } ]
//};

////测试数据
//var otempData = [
//    {key: "1", DoctorName: "吴东凯", Sex: "男",DoctorLevel: "鼻咽癌"},
//    {key: "2", DoctorName: "杨明华", Sex: "男",DoctorLevel: "肺癌"},
//    {key: "3", DoctorName: "陈晨", Sex: "男",DoctorLevel: " 宫颈癌"},
//    {key: "4", DoctorName: "杨丽芬", Sex: "男",DoctorLevel: "乳腺癌"},
//    {key: "5", DoctorName: "王二", Sex: "男",DoctorLevel: "甲状腺癌"},
//    {key: "6", DoctorName: "李一", Sex: "女",DoctorLevel: "卵巢肿瘤"}
//];            
////生成测试数据
//for(var i=0;i<otempData.length;i++){
//     patientListData.navigation[i] ={
//                    Address_: "",
//                    Addressinfo: "",
//                    Age_: "",
//                    LoginID: "",
//                    LoginPwd: "",
//                    title: otempData[i].DoctorName,
//                    PatientNamePinyin: "",
//                    Phone: "",
//                    Sex_: "",
//                    Country: "",
//                    NativePlace: otempData[i].DoctorLevel,
//                    QR: "",
//                    Portrait: "",
//                    DoctorID: "",
//                    HospitalID: "",
//                    RecId: otempData[i].key,
//                    icon : "sap-icon://employee",
//                    iconInset : false,
//                    type : "Active",
//                    unread: true,
//                    press: "Content pressed"
//               };
//};

var oItemTemplateStandardIcon = new sap.m.StandardListItem({    
    title : "{title}",
    description : "{NativePlace}",
    //info:"{NativePlace}",
    icon : "{icon}",
    activeIcon: "{activeIcon}",
    iconInset : "{iconInset}",
    type : "{type}",
    unread: "{unread}",    
    RecId : "{RecId}",
    press: handlePress
});

var oSelectedItem_patient;
//列表控件
var oPatientList = new sap.m.List({
     inset:false,
     showUnread:true,
     mode:jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
     itemPress: function(oEv) {  
     	console.log("点击了");
//     	console.log(oEv);
//     	console.log(oSelectedItem_patient); 
//     	console.log(oSelectedItem_patient.getTitle());    	
//     	oSelectedItem_patient = oPatientList.getSelectedItem();
     	//console.log(oSelectedItem_patient.getBindingContext());
        //console.log(oSelectedItem_patient.getBindingContext().getPath());
        //console.log(oSelectedItem_patient.getBindingContext().oModel.oData);
//        var current_spath = oSelectedItem_patient.getBindingContext().getPath();//得到："/navigation/1"  1 为当前选择项目的数据序号
//        var currentall = current_spath.split('/');
//        var xh = parseInt(currentall[2]);
//     	currentSelectpatientRecId = oSelectedItem_patient.getBindingContext().oModel.oData.navigation[xh].RecId;
     	oPatientSplitApp.toDetail(oPatientDetailPage);
//	    //根据当前选择的患者id,填充患者基本信息中各栏数据
//	    setPatientBasicInfoFromID();
//	    getMedicalRecord();
//	    //获取指定患者的治疗计划数据
//        GetTreatmentPlanFromPatientID();
     },
     'delete':deleteItem
//    ,
//    headerText : "Travel [StandardListIconA]",
//    footerText : "We strongly advise you to keep."
});

function bindListData(data, PatientitemTemplate, list) {
    //var ojsonModel = new sap.ui.model.json.JSONModel();
    // set the data for the model
	//刷新数据
    //PublicJsonModel.setData(data,true);
	PublicJsonModel.setProperty("/navigation",data.navigation);
    
    // set the model to the list
    list.setModel(PublicJsonModel);

    // create a CustomData template, set its key to "answer" and bind its value to the answer data
    var oDataTemplate = new sap.ui.core.CustomData({
        key : "xyz"
    });
    oDataTemplate.bindProperty("value", "press");
    // add the CustomData template to the item template
    PatientitemTemplate.addCustomData(oDataTemplate);

    var oDataTemplate2 = new sap.ui.core.CustomData({
        key : "patientid"
    });
    oDataTemplate2.bindProperty("value", "RecId");
    // add the CustomData template to the item template
    PatientitemTemplate.addCustomData(oDataTemplate2);

    // bind Aggregation
    list.bindAggregation("items", "/navigation", PatientitemTemplate);
};

//生成患者列表
function initialisePatientList(patientid){
	var patientDataFromid = {navigation:[]};
	for(var i=0;i<patientListData.navigation.length;i++){
		if(patientListData.navigation[i].RecId == patientid){
			patientDataFromid.navigation[0] = {
				title: patientListData.navigation[i].title,
	            NativePlace: getNativePlaceName(patientListData.navigation[i].NativePlace),
				RecId: patientListData.navigation[i].RecId,
	            icon : "sap-icon://employee",
	            iconInset : false,
	            type : "Navigation",
	            unread: true,
	            press: "Content pressed"
			};
			break;
	   };
	};
    bindListData(patientDataFromid, oItemTemplateStandardIcon, oPatientList);
}
