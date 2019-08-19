jQuery.sap.require("sap.m.MessageToast");
var PublicJsonModel = new sap.ui.model.json.JSONModel();

//数据库操作需要
var token;

////数据访问对象
//var PublicDataAccessModel = new sap.ui.model.odata.ODataModel("/proxy/http/192.168.9.19:8080/bods.svc",true,"","",null,true,true,true,"",true);
//发布时用
var PublicDataAccessModel = new sap.ui.model.odata.ODataModel("/bods.svc",true,"","",null,true,true,true,"",true);

var loginTemp =0;//系统登录标识
var current_userchs="";
var current_userid="";
//var current_usertype = "";//0系统管理员  1医院管理员  2医生  3 患者 用current_userRole 替代了
var current_token = "";
var current_hospitalID="";
var current_userRole=[];//当用户前角色ID   原名称： current_roleid
var AllRoleData;//所有角色数据 SysAdmin 系统管理员  HospitalAdmin 医院管理员  Doctor 医生  Patient 患者 
var AllUserRoleData;//所有用户与角色关系数据
var HospitalAdminRoleID = "";//医院管理员角色ID
var DoctorRoleID = "";//医生角色ID
var PatientRoleID = "";//患者 角色ID

////登录验证
//var loginurl = "/proxy/http/192.168.9.19:8080/rtlogin";
////服务器址
//var serverurl = "/proxy/http/192.168.9.19:8080";

//发布时用
//登录验证
var loginurl = "/rtlogin";
//服务器址
var serverurl = "";

////登录验证
//var loginurl = "/proxy/http/192.168.9.63:10080/rtlogin";
////服务器址
//var serverurl = "/proxy/http/192.168.9.63:10080/bods.svc/Hospital";

