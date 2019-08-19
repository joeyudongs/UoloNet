//地址选择控件
var CountrySelectDoctor = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择国家"
        })
    ]
});

var ProvinceSelectDoctor = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择省/市"
        })
    ]
});

var CitySelectDoctor = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择城市"
        })
    ]
});
//添加国家
for(var i=0;i<all_citys.length;i++){
	CountrySelectDoctor.addItem(new sap.ui.core.Item({
    	key: all_citys[i].key,
        text: all_citys[i].name
    }));
};

//国家选择事件
CountrySelectDoctor.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			if(this.getSelectedKey()== country){
				clearSelectDoctor();
				for(var j=0;j<all_citys[i].sub.length;j++){
					var name = all_citys[i].sub[j].name;
					var key = all_citys[i].sub[j].key;
					ProvinceSelectDoctor.addItem(new sap.ui.core.Item({
						key: key,
                        text: name
                    }));
				}
			}else if(this.getSelectedKey()==""){
				clearSelectDoctor();
			}
		}
});

//省选择事件
 ProvinceSelectDoctor.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			for(var j=0;j<all_citys[i].sub.length;j++){
//				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				if(this.getSelectedKey() ==key){
					clearCityDoctor();
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelectDoctor.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
		if(this.getSelectedKey() ==""){
			clearCityDoctor();
		}
});
//清除选择
function clearSelectDoctor(){
	ProvinceSelectDoctor.removeAllItems();
	ProvinceSelectDoctor.addItem(new sap.ui.core.Item({
            text: "请选择省/市"
        }));
    CitySelectDoctor.removeAllItems();
	CitySelectDoctor.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
function clearCityDoctor(){
	CitySelectDoctor.removeAllItems();
	CitySelectDoctor.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
/** 
 * 传入默认的国家 省/市 城市
 * county
 * province
 * city
 */
function setDefaultSelectAddressDoctor(county,province,city){
	clearSelectDoctor();
	clearCityDoctor();
	for(var i=0;i<all_citys.length;i++){
		if(all_citys[i].key == county){
			for(var j=0;j<all_citys[i].sub.length;j++){
				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				ProvinceSelectDoctor.addItem(new sap.ui.core.Item({
					key: key,
                    text: name
                }));
                if(province ==key){
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelectDoctor.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
	}
	CountrySelectDoctor.setSelectedKey(county);
	ProvinceSelectDoctor.setSelectedKey(province);
	CitySelectDoctor.setSelectedKey(city);
}