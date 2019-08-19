/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./FlexBoxStylingHelper','./library','sap/ui/core/Control'],function(q,F,l,C){'use strict';var a=C.extend('sap.m.FlexBox',{metadata:{library:'sap.m',properties:{height:{type:'sap.ui.core.CSSSize',group:'Dimension',defaultValue:''},width:{type:'sap.ui.core.CSSSize',group:'Dimension',defaultValue:''},displayInline:{type:'boolean',group:'Appearance',defaultValue:false},direction:{type:'sap.m.FlexDirection',group:'Appearance',defaultValue:sap.m.FlexDirection.Row},fitContainer:{type:'boolean',group:'Appearance',defaultValue:false},renderType:{type:'sap.m.FlexRendertype',group:'Misc',defaultValue:sap.m.FlexRendertype.Div},justifyContent:{type:'sap.m.FlexJustifyContent',group:'Appearance',defaultValue:sap.m.FlexJustifyContent.Start},alignItems:{type:'sap.m.FlexAlignItems',group:'Appearance',defaultValue:sap.m.FlexAlignItems.Stretch}},defaultAggregation:'items',aggregations:{items:{type:'sap.ui.core.Control',multiple:true,singularName:'item'}}}});a.prototype.init=function(){if(this instanceof sap.m.HBox&&(this.getDirection()!=='Row'||this.getDirection()!=='RowReverse')){this.setDirection('Row');}if(this instanceof sap.m.VBox&&(this.getDirection()!=='Column'||this.getDirection()!=='ColumnReverse')){this.setDirection('Column');}};a.prototype.setDisplayInline=function(i){var d='';this.setProperty('displayInline',i,false);if(i){d='inline-flex';}else{d='flex';}F.setStyle(null,this,'display',d);return this;};a.prototype.setDirection=function(v){this.setProperty('direction',v,false);F.setStyle(null,this,'flex-direction',v);return this;};a.prototype.setFitContainer=function(v){if(v&&!(this.getParent()instanceof a)){q.sap.log.info("FlexBox fitContainer set to true. Remember, if the FlexBox is inserted into a Page, the property 'enableScrolling' of the Page needs to be set to 'false' for the FlexBox to fit the entire viewport.");var $=this.$();$.css('width','auto');$.css('height','100%');}this.setProperty('fitContainer',v,false);return this;};a.prototype.setJustifyContent=function(v){this.setProperty('justifyContent',v,false);F.setStyle(null,this,'justify-content',v);return this;};a.prototype.setAlignItems=function(v){this.setProperty('alignItems',v,false);F.setStyle(null,this,'align-items',v);return this;};a.prototype.setAlignContent=function(v){this.setProperty('alignContent',v,false);F.setStyle(null,this,'align-content',v);return this;};a.prototype.onAfterRendering=function(){if(q.support.useFlexBoxPolyfill){var t=this;var c=t;var p=null;q.sap.log.info('Check #'+c.getId()+' for nested FlexBoxes');for(p=c.getParent();p!==null&&p!==undefined&&(p instanceof a||(p.getLayoutData()!==null&&p.getLayoutData()instanceof sap.m.FlexItemData));){c=p;p=c.getParent();}this.sanitizeChildren(this);this.renderFlexBoxPolyFill();}};a.prototype.sanitizeChildren=function(c){var b=c.getItems();for(var i=0;i<b.length;i++){if(b[i].getVisible===undefined||b[i].getVisible()){var $='';if(b[i]instanceof a){$=b[i].$();}else{$=b[i].$().parent();}$.width('auto');if(b[i]instanceof a){this.sanitizeChildren(b[i]);}}}};a.prototype.renderFlexBoxPolyFill=function(){var f=[];var o=[];var c=this.getItems();for(var i=0;i<c.length;i++){if(c[i].getVisible===undefined||c[i].getVisible()){var L=c[i].getLayoutData();if(L!=='undefined'&&L!==null&&L instanceof sap.m.FlexItemData){if(L.getGrowFactor()!==1){f.push(L.getGrowFactor());}else{f.push(1);}if(L.getOrder()!=0){o.push(L.getOrder());}else{o.push(0);}}}}if(f.length===0){f=null;}if(o.length===0){o=null;}if(this.getFitContainer()){this.setFitContainer(true);}var s={direction:this.getDirection(),alignItems:this.getAlignItems(),justifyContent:this.getJustifyContent(),flexMatrix:f,ordinalMatrix:o};F.applyFlexBoxPolyfill(this.getId(),s);};return a;},true);
