//获取指定患者的治疗计划数据
function GetTreatmentPlanFromPatientID(){
	PublicDataAccessModel.read("/TreatmentPlan?token="+token+"&$filter=PatientID eq '"+ currentSelectpatientRecId +"'", {success: readPlanSuccess, error: readPlanFail});
}
var planCommentSubmitBtn="";
var planCommentData = [];
var PlanData=[];
function readPlanSuccess(result){
	var datas = result.results;
	console.debug("治疗计划=",datas);
	if(datas.length > 0){
		for(var i=0;i<datas.length;i++){
			datas[i].CreatedDateTime = getFomatDate(datas[i].CreatedDateTime);
			var cell = planTemplate.getCells()[3];
			if(datas[i].Links.length <= 0){
				cell.setEnabled(false);
			}
		}
		PlanData = datas;
        //刷新数据
		PublicJsonModel.setProperty("/planModelData",PlanData);
	}
	else{
		//刷新数据
		PublicJsonModel.setProperty("/planModelData",[])
	}
}
function readPlanFail(result){
	console.debug("fail",result);
}

function planAddSuccess(result){
	console.log("success");
}

function planAddFail(result){
	console.log("fail");
}
var planColumns = [
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "计划名"
        })
    }),
//    new sap.m.Column({
//        hAlign: "Center",
//        header : new sap.m.Label({
//            text : "主治医师/医药师"
//        })
//    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "上传时间"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "上传者"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "下载"
        })
    }),
    new sap.m.Column({
        hAlign: "Center",
        header : new sap.m.Label({
            text : "评论"
        })
    })
];

var planDownload = new sap.m.Button({
        icon : "sap-icon://download",
        customData: {key:"{Links}"},
//        	  text:"Download",
//              target: true,
//    		  href:"https://physics.mdanderson.edu/plandb/main.php?area=plan_list&search_terms=304353"
        press: function(e){
        	var parameter = "dcmdownload?token="+token+"&dicom=";
        	var link = parameter+this.getCustomData()[0].mProperties.key;
        	console.debug(link);
        	window.open(link);
        }
    });
var planTemplate = new sap.m.ColumnListItem({
    vAlign: "Middle",
    type : "Active",
    cells : [
        new sap.m.Text({
            text : "{PlanName}",
            wrapping : false
        }),
//        new sap.m.Text({
//            text : "{PhysicianPhysicist}",
//            wrapping : false
//        }),
        new sap.m.Text({
            text : "{CreatedDateTime}",
            wrapping : false
        }),
        new sap.m.Text({//PlanCreater
            text: "{PlanCreater}"
        }),
        planDownload,
        new sap.m.Button({
            icon : "sap-icon://comment",
            customData: {key:"{RecId}"},
            press : function(e) {
            	var key = this.getCustomData()[0].mProperties.key;
            	planCommentSubmitBtn= key;
            	PublicDataAccessModel.read("/PlanComment?token="+token+"&$filter=TreatmentPlanID eq '"+ key +"' &$orderby=CreatedDateTime asc", {success: readPlanCommentSuccess, error: readPlanCommentFail});
            }
        })
    ]
});

 
function readPlanCommentSuccess(result){
	if(result.results instanceof Array){
    	if(result.results.length > 0){
    		for(var i=0;i<result.results.length;i++){
				var fomatDate = getFomatDate(result.results[i].LastModDateTime);
				var identity ="doctor";
				if(result.results[i].DoctorID == "patient"){
					identity ="employee";
				}
				
				planCommentData[i] = {
					TreatmentPlanID: result.results[i].TreatmentPlanID,
					Content: result.results[i].Content,		
//					NativePlace: result.results[i].NativePlace,		          
		            Commentperson:result.results[i].PatientID,
					RecId: result.results[i].RecId,
					LastModDateTime: fomatDate,
		            icon : "sap-icon://"+identity,
		            iconInset : false,
//		            activeIcon : "sap-icon://begin",
		            showIcon : true,
		            type : "Active",		           
		            senderActive:true,
		            press: "Content pressed"
				};
			};
    	};
    };
    bindPlanCommentListData(planCommentData, PlanListItemTemplate, PlanCommnetList);
	oPatientSplitApp.toDetail(PlanCommentPage);
}
function readCommentpersonSuccess(result){
   var aaa =	result.results;
}

function readPlanCommentFail(result){
	console.debug("fail = ",result);
}

var planTable = new sap.m.Table({
	mode:sap.m.ListMode.SingleSelectMaster,//启用后行planTemplate 中的 press选择事件不启作用
	//mode:jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
    growingThreshold: 15,
    growingScrollToLoad : true,
    columns : planColumns,
    itemPress: function(oEv) {
    	var oSelectedItem = planTable.getSelectedItem();
     	//console.log(oEv);
     	//console.log(oSelectedItem); 	
     	//console.log(oSelectedItem.getBindingContext());
        //console.log(oSelectedItem.getBindingContext().getPath());
        //console.log(oSelectedItem.getBindingContext().oModel.oData);
        var current_spath = oSelectedItem.getBindingContext().getPath();//得到："/planModelData/1"  1 为当前选择项目的数据序号
        var currentall = current_spath.split('/');
        var xh = parseInt(currentall[2]);
        var currentRecId = oSelectedItem.getBindingContext().oModel.oData.planModelData[xh].RecId;		
     	for(var i in PlanData){
    	 	if( currentRecId == PlanData[i].RecId){
    	 		setPlanDetails(PlanData[i]);
    	 		oPatientSplitApp.toDetail(PlanDetailsPage);
    	 	}
         }
     },
    "delete" : function(oEvent) {
        var oItem = oEvent.getParameter("listItem");
        sap.m.MessageBox.confirm("Are you sure to delete this record?", {
            onClose: function(sResult){
                if (sResult == sap.m.MessageBox.Action.CANCEL) {
                    return;
                };
                hosTable.removeItem(oItem);
                setTimeout(function() {
                    planTable.focus();
                }, 0);
            }
        });
    }
});
	planTable.setGrowing(true);
	planTable.setModel(PublicJsonModel);
	planTable.bindItems("/planModelData", planTemplate);

