/**
 * Created by XieYing on 15/5/29.
 */
//function getCTPage() {
    var ctDir;
    var patientName, patientID, patientSex, patientAge, studyDate, studyTime, studyId, studyDescription,
        seriesDescription, institutionName, manufacturer, manufacturerModelName, patientPosition,
        rows, columns, pixelSpacing, imagePosition, windowCenter, windowWidth, sliceLocation, sliceThickness;
    var x_dim, y_dim, z_dim, x_pixdim, y_pixdim, z_pixdim, x_start, y_start, z_start, x_start_dicom, y_start_dicom;
    var roiNames = [], rois = [], chartSeries = [], doseNames = [];
    var mouseDownEvent, xPath, yPath, xPath1, yPath1, xPath2, yPath2;
    var doseXOrigin, doseYOrigin, doseZOrigin, dose_x_dim, dose_y_dim, dose_z_dim, dose_x_pixdim, dose_y_pixdim, dose_z_pixdim;
    var axialDoseRaster, coronalDoseRaster, sagittalDoseRaster;
    var axialRaster, coronalRaster, sagittalRaster;
    var axialTimer, coronalTimer, sagittalTimer;
    var axialROIPaths = [], coronalROIPaths = [], sagittalROIPaths = [];
    var header, roisForCorSag = [];
    var xValue, yValue, zValue;
    var utils = [];

                function setCTDir(dir) {
                    ctDir = dir;
                }   

    function getCTInfo(zValue) {
        $.ajax({
            type: "get",
            async: false,
            url: serverurl+"/dicom?type=meta",
            //url: "http://192.168.9.19:8080/dicom?type=meta",
            dataType: "json",
            data: {z: zValue, dir: ctDir+"/CT"},
            success: function (data) {
                patientName = data['00100010'].Value[0].Alphabetic;
                patientID = data['00100020'].Value[0];
                patientSex = data['00100040'].Value[0];
                patientAge = data['00101010'].Value[0];
                studyDate = data['00080020'].Value[0].substr(0, 4) + '/' + data['00080020'].Value[0].substr(4, 2) + '/' + data['00080020'].Value[0].substr(6, 2);
                studyTime = data['00080030'].Value[0].substr(0, 2) + ':' + data['00080030'].Value[0].substr(2, 2) + ':' + data['00080030'].Value[0].substr(4, 2);
                studyId = data['00200010'].Value[0];
                studyDescription = data['00081030'].Value[0];
                seriesDescription = data['0008103E'].Value[0];
                institutionName = data['00080080'].Value[0];
                manufacturer = data['00080070'].Value[0];
                manufacturerModelName = data['00081090'].Value[0];
                patientPosition = data['00185100'].Value[0];
                //rows = data['00280010'].Value[0];
                //columns = data['00280011'].Value[0];
                pixelSpacing = data['00280030'].Value;
                imagePosition = data['00200032'].Value;
                windowCenter = data['00281050'].Value[0];
                windowWidth = data['00281051'].Value[0];
                sliceLocation = data['00201041'].Value[0] + 'mm';
                sliceThickness = data['00180050'].Value[0] + 'mm';
            },
            timeout: 5000,
            error: function () {
                //alert("Can't get CT info!");
                console.log("Can't get CT info!");
            }
        });
    };

    function getImageSetHeader() {
        $.ajax({
            type: "get",
            async: false,
            url: serverurl+"/roi?type=header",
            //url: "http://192.168.9.19:8080/roi?type=header",
            dataType: "json",
            data: {dir: ctDir},
            success: function (data) {
                x_dim = data.x_dim[0];
                y_dim = data.y_dim[0];
                z_dim = data.z_dim[0];
                x_pixdim = data.x_pixdim[0];
                y_pixdim = data.y_pixdim[0];
                z_pixdim = data.z_pixdim[0];
                x_start = data.x_start[0];
                y_start = data.y_start[0];
                z_start = data.z_start[0];
                x_start_dicom = data.x_start_dicom[0];
                y_start_dicom = data.y_start_dicom[0];
                header = data;
            },
            timeout: 5000,
            error: function () {
                //alert("Can't get ImageSet_0.header!");
                console.log("Can't get ImageSet_0.header!");
            }
        });
    }

    function addChartSeries(seriesName, data) {
        var pointNum = parseInt(data.substr(0, data.indexOf('\n')));
        var dvhPoints = [], seriesData = [];
        var pointData = data.substr(data.indexOf('\n') + 1);
        var totalVolume = 0, curSumVolume = 0;
        while (pointData != '') {
            var firstPoint = pointData.substr(0, pointData.indexOf('\n'));
            var dose = parseFloat(firstPoint.substr(0, firstPoint.indexOf(' ')));
            var differentialVolume = parseFloat(firstPoint.substr(firstPoint.indexOf(' ') + 1));
            totalVolume += differentialVolume;
            dvhPoints.push([dose, differentialVolume]);
            pointData = pointData.substr(pointData.indexOf('\n') + 1);
        }

        for (var i = 0; i < dvhPoints.length; i++) {
            curSumVolume += dvhPoints[i][1];
            var cumulativeVolume = parseFloat(((totalVolume - curSumVolume) / totalVolume * 100).toFixed(2));
            if (cumulativeVolume != 0) {
                seriesData.push([dvhPoints[i][0], cumulativeVolume]);
            }
        }
        chartSeries.push({name: seriesName, data: seriesData});
    }

    function getROINames() {
        oROIList.removeAllItems();
        $.ajax({
            type: "get",
            async: false,
            url: serverurl+"/roi?type=names",
            //url: "http://192.168.9.19:8080/roi?type=names",
            dataType: "json",
            data: {dir: ctDir},
            success: function (data) {
                roiNames = data;
                for (var i = 0; i < roiNames.length; i++) {
                    var oROIListItem = new sap.m.StandardListItem({
                        title: roiNames[i]
                    });
                    oROIList.addItem(oROIListItem);
                }
            },
            timeout: 5000,
            error: function (err) {
                //alert('get ROI Names error');
                console.log('get ROI Names error');
            }
        });
    }

    function getROIPoints(roiName) {
        var dtd = $.Deferred();
        $.ajax({
            type: "get",
            //async: false,
            url: serverurl+"/roi?type=roi",
            //url: "http://192.168.9.19:8080/roi?type=roi",
            dataType: "json",
            data: {name: roiName, dir: ctDir},
            success: function (data) {
                if (data[0].hasOwnProperty('curve')) {
                    var roiColor;
                    switch (data[0].color[0]) {
                        case 'forest':
                            roiColor = '#228B22';
                            break;
                        case 'lightorange':
                            roiColor = '#FFC800';
                            break;
                        case 'greyscale':
                            roiColor = 'LightGray';
                            break;
                        case 'inverse_grey':
                            roiColor = 'DarkGray';
                            break;
                        case 'skin':
                            roiColor = '#DD9A7F';
                            break;
                        case 'Smart':
                            roiColor = 'Magenta';
                            break;
                        case 'Fusion_Red':
                            roiColor = 'OrangeRed';
                            break;
                        case 'Thermal':
                            roiColor = 'Crimson';
                            break;
                        case 'SUV2':
                            roiColor = 'Silver';
                            break;
                        case 'SUV3':
                            roiColor = 'DodgerBlue';
                            break;
                        case 'CEqual':
                            roiColor = 'Tan';
                            break;
                        case 'rainbow1':
                            roiColor = 'Gold';
                            break;
                        case 'rainbow2':
                            roiColor = 'SpringGreen';
                            break;
                        case 'GEM':
                            roiColor = 'DarkRed';
                            break;
                        case 'spectrum':
                            roiColor = 'MediumOrchid';
                            break;
                        default:
                            roiColor = data[0].color[0];
                            break;
                    }
                    var roi = {name: roiName, color: roiColor, curve: data[0].curve, line_width: data[0].line_2d_width[0]};
                    //var roi = {name: roiName, color: data[0].color[0], curve: data[0].curve, line_width: data[0].line_2d_width[0]};
                    rois.push(roi);

                    var roiForCorSag = {name: roiName, color: roiColor, data: data[0], line_width: data[0].line_2d_width[0]};
                    roisForCorSag.push(roiForCorSag);
                }
                dtd.resolve();
            },
            timeout: 5000,
            error: function (err) {
                //alert('get ROI Points error');
                console.log('get ROI Points of ' + roiName + ' error');
                dtd.reject();
            }
        });
        return dtd.promise();
    }

    function getDVHdata(roiName, doseName) {
        var dtd = $.Deferred();
        var roiDVHName = roiName.replace(/[ ]/g,"");
        $.ajax({
            type: "get",
            //async: false,
            url: serverurl+"/dvh?type=data",
            //url: "http://192.168.9.19:8080/dvh?type=data",
            dataType: "text",
            data: {roi: roiDVHName, dir: ctDir+"/DVH", dose: doseName},
            success: function (data) {
                addChartSeries(roiName, data);
                dtd.resolve();
            },
            timeout: 5000,
            error: function (err, a) {
                //alert('get '+roiName+' DVHdata error');
                console.log('get DVHdata of ' + roiName+ ' error');
                dtd.reject();
            }
        });
        return dtd.promise();
    }

    function getDoseNames() {
        oDoseList.removeAllItems();
        oDoseList.addItem(oDoseListItem1);
        $.ajax({
            type: "get",
            async: false,
            url: serverurl+"/dose?type=names",
            //url: "http://192.168.9.19:8080/dose?type=names",
            dataType: "json",
            data: {dir: ctDir+"/Dose"},
            success: function (data) {
                doseNames = data;
                for (var i = 0; i < doseNames.length; i++) {
                    var oDoseListItem = new sap.m.StandardListItem({
                        title: doseNames[i]
                    });
                    oDoseList.addItem(oDoseListItem);
                }
            },
            timeout: 5000,
            error: function (err) {
                //alert('get Dose Names error');
                console.log('get Dose Names error');
            }
        });
    }

    function getDoseHeaderInfo(doseName) {
        var dtd = $.Deferred();
        $.ajax({
            type: "get",
            //async: false,
            url: serverurl+"/dose?type=header",
            //url: "http://192.168.9.19:8080/dose?type=header",
            dataType: "json",
            data: {dir: ctDir+"/Dose/"+doseName},
            success: function (data) {
                doseXOrigin = data['At .XOrigin'][0].Value[0];
                doseYOrigin = data['At .YOrigin'][0].Value[0];
                doseZOrigin = data['At .ZOrigin'][0].Value[0];
                dose_x_dim = data.x_dim[0];
                dose_y_dim = data.y_dim[0];
                dose_z_dim = data.z_dim[0];
                dose_x_pixdim = data.x_pixdim[0];
                dose_y_pixdim = data.y_pixdim[0];
                dose_z_pixdim = data.z_pixdim[0];
                dtd.resolve();
            },
            timeout: 5000,
            error: function (err) {
                //alert('get Dose Header Info error');
                console.log('get Dose Header Info of ' + doseName + ' error');
                oDoseList.setSelectedItem(oDoseListItem1, true);
                dtd.reject();
            }
        });
        return dtd.promise();
    }

    function drawCrossFullLine(event) {
        if(xPath) {
            xPath.remove();
        }
        if(yPath) {
            yPath.remove();
        }

        xPath = new Path.Line(new Point(event.target.bounds.left, event.point.y), new Point(event.target.bounds.right, event.point.y));
        //xPath.strokeColor = 'red';
        xPath.strokeWidth = 1;

        yPath = new Path.Line(new Point(event.point.x, event.target.bounds.top), new Point(event.point.x, event.target.bounds.bottom));
        //yPath.strokeColor = 'red';
        yPath.strokeWidth = 1;


        switch (event.target.project.view._id) {
            case 'AxialCanvas':
                xPath.strokeColor = 'green';
                yPath.strokeColor = '#007cc0';
                break;
            case 'CoronalCanvas':
                xPath.strokeColor = 'red';
                yPath.strokeColor = '#007cc0';
                break;
            case 'SagittalCanvas':
                xPath.strokeColor = 'red';
                yPath.strokeColor = 'green';
                break;
            default:
                break;
        }

        xPath.onMouseEnter = function (evt) {
            fullLineMouseEnterMove(evt, event);
        }

        xPath.onMouseMove = function (evt) {
            fullLineMouseEnterMove(evt, event);
        }

        xPath.onMouseDown = function (evt) {
            fullLineMouseDown(evt, event);
        }

        yPath.onMouseEnter = function (evt) {
            fullLineMouseEnterMove(evt, event);
        }

        yPath.onMouseMove = function (evt) {
            fullLineMouseEnterMove(evt, event);
        }

        yPath.onMouseDown = function (evt) {
            fullLineMouseDown(evt, event)
        }
    }

    function fullLineMouseEnterMove(evt, event) {
        switch (event.target.project.view._id) {
            case 'AxialCanvas':
                if (!bAxialPlaying) {
                    var x = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                    var y = Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim)) + 1;
                    document.getElementById('bottomleft1').innerHTML = 'X: ' + x + ' Y: ' + y + '<br/>' + 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;
                    drawCrossDottedLineOnFullLine(evt, event);
                }
                break;
            case 'CoronalCanvas':
                if (!bCoronalPlaying) {
                    var x = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                    var z = Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                    document.getElementById('bottomleft2').innerHTML = 'X: ' + x + ' Z: ' + z + '<br/>' + 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';
                    drawCrossDottedLineOnFullLine(evt, event);
                }
                break;
            case 'SagittalCanvas':
                if (!bSagittalPlaying) {
                    var y = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim)) + 1;
                    var z = Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                    document.getElementById('bottomleft3').innerHTML = 'Y: ' + y + ' Z: ' + z + '<br/>' + 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';
                    drawCrossDottedLineOnFullLine(evt, event);
                }
                break;
            default:
                break;
        }
    }

    function fullLineMouseDown(evt, event) {
        switch (event.target.project.view._id) {
            case 'AxialCanvas':
                if (bCoronalLoaded && bSagittalLoaded) {
                    focusedCTCanvas = 'AxialCanvas';
                    if (!bAxialPlaying && !bAxialFullScr) {
                        if (coronalTimer) {
                            bCoronalPlaying = false;
                            coronalPlayBtn.setIcon("sap-icon://media-play");
                            coronalPlayBtn.setTooltip("play");
                            clearInterval(coronalTimer);
                        }
                        if (sagittalTimer) {
                            bSagittalPlaying = false;
                            sagittalPlayBtn.setIcon("sap-icon://media-play");
                            sagittalPlayBtn.setTooltip("play");
                            clearInterval(sagittalTimer);
                        }

                        xValue = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                        yValue = Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim))+1;

                        sagittalSlider.setValue(xValue+1);
                        coronalSlider.setValue(yValue);

                        syncCTAxial();
                        mouseDownEvent = {target: event.target, point: evt.point};
                        drawCrossFullLine(mouseDownEvent);

                        syncCTCoronal();
                        syncCTSagittal();
                    }
                }
                break;
            case 'CoronalCanvas':
                if (bAxialLoaded && bSagittalLoaded) {
                    focusedCTCanvas = 'CoronalCanvas';
                    if (!bCoronalPlaying && !bCoronalFullScr) {
                        if (axialTimer) {
                            bAxialPlaying = false;
                            axialPlayBtn.setIcon("sap-icon://media-play");
                            axialPlayBtn.setTooltip("play");
                            clearInterval(axialTimer);
                        }
                        if (sagittalTimer) {
                            bSagittalPlaying = false;
                            sagittalPlayBtn.setIcon("sap-icon://media-play");
                            sagittalPlayBtn.setTooltip("play");
                            clearInterval(sagittalTimer);
                        }

                        xValue = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                        zValue = z_dim - Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                        sagittalSlider.setValue(xValue+1);
                        axialSlider.setValue(z_dim - zValue);

                        syncCTCoronal();
                        mouseDownEvent = {target: event.target, point: evt.point};
                        drawCrossFullLine(mouseDownEvent);

                        syncCTAxial();
                        syncCTSagittal();
                    }
                }
                break;
            case 'SagittalCanvas':
                if (bAxialLoaded && bCoronalLoaded) {
                    focusedCTCanvas = 'SagittalCanvas';
                    if (!bSagittalPlaying && !bSagittalFullScr) {
                        if (axialTimer) {
                            bAxialPlaying = false;
                            axialPlayBtn.setIcon("sap-icon://media-play");
                            axialPlayBtn.setTooltip("play");
                            clearInterval(axialTimer);
                        }
                        if (coronalTimer) {
                            bCoronalPlaying = false;
                            coronalPlayBtn.setIcon("sap-icon://media-play");
                            coronalPlayBtn.setTooltip("play");
                            clearInterval(coronalTimer);
                        }

                        yValue = Math.round((evt.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim))+1;
                        zValue = z_dim - Math.round((evt.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                        coronalSlider.setValue(yValue);
                        axialSlider.setValue(z_dim - zValue);

                        syncCTSagittal();
                        mouseDownEvent = {target: event.target, point: evt.point};
                        drawCrossFullLine(mouseDownEvent);

                        syncCTAxial();
                        syncCTCoronal();
                    }
                }
                break;
            default:
                break;
        }
    }

    function drawCrossDottedLine(event) {
        if(xPath1) {
            xPath1.remove();
        }
        if(xPath2) {
            xPath2.remove();
        }
        if(yPath1) {
            yPath1.remove();
        }
        if(yPath2) {
            yPath2.remove();
        }

        xPath1 = new Path.Line(new Point(event.target.bounds.left, event.point.y), new Point(event.point.x-3, event.point.y));
        //xPath1.strokeColor = 'red';
        xPath1.strokeWidth = 2;
        xPath1.dashArray = [5, 5];
        xPath2 = new Path.Line(new Point(event.point.x+3, event.point.y), new Point(event.target.bounds.right, event.point.y));
        //xPath2.strokeColor = 'red';
        xPath2.strokeWidth = 2;
        xPath2.dashArray = [5, 5];

        yPath1 = new Path.Line(new Point(event.point.x, event.target.bounds.top), new Point(event.point.x, event.point.y-3));
        //yPath1.strokeColor = 'red';
        yPath1.strokeWidth = 2;
        yPath1.dashArray = [5, 5];
        yPath2 = new Path.Line(new Point(event.point.x, event.point.y+3), new Point(event.point.x, event.target.bounds.bottom));
        //yPath2.strokeColor = 'red';
        yPath2.strokeWidth = 2;
        yPath2.dashArray = [5, 5];


        switch (event.target.project.view._id) {
            case 'AxialCanvas':
                xPath1.strokeColor = 'green';
                xPath2.strokeColor = 'green';
                yPath1.strokeColor = '#007cc0';
                yPath2.strokeColor = '#007cc0';
                break;
            case 'CoronalCanvas':
                xPath1.strokeColor = 'red';
                xPath2.strokeColor = 'red';
                yPath1.strokeColor = '#007cc0';
                yPath2.strokeColor = '#007cc0';
                break;
            case 'SagittalCanvas':
                xPath1.strokeColor = 'red';
                xPath2.strokeColor = 'red';
                yPath1.strokeColor = 'green';
                yPath2.strokeColor = 'green';
                break;
            default:
                break;
        }
    }

    function drawCrossDottedLineOnFullLine(evt, event) {
        if(xPath1) {
            xPath1.remove();
        }
        if(xPath2) {
            xPath2.remove();
        }
        if(yPath1) {
            yPath1.remove();
        }
        if(yPath2) {
            yPath2.remove();
        }

        xPath1 = new Path.Line(new Point(event.target.bounds.left, evt.point.y), new Point(evt.point.x-3, evt.point.y));
        xPath1.strokeWidth = 2;
        xPath1.dashArray = [5, 5];
        xPath2 = new Path.Line(new Point(evt.point.x+3, evt.point.y), new Point(event.target.bounds.right, evt.point.y));
        xPath2.strokeWidth = 2;
        xPath2.dashArray = [5, 5];

        yPath1 = new Path.Line(new Point(evt.point.x, event.target.bounds.top), new Point(evt.point.x, evt.point.y-3));
        yPath1.strokeWidth = 2;
        yPath1.dashArray = [5, 5];
        yPath2 = new Path.Line(new Point(evt.point.x, evt.point.y+3), new Point(evt.point.x, event.target.bounds.bottom));
        yPath2.strokeWidth = 2;
        yPath2.dashArray = [5, 5];


        switch (event.target.project.view._id) {
            case 'AxialCanvas':
                xPath1.strokeColor = 'green';
                xPath2.strokeColor = 'green';
                yPath1.strokeColor = '#007cc0';
                yPath2.strokeColor = '#007cc0';
                break;
            case 'CoronalCanvas':
                xPath1.strokeColor = 'red';
                xPath2.strokeColor = 'red';
                yPath1.strokeColor = '#007cc0';
                yPath2.strokeColor = '#007cc0';
                break;
            case 'SagittalCanvas':
                xPath1.strokeColor = 'red';
                xPath2.strokeColor = 'red';
                yPath1.strokeColor = 'green';
                yPath2.strokeColor = 'green';
                break;
            default:
                break;
        }
    }

    function removeCrossLines() {
        if(xPath) {
            xPath.remove();
        }
        if(yPath) {
            yPath.remove();
        }
        if(xPath1) {
            xPath1.remove();
        }
        if(xPath2) {
            xPath2.remove();
        }
        if(yPath1) {
            yPath1.remove();
        }
        if(yPath2) {
            yPath2.remove();
        }
    }

    function setAxialDose(AxialView, doseRaster, raster) {
        var doseRasterWidth, doseRasterHeight, pointX, pointY;
        doseRaster.onLoad = function () {
            doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        };

        if (AxialView.size.width >= AxialView.size.height) {
            doseRasterWidth = AxialView.size.height/(x_dim*x_pixdim)*dose_x_dim*dose_x_pixdim;
            doseRasterHeight = AxialView.size.height/(y_dim*y_pixdim)*dose_y_dim*dose_y_pixdim;
            pointX = Math.round((doseXOrigin - x_start_dicom)/x_pixdim) / x_dim * AxialView.size.height + (AxialView.size.width-AxialView.size.height)/2 + doseRasterWidth/2;
            pointY = AxialView.size.height - Math.round((doseYOrigin - y_start_dicom)/y_pixdim) / y_dim * AxialView.size.height - doseRasterHeight/2;
        }
        else {
            doseRasterWidth = AxialView.size.width/(x_dim*x_pixdim)*dose_x_dim*dose_x_pixdim;
            doseRasterHeight = AxialView.size.width/(y_dim*y_pixdim)*dose_y_dim*dose_y_pixdim;
            pointX = Math.round((doseXOrigin - x_start_dicom)/x_pixdim) / x_dim * AxialView.size.width + doseRasterWidth/2;
            pointY = (AxialView.size.width+AxialView.size.height)/2 - Math.round((doseYOrigin - y_start_dicom)/y_pixdim) / y_dim * AxialView.size.width - doseRasterHeight/2;
        }
        doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        doseRaster.position = new Point(pointX, pointY);
        //doseRaster.opacity = 0.5;
    }

    function setCoronalDose(CoronalView, doseRaster, raster) {
        var rasterWidth, rasterHeight, doseRasterWidth, doseRasterHeight, pointX, pointY;
        doseRaster.onLoad = function () {
            doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        };

        if (CoronalView.size.width / CoronalView.size.height >= raster.width / raster.height) {
            //rasterWidth = CoronalView.size.height / raster.height * raster.width;
            //rasterHeight = CoronalView.size.height;
            rasterWidth = CoronalView.size.height;
            rasterHeight = CoronalView.size.height / raster.width * raster.height;
            doseRasterWidth = rasterWidth / (x_dim*x_pixdim) * dose_x_dim*dose_x_pixdim;
            doseRasterHeight = rasterHeight / ((z_dim+1)*z_pixdim) * dose_z_dim*dose_z_pixdim;
            pointX = Math.round((doseXOrigin - x_start_dicom)/x_pixdim) / x_dim * rasterWidth + (CoronalView.size.width-rasterWidth)/2 + doseRasterWidth/2;
            pointY = rasterHeight - Math.round((doseZOrigin - z_start)/z_pixdim) / z_dim * rasterHeight - doseRasterHeight/2 + (CoronalView.size.height - rasterHeight)/2;
        }
        else {
            rasterWidth = CoronalView.size.width;
            rasterHeight = CoronalView.size.width / raster.width * raster.height;
            doseRasterWidth = rasterWidth / (x_dim*x_pixdim) * dose_x_dim*dose_x_pixdim;
            doseRasterHeight = rasterHeight / ((z_dim+1)*z_pixdim) * dose_z_dim*dose_z_pixdim;
            pointX = Math.round((doseXOrigin - x_start_dicom)/x_pixdim) / x_dim * rasterWidth + doseRasterWidth/2;
            pointY = (rasterHeight+CoronalView.size.height)/2 - Math.round((doseZOrigin - z_start)/z_pixdim) / z_dim * rasterHeight - doseRasterHeight/2;
        }
        doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        doseRaster.position = new Point(pointX, pointY);
        //doseRaster.opacity = 0.5;
    }

    function setSagittalDose(SagittalView, doseRaster, raster) {
        var rasterWidth, rasterHeight, doseRasterWidth, doseRasterHeight, pointX, pointY;
        doseRaster.onLoad = function () {
            doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        };

        if (SagittalView.size.width / SagittalView.size.height >= raster.width / raster.height) {
            //rasterWidth = SagittalView.size.height / raster.height * raster.width;
            //rasterHeight = SagittalView.size.height;
            rasterWidth = SagittalView.size.height;
            rasterHeight = SagittalView.size.height / raster.width * raster.height;
            doseRasterWidth = rasterWidth / (y_dim*y_pixdim) * dose_y_dim*dose_y_pixdim;
            doseRasterHeight = rasterHeight / ((z_dim+1)*z_pixdim) * dose_z_dim*dose_z_pixdim;
            pointX = (SagittalView.size.width+rasterWidth)/2 - Math.round((doseYOrigin - y_start_dicom)/y_pixdim) / y_dim * rasterWidth - doseRasterWidth/2;
            pointY = rasterHeight - Math.round((doseZOrigin - z_start)/z_pixdim) / z_dim * rasterHeight - doseRasterHeight/2 +  + (SagittalView.size.height - rasterHeight)/2;
        }
        else {
            rasterWidth = SagittalView.size.width;
            rasterHeight = SagittalView.size.width / raster.width * raster.height;
            doseRasterWidth = rasterWidth / (y_dim*y_pixdim) * dose_y_dim*dose_y_pixdim;
            doseRasterHeight = rasterHeight / ((z_dim+1)*z_pixdim) * dose_z_dim*dose_z_pixdim;
            pointX = SagittalView.size.width - Math.round((doseYOrigin - y_start_dicom)/y_pixdim) / y_dim * rasterWidth - doseRasterWidth/2;
            pointY = (rasterHeight+SagittalView.size.height)/2 - Math.round((doseZOrigin - z_start)/z_pixdim) / z_dim * rasterHeight - doseRasterHeight/2;
        }
        doseRaster.size = new Size(doseRasterWidth, doseRasterHeight);
        doseRaster.position = new Point(pointX, pointY);
        //doseRaster.opacity = 0.5;
    }

    function syncCTAxial() {
        //if(view._id != 'AxialCanvas') {
        //    paper.setup('AxialCanvas');
        //}
        bAxialLoaded = false;
        var axialLoader = document.getElementById('axialLoader');
        axialLoader.style.zIndex = 100;
        paper.projects[0].activate();
        var AxialView = view;
        var container2 = document.getElementById('container2');
        view.viewSize.setWidth(container2.clientWidth);
        view.viewSize.setHeight(container2.clientHeight);
        //if (bAxialFullScr) {
        //    view.viewSize.setWidth(container2.clientWidth);
        //    view.viewSize.setHeight(window.innerHeight-48-35-2);
        //}
        //else {
        //    view.viewSize.setWidth(axialNonFullScrWidth);
        //    view.viewSize.setHeight(375);
        //}
        //updateAxialDirection(AxialView);
        var topcenter1 = document.getElementById('topcenter1');
        var topbottom1 = document.getElementById('topbottom1');
        var leftcenter1 = document.getElementById('leftcenter1');
        var rightcenter1 = document.getElementById('rightcenter1');
        topcenter1.style.left = AxialView.size.width / 2 + 'px';
        topbottom1.style.left = AxialView.size.width / 2 + 'px';
        leftcenter1.style.top = AxialView.size.height / 2 + 'px';
        rightcenter1.style.top = AxialView.size.height / 2 + 'px';
        axialSlider.setWidth((AxialView.size.width-35-35-35-35-35)+'px');

        var preAxialRaster, preAxialDoseRaster;
        if (axialDoseRaster != null) {
            //axialDoseRaster.remove();
            preAxialDoseRaster = axialDoseRaster;
        }
        if (axialRaster != null) {
            //axialRaster.remove();
            preAxialRaster = axialRaster;
        }
        for (var i = 0; i < axialROIPaths.length; i++) {
            axialROIPaths[i].remove();
            axialROIPaths.splice(i, 1);
            i--;
        }
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_z = Math.round(((z_dim-zValue-1) * z_pixdim + z_start - doseZOrigin) / dose_z_pixdim);
            axialDoseRaster = new Raster(serverurl+'/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //axialDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        axialRaster = new Raster(serverurl+'/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
        //axialRaster = new Raster('http://192.168.9.19:8080/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
        axialRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setAxialDose(AxialView, axialDoseRaster, axialRaster);
            }
            if (AxialView.size.width >= AxialView.size.height) {
                axialRaster.size = new Size(AxialView.size.height, AxialView.size.height);
            }
            else {
                axialRaster.size = new Size(AxialView.size.width, AxialView.size.width);
            }

            getCTInfo(zValue * z_pixdim * 10);
            document.getElementById('topleft1').innerHTML = patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex;
            document.getElementById('topright1').innerHTML = institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition;
            document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;
            document.getElementById('bottomright1').innerHTML = studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime;

            if (preAxialDoseRaster != null) {
                preAxialDoseRaster.remove();
            }
            if (preAxialRaster != null) {
                preAxialRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                axialDoseRaster.opacity = 1.0;
                axialRaster.opacity = 0.5;
            }
            else {
                axialRaster.opacity = 1.0;
            }

            bAxialLoaded = true;
            axialLoader.style.zIndex = -100;
        };
        axialRaster.position = AxialView.center;
        axialRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            axialDoseRaster.opacity = 0.0;
        }

        if (AxialView.size.width >= AxialView.size.height) {
            axialRaster.size = new Size(AxialView.size.height, AxialView.size.height);
        }
        else {
            axialRaster.size = new Size(AxialView.size.width, AxialView.size.width);
        }
        for (var i = 0; i < rois.length; i++) {
            for (var j = 0; j < rois[i].curve.length; j++) {
                if (rois[i].curve[j].points[0][0][2] == (z_start + (z_dim-zValue-1)*z_pixdim).toFixed(6)) {
                    var roiPath = new Path();
                    roiPath.strokeColor = rois[i].color;
                    roiPath.strokeWidth = rois[i].line_width;
                    for (var k = 0; k < rois[i].curve[j].points[0].length; k++) {
                        var pointX = Math.round((rois[i].curve[j].points[0][k][0] - x_start_dicom)/x_pixdim) / x_dim * axialRaster.bounds.width + axialRaster.bounds.left;
                        var pointY = axialRaster.bounds.bottom - Math.round((rois[i].curve[j].points[0][k][1] - y_start_dicom)/y_pixdim) / y_dim * axialRaster.bounds.height;
                        roiPath.add(new Point(pointX, pointY));
                    }
                    //break;
                    roiPath.closed = true;

                    roiPath.onMouseEnter = function (evt) {
                        var event = {target: axialRaster};
                        fullLineMouseEnterMove(evt, event);
                    }

                    roiPath.onMouseMove = function (evt) {
                        var event = {target: axialRaster};
                        fullLineMouseEnterMove(evt, event);
                    }

                    roiPath.onMouseDown = function (evt) {
                        var event = {target: axialRaster};
                        fullLineMouseDown(evt, event);
                    }

                    axialROIPaths.push(roiPath);
                }
            }
        }

        //AxialView.onResize = function (event) {
        //    syncCTAxial();
        //}

        //切换CT图之后需要为新的raster添加鼠标事件，否则不会相应鼠标操作
        axialRaster.onMouseMove = function (event) {
            if (!bAxialPlaying) {
                var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                var y = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim)) + 1;
                document.getElementById('bottomleft1').innerHTML = 'X: ' + x + ' Y: ' + y + '<br/>' + 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                if(view._id != 'AxialCanvas') {
                    //syncCTAxial();
                    paper.projects[0].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas' && !bAxialFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        axialRaster.onMouseLeave = function () {
            document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        axialRaster.onMouseDown = function (event) {
            if (bCoronalLoaded && bSagittalLoaded) {
                focusedCTCanvas = 'AxialCanvas';
                if (!bAxialPlaying && !bAxialFullScr) {
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }

                    xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                    yValue = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim))+1;

                    sagittalSlider.setValue(xValue+1);
                    coronalSlider.setValue(yValue);

                    syncCTAxial();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTCoronal();
                    syncCTSagittal();
                }
            }
        }
    }

    function syncCTCoronal() {
        //if(view._id != 'CoronalCanvas') {
        //    paper.setup('CoronalCanvas');
        //}
        bCoronalLoaded = false;
        //loading.setVisible(true);
        var coronalLoader = document.getElementById('coronalLoader');
        coronalLoader.style.zIndex = 100;
        paper.projects[1].activate();
        var CoronalView = view;
        var container3 = document.getElementById('container3');
        view.viewSize.setWidth(container3.clientWidth);
        view.viewSize.setHeight(container3.clientHeight);
        //if (bCoronalFullScr) {
        //    view.viewSize.setWidth(container3.clientWidth);
        //    view.viewSize.setHeight(window.innerHeight-48-35-2);
        //}
        //else {
        //    view.viewSize.setWidth(coronalNonFullScrWidth);
        //    view.viewSize.setHeight(375);
        //}
        var topcenter2 = document.getElementById('topcenter2');
        var topbottom2 = document.getElementById('topbottom2');
        var leftcenter2 = document.getElementById('leftcenter2');
        var rightcenter2 = document.getElementById('rightcenter2');
        topcenter2.style.left = CoronalView.size.width / 2 + 'px';
        topbottom2.style.left = CoronalView.size.width / 2 + 'px';
        leftcenter2.style.top = CoronalView.size.height / 2 + 'px';
        rightcenter2.style.top = CoronalView.size.height / 2 + 'px';
        coronalSlider.setWidth((CoronalView.size.width-35-35-35-35-35)+'px');

        var preCoronalRaster, preCoronalDoseRaster;
        if (coronalDoseRaster != null) {
            //coronalDoseRaster.remove();
            preCoronalDoseRaster = coronalDoseRaster;
        }
        if (coronalRaster != null) {
            //coronalRaster.remove();
            preCoronalRaster = coronalRaster;
        }
        for (var i = 0; i < coronalROIPaths.length; i++) {
            coronalROIPaths[i].remove();
            coronalROIPaths.splice(i, 1);
            i--;
        }
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_y = Math.round(((yValue-1) * y_pixdim + y_start_dicom - doseYOrigin) / dose_y_pixdim);
            coronalDoseRaster = new Raster(serverurl+'/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //coronalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        coronalRaster = new Raster(serverurl+'/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
        //coronalRaster = new Raster('http://192.168.9.19:8080/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
        coronalRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setCoronalDose(CoronalView, coronalDoseRaster, coronalRaster);
            }
            //coronalRaster.transform(new Matrix(1, 0, 0, -1, 0, coronalRaster.height));
            var rasterWidth;
            if (CoronalView.size.width / CoronalView.size.height >= coronalRaster.width / coronalRaster.height) {
                coronalRaster.scale(CoronalView.size.height / coronalRaster.width);
                rasterWidth = CoronalView.size.height;
                paper.projects[1].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var xz = utils[i].get_xz(yValue - 1);
                    for (var j = 0; j < xz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        coronalROIPaths.push(roiPath);
                    }
                }
            }
            else {
                coronalRaster.scale(CoronalView.size.width / coronalRaster.width);
                rasterWidth = CoronalView.size.width;
                var rasterHeight = CoronalView.size.width / coronalRaster.width * coronalRaster.height;
                paper.projects[1].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var xz = utils[i].get_xz(yValue - 1);
                    for (var j = 0; j < xz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2+1][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        coronalROIPaths.push(roiPath);
                    }
                }
            }
            document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

            if (preCoronalDoseRaster != null) {
                preCoronalDoseRaster.remove();
            }
            if (preCoronalRaster != null) {
                preCoronalRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                coronalDoseRaster.opacity = 1.0;
                coronalRaster.opacity = 0.5;
            }
            else {
                coronalRaster.opacity = 1.0;
            }
            bCoronalLoaded = true;
            coronalLoader.style.zIndex = -100;
        };
        coronalRaster.position = CoronalView.center;
        coronalRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            coronalDoseRaster.opacity = 0.0;
        }

        //CoronalView.onResize = function (event) {
        //    syncCTCoronal();
        //}

        coronalRaster.onMouseMove = function (event) {
            if (!bCoronalPlaying) {
                var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                document.getElementById('bottomleft2').innerHTML = 'X: ' + x + ' Z: ' + z + '<br/>' + 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                if(view._id != 'CoronalCanvas') {
                    //syncCTCoronal();
                    paper.projects[1].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas' && !bCoronalFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        coronalRaster.onMouseLeave = function () {
            document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        coronalRaster.onMouseDown = function (event) {
            if (bAxialLoaded && bSagittalLoaded) {
                focusedCTCanvas = 'CoronalCanvas';
                if (!bCoronalPlaying && !bCoronalFullScr) {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }

                    xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                    zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                    sagittalSlider.setValue(xValue+1);
                    axialSlider.setValue(z_dim - zValue);

                    syncCTCoronal();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTAxial();
                    syncCTSagittal();
                }
            }
        }
    }

    function syncCTSagittal() {
        //if(view._id != 'SagittalCanvas') {
        //    paper.setup('SagittalCanvas');
        //}
        bSagittalLoaded = false;
        var sagittalLoader = document.getElementById('sagittalLoader');
        sagittalLoader.style.zIndex = 100;
        paper.projects[2].activate();
        var SagittalView = view;
        var container4 = document.getElementById('container4');
        view.viewSize.setWidth(container4.clientWidth);
        view.viewSize.setHeight(container4.clientHeight);
        //if (bSagittalFullScr) {
        //    view.viewSize.setWidth(container4.clientWidth);
        //    view.viewSize.setHeight(window.innerHeight-48-35-2);
        //}
        //else {
        //    view.viewSize.setWidth(sagittalNonFullScrWidth);
        //    view.viewSize.setHeight(375);
        //}
        var topcenter3 = document.getElementById('topcenter3');
        var topbottom3 = document.getElementById('topbottom3');
        var leftcenter3 = document.getElementById('leftcenter3');
        var rightcenter3 = document.getElementById('rightcenter3');
        topcenter3.style.left = SagittalView.size.width / 2 + 'px';
        topbottom3.style.left = SagittalView.size.width / 2 + 'px';
        leftcenter3.style.top = SagittalView.size.height / 2 + 'px';
        rightcenter3.style.top = SagittalView.size.height / 2 + 'px';
        sagittalSlider.setWidth((SagittalView.size.width-35-35-35-35-35)+'px');

        var preSagittalRaster, preSagittalDoseRaster;
        if (sagittalDoseRaster != null) {
            //sagittalDoseRaster.remove();
            preSagittalDoseRaster = sagittalDoseRaster;
        }
        if (sagittalRaster != null) {
            //sagittalRaster.remove();
            preSagittalRaster = sagittalRaster;
        }
        for (var i = 0; i < sagittalROIPaths.length; i++) {
            sagittalROIPaths[i].remove();
            sagittalROIPaths.splice(i, 1);
            i--;
        }
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_x = Math.round((xValue * x_pixdim + x_start_dicom - doseXOrigin) / dose_x_pixdim);
            sagittalDoseRaster = new Raster(serverurl+'/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //sagittalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        sagittalRaster = new Raster(serverurl+'/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
        //sagittalRaster = new Raster('http://192.168.9.19:8080/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
        sagittalRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setSagittalDose(SagittalView, sagittalDoseRaster, sagittalRaster);
            }
            //sagittalRaster.transform(new Matrix(1, 0, 0, -1, 0, sagittalRaster.height));
            var rasterWidth;
            if (SagittalView.size.width / SagittalView.size.height >= sagittalRaster.width / sagittalRaster.height) {
                sagittalRaster.scale(SagittalView.size.height / sagittalRaster.width);
                rasterWidth = SagittalView.size.height;
                paper.projects[2].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var yz = utils[i].get_yz(xValue);
                    for (var j = 0; j < yz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        sagittalROIPaths.push(roiPath);
                    }
                }
            }
            else {
                sagittalRaster.scale(SagittalView.size.width / sagittalRaster.width);
                rasterWidth = SagittalView.size.width;
                var rasterHeight = SagittalView.size.width / sagittalRaster.width * sagittalRaster.height;
                paper.projects[2].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var yz = utils[i].get_yz(xValue);
                    for (var j = 0; j < yz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2+1][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        sagittalROIPaths.push(roiPath);
                    }
                }
            }
            document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

            if (preSagittalDoseRaster != null) {
                preSagittalDoseRaster.remove();
            }
            if (preSagittalRaster != null) {
                preSagittalRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                sagittalDoseRaster.opacity = 1.0;
                sagittalRaster.opacity = 0.5;
            }
            else {
                sagittalRaster.opacity = 1.0;
            }
            bSagittalLoaded = true;
            sagittalLoader.style.zIndex = -100;
        };
        sagittalRaster.position = SagittalView.center;
        sagittalRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            sagittalDoseRaster.opacity = 0.0;
        }

        //SagittalView.onResize = function (event) {
        //    syncCTSagittal();
        //}

        sagittalRaster.onMouseMove = function (event) {
            if (!bSagittalPlaying) {
                var y = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim)) + 1;
                var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                document.getElementById('bottomleft3').innerHTML = 'Y: ' + y + ' Z: ' + z + '<br/>' + 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                if(view._id != 'SagittalCanvas') {
                    //syncCTSagittal();
                    paper.projects[2].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas' && !bSagittalFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        sagittalRaster.onMouseLeave = function () {
            document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        sagittalRaster.onMouseDown = function (event) {
            if (bAxialLoaded && bCoronalLoaded) {
                focusedCTCanvas = 'SagittalCanvas';
                if (!bSagittalPlaying && !bSagittalFullScr) {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }

                    yValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim))+1;
                    zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                    coronalSlider.setValue(yValue);
                    axialSlider.setValue(z_dim - zValue);

                    syncCTSagittal();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTAxial();
                    syncCTCoronal();
                }
            }
        }
    }

    function getFilterPage() {
        var filterPage = new sap.m.Page({
            title: "ROI",
            enableScrolling: true,
            headerContent: [
            ],
            content: oROIList
        });
        return filterPage;
    }

    function axialPlay(bNext) {
        if (coronalTimer) {
            bCoronalPlaying = false;
            coronalPlayBtn.setIcon("sap-icon://media-play");
            coronalPlayBtn.setTooltip("play");
            clearInterval(coronalTimer);
        }
        if (sagittalTimer) {
            bSagittalPlaying = false;
            sagittalPlayBtn.setIcon("sap-icon://media-play");
            sagittalPlayBtn.setTooltip("play");
            clearInterval(sagittalTimer);
        }

        if (bNext) {
            zValue--;
            if (zValue < 0) {
                zValue = 69;
            }
        }
        else {
            zValue++;
            if (zValue > 69) {
                zValue = 0;
            }
        }
        axialSlider.setValue(z_dim-zValue);

        paper.projects[0].activate();
        var AxialView = view;

        var preAxialDoseRaster, preAxialRaster;
        if (axialDoseRaster != null) {
            preAxialDoseRaster = axialDoseRaster;
        }
        if (axialRaster != null) {
            preAxialRaster = axialRaster;
        }
        //for (var i = 0; i < axialROIPaths.length; i++) {
        //    axialROIPaths[i].remove();
        //    axialROIPaths.splice(i, 1);
        //    i--;
        //}
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_z = Math.round(((z_dim-zValue-1) * z_pixdim + z_start - doseZOrigin) / dose_z_pixdim);
            axialDoseRaster = new Raster(serverurl+'/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //axialDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        axialRaster = new Raster(serverurl+'/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
        //axialRaster = new Raster('http://192.168.9.19:8080/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
        axialRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setAxialDose(AxialView, axialDoseRaster, axialRaster);
            }
            if (AxialView.size.width >= AxialView.size.height) {
                axialRaster.size = new Size(AxialView.size.height, AxialView.size.height);
            }
            else {
                axialRaster.size = new Size(AxialView.size.width, AxialView.size.width);
            }
            getCTInfo(zValue * z_pixdim * 10);
            document.getElementById('topleft1').innerHTML = patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex;
            document.getElementById('topright1').innerHTML = institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition;
            document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;
            document.getElementById('bottomright1').innerHTML = studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime;

            for (var i = 0; i < axialROIPaths.length; i++) {
                axialROIPaths[i].remove();
                axialROIPaths.splice(i, 1);
                i--;
            }

            for (var i = 0; i < rois.length; i++) {
                for (var j = 0; j < rois[i].curve.length; j++) {
                    if (rois[i].curve[j].points[0][0][2] == (z_start + (z_dim-zValue-1)*z_pixdim).toFixed(6)) {
                        var roiPath = new Path();
                        roiPath.strokeColor = rois[i].color;
                        roiPath.strokeWidth = rois[i].line_width;
                        for (var k = 0; k < rois[i].curve[j].points[0].length; k++) {
                            var pointX = Math.round((rois[i].curve[j].points[0][k][0] - x_start_dicom)/x_pixdim) / x_dim * axialRaster.bounds.width + axialRaster.bounds.left;
                            var pointY = axialRaster.bounds.bottom - Math.round((rois[i].curve[j].points[0][k][1] - y_start_dicom)/y_pixdim) / y_dim * axialRaster.bounds.height;
                            roiPath.add(new Point(pointX, pointY));
                        }
                        //break;
                        roiPath.closed = true;
                        axialROIPaths.push(roiPath);
                    }
                }
            }

            if (preAxialDoseRaster != null) {
                preAxialDoseRaster.remove();
            }
            if (preAxialRaster != null) {
                preAxialRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                axialDoseRaster.opacity = 1.0;
                axialRaster.opacity = 0.5;
            }
            else {
                axialRaster.opacity = 1.0;
            }

            bOnKeyDown = true;
        };
        axialRaster.position = AxialView.center;
        axialRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            axialDoseRaster.opacity = 0.0;
        }

        //AxialView.onResize = function (event) {
        //    syncCTAxial();
        //}

        //切换CT图之后需要为新的raster添加鼠标事件，否则不会相应鼠标操作
        axialRaster.onMouseMove = function (event) {
            if (!bAxialPlaying) {
                var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                var y = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim)) + 1;
                document.getElementById('bottomleft1').innerHTML = 'X: ' + x + ' Y: ' + y + '<br/>' + 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                if(view._id != 'AxialCanvas') {
                    //syncCTAxial();
                    paper.projects[0].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas' && !bAxialFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        axialRaster.onMouseLeave = function () {
            document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        axialRaster.onMouseDown = function (event) {
            if (bCoronalLoaded && bSagittalLoaded) {
                focusedCTCanvas = 'AxialCanvas';
                if (!bAxialPlaying && !bAxialFullScr) {
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }

                    xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                    yValue = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim))+1;

                    sagittalSlider.setValue(xValue+1);
                    coronalSlider.setValue(yValue);

                    syncCTAxial();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTCoronal();
                    syncCTSagittal();
                }
            }
        }
    }

    function coronalPlay(bNext) {
        if (axialTimer) {
            bAxialPlaying = false;
            axialPlayBtn.setIcon("sap-icon://media-play");
            axialPlayBtn.setTooltip("play");
            clearInterval(axialTimer);
        }
        if (sagittalTimer) {
            bSagittalPlaying = false;
            sagittalPlayBtn.setIcon("sap-icon://media-play");
            sagittalPlayBtn.setTooltip("play");
            clearInterval(sagittalTimer);
        }

        if (bNext) {
            yValue++;
            if (yValue > y_dim) {
                yValue = 1;
            }
        }
        else {
            yValue--;
            if (yValue < 1) {
                yValue = y_dim;
            }
        }
        coronalSlider.setValue(yValue);

        paper.projects[1].activate();
        var CoronalView = view;

        var preCoronalDoseRaster, preCoronalRaster;
        if (coronalDoseRaster != null) {
            //coronalDoseRaster.remove();
            preCoronalDoseRaster = coronalDoseRaster;
        }
        if (coronalRaster != null) {
            //coronalRaster.remove();
            preCoronalRaster = coronalRaster;
        }
        //for (var i = 0; i < coronalROIPaths.length; i++) {
        //    coronalROIPaths[i].remove();
        //    coronalROIPaths.splice(i, 1);
        //    i--;
        //}
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_y = Math.round(((yValue-1) * y_pixdim + y_start_dicom - doseYOrigin) / dose_y_pixdim);
            coronalDoseRaster = new Raster(serverurl+'/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //coronalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        coronalRaster = new Raster(serverurl+'/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
        //coronalRaster = new Raster('http://192.168.9.19:8080/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
        coronalRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setCoronalDose(CoronalView, coronalDoseRaster, coronalRaster);
            }

            for (var i = 0; i < coronalROIPaths.length; i++) {
                coronalROIPaths[i].remove();
                coronalROIPaths.splice(i, 1);
                i--;
            }
            //coronalRaster.transform(new Matrix(1, 0, 0, -1, 0, coronalRaster.height));
            var rasterWidth;
            if (CoronalView.size.width / CoronalView.size.height >= coronalRaster.width / coronalRaster.height) {
                coronalRaster.scale(CoronalView.size.height / coronalRaster.width);
                rasterWidth = CoronalView.size.height;
                paper.projects[1].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var xz = utils[i].get_xz(yValue - 1);
                    for (var j = 0; j < xz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        coronalROIPaths.push(roiPath);
                    }
                }
            }
            else {
                coronalRaster.scale(CoronalView.size.width / coronalRaster.width);
                rasterWidth = CoronalView.size.width;
                var rasterHeight = CoronalView.size.width / coronalRaster.width * coronalRaster.height;
                paper.projects[1].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var xz = utils[i].get_xz(yValue - 1);
                    for (var j = 0; j < xz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2+1][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: coronalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        coronalROIPaths.push(roiPath);
                    }
                }
            }


            document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

            if (preCoronalDoseRaster != null) {
                preCoronalDoseRaster.remove();
            }
            if (preCoronalRaster != null) {
                preCoronalRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                coronalDoseRaster.opacity = 1.0;
                coronalRaster.opacity = 0.5;
            }
            else {
                coronalRaster.opacity = 1.0;
            }

            bOnKeyDown = true;
        };
        coronalRaster.position = CoronalView.center;
        coronalRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            coronalDoseRaster.opacity = 0.0;
        }

        //CoronalView.onResize = function (event) {
        //    syncCTCoronal();
        //}

        coronalRaster.onMouseMove = function (event) {
            if (!bCoronalPlaying) {
                var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                document.getElementById('bottomleft2').innerHTML = 'X: ' + x + ' Z: ' + z + '<br/>' + 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                if(view._id != 'CoronalCanvas') {
                    //syncCTCoronal();
                    paper.projects[1].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas' && !bCoronalFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        coronalRaster.onMouseLeave = function () {
            document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        coronalRaster.onMouseDown = function (event) {
            if (bAxialLoaded && bSagittalLoaded) {
                focusedCTCanvas = 'CoronalCanvas';
                if (!bCoronalPlaying && !bCoronalFullScr) {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }

                    xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                    zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                    sagittalSlider.setValue(xValue+1);
                    axialSlider.setValue(z_dim - zValue);

                    syncCTCoronal();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTAxial();
                    syncCTSagittal();
                }
            }
        }
    }

    function sagittalPlay(bNext) {
        if (axialTimer) {
            bAxialPlaying = false;
            axialPlayBtn.setIcon("sap-icon://media-play");
            axialPlayBtn.setTooltip("play");
            clearInterval(axialTimer);
        }
        if (coronalTimer) {
            bCoronalPlaying = false;
            coronalPlayBtn.setIcon("sap-icon://media-play");
            coronalPlayBtn.setTooltip("play");
            clearInterval(coronalTimer);
        }

        if (bNext) {
            xValue++;
            if (xValue > x_dim - 1) {
                xValue = 0;
            }
        }
        else {
            xValue--;
            if (xValue < 0) {
                xValue = x_dim - 1;
            }
        }
        sagittalSlider.setValue(xValue+1);

        paper.projects[2].activate();
        var SagittalView = view;

        var preSagittalDoseRaster, preSagittalRaster;
        if (sagittalDoseRaster != null) {
            preSagittalDoseRaster = sagittalDoseRaster;
        }
        if (sagittalRaster != null) {
            preSagittalRaster = sagittalRaster;
        }
        //for (var i = 0; i < sagittalROIPaths.length; i++) {
        //    sagittalROIPaths[i].remove();
        //    sagittalROIPaths.splice(i, 1);
        //    i--;
        //}
        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas') {
            removeCrossLines();
        }

        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            var dose_x = Math.round((xValue * x_pixdim + x_start_dicom - doseXOrigin) / dose_x_pixdim);
            sagittalDoseRaster = new Raster(serverurl+'/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
            //sagittalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
        }

        sagittalRaster = new Raster(serverurl+'/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
        //sagittalRaster = new Raster('http://192.168.9.19:8080/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
        sagittalRaster.onLoad = function () {
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                setSagittalDose(SagittalView, sagittalDoseRaster, sagittalRaster);
            }

            for (var i = 0; i < sagittalROIPaths.length; i++) {
                sagittalROIPaths[i].remove();
                sagittalROIPaths.splice(i, 1);
                i--;
            }
            //sagittalRaster.transform(new Matrix(1, 0, 0, -1, 0, sagittalRaster.height));
            var rasterWidth;
            if (SagittalView.size.width / SagittalView.size.height >= sagittalRaster.width / sagittalRaster.height) {
                sagittalRaster.scale(SagittalView.size.height / sagittalRaster.width);
                rasterWidth = SagittalView.size.height;
                paper.projects[2].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var yz = utils[i].get_yz(xValue);
                    for (var j = 0; j < yz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        sagittalROIPaths.push(roiPath);
                    }
                }
            }
            else {
                sagittalRaster.scale(SagittalView.size.width / sagittalRaster.width);
                rasterWidth = SagittalView.size.width;
                var rasterHeight = SagittalView.size.width / sagittalRaster.width * sagittalRaster.height;
                paper.projects[2].activate();
                for (var i = 0; i < roisForCorSag.length; i++) {
                    var yz = utils[i].get_yz(xValue);
                    for (var j = 0; j < yz.length/2; j++) {
                        var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2+1][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2));
                        roiPath.strokeColor = roisForCorSag[i].color;
                        roiPath.strokeWidth = roisForCorSag[i].line_width;

                        roiPath.onMouseEnter = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseMove = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseEnterMove(evt, event);
                        }

                        roiPath.onMouseDown = function (evt) {
                            var event = {target: sagittalRaster};
                            fullLineMouseDown(evt, event);
                        }

                        sagittalROIPaths.push(roiPath);
                    }
                }
            }
            document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

            if (preSagittalDoseRaster != null) {
                preSagittalDoseRaster.remove();
            }
            if (preSagittalRaster != null) {
                preSagittalRaster.remove();
            }
            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                sagittalDoseRaster.opacity = 1.0;
                sagittalRaster.opacity = 0.5;
            }
            else {
                sagittalRaster.opacity = 1.0;
            }

            bOnKeyDown = true;
        };
        sagittalRaster.position = SagittalView.center;
        sagittalRaster.opacity = 0.0;
        if (oDoseList.getSelectedItem().mProperties.title != 'None') {
            sagittalDoseRaster.opacity = 0.0;
        }

        //SagittalView.onResize = function (event) {
        //    syncCTSagittal();
        //}

        sagittalRaster.onMouseMove = function (event) {
            if (!bSagittalPlaying) {
                var y = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim)) + 1;
                var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                document.getElementById('bottomleft3').innerHTML = 'Y: ' + y + ' Z: ' + z + '<br/>' + 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                if(view._id != 'SagittalCanvas') {
                    //syncCTSagittal();
                    paper.projects[2].activate();
                }
                drawCrossDottedLine(event);
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas' && !bSagittalFullScr) {
                    drawCrossFullLine(mouseDownEvent);
                }
            }
        }

        sagittalRaster.onMouseLeave = function () {
            document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

            if(xPath1) {
                xPath1.remove();
            }
            if(xPath2) {
                xPath2.remove();
            }
            if(yPath1) {
                yPath1.remove();
            }
            if(yPath2) {
                yPath2.remove();
            }
        }

        sagittalRaster.onMouseDown = function (event) {
            if (bAxialLoaded && bCoronalLoaded) {
                focusedCTCanvas = 'SagittalCanvas';
                if (!bSagittalPlaying && !bSagittalFullScr) {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }

                    yValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim))+1;
                    zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                    coronalSlider.setValue(yValue);
                    axialSlider.setValue(z_dim - zValue);

                    syncCTSagittal();
                    mouseDownEvent = event;
                    drawCrossFullLine(mouseDownEvent);

                    syncCTAxial();
                    syncCTCoronal();
                }
            }
        }
    }

    //function updateAxialDirection(AxialView) {
    //    var topcenter1 = document.getElementById('topcenter1');
    //    var topbottom1 = document.getElementById('topbottom1');
    //    var leftcenter1 = document.getElementById('leftcenter1');
    //    var rightcenter1 = document.getElementById('rightcenter1');
    //
    //    topcenter1.style.left = AxialView.size.width / 2 + 'px';
    //    topbottom1.style.left = AxialView.size.width / 2 + 'px';
    //    leftcenter1.style.top = AxialView.size.height / 2 + 'px';
    //    rightcenter1.style.top = AxialView.size.height / 2 + 'px';
    //    switch (patientPosition) {
    //        case 'HFP':
    //        case 'FFP':
    //            topcenter1.innerHTML = 'P';
    //            topbottom1.innerHTML = 'A';
    //            leftcenter1.innerHTML = 'L';
    //            rightcenter1.innerHTML = 'R';
    //            break;
    //        case 'HFS':
    //        case 'FFS':
    //            topcenter1.innerHTML = 'A';
    //            topbottom1.innerHTML = 'P';
    //            leftcenter1.innerHTML = 'R';
    //            rightcenter1.innerHTML = 'L';
    //            break;
    //        case 'HFDR':
    //        case 'FFDR':
    //            topcenter1.innerHTML = 'L';
    //            topbottom1.innerHTML = 'R';
    //            leftcenter1.innerHTML = 'A';
    //            rightcenter1.innerHTML = 'P';
    //            break;
    //        case 'HFDL':
    //        case 'FFDL':
    //            topcenter1.innerHTML = 'R';
    //            topbottom1.innerHTML = 'L';
    //            leftcenter1.innerHTML = 'P';
    //            rightcenter1.innerHTML = 'A';
    //            break;
    //        default:
    //            break;
    //    }
    //}

    window.onresize = function(){
        if (bAxialFullScr) {
            var container2 = document.getElementById('container2');
            container2.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
            var axialLoader = document.getElementById('axialLoader');
            axialLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
            syncCTAxial();
        }
        else if (bCoronalFullScr) {
            var container3 = document.getElementById('container3');
            container3.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
            var coronalLoader = document.getElementById('coronalLoader');
            coronalLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
            syncCTCoronal();
        }
        else if (bSagittalFullScr) {
            var container4 = document.getElementById('container4');
            container4.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
            var sagittalLoader = document.getElementById('sagittalLoader');
            sagittalLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
            syncCTSagittal();
        }
        else {
            //var container1 = document.getElementById('container1');
            //container1.style.height = (window.innerHeight - 48 - 48 - 8 - 8)/2 + 'px';

            var container2 = document.getElementById('container2');
            container2.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 - 35 + 'px';
            var axialLoader = document.getElementById('axialLoader');
            axialLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 + 'px';
            var AxialCanvas = document.getElementById('AxialCanvas');
            syncCTAxial();

            var container3 = document.getElementById('container3');
            container3.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
            var coronalLoader = document.getElementById('coronalLoader');
            coronalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';
            syncCTCoronal();

            var container4 = document.getElementById('container4');
            container4.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
            var sagittalLoader = document.getElementById('sagittalLoader');
            sagittalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';
            syncCTSagittal();
        }
    }

