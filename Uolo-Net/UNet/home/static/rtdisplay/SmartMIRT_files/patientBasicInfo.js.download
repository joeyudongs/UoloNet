//患者基本信息
jQuery.sap.require("sap.m.MessageToast");

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

//请输入患者账户
var patientAccount = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '请输入账户 ...',maxLength:40});
var patientAccountBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '',maxLength:40,editable :false});

//请输入帐户密码
var patientpwd = new sap.m.Input({type:sap.m.InputType.Password,placeholder:'请输入帐户密码 ...',maxLength:30});
var patientpwdBrowse = new sap.m.Input({type:sap.m.InputType.Password,placeholder:'',maxLength:30,editable :false});

//请输入患者姓名
var patientNamechs = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'请输入姓名 ...',maxLength:40});
var patientNamechsBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'',maxLength:40,editable :false});

//请输入患者姓名拼音
var patientNamePinyin = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'请输入姓名拼音 ...',maxLength:70});
var patientNamePinyinBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'',maxLength:70,editable :false});

//患者性别单选框组
var oGenderRadioButtonpatient1 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_A"), selected: true});//'男'
var oGenderRadioButtonpatient2 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_B"), selected: false});//'女'
var patientGender = new sap.m.HBox({
				items:[
					oGenderRadioButtonpatient1,
					oGenderRadioButtonpatient2
				]
});
var patientSexBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'',maxLength:70,editable :false});


//请选择患者出生年月
var patientcsrq = new sap.m.DatePicker({dateValue:new Date(), valueFormat:"yyyy-MM-dd",displayFormat: "long"});
var patientcsrqBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'',maxLength:70,editable :false});
//年龄
var patientNianBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder:'',maxLength:100,editable :false});

//请输入患者国籍
var patientNational = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '请输入国籍 ...',maxLength:25});
var patientNationalBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '',maxLength:25,editable :false});

//请输入肿瘤类型
//var patientNativePlace = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '请输入肿瘤类型 ...',maxLength:70});
var patientNativePlace = new sap.m.ComboBox();

function setPatientNativePlaceCombo(){
	patientNativePlace.removeAllItems();
	for(var i=0;i<nativePlaceData.length;i++){
    var item= new sap.ui.core.Item({
        key: nativePlaceData[i].key,
        text: nativePlaceData[i].value
    });
    patientNativePlace.addItem(item);
	};
}

var patientNativePlaceBrowse = new sap.m.ComboBox({editable :false});
	patientNativePlaceBrowse.removeAllItems();
	for(var i=0;i<nativePlaceData.length;i++){
    var item= new sap.ui.core.Item({
        key: nativePlaceData[i].key,
        text: nativePlaceData[i].value
    });
    patientNativePlaceBrowse.addItem(item);
	};

//请输入详细地址
var patientAddressD = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '请输入详细地址 ...',maxLength:120});
var patientAddressDBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '',maxLength:120,editable :false});

//请输入患者联系电话
var patientPhone = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '请输入联系电话 ...',maxLength:25});
var patientPhoneBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '',maxLength:50,editable :false});

