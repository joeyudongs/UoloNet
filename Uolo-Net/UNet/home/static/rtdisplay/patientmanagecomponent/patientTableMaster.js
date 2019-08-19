var patientTableMasterColumns = [
    new sap.m.Column({
    	width:"5%",
        hAlign: "Center",
        header : new sap.m.Label({
            text : "序号"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "肿瘤类型"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "姓名"
        })
    }),
    new sap.m.Column({
    	width:"5%",
        hAlign: "Center",
        header : new sap.m.Label({
            text : "性别"
        }),
        minScreenWidth : "XXLarge",
		popinDisplay : "Inline",
		demandPopin : true
    }),
     new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "出生日期"
        }),
        minScreenWidth : "XXLarge",
		popinDisplay : "Inline",
		demandPopin : true
    }),
//    new sap.m.Column({
//    	width:"5%",
//        hAlign: "Center",
//        header : new sap.m.Label({
//            text : "国籍"
//        }),
//        minScreenWidth : "XXLarge",
//		popinDisplay : "Inline",
//		demandPopin : true
//    }),
//     new sap.m.Column({
//        hAlign: "Center",
//        header : new sap.m.Label({
//            text : "联系地址"
//        }),
//        minScreenWidth : "XXLarge",
//		popinDisplay : "Inline",
//		demandPopin : true
//    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "联系电话"
        }),
        minScreenWidth : "XXLarge",
		popinDisplay : "Inline",
		demandPopin : true
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "医院"
        }),
        minScreenWidth : "XXLarge",
		popinDisplay : "Inline",
		demandPopin : true
    })
];

var patientTableMasterTemplate = new sap.m.ColumnListItem({
    vAlign: "Middle",
    type : "Active",
    customData: {key:"{RecId}"},
    press : function(e) {    	
        currentSelectpatientRecId = this.getCustomData()[0].mProperties.key;
        patientAdd =false;
				
        //生成当前选择的患者id患者列表
        initialisePatientList(currentSelectpatientRecId);
	    //根据当前选择的患者id,填充患者基本信息中各栏数据
	    setPatientBasicInfoFromID();
	    //获取指定患者的治疗计划数据
        GetTreatmentPlanFromPatientID();
        
        getDicom();
        //TODO 点击详情的时候要重新填数据
        
        //绑定并填充病历记录数据
        bindMedicalRecordTable();
        getMedicalRecord();
        
        //设置基本信息中各栏是否为可编辑状态
        setPatientBasicInfoFromState(false);
//        oSavePatientBasicInfoButton.setVisible(false);
//        oEidtPatientBasicInfoButton.setVisible(true);
        
         //oPatientSplitApp.to(oPatientDetailPage);                
        oPatientApp.to(oPatientChildPage);                
		//oPatientChildPage.removeAllContent();
		//oPatientChildPage.addContent(oPatientMasterPage);
    },
    cells : [
        new sap.m.Text({
            text : "{number}",
            wrapping : false
        }),
        new sap.m.Text({
            text: "{NativePlace}"
        }),
        new sap.m.Text({
            text : "{PatientName}",
            wrapping : false
        }),
         new sap.m.Text({
            text : "{Sex_}",
            wrapping : false
        }),
        new sap.m.Text({
            text: "{Age_}",
            wrapping : false
        }),
//        new sap.m.Text({
//            text: "{Country}",
//            wrapping : false
//        }),
//         new sap.m.Text({
//            text : "{Address}",
//            wrapping : false
//        }),
        new sap.m.Text({
            text: "{Phone}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{Hospital}",
            wrapping : false
        })
    ]
});

var patientTableSelect = new sap.m.Select({
	items: [
		new sap.ui.core.Item({
			key: "NativePlace",
			text: "肿瘤类型"
		}),
		new sap.ui.core.Item({
			key: "PatientName",
			text: "姓名"
		}),
		new sap.ui.core.Item({
			key: "Sex_",
			text: "性别"
		}),
		new sap.ui.core.Item({
			key: "Age_",
			text: "出生日期"
		}),
//		new sap.ui.core.Item({
//			key: "Country",
//			text: "国籍"
//		}),
//		new sap.ui.core.Item({
//			key: "Address",
//			text: "联系地址"
//		}),
		new sap.ui.core.Item({
			key: "Phone",
			text: "联系电话"
		}),
		new sap.ui.core.Item({
			key: "Hospital",
			text: "医院"
		})
	],
	change:function(e){
		tableSearch("patientTable",this.getSelectedKey(),patientSearchField.getValue());
	}
});

