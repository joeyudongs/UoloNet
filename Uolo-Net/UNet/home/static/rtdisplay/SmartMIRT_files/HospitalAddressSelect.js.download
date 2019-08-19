//地址选择控件

function test(){
	return CountrySelect;
}
//如果不兼容试试此方法  addressSelect.cSelect()
var addressSelect = {  
       "cSelect":test,
       "pSelect":ProvinceSelect,
       "citySelect":CitySelect
};


var CountrySelect = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择国家"
        })
    ]
});

var ProvinceSelect = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择省/市"
        })
    ]
});

var CitySelect = new sap.m.Select({
    items: [
        new sap.ui.core.Item({
            text: "请选择城市"
        })
    ]
});
//添加国家
for(var i=0;i<all_citys.length;i++){
	CountrySelect.addItem(new sap.ui.core.Item({
    	key: all_citys[i].key,
        text: all_citys[i].name
    }));
};

//国家选择事件
CountrySelect.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			if(this.getSelectedKey()== country){
				clearSelect();
				for(var j=0;j<all_citys[i].sub.length;j++){
					var name = all_citys[i].sub[j].name;
					var key = all_citys[i].sub[j].key;
					ProvinceSelect.addItem(new sap.ui.core.Item({
						key: key,
                        text: name
                    }));
				}
			}else if(this.getSelectedKey()==""){
				clearSelect();
			}
		}
});

//省选择事件
 ProvinceSelect.attachChange(function(){
	for(var i=0;i<all_citys.length;i++){
			var country = all_citys[i].key;
			for(var j=0;j<all_citys[i].sub.length;j++){
//				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				if(this.getSelectedKey() ==key){
					clearCity();
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelect.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
		if(this.getSelectedKey() ==""){
			clearCity();
		}
});
//清除选择
function clearSelect(){
	ProvinceSelect.removeAllItems();
	ProvinceSelect.addItem(new sap.ui.core.Item({
            text: "请选择省/市"
        }));
    CitySelect.removeAllItems();
	CitySelect.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
function clearCity(){
	CitySelect.removeAllItems();
	CitySelect.addItem(new sap.ui.core.Item({
        text: "请选择城市"
    }));
}
/** 
 * 传入默认的国家 省/市 城市
 * county
 * province
 * city
 */
function setDefaultSelect(county,province,city){
	clearSelect();
	clearCity();
	for(var i=0;i<all_citys.length;i++){
		if(all_citys[i].key == county){
			for(var j=0;j<all_citys[i].sub.length;j++){
				var name = all_citys[i].sub[j].name;
				var key = all_citys[i].sub[j].key;
				ProvinceSelect.addItem(new sap.ui.core.Item({
					key: key,
                    text: name
                }));
                if(province ==key){
                    for(var y=0;y<all_citys[i].sub[j].sub.length;y++){
                    	var sub_name = all_citys[i].sub[j].sub[y].name;
                    	var sub_key = all_citys[i].sub[j].sub[y].key;
                    	CitySelect.addItem(new sap.ui.core.Item({
							key: sub_key,
	                        text: sub_name
	                    }));
                    }
				}
			}
		}
	}
	CountrySelect.setSelectedKey(county);
	ProvinceSelect.setSelectedKey(province);
	CitySelect.setSelectedKey(city);
}