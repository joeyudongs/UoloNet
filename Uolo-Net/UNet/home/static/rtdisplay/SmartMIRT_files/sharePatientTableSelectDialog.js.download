// create the template for the web service binding
var oPatientTableSelectItemTemplate = new sap.m.ColumnListItem({
	type : "Active",
	unread : false,
	cells : [
		new sap.m.Label({
			text : "{number}"
		}),  new sap.m.Label({
			text : "{DoctorName}"
		}),  new sap.m.Label({
			text : "{HospitalName}"
		})
	]
});

// filter function for the list search
var fnDoSearch = function (oEvent, bProductSearch) {
	var aFilters = [],
		sSearchValue = oEvent.getParameter("value"),
		itemsBinding = oEvent.getParameter("itemsBinding");

	// create the local filter to apply
	if(sSearchValue !== undefined && sSearchValue.length > 0) {		
		// create multi-field filter to allow search over all attributes
		aFilters.push(new sap.ui.model.Filter("DoctorName", sap.ui.model.FilterOperator.Contains , sSearchValue));
		aFilters.push(new sap.ui.model.Filter("HospitalName", sap.ui.model.FilterOperator.Contains , sSearchValue));
		// apply the filter to the bound items, and the Select Dialog will update
		itemsBinding.filter(new sap.ui.model.Filter(aFilters, false), "Application"); // filters connected with OR
	} else {
		// filter with empty array to reset filters
		itemsBinding.filter(aFilters);
	}
};


var oPatientTableSelectDialog = new sap.m.TableSelectDialog({
	contentWidth: "800px",
	title: "可选医生列表",
	noDataText: "无数据",
	multiSelect: true,
    search : fnDoSearch,
	liveChange: fnDoSearch,
	columns : [
		new sap.m.Column({
			width : "8%",
			hAlign : "Begin",
			header : new sap.m.Label({
				text : "序号"
			})
		}),
		new sap.m.Column({
			hAlign : "Center",
			popinDisplay : "Inline",
			header : new sap.m.Label({
				text : "医生名字"
			}),
			minScreenWidth : "Tablet",
			demandPopin : true
		}),
		new sap.m.Column({
			hAlign : "Center",
			popinDisplay : "Inline",
			header : new sap.m.Label({
				text : "所属医院"
			}),
			minScreenWidth : "Tablet",
			demandPopin : true
		})
	]
});

//确定 attach confirm listener
oPatientTableSelectDialog.attachConfirm(function (evt) {	
	var aSelectedItems = evt.getParameter("selectedItems");
	if (aSelectedItems) {
		//存放当前选择的医生
        var current_SelectDoctorArr = [];
		var sSelectedItems = "";
		//Loop through all selected items
		for (var i=0; i<aSelectedItems.length; i++) {
			//Get all the cells and pull back the first one which will be the name content
			var oCells = aSelectedItems[i].getCells();
			var oCell = oCells[0];
			var number = parseInt(oCell.getText());
			number = number-1;
			var RecId = current_AllDoctor_Patient.navigationTableSelectDialog[number].RecId;
			//存放当前选择的医生ID
	        current_SelectDoctorArr.push(RecId);
		};
		for (var i=0; i<current_SelectDoctorArr.length; i++) {			
			var DoctorRecId = current_SelectDoctorArr[i];
			//当前选择的患者列表数据
			for(var m=0;m<current_sharepatientRecIdarr.length;m++){
				var add = true;
				PatientRecId = current_sharepatientRecIdarr[m];
				//判断当前医生中否关联当前患者
				for (var n=0; n<current_AllUserRelation_Patient.length; n++) {
					if((current_AllUserRelation_Patient[n].DoctorID == DoctorRecId) && (current_AllUserRelation_Patient[n].PatientID == PatientRecId)){
						add = false;
					};
					if(current_AllUserRelation_Patient.length == n+1){
						if(add){
							var AddData = {};
				                AddData.DoctorID = DoctorRecId;
				                AddData.PatientID = PatientRecId;
							//向UserRelation表增加医生和患者关系数据
		                	PublicDataAccessModel.create("/UserRelation?token="+token, AddData, {success: AddUserRelationsuccess, error: AddUserRelationerror});		                	
						};
						break;
					};
				};
			};
		};
	};
});
// 取消 attach Cancel listener
oPatientTableSelectDialog.attachCancel(fnCancelDialog);

// cancel function to display a message
var fnCancelDialog = function (oEvent) {
	//sap.m.MessageBox.alert("Cancel Selected on " + (oEvent.oSource ? oEvent.oSource : oEvent.srcControl));
};

function AddUserRelationsuccess(bResult) {
     PublicDataAccessModel.refresh();
     PublicDataAccessModel.refreshMetadata();
     sap.m.MessageToast.show("数据分享成功！");
     //bResult 存放着增加成功的数据
     current_AllUserRelation_Patient.push({
            DoctorID: bResult.DoctorID,
			PatientID: bResult.HospitalID,
			RecId: bResult.RecId,
         
			CreatedBy: bResult.CreatedBy,
			CreatedDateTime: bResult.CreatedDateTime,
			LastModBy: bResult.LastModBy,
			LastModDateTime: bResult.LastModDateTime
     });
};
function AddUserRelationerror(bResult) {
    //console.log('---Add Doctor error -----');
    sap.m.MessageToast.show("数据分享失败！"+bResult.message);
};


