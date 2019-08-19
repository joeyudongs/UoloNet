
//var odoctorData = [
//		{key: "1", DoctorName: "张三一", Sex: "男",DoctorLevel: "主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "2", DoctorName: "李一", Sex: "男",DoctorLevel: "主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "3", DoctorName: "王一", Sex: "男",DoctorLevel: "主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "4", DoctorName: "王二", Sex: "男",DoctorLevel: "副主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "5", DoctorName: "王二", Sex: "男",DoctorLevel: "副主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "6", DoctorName: "李一", Sex: "女",DoctorLevel: "副主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "7", DoctorName: "李四", Sex: "女",DoctorLevel: "副主任医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "8", DoctorName: "李一", Sex: "女",DoctorLevel: "主治医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "9", DoctorName: "李四", Sex: "女",DoctorLevel: "主治医师",phone: "0731-89762510",money: "编辑图标"},
//        {key: "10",DoctorName: "李一", Sex: "女",DoctorLevel: "医师",phone: "0731-89762510",money: "编辑图标"}
//	];
//	
var temptableData=[];
//for(var i=0;i<odoctorData.length;i++){
//     temptableData[i] ={number:i+1,
//                        DoctorName:odoctorData[i].DoctorName,
//                        Sex:odoctorData[i].Sex,
//                        DoctorLevel:odoctorData[i].DoctorLevel,
//                        phone:odoctorData[i].phone,
//                        money:odoctorData[i].money};
//};

//var odoctortableModel = new sap.ui.model.json.JSONModel(); // 用 PublicJsonModel 替换了
//当前选择的医生ID
var currentSelectdoctorRecId;
//当前选择的医生是否是医院管理员
var currentSelectdoctorIsAdmin = false;
//当前用户名密码
var currentSelectdoctorPwd = "";

var doctorAdd = true;

var aColumns = [
//    new sap.m.Column({
//        width:"10%",
//        hAlign: "Center",
//        header : new sap.m.Label({
//            text : "序号"
//        })
//    }),
    new sap.m.Column({
        width:"15%",
        hAlign: "Center",
        header : new sap.m.Label({
            text : "账户"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "医生名称"
        })
    }),
    new sap.m.Column({
    	width:"10%",
        hAlign: "Center",
        header : new sap.m.Label({
            text : "医生性别"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "医生职称"
        })
    }),
    new sap.m.Column({
    	width:"15%",
        hAlign: "Center",
        header : new sap.m.Label({
            text : "联系电话"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "所属医院"
        })
    })
];

var oColumnTemplate = new sap.m.ColumnListItem({
    vAlign: "Middle",
    type : "Active",
    customData: {key:"{RecId}"},
    press: function(e){
	     currentSelectdoctorRecId = this.getCustomData()[0].mProperties.key;
	     currentSelectdoctorIsAdmin = false;
	     //AllUserRoleData;//所有用户与角色关系数据
	     for(var n=0;n<AllUserRoleData.length;n++){
	     	if(AllUserRoleData[n].UserID == currentSelectdoctorRecId && AllUserRoleData[n].RoleID == HospitalAdminRoleID){
	     		currentSelectdoctorIsAdmin = true;
	     		break;
	     	};
	     };
	     
		 doctorAdd = false;            	
         oSplitApp.to(add_doctor);
         add_doctor.setTitle("医生详细信息");
         //填充的医生信息
         setTableSimpleForm();
         //设置基本信息中各栏是否为可编辑状态
         setTableSimpleFormState(false);
         
         oEditButtondoctor.setVisible(true);
         oSaveButtonDoctor.setVisible(false);
	},
    cells : [
//        new sap.m.Text({
//            text : "{number}",
//            wrapping : false
//        }),
        new sap.m.Text({
            text : "{LoginID}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{DoctorName}",
            wrapping : false
        }),
         new sap.m.Text({
            text : "{Sex}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{DoctorLevel}",
            wrapping : false
        }),
        new sap.m.Text({
            text: "{phone}"
        }),
        new sap.m.Text({
            text: "{Hospital}"
        })
    ]
});

