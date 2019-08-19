var hosColumns = [
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "序号"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "医院名称"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "联系电话"
        }),
        minScreenWidth : "XXLarge",
		popinDisplay : "Inline",
		demandPopin : true
    })
];

var hosTemplate = new sap.m.ColumnListItem({
    vAlign: "Middle",
    type : "Active",
    customData: {key:"{recid}"},
//    press : function(e) {
//	    	//get recid
//	        var key = this.getCustomData()[0].mProperties.key;
//	        isAdd =false;
//	        //获取对应地区data
//	        var hosData = PublicJsonModel.getData("hosTabModelData").hosTabModelData;
//	        for(var i in hosData){
//	            if(hosData[i].recid==key){
//	                console.log(hosData[i]);
//	                //估计在设置PublicJsonModel 的时候会把数据重新渲染
//					setHospitalTable(hosData[i].recid,
//						hosData[i].hospitalName,
//						hosData[i].hospitalCountry,
//						hosData[i].hospitalProvince,
//						hosData[i].hospitalCity,
//						hosData[i].hospitalInfo,
//						hosData[i].loginId,
//						hosData[i].loginPwd,
//						hosData[i].phone,
//						hosData[i].hospitalFax);
//					HospitalFormPage.setTitle("编辑医院");
//					setHospitalPlaceholder("修改医院名称...","修改详细地址...","修改医院联系电话...","修改医院传真...","修改用户名...","修改用户密码...");
//					
//					//提供编辑 默认显示
//					setDefaultSelect(hosData[i].hospitalCountry,hosData[i].hospitalProvince,hosData[i].hospitalCity);
//					
//					hosEditBtn.setVisible(true);
//			        hosSaveBtn.setVisible(false);
//			        //设置基本信息中各栏是否为可编辑状态
//                    setHospitalFormState(false);
//	                HospitalApp.to(HospitalFormPage);
//	            }
//	        }
//    },
    cells : [
        new sap.m.Text({
            text : "{number}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{hospitalName}",
            wrapping : false
        }),
        new sap.m.Text({
            text: "{phone}"
        })
    ]
});

var hospitalSelect = new sap.m.Select({
	items: [
		new sap.ui.core.Item({
			key: "hospitalName",
			text: "医院名称"
		}),
		new sap.ui.core.Item({
			key: "phone",
			text: "联系电话"
		})
	],
	change:function(e){
		tableSearch("hospitalTable",hospitalSelect.getSelectedKey(),hosSearchField.getValue());
	}
});
var hospitalTableTop = new sap.m.Toolbar({
	content: [
		hospitalSelect,
		hosSearchField = new sap.m.SearchField({
	    	width: "80%",
			search: function(event){
				tableSearch("hospitalTable",hospitalSelect.getSelectedKey(),this.getValue());
			},
			liveChange:function(event){
				tableSearch("hospitalTable",hospitalSelect.getSelectedKey(),this.getValue());
			}
		}),
		new sap.m.Button({
			icon: "sap-icon://sort",
			text: "排序",
			press : function () {
				tableViewSettingsFunc(hosTable,"hospitalTable");
			}
		})
	
//			HospitalRefreshBtn,
//			HospitalbusyCSS,
//			new sap.m.ToolbarSpacer()
	]
});

	
var hosTable = new sap.m.Table({
	mode:sap.m.ListMode.SingleSelectMaster,//启用后行hosTemplate 中的 press选择事件不启作用
	//mode:jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
//    growingThreshold: 11,
    growingScrollToLoad : true,
    columns : hosColumns,
    itemPress: function(oEv) {
    	console.debug("quanxian",current_userRole);
    	var oSelectedItem = hosTable.getSelectedItem();
        var current_spath = oSelectedItem.getBindingContext().getPath();//得到："/hosTabModelData/1"  1 为当前选择项目的数据序号
        var currentall = current_spath.split('/');
        var xh = parseInt(currentall[2]);
        var currentrecid = oSelectedItem.getBindingContext().oModel.oData.hosTabModelData[xh].recid;
		isAdd =false;
        //获取对应地区data
        var hosData = PublicJsonModel.getData("hosTabModelData").hosTabModelData;
        for(var i in hosData){
            if(hosData[i].recid == currentrecid){
                //估计在设置PublicJsonModel 的时候会把数据重新渲染
				setHospitalTable(hosData[i].recid,
					hosData[i].hospitalName,
					hosData[i].hospitalCountry,
					hosData[i].hospitalProvince,
					hosData[i].hospitalCity,
					hosData[i].hospitalInfo,
					hosData[i].loginId,
					hosData[i].loginPwd,
					hosData[i].phone,
					hosData[i].hospitalFax);
				HospitalFormPage.setTitle("医院信息");
				setHospitalPlaceholder("修改医院名称...","修改详细地址...","修改医院联系电话...","修改医院传真...","修改用户名...","修改用户密码...");
				
				//提供编辑 默认显示
				setDefaultSelect(hosData[i].hospitalCountry,hosData[i].hospitalProvince,hosData[i].hospitalCity);
				
				hosEditBtn.setVisible(true);
		        hosSaveBtn.setVisible(false);
		        //设置基本信息中各栏是否为可编辑状态
                setHospitalFormState(false);
                
                HospitalApp.to(HospitalFormPage);
            }
        }
     },
    "delete" : function(oEvent) {
        var oItem = oEvent.getParameter("listItem");
        sap.m.MessageBox.confirm("Are you sure to delete this record?", {
            onClose: function(sResult){
                if (sResult == sap.m.MessageBox.Action.CANCEL) {
                    return;
                }
                hosTable.removeItem(oItem);
                setTimeout(function() {
                    hosTable.focus();
                }, 0);
            }
        });
    }
});

hosTable.setGrowing(true);
hosTable.setModel(PublicJsonModel);
hosTable.bindItems("/hosTabModelData", hosTemplate);
hosTable.bindAggregation("items", "/hosTabModelData", hosTemplate);
            
var HospitalTablePage = new sap.m.Page({
    title : "医院列表",
    enableScrolling : true,
    showNavButton: jQuery.device.is.phone,
    navButtonText: "Back",
    navButtonPress: function() {
        HospitalApp.backDetail();
    },
    content:[
    	hospitalTableTop,
    	hosTable
    ],
    footer: new sap.m.Toolbar({})
});
HospitalTablePage.addStyleClass("patientMasterPage");