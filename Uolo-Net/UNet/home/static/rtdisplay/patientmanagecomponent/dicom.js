
function getDicom(){
	//currentSelectpatientRecId
	PublicDataAccessModel.read("/Dicom?token="+token+"&$filter=PatientID eq '"+ currentSelectpatientRecId +"'", {success: readDicomSuccess, error: readDicomFail});
}
var DicomData=[];
function readDicomSuccess(result){
	console.debug("success",result);
	var datas = result.results;
    if(datas instanceof Array){
    	console.debug("datas.length = ",datas.length);
    	if(datas.length > 0){
    		for(var i=0;i<datas.length;i++){
    			var fileName = datas[i].DownloadAddress.split(/\//g);
    			if(fileName.length > 0){
    				datas[i].DownloadAddress = fileName[fileName.length-1];
    			}
    			datas[i].CreatedDateTime = getFomatDate(datas[i].CreatedDateTime);  		
    		}
    		DicomData = datas;
    		
    		console.debug("com on~",PlanData);
    		console.debug("PublicJsonModel on~",PublicJsonModel);
			PublicJsonModel.setProperty("/DicomModelTable",DicomData);//刷新当前数据页
    	}
    	else{
    		PublicJsonModel.setProperty("/DicomModelTable",[]);
    	}
    }
	
}
function readDicomFail(result){
	console.debug("fail",result);
	
}

var DicomColumns = [
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "文件名"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "创建时间"
        })
    })
];

var DicomTemplate = new sap.m.ColumnListItem({
	type: "Active",
    vAlign: "Middle",
    customData: {key:"{RecId}"},
//    detailPress: function() {
//        setTimeout(function() {
//            sap.m.MessageToast.show("detail is pressed");
//        }, 10);
//    },
    cells : [
        new sap.m.Text({
            text : "{DownloadAddress}",
            wrapping : false
        }),
        new sap.m.Text({
            text : "{CreatedDateTime}",
            wrapping : false
        })
//        new sap.m.Button({
//            text : "浏览",
//            customData: {key:"{BrowseAddress}"},
//            press : function(e) {
//            	var key = this.getCustomData()[0].mProperties.key;
//            	setCTDir(key);
//            	getROINames();
//                getDoseNames();
//                getImageSetHeader();
//                getCTInfo(0);
//                initialCTViewControls();
//            	oPatientSplitApp.toDetail(oPatientDetailCTPage);
//            }
//        })
    ]
});
var DicomBusyDialog =new sap.m.BusyDialog({text:'正在加载...', title: '提示',customIcon: 'sync.png'}); 
var DicomTable = new sap.m.Table({
	mode:sap.m.ListMode.SingleSelectMaster,
    growingThreshold: 15,
    growingScrollToLoad : true,
    columns : DicomColumns,
//    selectionChange : function(e) {
//        sap.m.MessageToast.show("selection is changed");
//    },
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
    },
    itemPress : function(e) {
    	
    	DicomBusyDialog.open();
    	
    	setTimeout(function() {
    		try{
    			var oSelectedItem = DicomTable.getSelectedItem();
		        var current_spath = oSelectedItem.getBindingContext().getPath();//得到："/DicomModelTable/1"  1 为当前选择项目的数据序号
		        var currentall = current_spath.split('/');
		        var xh = parseInt(currentall[2]);
		        var key = oSelectedItem.getBindingContext().oModel.oData.DicomModelTable[xh].BrowseAddress;
		    	
		    	setCTDir(key);
		    	getROINames();
		        getDoseNames();
		        getImageSetHeader();
		        getCTInfo(0);
		        initialCTViewControls();
		        oPatientSplitApp.toDetail(oPatientDetailCTPage);
    		}catch(e){
    			DicomBusyDialog.close();
//    			DicomTable.setBusy(false);
    		}
		},500);
        
    }
});

DicomTable.setGrowing(true);
DicomTable.setModel(PublicJsonModel);
//hosTable.bindColumns("/hosColumnsData",hosColumns);
DicomTable.bindItems("/DicomModelTable", DicomTemplate);