//////////////////////控件内容/////////////////////
    var oDialogOKBtn = new sap.m.Button({
        text: "OK",
        width: "50%",
        press:function(){
            oDialog.setBusy(true);
            var roiItems = oROIList.getSelectedItems();

            //rois = [];
            //删除保存在rois中没有选中的roi项
            for (var i = 0; i < rois.length; i++) {
                var bROISelected = false;
                for (var j = 0; j < roiItems.length; j++) {
                    if (rois[i].name == roiItems[j].mProperties.title) {
                        bROISelected = true;
                        break;
                    }
                }

                if (!bROISelected) {
                    rois.splice(i, 1);
                    i--;
                }
            }

            //删除保存在roisForCorSag中没有选中的roi项
            for (var i = 0; i < roisForCorSag.length; i++) {
                var bROISelected = false;
                for (var j = 0; j < roiItems.length; j++) {
                    if (roisForCorSag[i].name == roiItems[j].mProperties.title) {
                        bROISelected = true;
                        break;
                    }
                }

                if (!bROISelected) {
                    roisForCorSag.splice(i, 1);
                    i--;
                }
            }

            utils = [];

            //chartSeries = [];
            //删除保存在chartSeries中没有选中的roi项对应的series
            if (oDoseList.getSelectedItem().mProperties.title != preDoseName || oDoseList.getSelectedItem().mProperties.title == 'None') {
                chartSeries = [];
            }
            else {
                for (var i = 0; i < chartSeries.length; i++) {
                    var bROISelected = false;
                    for (var j = 0; j < roiItems.length; j++) {
                        if (chartSeries[i].name == roiItems[j].mProperties.title) {
                            bROISelected = true;
                            break;
                        }
                    }

                    if (!bROISelected) {
                        chartSeries.splice(i, 1);
                        i--;
                    }
                }
            }
            preDoseName = oDoseList.getSelectedItem().mProperties.title;


            var getPointROIs = [], getDVHROIs = [], ajaxGetDone = [];
            for (var i = 0; i < roiItems.length; i++) {
                var bInRois = false;
                for (var j = 0; j < rois.length; j++) {
                    if (roiItems[i].mProperties.title == rois[j].name) {
                        bInRois = true;
                        break;
                    }
                }
                if (!bInRois) {
                    getPointROIs.push(roiItems[i].mProperties.title);
                }

                var bInChartSeries = false;
                for (var j = 0; j < chartSeries.length; j++) {
                    if (roiItems[i].mProperties.title == chartSeries[j].name) {
                        bInChartSeries = true;
                        break;
                    }
                }
                if (!bInChartSeries && oDoseList.getSelectedItem().mProperties.title != 'None') {
                    getDVHROIs.push(roiItems[i].mProperties.title);
                }
            }
            for (var i = 0; i < getPointROIs.length; i++) {
                ajaxGetDone.push(false);
            }
            for (var i = 0; i < getDVHROIs.length; i++) {
                ajaxGetDone.push(false);
            }

            var index = 0;
            for (var i = 0; i < getPointROIs.length; i++) {
                $.when(getROIPoints(getPointROIs[i]))
                    .done(function() {
                        ajaxGetDone[index] = true;
                        index++;
                        var allDone = true;
                        for (var j = 0; j < ajaxGetDone.length; j++) {
                            if (ajaxGetDone[j] == false) {
                                allDone = false;
                            }
                        }

                        if (allDone) {
                            for (var j = 0; j < roisForCorSag.length; j++) {
                                var util = new roiUtil(roisForCorSag[j].data, header);
                                utils.push(util);
                            }

                            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                                //getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title);
                                $.when(getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title))
                                    .done(function (data) {
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    })
                                    .fail(function(){
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    });
                            }
                            else {
                                //更新各个canvas的roi和dose
                                syncCTAxial();
                                syncCTCoronal();
                                syncCTSagittal();

                                oDialog.setBusy(false);
                                oDialog.close();
                            }
                        }
                    })
                    .fail(function(){
                        ajaxGetDone[index] = true;
                        index++;
                        var allDone = true;
                        for (var j = 0; j < ajaxGetDone.length; j++) {
                            if (ajaxGetDone[j] == false) {
                                allDone = false;
                            }
                        }

                        if (allDone) {
                            for (var j = 0; j < roisForCorSag.length; j++) {
                                var util = new roiUtil(roisForCorSag[j].data, header);
                                utils.push(util);
                            }

                            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                                //getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title);
                                $.when(getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title))
                                    .done(function (data) {
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    })
                                    .fail(function(){
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    });
                            }
                            else {
                                //更新各个canvas的roi和dose
                                syncCTAxial();
                                syncCTCoronal();
                                syncCTSagittal();

                                oDialog.setBusy(false);
                                oDialog.close();
                            }
                        }
                    });
            }

            if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                for (var i = 0; i < getDVHROIs.length; i++) {
                    $.when(getDVHdata(getDVHROIs[i], oDoseList.getSelectedItem().mProperties.title))
                        .done(function() {
                            ajaxGetDone[index] = true;
                            index++;
                            var allDone = true;
                            for (var j = 0; j < ajaxGetDone.length; j++) {
                                if (ajaxGetDone[j] == false) {
                                    allDone = false;
                                }
                            }

                            if (allDone) {
                                for (var j = 0; j < roisForCorSag.length; j++) {
                                    var util = new roiUtil(roisForCorSag[j].data, header);
                                    utils.push(util);
                                }

                                //if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                                //getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title);
                                $.when(getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title))
                                    .done(function (data) {
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    })
                                    .fail(function(){
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    });
                                //}
                                //else {
                                //    //更新各个canvas的roi和dose
                                //    syncCTAxial();
                                //    syncCTCoronal();
                                //    syncCTSagittal();
                                //
                                //    oDialog.setBusy(false);
                                //    oDialog.close();
                                //}
                            }
                        })
                        .fail(function(){
                            ajaxGetDone[index] = true;
                            index++;
                            var allDone = true;
                            for (var j = 0; j < ajaxGetDone.length; j++) {
                                if (ajaxGetDone[j] == false) {
                                    allDone = false;
                                }
                            }

                            if (allDone) {
                                for (var j = 0; j < roisForCorSag.length; j++) {
                                    var util = new roiUtil(roisForCorSag[j].data, header);
                                    utils.push(util);
                                }

                                //if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                                //getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title);
                                $.when(getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title))
                                    .done(function (data) {
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    })
                                    .fail(function(){
                                        //更新各个canvas的roi和dose
                                        syncCTAxial();
                                        syncCTCoronal();
                                        syncCTSagittal();

                                        oDialog.setBusy(false);
                                        oDialog.close();
                                    });
                                //}
                                //else {
                                //    //更新各个canvas的roi和dose
                                //    syncCTAxial();
                                //    syncCTCoronal();
                                //    syncCTSagittal();
                                //
                                //    oDialog.setBusy(false);
                                //    oDialog.close();
                                //}
                            }
                        });
                }
            }

            if (getPointROIs.length == 0 && getDVHROIs.length == 0) {
                for (var j = 0; j < roisForCorSag.length; j++) {
                    var util = new roiUtil(roisForCorSag[j].data, header);
                    utils.push(util);
                }

                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    //getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title);
                    $.when(getDoseHeaderInfo(oDoseList.getSelectedItem().mProperties.title))
                        .done(function(data) {
                            //更新各个canvas的roi和dose
                            syncCTAxial();
                            syncCTCoronal();
                            syncCTSagittal();

                            oDialog.setBusy(false);
                            oDialog.close();
                        })
                        .fail(function(){
                            //更新各个canvas的roi和dose
                            syncCTAxial();
                            syncCTCoronal();
                            syncCTSagittal();

                            oDialog.setBusy(false);
                            oDialog.close();
                        });
                }
                else {
                    //更新各个canvas的roi和dose
                    syncCTAxial();
                    syncCTCoronal();
                    syncCTSagittal();

                    oDialog.setBusy(false);
                    oDialog.close();
                }
            }
        }
    });

    var oDialogCancelBtn = new sap.m.Button({
        text: "Cancel",
        width: "50%",
        press:function(){
            oDialog.close();
        }
    });

    var oDialogCloseBtn = new sap.m.Button({
        text: "Close",
        width: "100%",
        press:function(){
            oDialog.close();
        }
    });

    var oDialog = new sap.m.Dialog({
        showHeader: false,
        contentHeight: "350px",
        contentWidth: "400px"
    });

    var oROIList = new sap.m.ListBase({
        mode: sap.m.ListMode.MultiSelect
    });

    var oDoseList = new sap.m.ListBase({
        mode: sap.m.ListMode.SingleSelect
    });
    var oDoseListItem1 = new sap.m.StandardListItem({
        title: 'None',
        selected: true
    });
    oDoseList.addItem(oDoseListItem1);

    var filterPage = getFilterPage();
    oDialog.addContent(filterPage);

    var dvhChart = new sap.ui.core.HTML({
        content: '<div id="container1" style="height: 350px; width: 100%; background-color: white"></div>',
        afterRendering: function (e) {
            //var container1 = document.getElementById('container1');
            //container1.style.height = (window.innerHeight - 48 - 48 - 8 - 8)/2 + 'px';

            $('#container1').highcharts({
                chart: {
                    zoomType: 'x,y',
                    spacingRight: 20
                },
                title: {
                    text: 'Dose Volume Histogram'
                },
                xAxis: {
                    gridLineDashStyle: 'Dash',
                    gridLineWidth: 1,
                    maxZoom: 1,
                    title: {
                        text: 'Dose(cGy)'
                    }
                },
                yAxis: {
                    gridLineDashStyle: 'Dash',
                    max: 100,
                    min: 0,
                    title: {
                        text: 'Volume(%)'
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: '%'
                },
                legend: {
                    enabled: true
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    line: {
                        lineWidth: 2,
                        marker: {
                            enabled: false
                        },
                        states: {
                            hover: {
                                lineWidth: 2
                            }
                        }
                    }
                },
                series: chartSeries
            });

            //更新DVH图表
            var chart = $('#container1').highcharts();
            while(chart.series.length > 0) {
                chart.series[0].remove(false);
            }
            var seriesColors = [];
            for (var i = 0; i < chartSeries.length; i++) {
                chart.addSeries(chartSeries[i]);
                chart.redraw();

                for (var j = 0; j < rois.length; j++) {
                    if (chartSeries[i].name == rois[j].name) {
                        seriesColors.push(rois[j].color);
                        break;
                    }
                }
            }
            for (var i = 0; i < chart.series.length; i++) {
                chart.series[i].update({
                    color: seriesColors[i]
                });
            }
        }
    });

    var axialLayout = new sap.ui.layout.VerticalLayout({
        width: '100%'
    });

    var axialControlLayout = new sap.m.HBox({
    });

    var coronalLayout = new sap.ui.layout.VerticalLayout({
        width: '100%'
    });

    var coronalControlLayout = new sap.m.HBox({
    });

    var sagittalLayout = new sap.ui.layout.VerticalLayout({
        width: '100%'
    });

    var sagittalControlLayout = new sap.m.HBox({
    });

    var ctAxial, ctCoronal, ctSagittal;
    var bAxialCanvasSetuped = false, bCoronalCanvasSetuped = false, bSagittalCanvasSetuped = false;
    var bAxialPlaying = false, bCoronalPlaying = false, bSagittalPlaying = false;
    var axialPlayBtn, axialLastBtn, axialNextBtn, coronalPlayBtn, coronalLastBtn, coronalNextBtn, sagittalPlayBtn, sagittalLastBtn, sagittalNextBtn;
    var axialSlider, coronalSlider, sagittalSlider;
    var axialReloadBtn, coronalReloadBtn, sagittalReloadBtn;
    var bAxialFullScr = false, bCoronalFullScr = false, bSagittalFullScr = false, bFullScr = false;
    var axialFullScrBtn, coronalFullScrBtn, sagittalFullScrBtn;
    var axialNonFullScrWidth, coronalNonFullScrWidth, sagittalNonFullScrWidth;
    var focusedCTCanvas, bAxialLoaded, bCoronalLoaded, bSagittalLoaded;
    var bOnKeyDown;     //表示是否可响应键盘左右键按下事件
    var preDoseName;
    function initialCTViewControls() {
        axialLayout.removeAllContent();
        axialControlLayout.destroyItems();
        coronalLayout.removeAllContent();
        coronalControlLayout.destroyItems();
        sagittalLayout.removeAllContent();
        sagittalControlLayout.destroyItems();
        bAxialCanvasSetuped = false;
        bCoronalCanvasSetuped = false;
        bSagittalCanvasSetuped = false;
        bAxialFullScr = false;
        bCoronalFullScr = false;
        bSagittalFullScr = false;
        bAxialLoaded = true;
        bCoronalLoaded = true;
        bSagittalLoaded = true;
        mouseDownEvent = null;
        bOnKeyDown = true;

        for (var i = 0; i < paper.projects.length; i++) {
            paper.projects[i].remove();
            i--;
        }

        oDoseList.setSelectedItem(oDoseListItem1, true);
        preDoseName = 'None';
        rois = [], axialROIPaths = [], coronalROIPaths = [], sagittalROIPaths = [], roisForCorSag = [];
        chartSeries = [];
        var chart = $('#container1').highcharts();
        if (chart != undefined) {
            while (chart.series.length > 0) {
                chart.series[0].remove(false);
            }
            chart.redraw();
        }

        paper.install(window);
        var tool = new Tool();
        tool.onKeyDown = function(event) {
            if (event.key == 'left') {
                switch (focusedCTCanvas) {
                    case 'AxialCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            axialPlay(false);
                        }
                        break;
                    case 'CoronalCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            coronalPlay(false);
                        }
                        break;
                    case 'SagittalCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            sagittalPlay(false);
                        }
                        break;
                    default:
                        break;
                }
            }
            else if (event.key == 'right') {
                switch (focusedCTCanvas) {
                    case 'AxialCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            axialPlay(true);
                        }
                        break;
                    case 'CoronalCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            coronalPlay(true);
                        }
                        break;
                    case 'SagittalCanvas':
                        if (bOnKeyDown) {
                            bOnKeyDown = false;
                            sagittalPlay(true);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        xValue = Math.round(x_dim/2), yValue = Math.round(y_dim/2), zValue = Math.round(z_dim/2);
        ctAxial = new sap.ui.core.HTML({
            content: '<div id="container2" style="height: 375px; position:relative; background-color: black">' +
            '<div id="axialLoader" style="position:absolute; left:0px; top:0px; width:100%; height:410px; background-color:#FFFFFF; opacity: 0.7; z-index: -100">' +
            '<div style="position: absolute; left: 50%; top: 50%; margin-left: -32px; margin-top: -32px;">' +
            '<img src="loader.gif">' +
            '</div>' +
            '</div>' +
            '<canvas id="AxialCanvas" resize style="background-color:black"></canvas>' +
            '<div id="topleft1" style="position: absolute;top:0px; left:0px; color: white">' +
            patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex +
            '</div>' +
            '<div id="topright1" style="position: absolute;top:0px; right:0px; text-align: right; color: white">' +
            institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition +
            '</div>' +
            '<div id="bottomleft1" style="position: absolute;bottom:0px; left:0px; color: white">' +
            'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation +
            '</div>' +
            '<div style="position: absolute;bottom:72px; left:10px;">' +
            '<img src="pic_axial.png">' +
            '</div>' +
            '<div id="bottomright1" style="position: absolute;bottom:0px; right:0px; text-align: right; color: white">' +
            studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime +
            '</div>' +
            '<div id="topcenter1" style="position: absolute;top:0px; left:0px; text-align: center; color: cyan">A</div>' +
            '<div id="topbottom1" style="position: absolute;bottom:0px; left:0px; text-align: center; color: cyan">P</div>' +
            '<div id="leftcenter1" style="position: absolute;top:0px; left:0px; color: cyan">R</div>' +
            '<div id="rightcenter1" style="position: absolute;top:0px; right:0px; text-align: right; color: cyan">L</div>' +
            '</div>',
            afterRendering: function (e) {
                if (!bAxialFullScr && !bAxialCanvasSetuped) {
                    var container2 = document.getElementById('container2');
                    container2.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 - 35 + 'px';
                    var axialLoader = document.getElementById('axialLoader');
                    axialLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 + 'px';

                    //paper.install(window);
                    paper.setup('AxialCanvas');
                    bAxialCanvasSetuped = true;
                    var AxialView = view;

                    //updateAxialDirection(AxialView);
                    var topcenter1 = document.getElementById('topcenter1');
                    var topbottom1 = document.getElementById('topbottom1');
                    var leftcenter1 = document.getElementById('leftcenter1');
                    var rightcenter1 = document.getElementById('rightcenter1');
                    topcenter1.style.left = AxialView.size.width / 2 + 'px';
                    topbottom1.style.left = AxialView.size.width / 2 + 'px';
                    leftcenter1.style.top = AxialView.size.height / 2 + 'px';
                    rightcenter1.style.top = AxialView.size.height / 2 + 'px';
                    axialNonFullScrWidth = AxialView.size.width;
                    axialSlider.setWidth((AxialView.size.width-35-35-35-35-35)+'px');

                    if (axialDoseRaster != null) {
                        axialDoseRaster.remove();
                    }

                    axialRaster = new Raster(serverurl+'/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
                    //axialRaster = new Raster('http://192.168.9.19:8080/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
                    axialRaster.onLoad = function () {
                        if (AxialView.size.width >= AxialView.size.height) {
                            axialRaster.size = new Size(AxialView.size.height, AxialView.size.height);
                        }
                        else {
                            axialRaster.size = new Size(AxialView.size.width, AxialView.size.width);
                        }
                    };
                    axialRaster.position = AxialView.center;
                    axialRaster.opacity = 1.0;

                    //AxialView.onResize = function (event) {
                    //    syncCTAxial();
                    //}

                    axialRaster.onMouseMove = function (event) {
                        if (!bAxialPlaying) {
                            var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                            var y = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim)) + 1;
                            document.getElementById('bottomleft1').innerHTML = 'X: ' + x + ' Y: ' + y + '<br/>' + 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                            if(view._id != 'AxialCanvas') {
                                //syncCTAxial();
                                paper.projects[0].activate();
                            }
                            drawCrossDottedLine(event);
                            if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas' && !bAxialFullScr) {
                                drawCrossFullLine(mouseDownEvent);
                            }
                        }
                    }

                    axialRaster.onMouseLeave = function () {
                        document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                        if(xPath1) {
                            xPath1.remove();
                        }
                        if(xPath2) {
                            xPath2.remove();
                        }
                        if(yPath1) {
                            yPath1.remove();
                        }
                        if(yPath2) {
                            yPath2.remove();
                        }
                    }

                    axialRaster.onMouseDown = function (event) {
                        if (bCoronalLoaded && bSagittalLoaded) {
                            focusedCTCanvas = 'AxialCanvas';
                            if (!bAxialPlaying && !bAxialFullScr) {
                                if (coronalTimer) {
                                    bCoronalPlaying = false;
                                    coronalPlayBtn.setIcon("sap-icon://media-play");
                                    coronalPlayBtn.setTooltip("play");
                                    clearInterval(coronalTimer);
                                }
                                if (sagittalTimer) {
                                    bSagittalPlaying = false;
                                    sagittalPlayBtn.setIcon("sap-icon://media-play");
                                    sagittalPlayBtn.setTooltip("play");
                                    clearInterval(sagittalTimer);
                                }

                                xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                                yValue = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim))+1;

                                sagittalSlider.setValue(xValue+1);
                                coronalSlider.setValue(yValue);

                                syncCTAxial();
                                mouseDownEvent = event;
                                drawCrossFullLine(mouseDownEvent);

                                syncCTCoronal();
                                syncCTSagittal();
                            }
                        }
                    }
                }
                else {
                    syncCTAxial();
                }
            }
        });

        bAxialPlaying = false;
        if (axialTimer) {
            clearInterval(axialTimer);
        }
        axialPlayBtn = new sap.m.Button({
            icon : "sap-icon://media-play",
            tooltip : "play",
            press : function() {
                focusedCTCanvas = 'AxialCanvas';
                if (bAxialPlaying) {
                    bAxialPlaying = false;
                    axialPlayBtn.setIcon("sap-icon://media-play");
                    axialPlayBtn.setTooltip("play");
                    clearInterval(axialTimer);
                }
                else {
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }
                    bAxialPlaying = true;
                    axialPlayBtn.setIcon("sap-icon://media-pause");
                    axialPlayBtn.setTooltip("pause");
                    axialTimer = setInterval(axialPlay, 300, true);
                }
            }
        });
        axialPlayBtn.addStyleClass("playBtnStyle");

        axialLastBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-left",
            tooltip : "last",
            press : function() {
                focusedCTCanvas = 'AxialCanvas';
                axialPlay(false);
            }
        });
        axialLastBtn.addStyleClass("playBtnStyle");

        axialNextBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-right",
            tooltip : "next",
            press : function() {
                focusedCTCanvas = 'AxialCanvas';
                axialPlay(true);
            }
        });
        axialNextBtn.addStyleClass("playBtnStyle");

        axialSlider = new sap.m.Slider({
            min: 1,
            max: z_dim,
            value: z_dim - zValue,
            change: function() {
                focusedCTCanvas = '';
                var axialLoader = document.getElementById('axialLoader');
                axialLoader.style.zIndex = 100;
                zValue = z_dim - axialSlider.getValue();

                //if(view._id != 'AxialCanvas') {
                //    paper.setup('AxialCanvas');
                //}
                //paper.setup('AxialCanvas');
                paper.projects[0].activate();
                var AxialView = view;

                var preAxialDoseRaster, preAxialRaster;
                if (axialDoseRaster != null) {
                    //axialDoseRaster.remove();
                    preAxialDoseRaster = axialDoseRaster;
                }
                if (axialRaster != null) {
                    //axialRaster.remove();
                    preAxialRaster = axialRaster;
                }
                for (var i = 0; i < axialROIPaths.length; i++) {
                    axialROIPaths[i].remove();
                    axialROIPaths.splice(i, 1);
                    i--;
                }
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas') {
                    removeCrossLines();
                }

                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    var dose_z = Math.round(((z_dim-zValue-1) * z_pixdim + z_start - doseZOrigin) / dose_z_pixdim);
                    axialDoseRaster = new Raster(serverurl+'/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                    //axialDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_z&z=' + dose_z + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                }

                axialRaster = new Raster(serverurl+'/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
                //axialRaster = new Raster('http://192.168.9.19:8080/dicom?type=xy&dir='+ctDir+'/CT&z=' + zValue * z_pixdim * 10 + '&format=jpeg');
                axialRaster.onLoad = function () {
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        setAxialDose(AxialView, axialDoseRaster, axialRaster);
                    }
                    if (AxialView.size.width >= AxialView.size.height) {
                        axialRaster.size = new Size(AxialView.size.height, AxialView.size.height);
                    }
                    else {
                        axialRaster.size = new Size(AxialView.size.width, AxialView.size.width);
                    }

                    if (preAxialDoseRaster != null) {
                        preAxialDoseRaster.remove();
                    }
                    if (preAxialRaster != null) {
                        preAxialRaster.remove();
                    }
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        axialDoseRaster.opacity = 1.0;
                        axialRaster.opacity = 0.5;
                    }
                    else {
                        axialRaster.opacity = 1.0;
                    }

                    getCTInfo(zValue * z_pixdim * 10);
                    document.getElementById('topleft1').innerHTML = patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex;
                    document.getElementById('topright1').innerHTML = institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition;
                    document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;
                    document.getElementById('bottomright1').innerHTML = studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime;

                    for (var i = 0; i < rois.length; i++) {
                        for (var j = 0; j < rois[i].curve.length; j++) {
                            if (rois[i].curve[j].points[0][0][2] == (z_start + (z_dim-zValue-1)*z_pixdim).toFixed(6)) {
                                var roiPath = new Path();
                                roiPath.strokeColor = rois[i].color;
                                roiPath.strokeWidth = rois[i].line_width;
                                for (var k = 0; k < rois[i].curve[j].points[0].length; k++) {
                                    var pointX = Math.round((rois[i].curve[j].points[0][k][0] - x_start_dicom)/x_pixdim) / x_dim * axialRaster.bounds.width + axialRaster.bounds.left;
                                    var pointY = axialRaster.bounds.bottom - Math.round((rois[i].curve[j].points[0][k][1] - y_start_dicom)/y_pixdim) / y_dim * axialRaster.bounds.height;
                                    roiPath.add(new Point(pointX, pointY));
                                }
                                //break;
                                roiPath.closed = true;
                                axialROIPaths.push(roiPath);
                            }
                        }
                    }

                    bAxialLoaded = true;
                    axialLoader.style.zIndex = -100;
                };
                axialRaster.position = AxialView.center;
                axialRaster.opacity = 0.0;
                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    axialDoseRaster.opacity = 0.0;
                }

                //AxialView.onResize = function (event) {
                //    syncCTAxial();
                //}

                //切换CT图之后需要为新的raster添加鼠标事件，否则不会相应鼠标操作
                axialRaster.onMouseMove = function (event) {
                    if (!bAxialPlaying) {
                        var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                        var y = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim)) + 1;
                        document.getElementById('bottomleft1').innerHTML = 'X: ' + x + ' Y: ' + y + '<br/>' + 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                        if(view._id != 'AxialCanvas') {
                            //syncCTAxial();
                            paper.projects[0].activate();
                        }
                        drawCrossDottedLine(event);
                        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas' && !bAxialFullScr) {
                            drawCrossFullLine(mouseDownEvent);
                        }
                    }
                }

                axialRaster.onMouseLeave = function () {
                    document.getElementById('bottomleft1').innerHTML = 'Im: ' + (z_dim - zValue) + '/' + z_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + sliceThickness + ' L: ' + sliceLocation;

                    if(xPath1) {
                        xPath1.remove();
                    }
                    if(xPath2) {
                        xPath2.remove();
                    }
                    if(yPath1) {
                        yPath1.remove();
                    }
                    if(yPath2) {
                        yPath2.remove();
                    }
                }

                axialRaster.onMouseDown = function (event) {
                    if (bCoronalLoaded && bSagittalLoaded) {
                        focusedCTCanvas = 'AxialCanvas';
                        if (!bAxialPlaying && !bAxialFullScr) {
                            if (coronalTimer) {
                                bCoronalPlaying = false;
                                coronalPlayBtn.setIcon("sap-icon://media-play");
                                coronalPlayBtn.setTooltip("play");
                                clearInterval(coronalTimer);
                            }
                            if (sagittalTimer) {
                                bSagittalPlaying = false;
                                sagittalPlayBtn.setIcon("sap-icon://media-play");
                                sagittalPlayBtn.setTooltip("play");
                                clearInterval(sagittalTimer);
                            }

                            xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                            yValue = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * parseFloat(y_dim))+1;

                            sagittalSlider.setValue(xValue+1);
                            coronalSlider.setValue(yValue);

                            syncCTAxial();
                            mouseDownEvent = event;
                            drawCrossFullLine(mouseDownEvent);

                            syncCTCoronal();
                            syncCTSagittal();
                        }
                    }
                }
            }
        });
        axialSlider.addStyleClass("axialSliderStyle");

        axialReloadBtn = new sap.m.Button({
            icon : "sap-icon://refresh",
            tooltip : "reload",
            press : function() {
                syncCTAxial();
            }
        });
        axialReloadBtn.addStyleClass("playBtnStyle");

        bAxialFullScr = false;
        axialFullScrBtn = new sap.m.Button({
            icon : "sap-icon://full-screen",
            tooltip : "Full Screen",
            press : function() {
                focusedCTCanvas = 'AxialCanvas';
                if (bAxialFullScr) {
                    bAxialFullScr = false;
                    axialFullScrBtn.setIcon("sap-icon://full-screen");
                    axialFullScrBtn.setTooltip("Full Screen");
                    oPatientDetailCTPage.removeAllContent();
                    axialRaster.opacity = 0.0;
                    if (axialDoseRaster != null) {
                        axialDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < axialROIPaths.length; i++) {
                        axialROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas') {
                        removeCrossLines();
                    }

                    var container2 = document.getElementById('container2');
                    container2.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 - 35 + 'px';
                    var axialLoader = document.getElementById('axialLoader');
                    axialLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*4/7 + 'px';
                    oPatientDetailCTPage.addContent(axialGridspan);
                    oPatientDetailCTPage.addContent(corSagGridspan);
                }
                else {
                    bAxialFullScr = true;
                    axialFullScrBtn.setIcon("sap-icon://exit-full-screen");
                    axialFullScrBtn.setTooltip("Exit Full Screen");
                    axialGridspan.removeAllContent();
                    oPatientDetailCTPage.removeAllContent();
                    axialRaster.opacity = 0.0;
                    if (axialDoseRaster != null) {
                        axialDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < axialROIPaths.length; i++) {
                        axialROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'AxialCanvas') {
                        removeCrossLines();
                    }

                    var container2 = document.getElementById('container2');
                    container2.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
                    var axialLoader = document.getElementById('axialLoader');
                    axialLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
                    axialGridspan.addContent(axialLayout);
                    oPatientDetailCTPage.addContent(axialGridspan);
                }
            }
        });
        axialFullScrBtn.addStyleClass("playBtnStyle");

        axialControlLayout.addItem(axialPlayBtn);
        axialControlLayout.addItem(axialLastBtn);
        axialControlLayout.addItem(axialNextBtn);
        axialControlLayout.addItem(axialSlider);
        axialControlLayout.addItem(axialReloadBtn);
        axialControlLayout.addItem(axialFullScrBtn);
        axialLayout.addContent(ctAxial);
        axialLayout.addContent(axialControlLayout);

        ctCoronal = new sap.ui.core.HTML({
            content: '<div id="container3" style="height: 375px; position:relative; background-color: black">' +
            '<div id="coronalLoader" style="position:absolute; left:0px; top:0px; width:100%; height:410px; background-color:#FFFFFF; opacity: 0.7; z-index: -100">' +
            '<div style="position: absolute; left: 50%; top: 50%; margin-left: -32px; margin-top: -32px;">' +
            '<img src="loader.gif">' +
            '</div>' +
            '</div>' +
            '<canvas id="CoronalCanvas" resize style="background-color:black"></canvas>' +
            '<div id="topleft2" style="position: absolute;top:0px; left:0px; color: white">' +
            patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex +
            '</div>' +
            '<div id="topright2" style="position: absolute;top:0px; right:0px; text-align: right; color: white">' +
            institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition +
            '</div>' +
            '<div id="bottomleft2" style="position: absolute;bottom:0px; left:0px; color: white">' +
            'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm' +
            '</div>' +
            '<div style="position: absolute;bottom:72px; left:10px;">' +
            '<img src="pic_coronal.png">' +
            '</div>' +
            '<div id="bottomright2" style="position: absolute;bottom:0px; right:0px; text-align: right; color: white">' +
            studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime +
            '</div>' +
            '<div id="topcenter2" style="position: absolute;top:0px; left:0px; text-align: center; color: cyan">H</div>' +
            '<div id="topbottom2" style="position: absolute;bottom:0px; left:0px; text-align: center; color: cyan">F</div>' +
            '<div id="leftcenter2" style="position: absolute;top:0px; left:0px; color: cyan">R</div>' +
            '<div id="rightcenter2" style="position: absolute;top:0px; right:0px; text-align: right; color: cyan">L</div>' +
            '</div>',
            afterRendering: function (e) {
                if (!bCoronalFullScr && !bCoronalCanvasSetuped) {
                    var container3 = document.getElementById('container3');
                    container3.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
                    var coronalLoader = document.getElementById('coronalLoader');
                    coronalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';

                    //paper.install(window);
                    paper.setup('CoronalCanvas');
                    bCoronalCanvasSetuped = true;
                    var CoronalView = view;

                    var topcenter2 = document.getElementById('topcenter2');
                    var topbottom2 = document.getElementById('topbottom2');
                    var leftcenter2 = document.getElementById('leftcenter2');
                    var rightcenter2 = document.getElementById('rightcenter2');
                    topcenter2.style.left = CoronalView.size.width / 2 + 'px';
                    topbottom2.style.left = CoronalView.size.width / 2 + 'px';
                    leftcenter2.style.top = CoronalView.size.height / 2 + 'px';
                    rightcenter2.style.top = CoronalView.size.height / 2 + 'px';
                    coronalNonFullScrWidth = CoronalView.size.width;
                    coronalSlider.setWidth((CoronalView.size.width-35-35-35-35-35)+'px');

                    if (coronalDoseRaster != null) {
                        coronalDoseRaster.remove();
                    }

                    coronalRaster = new Raster(serverurl+'/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
                    //coronalRaster = new Raster('http://192.168.9.19:8080/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
                    coronalRaster.onLoad = function () {
                        //coronalRaster.transform(new Matrix(1, 0, 0, -1, 0, coronalRaster.height));
                        if (CoronalView.size.width / CoronalView.size.height >= coronalRaster.width / coronalRaster.height) {
                            coronalRaster.scale(CoronalView.size.height / coronalRaster.width);
                        }
                        else {
                            coronalRaster.scale(CoronalView.size.width / coronalRaster.width);
                        }
                    };
                    coronalRaster.position = CoronalView.center;
                    coronalRaster.opacity = 1.0;

                    //CoronalView.onResize = function (event) {
                    //    syncCTCoronal();
                    //}

                    coronalRaster.onMouseMove = function (event) {
                        if (!bCoronalPlaying) {
                            var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                            var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                            document.getElementById('bottomleft2').innerHTML = 'X: ' + x + ' Z: ' + z + '<br/>' + 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                            if(view._id != 'CoronalCanvas') {
                                //syncCTCoronal();
                                paper.projects[1].activate();
                            }
                            drawCrossDottedLine(event);
                            if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas' && !bCoronalFullScr) {
                                drawCrossFullLine(mouseDownEvent);
                            }
                        }
                    }

                    coronalRaster.onMouseLeave = function () {
                        document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                        if(xPath1) {
                            xPath1.remove();
                        }
                        if(xPath2) {
                            xPath2.remove();
                        }
                        if(yPath1) {
                            yPath1.remove();
                        }
                        if(yPath2) {
                            yPath2.remove();
                        }
                    }

                    coronalRaster.onMouseDown = function (event) {
                        if (bAxialLoaded && bSagittalLoaded) {
                            focusedCTCanvas = 'CoronalCanvas';
                            if (!bCoronalPlaying && !bCoronalFullScr) {
                                if (axialTimer) {
                                    bAxialPlaying = false;
                                    axialPlayBtn.setIcon("sap-icon://media-play");
                                    axialPlayBtn.setTooltip("play");
                                    clearInterval(axialTimer);
                                }
                                if (sagittalTimer) {
                                    bSagittalPlaying = false;
                                    sagittalPlayBtn.setIcon("sap-icon://media-play");
                                    sagittalPlayBtn.setTooltip("play");
                                    clearInterval(sagittalTimer);
                                }

                                xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                                zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                                sagittalSlider.setValue(xValue+1);
                                axialSlider.setValue(z_dim - zValue);

                                syncCTCoronal();
                                mouseDownEvent = event;
                                drawCrossFullLine(mouseDownEvent);

                                syncCTAxial();
                                syncCTSagittal();
                            }
                        }
                    }
                }
                else {
                    syncCTCoronal();
                }
            }
        });

        bCoronalPlaying = false;
        if (coronalTimer) {
            clearInterval(coronalTimer);
        }
        coronalPlayBtn = new sap.m.Button({
            icon : "sap-icon://media-play",
            tooltip : "play",
            press : function() {
                focusedCTCanvas = 'CoronalCanvas';
                if (bCoronalPlaying) {
                    bCoronalPlaying = false;
                    coronalPlayBtn.setIcon("sap-icon://media-play");
                    coronalPlayBtn.setTooltip("play");
                    clearInterval(coronalTimer);
                }
                else {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (sagittalTimer) {
                        bSagittalPlaying = false;
                        sagittalPlayBtn.setIcon("sap-icon://media-play");
                        sagittalPlayBtn.setTooltip("play");
                        clearInterval(sagittalTimer);
                    }
                    bCoronalPlaying = true;
                    coronalPlayBtn.setIcon("sap-icon://media-pause");
                    coronalPlayBtn.setTooltip("pause");
                    coronalTimer = setInterval(coronalPlay, 300, true);
                }
            }
        });
        coronalPlayBtn.addStyleClass("playBtnStyle");

        coronalLastBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-left",
            tooltip : "last",
            press : function() {
                focusedCTCanvas = 'CoronalCanvas';
                coronalPlay(false);
            }
        });
        coronalLastBtn.addStyleClass("playBtnStyle");

        coronalNextBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-right",
            tooltip : "next",
            press : function() {
                focusedCTCanvas = 'CoronalCanvas';
                coronalPlay(true);
            }
        });
        coronalNextBtn.addStyleClass("playBtnStyle");

        coronalSlider = new sap.m.Slider({
            min: 1,
            max: y_dim,
            value: yValue,
            change: function() {
                focusedCTCanvas = '';
                var coronalLoader = document.getElementById('coronalLoader');
                coronalLoader.style.zIndex = 100;
                yValue = coronalSlider.getValue();
                //if(view._id != 'CoronalCanvas') {
                //    paper.setup('CoronalCanvas');
                //}
                //paper.setup('CoronalCanvas');
                paper.projects[1].activate();
                var CoronalView = view;

                var preCoronalDoseRaster, preCoronalRaster;
                if (coronalDoseRaster != null) {
                    //coronalDoseRaster.remove();
                    preCoronalDoseRaster = coronalDoseRaster;
                }
                if (coronalRaster != null) {
                    //coronalRaster.remove();
                    preCoronalRaster = coronalRaster;
                }
                for (var i = 0; i < coronalROIPaths.length; i++) {
                    coronalROIPaths[i].remove();
                    coronalROIPaths.splice(i, 1);
                    i--;
                }
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas') {
                    removeCrossLines();
                }

                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    var dose_y = Math.round(((yValue-1) * y_pixdim + y_start_dicom - doseYOrigin) / dose_y_pixdim);
                    coronalDoseRaster = new Raster(serverurl+'/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                    //coronalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_y&y=' + dose_y + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                }

                coronalRaster = new Raster(serverurl+'/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
                //coronalRaster = new Raster('http://192.168.9.19:8080/dicom?type=xz&dir='+ctDir+'/CT&y=' + (yValue-1) + '&format=jpeg');
                coronalRaster.onLoad = function () {
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        setCoronalDose(CoronalView, coronalDoseRaster, coronalRaster);
                    }
                    //coronalRaster.transform(new Matrix(1, 0, 0, -1, 0, coronalRaster.height));
                    var rasterWidth;
                    if (CoronalView.size.width / CoronalView.size.height >= coronalRaster.width / coronalRaster.height) {
                        //coronalRaster.scale(CoronalView.size.height / coronalRaster.height);
                        coronalRaster.scale(CoronalView.size.height / coronalRaster.width);
                        rasterWidth = CoronalView.size.height;
                        paper.projects[1].activate();
                        for (var i = 0; i < roisForCorSag.length; i++) {
                            var xz = utils[i].get_xz(yValue - 1);
                            for (var j = 0; j < xz.length/2; j++) {
                                var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, (xz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                                roiPath.strokeColor = roisForCorSag[i].color;
                                roiPath.strokeWidth = roisForCorSag[i].line_width;

                                roiPath.onMouseEnter = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseMove = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseDown = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseDown(evt, event);
                                }

                                coronalROIPaths.push(roiPath);
                            }
                        }
                    }
                    else {
                        coronalRaster.scale(CoronalView.size.width / coronalRaster.width);
                        rasterWidth = CoronalView.size.width;
                        var rasterHeight = CoronalView.size.width / coronalRaster.width * coronalRaster.height;
                        paper.projects[1].activate();
                        for (var i = 0; i < roisForCorSag.length; i++) {
                            var xz = utils[i].get_xz(yValue - 1);
                            for (var j = 0; j < xz.length/2; j++) {
                                var roiPath = new Path.Line(new Point(xz[j*2][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2), new Point(xz[j*2+1][0]*rasterWidth/512+(CoronalView.size.width-rasterWidth)/2, xz[j*2+1][1]*rasterWidth/512+(CoronalView.size.height-rasterHeight)/2));
                                roiPath.strokeColor = roisForCorSag[i].color;
                                roiPath.strokeWidth = roisForCorSag[i].line_width;

                                roiPath.onMouseEnter = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseMove = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseDown = function (evt) {
                                    var event = {target: coronalRaster};
                                    fullLineMouseDown(evt, event);
                                }

                                coronalROIPaths.push(roiPath);
                            }
                        }
                    }
                    document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                    if (preCoronalDoseRaster != null) {
                        preCoronalDoseRaster.remove();
                    }
                    if (preCoronalRaster != null) {
                        preCoronalRaster.remove();
                    }
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        coronalDoseRaster.opacity = 1.0;
                        coronalRaster.opacity = 0.5;
                    }
                    else {
                        coronalRaster.opacity = 1.0;
                    }
                    bCoronalLoaded = true;
                    coronalLoader.style.zIndex = -100;
                };
                coronalRaster.position = CoronalView.center;
                coronalRaster.opacity = 0.0;
                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    coronalDoseRaster.opacity = 0.0;
                }

                //CoronalView.onResize = function (event) {
                //    syncCTCoronal();
                //}

                coronalRaster.onMouseMove = function (event) {
                    if (!bCoronalPlaying) {
                        var x = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim)) + 1;
                        var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                        document.getElementById('bottomleft2').innerHTML = 'X: ' + x + ' Z: ' + z + '<br/>' + 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                        if(view._id != 'CoronalCanvas') {
                            //syncCTCoronal();
                            paper.projects[1].activate();
                        }
                        drawCrossDottedLine(event);
                        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas' && !bCoronalFullScr) {
                            drawCrossFullLine(mouseDownEvent);
                        }
                    }
                }

                coronalRaster.onMouseLeave = function () {
                    document.getElementById('bottomleft2').innerHTML = 'Im: ' + yValue + '/' + y_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[1]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[1]+pixelSpacing[1]*(yValue-1)).toFixed(2) + 'mm';

                    if(xPath1) {
                        xPath1.remove();
                    }
                    if(xPath2) {
                        xPath2.remove();
                    }
                    if(yPath1) {
                        yPath1.remove();
                    }
                    if(yPath2) {
                        yPath2.remove();
                    }
                }

                coronalRaster.onMouseDown = function (event) {
                    if (bAxialLoaded && bSagittalLoaded) {
                        focusedCTCanvas = 'CoronalCanvas';
                        if (!bCoronalPlaying && !bCoronalFullScr) {
                            if (axialTimer) {
                                bAxialPlaying = false;
                                axialPlayBtn.setIcon("sap-icon://media-play");
                                axialPlayBtn.setTooltip("play");
                                clearInterval(axialTimer);
                            }
                            if (sagittalTimer) {
                                bSagittalPlaying = false;
                                sagittalPlayBtn.setIcon("sap-icon://media-play");
                                sagittalPlayBtn.setTooltip("play");
                                clearInterval(sagittalTimer);
                            }

                            xValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(x_dim));
                            zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                            sagittalSlider.setValue(xValue+1);
                            axialSlider.setValue(z_dim - zValue);

                            syncCTCoronal();
                            mouseDownEvent = event;
                            drawCrossFullLine(mouseDownEvent);

                            syncCTAxial();
                            syncCTSagittal();
                        }
                    }
                }
            }
        });
        coronalSlider.addStyleClass("coronalSliderStyle");

        coronalReloadBtn = new sap.m.Button({
            icon : "sap-icon://refresh",
            tooltip : "reload",
            press : function() {
                syncCTCoronal();
            }
        });
        coronalReloadBtn.addStyleClass("playBtnStyle");

        bCoronalFullScr = false;
        coronalFullScrBtn = new sap.m.Button({
            icon : "sap-icon://full-screen",
            tooltip : "Full Screen",
            press : function() {
                focusedCTCanvas = 'CoronalCanvas';
                if (bCoronalFullScr) {
                    bCoronalFullScr = false;
                    coronalFullScrBtn.setIcon("sap-icon://full-screen");
                    coronalFullScrBtn.setTooltip("Full Screen");
                    corSagGridspan.removeAllContent();
                    oPatientDetailCTPage.removeAllContent();
                    coronalRaster.opacity = 0.0;
                    if (coronalDoseRaster != null) {
                        coronalDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < coronalROIPaths.length; i++) {
                        coronalROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas') {
                        removeCrossLines();
                    }

                    var container3 = document.getElementById('container3');
                    container3.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
                    var coronalLoader = document.getElementById('coronalLoader');
                    coronalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';
                    corSagGridspan.setDefaultSpan("L6 M6 S12");
                    corSagGridspan.addContent(coronalLayout).addContent(sagittalLayout);
                    oPatientDetailCTPage.addContent(axialGridspan);
                    oPatientDetailCTPage.addContent(corSagGridspan);
                }
                else {
                    bCoronalFullScr = true;
                    coronalFullScrBtn.setIcon("sap-icon://exit-full-screen");
                    coronalFullScrBtn.setTooltip("Exit Full Screen");
                    corSagGridspan.removeAllContent();
                    oPatientDetailCTPage.removeAllContent();
                    coronalRaster.opacity = 0.0;
                    if (coronalDoseRaster != null) {
                        coronalDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < coronalROIPaths.length; i++) {
                        coronalROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'CoronalCanvas') {
                        removeCrossLines();
                    }

                    var container3 = document.getElementById('container3');
                    container3.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
                    var coronalLoader = document.getElementById('coronalLoader');
                    coronalLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
                    corSagGridspan.setDefaultSpan("L12 M12 S12");
                    corSagGridspan.addContent(coronalLayout);
                    oPatientDetailCTPage.addContent(corSagGridspan);
                }
            }
        });
        coronalFullScrBtn.addStyleClass("playBtnStyle");

        coronalControlLayout.addItem(coronalPlayBtn);
        coronalControlLayout.addItem(coronalLastBtn);
        coronalControlLayout.addItem(coronalNextBtn);
        coronalControlLayout.addItem(coronalSlider);
        coronalControlLayout.addItem(coronalReloadBtn);
        coronalControlLayout.addItem(coronalFullScrBtn);
        coronalLayout.addContent(ctCoronal);
        coronalLayout.addContent(coronalControlLayout);

        ctSagittal = new sap.ui.core.HTML({
            content: '<div id="container4" style="height: 375px; position:relative; background-color: black">' +
            '<div id="sagittalLoader" style="position:absolute; left:0px; top:0px; width:100%; height:410px; background-color:#FFFFFF; opacity: 0.7; z-index: -100">' +
            '<div style="position: absolute; left: 50%; top: 50%; margin-left: -32px; margin-top: -32px;">' +
            '<img src="loader.gif">' +
            '</div>' +
            '</div>' +
            '<canvas id="SagittalCanvas" resize style="background-color:black"></canvas>' +
            '<div id="topleft3" style="position: absolute;top:0px; left:0px; color: white">' +
            patientName + '<br/>' + 'ID: ' + patientID + '<br/>' + patientAge + ', ' + patientSex +
            '</div>' +
            '<div id="topright3" style="position: absolute;top:0px; right:0px; text-align: right; color: white">' +
            institutionName + '<br/>' + manufacturer + '<br/>' + manufacturerModelName + '<br/>' + patientPosition +
            '</div>' +
            '<div id="bottomleft3" style="position: absolute;bottom:0px; left:0px; color: white">' +
            'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm' +
            '</div>' +
            '<div style="position: absolute;bottom:72px; left:10px;">' +
            '<img src="pic_sagittal.png">' +
            '</div>' +
            '<div id="bottomright3" style="position: absolute;bottom:0px; right:0px; text-align: right; color: white">' +
            studyId + '<br/>' + studyDescription + '<br/>' + seriesDescription + '<br/>' + studyDate + ' ' + studyTime +
            '</div>' +
            '<div id="topcenter3" style="position: absolute;top:0px; left:0px; text-align: center; color: cyan">H</div>' +
            '<div id="topbottom3" style="position: absolute;bottom:0px; left:0px; text-align: center; color: cyan">F</div>' +
            '<div id="leftcenter3" style="position: absolute;top:0px; left:0px; color: cyan">A</div>' +
            '<div id="rightcenter3" style="position: absolute;top:0px; right:0px; text-align: right; color: cyan">P</div>' +
            '</div>',
            afterRendering: function (e) {
                if (!bSagittalFullScr && !bSagittalCanvasSetuped) {
                    var container4 = document.getElementById('container4');
                    container4.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
                    var sagittalLoader = document.getElementById('sagittalLoader');
                    sagittalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';

                    //paper.install(window);
                    paper.setup('SagittalCanvas');
                    bSagittalCanvasSetuped = true;
                    var SagittalView = view;

                    var topcenter3 = document.getElementById('topcenter3');
                    var topbottom3 = document.getElementById('topbottom3');
                    var leftcenter3 = document.getElementById('leftcenter3');
                    var rightcenter3 = document.getElementById('rightcenter3');
                    topcenter3.style.left = SagittalView.size.width / 2 + 'px';
                    topbottom3.style.left = SagittalView.size.width / 2 + 'px';
                    leftcenter3.style.top = SagittalView.size.height / 2 + 'px';
                    rightcenter3.style.top = SagittalView.size.height / 2 + 'px';
                    sagittalNonFullScrWidth = SagittalView.size.width;
                    sagittalSlider.setWidth((SagittalView.size.width-35-35-35-35-35)+'px');

                    if (sagittalDoseRaster != null) {
                        sagittalDoseRaster.remove();
                    }

                    sagittalRaster = new Raster(serverurl+'/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
                    //sagittalRaster = new Raster('http://192.168.9.19:8080/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
                    sagittalRaster.onLoad = function () {
                        //sagittalRaster.transform(new Matrix(1, 0, 0, -1, 0, sagittalRaster.height));
                        if (SagittalView.size.width / SagittalView.size.height >= sagittalRaster.width / sagittalRaster.height) {
                            sagittalRaster.scale(SagittalView.size.height / sagittalRaster.width);
                        }
                        else {
                            sagittalRaster.scale(SagittalView.size.width / sagittalRaster.width);
                        }
                    };
                    sagittalRaster.position = SagittalView.center;
                    sagittalRaster.opacity = 1.0;

                    //SagittalView.onResize = function (event) {
                    //    syncCTSagittal();
                    //}

                    sagittalRaster.onMouseMove = function (event) {
                        if (!bSagittalPlaying) {
                            var y = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim)) + 1;
                            var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                            document.getElementById('bottomleft3').innerHTML = 'Y: ' + y + ' Z: ' + z + '<br/>' + 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                            if(view._id != 'SagittalCanvas') {
                                //syncCTSagittal();
                                paper.projects[2].activate();
                            }
                            drawCrossDottedLine(event);
                            if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas' && !bSagittalFullScr) {
                                drawCrossFullLine(mouseDownEvent);
                            }
                        }
                    }

                    sagittalRaster.onMouseLeave = function () {
                        document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                        if(xPath1) {
                            xPath1.remove();
                        }
                        if(xPath2) {
                            xPath2.remove();
                        }
                        if(yPath1) {
                            yPath1.remove();
                        }
                        if(yPath2) {
                            yPath2.remove();
                        }
                    }

                    sagittalRaster.onMouseDown = function (event) {
                        if (bAxialLoaded && bCoronalLoaded) {
                            focusedCTCanvas = 'SagittalCanvas';
                            if (!bSagittalPlaying && !bSagittalFullScr) {
                                if (axialTimer) {
                                    bAxialPlaying = false;
                                    axialPlayBtn.setIcon("sap-icon://media-play");
                                    axialPlayBtn.setTooltip("play");
                                    clearInterval(axialTimer);
                                }
                                if (coronalTimer) {
                                    bCoronalPlaying = false;
                                    coronalPlayBtn.setIcon("sap-icon://media-play");
                                    coronalPlayBtn.setTooltip("play");
                                    clearInterval(coronalTimer);
                                }

                                yValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim))+1;
                                zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                                coronalSlider.setValue(yValue);
                                axialSlider.setValue(z_dim - zValue);

                                syncCTSagittal();
                                mouseDownEvent = event;
                                drawCrossFullLine(mouseDownEvent);

                                syncCTAxial();
                                syncCTCoronal();
                            }
                        }
                    }
                }
                else {
                    syncCTSagittal();
                }
            }
        });

        bSagittalPlaying = false;
        if (sagittalTimer) {
            clearInterval(sagittalTimer);
        }
        sagittalPlayBtn = new sap.m.Button({
            icon : "sap-icon://media-play",
            tooltip : "play",
            press : function() {
                focusedCTCanvas = 'SagittalCanvas';
                if (bSagittalPlaying) {
                    bSagittalPlaying = false;
                    sagittalPlayBtn.setIcon("sap-icon://media-play");
                    sagittalPlayBtn.setTooltip("play");
                    clearInterval(sagittalTimer);
                }
                else {
                    if (axialTimer) {
                        bAxialPlaying = false;
                        axialPlayBtn.setIcon("sap-icon://media-play");
                        axialPlayBtn.setTooltip("play");
                        clearInterval(axialTimer);
                    }
                    if (coronalTimer) {
                        bCoronalPlaying = false;
                        coronalPlayBtn.setIcon("sap-icon://media-play");
                        coronalPlayBtn.setTooltip("play");
                        clearInterval(coronalTimer);
                    }
                    bSagittalPlaying = true;
                    sagittalPlayBtn.setIcon("sap-icon://media-pause");
                    sagittalPlayBtn.setTooltip("pause");
                    sagittalTimer = setInterval(sagittalPlay, 300, true);
                }
            }
        });
        sagittalPlayBtn.addStyleClass("playBtnStyle");

        sagittalLastBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-left",
            tooltip : "last",
            press : function() {
                focusedCTCanvas = 'SagittalCanvas';
                sagittalPlay(false);
            }
        });
        sagittalLastBtn.addStyleClass("playBtnStyle");

        sagittalNextBtn = new sap.m.Button({
            icon : "sap-icon://slim-arrow-right",
            tooltip : "next",
            press : function() {
                focusedCTCanvas = 'SagittalCanvas';
                sagittalPlay(true);
            }
        });
        sagittalNextBtn.addStyleClass("playBtnStyle");

        sagittalSlider = new sap.m.Slider({
            min: 1,
            max: x_dim,
            value: xValue,
            change: function() {
                focusedCTCanvas = '';
                var sagittalLoader = document.getElementById('sagittalLoader');
                sagittalLoader.style.zIndex = 100;
                xValue = sagittalSlider.getValue()-1;
                //if(view._id != 'SagittalCanvas') {
                //    paper.setup('SagittalCanvas');
                //}
                //paper.setup('SagittalCanvas');
                paper.projects[2].activate();
                var SagittalView = view;

                var preSagittalDoseRaster, preSagittalRaster;
                if (sagittalDoseRaster != null) {
                    //sagittalDoseRaster.remove();
                    preSagittalDoseRaster = sagittalDoseRaster;
                }
                if (sagittalRaster != null) {
                    //sagittalRaster.remove();
                    preSagittalRaster = sagittalRaster;
                }
                for (var i = 0; i < sagittalROIPaths.length; i++) {
                    sagittalROIPaths[i].remove();
                    sagittalROIPaths.splice(i, 1);
                    i--;
                }
                if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas') {
                    removeCrossLines();
                }

                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    var dose_x = Math.round((xValue * x_pixdim + x_start_dicom - doseXOrigin) / dose_x_pixdim);
                    sagittalDoseRaster = new Raster(serverurl+'/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                    //sagittalDoseRaster = new Raster('http://192.168.9.19:8080/dose?type=dose_x&x=' + dose_x + '&dir='+ctDir+'/Dose/' + oDoseList.getSelectedItem().mProperties.title);
                }

                sagittalRaster = new Raster(serverurl+'/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
                //sagittalRaster = new Raster('http://192.168.9.19:8080/dicom?type=yz&dir='+ctDir+'/CT&x=' + xValue + '&format=jpeg');
                sagittalRaster.onLoad = function () {
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        setSagittalDose(SagittalView, sagittalDoseRaster, sagittalRaster);
                    }
                    //sagittalRaster.transform(new Matrix(1, 0, 0, -1, 0, sagittalRaster.height));
                    var rasterWidth;
                    if (SagittalView.size.width / SagittalView.size.height >= sagittalRaster.width / sagittalRaster.height) {
                        sagittalRaster.scale(SagittalView.size.height / sagittalRaster.width);
                        rasterWidth = SagittalView.size.height;
                        paper.projects[2].activate();
                        for (var i = 0; i < roisForCorSag.length; i++) {
                            var yz = utils[i].get_yz(xValue);
                            for (var j = 0; j < yz.length/2; j++) {
                                var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, (yz[j*2+1][1]+(512-z_dim*5)/2+z_pixdim/x_pixdim/2)*rasterWidth/512));
                                roiPath.strokeColor = roisForCorSag[i].color;
                                roiPath.strokeWidth = roisForCorSag[i].line_width;

                                roiPath.onMouseEnter = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseMove = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseDown = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseDown(evt, event);
                                }

                                sagittalROIPaths.push(roiPath);
                            }
                        }
                    }
                    else {
                        sagittalRaster.scale(SagittalView.size.width / sagittalRaster.width);
                        rasterWidth = SagittalView.size.width;
                        var rasterHeight = SagittalView.size.width / sagittalRaster.width * sagittalRaster.height;
                        paper.projects[2].activate();
                        for (var i = 0; i < roisForCorSag.length; i++) {
                            var yz = utils[i].get_yz(xValue);
                            for (var j = 0; j < yz.length/2; j++) {
                                var roiPath = new Path.Line(new Point(yz[j*2][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2), new Point(yz[j*2+1][0]*rasterWidth/512+(SagittalView.size.width-rasterWidth)/2, yz[j*2+1][1]*rasterWidth/512+(SagittalView.size.height-rasterHeight)/2));
                                roiPath.strokeColor = roisForCorSag[i].color;
                                roiPath.strokeWidth = roisForCorSag[i].line_width;

                                roiPath.onMouseEnter = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseMove = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseEnterMove(evt, event);
                                }

                                roiPath.onMouseDown = function (evt) {
                                    var event = {target: sagittalRaster};
                                    fullLineMouseDown(evt, event);
                                }

                                sagittalROIPaths.push(roiPath);
                            }
                        }
                    }
                    document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                    if (preSagittalDoseRaster != null) {
                        preSagittalDoseRaster.remove();
                    }
                    if (preSagittalRaster != null) {
                        preSagittalRaster.remove();
                    }
                    if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                        sagittalDoseRaster.opacity = 1.0;
                        sagittalRaster.opacity = 0.5;
                    }
                    else {
                        sagittalRaster.opacity = 1.0;
                    }
                    bSagittalLoaded = true;
                    sagittalLoader.style.zIndex = -100;
                };
                sagittalRaster.position = SagittalView.center;
                sagittalRaster.opacity = 0.0;
                if (oDoseList.getSelectedItem().mProperties.title != 'None') {
                    sagittalDoseRaster.opacity = 0.0;
                }

                //SagittalView.onResize = function (event) {
                //    syncCTSagittal();
                //}

                sagittalRaster.onMouseMove = function (event) {
                    if (!bSagittalPlaying) {
                        var y = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim)) + 1;
                        var z = Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);
                        document.getElementById('bottomleft3').innerHTML = 'Y: ' + y + ' Z: ' + z + '<br/>' + 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                        if(view._id != 'SagittalCanvas') {
                            //syncCTSagittal();
                            paper.projects[2].activate();
                        }
                        drawCrossDottedLine(event);
                        if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas' && !bSagittalFullScr) {
                            drawCrossFullLine(mouseDownEvent);
                        }
                    }
                }

                sagittalRaster.onMouseLeave = function () {
                    document.getElementById('bottomleft3').innerHTML = 'Im: ' + (xValue+1) + '/' + x_dim + '<br/>' + 'WW: ' + windowWidth + ' WC: ' + windowCenter + '<br/>' + 'T: ' + parseFloat(pixelSpacing[0]).toFixed(2) + 'mm' + ' L: ' + parseFloat(imagePosition[0]+pixelSpacing[0]*xValue).toFixed(2) + 'mm';

                    if(xPath1) {
                        xPath1.remove();
                    }
                    if(xPath2) {
                        xPath2.remove();
                    }
                    if(yPath1) {
                        yPath1.remove();
                    }
                    if(yPath2) {
                        yPath2.remove();
                    }
                }

                sagittalRaster.onMouseDown = function (event) {
                    if (bAxialLoaded && bCoronalLoaded) {
                        focusedCTCanvas = 'SagittalCanvas';
                        if (!bSagittalPlaying && !bSagittalFullScr) {
                            if (axialTimer) {
                                bAxialPlaying = false;
                                axialPlayBtn.setIcon("sap-icon://media-play");
                                axialPlayBtn.setTooltip("play");
                                clearInterval(axialTimer);
                            }
                            if (coronalTimer) {
                                bCoronalPlaying = false;
                                coronalPlayBtn.setIcon("sap-icon://media-play");
                                coronalPlayBtn.setTooltip("play");
                                clearInterval(coronalTimer);
                            }

                            yValue = Math.round((event.point.x - event.target.bounds.left) / event.target.bounds.width * parseFloat(y_dim))+1;
                            zValue = z_dim - Math.round((event.point.y - event.target.bounds.top) / event.target.bounds.height * z_dim);

                            coronalSlider.setValue(yValue);
                            axialSlider.setValue(z_dim - zValue);

                            syncCTSagittal();
                            mouseDownEvent = event;
                            drawCrossFullLine(mouseDownEvent);

                            syncCTAxial();
                            syncCTCoronal();
                        }
                    }
                }
            }
        });
        sagittalSlider.addStyleClass("sagittalSliderStyle");

        sagittalReloadBtn = new sap.m.Button({
            icon : "sap-icon://refresh",
            tooltip : "reload",
            press : function() {
                syncCTSagittal();
            }
        });
        sagittalReloadBtn.addStyleClass("playBtnStyle");

        bSagittalFullScr = false;
        sagittalFullScrBtn = new sap.m.Button({
            icon : "sap-icon://full-screen",
            tooltip : "Full Screen",
            press : function() {
                focusedCTCanvas = 'SagittalCanvas';
                if (bSagittalFullScr) {
                    bSagittalFullScr = false;
                    sagittalFullScrBtn.setIcon("sap-icon://full-screen");
                    sagittalFullScrBtn.setTooltip("Full Screen");
                    corSagGridspan.removeAllContent();
                    oPatientDetailCTPage.removeAllContent();
                    sagittalRaster.opacity = 0.0;
                    if (sagittalDoseRaster != null) {
                        sagittalDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < sagittalROIPaths.length; i++) {
                        sagittalROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas') {
                        removeCrossLines();
                    }

                    var container4 = document.getElementById('container4');
                    container4.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 - 35 + 'px';
                    var sagittalLoader = document.getElementById('sagittalLoader');
                    sagittalLoader.style.height = (window.innerHeight - 48 - 48 - 8 - 8)*3/7 + 'px';
                    corSagGridspan.setDefaultSpan("L6 M6 S12");
                    corSagGridspan.addContent(coronalLayout).addContent(sagittalLayout);
                    oPatientDetailCTPage.addContent(axialGridspan);
                    oPatientDetailCTPage.addContent(corSagGridspan);
                }
                else {
                    bSagittalFullScr = true;
                    sagittalFullScrBtn.setIcon("sap-icon://exit-full-screen");
                    sagittalFullScrBtn.setTooltip("Exit Full Screen");
                    corSagGridspan.removeAllContent();
                    oPatientDetailCTPage.removeAllContent();
                    sagittalRaster.opacity = 0.0;
                    if (sagittalDoseRaster != null) {
                        sagittalDoseRaster.opacity = 0.0;
                    }
                    for (var i = 0; i < sagittalROIPaths.length; i++) {
                        sagittalROIPaths[i].remove();
                    }
                    if (mouseDownEvent != null && mouseDownEvent.target.project.view._id == 'SagittalCanvas') {
                        removeCrossLines();
                    }

                    var container4 = document.getElementById('container4');
                    container4.style.height = window.innerHeight - 48 - 48 - 35 - 8 + 'px';     //header和footer为48px高, axialControlLayout为35px高
                    var sagittalLoader = document.getElementById('sagittalLoader');
                    sagittalLoader.style.height = window.innerHeight - 48 - 48 - 8 + 'px';
                    corSagGridspan.setDefaultSpan("L12 M12 S12");
                    corSagGridspan.addContent(sagittalLayout);
                    oPatientDetailCTPage.addContent(corSagGridspan);
                }
            }
        });
        sagittalFullScrBtn.addStyleClass("playBtnStyle");

        sagittalControlLayout.addItem(sagittalPlayBtn);
        sagittalControlLayout.addItem(sagittalLastBtn);
        sagittalControlLayout.addItem(sagittalNextBtn);
        sagittalControlLayout.addItem(sagittalSlider);
        sagittalControlLayout.addItem(sagittalReloadBtn);
        sagittalControlLayout.addItem(sagittalFullScrBtn);
        sagittalLayout.addContent(ctSagittal);
        sagittalLayout.addContent(sagittalControlLayout);

        corSagGridspan.removeAllContent();
        oPatientDetailCTPage.removeAllContent();
        corSagGridspan.setDefaultSpan("L6 M6 S12");
        corSagGridspan.addContent(coronalLayout).addContent(sagittalLayout);
        oPatientDetailCTPage.addContent(axialGridspan);
        oPatientDetailCTPage.addContent(corSagGridspan);
        
    		DicomBusyDialog.close();
    }

    var axialGridspan = new sap.ui.layout.Grid({
        defaultSpan: "L12 M12 S12",
        width: '100%',
        hSpacing: 0.5,
        vSpacing: 0.5,
        position: sap.ui.layout.GridPosition.Center,
        content: [axialLayout]
    });

    var corSagGridspan = new sap.ui.layout.Grid({
        defaultSpan: "L6 M6 S12",
        hSpacing: 0.5,
        vSpacing: 0.5,
        content: [coronalLayout, sagittalLayout]
    });

    //var oCancleButton = new sap.m.Button({text:"返回"});
    //oCancleButton.attachPress(function(){
    //    oPatientSplitApp.backDetail();
    //});

