var PlanCommnetList = new sap.m.List({
});

var PlanListItemTemplate = new sap.m.FeedListItem({
	type: "{type}",
	icon : "{icon}",
	activeIcon : "{activeIcon}",
	text : "{Content}",//评价内容
	sender : "{Commentperson}",//评价人
	showIcon : "{showIcon}",
	senderActive: "{senderActive}",
	iconActive: "{iconActive}",
	info: "",
	timestamp : "{LastModDateTime}",//
	maxCharacters : 100
});

function bindPlanCommentListData(data, itemTemplate, list)
{
	// set the model to the list
	PublicJsonModel.setProperty("/plancommentData",data);
	
	list.setModel(PublicJsonModel);
	// bind Aggregation
	list.bindAggregation("items", "/plancommentData", itemTemplate);
}

jQuery.sap.require("sap.ui.core.IconPool");
var sURI = sap.ui.core.IconPool.getIconURI("personnel-view");

var oRerenderButton = new sap.m.Button({
	text : "提交",
	press : function (oEvent) {

	}
});
var resetButton = new sap.m.Button({
	text : "清空",
	press : function (oEvent) {
		
	}
});
		
var textAreaPlan =new sap.m.TextArea({
//		value : "请输入内容",
	placeholder:"发表您的评论~",
	width : "100%",
	rows : 4
});

function getInputToolbarContent() {
	return [
		new sap.m.ToolbarSpacer(),
		new sap.m.Button({
			text : "提交",
			type:sap.m.ButtonType.Accept,
			press: function(e){
				if(textAreaPlan.getValue().trim().length <=0){
					sap.m.MessageToast.show("内容不为空!");
					return;
				}
				//获取当前用户
				if(current_userchs == ""){
					sap.m.MessageToast.show("只有医生和患者才能评论!");
					return;
				}
				
				var planComment={};
				planComment.DoctorID = "doctor";//默认医生
				//用户角色
				if(current_userRole.length >0){
					for(var i =0;i < current_userRole.length;i++){
						if(current_userRole[i].RoleName =="Patient"){
							planComment.DoctorID = "patient";						
						}
					}
				}else{
					sap.m.MessageToast.show("无法识别的用户或重新登录!");
					return;
				}
				
				
				planComment.TreatmentPlanID=planCommentSubmitBtn;
				planComment.Content = textAreaPlan.getValue();
				planComment.PatientID = current_userchs;
				PublicDataAccessModel.create("/PlanComment?token="+token, planComment,{success: createPlanCommentSuccess, error: createPlanCommentFail});
//				console.debug("AllRoleData = ",AllRoleData);
//				console.debug("current_userchs = ",current_userchs);
//				console.debug("current_userRole = ",current_userRole);
//				console.debug("HospitalAdminRoleID = ",HospitalAdminRoleID);
//				console.debug("DoctorRoleID = ",DoctorRoleID);
//				console.debug("PatientRoleID = ",PatientRoleID);
			}
		}),
		new sap.m.Button({
			text : "清空",
			type:sap.m.ButtonType.Reject,
			press: function(e){
				textAreaPlan.setValue("");
			}
		})
	];
}

function createPlanCommentSuccess(result){
	sap.m.MessageToast.show("添加成功!");
	console.debug("原数据",planCommentData);
	console.debug("评论成功--==",result);
	
	
	//回炉重造
	var newComment = {};
	newComment.Commentperson = result.PatientID;
	newComment.Content = result.Content;
	newComment.LastModDateTime = getFomatDate(result.LastModDateTime);//需要处理
	newComment.RecId = result.RecId;
	newComment.TreatmentPlanID = result.TreatmentPlanID;
//	newComment.activeIcon = "sap-icon://begin";
	newComment.icon="sap-icon://"+(result.DoctorID == "patient"?"employee":"doctor");
	newComment.iconInset=false;
	newComment.press="Content pressed";
	newComment.senderActive=true;
	newComment.showIcon=true;
	newComment.type="Active";
	
		            
		            
	planCommentData.push(newComment);
	PublicJsonModel.setProperty("/plancommentData",planCommentData);
	
//	PlanCommnetList.bindAggregation("items", "/plancommentData", PlanListItemTemplate);
	
}
function createPlanCommentFail(){
	sap.m.MessageToast.show("添加失败!");
}
	
var PlanCommentPage = new sap.m.Page({
	title: "计划评论",
	showNavButton: true,
    navButtonText: "Back",
    navButtonPress: function() {
        oPatientSplitApp.backDetail();
    },
	footer: new sap.m.Bar({
//		contentRight:[oRerenderButton,resetButton]
	}),
	content : [
		new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerText : "发表评论",
			content : [
				textAreaPlan,
				new sap.m.Toolbar({
					showSeparators: "None",
					content : getInputToolbarContent()
				}).applyTagAndContextClassFor("header")
			]
		}),
//				new sap.m.Bar({
//					contentLeft: new sap.m.Text({text: "发表评论"})
//							    
//				}),
//				new sap.m.TextArea({
//					value : "%90 width TextArea:\n\n",
//					width : "100%",
//					rows : 4
//				}),
		new sap.m.Bar({
			contentLeft: new sap.m.Text({text: "历史评论列表"})
					    
		}), 
		PlanCommnetList	
	]
});
PlanCommentPage.addStyleClass("patientMasterPage");