//患者所属医院
var patientHospital = new sap.m.ComboBox({
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
var patientHospitalBrowse = new sap.m.Input({type:sap.m.InputType.Text,placeholder: '',maxLength:200,editable :false});

var opatientQR = new sap.m.Image({
        src: "data:image/gif;base64,R0lGODlhHwAeANU/AO1SReW2N+14Kf3YACOAulrAWtTW02Gh1uPIx/BkVFXKXu3t7bjZuoi9R7nV8fbOG8fBulSlWvh8ZlW0WvTu0aG8QqK92sGkdcWjoPr5+WyrUUaiV7q0oHWs2vrTCYOeiJ94QulCOYK34ceNifHEJfLWRuLf3tomHUWUzeQxLf/cDc1+dtzCOqKzo83o92mxbPSSjP/ohspCL2K1WG7Ga+k5NIGfWcbKKcu5ceTPBvDKAJfRkIyvjVvEXeV4af///yH5BAEAAD8ALAAAAAAfAB4AAAb/wJ9wSPwtDBCMEmJYFJ/QXwYx8kmuWIlvBMlEoaZVIptNmBMrw5eIObvfZkACgFn/MIA8/J3vj74jfYJycYMAIYh/TxCIiIaGjYg1NRBFCzYhNZGbk42TNSmhmiZELQogKZ+SNQkwrhICsbKzF0MLLwozMqmTKQAICy7CCxQlOg8PHh4DAyoPTj8QPQWnoikJCw4i29sOGSXKzOIqlT88CgXTuykhJg4HHdwdBxYUKuLjOFIv09Q2JydguIDXoaDBAw5i4GOmgkWGW/2ogTiBQASKAxgzHkAhgsLCZs8WzIjYQ4MMBBs1Zrxo7+MDEyILyJR5CiWKmzhxHmi58OWtzJkye8xA0IFATpwEOnj8SGJBhhdAZ+5wQMBozqoJPw5waC5qUANFq4pNylOcBxX6ok3wWoCGAQtjCVgwUWKhsgflfrKlweCtBQsGGFT46OFBAGg/WkxYu3eH4xcRcuC7+4ADkQURFrOduXiw2cKGEQuBkJkx2wkzlg1QVpgEiXJFWpQ2DXTCjdWUXVuOInuxb84NKD9wTWL3Fw4bIsz2zQIZcRIBjK8x8SG58ggbKjyHfkGNHSIGqm9IHqB8gAvdvXx/cgQCh/dMREMJAgA7",
        alt: "test image",
        decorative: false,
        width: "100px",
        height: "100px",
        densityAware: false
    });
var oButtonPatientQR = new sap.m.Button({text:"生成二维码",width:"100px",type : sap.m.ButtonType.Emphasized});    
oButtonPatientQR.attachPress(function(){
        //alert("生成二维码")
        odoctorQR.setSrc("data:image/gif;base64,R0lGODlhHAAeANU/AJ+go4aZtKK2111cXT2g1thLFqfN5DCBuliLwPz6+YOf0e3s7NHR0bS0tODg35aly3l5eIC21TEyMmqZzouKjIKJnMjJyb3c7j2t20K452CBrnONuy6L2UlNTyBZpKSwvDWVzD94riCJxVO16tLd5vLx8UJ2uSFlp1xviefl5BtztNfX1r28uqysrMHAwFOx2tzb2zOm5W1tbfL2+vb19MXR4Hes55tELxdTmtjFvLfC3WGVypSVmNvm9IV+gf///yH5BAEAAD8ALAAAAAAcAB4AAAb/wJ9wOCxZGJYEccls/iwWWCPlrDJpLVeLAVtxS9amg7FIJBap1GKxYq3CwkUyYaHIBviBjOfSLqxdCQ0yMhAUFBUVFBAyHRAAPAxODA4LPjKIAQ+bDwoBFTx3EBAWTDBRMj48Gw8CNToCsQIPoBR6Mm9DCVuYq5sKrpybAhqgeBBKQg0sPhQAGwrR0Z2eAZ4+Gjw8ei1CNBQ8EC0a0tETNQob6hQ3GgEaLRADEGDMjwE7ChP7Ezs9OhoQ+CiAQt2GAC0G+GCRYJGPBgER7Nixzx+JCQMHINAQQoOGBqN4OGDE40PHgBMNCEAQYuCNk5o2NNjGwwIjAAE6hghxQMWE/xA4bhS48YFEDYPuElJocKlFzhMeTpzYYUDFhxw3Ohi4gAAqjhMBWMxrsKhBAA/qTBiYQSLCAhYoQEQQAaKuChUBXOhxEa5BCxOsTCA4MGFBAxQiIlx4QYAAiAMHPojFxcNHixYHEJiAfKAGRMUvMITG8PiAlg4yaGjjs4MuCBECWoRIPAMEAQy4X09YQcHRjwYAZDD4UFcugAPFLzTOkAGDYwsrBnRo8MOSjAYwIjQOYLsxCA4cCDBvHCEFAAkdwPwAIA9GdtsjcGPgYGMCB+YxyjPoIIFHkTs+LOBABMwVGJ4N92VQXgoDoEcDERZ00AEFC5RQQwQjFBhDhhHUQFaDAw1KIMkSDfAnXAIlkGDAigaQQAINNLDAnwTUNVGiBBJQYEEJZphBQwqD4DidFQzIgKME84Bjh4QS4gJHCUEK2UEeYz0IhxAlMNACBT5A0MwWVjIRBAA7");
    });


var editPatientSimpleForm = new sap.ui.layout.form.SimpleForm({
    //minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
       //     new sap.ui.core.Title({
		//            text: "患者基本信息"
		//        }),
        new sap.m.Label({
			  text: '账户'
		}),
		patientAccount,
        new sap.m.Label({
            text: '账户'
        }),
        patientAccount,
        new sap.m.Label({
            text: '帐户密码'
        }),
        patientpwd,
        new sap.m.Label({
            text: '姓名'
        }),
        patientNamechs,
        new sap.m.Label({
            text: '姓名拼音'
        }),        
        patientNamePinyin,
        new sap.m.Label({
            text: '性别'
        }),
        patientGender,
        new sap.m.Label({
            text: '出生年月'
        }),
        patientcsrq,
//        new sap.m.Label({
//            text: '国籍'
//        }),
//        patientNational,
        new sap.m.Label({
            text: '肿瘤类型'
        }),
        patientNativePlace,       
        new sap.m.Label({
            text: '联系地址'
        }),  
        new sap.m.HBox({items:[CountrySelectPatient,ProvinceSelectPatient,CitySelectPatient]}),
        new sap.m.Label({
            text: ''
        }),
        patientAddressD,
        new sap.m.Label({
            text: '联系电话'
        }),
        patientPhone,       
        new sap.m.Label({
            text: '所属医院'
        }),
        patientHospital
//        ,
//        new sap.m.Label({
//            text: '二维码'
//        }),
//        oButtonPatientQR,
//        opatientQR
    ]
});
editPatientSimpleForm.addStyleClass("vlayout");
//if(jQuery.device.is.phone){
	editPatientSimpleForm.addStyleClass("phoneStyle");
//}
var patientAboutForm = new sap.ui.layout.form.SimpleForm({
    minWidth : 1024,
    maxContainerCols : 1,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "About"
        }),
        new sap.m.VBox({
            items : [
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"账户：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientAccountBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"帐户密码：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientpwdBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"姓名：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientNamechsBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"姓名拼音：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientNamePinyinBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"性别：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientSexBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"出生年月：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientcsrqBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"年龄：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientNianBrowse
                    ]
                }),
//                new sap.m.HBox({
//                    items : [
//                        new sap.m.Input({
//                            value:"国籍：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
//                        }),
//                        patientNationalBrowse
//                    ]
//                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"肿瘤类型：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientNativePlaceBrowse
                    ]
                })
            ]
        }),
        new sap.ui.core.Title({ // this starts a new group
            text: "Contact"
        }),
        new sap.m.VBox({
            items : [
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"联系地址：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientAddressDBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"联系电话：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientPhoneBrowse
                    ]
                }),
                new sap.m.HBox({
                    items : [
                        new sap.m.Input({
                            value:"所属医院：",textAlign: sap.ui.core.TextAlign.End,editable :false,fieldWidth: "30%"
                        }),
                        patientHospitalBrowse
                    ]
                })
            ]
        })
        
    ]
}); 
patientAboutForm.addStyleClass("phoneStyle");

