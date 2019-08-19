/**
 * 搜索
 * tableValue:要操作的Table
 * selectValue:要过滤的值
 * SearchValue:搜索的值
 * 记得修改对应绑定对象
 * */
var tableSearch = function(tableValue,selectValue,SearchValue) {
	if(SearchValue !== undefined) {
		var filter = new sap.ui.model.Filter(selectValue, sap.ui.model.FilterOperator.Contains , SearchValue);
		switch(tableValue){
			case "hospitalTable":
				hosTable.getBinding("items").filter(filter);
				break;
			case "MedicalRecordTable":
				MedicalRecordTable.getBinding("items").filter(filter);
				break;
			case "patientTable":
				patientTableMaster.getBinding("items").filter(filter);
				break;
			case "odoctorTable":
				odoctorTable.getBinding("items").filter(filter);
				break;
		    default:
		    
			break; 
		}
	}
};

/**
 *排序 
 *要求:绑定的名称必须是items
 *tableBind:操作的对象
 *tableName:操作的对象名称
 */
//var tableSorters,tableFilters= [];
var tableViewSettingsFunc = function(tableBind,tableName){
	var tableViewSettingsDialog = new sap.m.ViewSettingsDialog({
		confirm: function (oEvent) {
			var p = oEvent.getParameters(),
				oSorter,
				oGrouper,
				aFilters,
				oCallback,
				tableSorters = [],
				tableFilters = [],
				i = 0;
	
			// 1) fetch and adjust grouper (set group order)
			if (p.groupItem) {
				oGrouper = p.groupItem.getCustomData()[0].getValue();
				if (oGrouper) {
					oGrouper.bDescending = p.groupDescending;
					tableSorters.push(oGrouper);
				}
			}
	
			// 2) fetch and adjust sorter (set sort order)
			if (p.sortItem) {
				oSorter = p.sortItem.getCustomData()[0].getValue();
				if (oSorter) {
					oSorter.bDescending = p.sortDescending;
					tableSorters.push(oSorter);
				}
			}
	
			// 3) filtering (either preset filters or standard/custom filters)
			if (p.presetFilterItem) {
				aFilters = p.presetFilterItem.getCustomData()[0].getValue();
				if (aFilters) {
					// the filter could be an array of filters or a single filter so we transform it to an array
					if (!Array.isArray(aFilters)) {
						aFilters = [aFilters];
					}
					tableFilters = tableFilters.concat(aFilters);
				}
			} else { // standard/custom filters
				for (; i < p.filterItems.length; i++) {
					if (p.filterItems[i] instanceof sap.m.ViewSettingsCustomItem) { // custom control filter
						oCallback = p.filterItems[i].getCustomData()[0].getValue();
						aFilters = oCallback.apply(this, [p.filterItems[i].getCustomControl()]);
						if (aFilters) {
							// the filter could be an array of filters or a single filter so we transform it to an array
							if (!Array.isArray(aFilters)) {
								aFilters = [aFilters];
							}
							tableFilters = tableFilters.concat(aFilters);
						}
					} else if (p.filterItems[i] instanceof sap.m.ViewSettingsItem) { // standard filter
						aFilters = p.filterItems[i].getCustomData()[0].getValue();
						if (aFilters) {
							// the filter could be an array of filters or a single filter so we transform it to an array
							if (!Array.isArray(aFilters)) {
								aFilters = [aFilters];
							}
							tableFilters = tableFilters.concat(aFilters);
						}
					}
				}
				tableBind.getBinding("items").sort(tableSorters);
				tableBind.getBinding("items").filter(tableFilters);
			}
		}
	});
	
	if(tableName !== undefined) {
		var tableJson = [];
		switch(tableName){
			case "hospitalTable":
				tableJson= [{key:"hospitalName",value:"医院名称"},{key:"phone",value:"联系电话"}];
				break;
			case "MedicalRecordTable":
				tableJson= [{key:"Content",value:"病史内容"},{key:"Medicaldate",value:"病史记录时间"},{key:"DoctorID",value:"病史创建者"}];
				break;
			case "patientTable":
				tableJson= [
					{key:"NativePlace",value:"肿瘤类型"},
					{key:"PatientName",value:"姓名"},
					{key:"Sex_",value:"性别"},
					{key:"Age_",value:"出生日期"},
					{key:"Phone",value:"联系电话"},
					{key:"Hospital",value:"医院"}
				];
				break;
			case "odoctorTable":
				tableJson= [{key:"DoctorName",value:"医生名称"},
							{key:"Sex",value:"医生性别"},
							{key:"DoctorLevel",value:"医生职称"},
							{key:"phone",value:"联系电话"},
							{key:"Hospital",value:"所属医院"}
				];
				break;
		    default:
		    
			break; 
		}
		if(tableJson.length > 0){
			setViewSettingsValue(tableViewSettingsDialog,tableJson);
			tableViewSettingsDialog.open();
		}
	}
}
var setViewSettingsValue = function(dialog,tableJson){
	for(var i=0; i< tableJson.length;i++){
		dialog.addSortItem(new sap.m.ViewSettingsItem({
			text: tableJson[i].value,
//			selected: true,
			customData: new sap.ui.core.CustomData({
				value: new sap.ui.model.Sorter(tableJson[i].key, false)
			})
		}));
	}
}


/**
 * 返回标准的日期格式
 * */
function getFomatDate(FomatValue){
	var baseDate = getDateObject(FomatValue);
	var  hours = baseDate.getHours() > 9 ? baseDate.getHours(): "0"+baseDate.getHours();
	var  minutes = baseDate.getMinutes() > 9 ? baseDate.getMinutes(): "0"+baseDate.getMinutes();
	return baseDate.getFullYear()+"-"+(baseDate.getMonth()+1)+"-"+baseDate.getDate()+" "+hours+":"+minutes;
}
function getDateObject(FomatValue){
	var rpl = FomatValue.replace(/\//g, '');
	var base = eval('new ' + rpl);
	var baseDate = new Date(base);
	return baseDate;
}
function getFomatDateDef(fomatValue){
	var baseDate =  new Date(fomatValue);
	var  hours = baseDate.getHours() > 9 ? baseDate.getHours(): "0"+baseDate.getHours();
	var  minutes = baseDate.getMinutes() > 9 ? baseDate.getMinutes(): "0"+baseDate.getMinutes();
	return baseDate.getFullYear()+"-"+(baseDate.getMonth()+1)+"-"+baseDate.getDate()+" "+hours+":"+minutes;
}