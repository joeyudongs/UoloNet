var hospitalCrudName = "";
//从根据医院名称取对应医院的信息
//类似table进行绑定
var hospitalRectid;
function setRecid(rid){
	this.hospitalRectid = rid;
}
function getRecid(){
	return hospitalRectid;
}
//设置提示信息
function setHospitalPlaceholder(hName,hInfo,hPhone,hFax,hUser,hPwd){
	hostpitalName.setPlaceholder(hName);
	hospitalAddressInfo.setPlaceholder(hInfo);
	hospitalPhone.setPlaceholder(hPhone);
	hospitalFax.setPlaceholder(hFax);
	hospitalUser.setPlaceholder(hUser);
	hospitalPwd.setPlaceholder(hPwd);
}
//设置编辑内容
function setHospitalTable(hKey,hName,hCtry,hPvce,hCity,hInfo,hUser,hPwd,hPhone,hFax){
	setRecid(hKey);
	hostpitalName.setValue(hName);
    CountrySelect.setSelectedKey(hCtry);
    ProvinceSelect.setSelectedKey(hPvce);
    CitySelect.setSelectedKey(hCity);
    hospitalAddressInfo.setValue(hInfo);
    hospitalUser.setValue(hUser);
    hospitalPwd.setValue(hPwd);
    hospitalPhone.setValue(hPhone);
    hospitalFax.setValue(hFax);
}
var hostpitalName = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:70
    });
          
var hospitalAddressInfo = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:100
    });
var hospitalPhone = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:25
    });
    
var hospitalFax = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:25
    });
    
var hospitalUser = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:50
    });
var hospitalPwd = new sap.m.Input({
        type: sap.m.InputType.Text,
        maxLength:50
    });
var hosEditTemplate=[
    new sap.ui.core.Title({
        text: "医院信息"
    }),
    new sap.m.Label({
        text: '医院名称',
        required : true
    }),
    hostpitalName,
    new sap.m.Label({
        text: '医院地址',
        required : true
    }),
    new sap.m.HBox({
        items : [
            CountrySelect,
            ProvinceSelect,
            CitySelect
        ]
    }),
    new sap.m.Label({
        text: ''
    }),
    hospitalAddressInfo,
    //TODO 暂时禁用
//    new sap.m.Label({
//    	text:'医院管理者用户名',
//    	required : true
//    }),
//    hospitalUser,
//    new sap.m.Label({
//    	text:'医院管理者密码',
//    	required : true
//    }),
//    hospitalPwd,
    new sap.m.Label({
        text: '医院联系电话',
        required : true
    }),
    hospitalPhone,
    new sap.m.Label({
        text: '医院联系传真',
        required : true
    }),
    hospitalFax
//    new sap.m.Label({
//        text: '医院照片'
//    }),
//    new sap.m.Text({
//        text: '附件上传控件'
//    })
];
var HospitalForm = new sap.ui.layout.form.SimpleForm({
    minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : hosEditTemplate
});
if(jQuery.device.is.phone){
	HospitalForm.addStyleClass("phoneStyle");
}

var editHospitalTemp={};

var doctorId = "";

//添加保存按钮
var hosSaveBtn = new sap.m.Button({
    icon : "sap-icon://save",
    text:"保存",
    press: function(e){
    	//console.log(getRecid());
        if(hostpitalName.getValue() ==""){
            sap.m.MessageToast.show("请输入医院名称!");
            return;
        }
        if(CountrySelect.getSelectedItem().getText() == "请选择国家"){
            sap.m.MessageToast.show("请选择国家!");
            return;
        }
        if(ProvinceSelect.getSelectedItem().getText() == "请选择省/市"){
            sap.m.MessageToast.show("请选择省/市!");
            return;
        }
        if(CitySelect.getSelectedItem().getText() == "请选择城市"){
            sap.m.MessageToast.show("请选择城市!");
            return;
        }
        if(hospitalAddressInfo.getValue() ==""){
            sap.m.MessageToast.show("请输入详细地址!");
            return;
        }
        //TODO 暂时禁用
//        if(hospitalUser.getValue() ==""){
//        	sap.m.MessageToast.show("请输入用户名!");
//            return;
//        }
//        if(hospitalPwd.getValue() ==""){
//        	sap.m.MessageToast.show("请输入用户密码!");
//            return;
//        }
        if(hospitalPhone.getValue() ==""){
        	sap.m.MessageToast.show("请输入电话!");
            return;
        }
        if(hospitalFax.getValue() ==""){
        	sap.m.MessageToast.show("请输入传真!");
            return;
        }
        if (!verifyTelNumber(hospitalPhone.getValue())) {
            sap.m.MessageToast.show("请填写正确的电话号码!");
            return;
        }
        if (!verifyTelNumber(hospitalFax.getValue())) {
            sap.m.MessageToast.show("请填写正确的传真!");
            return;
        }
        
        var hospital ={};
        hospital.HospitalName = hostpitalName.getValue();
        hospital.Address_ = CountrySelect.getSelectedItem().getKey()+"."+
                            ProvinceSelect.getSelectedItem().getKey()+"."+
                            CitySelect.getSelectedItem().getKey();
        hospital.Addressinfo = hospitalAddressInfo.getValue();
//        hospital.LoginID = hospitalUser.getValue();
//        hospital.LoginPwd = hospitalPwd.getValue();
        hospital.Phone = hospitalPhone.getValue();
        hospital.Fax = hospitalFax.getValue();


        if(isAdd){
        	//医院添加
        	//TODO 暂时禁用
//        	var doctor = {};
//        	doctor.LoginID  = hospitalUser.getValue();
//        	doctor.LoginPwd  = hospitalPwd.getValue();
//        	operateDoctor(doctor);
//        	if(doctorId != ""){
//        		hospital.DoctorID = doctorId;
        		hospitalCrudName = "Hospital_Save";
        		PublicDataAccessModel.create("/Hospital?token="+token, hospital, {success: hospitalSuccess, error: hospitalFail});
//        	}
        }else{
        	//医院修改
        	editHospitalTemp = hospital;
        	hospitalCrudName="Hospital_Edit";
        	PublicDataAccessModel.update("/Hospital('"+getRecid()+"')?token="+token, hospital, {success: hospitalSuccess, error: hospitalFail});
        }
    }
});