var patientBasicInfoData = {};
//保存患者基本信息
function SavePatientBasicInfo(){
     var Account=patientAccount.getValue();
        Account=Account.replace(/^\s+|\s+$/g, "");        
        if(Account == ""){                    
            sap.m.MessageToast.show("患者账户不能为空！");
            return;
        };
        //把（英文）字符串转换为大写
        Account = Account.toUpperCase();
        patientAccount.setValue(Account);
    
        var passw=patientpwd.getValue();
        passw=passw.replace(/^\s+|\s+$/g, "");
        if(passw == ""){
            sap.m.MessageToast.show("账户密码不能为空！");
            return;
        }
        
        var namechs =patientNamechs.getValue();
        namechs = namechs .replace(/^\s+|\s+$/g, "");
        if(namechs == ""){
            sap.m.MessageToast.show("患者姓名不能为空！");
            return;
        };
    
        var namePinyin=patientNamePinyin.getValue();
        namePinyin=namePinyin.replace(/^\s+|\s+$/g, "");
        
        var sex_patien = "DOC_docotrAdd_Sex_A";//男
        if(oGenderRadioButtonpatient2.getSelected()){
        	sex_patien = "DOC_docotrAdd_Sex_B";//女
        };
        var age_patien = (patientcsrq.getDateValue()).Format("yyyy-MM-dd hh:mm:ss");//出生年月
        
        var National_patien=patientNational.getValue();
        National_patien = National_patien.replace(/^\s+|\s+$/g, "");
//        if(National_patien == ""){
//            sap.m.MessageToast.show("国藉不能为空！");        	
//            return;
//        };
        
        var NativePlace=patientNativePlace.getValue();
        NativePlace=NativePlace.replace(/^\s+|\s+$/g, "");
        if(NativePlace == ""){
            sap.m.MessageToast.show("肿瘤类型不能为空！");        	
            return;
        };        
        var nativePlaceLength = Number(patientNativePlace.getSelectedKey());
        if( nativePlaceLength> 44 || nativePlaceLength < 1){
        	sap.m.MessageToast.show("请选择正确的肿瘤类型！");
        	return;
        }
        
        var Address_patien = "";
        if(CountrySelectPatient.getSelectedKey() != ""){        	
        	Address_patien = CountrySelectPatient.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择国家！");
           return;
        };
        
        if(ProvinceSelectPatient.getSelectedKey() != ""){
        	Address_patien = Address_patien + ProvinceSelectPatient.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择省/市！");
           return;
        };
        
        var items = CitySelectPatient.getItems();
        if(items.length > 1){    
            if(CitySelectPatient.getSelectedKey() != ""){
                Address_patien = Address_patien + CitySelectPatient.getSelectedKey();
            }else{
               sap.m.MessageToast.show("请选择城市！");
               return;
            };
        };
                
        var Addressinfo = patientAddressD.getValue();
        Addressinfo=Addressinfo.replace(/^\s+|\s+$/g, "");
        if(Addressinfo == ""){
            sap.m.MessageToast.show("患者详细地址不能为空！");
            return;
        };
        
        var Phone = patientPhone.getValue();
        Phone=Phone.replace(/^\s+|\s+$/g, "");        
         if(Phone == ""){
            sap.m.MessageToast.show("患者联系电话不能为空！");
            return;
        }else{
        	if (!verifyTelNumber(Phone)) {
	            sap.m.MessageToast.show("请填写正确的电话号码!");
	            return;
	        };
        };
        
        
        var HospitalID = "";
        if(patientHospital.getSelectedKey() != ""){
        	HospitalID = patientHospital.getSelectedKey();
        }else{
           sap.m.MessageToast.show("请选择患者所属医院！");
           return;
        };
		
        if(token != ""){
		 	patientBasicInfoData = {};
			patientBasicInfoData.LoginID = Account;
            patientBasicInfoData.LoginPwd = passw;
            patientBasicInfoData.Name = namechs;
            patientBasicInfoData.NamePinyin = namePinyin;
            patientBasicInfoData.Address_ = Address_patien;
            patientBasicInfoData.Age_ = patientcsrq.getDateValue();//出生年月
            patientBasicInfoData.Phone = Phone;
            patientBasicInfoData.Sex_ = sex_patien;
            patientBasicInfoData.QR = ""; //二维码
            patientBasicInfoData.Country = National_patien;//国藉
            patientBasicInfoData.NativePlace = patientNativePlace.getSelectedKey();//肿瘤类型
            patientBasicInfoData.HospitalID = HospitalID;//医院ID
            patientBasicInfoData.Portrait = "";//照片
            
            patientBasicInfoData.Fax = "";
            
			patientBasicInfoData.Department = "";
			patientBasicInfoData.DoctorLevel= "";
			patientBasicInfoData.Addressinfo = Addressinfo;
			
			if(patientAdd){
				//验证当前输入的用户账户
				VerifyPatientAccount(Account);
			}else{
				SaveAddPatient();
			};
        };
};

