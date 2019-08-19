/*
 * 医生管理
*/

var oAddButton = new sap.m.Button({text:"添加",icon:"sap-icon://add"});			
oAddButton.attachPress(function(){
    doctorAdd = true;
    oEditButtondoctor.setVisible(false);
    oSaveButtonDoctor.setVisible(true);
	oSplitApp.toDetail(add_doctor);
	//设置基本信息中各栏是否为可编辑状态
    setTableSimpleFormState(true);
    //医生账户字段不能编辑（这个值是系统后台自动产生的）
    doctorAccount.setEnabled(false);
    
	//清除医生信息
	clearTableSimpleForm();	
	//设置医生分类单按钮选择项
	setRadioButtonSelectedLevel();
	add_doctor.setTitle("添加医生");
});

//create first master page
var oMasterPage = new sap.m.Page("oMasterPageDoctor",{
	title: oBundle.getText("DOC_oMasterPage_title"), //医生分类树
	//icon: "images/SAPUI5.jpg",
	showNavButton: true, 
	navButtonPress: function(){
		oSplitApp.toDetail(doctorTablePage);
//		// 1医院管理员
//		if(current_usertype == "1"){
//			oDialogexitsystem.removeAllContent();
//            oDialogexitsystem.addContent(new sap.m.Label({text:"要退出系统吗？"}));
//            oDialogexitsystem.open();
//		}else{
			app.back();
			//重新初始化医生列表页显示状态
            iniDoctorTable();
			DoctorStandardTile.setInfo("共有  "+current_doctorCount+" 位医生");
//		}
	},
	content: [
        odoctorTree
	],
	footer: new sap.m.Toolbar({
		content: [
            	new sap.m.ToolbarSpacer(),
            	oAddButton
        ]
	})
});

var DoctorShell= new sap.m.Shell({
            title: "Doctor Manage Application",
            //logo: "images/SAPUI5.png",
            showLogout: false
    });

//create SplitApp()
var oSplitApp = new sap.m.SplitApp({
				detailPages: [doctorTablePage, add_doctor],
				masterPages: [oMasterPage],
				initialDetail: doctorTablePage,
				initialMaster: oMasterPage
			});
			
DoctorShell.setApp(oSplitApp);

if (sap.ui.Device.system.tablet  || sap.ui.Device.system.desktop) {
	oSplitApp.setDefaultTransitionNameDetail("fade");
}

//获取医生数据
function doctormangesplitApp(userRole,hospitalid) {
    //获取数据操作权限Token
	//GetTokendata();
	
    //获取医生分类数据，填充医生分类选择树
	GetDoctorLevel();
    	
	for(var n=0;n<userRole.length;n++){
		if(userRole[n].RoleName == "SysAdmin"){
			//获取所有医院数据,填充医院选择框
	        GetHospital();
			break;
		}else{
			 //(医院管理员)根据指定医院ID获取指定医院数据,填充医院选择框
	         GetHospitalFromHospitalID(hospitalid);
			break;
		}
	};	
	
	//放到 获取医院数据完成后方法 getHospitalsuccess 中。
//	if(usertype == "0"){
//		//获取医生数据,填充医生选择框
//	    GetdoctorAllData();
//	}else{
//		//获取指定医院所有医生数据,填充医生显示表格
//		GetdoctorAllDataFromHospitalID(hospitalid);
//	}
}