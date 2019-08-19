

//========================================新增==========================

function setMedicalRecordAdd(values){
	if(MedicalRecordTemp =="save"){
		medicalRecordTime.setDateValue(new Date());
	}else{
		medicalRecordTime.setDateValue(new Date(values.Medicaldate.replace(/-/,"/")));
	}
	medicalRecordCreator.setValue(values.DoctorID);
	medicalRecordContent.setValue(values.Content);
	//TODO
}

function setmedicalRecordEditable(flag){
	medicalRecordDicomId.setEditable(flag);
	medicalRecordTime.setEditable(flag);
	medicalRecordCreator.setEditable(flag);
	medicalRecordContent.setEditable(flag);
}
//这个ID?
var medicalRecordDicomId = new sap.m.Input({
//	placeholder: '请输入ID',
	type: sap.m.InputType.Text
	
});

 var medicalRecordTime = new sap.m.DateTimeInput({
//	width : "99%",
	type : "DateTime",
//	displayFormat : "long",
//	dateValue : new Date(2012, 4, 29, 19, 14, 10),
//	valueState : "Warning",
	change : function() {
//		console.log(dti4.toString(), dti4.getDateValue(), dti4.getValue());
	}
});

//var medicalRecordTime  = new sap.m.DatePicker({ valueFormat:"yyyy-MM-dd hh:mm:ss",displayFormat: "long"});

//这里显示默认的创建者
var medicalRecordCreator = new sap.m.Input({
	type: sap.m.InputType.Text
//	placeholder: '请输入病史记录创建者'
});
var medicalRecordContent = new sap.m.TextArea({
//	placeholder : "请添加病史内容",
	rows : 12,
//	maxLength: 255,
	width: "100%"
});
 
var MedicalRecordAddForm = new sap.ui.layout.form.SimpleForm({
    minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "病史信息录入"
        }),
        new sap.m.Label({
            text: '病史记录时间',
            required : true
        }),
        medicalRecordTime,
        new sap.m.Label({
            text: '病史记录创建者',
            required : true
        }),
        medicalRecordCreator,
        new sap.m.Label({
            text: '病史内容'
        }),
        medicalRecordContent
    ]
});

var medicalRecordRecId;
//病历记录 添加/修改
var MedicalRecordBtnCRUD = new sap.m.Button({
	icon : "sap-icon://edit",
	text:"编辑",
    press: function() {
		setmedicalRecordEditable(true);
		MedicalRecordBtnCRUD.setVisible(false);
		MedicalRecordBtnSave.setVisible(false);
		MedicalRecordBtnEditSave.setVisible(true);
    }
});
    
//修改后保存
var MedicalRecordBtnEditSave =new sap.m.Button({
		icon : "sap-icon://save",
		text:"保存",
		press: function() {
			if(medicalRecordContent.getValue() == ""){
				sap.m.MessageToast.show("请输入病历记录内容!");
				return;
			}
			if(medicalRecordTime.getValue() == ""){
				sap.m.MessageToast.show("请输入病史记录时间!");
				return;
			}
			if(medicalRecordCreator.getValue() == ""){
				sap.m.MessageToast.show("请输入病史记录创建者!");
				return;
			}
			if(currentSelectpatientRecId == null || currentSelectpatientRecId ==""){
				sap.m.MessageToast.show("未获取患者信息!");
				return;
			}
			console.debug(medicalRecordTime.getDateValue());
        	var medicalRecordData={};
        	medicalRecordData.Medicaldate = medicalRecordTime.getDateValue();
        	medicalRecordData.Content = medicalRecordContent.getValue();
        	medicalRecordData.DoctorID = medicalRecordCreator.getValue();
        	MedicalRecordTemp ="update";
        	updateMedicalRecord(medicalRecordData);
		}
});
//添加保存
var MedicalRecordBtnSave=new sap.m.Button({
		icon : "sap-icon://save",
		text:"保存",
		press: function() {
			if(medicalRecordContent.getValue() == ""){
				sap.m.MessageToast.show("请输入病历记录内容!");
				return;
			}
			if(medicalRecordTime.getValue() == ""){
				sap.m.MessageToast.show("请输入病史记录时间!");
				return;
			}
			if(medicalRecordCreator.getValue() == ""){
				sap.m.MessageToast.show("请输入病史记录创建者!");
				return;
			}
			if(currentSelectpatientRecId == null || currentSelectpatientRecId ==""){
				sap.m.MessageToast.show("未获取患者信息!");
				return;
			}
			var medicalRecordData={};
        	medicalRecordData.PatientID = currentSelectpatientRecId;
        	medicalRecordData.Medicaldate = medicalRecordTime.getDateValue();//
        	medicalRecordData.DoctorID = medicalRecordCreator.getValue();
        	medicalRecordData.Content = medicalRecordContent.getValue();
        	MedicalRecordTemp="save";
        	saveMedicalRecord(medicalRecordData);
		}
});

