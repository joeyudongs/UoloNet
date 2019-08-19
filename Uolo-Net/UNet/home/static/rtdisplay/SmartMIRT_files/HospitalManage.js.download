var HospitalMasterPage = new sap.m.Page({
		showNavButton: true, 
		navButtonPress: function(){			
			app.back();
			HospitalStandardTile.setInfo("共有 "+current_hospitalCount+" 家医院");
		},
//		subHeader: new sap.m.Toolbar({
//			content:[
//				new sap.m.ToolbarSpacer(),
//				new sap.m.Button({
//					icon:"sap-icon://synchronize",
//					press : function(e) {
//						sap.m.MessageToast.show("刷新成功!");
//					}
//				})
//			]
//
//		}),
        footer: new sap.m.Toolbar({
            content: [
            	new sap.m.ToolbarSpacer(),
                new sap.m.Button({
                   icon:"sap-icon://add",
                   text:"添加",
                   //icon: "images/SAPUI5.png"
                   press : function(e) {
						isAdd = true;
						console.log(clickTreeKey);
						var hosData = PublicJsonModel.getData("hosTabModelData").hosTabModelData;
						//console.log(hosData);
						HospitalFormPage.setTitle("新增医院");
						setHospitalTable("","","","","","","","");
						setHospitalPlaceholder("请输入医院名称...","请输入详细地址...","请输入医院联系电话...","请输入医院传真...","请输入用户名...","请输入用户密码...");
                        hosEditBtn.setVisible(false);
				        hosSaveBtn.setVisible(true);
				        //设置基本信息中各栏是否为可编辑状态
				        setHospitalFormState(true);
                        HospitalApp.to(HospitalFormPage);
                   }
                })
            ]
        })
    });
//HospitalMasterPage.addContent(Refreshhospital);

HospitalMasterPage.addContent(hospitalTree);

var HospitalShell= new sap.m.Shell({
            title: "Hospital Manage Application",
            //logo: "images/SAPUI5.png",
            showLogout: false
    });

var HospitalApp = new sap.m.SplitApp({
    masterPages: [HospitalMasterPage],
    detailPages: [HospitalTablePage,HospitalFormPage],
    initialDetail: HospitalTablePage,
	initialMaster: HospitalMasterPage
});

HospitalShell.setApp(HospitalApp);

if (sap.ui.Device.system.tablet  || sap.ui.Device.system.desktop) {
    HospitalApp.setDefaultTransitionNameDetail("slide");//fade
}
