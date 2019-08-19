//医生个人账户管理
jQuery.sap.require("sap.m.MessageToast");

var DoctorEditShell= new sap.m.Shell({
            title: "Doctor Account Application",
            //logo: "images/SAPUI5.png",
            showLogout: false
    });
var oDoctorEditApp = new sap.m.App();

//请输入医生账户
var doctorAccountEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生账户 ...',maxLength:40});
//请输入医生姓名
var doctorNameEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生姓名 ...',maxLength:40});

//医生性别单选框组
var oGenderRadioButtonEdit1 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_A"), selected: true});//'男'
var oGenderRadioButtonEdit2 = new sap.m.RadioButton({groupName:"Gruppe1", text: oBundle.getText("DOC_docotrAdd_Sex_B"), selected: false});//'女'
var doctorGenderEdit = new sap.m.HBox({
				items:[
					oGenderRadioButtonEdit1,
					oGenderRadioButtonEdit2
				]
});
//请选择医生出生年月
//var doctorAge = new sap.m.DateTimeInput({placeholder : "请选择医生出生年月",type : "Date"});
var doctorAgeEdit = new sap.m.DatePicker({dateValue: new Date(), valueFormat: "yyyy-MM-dd", displayFormat: "long"});

//请输入医生国籍
var doctorNationalEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生国籍 ...',maxLength:25});

//医生职称单选框组
var oLevelRadioButtonEdit1 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_AA"), selected: true});//主任医师
var oLevelRadioButtonEdit2 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_AB"), selected: false});//副主任医师
var oLevelRadioButtonEdit3 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_BA"), selected: false});//主治医师
var oLevelRadioButtonEdit4 = new sap.m.RadioButton({groupName:"Gruppe2", text: oBundle.getText("DOC_oNodeRootChild_DoctorLevel_BB"), selected: false});//医师
var doctorLevelEdit = new sap.m.HBox({
				items:[
					oLevelRadioButtonEdit1,
                    oLevelRadioButtonEdit2,
                    oLevelRadioButtonEdit3,
					oLevelRadioButtonEdit4
				]
});

//是否是医院管理员复选框
var doctormanageCBoxEdit = new sap.m.CheckBox({text:'是医院管理员',tooltip:'是医院管理员',checked:false});
//请输入帐户密码
var doctorpwdEdit = new sap.m.Input({type: sap.m.InputType.Password,placeholder: '请输入帐户密码 ...',maxLength:30});