//验证当前输入的用户账户
function VerifyPatientAccount(Account){
	sap.m.MessageToast.show("正在验证当前输入的账户数据……");
	PublicDataAccessModel.read("/RTUser?token="+token+"&$filter=LoginID eq '"+Account+"'", {success: PatientVerifyAccountsuccess, error: AddPatienterror});
};

function PatientVerifyAccountsuccess(bResult){	
	if(bResult.results.length == 0){
		//当前输入的患者账户不存在，可以保存数据
		SaveAddPatient();
	}else{
		sap.m.MessageToast.show("当前输入的患者账户已经存在请重新输入！");
	};
};

function SaveAddPatient(){
	if(patientAdd){			
	 	sap.m.MessageToast.show("正在添加数据……");
	    //增加数据
        //PublicDataAccessModel.create("/Patient?token="+token, patientBasicInfoData, {success: AddPatientsuccess, error: AddPatienterror});
		PublicDataAccessModel.create("/RTUser?token="+token, patientBasicInfoData, {success: AddPatientsuccess, error: AddPatienterror});
	}else{
		//编辑时 DoctorID 不需要符值
		sap.m.MessageToast.show("正在保存数据……");
	    //修改数据 
        //PublicDataAccessModel.update("/Patient('"+currentSelectpatientRecId+"')?token="+token, patientBasicInfoData, {success: EditPatientsuccess, error: EditPatienterror});
		PublicDataAccessModel.update("/RTUser('"+currentSelectpatientRecId+"')?token="+token, patientBasicInfoData, {success: EditPatientsuccess, error: EditPatienterror});
	};
};


function AddPatientsuccess(bResult) {
     PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();     
     sap.m.MessageToast.show("数据增加成功！");
     
     if(AllRoleData.length > 0){
     	var User_Roledata = {};
     	User_Roledata.UserID = bResult.RecId;
     	for(var n=0;n<AllRoleData.length;n++){
     		if(AllRoleData[n].Name == "Patient"){
     			User_Roledata.RoleID = AllRoleData[n].RecId;
     			break;
     		};
     	};
     	PublicDataAccessModel.create("/User_Role?token="+token, User_Roledata, {success: AddpatientRolesuccess, error: AddPatienterror});
     };
     var UserRelation = {};
     UserRelation.DoctorID = current_userid;
     UserRelation.PatientID =bResult.RecId;
     PublicDataAccessModel.create("/UserRelation?token="+token, UserRelation, {success: AddpatientRolesuccess, error: AddPatienterror});
     
     //bResult 存放着增加成功能的数据
     //console.log(bResult); 
     patientAllDatalist.push({
            Address_: bResult.Address_,
			Addressinfo: bResult.Addressinfo,
			Age_: bResult.Age_,
            LoginID: bResult.LoginID,
			LoginPwd: bResult.LoginPwd,
			PatientName: bResult.Name,
            PatientNamePinyin: bResult.NamePinyin,
			Phone: bResult.Phone,
            Sex_: bResult.Sex_,
			Country: bResult.Country,
			NativePlace: bResult.NativePlace,
            QR: bResult.QR,
            Portrait: bResult.Portrait,
            DoctorID: bResult.DoctorID,
			HospitalID: bResult.HospitalID,
			RecId: bResult.RecId,
         
			CreatedBy: bResult.CreatedBy,
			CreatedDateTime: bResult.CreatedDateTime,
			LastModBy: bResult.LastModBy,
			LastModDateTime: bResult.LastModDateTime
     });
	 currentSelectpatientRecId = bResult.RecId;
     patientAlllistPush(bResult);
     
	 //清除患者信息
     //clearEditPatientSimpleForm();
     
//     oSavePatientBasicInfoButton.setVisible(false);
//     oEidtPatientBasicInfoButton.setVisible(true);
     
     //设置基本信息中各栏是否为可编辑状态
     setPatientBasicInfoFromState(false);
     
     oPatientSplitApp.toMaster(oPatientBasicInfoMasterPageBrowse);
};

function AddpatientRolesuccess(bResult) {
	PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();
     sap.m.MessageToast.show("数据增加成功！");
}


function AddPatienterror(bResult) {
    //console.log('---Add Doctor error -----');
    sap.m.MessageToast.show("数据增加失败！"+bResult.message);
};

