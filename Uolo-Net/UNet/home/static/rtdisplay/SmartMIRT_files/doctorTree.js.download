//医生职称树==========================
//var docortype = [
//    {Id: "D01", Name: "主任医师  Professor"},
//    {Id: "D02", Name: "副主任医师  Associate Professor"},
//    {Id: "D03", Name: "主治医师  Attending Doctor"},
//    {Id: "D04", Name: "医师  Doctor"}
//];
//var docors = [
//    {Id: "y01", Name: "李一",pID:"FD76FDD1F4404BD38104FB4D7D37425E"},
//    {Id: "y02", Name: "王一",pID:"FD76FDD1F4404BD38104FB4D7D37425E"},
//    {Id: "y02", Name: "李二",pID:"B8B63227902D4C1FA3417C7B16E19EE3"},
//    {Id: "y02", Name: "王二",pID:"B8B63227902D4C1FA3417C7B16E19EE3"},
//    {Id: "y03", Name: "李三",pID:"4CE47844567346A7AF129339E5570733"},
//    {Id: "y02", Name: "王三",pID:"4CE47844567346A7AF129339E5570733"},
//    {Id: "y04", Name: "李四",pID:"3819278104234B71AA697D309CA7D627"},
//    {Id: "y02", Name: "王四",pID:"3819278104234B71AA697D309CA7D627"}
//];


var currentSelectdoctorLevel = "All";
var odoctorTree = new sap.ui.commons.Tree({title:"Tree with custom styles", showHeader: false});

var oNodeRootDoctor = new sap.ui.commons.TreeNode({text:oBundle.getText("DOC_oNodeRoot_text"), //"职称"
                                             customData: [{key:"ID",value:"Root"},{key:"Type",value:"0"}],
                                             icon:"sap-icon://activity-individual"
                    });
odoctorTree.addNode(oNodeRootDoctor);


function addtreechild(){
	oNodeRootDoctor.removeAllNodes();
    var oNodeRootChildAll = new sap.ui.commons.TreeNode({text:oBundle.getText("DOC_oNodeRootChildAll_text"), //"全部"
                                                          icon:"sap-icon://doctor",
                                                          customData: [{key:"Level",value:"All"},{key:"Type",value:"1"}],
                                                          expanded:false,
                                                          selected:function(){
                                                             //console.log(this.getCustomData()[0].mProperties.value);
                                                             //console.log(this.getCustomData()[1].mProperties.value);
                                                          	 currentSelectdoctorLevel = "All";
                                                             oSplitApp.toDetail(doctorTablePage);
                                                             GetdoctorfilterData(this.getCustomData()[0].mProperties.value);
                                                          }
                               });
      oNodeRootChildAll.setIsSelected(true);
//    for(var n=0;n<doctorAlllist.length;n++){    	
//         var oNodeRootChild_Child = new sap.ui.commons.TreeNode({text:doctorAlllist[n].DoctorName, 
//                                                  icon:"sap-icon://customer",
//                                                  customData: [{key:"ID",value:doctorAlllist[n].DoctorName},{key:"Type",value:"2"}],
//                                                  expanded:false,
//                                                  selected:function(){
//                                                     console.log(this.getCustomData());
//                                                     console.log(this.getCustomData()[0].mProperties.value);
//                                                     console.log(this.getCustomData()[1].mProperties.value);
//                                                     oSplitApp.toDetail(add_doctor);
//                                                  }
//                                                 });
//        oNodeRootChildAll.addNode(oNodeRootChild_Child);
//        oNodeRootChildAll.setIsSelected(true);
//    };
    oNodeRootDoctor.addNode(oNodeRootChildAll);
    //doctorLevellist
    for(var i=0; i < doctorLevellist.length; i++){
    	var levelname = oBundle.getText(doctorLevellist[i].DoctorLevel)
        var oNodeRootChild = new sap.ui.commons.TreeNode({text:levelname, 
                                             icon:"sap-icon://doctor",
                                             //customData: [{key:"ID",value:doctorLevellist[i].RecId},{key:"Type",value:"1"}],
                                             customData: [{key:"Level",value:doctorLevellist[i].DoctorLevel},{key:"Type",value:"1"}],
                                             expanded:false,
                                             selected:function(){
                                                    //console.log(this.getCustomData()[0].mProperties.value);
                                                    //console.log(this.getCustomData()[1].mProperties.value);
                                             	    currentSelectdoctorLevel = this.getCustomData()[0].mProperties.value;
                                                    oSplitApp.toDetail(doctorTablePage);
                                                    GetdoctorfilterData(this.getCustomData()[0].mProperties.value);
                                            }
                             });
//        for(var n=0;n<doctorAlllist.length;n++){
//            if(doctorLevellist[i].DoctorLevel == doctorAlllist[n].DoctorLevel){
//                 var oNodeRootChild_Child = new sap.ui.commons.TreeNode({text:doctorAlllist[n].DoctorName, 
//                                                          icon:"sap-icon://customer",
//                                                          customData: [{key:"ID",value:doctorAlllist[n].RecId},{key:"Type",value:"2"}],
//                                                          expanded:false,
//                                                          selected:function(){
//                                                             console.log(this.getCustomData());
//                                                             console.log(this.getCustomData()[0].mProperties.value);
//                                                             console.log(this.getCustomData()[1].mProperties.value);
//                                                             oSplitApp.toDetail(add_doctor);
//                                                          }
//                                                         });
//                oNodeRootChild.addNode(oNodeRootChild_Child);
//            }
//        };
        oNodeRootDoctor.addNode(oNodeRootChild);
    }
};

//==========================