//请输入详细地址
var doctorAddressDEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入详细地址 ...',maxLength:120});
//请输入医生联系电话
var doctorPhoneEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生联系电话 ...',maxLength:25});
//请输入医生联系传真
var doctorFaxEdit = new sap.m.Input({type: sap.m.InputType.Text,placeholder: '请输入医生联系传真 ...',maxLength:25});
//医生所属医院
var doctorHospitalEdit = new sap.m.ComboBox({
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

var odoctorQREdit = new sap.m.Image({
        src: "data:image/gif;base64,R0lGODlhHwAeANU/AO1SReW2N+14Kf3YACOAulrAWtTW02Gh1uPIx/BkVFXKXu3t7bjZuoi9R7nV8fbOG8fBulSlWvh8ZlW0WvTu0aG8QqK92sGkdcWjoPr5+WyrUUaiV7q0oHWs2vrTCYOeiJ94QulCOYK34ceNifHEJfLWRuLf3tomHUWUzeQxLf/cDc1+dtzCOqKzo83o92mxbPSSjP/ohspCL2K1WG7Ga+k5NIGfWcbKKcu5ceTPBvDKAJfRkIyvjVvEXeV4af///yH5BAEAAD8ALAAAAAAfAB4AAAb/wJ9wSPwtDBCMEmJYFJ/QXwYx8kmuWIlvBMlEoaZVIptNmBMrw5eIObvfZkACgFn/MIA8/J3vj74jfYJycYMAIYh/TxCIiIaGjYg1NRBFCzYhNZGbk42TNSmhmiZELQogKZ+SNQkwrhICsbKzF0MLLwozMqmTKQAICy7CCxQlOg8PHh4DAyoPTj8QPQWnoikJCw4i29sOGSXKzOIqlT88CgXTuykhJg4HHdwdBxYUKuLjOFIv09Q2JydguIDXoaDBAw5i4GOmgkWGW/2ogTiBQASKAxgzHkAhgsLCZs8WzIjYQ4MMBBs1Zrxo7+MDEyILyJR5CiWKmzhxHmi58OWtzJkye8xA0IFATpwEOnj8SGJBhhdAZ+5wQMBozqoJPw5waC5qUANFq4pNylOcBxX6ok3wWoCGAQtjCVgwUWKhsgflfrKlweCtBQsGGFT46OFBAGg/WkxYu3eH4xcRcuC7+4ADkQURFrOduXiw2cKGEQuBkJkx2wkzlg1QVpgEiXJFWpQ2DXTCjdWUXVuOInuxb84NKD9wTWL3Fw4bIsz2zQIZcRIBjK8x8SG58ggbKjyHfkGNHSIGqm9IHqB8gAvdvXx/cgQCh/dMREMJAgA7",
        alt: "test image",
        decorative: false,
        width: "100px",
        height: "100px",
        densityAware: false
    });
var oButtonQREdit = new sap.m.Button({text:"生成二维码",width:"100px",type : sap.m.ButtonType.Emphasized});    
    oButtonQREdit.attachPress(function(){
        //alert("生成二维码")
        odoctorQREdit.setSrc("data:image/gif;base64,R0lGODlhHAAeANU/AJ+go4aZtKK2111cXT2g1thLFqfN5DCBuliLwPz6+YOf0e3s7NHR0bS0tODg35aly3l5eIC21TEyMmqZzouKjIKJnMjJyb3c7j2t20K452CBrnONuy6L2UlNTyBZpKSwvDWVzD94riCJxVO16tLd5vLx8UJ2uSFlp1xviefl5BtztNfX1r28uqysrMHAwFOx2tzb2zOm5W1tbfL2+vb19MXR4Hes55tELxdTmtjFvLfC3WGVypSVmNvm9IV+gf///yH5BAEAAD8ALAAAAAAcAB4AAAb/wJ9wOCxZGJYEccls/iwWWCPlrDJpLVeLAVtxS9amg7FIJBap1GKxYq3CwkUyYaHIBviBjOfSLqxdCQ0yMhAUFBUVFBAyHRAAPAxODA4LPjKIAQ+bDwoBFTx3EBAWTDBRMj48Gw8CNToCsQIPoBR6Mm9DCVuYq5sKrpybAhqgeBBKQg0sPhQAGwrR0Z2eAZ4+Gjw8ei1CNBQ8EC0a0tETNQob6hQ3GgEaLRADEGDMjwE7ChP7Ezs9OhoQ+CiAQt2GAC0G+GCRYJGPBgER7Nixzx+JCQMHINAQQoOGBqN4OGDE40PHgBMNCEAQYuCNk5o2NNjGwwIjAAE6hghxQMWE/xA4bhS48YFEDYPuElJocKlFzhMeTpzYYUDFhxw3Ohi4gAAqjhMBWMxrsKhBAA/qTBiYQSLCAhYoQEQQAaKuChUBXOhxEa5BCxOsTCA4MGFBAxQiIlx4QYAAiAMHPojFxcNHixYHEJiAfKAGRMUvMITG8PiAlg4yaGjjs4MuCBECWoRIPAMEAQy4X09YQcHRjwYAZDD4UFcugAPFLzTOkAGDYwsrBnRo8MOSjAYwIjQOYLsxCA4cCDBvHCEFAAkdwPwAIA9GdtsjcGPgYGMCB+YxyjPoIIFHkTs+LOBABMwVGJ4N92VQXgoDoEcDERZ00AEFC5RQQwQjFBhDhhHUQFaDAw1KIMkSDfAnXAIlkGDAigaQQAINNLDAnwTUNVGiBBJQYEEJZphBQwqD4DidFQzIgKME84Bjh4QS4gJHCUEK2UEeYz0IhxAlMNACBT5A0MwWVjIRBAA7");
    });


var editableSimpleFormEdit = new sap.ui.layout.form.SimpleForm({
    //minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
//        new sap.ui.core.Title({ // this starts a new group
//            text: "医生信息"
//        }),
        new sap.m.Label({
            text: '账户'
        }),
        doctorAccountEdit,
        new sap.m.Label({
            text: '帐户密码'
        }),
        doctorpwdEdit,
        new sap.m.Label({
            text: '姓名'
        }),
        doctorNameEdit,
        new sap.m.Label({
            text: '性别'
        }),
        doctorGenderEdit,
        new sap.m.Label({
            text: '出生年月'
        }),
        doctorAgeEdit,
//        new sap.m.Label({
//            text: '国籍'
//        }),
//        doctorNationalEdit,
        new sap.m.Label({
            text: '职称'
        }),
        doctorLevelEdit,        
        new sap.m.Label({
            text: '联系地址'
        }),     
        new sap.m.HBox({items : [CountrySelectDoctorEdit,ProvinceSelectDoctorEdit,CitySelectDoctorEdit]}),
        new sap.m.Label({
            text: ''
        }),
        doctorAddressDEdit,
        new sap.m.Label({
            text: '联系电话'
        }),
        doctorPhoneEdit,
        new sap.m.Label({
            text: '联系传真'
        }),
        doctorFaxEdit,
        new sap.m.Label({
            text: '所属医院'
        }),
        doctorHospitalEdit,
        new sap.m.Label({
            text: ''
        }),
        doctormanageCBoxEdit
//        ,
//        new sap.m.Label({
//            text: '二维码'
//        }),
//        oButtonQREdit,
//        odoctorQREdit,
//        new sap.m.Label({
//            text: '照片'
//        }),
//        UploadCollectionEdit
    ]
});
editableSimpleFormEdit.addStyleClass("vlayout");
if(jQuery.device.is.phone){
	editableSimpleFormEdit.addStyleClass("phoneStyle");
}

var oSaveButtonDoctorEdit = new sap.m.Button({text:"保存",icon:"sap-icon://save"});
	oSaveButtonDoctorEdit.attachPress(function(){
	    var Account=doctorAccountEdit.getValue();
//        Account=Account.replace(/^\s+|\s+$/g, "");        
//        if(Account == ""){                    
//            sap.m.MessageToast.show("医生账户不能为空！");        	
//            return;
//        };
//        //把（英文）字符串转换为大写
//        Account = Account.toUpperCase();
//        doctorAccountEdit.setValue(Account);
        
        var passw=doctorpwdEdit.getValue();
        passw=passw.replace(/^\s+|\s+$/g, "");
        if(passw == ""){
            sap.m.MessageToast.show("账户密码不能为空！");
            return;
        };
        
        var name=doctorNameEdit.getValue();
        name=name.replace(/^\s+|\s+$/g, "");
        if(name == ""){
            sap.m.MessageToast.show("医生姓名不能为空！");
            return;
        };
        
        var sex = "DOC_docotrAdd_Sex_A";//男
        if(oGenderRadioButtonEdit2.getSelected()){
        	sex = "DOC_docotrAdd_Sex_B";//女
        };
        var age = (doctorAgeEdit.getDateValue()).Format("yyyy-MM-dd hh:mm:ss");//出生年月
        
        var National="";
//        National=doctorNationalEdit.getValue();
//        National=National.replace(/^\s+|\s+$/g, "");
//        if(National == ""){
//            sap.m.MessageToast.show("国藉不能为空！");        	
//            return;
//        };
        
        var Level = "DOC_oNodeRootChild_DoctorLevel_AA";//主任医师
        if(oLevelRadioButtonEdit2.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_AB";//副主任医师
        };
        if(oLevelRadioButtonEdit3.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_BA";//主治医师
        };
        if(oLevelRadioButtonEdit4.getSelected()){
        	Level = "DOC_oNodeRootChild_DoctorLevel_BB";//医师
        };
        
        var IsAdmin= false;//是医院管理员
        if(doctormanageCBoxEdit.getSelected()){
        	IsAdmin= true;
        };
        
        var Address = "";
        if(CountrySelectDoctorEdit.getSelectedKey() != ""){        	
        	Address = CountrySelectDoctorEdit.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择国家！");
           return;
        };
        
        if(ProvinceSelectDoctorEdit.getSelectedKey() != ""){
        	Address = Address + ProvinceSelectDoctorEdit.getSelectedKey()+".";
        }else{
           sap.m.MessageToast.show("请选择省/市！");
           return;
        };
        var items = CitySelectDoctorEdit.getItems();
        if(items.length > 1){    
	        if(CitySelectDoctorEdit.getSelectedKey() != ""){
	        	Address = Address + CitySelectDoctorEdit.getSelectedKey();
	        }else{
	           sap.m.MessageToast.show("请选择城市！");
	           return;
	        };
        };
                
        var Addressinfo = doctorAddressDEdit.getValue();
        Addressinfo=Addressinfo.replace(/^\s+|\s+$/g, "");
        if(Addressinfo == ""){
            sap.m.MessageToast.show("医生详细地址不能为空！");
            return;
        };
        
        var Phone = doctorPhoneEdit.getValue();
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
        
        var Fax = doctorFaxEdit.getValue();
        Fax=Fax.replace(/^\s+|\s+$/g, "");
        if(Fax != ""){
        	if (!verifyTelNumber(Fax)) {
	            sap.m.MessageToast.show("请填写正确的传真号码!");
	            return;
	        };
        };
        
        var HospitalID = "";
        if(doctorHospitalEdit.getSelectedKey() != ""){        	
        	HospitalID = doctorHospitalEdit.getSelectedKey();
        }else{
           sap.m.MessageToast.show("请选择医生所属医院！");
           return;
        };
		
		 if(token != ""){
		 	doctordata = {};
			doctordata.LoginID = Account;
			doctordata.Name = name;//DoctorName
			doctordata.Sex_ = sex;
			doctordata.Age_ = doctorAge.getDateValue();//出生年月  Age
			doctordata.Country = National;
			doctordata.DoctorLevel = Level;
			//doctordata.IsAdmin = IsAdmin;//是医院管理员
			doctordata.LoginPwd = passw;
			//doctordata.LoginPwd = "123456";
			doctordata.Address_ = Address;
			doctordata.Addressinfo = Addressinfo;
			doctordata.Phone = Phone;
			doctordata.Fax = Fax;
			doctordata.HospitalID = HospitalID;
			doctordata.QR = ""; //二维码
			doctordata.Portrait = "";//照片			
			
            sap.m.MessageToast.show("正在保存数据……");
            //修改数据 
			PublicDataAccessModel.update("/RTUser('"+currentSelectdoctorRecId+"')?token="+token, doctordata, {success: EditDoctorsuccessEdit, error: EditDoctorerrorEdit});
         };
	});
	
var oCancleButtondoctorEdit = new sap.m.Button({text:"取消",icon:"sap-icon://sys-cancel"});
	oCancleButtondoctorEdit.attachPress(function(){
		app.back();
		oEditButtondoctorEdit.setVisible(true);
        oSaveButtonDoctorEdit.setVisible(false);
	});
	
var oEditButtondoctorEdit = new sap.m.Button({text:"编辑",icon:"sap-icon://edit"});
	oEditButtondoctorEdit.attachPress(function(){
		 oEditButtondoctorEdit.setVisible(false);
         oSaveButtonDoctorEdit.setVisible(true);
         //设置基本信息中各栏是否为可编辑状态
         setTableSimpleFormStateEdit(true);
         //医生账户字段不能编辑（这个值是系统后台自动产生的）
         doctorAccountEdit.setEnabled(false);
         //重新设置 doctormanageCBoxEdit 是否是管理员是否可编辑
         for(var n=0;n<current_userRole.length;n++){
         	if(current_userRole.length > 1){
				if(((current_userRole[n].RoleName == "Doctor") && (current_userRole[n+1].RoleName == "HospitalAdmin")) ||
				   ((current_userRole[n].RoleName == "HospitalAdmin") && (current_userRole[n+1].RoleName == "Doctor")) ){
				   		doctormanageCBoxEdit.setEnabled(true);
						break;
				   };
         	}else if(current_userRole[n].RoleName == "Doctor"){
				doctormanageCBoxEdit.setEnabled(false);
				break;
			};
		};
	});

function EditDoctorsuccessEdit(bResult) {
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
	doctorAlllistEditEdit();
	
	oEditButtondoctorEdit.setVisible(true);
    oSaveButtonDoctorEdit.setVisible(false);
    
    //设置基本信息中各栏是否为可编辑状态
    setTableSimpleFormStateEdit(false);
    
     //处理当前是否修改了“是医院管理员”
    if(doctormanageCBoxEdit.getSelected() != currentSelectdoctorIsAdmin){
    	if(doctormanageCBoxEdit.getSelected() == false){
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

function EditDoctorerrorEdit(bResult) {
    //console.log('---Add Doctor error -----');   
    sap.m.MessageToast.show("数据保存失败！"+bResult.message);
}

//将修改的医生数据更新到显示列表中
function doctorAlllistEditEdit(){
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
				break;
	        }
	}
}

//填充医院选择框
function setdoctorHospitalEdit() {
	doctorHospitalEdit.removeAllItems();
	for(var i=0;i<hospitallist.length;i++){
		var keys = hospitallist[i].RecId;
		var texts = hospitallist[i].HospitalName;
        var itemtemp = new sap.ui.core.Item({
            key: keys,
            text: texts
        });
		doctorHospitalEdit.addItem(itemtemp);
	}
	
	if(hospitallist.length > 0){
		doctorHospitalEdit.setSelectedKey(hospitallist[0].RecId);
	}	
}

//填充需要编辑的医生信息
function setTableSimpleFormEdit(){
	 for(var n=0;n<doctorAlllist.length;n++){
	        if(currentSelectdoctorRecId == doctorAlllist[n].RecId){
	        	doctorAccountEdit.setValue(doctorAlllist[n].LoginID);
	        	doctorNameEdit.setValue(doctorAlllist[n].DoctorName);
	        	
	        	oGenderRadioButtonEdit1.setSelected(true);
	        	if(doctorAlllist[n].Sex_ == "DOC_docotrAdd_Sex_B"){
	        		oGenderRadioButtonEdit1.setSelected(false);
	        		oGenderRadioButtonEdit2.setSelected(true);
	        	}
	        	
	        	var sage = doctorAlllist[n].Age;
//	        	sage =  sage.substring(6, (sage.length - 2));
//              var objDate=new Date(parseInt(sage));
				if(sage != ""){
					var objDate=new Date(sage);
		        	doctorAgeEdit.setDateValue(objDate);
				};
	        	
	        	//doctorNationalEdit.setValue(doctorAlllist[n].Country);	        	
	        	
	        	//主任医师
		        oLevelRadioButtonEdit1.setSelected(false);
		        oLevelRadioButtonEdit2.setSelected(false);
		        oLevelRadioButtonEdit3.setSelected(false);
		        oLevelRadioButtonEdit4.setSelected(false);
	        	if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AA"){
		        	//主任医师
		        	oLevelRadioButtonEdit1.setSelected(true);
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_AB"){
		        	//副主任医师
		        	oLevelRadioButtonEdit2.setSelected(true);
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BA"){
		        	//主治医师
		        	oLevelRadioButtonEdit3.setSelected(true)
		        }
		        if(doctorAlllist[n].DoctorLevel == "DOC_oNodeRootChild_DoctorLevel_BB"){
		        	//医师
		        	oLevelRadioButtonEdit4.setSelected(true)
		        }
		        
		        doctorpwdEdit.setValue(doctorAlllist[n].LoginPwd);
		        
		        //当前医生是否是医院管理员
				currentSelectdoctorIsAdmin = false;
		        doctormanageCBoxEdit.setSelected(false);
			    for(var i=0;i<AllUserRoleData.length;i++){
		        	//HospitalAdminRoleID  医院管理员角色ID
		        	if((AllUserRoleData[i].UserID == current_userid) && (AllUserRoleData[i].RoleID == HospitalAdminRoleID)){
		        		doctormanageCBoxEdit.setSelected(true);
		        		currentSelectdoctorIsAdmin = true;
		        		break;
		        	};
		        };
		        
		        var Addresslist = doctorAlllist[n].Address_.split('.');
		        
		        setDefaultSelectAddressDoctorEdit(Addresslist[0],Addresslist[1],Addresslist[2]);
		        
		        doctorAddressDEdit.setValue(doctorAlllist[n].Addressinfo);
		        
		        doctorPhoneEdit.setValue(doctorAlllist[n].Phone);

				doctorFaxEdit.setValue(doctorAlllist[n].Fax);
				
				doctorHospitalEdit.setSelectedKey(doctorAlllist[n].HospitalID);
				
				//odoctorQREdit.setSrc("");
	        	break;
	        };
     };
     //设置基本信息中各栏是否为可编辑状态
     setTableSimpleFormStateEdit(false);
     
     oSaveButtonDoctorEdit.setVisible(false);
};

//设置基本信息中各栏是否为可编辑状态
function setTableSimpleFormStateEdit(State){
        doctorAccountEdit.setEnabled(State);
        doctorpwdEdit.setEnabled(State);       
        doctorNameEdit.setEnabled(State);
        oGenderRadioButtonEdit1.setEnabled(State);
		oGenderRadioButtonEdit2.setEnabled(State);
        doctorAgeEdit.setEnabled(State);        
        //doctorNationalEdit.setEnabled(State);
        
        oLevelRadioButtonEdit1.setEnabled(State);
        oLevelRadioButtonEdit2.setEnabled(State);
        oLevelRadioButtonEdit3.setEnabled(State);
        oLevelRadioButtonEdit4.setEnabled(State);
        
        doctormanageCBoxEdit.setEnabled(State);
        
        CountrySelectDoctorEdit.setEnabled(State);
        ProvinceSelectDoctorEdit.setEnabled(State);
        CitySelectDoctorEdit.setEnabled(State);
        
        doctorAddressDEdit.setEnabled(State);        
        doctorPhoneEdit.setEnabled(State);
		doctorFaxEdit.setEnabled(State);      
        doctorHospitalEdit.setEnabled(State);
        
        oButtonQREdit.setEnabled(State);
};

var doctorAccountEditPage = new sap.m.Page({
    title : "账户信息",
    showNavButton: true,
    navButtonText: "Back",
    navButtonPress: function() {
        app.back();
        oEditButtondoctorEdit.setVisible(true);
        oSaveButtonDoctorEdit.setVisible(false);
    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                editableSimpleFormEdit
            ]
        })
    ],
    footer: new sap.m.Toolbar({            
            content: [
                new sap.m.ToolbarSpacer(),
                oEditButtondoctorEdit,
                oSaveButtonDoctorEdit,
                oCancleButtondoctorEdit
            ]
    })
});
doctorAccountEditPage.addStyleClass("patientMasterPage");

//获取当前登录医生数据
function GetDoctorAccountPageData(hospitalid) {
	currentSelectdoctorRecId = current_userid;
		
    //获取医生分类数据，填充医生分类选择树
	GetDoctorLevel();
    
	//根据指定医院ID获取指定医院数据,填充医院选择框
	GetHospitalFromHospitalIDAccountManage(hospitalid);

	//获取当前医生的信息， 放到获取医院数据完成后方法 getHospitalsuccess 中。
}

oDoctorEditApp.addPage(doctorAccountEditPage);

DoctorEditShell.setApp(oDoctorEditApp);