//将新增加的患者数据增加到显示列表中
function patientAlllistPush(bResult){
    patientListData.navigation.unshift({
			Address_: bResult.Address_,
			Addressinfo: bResult.Addressinfo,
			Age_: bResult.Age_,
            LoginID: bResult.LoginID,
			LoginPwd: bResult.LoginPwd,
			title: bResult.Name,
            PatientNamePinyin: bResult.NamePinyin,
			Phone: bResult.Phone,
            Sex_: bResult.Sex_,
			Country: bResult.Country,
			NativePlace: bResult.NativePlace,
            QR: bResult.QR,
            Portrait: bResult.Portrait,
            DoctorID: bResult.DoctorID,
			HospitalID: bResult.HospitalID,
			RecId: bResult.RecId,
            icon : "sap-icon://employee",
            iconInset : false,
            type : "Active",
            unread: true,
            press: "Content pressed"
		});
		
		var xbsex = "男";
		if(bResult.Sex_ == "DOC_docotrAdd_Sex_B"){
			xbsex = "女";
		}
		var sage = bResult.Age_;
		var csrq = "";
		var nian = "";
		if(sage != ""){
			sage =  sage.substring(6, (sage.length - 2));
		    var objDate=new Date(parseInt(sage));
			csrq = objDate.Format("yyyy-MM-dd");
			nian = jsGetAge(csrq);
		};
		
		var Addresslist = bResult.Address_.split('.');
		var address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
		address = address + bResult.Addressinfo;
		var HospitalName="";
		for(var m=0;m<hospitallist_patient.length;m++){
			//HospitalName = hospitallist_patient[m].RecId;
			if(bResult.HospitalID == hospitallist_patient[m].RecId){
				HospitalName = hospitallist_patient[m].HospitalName;
				break;
			};
		};
		
		patientTableData.navigationtable.unshift({
			number:patientTableData.navigationtable.length + 1,
			Address: address,			
			Age_: csrq,            
			PatientName: bResult.Name,
            PatientNamePinyin: bResult.NamePinyin,
			Phone: bResult.Phone,			
            Sex_: xbsex,
			Country: bResult.Country,
			NativePlace: bResult.NativePlace,
            Doctor: bResult.DoctorID,
			Hospital: HospitalName,
			RecId: bResult.RecId
		});
		//重新生成patientTableData.navigationtable[n].number中序号
		for(var i=0;i<patientTableData.navigationtable.length;i++){
			patientTableData.navigationtable[i].number = i+1;
		};
		
		//患者基本信息浏览页的内容
		patientAccountBrowse.setValue(bResult.LoginID);
        patientpwdBrowse.setValue(bResult.LoginPwd);
    	patientNamechsBrowse.setValue(bResult.Name);
    	patientNamePinyinBrowse.setValue(bResult.NamePinyin);
        patientSexBrowse.setValue(xbsex);
    	patientcsrqBrowse.setValue(csrq);
    	patientNianBrowse.setValue(nian);
		patientNationalBrowse.setValue(bResult.Country);
		patientNativePlaceBrowse.setSelectedKey(bResult.NativePlace);
		patientAddressDBrowse.setValue(address);
		patientPhoneBrowse.setValue(bResult.Phone);
		patientHospitalBrowse.setValue(HospitalName);
		
		//重新初始化患者列表中显示的数据
		initialisePatientList(bResult.RecId);
		//重新向患者表格中填充数据
	    iniPatientTableMasterData();
};

//清除患者信息
function clearEditPatientSimpleForm(){
		//患者基本信息编辑页的内容
    	patientAccount.setValue("");
        patientpwd.setValue("");
    	patientNamechs.setValue("");
    	patientNamePinyin.setValue("");
    	oGenderRadioButtonpatient1.setSelected(true);    	
    	patientcsrq.setDateValue(new Date());
    	//patientNational.setValue("");
 	    patientNativePlace.setValue("");
        CountrySelectPatient.setSelectedKey("");
        ProvinceSelectPatient.setSelectedKey("");
        CitySelectPatient.setSelectedKey("");
        patientAddressD.setValue("");
        patientPhone.setValue("");        
        //opatientQR.setSrc("");
		//patientHospital.setSelectedKey("");
        
        //患者基本信息浏览页的内容
        patientAccountBrowse.setValue("");
        patientpwdBrowse.setValue("");
    	patientNamechsBrowse.setValue("");
    	patientNamePinyinBrowse.setValue("");
        patientSexBrowse.setValue("");
    	patientcsrqBrowse.setValue("");
    	patientNianBrowse.setValue("");
		patientNationalBrowse.setValue("");
		patientNativePlaceBrowse.setValue("");
		patientAddressDBrowse.setValue("");
		patientPhoneBrowse.setValue("");
		patientHospitalBrowse.setValue("");
};

