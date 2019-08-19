/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./ComboBoxBaseRenderer','./Dialog','./InputBase','./List','./Popover','./library','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool'],function(q,B,C,D,I,L,P,l,E,a){'use strict';var b=I.extend('sap.m.ComboBoxBase',{metadata:{'abstract':true,library:'sap.m',properties:{maxWidth:{type:'sap.ui.core.CSSSize',group:'Dimension',defaultValue:'100%'}},defaultAggregation:'items',aggregations:{items:{type:'sap.ui.core.Item',multiple:true,singularName:'item',bindable:'bindable'},picker:{type:'sap.ui.core.Control',multiple:false,visibility:'hidden'}}}});a.insertFontFaceStyle();E.apply(b.prototype,[true]);b.prototype.getListItem=function(i){return(i&&i.data(sap.m.ComboBoxBaseRenderer.CSS_CLASS+'ListItem'))||null;};b.prototype._mapItemToListItem=function(i){if(!i){return null;}var c=C.CSS_CLASS,s=c+'Item',d=i.getEnabled()?'Enabled':'Disabled',e=(i===this.getSelectedItem())?s+'Selected':'',o=this.getListItem(i),f=o?o.getVisible():true;o=new sap.m.StandardListItem().addStyleClass(s+' '+s+d+' '+e);o.setVisible(f);o.setTitle(i.getText());o.setType(i.getEnabled()?sap.m.ListType.Active:sap.m.ListType.Inactive);o.setTooltip(i.getTooltip());i.data(c+'ListItem',o);return o;};b.prototype._findMappedItem=function(o,c){for(var i=0,c=c||this.getItems(),d=c.length;i<d;i++){if(this.getListItem(c[i])===o){return c[i];}}return null;};b.prototype._fillList=function(c){var s=this.getSelectedItem();for(var i=0,o,d;i<c.length;i++){d=c[i];o=this._mapItemToListItem(d);this.getList().addAggregation('items',o,true);if(d===s){this.getList().setSelectedItem(o,true);}}};b.prototype._clearList=function(){if(this.getList()){this.getList().destroyAggregation('items',true);}};b.prototype.getList=function(){return this._oList;};b.prototype.init=function(){I.prototype.init.apply(this,arguments);this.setPickerType('Popover');this.createList();};b.prototype.exit=function(){I.prototype.exit.apply(this,arguments);if(this.getList()){this.getList().destroy();this._oList=null;}};b.prototype.ontouchstart=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(this.isOpenArea(e.target)){this.addStyleClass(C.CSS_CLASS+'Pressed');}};b.prototype.ontouchend=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if((!this.isOpen()||!this.hasContent())&&this.isOpenArea(e.target)){this.removeStyleClass(C.CSS_CLASS+'Pressed');}};b.prototype.ontap=function(e){var c=C.CSS_CLASS;if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(this.isOpenArea(e.target)){if(this.isOpen()){this.close();this.removeStyleClass(c+'Pressed');return;}if(this.hasContent()){this.open();}}if(this.isOpen()){this.addStyleClass(c+'Pressed');}};b.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(e.keyCode===q.sap.KeyCodes.F4){e.preventDefault();}if(this.isOpen()){this.close();return;}this.selectText(0,this.getValue().length);if(this.hasContent()){this.open();}};b.prototype.onsapescape=function(e){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){e.setMarked();e.preventDefault();this.close();}else{I.prototype.onsapescape.apply(this,arguments);}};b.prototype.onsaphide=b.prototype.onsapshow;b.prototype.addContent=function(p){};b.prototype.setPickerType=function(p){this._sPickerType=p;};b.prototype.getPickerType=function(){return this._sPickerType;};b.prototype.createPicker=function(){};b.prototype.getPicker=function(){if(this.bIsDestroyed){return null;}return this.createPicker(this.getPickerType());};b.prototype.hasContent=function(){return!!this.getItems().length;};b.prototype.findFirstEnabledItem=function(c){c=c||this.getItems();for(var i=0;i<c.length;i++){if(c[i].getEnabled()){return c[i];}}return null;};b.prototype.findLastEnabledItem=function(i){i=i||this.getItems();return this.findFirstEnabledItem(i.reverse());};b.prototype.open=function(){var p=this.getPicker();if(p){p.open();}return this;};b.prototype.getVisibleItems=function(){for(var i=0,o,c=this.getItems(),v=[];i<c.length;i++){o=this.getListItem(c[i]);if(o&&o.getVisible()){v.push(c[i]);}}return v;};b.prototype.isItemSelected=function(){};b.prototype.getKeys=function(c){for(var i=0,k=[],c=c||this.getItems();i<c.length;i++){k[i]=c[i].getKey();}return k;};b.prototype.getSelectableItems=function(){return this.getEnabledItems(this.getVisibleItems());};b.prototype.getOpenArea=function(){return this.getDomRef('arrow');};b.prototype.isOpenArea=function(d){var o=this.getOpenArea();return o&&o.contains(d);};b.prototype.findItem=function(p,v){var m='get'+p.charAt(0).toUpperCase()+p.slice(1);for(var i=0,c=this.getItems();i<c.length;i++){if(c[i][m]()===v){return c[i];}}return null;};b.prototype.getItemByText=function(t){return this.findItem('text',t);};b.prototype.scrollToItem=function(i){var p=this.getPicker(),o=p.getDomRef('cont'),c=i&&i.getDomRef();if(!p||!o||!c){return;}var d=o.scrollTop,e=c.offsetTop,f=o.clientHeight,g=c.offsetHeight;if(d>e){o.scrollTop=e;}else if((e+g)>(d+f)){o.scrollTop=Math.ceil(e+g-f);}};b.prototype.clearFilter=function(){for(var i=0,o,c=this.getItems();i<c.length;i++){o=this.getListItem(c[i]);o.setVisible(true);}};b.prototype.clearSelection=function(){};b.prototype.getValue=function(){var d=this.getFocusDomRef();if(d){return d.value;}return this.getProperty('value');};b.prototype.addItem=function(i){this.addAggregation('items',i);if(this.getList()){this.getList().addItem(this._mapItemToListItem(i));}return this;};b.prototype.insertItem=function(i,c){this.insertAggregation('items',i,c);if(this.getList()){this.getList().insertItem(this._mapItemToListItem(i),c);}return this;};b.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};b.prototype.getFirstItem=function(){return this.getItems()[0]||null;};b.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};b.prototype.getEnabledItems=function(i){i=i||this.getItems();return i.filter(function(o){return o.getEnabled();});};b.prototype.getItemByKey=function(k){return this.findItem('key',k);};b.prototype.isOpen=function(){var p=this.getAggregation('picker');return!!(p&&p.isOpen());};b.prototype.close=function(){var p=this.getAggregation('picker');if(p){p.close();}return this;};b.prototype.removeItem=function(i){i=this.removeAggregation('items',i);if(this.getList()){this.getList().removeItem(this.getListItem(i));}return i;};b.prototype.removeAllItems=function(){var i=this.removeAllAggregation('items');this.clearSelection();if(this.getList()){this.getList().removeAllItems();}return i;};b.prototype.destroyItems=function(){this.destroyAggregation('items');if(this.getList()){this.getList().destroyItems();}return this;};return b;},true);