var odoctorTable = new sap.m.Table({
	mode:sap.m.ListMode.SingleSelectMaster,//启用后行oColumnTemplate 中的 press选择事件不启作用
	//mode:jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
    growingThreshold:11,
    growingScrollToLoad:true,
    columns:aColumns,
    itemPress: function(oEv) {
    	var oSelectedItem = odoctorTable.getSelectedItem();
     	//console.log(oEv);
     	//console.log(oSelectedItem); 	
     	//console.log(oSelectedItem.getBindingContext());
        //console.log(oSelectedItem.getBindingContext().getPath());
        //console.log(oSelectedItem.getBindingContext().oModel.oData);
        var current_spath = oSelectedItem.getBindingContext().getPath();//得到："/modelData/1"  1 为当前选择项目的数据序号
        var currentall = current_spath.split('/');
        var xh = parseInt(currentall[2]);
        currentSelectdoctorRecId = oSelectedItem.getBindingContext().oModel.oData.modelData[xh].RecId;
        currentSelectdoctorIsAdmin = false;
	    //AllUserRoleData;//所有用户与角色关系数据
	    for(var n=0;n<AllUserRoleData.length;n++){
	     	if(AllUserRoleData[n].UserID == currentSelectdoctorRecId && AllUserRoleData[n].RoleID == HospitalAdminRoleID){
	     		currentSelectdoctorIsAdmin = true;
	     		break;
	     	};
	    };
        
		doctorAdd = false;
         
        add_doctor.setTitle("医生详细信息");
        //填充的医生信息
        setTableSimpleForm();
        //设置基本信息中各栏是否为可编辑状态
        setTableSimpleFormState(false);
         
        oEditButtondoctor.setVisible(true);
        oSaveButtonDoctor.setVisible(false);
         
        oSplitApp.to(add_doctor);
     }
});

//填充医生显示表格
function setdoctortable(){	
	for(var i=0;i<temptableData.length;i++){
		temptableData.remove(i);//删除下标为 i 的元素
		i--;
	}	
	for(var i=0;i<doctorAlllist.length;i++){
		var Level = oBundle.getText(doctorAlllist[i].DoctorLevel);//"DOC_oNodeRootChild_DoctorLevel_AA";//主任医师
		var sex = oBundle.getText(doctorAlllist[i].Sex_);//"DOC_docotrAdd_Sex_A";//男
		
		var HospitalName="";
		if(hospitallist != null){
			for(var m=0;m<hospitallist.length;m++){
				HospitalName = hospitallist[m].RecId;
				if(doctorAlllist[i].HospitalID == hospitallist[m].RecId){
					HospitalName = hospitallist[m].HospitalName;
					break;
				};
			};
		};
     	temptableData[i] ={number:i+1,
     	                    LoginID:doctorAlllist[i].LoginID,
	                        DoctorName:doctorAlllist[i].DoctorName,
	                        Sex:sex,
	                        DoctorLevel:Level,
	                        phone:doctorAlllist[i].Phone,
	                        money:"编辑图标",
	                        Hospital:HospitalName,
	                        RecId: doctorAlllist[i].RecId
                        };
    };
    
	PublicJsonModel.setData({modelData: temptableData});
	
	odoctorTable.setGrowing(true);
	odoctorTable.setModel(PublicJsonModel);
	odoctorTable.bindItems("/modelData", oColumnTemplate);
	odoctorTable.bindAggregation("items", "/modelData", oColumnTemplate);
	
	odoctorTable.getItems().forEach(function(oItem) {
		oItem.setProperty("type", "Active", true);
	});
	odoctorTable.rerender();
}

var doctorSelect = new sap.m.Select({
	items: [
	    new sap.ui.core.Item({
			key: "LoginID",
			text: "医生账户"
		}),
		new sap.ui.core.Item({
			key: "DoctorName",
			text: "医生名称"
		}),
		new sap.ui.core.Item({
			key: "Sex",
			text: "医生性别"
		})
		,
		new sap.ui.core.Item({
			key: "DoctorLevel",
			text: "医生职称"
		})
		,
		new sap.ui.core.Item({
			key: "phone",
			text: "联系电话"
		})
		,
		new sap.ui.core.Item({
			key: "Hospital",
			text: "所属医院"
		})
	],
	change:function(e){
		tableSearch("odoctorTable",this.getSelectedKey(),doctorSearchField.getValue());
	}
});

//刷新==========================
function getdoctorLastUpdated() {
    return  new Date().toLocaleTimeString();
}
var RefreshdoctorAllData = false;
var Refreshdoctor = new sap.m.PullToRefresh({
        //description: getdoctorLastUpdated(),
	    width:"50px",
        refresh: function(){
            setTimeout(function(){
            	RefreshdoctorAllData = true;
                Refreshdoctor.hide();
	            if(usertype == "0"){
					//获取医生数据,填充医生选择框
				    GetdoctorAllData();
				}else{
					//获取指定医院所有医生数据,填充医生显示表格
					GetdoctorAllDataFromHospitalID(current_hospitalID);
				}				
                Refreshdoctor.setDescription(getdoctorLastUpdated());                
            }, 2000);
        }
});
//==========================

var doctorTableTop = new sap.m.Toolbar({
	height: "auto",
	content : [
		doctorSelect,
        doctorSearchField = new sap.m.SearchField({
        	width: "90%",
			search: function(event){
				tableSearch("odoctorTable",doctorSelect.getSelectedKey(),this.getValue());
			},
			liveChange:function(event){
	            tableSearch("odoctorTable",doctorSelect.getSelectedKey(),this.getValue());
			}
		}),
		new sap.m.ToolbarSpacer(),
		new sap.m.Button({
				icon: "sap-icon://sort",
				text: "排序",
				press : function () {
					tableViewSettingsFunc(odoctorTable,"odoctorTable");
				}
			}),
		Refreshdoctor
	]
});

