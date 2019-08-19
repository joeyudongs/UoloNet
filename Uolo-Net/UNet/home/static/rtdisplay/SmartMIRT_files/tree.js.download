
//获取所有医院
function GetAllHospitalData(){
	hosTable.setBusy(true);
	PublicDataAccessModel.read("/Hospital?token="+token, {success: callbackInfo, error: failInfo});
}

//记录当前选择
var clickTreeKey = "";

var isAdd = true;
var hospitalTree = new sap.ui.commons.Tree({title:"Tree with custom styles", showHeader: false});

//all data
var FinalData=[];
//当前 data
var NodeData=[];

function callbackInfo(result) {
	hosTable.setBusy(false);
	//重置选择
//	hospitalTree.removeAllNodes();
//	createHospitalTree();
//    console.log(result.results);
//    var tempData=[];
	//获取打开默认数据
	//TODO 如果点击了列表那么就能取到对应的地区key 只对对应进行刷新.
	clickTreeKey ="";
    var datas = result.results;
    if(datas instanceof Array){
    	if(datas.length > 0){
    		FinalData = datas;
                 
    		var k=0;
    		var tt=[];
            for(var i=0;i< FinalData.length;i++){
            	var hsData = FinalData[i].Address_.split(".");
               tt[k] = {
               			number:k+1,
                		hospitalName:FinalData[i].HospitalName,
                		hospitalCountry:hsData[0],
                		hospitalProvince:hsData[1],
                		hospitalCity:hsData[2],
                		hospitalInfo:FinalData[i].Addressinfo,
                		loginId:FinalData[i].LoginID,
                		loginPwd:FinalData[i].LoginPwd,
                        phone: FinalData[i].Phone,
                        hospitalFax:FinalData[i].Fax,
                        recid:FinalData[i].RecId};
               k++;
             }
                 
    		PublicJsonModel.setData({hosTabModelData: tt});
    	}
    	else{
    		PublicJsonModel.setData({hosTabModelData: []});
    	}
    }
}

function failInfo(result) {
	hosTable.setBusy(false);
    if(result.response.statusCode == 500){
    	sap.m.MessageToast.show("获取数据失败!"+result.message);
    }
    PublicJsonModel.setData({hosTabModelData: []});
}

hospitalTree.removeAllNodes();
createHospitalTree();
function createHospitalTree(){
	var allNode = new sap.ui.commons.TreeNode({text: oBundle.getText("AllCountry_Province_City"), icon:"sap-icon://world",selectable:true,isSelected:true,selected:function(){
		GetAllHospitalData();
		HospitalApp.toDetail(HospitalTablePage);
	}});
	
	hospitalTree.addNode(allNode);
	for(var i=0; i< all_citys.length;i++ ){
	   var country = all_citys[i].name;
	   var country_key = all_citys[i].key;
	//   console.log("country ="+all_citys[i].key);	   
	   var countryNode = new sap.ui.commons.TreeNode({text: country, icon:"sap-icon://home",selectable:false});
	   hospitalTree.addNode(countryNode);
	    
	   for(var j=0;j< all_citys[i].sub.length;j++ ){
	       var province = all_citys[i].sub[j].name;
	       var province_key = all_citys[i].sub[j].key;
	       var provinceNode = new sap.ui.commons.TreeNode({text:province, icon:"sap-icon://addresses", expanded:false,selectable:false});
	//       console.log("province ="+all_citys[i].sub[j].key);
	       countryNode.addNode(provinceNode);
	       
	       for(var y=0; y< all_citys[i].sub[j].sub.length;y++){
	            var city = all_citys[i].sub[j].sub[y].name;
	            var city_key = all_citys[i].sub[j].sub[y].key;
	//           console.log("city="+city_key);
	           
	           var oNode45 = new sap.ui.commons.TreeNode({
	             text:city, 
	             icon:"sap-icon://flag",
	             customData: {key:country_key+"."+province_key+"."+city_key},
	             selected:function(){
	                var tempData=FinalData;
	                 var tt=[];
	                 var key = this.getCustomData()[0].mProperties.key;
	                 clickTreeKey  = key;
	                 var hsData = key.split(".");
	                 var k=0;
	                 for(var i in tempData){
	                    if(this.getCustomData()[0].mProperties.key==tempData[i].Address_){
	                       tt[k] = {number:k+1,
	                        		hospitalName:tempData[i].HospitalName,
	                        		hospitalCountry:hsData[0],
	                        		hospitalProvince:hsData[1],
	                        		hospitalCity:hsData[2],
	                        		hospitalInfo:tempData[i].Addressinfo,
	                        		loginId:tempData[i].LoginID,
	                        		loginPwd:tempData[i].LoginPwd,
	                                phone: tempData[i].Phone,
	                                hospitalFax:tempData[i].Fax,
	                                recid:tempData[i].RecId};
	                       k++;
	                    }
	                 }
	                NodeData = tt;
	                PublicJsonModel.setData({hosTabModelData: tt});
	                HospitalApp.toDetail(HospitalTablePage);
	             }
	           });
	           provinceNode.addNode(oNode45);
	       }
	   }
	}
}
