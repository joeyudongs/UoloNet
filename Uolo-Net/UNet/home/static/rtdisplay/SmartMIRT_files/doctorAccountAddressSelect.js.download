//地址选择控件
var CountrySelectDoctorEdit = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择国家"
        })
    ]
});

var ProvinceSelectDoctorEdit = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择省/市"
        })
    ]
});

var CitySelectDoctorEdit = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择城市"
        })
    ]
});
//添加国家
for(var i=0;i<all_citys.length;i++){
	CountrySelectDoctorEdit.addItem(new sap.ui.core.Item({
    	key: all_citys[i].key,
        text: all_citys[i].name
    }));
};

//国家选择事件
CountrySelectDoctorEdit.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			if(this.getSelectedKey()== country){
				clearSelectDoctorEdit();
				for(var j=0;j<all_citys[i].sub.length;j++){
					var name = all_citys[i].sub[j].name;
					var key = all_citys[i].sub[j].key;
					ProvinceSelectDoctorEdit.addItem(new sap.ui.core.Item({
						key: key,
                        text: name
                    }));
				}
			}else if(this.getSelectedKey()==""){
				clearSelectDoctorEdit();
			}
		}
});

//省选择事件
 ProvinceSelectDoctorEdit.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			for(var j=0;j<all_citys[i].sub.length;j++){
//				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				if(this.getSelectedKey() ==key){
					clearCityDoctorEdit();
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelectDoctorEdit.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
		if(this.getSelectedKey() ==""){
			clearCityDoctorEdit();
		}
});
//清除选择
function clearSelectDoctorEdit(){
	ProvinceSelectDoctorEdit.removeAllItems();
	ProvinceSelectDoctorEdit.addItem(new sap.ui.core.Item({
            text: "请选择省/市"
        }));
    CitySelectDoctorEdit.removeAllItems();
	CitySelectDoctorEdit.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
function clearCityDoctorEdit(){
	CitySelectDoctorEdit.removeAllItems();
	CitySelectDoctorEdit.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
/** 
 * 传入默认的国家 省/市 城市
 * county
 * province
 * city
 */
function setDefaultSelectAddressDoctorEdit(county,province,city){
	clearSelectDoctorEdit();
	clearCityDoctorEdit();
	for(var i=0;i<all_citys.length;i++){
		if(all_citys[i].key == county){
			for(var j=0;j<all_citys[i].sub.length;j++){
				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				ProvinceSelectDoctorEdit.addItem(new sap.ui.core.Item({
					key: key,
                    text: name
                }));
                if(province ==key){
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelectDoctorEdit.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
	}
	CountrySelectDoctorEdit.setSelectedKey(county);
	ProvinceSelectDoctorEdit.setSelectedKey(province);
	CitySelectDoctorEdit.setSelectedKey(city);
};