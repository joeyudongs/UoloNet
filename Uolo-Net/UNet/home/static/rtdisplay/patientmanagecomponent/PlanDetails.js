function setPlanDetails(values){
	console.debug("valuse = ",values);
	planPatientName.setText(values.PatientName);
	planMRN.setText(values.MRN);
	planName.setText(values.PlanName);
	planTrialName.setText(values.TrialName);
	planDateTime.setText(values.CreatedDateTime);
	planPhysicianPhysicist.setText(values.PhysicianPhysicist);
	planPinnacleID.setText(values.PinnacleID);
	planRevision.setText(values.Revision);
	planCreater.setText(values.PlanCreater);
	planPlanner.setText(values.Planner);
	planInstitution.setText(values.Institution);
	planLinks.setText(values.Links);
}

var planPatientName =new sap.m.Text();
var planMRN  = new sap.m.Text();
var planName = new sap.m.Text();
var planTrialName = new sap.m.Text();
var planDateTime = new sap.m.Text();
var planPhysicianPhysicist = new sap.m.Text();
var planPinnacleID = new sap.m.Text();
var planRevision = new sap.m.Text();
var planCreater=new sap.m.Text();
var planPlanner = new sap.m.Text();
var planInstitution = new sap.m.Text();
var planLinks = new sap.m.Text();
var PlanDetailsForm = new sap.ui.layout.form.SimpleForm({
    minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "计划详情"
        }),
        new sap.m.Label({
            text: '患者姓名',
            required : true
        }),
        planPatientName,
        new sap.m.Label({
            text: 'MRN',
            required : true
        }),
        planMRN,
        new sap.m.Label({
            text: '计划名',
            required : true
        }),
        planName,
        new sap.m.Label({
            text: '实验名'
        }),
        planTrialName,
        new sap.m.Label({
            text: '日期/时间'
        }),
        planDateTime,
        new sap.m.Label({
            text: '主治医师 / 医药师'
        }),
        planPhysicianPhysicist,
        new sap.m.Label({
            text: 'Pinnacle ID'
        }),
        planPinnacleID,
        new sap.m.Label({
            text: '修正'
        }),
        planRevision,
        new sap.m.Label({
            text: '上传者'
        }),
        planCreater,
        new sap.m.Label({
            text: '计划者'
        }),
        planPlanner,
        new sap.m.Label({
            text: '机构'
        }),
        planInstitution,
        new sap.m.Label({
            text: '下载链接'
        }),
        planLinks
    ]
});

var aboutForm = new sap.ui.layout.form.SimpleForm({
//    minWidth : 1024,
    maxContainerCols : 1,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "About"
        }),
        new sap.m.Label({
            text: 'Patient Name',
            required : true
        }),
        new sap.m.Input(),
        new sap.m.Label({
            text: 'Patient Name1',
            required : true
        }),
        new sap.m.Input(),
        new sap.m.Label({
            text: 'Patient Name2',
            required : true
        }),
        new sap.m.Input(),
        new sap.m.Label({
            text: 'Patient Name3',
            required : true
        }),
        new sap.m.Input()
    ]
});

var PlanDetailsPage = new sap.m.Page({
    title : "医疗计划",
    showNavButton: true,
    navButtonText: "Back",
    navButtonPress: function() {
        oPatientSplitApp.backDetail();
    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                PlanDetailsForm
//                aboutForm
            ]
        })
    ],
    footer: new sap.m.Bar({})
}).addStyleClass("patientMasterPage");