var patientTableMasterTop = new sap.m.Toolbar({
	height: "auto",
	content : [
		new sap.m.ToolbarSpacer(),
		patientTableSelect,
        patientSearchField =  new sap.m.SearchField({
        	width: "90%",
			search: function(event){
				tableSearch("patientTable",patientTableSelect.getSelectedKey(),this.getValue());
			},
			liveChange:function(event){
				tableSearch("patientTable",patientTableSelect.getSelectedKey(),this.getValue());
			}
		}),
		new sap.m.Button({
			icon: "sap-icon://sort",
			text: "排序",
			press : function () {
				tableViewSettingsFunc(patientTableMaster,"patientTable");
			}
		})
	]
});

var patientTableMaster = new sap.m.Table({
	mode : sap.m.ListMode.SingleSelectMaster,//启用后行patientTableMasterTemplate中的 press选择事件不启作用
	//mode:jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
    growingThreshold: 10,
    growingScrollToLoad : true,
    columns : patientTableMasterColumns,   
    itemPress: function(oEv) {
     	var oSelectedItem = patientTableMaster.getSelectedItem();
     	//console.log(oEv);
     	//console.log(oSelectedItem); 	
     	//console.log(oSelectedItem.getBindingContext());
        //console.log(oSelectedItem.getBindingContext().getPath());
        //console.log(oSelectedItem.getBindingContext().oModel.oData);
        var current_spath = oSelectedItem.getBindingContext().getPath();//得到："/navigationtable/1"  1 为当前选择项目的数据序号
        var currentall = current_spath.split('/');
        var xh = parseInt(currentall[2]);
        currentSelectpatientRecId = oSelectedItem.getBindingContext().oModel.oData.navigationtable[xh].RecId;     	

        patientAdd =false;

        //生成当前选择的患者id患者列表
        initialisePatientList(currentSelectpatientRecId);
	    //根据当前选择的患者id,填充患者基本信息中各栏数据
	    setPatientBasicInfoFromID();
	    //获取指定患者的治疗计划数据
        GetTreatmentPlanFromPatientID();
        
        getDicom();
        //TODO 点击详情的时候要重新填数据
        
        //绑定并填充病历记录数据
        bindMedicalRecordTable();
        getMedicalRecord();
        
        //设置基本信息中各栏是否为可编辑状态
        setPatientBasicInfoFromState(false);
        
//        oSavePatientBasicInfoButton.setVisible(false);
//        oEidtPatientBasicInfoButton.setVisible(true);
        
        oPatientApp.to(oPatientChildPage);
        //oPatientSplitApp.to(oPatientDetailPage);
		//oPatientChildPage.removeAllContent();
     }
});


//向患者表格中填充数据
function iniPatientTableMasterData() {
	//TODO
	PublicJsonModel.setProperty("/navigationtable",patientTableData.navigationtable);
	patientTableMaster.setGrowing(true);
	patientTableMaster.setModel(PublicJsonModel);
	patientTableMaster.bindItems("/navigationtable", patientTableMasterTemplate);
	
	//搜索
	patientTableMaster.bindAggregation("items", "/navigationtable", patientTableMasterTemplate);
};

//重新初始化患者列表页显示状态
function iniPatientTableMasterstate() {
	patientTableMaster.setMode(sap.m.ListMode.SingleSelectMaster);		
	masterPageFooterBar.removeContentRight(oShareConfirmButton);
	masterPageFooterBar.removeContentRight(oShareCancelButton);
	masterPageFooterBar.removeContentRight(oDeleteConfirmButton);
	masterPageFooterBar.removeContentRight(oDeleteCancelButton);
	
	masterPageFooterBar.addContentRight(oSharePatientButton);
	masterPageFooterBar.addContentRight(oDeletePatientButton);
};