//国家、省、市 地址统一编码
var all_citys = [
    {key:10,"name":oBundle.getText("CountryKey_10"),"sub":[
            {key:1000,name:oBundle.getText("Province_1000"),sub:[{key:100000,name:oBundle.getText("City_100000")}]},
            {key:1001,name:oBundle.getText("Province_1001"),sub:[{key:100100,name:oBundle.getText("City_100100")}]},
            {key:1002,name:oBundle.getText("Province_1002"),sub:[{key:100200,name:oBundle.getText("City_100200")}]},
            {key:1003,name:oBundle.getText("Province_1003"),sub:[{key:100300,name:oBundle.getText("City_100300")}]},            
            {key:1004,name:oBundle.getText("Province_1004"),sub:[{key:100400,name:oBundle.getText("City_100400")}]},
            {key:1005,name:oBundle.getText("Province_1005"),sub:[{key:100500,name:oBundle.getText("City_100500")}]},
            {key:1006,name:oBundle.getText("Province_1006"),sub:[{key:100600,name:oBundle.getText("City_100600")}]},
            {key:1007,name:oBundle.getText("Province_1007"),sub:[{key:100700,name:oBundle.getText("City_100700")}]},
            {key:1008,name:oBundle.getText("Province_1008"),sub:[{key:100800,name:oBundle.getText("City_100800")}]},            
            {key:1009,name:oBundle.getText("Province_1009"),sub:[{key:100900,name:oBundle.getText("City_100900")}]},
            {key:1010,name:oBundle.getText("Province_1010"),sub:[{key:101000,name:oBundle.getText("City_101000")}]},
            {key:1011,name:oBundle.getText("Province_1011"),sub:[{key:101100,name:oBundle.getText("City_101100")}]},
            {key:1012,name:oBundle.getText("Province_1012"),sub:[{key:101200,name:oBundle.getText("City_101200")}]},            
            {key:1013,name:oBundle.getText("Province_1013"),sub:[{key:101300,name:oBundle.getText("City_101300")}]},
            {key:1014,name:oBundle.getText("Province_1014"),sub:[{key:101400,name:oBundle.getText("City_101400")}]},
            {key:1015,name:oBundle.getText("Province_1015"),sub:[{key:101500,name:oBundle.getText("City_101500")}]},
            {key:1016,name:oBundle.getText("Province_1016"),sub:[{key:101600,name:oBundle.getText("City_101600")}]},
            {key:1017,name:oBundle.getText("Province_1017"),sub:[{key:101700,name:oBundle.getText("City_101700")}]},
            {key:1018,name:oBundle.getText("Province_1018"),sub:[{key:101800,name:oBundle.getText("City_101800")}]},            
            {key:1019,name:oBundle.getText("Province_1019"),sub:[{key:101900,name:oBundle.getText("City_101900")}]},
            {key:1020,name:oBundle.getText("Province_1020"),sub:[{key:102000,name:oBundle.getText("City_102000")}]},            
            {key:1021,name:oBundle.getText("Province_1021"),sub:[{key:102100,name:oBundle.getText("City_102100")}]},
            {key:1022,name:oBundle.getText("Province_1022"),sub:[{key:102200,name:oBundle.getText("City_102200")}]},
            {key:1023,name:oBundle.getText("Province_1023"),sub:[{key:102300,name:oBundle.getText("City_102300")}]},
            {key:1024,name:oBundle.getText("Province_1024"),sub:[{key:102400,name:oBundle.getText("City_102400")}]},
            {key:1025,name:oBundle.getText("Province_1025"),sub:[{key:102500,name:oBundle.getText("City_102500")}]},
            {key:1026,name:oBundle.getText("Province_1026"),sub:[{key:102600,name:oBundle.getText("City_102600")}]},
            {key:1027,name:oBundle.getText("Province_1027"),sub:[{key:102700,name:oBundle.getText("City_102700")}]},
            {key:1028,name:oBundle.getText("Province_1028"),sub:[{key:102800,name:oBundle.getText("City_102800")}]},
            {key:1029,name:oBundle.getText("Province_1029"),sub:[{key:102900,name:oBundle.getText("City_102900")}]},
            {key:1030,name:oBundle.getText("Province_1030"),sub:[{key:103000,name:oBundle.getText("City_103000")}]},            
            {key:1031,name:oBundle.getText("Province_1031"),sub:[{key:103000,name:oBundle.getText("City_103100")}]},
            {key:1032,name:oBundle.getText("Province_1032"),sub:[{key:103000,name:oBundle.getText("City_103200")}]},
            {key:1033,name:oBundle.getText("Province_1033"),sub:[{key:103300,name:oBundle.getText("City_103300")}]}
        ]
    },
    {key:20,"name":oBundle.getText("CountryKey_20"),"sub":[
    		{key:2000,name:"亚拉巴马州",sub:[{key:200000,name:"蒙哥马利"}]},
    		{key:2001,name:"阿拉斯加州",sub:[{key:200100,name:"朱诺"}]},
    		{key:2002,name:"亚利桑那州",sub:[{key:200200,name:"菲尼克斯"}]}
    	]
    }
];

