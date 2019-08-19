/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Item'],function(q,l,I){'use strict';var a=I.extend('sap.m.IconTabFilter',{metadata:{interfaces:['sap.m.IconTab','sap.ui.core.PopupInterface'],library:'sap.m',properties:{count:{type:'string',group:'Data',defaultValue:''},showAll:{type:'boolean',group:'Misc',defaultValue:false},icon:{type:'sap.ui.core.URI',group:'Misc',defaultValue:''},iconColor:{type:'sap.ui.core.IconColor',group:'Appearance',defaultValue:sap.ui.core.IconColor.Default},iconDensityAware:{type:'boolean',group:'Appearance',defaultValue:true},visible:{type:'boolean',group:'Behavior',defaultValue:true},design:{type:'sap.m.IconTabFilterDesign',group:'Appearance',defaultValue:sap.m.IconTabFilterDesign.Vertical}},defaultAggregation:'content',aggregations:{content:{type:'sap.ui.core.Control',multiple:true,singularName:'content'}}}});a.prototype._getImageControl=function(c,p,C){var P={src:this.getIcon(),densityAware:this.getIconDensityAware()};if(P.src){this._oImageControl=sap.m.ImageHelper.getImageControl(this.getId()+'-icon',this._oImageControl,p,P,c,C);}else if(this._oImageControl){this._oImageControl.destroy();this._oImageControl=null;}return this._oImageControl;};a.prototype.exit=function(e){if(this._oImageControl){this._oImageControl.destroy();}if(I.prototype.exit){I.prototype.exit.call(this,e);}};a.prototype.invalidate=function(){var i=this.getParent(),o;if(i instanceof sap.m.IconTabHeader&&i.getParent()instanceof sap.m.IconTabBar){o=i.getParent();o.invalidate();}};a.prototype.setProperty=function(p,v,s){switch(p){case'count':case'showAll':case'icon':case'iconColor':case'iconDensityAware':case'design':sap.ui.core.Control.prototype.setProperty.call(this,p,v,true);if(!s){var i=this.getParent();if(i instanceof sap.m.IconTabHeader){i.invalidate();}}break;default:sap.ui.core.Control.prototype.setProperty.apply(this,arguments);break;}return this;};a.prototype._getNonEmptyKey=function(){var k=this.getKey();if(k){return k;}return this.getId();};return a;},true);