//设置基本信息中各栏是否为可编辑状态
function setHospitalFormState(State){
	hostpitalName.setEnabled(State);	
    CountrySelect.setEnabled(State);
    ProvinceSelect.setEnabled(State);
    CitySelect.setEnabled(State);
    hospitalAddressInfo.setEnabled(State);
    hospitalUser.setEnabled(State);
    hospitalPwd.setEnabled(State);
    hospitalPhone.setEnabled(State);
    hospitalFax.setEnabled(State);
};

var hosCancleBut = new sap.m.Button({icon : "sap-icon://sys-cancel",text:"取消"});
	hosCancleBut.attachPress(function(){
		HospitalApp.backDetail();
	});

var hosEditBtn = new sap.m.Button({icon : "sap-icon://edit",text:"编辑"});
	hosEditBtn.attachPress(function(){
		HospitalFormPage.setTitle("编辑医院");
		
		 hosEditBtn.setVisible(false);
         hosSaveBtn.setVisible(true);
         //设置基本信息中各栏是否为可编辑状态
         setHospitalFormState(true);
	});

var HospitalFormPage = new sap.m.Page({
//    showNavButton: true,
//    navButtonText: "Back",
//    navButtonPress: function() {                
//        HospitalApp.backDetail(); 
//    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                HospitalForm
            ]
        })
    ],
    footer: new sap.m.Toolbar({
            content: [
            	new sap.m.ToolbarSpacer(),
                hosEditBtn,
                hosSaveBtn,
                hosCancleBut
            ]
    })
}).addStyleClass("patientMasterPage");

//对doctor表进行操作
function operateDoctor(rtUserdata){
	hospitalCrudName = "RTUser";
	PublicDataAccessModel.create("/RTUser?token="+token, rtUserdata, {success: hospitalSuccess, error: hospitalFail});
}