//编辑患者信息并保存成功
function EditPatientsuccess(bResult) {
     PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();     
     sap.m.MessageToast.show("数据保存成功！");
     //bResult 存放着增加成功能的数据
     //console.log(bResult);
     for(var n=0;n<patientAllDatalist.length;n++){
	        if(currentSelectpatientRecId == patientAllDatalist[n].RecId){
			    patientAllDatalist[n].Address_= patientBasicInfoData.Address_;
				patientAllDatalist[n].Addressinfo= patientBasicInfoData.Addressinfo;
				var Agei = patientBasicInfoData.Age_.getTime();//返回 1970 年 1 月 1 日至今的毫秒数
                var Agesa = "/Date("+ Agei +")/";
				patientAllDatalist[n].Age_= Agesa;
	            patientAllDatalist[n].LoginID= patientBasicInfoData.LoginID;
				patientAllDatalist[n].LoginPwd= patientBasicInfoData.LoginPwd;
				patientAllDatalist[n].PatientName= patientBasicInfoData.Name;
	            patientAllDatalist[n].PatientNamePinyin= patientBasicInfoData.NamePinyin;
				patientAllDatalist[n].Phone= patientBasicInfoData.Phone;
	            patientAllDatalist[n].Sex_= patientBasicInfoData.Sex_;
				patientAllDatalist[n].Country= patientBasicInfoData.Country;
				patientAllDatalist[n].NativePlace= patientBasicInfoData.NativePlace;//肿瘤类型
	            patientAllDatalist[n].QR= patientBasicInfoData.QR;
	            patientAllDatalist[n].Portrait= patientBasicInfoData.Portrait;
				patientAllDatalist[n].HospitalID= patientBasicInfoData.HospitalID;
				break;
	        }
     };
     //将修改的患者数据更新到显示列表中
	 patientAlllistEdit();
	 
//	 oSavePatientBasicInfoButton.setVisible(false);
//   oEidtPatientBasicInfoButton.setVisible(true);
     //设置基本信息中各栏是否为可编辑状态
     setPatientBasicInfoFromState(false);
     
     oPatientSplitApp.toMaster(oPatientBasicInfoMasterPageBrowse);
}

function EditPatienterror(bResult) {
    //console.log('---Add Doctor error -----');   
    sap.m.MessageToast.show("数据保存失败！"+bResult.message);
};

//将修改的患者数据更新到显示列表中
function patientAlllistEdit(){
	for(var n=0;n<patientListData.navigation.length;n++){
	        if(currentSelectpatientRecId == patientListData.navigation[n].RecId){
				patientListData.navigation[n].Address_= patientBasicInfoData.Address_;
				patientListData.navigation[n].Addressinfo= patientBasicInfoData.Addressinfo;				
				var Agei = patientBasicInfoData.Age_.getTime();//返回 1970 年 1 月 1 日至今的毫秒数
                var Agesa = "/Date("+ Agei +")/";
				patientListData.navigation[n].Age_= Agesa;
	            patientListData.navigation[n].LoginID= patientBasicInfoData.LoginID;
				patientListData.navigation[n].LoginPwd= patientBasicInfoData.LoginPwd;
				patientListData.navigation[n].title= patientBasicInfoData.Name;
	            patientListData.navigation[n].PatientNamePinyin= patientBasicInfoData.NamePinyin;
				patientListData.navigation[n].Phone= patientBasicInfoData.Phone;
	            patientListData.navigation[n].Sex_= patientBasicInfoData.Sex_;
				patientListData.navigation[n].Country= patientBasicInfoData.Country;
				patientListData.navigation[n].NativePlace= patientBasicInfoData.NativePlace;
	            patientListData.navigation[n].QR= patientBasicInfoData.QR;
	            patientListData.navigation[n].Portrait= patientBasicInfoData.Portrait;
				patientListData.navigation[n].HospitalID= patientBasicInfoData.HospitalID;
				
				var xbsex = "男";
				if(patientBasicInfoData.Sex_ == "DOC_docotrAdd_Sex_B"){
					xbsex = "女";
				}
				var csrq = patientBasicInfoData.Age_.Format("yyyy-MM-dd");
				var nian = jsGetAge(csrq);
				
				var Addresslist = patientBasicInfoData.Address_.split('.');
				var address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
				address = address + patientBasicInfoData.Addressinfo;
				
				 var HospitalName="";
				if(hospitallist_patient != null){
					for(var m=0;m<hospitallist_patient.length;m++){
						//HospitalName = hospitallist_patient[m].RecId;
						if(patientBasicInfoData.HospitalID == hospitallist_patient[m].RecId){
							HospitalName = hospitallist_patient[m].HospitalName;
							break;
						};
					};
				};
				if(patientTableData.navigationtable.length > 0){
					patientTableData.navigationtable[n].Address = address;
					patientTableData.navigationtable[n].Age_ = csrq;
					patientTableData.navigationtable[n].PatientName = patientBasicInfoData.Name;
			        patientTableData.navigationtable[n].PatientNamePinyin = patientBasicInfoData.NamePinyin;
					patientTableData.navigationtable[n].Phone = patientBasicInfoData.Phone;
			        patientTableData.navigationtable[n].Sex_ = xbsex;
					patientTableData.navigationtable[n].Country = patientBasicInfoData.Country;
					patientTableData.navigationtable[n].NativePlace = getNativePlaceName(patientBasicInfoData.NativePlace);
			        patientTableData.navigationtable[n].Doctor = patientBasicInfoData.DoctorID;
					patientTableData.navigationtable[n].Hospital = HospitalName;
				}
				
				//患者基本信息浏览页的内容
				patientAccountBrowse.setValue(patientBasicInfoData.LoginID);
		        patientpwdBrowse.setValue(patientBasicInfoData.LoginPwd);
		    	patientNamechsBrowse.setValue(patientBasicInfoData.Name);
		    	patientNamePinyinBrowse.setValue(patientBasicInfoData.NamePinyin);
		        patientSexBrowse.setValue(xbsex);
		    	patientcsrqBrowse.setValue(csrq);
		    	patientNianBrowse.setValue(nian);
				patientNationalBrowse.setValue(patientBasicInfoData.Country);
				patientNativePlaceBrowse.setSelectedKey(patientBasicInfoData.NativePlace);
				patientAddressDBrowse.setValue(address);
				patientPhoneBrowse.setValue(patientBasicInfoData.Phone);
				patientHospitalBrowse.setValue(HospitalName);
				
				//重新初始化患者列表中显示的数据
	            initialisePatientList(currentSelectpatientRecId);
	            //重新向患者表格中填充数据
                iniPatientTableMasterData();
				break;
	       };
	};
};



