var MedicalRecordColumns = [
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "病史内容"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "病史记录时间"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "病史创建者"
        })
    })
];

var MedicalRecordTemplate = new sap.m.ColumnListItem({
	type: "Active",
    vAlign: "Middle",
    customData: {key:"{RecId}"},
    cells : [
        new sap.m.Text({
            text : "{Content}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{Medicaldate}",
            wrapping : false
        }),
        new sap.m.Text({
            text: "{DoctorID}"
        })
    ]
});

var MedicalRecordSelect = new sap.m.Select({
	items: [
		new sap.ui.core.Item({
			key: "Content",
			text: "病史内容"
		}),
		new sap.ui.core.Item({
			key: "Medicaldate",
			text: "病史记录时间"
		}),
		new sap.ui.core.Item({
			key: "DoctorID",
			text: "病史创建者"
		})
	],
	change:function(e){
		tableSearch("MedicalRecordTable",this.getSelectedKey(),mRecordSearchField.getValue());
	}
});

var MedicalRecordAdd = new sap.m.Button({
    icon: "sap-icon://add",
    text:"添加",
    press: function() {
    	//新增换成新增的控件
    	var values = {};
    	values.CreatedDateTime = new Date();
    	values.DoctorID = current_userchs;
    	values.Content = "";
    	setmedicalRecordEditable(true);
    	MedicalRecordBtnCRUD.setVisible(false);
    	MedicalRecordBtnEditSave.setVisible(false);
    	MedicalRecordBtnSave.setVisible(true);
    	
    	MedicalRecordTemp="save";
    	setMedicalRecordAdd(values);
		oPatientSplitApp.toDetail(MedicalRecordAddPage);
    }
});

var MedicalRecordTop = new sap.m.Toolbar({
	height: "auto",
	content : [
		new sap.m.Label({
			text : "病史列表"
		}),
		new sap.m.ToolbarSpacer(),
		MedicalRecordSelect,
        mRecordSearchField = new sap.m.SearchField({
        	width: "60%",
			search: function(event){
				tableSearch("MedicalRecordTable",MedicalRecordSelect.getSelectedKey(),this.getValue());
			},
			liveChange:function(event){
	            tableSearch("MedicalRecordTable",MedicalRecordSelect.getSelectedKey(),this.getValue());
			}
		}),
		new sap.m.Button({
				icon: "sap-icon://sort",
				text: "排序",
				press : function () {
					tableViewSettingsFunc(MedicalRecordTable,"MedicalRecordTable");
				}
			})
	]
});

var MedicalRecordTable = new sap.m.Table({
	mode:sap.m.ListMode.SingleSelectMaster,
    growingThreshold: 15,
    growingScrollToLoad : true,
    columns : MedicalRecordColumns,
    fixedLayout:true,
    itemPress : function(e) {
    	var oSelectedItem = MedicalRecordTable.getSelectedItem();
    	var key = oSelectedItem.getCustomData()[0].mProperties.key;
    	if(key == null){return;}
    	medicalRecordRecId = key;
    	//跳指定详情页
		 for(var i=0;i <MedicalRecordData.length;i++){
	    	 if( key == MedicalRecordData[i].RecId){
	    	 		MedicalRecordTemp="edit";
	    	 		setMedicalRecordAdd(MedicalRecordData[i]);
	    	 		setmedicalRecordEditable(false);
	    	 		
	    	 		MedicalRecordBtnCRUD.setVisible(true);
	    	 		MedicalRecordBtnEditSave.setVisible(false);
	    	 		MedicalRecordBtnSave.setVisible(false);
	    	 		oPatientSplitApp.toDetail(MedicalRecordAddPage);
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
                    planTable.focus();
                }, 0);
            }
        });
    }
//    itemPress : function(e) {
//        sap.m.MessageToast.show("item is pressed");
//        console.debug("e = ",e);
//    }
});

function bindMedicalRecordTable(){
	MedicalRecordTable.setGrowing(true);
	MedicalRecordTable.setModel(PublicJsonModel);
	//hosTable.bindColumns("/hosColumnsData",hosColumns);
	MedicalRecordTable.bindItems("/MedicalRecordModelTable", MedicalRecordTemplate);
	//添加排序
	MedicalRecordTable.bindAggregation("items", "/MedicalRecordModelTable", MedicalRecordTemplate);
}


/**
 * 获取对应患者的病历记录
 * */
function getMedicalRecord(){
	//TODO
	console.debug("获取对应患者的病历记录id",currentSelectpatientRecId);
	MedicalRecordTemp= "query";
	if(token != "" || currentSelectpatientRecId != ""){
		PublicDataAccessModel.read("/MedicalRecord?token="+token+"&$filter=PatientID eq '"+ currentSelectpatientRecId +"'",
		{success: medicalRecorOperationSuccess, error: medicalRecorOperationFail});
	}else{
		throw "token || currentSelectpatientRecId NOT NULL!";
	}
	
}