//////////////////////Page/////////////////////////
    var oPatientDetailCTPage = new sap.m.Page({
        title: "患者CT",
        enableScrolling: true,
        showNavButton: true,
        navButtonText: "Back",
        navButtonPress: function() {
            oPatientSplitApp.backDetail();
        },
        headerContent: [
            new sap.m.Button({
                text: "ROI",
                icon : "sap-icon://multi-select",
                tooltip : "Select ROI",
                press : function() {
                    var chart = $('#container1').highcharts();
                    var roiItems = oROIList.getItems();
                    for (var j = 0; j < roiItems.length; j++) {
                        oROIList.setSelectedItem(roiItems[j], false);
                    }
                    for (var i = 0; i < roisForCorSag.length; i++) {
                        for (var j = 0; j < roiItems.length; j++) {
                            if (roisForCorSag[i].name == roiItems[j].mProperties.title) {
                                oROIList.setSelectedItem(roiItems[j], true);
                                break;
                            }
                        }
                    }

                    filterPage.setShowHeader(true);
                    filterPage.setTitle("ROI");
                    filterPage.removeAllContent();
                    filterPage.addContent(oROIList);
                    oDialog.removeAllButtons();
                    oDialog.addButton(oDialogOKBtn);
                    oDialog.addButton(oDialogCancelBtn);
                    oDialog.open();
                }
            }),
            new sap.m.Button({
                text: "Dose",
                icon : "sap-icon://menu",
                tooltip : "Select Dose",
                press : function() {
                    filterPage.setShowHeader(true);
                    filterPage.setTitle("Dose");
                    filterPage.removeAllContent();
                    filterPage.addContent(oDoseList);
                    oDialog.removeAllButtons();
                    oDialog.addButton(oDialogOKBtn);
                    oDialog.addButton(oDialogCancelBtn);
                    oDialog.open();
                }
            }),
            new sap.m.Button({
                text: "DVH",
                icon : "sap-icon://line-chart",
                tooltip : "DVH",
                press : function() {
                    filterPage.setShowHeader(false);
                    filterPage.removeAllContent();
                    filterPage.addContent(dvhChart);
                    oDialog.removeAllButtons();
                    oDialog.addButton(oDialogCloseBtn);
                    oDialog.open();

                    var chart = $('#container1').highcharts();
                    while (chart.series.length > 0) {
                        chart.series[0].remove(false);
                    }
                    var seriesColors = [];
                    for (var j = 0; j < chartSeries.length; j++) {
                        chart.addSeries(chartSeries[j]);
                        chart.redraw();

                        for (var k = 0; k < rois.length; k++) {
                            if (chartSeries[j].name == rois[k].name) {
                                seriesColors.push(rois[k].color);
                                break;
                            }
                        }
                    }
                    for (var j = 0; j < chart.series.length; j++) {
                        chart.series[j].update({
                            color: seriesColors[j]
                        });
                    }
                }
            })
        ],
        content: [],
        footer: new sap.m.Bar({
            contentMiddle: [
//                oCancleButton
            ]
        })
    });
    oPatientDetailCTPage.addStyleClass("pageBackgroundStyle");

    //return oPatientDetailCTPage;
//}