//填充医院选择框
function setPatientHospital() {
	patientHospital.removeAllItems();
	for(var i=0;i<hospitallist_patient.length;i++){
		var keys = hospitallist_patient[i].RecId;
		var texts = hospitallist_patient[i].HospitalName;
        var itemtemp = new sap.ui.core.Item({
            key: keys,
            text: texts
        });
		patientHospital.addItem(itemtemp);
	};
	
	if(hospitallist_patient.length > 0){
		patientHospital.setSelectedKey(hospitallist_patient[0].RecId);
	};	
};

//根据当前选择的患者id,填充患者基本信息中各栏数据
function setPatientBasicInfoFromID(){
	 for(var n=0;n<patientAllDatalist.length;n++){
	        if(currentSelectpatientRecId == patientAllDatalist[n].RecId){
	        	    //患者基本信息编辑页内容
		        	patientAccount.setValue(patientAllDatalist[n].LoginID);
			        patientpwd.setValue(patientAllDatalist[n].LoginPwd); 
			    	patientNamechs.setValue(patientAllDatalist[n].Name);
			    	patientNamePinyin.setValue(patientAllDatalist[n].NamePinyin);
			    
			    	var patientsex = "男";
			    	oGenderRadioButtonpatient1.setSelected(true);
			    	if(patientAllDatalist[n].Sex_ == "DOC_docotrAdd_Sex_B"){
		        		oGenderRadioButtonpatient1.setSelected(false);
		        		oGenderRadioButtonpatient2.setSelected(true);
		        		patientsex = "女";
		        	}
			    	
		        	var sage = patientAllDatalist[n].Age_;
		        	var csrq = "";
		        	var nian = "";
		        	//sage =  sage.substring(6, (sage.length - 2));
		        	//var objDate=new Date(parseInt(sage));		        	
		            if(typeof(sage) == "undefined"){
		        	}else{
			        	if(sage != ""){
			        		var objDate=new Date(sage);
					    	patientcsrq.setDateValue(objDate);
					    	csrq = objDate.Format("yyyy-M-d");
					    	nian = jsGetAge(csrq);
			        	};
		        	};
			    	
			    	patientNational.setValue(patientAllDatalist[n].Country);
			    	
			 	    patientNativePlace.setSelectedKey(patientAllDatalist[n].NativePlace);//
			 	    
			 	    var address = "";
			 	    if(patientAllDatalist[n].Address_ != ""){
			        	var Addresslist = patientAllDatalist[n].Address_.split('.');
			        	setDefaultSelectAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
			        	address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
						address = address + patientAllDatalist[n].Addressinfo;
			        };
			        patientAddressDBrowse.setValue(address);
			        
			        patientAddressD.setValue(patientAllDatalist[n].Addressinfo);
			        patientPhone.setValue(patientAllDatalist[n].Phone);
					patientHospital.setSelectedKey(patientAllDatalist[n].HospitalID);

					
					//opatientQR.setSrc("");
					//患者基本信息浏览页的内容
					patientAccountBrowse.setValue(patientAllDatalist[n].LoginID);
			        patientpwdBrowse.setValue(patientAllDatalist[n].LoginPwd); 
			    	patientNamechsBrowse.setValue(patientAllDatalist[n].Name);
			    	patientNamePinyinBrowse.setValue(patientAllDatalist[n].NamePinyin);
			        patientSexBrowse.setValue(patientsex);
			    	patientcsrqBrowse.setValue(csrq);
			    	patientNianBrowse.setValue(nian);
					patientNationalBrowse.setValue(patientAllDatalist[n].Country);
					patientNativePlaceBrowse.setSelectedKey(patientAllDatalist[n].NativePlace);
					
					patientPhoneBrowse.setValue(patientAllDatalist[n].Phone);
					
					var HospitalName="";
					if(hospitallist_patient != null){
						for(var m=0;m<hospitallist_patient.length;m++){
							//HospitalName = hospitallist_patient[m].RecId;
							if(patientAllDatalist[n].HospitalID == hospitallist_patient[m].RecId){
								HospitalName = hospitallist_patient[m].HospitalName;
								break;
							};
						};
					};					
					patientHospitalBrowse.setValue(HospitalName);
		        	break;
	        };
     };
};