var oDeleteDoctorButton = new sap.m.Button({
	text:"删除",
	icon:"sap-icon://delete",
	//tooltip : "",
	press: function() {
		odoctorTable.setMode(sap.m.ListMode.MultiSelect);
		var doctorItems = odoctorTable.getItems();
		for (var i = 0; i < doctorItems.length; i++) {
			odoctorTable.setSelectedItem(doctorItems[i], false);
		}
		oDeleteDoctorButton.setVisible(false);
		oDeleteDoctorConfirmButton.setVisible(true);
		oDeleteDoctorCancelButton.setVisible(true);
	}
});//删除医生

var oDeleteDoctorConfirmButton = new sap.m.Button({
	text:"确认",
	icon:"sap-icon://accept",
	//tooltip : "Delete Confirm",
	press: function() {	
		var oSelectedItems = odoctorTable.getSelectedItems();
		for (var i = 0; i < oSelectedItems.length; i++) {
			var current_spath = oSelectedItems[i].getBindingContext().getPath();//得到："/modelData/1"  1 为当前选择项目的数据序号
			var currentall = current_spath.split('/');
			var xh = parseInt(currentall[2]);
			var doctorRecId = oSelectedItems[i].getBindingContext().oModel.oData.modelData[xh].RecId;
			var doctorData = {};
			doctorData.IsDeleted = "1";
			PublicDataAccessModel.update("/RTUser('"+doctorRecId+"')?token="+token, doctorData, {success: DeleteDoctorSuccess(doctorRecId), error: DeleteDoctorError});
		}
		odoctorTable.setMode(sap.m.ListMode.SingleSelectMaster);
		
		oDeleteDoctorButton.setVisible(true);
		oDeleteDoctorConfirmButton.setVisible(false);
		oDeleteDoctorCancelButton.setVisible(false);
		
	    //填充医生显示表格
        setdoctortable();
	}
});//删除医生

//删除患者成功
function DeleteDoctorSuccess(doctorRecId) {
	PublicDataAccessModel.refresh();
	PublicDataAccessModel.refreshMetadata();

	for (var i = 0; i < doctorAllDatalist.length; i++) {
		if (doctorAllDatalist[i].RecId == doctorRecId) {
			//doctorAllDatalist.splice(i, 1);
			doctorAllDatalist.remove(i);//删除下标为 i 的元素
			i--;
			break;
		}
	};

	for (var i = 0; i < doctorAlllist.length; i++) {
		if (doctorAlllist[i].RecId == doctorRecId) {
			//doctorAlllist.navigationtable.splice(i, 1);
			doctorAlllist.remove(i);//删除下标为 i 的元素
			i--;
			break;
		};
	};
	sap.m.MessageToast.show("删除医生成功！");
	//存当前医生总数据
	current_doctorCount--;
};

//删除患者失败
function DeleteDoctorError(bResult) {
	//console.log('---Add Doctor error -----');
	sap.m.MessageToast.show("删除医生失败！"+bResult.message);
};

var oDeleteDoctorCancelButton = new sap.m.Button({
	text:"取消",
	icon:"sap-icon://decline",
	//tooltip : "Delete Cancel",
	press: function() {
		odoctorTable.setMode(sap.m.ListMode.SingleSelectMaster);
		oDeleteDoctorButton.setVisible(true);
		oDeleteDoctorConfirmButton.setVisible(false);
		oDeleteDoctorCancelButton.setVisible(false);
	}
});//删除医生
oDeleteDoctorConfirmButton.setVisible(false);
oDeleteDoctorCancelButton.setVisible(false);

var doctorTablePage = new sap.m.Page({
    title : "医生列表",
    enableScrolling : true,
    showNavButton: jQuery.device.is.phone,
    navButtonText: "Back",
    navButtonPress: function() {
        oSplitApp.backDetail();
    },
    content : [doctorTableTop,odoctorTable],
    footer: new sap.m.Toolbar({
        content: [
            new sap.m.ToolbarSpacer(),
        	oDeleteDoctorButton,
        	oDeleteDoctorConfirmButton,
        	oDeleteDoctorCancelButton
        ]
    })
});
doctorTablePage.addStyleClass("patientMasterPage");


//重新初始化医生列表页显示状态
function iniDoctorTable() {
		odoctorTable.setMode(sap.m.ListMode.SingleSelectMaster);
		oDeleteDoctorButton.setVisible(true);
		oDeleteDoctorConfirmButton.setVisible(false);
		oDeleteDoctorCancelButton.setVisible(false);
};