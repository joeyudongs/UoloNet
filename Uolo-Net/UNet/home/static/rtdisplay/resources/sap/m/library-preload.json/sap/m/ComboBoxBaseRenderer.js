/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./InputBaseRenderer','sap/ui/core/Renderer'],function(q,I,R){'use strict';var C=R.extend(I);C.CSS_CLASS='sapMComboBoxBase';C.writeOuterAttributes=function(r,c){r.writeAttribute('role','combobox');};C.writeInnerAttributes=function(r,c){r.writeAttribute('autocomplete','off');r.writeAttribute('autocorrect','off');r.writeAttribute('autocapitalize','off');};C.writeAccessibilityState=function(r,c){I.writeAccessibilityState.apply(this,arguments);r.writeAccessibilityState(c,{role:'combobox',expanded:c.isOpen(),autocomplete:'both'});};C.addOuterStyles=function(r,c){r.addStyle('max-width',c.getMaxWidth());};C.addOuterClasses=function(r,c){var a=C.CSS_CLASS;r.addClass(a);r.addClass(a+'Input');if(!c.getEnabled()){r.addClass(a+'Disabled');}if(!c.getEditable()){r.addClass(a+'Readonly');}};C.addInnerClasses=function(r,c){var a=C.CSS_CLASS;r.addClass(a+'InputInner');if(!c.getEditable()){r.addClass(a+'InputInnerReadonly');}};C.writeInnerContent=function(r,c){r.write('<button tabindex="-1"');r.writeAttribute('id',c.getId()+'-arrow');this.addButtonClasses(r,c);r.writeClasses();r.write('></button>');};C.addButtonClasses=function(r,c){r.addClass(C.CSS_CLASS+'Arrow');};return C;},true);