//数据的操作
function hospitalSuccess(result){
	switch(hospitalCrudName){
		case "RTUser":
			 if(result){
		     	doctorId = result.RecId;
				var User_Roledata={};
				for(var n=0;n<AllRoleData.length;n++){
		     		if(AllRoleData[n].Name == "HospitalAdmin"){
		     			User_Roledata.RoleID = AllRoleData[n].RecId;
		     			break;
		     		};
		     	};
		     	User_Roledata.UserID = doctorId;
		     	hospitalCrudName = "User_Role";
				PublicDataAccessModel.create("/User_Role?token="+token, User_Roledata, {success: hospitalSuccess, error: hospitalFail});
		     }
			break;
		case "User_Role":
			console.debug("User_Role success");
			break;
		case "Hospital_Save":
			sap.m.MessageToast.show("数据保存成功!");
			setHospitalTable("","","","","","","","");
		    // 对数据进行刷新
		    FinalData.push(result);
		    doctorId = "";
		    //成功后进行数据刷新
		//    if(clickTreeKey != ""){
		    	//console.log(clickTreeKey);
				var hosData = PublicJsonModel.getData("hosTabModelData").hosTabModelData;
				var hosKey = result.Address_.split(".");
				var addData = {
					number:hosData.length+1,
		    		hospitalName: result.HospitalName,
		    		hospitalCountry: hosKey[0],
		    		hospitalProvince: hosKey[1],
		    		hospitalCity: hosKey[2],
		    		hospitalInfo: result.Addressinfo,
		    		loginId: result.LoginID,
		    		loginPwd: result.LoginPwd,
		            phone:  result.Phone,
		            hospitalFax: result.Fax,
		            recid: result.RecId
				};
				hosData.push(addData);
		        PublicJsonModel.setData({hosTabModelData: hosData});//刷新当前数据页
		//    }
		    //存当前医院总数据
		    current_hospitalCount++;
			break;
		case "Hospital_Edit":
			HospitalFormPage.setTitle("医院信息");
			sap.m.MessageToast.show("数据保存成功!");
		    //TODO 对doctor表进行修改
		    console.debug("修改==",FinalData);
		    //doctor表操作 如果用户名和密码没有改变不做修改
		    //TODO 暂时禁用
//		    for(var j in FinalData){
//		    	if(FinalData[j].RecId == getRecid()){
//		    		if(hospitalPwd.getValue() != FinalData[j].LoginPwd || hospitalUser.getValue() != FinalData[j].LoginID){
//		    			var doctor = {};
//			    		doctor.LoginID = hospitalUser.getValue();
//			    		doctor.LoginPwd = hospitalPwd.getValue();
//			    		var recid = FinalData[j].DoctorID;
//			    		hospitalCrudName="RTUser_Edit";
//			    		PublicDataAccessModel.update("/RTUser('"+recid+"')?token="+token, doctor, {success: hospitalSuccess, error: hospitalFail});
//		    		};
//		    	};
//		    };    
		    //整体数据的更新
		    for(var i in FinalData){
		    	if(FinalData[i].RecId == getRecid()){
		    		FinalData[i].HospitalName = editHospitalTemp.HospitalName;
		    		FinalData[i].Address_ = editHospitalTemp.Address_;
		    		FinalData[i].Addressinfo = editHospitalTemp.Addressinfo;
		    		FinalData[i].LoginID = editHospitalTemp.LoginID;
		    		FinalData[i].LoginPwd = editHospitalTemp.LoginPwd;
		    		FinalData[i].Phone = editHospitalTemp.Phone;
		    		FinalData[i].Fax = editHospitalTemp.Fax;
		    	};
		    };
		    
		    //如果不是点击树触发的修改事件,那么对全局数据进行刷新
		    if(clickTreeKey !=""){
		      //树节点数据更新    
				for(var j in NodeData){
			 		if(NodeData[j].recid == getRecid()){
			 			var hosKey = editHospitalTemp.Address_.split(".");
			 			//如果地方变了 当前记录需要删除
			 			//console.log("原始city="+NodeData[j].hospitalCity );
			 			//console.log("现在city="+hosKey[2] );
			 			//console.log(NodeData);
			 			//如果修改了地址
			 			if(NodeData[j].hospitalCountry != hosKey[0] || NodeData[j].hospitalProvince !=hosKey[1] || NodeData[j].hospitalCity != hosKey[2]){
			 				NodeData.remove(j);
			 				//当删除一条记录时,序号会发生变化
			 				var k=0;
			 				var tt=[];
			 				
			                for(var y=0 ;y<NodeData.length; y++){
			                	
			                		tt[k] = {
			                   			number:k+1,
			                    		hospitalName: NodeData[y].hospitalName,
			                    		hospitalCountry: NodeData[y].hospitalCountry,
			                    		hospitalProvince: NodeData[y].hospitalProvince,
			                    		hospitalCity: NodeData[y].hospitalCity,
			                    		hospitalInfo: NodeData[y].hospitalInfo,
			                    		loginId: NodeData[y].loginId,
			                    		loginPwd: NodeData[y].loginPwd,
			                            phone:  NodeData[y].phone,
			                            hospitalFax: NodeData[y].hospitalFax,
			//                            money:"编辑图标",
			                            recid: NodeData[y].recid
			                   		};
			                   		k++;
			                };
			                PublicJsonModel.setData({hosTabModelData: tt});//刷新当前数据页
			 			}else{
				 			NodeData[j].hospitalCountry =  hosKey[0];
				 			NodeData[j].hospitalProvince =hosKey[1];
				 			NodeData[j].hospitalCity = hosKey[2];
				 			NodeData[j].hospitalName =editHospitalTemp.HospitalName;
				 			NodeData[j].hospitalInfo = editHospitalTemp.Addressinfo;
				 			NodeData[j].loginId = editHospitalTemp.LoginID;
			    			NodeData[j].loginPwd = editHospitalTemp.LoginPwd;
				 			NodeData[j].phone = editHospitalTemp.Phone;
				 			NodeData[j].hospitalFax = editHospitalTemp.Fax;
				 			PublicJsonModel.setData({hosTabModelData: NodeData});//刷新当前数据页
			 			};
			 		};	
				 };
			}else{
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
			 setHospitalFormState(false);
			 hosEditBtn.setVisible(true);
		     hosSaveBtn.setVisible(false);
			break;
		case "RTUser_Edit":
			break;
	}
	hospitalCrudName ="";
}
function hospitalFail(result){
	sap.m.MessageToast.show("操作失败!");
	console.log(result);
}