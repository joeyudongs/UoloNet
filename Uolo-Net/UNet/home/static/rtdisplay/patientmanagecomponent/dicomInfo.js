function setdicomInfoAdd(values){

}
var dicomInfoDicomId = new sap.m.Text({
            required : true
        });

var dicomInfoUploadTime  = new sap.m.DatePicker({
//				value : "{birthday}",
				valueFormat : "yyyy-MM-dd",
				displayFormat : "yyyy.MM.dd",
				placeholder: '请选择记录时间'
			});
var dicomInfoUploader = new sap.m.Text({
            required : true
        });
var dicomInfoDownload = new sap.m.Input({
        });
        
var dicomInfoAddForm = new sap.ui.layout.form.SimpleForm({
    minWidth : 1024,
    maxContainerCols : 2,
    editable: true,
    content : [
        new sap.ui.core.Title({ // this starts a new group
            text: "Dicom 上传"
        }),
        new sap.m.Label({
            text: 'Dicom ID',
            required : true
        }),
        dicomInfoDicomId,
        new sap.m.Label({
            text: 'Dicom上传时间',
            required : true
        }),
        dicomInfoUploadTime,
        new sap.m.Label({
            text: 'Dicom上传者',
            required : true
        }),
        dicomInfoUploader,
        new sap.m.Label({
            text: 'Dicom 下载地址'
        }),
        dicomInfoDownload
    ]
});


var DicomInfoPage = new sap.m.Page({
    title : "Dicom 上传",
    showNavButton: true,
    navButtonText: "Back",
    navButtonPress: function() {
        oPatientSplitApp.backDetail();
    },
    content: [
        new sap.m.VBox({
            width : "100%",
            items : [
                dicomInfoAddForm
            ]
        })
    ],
    footer: new sap.m.Bar({
    	contentRight: [
                new sap.m.Button({
		            text: "保存"
		        }),
		        new sap.m.Button({
		            text: "放弃"
		        })
            ]
    })
}).addStyleClass("sapUiFioriObjectPage");