var nativePlaceData = [
    {key:1,value:oBundle.getText("nativePlaceKey1")},
    {key:2,value:oBundle.getText("nativePlaceKey2")},
    {key:3,value:oBundle.getText("nativePlaceKey3")},
    {key:4,value:oBundle.getText("nativePlaceKey4")},
    {key:5,value:oBundle.getText("nativePlaceKey5")},
    {key:6,value:oBundle.getText("nativePlaceKey6")},
    {key:7,value:oBundle.getText("nativePlaceKey7")},
    {key:8,value:oBundle.getText("nativePlaceKey8")},
    
    {key:9,value:oBundle.getText("nativePlaceKey9")},
    {key:10,value:oBundle.getText("nativePlaceKey10")},
    {key:11,value:oBundle.getText("nativePlaceKey11")},
    {key:12,value:oBundle.getText("nativePlaceKey12")},
    {key:13,value:oBundle.getText("nativePlaceKey13")},
    
    {key:14,value:oBundle.getText("nativePlaceKey14")},
    {key:15,value:oBundle.getText("nativePlaceKey15")},
    {key:16,value:oBundle.getText("nativePlaceKey16")},
    {key:17,value:oBundle.getText("nativePlaceKey17")},
    {key:18,value:oBundle.getText("nativePlaceKey18")},
    {key:19,value:oBundle.getText("nativePlaceKey19")},
    
    {key:20,value:oBundle.getText("nativePlaceKey20")},
    {key:21,value:oBundle.getText("nativePlaceKey21")},
    {key:22,value:oBundle.getText("nativePlaceKey22")},
    {key:23,value:oBundle.getText("nativePlaceKey23")},
    {key:24,value:oBundle.getText("nativePlaceKey24")},
    {key:25,value:oBundle.getText("nativePlaceKey25")},
    {key:26,value:oBundle.getText("nativePlaceKey26")},
    {key:27,value:oBundle.getText("nativePlaceKey27")},
    
    {key:28,value:oBundle.getText("nativePlaceKey28")},
    {key:29,value:oBundle.getText("nativePlaceKey29")},
    {key:30,value:oBundle.getText("nativePlaceKey30")},
    {key:31,value:oBundle.getText("nativePlaceKey31")},
    {key:32,value:oBundle.getText("nativePlaceKey32")},
    {key:33,value:oBundle.getText("nativePlaceKey33")},
    {key:34,value:oBundle.getText("nativePlaceKey34")},
    
    {key:35,value:oBundle.getText("nativePlaceKey35")},
    {key:36,value:oBundle.getText("nativePlaceKey36")},
    {key:37,value:oBundle.getText("nativePlaceKey37")},
    {key:38,value:oBundle.getText("nativePlaceKey38")},
    {key:39,value:oBundle.getText("nativePlaceKey39")},
    {key:40,value:oBundle.getText("nativePlaceKey40")},
    {key:41,value:oBundle.getText("nativePlaceKey41")},
    {key:42,value:oBundle.getText("nativePlaceKey42")},
    {key:43,value:oBundle.getText("nativePlaceKey43")},
    
    {key:44,value:oBundle.getText("nativePlaceKey44")}
];

/**
 * 获取对应的肿瘤类型
 * */
function getNativePlaceName(key){
	var flag = "";
	for(var i=0;i < nativePlaceData.length;i++){
		if(nativePlaceData[i].key  == key){
			flag =  nativePlaceData[i].value;
		}
	}
	return flag;
}

//获取数据操作权限Token
//用医生或者病人登陆:  http://192.168.9.63:10080/rest/auth/rclogin?type=doctor&user=A008&passwd=123456
//用系统管理员登陆：/proxy/http/192.168.9.63:10080/rest/auth/login
function GetTokendata() {
    $.ajax({
        type: "get",
        async: false,
        url: "/proxy/http/192.168.9.19:8080/rest/auth/login",
        dataType: "json",
        data: {
            user: "admin",
            passwd: "manage"
        },
        success: function (data) {
            console.log(data);
            if(data.result == "ok"){
                //alert('查询的信息：success data.result:'+ data.result);
                //alert('查询的信息：success data.token:'+ data.token);
                token= data.token;               
            }else{
                //oLabelinfo1.setText("用户名和密码证验失败！");
                token="";
            }
        },
        timeout: 5000,
        error: function () {
            //alert('查询的信息失败');
            //oLabelinfo1.setText("访问验证接口失败！");
            token="";
        }
    });
 };
 //GetTokendata();
 
 /**
 * 验证电话号码
 * obj 输入的内容
 * */
function verifyTelNumber(obj){
    var pattern_Mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/; //手机格式，需改动
    var pattern_Phone = /^(\d{3}-\d{8}|\d{4}-\d{7,8})$/;
    var usa_pattern = /^(\+\d+ )?(\(\d+\) )?[\d ]+$/;
    if (pattern_Mobile.test(obj) || pattern_Phone.test(obj) || usa_pattern.test(obj)) {
        return true;
    }
    else {
        return false;
    }
};