//根据当前选择的患者id,填充患者基本信息中各栏数据（通过odata 接口获取的数据用这个方法填充数据）
function setPatientBasicInfoFromID2(){
	 for(var n=0;n<patientAllDatalist.length;n++){
	        if(currentSelectpatientRecId == patientAllDatalist[n].RecId){
	        	    //患者基本信息编辑页内容
		        	patientAccount.setValue(patientAllDatalist[n].LoginID);
			        patientpwd.setValue(patientAllDatalist[n].LoginPwd); 
			    	patientNamechs.setValue(patientAllDatalist[n].Name);
			    	patientNamePinyin.setValue(patientAllDatalist[n].NamePinyin);
			    
			    	var patientsex = "男";
			    	oGenderRadioButtonpatient1.setSelected(true);
			    	if(patientAllDatalist[n].Sex_ == "DOC_docotrAdd_Sex_B"){
		        		oGenderRadioButtonpatient1.setSelected(false);
		        		oGenderRadioButtonpatient2.setSelected(true);
		        		patientsex = "女";
		        	}
			    	
		        	var sage = patientAllDatalist[n].Age_;
		        	var csrq = "";
		        	var nian = "";
		            if(typeof(sage) == "undefined"){
		        	}else{
			        	if(sage != ""){
			        		sage =  sage.substring(6, (sage.length - 2));
			        		var objDate=new Date(parseInt(sage));
					    	patientcsrq.setDateValue(objDate);
					    	csrq = objDate.Format("yyyy-M-d");
					    	nian = jsGetAge(csrq);
			        	};
		        	};
			    	
			    	patientNational.setValue(patientAllDatalist[n].Country);
			    	
			 	    patientNativePlace.setSelectedKey(patientAllDatalist[n].NativePlace);//
			 	    
			 	    var address = "";
			 	    if(patientAllDatalist[n].Address_ != ""){
			        	var Addresslist = patientAllDatalist[n].Address_.split('.');
			        	setDefaultSelectAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
			        	address = GetDefaultAddressPatient(Addresslist[0],Addresslist[1],Addresslist[2]);
						address = address + patientAllDatalist[n].Addressinfo;
			        };
			        patientAddressDBrowse.setValue(address);
			        
			        patientAddressD.setValue(patientAllDatalist[n].Addressinfo);
			        patientPhone.setValue(patientAllDatalist[n].Phone);
					patientHospital.setSelectedKey(patientAllDatalist[n].HospitalID);

					
					//opatientQR.setSrc("");
					//患者基本信息浏览页的内容
					patientAccountBrowse.setValue(patientAllDatalist[n].LoginID);
			        patientpwdBrowse.setValue(patientAllDatalist[n].LoginPwd); 
			    	patientNamechsBrowse.setValue(patientAllDatalist[n].Name);
			    	patientNamePinyinBrowse.setValue(patientAllDatalist[n].NamePinyin);
			        patientSexBrowse.setValue(patientsex);
			    	patientcsrqBrowse.setValue(csrq);
			    	patientNianBrowse.setValue(nian);
					patientNationalBrowse.setValue(patientAllDatalist[n].Country);
					patientNativePlaceBrowse.setSelectedKey(patientAllDatalist[n].NativePlace);
					
					patientPhoneBrowse.setValue(patientAllDatalist[n].Phone);
					
					var HospitalName="";
					if(hospitallist_patient != null){
						for(var m=0;m<hospitallist_patient.length;m++){
							//HospitalName = hospitallist_patient[m].RecId;
							if(patientAllDatalist[n].HospitalID == hospitallist_patient[m].RecId){
								HospitalName = hospitallist_patient[m].HospitalName;
								break;
							};
						};
					};					
					patientHospitalBrowse.setValue(HospitalName);
		        	break;
	        };
     };
};

//设置基本信息中各栏是否为可编辑状态
function setPatientBasicInfoFromState(State){
        patientAccount.setEnabled(State);
        patientpwd.setEnabled(State);       
        patientNamechs.setEnabled(State);
        patientNamePinyin.setEnabled(State);
        oGenderRadioButtonpatient1.setEnabled(State);
		oGenderRadioButtonpatient2.setEnabled(State);
        patientcsrq.setEnabled(State);
        patientNational.setEnabled(State);
        patientNativePlace.setEnabled(State);      
        CountrySelectPatient.setEnabled(State);
        ProvinceSelectPatient.setEnabled(State);
        CitySelectPatient.setEnabled(State);
        patientAddressD.setEnabled(State);
        patientPhone.setEnabled(State);
        patientHospital.setEnabled(State);
        oButtonPatientQR.setEnabled(State);

};

//根据出生日期计算周岁的代码，格试：1900-01-02
function jsGetAge(strBirthday){       
		var returnAge;
		var strBirthdayArr=strBirthday.split("-");
		var birthYear = strBirthdayArr[0];
		var birthMonth = strBirthdayArr[1];
		var birthDay = strBirthdayArr[2];
		
		d = new Date();
		var nowYear = d.getFullYear();
		var nowMonth = d.getMonth() + 1;
		var nowDay = d.getDate();
		
		if(nowYear == birthYear){
			returnAge = 0;//同年 则为0岁
		}
		else
		{
			var ageDiff = nowYear - birthYear ; //年之差
			if(ageDiff > 0)
			{
				if(nowMonth == birthMonth){
					var dayDiff = nowDay - birthDay;//日之差
					if(dayDiff < 0)
					{returnAge = ageDiff - 1;}
					else
					{returnAge = ageDiff ;}
				}else{
					var monthDiff = nowMonth - birthMonth;//月之差
					if(monthDiff < 0)
					{returnAge = ageDiff - 1;}
					else
					{returnAge = ageDiff ;}
				}
			}else{
				//返回-1 表示出生日期输入错误 晚于今天
				returnAge = -1;
			}
		}
		return returnAge;//返回周岁年龄
}