var MedicalRecordAddPage = new sap.m.Page({
    title : "患者病史详细信息",
//    showNavButton: true,
//    navButtonText: "Back",
//    navButtonPress: function() {
//        oPatientSplitApp.backDetail();
//    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                MedicalRecordAddForm
            ]
        })
    ],
    footer: new sap.m.Bar({
            contentRight: [
                MedicalRecordBtnCRUD,
                MedicalRecordBtnEditSave,
                MedicalRecordBtnSave,
		        new sap.m.Button({
		        	icon : "sap-icon://sys-cancel",
		        	text:"取消",
		            press: function(){
		            	oPatientSplitApp.backDetail();
		            }
		        })
            ]
    })
}).addStyleClass("patientMasterPage");

/**
 * 新增患者病历记录
 */
function saveMedicalRecord(medicalRecordData){
	PublicDataAccessModel.create("/MedicalRecord?token="+token,medicalRecordData, {success: medicalRecorOperationSuccess, error: medicalRecorOperationFail});
}
/**
 * 修改患者病历记录
 * */
function updateMedicalRecord(medicalRecordData){
	PublicDataAccessModel.update("/MedicalRecord('"+medicalRecordRecId+"')?token="+token, medicalRecordData, {success: medicalRecorOperationSuccess, error: medicalRecorOperationFail});
}


//病历记录所有回调方法处理
var MedicalRecordTemp = "";
var MedicalRecordData =[];
function medicalRecorOperationSuccess(result){
	switch(MedicalRecordTemp){
		case "query":
			console.debug("success",result);
			var datas = result.results;
		    if(datas instanceof Array){
		    	if(datas.length > 0){
		    		for(var i=0;i<datas.length;i++){
		    			//TODO
		    			datas[i].Medicaldate = getFomatDate(datas[i].Medicaldate);  		
		    		}
		    		MedicalRecordData = datas;
					PublicJsonModel.setProperty("/MedicalRecordModelTable",MedicalRecordData);//刷新当前数据页
		    	}
		    	else{
		    		PublicJsonModel.setProperty("/MedicalRecordModelTable",[]);
		    	}
		    }
		  break;
		case "save":
		  medicalRecordContent.setValue("");
		  sap.m.MessageToast.show("添加成功!");
		  result.Medicaldate = getFomatDate(result.Medicaldate); 
		  console.debug("success",result);
		  MedicalRecordData.push(result);
		  PublicJsonModel.setProperty("/MedicalRecordModelTable",MedicalRecordData);//刷新当前数据页
		  
		  break;
		case "update":
			setmedicalRecordEditable(false);
			MedicalRecordBtnCRUD.setVisible(true);
        	MedicalRecordBtnEditSave.setVisible(false);
			sap.m.MessageToast.show("修改成功!");
			//刷新病历记录列表
			for(var i=0;i< MedicalRecordData.length;i++){
				if(MedicalRecordData[i].RecId == medicalRecordRecId){
					MedicalRecordData[i].Content = medicalRecordContent.getValue();
					MedicalRecordData[i].DoctorID = medicalRecordCreator.getValue();
					MedicalRecordData[i].Medicaldate = getFomatDateDef(medicalRecordTime.getDateValue());
					PublicJsonModel.setProperty("/MedicalRecordModelTable",MedicalRecordData);
				}
			}
		  break;
		default:
		  sap.m.MessageToast.show("操作成功!");
		  console.debug("success",result);
	}
}

function medicalRecorOperationFail(result){
	console.debug("fail",result);
	switch(MedicalRecordTemp){
		case "query":
			sap.m.MessageToast.show("查询失败!"+result.message);
			break;
		case "save":
			sap.m.MessageToast.show("添加失败!"+result.message);
			break;
		case "update":
			sap.m.MessageToast.show("修改失败!"+result.message);
			break;
	}
	
}