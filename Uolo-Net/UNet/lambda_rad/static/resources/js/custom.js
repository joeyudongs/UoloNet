// Django CSRF framework

var g_inst_pat_all = null
var g_rt_display = null

$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

$(document).ready( function() {
        $('#fileTreeDemo_1').fileTree({
        root: 'D:/LAMBDA',
        script: '/lambda/dirlist' },
        function(file) {
            $('#output').html(file); // append to inner html
        });

        showPage("search-page");

        $('#search_list-institution').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true
        });

        g_rt_display = new RtDisplay()
        //g_rt_display.init()

    });

function showSearchPage(){
    $('#search-page').show(100)
    $('#browse-page').hide(100);
}

function showBrowsePage(){
    $('#search-page').hide(100)
    $('#browse-page').show(100);
}

function showPage(id){
    if (document.getElementById) {
          var divid = document.getElementById(id);
          var divs = document.getElementsByClassName("page");
          for(var i=0;i<divs.length;i++) {
             divs[i].style.display = "none";
          }
          divid.style.display = "block";
    }
    return false;
 }

$('#timeline-tab').on('shown.bs.tab', function (e){
    // DOM element where the Timeline will be attached
    $('#timeline-container').html('')
    var timeline_container = document.getElementById('timeline-container');

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet([
            {id: 1, content: 'Date of Diagnosis', start: '2001-10-31'},
            {id: 2, content: 'Date Start RT', start: '2001-12-02'},
            {id: 3, content: 'Date Stop RT', start: '2002-01-09'},
            {id: 4, content: 'Data of recurrence', start: '2006-12-05'},
            {id: 5, content: 'Last Contact', start: '2006-12-05'},
        ]);

    // Configuration for the Timeline
    var options = {};

    // Create a Timeline
    var timeline = new vis.Timeline(timeline_container, items, options);

    timeline.on('select', function (properties) {
        var vis_items = $('.vis-item-content');
    });
});

function stringifyObject (object) {
  if (!object) return;
  var replacer = function(key, value) {
    if (value && value.tagName) {
      return "DOM Element";
    } else {
      return value;
    }
  }
  return JSON.stringify(object, replacer)
}


function getInstPatsAll() {
    $.ajax({
        url: '/lambda/getInstPatsAll/',
        type: 'POST',
        success: function(json) {
            g_inst_pat_all = json;

            var output= "";
            for (i=0; i<g_inst_pat_all.length; i++){
                inst = g_inst_pat_all[i].institution;
                output += "<a class =\"list-group-item item-institution\" href=\"#\" " +
                            "id = " + inst.id + ">" +
                            inst.name
                            "</a>"
            }

            $('#institution_list').html(output);

            console.log("success"); // log the returned json to the console
        },
    });
};

//$(".item-institution").click(function() {
$("#institution_list").on("click",".item-institution", function(){
    $('#demography_table').html('')
    $('#medical_record_table').html('')
    $('#patientDataTree').html('')
    $('#radiomics').html('')
    $('#image-container_1').html('')
    $('#gui-container_1').html('')
    $('#image-container_2').html('')
    $('#gui-container_2').html('')

    $('#form_institution_id').val($(this).attr('id'))
    $('#search_form').show()
    g_rt_display.resetDisplay();

    getPatientList($(this).attr('id'));
});

function getPatientList(id) {

    var inst_pat
    for(i=0; i<g_inst_pat_all.length;i++){
        if(g_inst_pat_all[i].institution.id == id){
            inst_pat = g_inst_pat_all[i]
        }
    }

    var patients = inst_pat.patients;
    var output= "";

    for (i=0; i < patients.length; i++){
        var p = patients[i];
        output += "<a class =\"list-group-item list-group-item-action item-patient\" href=\"#\" " +
                    "id = " + p.id + ">" +
                    (p.patient_id + ': ' +p.name_first+' '+p.name_last)+
                    "</a>"
    }

    $('#patient_list').html(output);

    output= "<tbody>";

    output += "<tr>" +
                "<th>Patient Number : " + "</th>" +
                "<td>" + patients.length + "</td>" +
                "</tr>"
    output += "</tbody>";
    $('#patient_sum_table').html(output);

};

$("#patient_list").on("click",".item-patient", function() {
    $('#image-container_1').html('')
    $('#gui-container_1').html('')
    $('#image-container_2').html('')
    $('#gui-container_2').html('')

    $('#medical_record_table').html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>')
    $('#patientDataTree').html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>')
    $('#radiomics').html('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>')
    getPatientDetail($(this).attr('id'));
    getPatientRadiomics($(this).attr('id'))
    g_rt_display.resetDisplay();

    $('#demography-tab-tab').tab('show');
});

function getPatientDetail(id){
    $.ajax({
        url: '/lambda/getPatientDetail/',
        type: 'POST',
        data : { id : id }, // data sent with the post request
        success: function(json) {
            //update patient info table
            $('#demography_table').html('');
            var patient_info = json["patient_info"];
            var output= "<tbody>";

            var keys = Object.keys(patient_info);
            for (i=0; i < keys.length; i++){
                var key = keys[i];
                output += "<tr>" +
                            '<th class="col-lg-2">' + key + "</th>" +
                            '<td class="col-lg-10">' + patient_info[key] + "</td>" +
                            "</tr>"
            }

            output += "</tbody>";
            $('#demography_table').html(output);

            //update medical records
            var medical_record = json["medical_records"];

            output= "<tbody>";

            var keys = Object.keys(medical_record);
            for (i=0; i < keys.length; i++){
                var key = keys[i];
                output += "<tr>" +
                            '<th class="col-lg-4">' + key + "</th>" +
                            '<td class="col-lg-8">' + medical_record[key] + "</td>" +
                            "</tr>"
            }

            output += "</tbody>";
            $('#medical_record_table').html(output);

            var folder = json['patient_data_folder'];
            //update file tree
            $('#patientDataTree').fileTree({
                root: folder,
                script: '/lambda/dirlist/'},
                function(file) {
                    alert(file)
                    $('#output').html(file); // append to inner html
                });

            image_output = ""
            for(i=0; i<json["image_sets"].length; i++){
                image_output += "<li><a href=\"#\">"+ json["image_sets"][i]['description'] +"</a></li>"
            }
            $(".image-dropdown-menu").html(image_output)

            $("#image").data("image_sets", json["image_sets"] );

            g_rt_display.init();
            if("dicom_files" in json){
                g_rt_display.dicomFiles = json["dicom_files"];
                if(g_rt_display.dicomFiles.children){
                    let study_output = ""
                    for(i=0; i<g_rt_display.dicomFiles.children.length; i++){
                        study_output += "<li><a href=\"#\" value="+i+">"+ g_rt_display.dicomFiles.children[i]['description'] +"</a></li>"
                    }
                    $("#dropdown-menu_study-list").html(study_output)
                }
            }

            $("#dropdownMenu_study").html('Select Study <span class="caret"></span>')
            $("#dropdownMenu_image").html('Select Image <span class="caret"></span>')
            $("#dropdownMenu_structure").html('Select Structure <span class="caret"></span>')
            $("#dropdownMenu_dose").html('Select Dose <span class="caret"></span>')

            console.log("success"); // log the returned json to the console

        },
    });
}

function getPatientRadiomics(id){
    $.ajax({
        url: '/lambda/getPatientRadiomics/',
        type: 'POST',
        data : { patient_id : id }, // data sent with the post request
        success: function(data) {
            //update patient info table
            //console.log(data)

            var tables = data
            output = ""
            //console.log('Table number: ' + tables.length)
            for(t=0; t<tables.length; t++){

                var thead = tables[t]["thead"]
                var tbody = tables[t]["tbody"]
                var file = tables[t]["file"]
                //tbody = JSON.parse(tbody)
                //console.log(thead)
                //console.log(tbody)
                output += "<h6>Table: "+(file)+"</h6>"
                output += "<table id=\"radiomicsTable"+(t+1)+"\" class=\"display nowrap\" cellspacing=\"0\" width=\"100%\">"
                output += "<thead>"
                output += "<tr>"
                for (i=0; i < thead.length; i++){
                    output +=   "<th>" + thead[i] + "</th>"
                }
                output += "</tr>"
                output += "</thead>"
                output += "<tbody>"
                for (i=0; i < tbody.length; i++){
                    output += "<tr>";
                    for(j=0; j< tbody[i].length; j++){
                        output +=   "<td>" + tbody[i][j] + "</td>"
                    }
                    output += "</tr>"
                }
                output += "</tbody>"
                output += "</table>";
            }
            //console.log(output)
            console.log('success'); // log the returned json to the console
            $('#radiomics').html(output);

            $('table.display').DataTable();
        },
    })
}

$('#rt-tab').on('shown.bs.tab', function (e) {

    if(g_rt_display != null){

    }
});

$("#dropdown-menu_study-list").on("click","a", function() {

    var selText = $(this).text();
    var value = $(this).attr("value");

    g_rt_display.resetDisplay();
    g_rt_display.selectedStudy = parseInt(value);
    let study = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy];

    let image_output = ""
    let struct_output = ""
    let dose_output = ""

    for(let i=0; i<study.children.length; i++){
        let child = study.children[i];
        if(child.modality == "CT" || child.modality == "PT" || child.type == "directory"){
            image_output += "<li><a href=\"#\" value="+i+">"+ child['description'] +"</a></li>"
        }else if(child.modality == "RTSTRUCT"){
            struct_output += "<li><a href=\"#\" value="+i+">"+ child['description'] +"</a></li>"
        }else if(child.modality == "RTDOSE"){
            dose_output += "<li><a href=\"#\" value="+i+">"+ child['description'] +"</a></li>"
        }
    }

    $("#dropdownMenu_study").text(selText)
    $("#dropdownMenu_image").html('Select Image <span class="caret"></span>')
    $("#dropdownMenu_structure").html('Select Structure <span class="caret"></span>')
    $("#dropdownMenu_dose").html('Select Dose <span class="caret"></span>')
    $("#dropdown-menu_image-list").html(image_output)
    $("#dropdown-menu_structure-list").html(struct_output)
    $("#dropdown-menu_dose-list").html(dose_output)

});


$("#dropdown-menu_image-list").on("click","a", function() {

    var selText = $(this).text();
    var value = $(this).attr("value");

    g_rt_display.resetDisplay();
    $("#dropdownMenu_image").text(selText)

    g_rt_display.selectedImage = parseInt(value);

    let studyPath = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].path;

    let image = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedImage];

    let imagePath = studyPath + '/' + image.name + '/';
    let dicomFiles = []

    for(let i=0; i<image.children.length; i++){
        dicomFiles.push(image.children[i].name);
    }

    g_rt_display.getImage(imagePath, dicomFiles);

    $("#dropdownMenu_structure").html('Select Structure <span class="caret"></span>')
    $("#dropdownMenu_dose").html('Select Dose <span class="caret"></span>')

});

$("#dropdown-menu_structure-list").on("click","a", function() {

    var selText = $(this).text();
    var value = $(this).attr("value");


    $("#dropdownMenu_structure").text(selText)

    g_rt_display.selectedStructure = parseInt(value);

    let studyPath = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].path+ '/';
    let structureFile = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedStructure].name;

    g_rt_display.getRS(studyPath, structureFile);

    if(g_rt_display.selectedDose != -1 && g_rt_display.selectedStructure != -1 ){
        let doseDcm = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedDose].name;
        let structureDcm = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedStructure].name;

        let jsonStudyPath = studyPath.replace("dcm", "json")
        let jsonDvhFile = "DVH" + "-" + doseDcm.split('-')[2].replace(".dcm","") + "-" + structureDcm.split('-')[2].replace(".dcm","") + ".json"
        console.log(jsonStudyPath + jsonDvhFile)
        g_rt_display.getDVH(jsonStudyPath + jsonDvhFile)
    }

    //let image = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy]
});

$("#dropdown-menu_dose-list").on("click","a", function() {

    var selText = $(this).text();
    var value = $(this).attr("value");

    $("#dropdownMenu_dose").text(selText)

    g_rt_display.selectedDose = parseInt(value);

    let studyPath = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].path+ '/';
    let doseFile = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedDose].name;

    g_rt_display.getRD(studyPath, doseFile);

    if(g_rt_display.selectedDose != -1 && g_rt_display.selectedStructure != -1 ){
        let doseDcm = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedDose].name;
        let structureDcm = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy].children[g_rt_display.selectedStructure].name;

        let jsonStudyPath = studyPath.replace("dcm", "json")
        let jsonDvhFile = "DVH" + "-" + doseDcm.split('-')[2].replace(".dcm","") + "-" + structureDcm.split('-')[2].replace(".dcm","") + ".json"
        console.log(jsonStudyPath + jsonDvhFile)
        g_rt_display.getDVH(jsonStudyPath + jsonDvhFile)
    }


    //let image = g_rt_display.dicomFiles.children[g_rt_display.selectedStudy]
});

$(".image-dropdown-menu").on("click","a", function() {

  var selText = $(this).text()+ $(this).id ;
  var selectedIndex = $(this).closest('a').index();
  var id = $(this).parent().parent().attr("id");

  var image_sets = $("#image").data("image_sets");

  if(id == "dropdown-menu_1"){
    $('#image-container_1').html('')
    $('#gui-container_1').html('')

    $('#dropdownMenuLink_1').text($(this).text())

    var container_1 = document.getElementById("image-container_1");

    var renderer_1 = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer_1.setSize(container_1.offsetWidth, container_1.offsetHeight);
    renderer_1.setClearColor(0x000000, 1);
    renderer_1.setPixelRatio(window.devicePixelRatio);
    container_1.appendChild(renderer_1.domElement);

    // Setup scene
    var scene_1 = new THREE.Scene();

    // Setup camera
    var camera_1 = new AMI.OrthographicCamera(
        container_1.clientWidth / -2,
        container_1.clientWidth / 2,
        container_1.clientHeight / 2,
        container_1.clientHeight / -2,
        0.1,
        10000
    );

    // Setup controls
    var controls_1 = new AMI.TrackballOrthoControl(camera_1, container_1);
    controls_1.staticMoving = true;
    controls_1.noRotate = true;
    camera_1.controls = controls_1;

    /**
     * Handle window resize
     */
    function onWindowResize() {
        camera_1.canvas = {
            width: container_1.offsetWidth,
            height: container_1.offsetHeight,
        };
        camera_1.fitBox(2);

        renderer_1.setSize(container_1.offsetWidth, container_1.offsetHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    /**
     * Build GUI
     */
    function gui_1(stackHelper) {
        var gui = new dat.GUI({
            autoPlace: false
        });

        var customContainer = document.getElementById("gui-container_1");
        customContainer.appendChild(gui.domElement);
        // only reason to use this object is to satusfy data.GUI
        var camUtils = {
            invertRows: false,
            invertColumns: false,
            rotate45: false,
            rotate: 0,
            orientation: 'default',
            convention: 'radio',
        };

        // camera_1
        var cameraFolder = gui.addFolder('camera_1');
        var invertRows = cameraFolder.add(camUtils, 'invertRows');
        invertRows.onChange(function() {
            camera_1.invertRows();
        });

        var invertColumns = cameraFolder.add(camUtils, 'invertColumns');
        invertColumns.onChange(function() {
            camera_1.invertColumns();
        });

        var rotate45 = cameraFolder.add(camUtils, 'rotate45');
        rotate45.onChange(function() {
            camera_1.rotate();
        });

        cameraFolder
            .add(camera_1, 'angle', 0, 360)
            .step(1)
            .listen();

        let orientationUpdate = cameraFolder.add(camUtils, 'orientation', ['default', 'axial', 'coronal', 'sagittal']);
        orientationUpdate.onChange(function(value) {
            camera_1.orientation = value;
            camera_1.update();
            camera_1.fitBox(2);
            stackHelper.orientation = camera_1.stackOrientation;
        });

        let conventionUpdate = cameraFolder.add(camUtils, 'convention', ['radio', 'neuro']);
        conventionUpdate.onChange(function(value) {
            camera_1.convention = value;
            camera_1.update();
            camera_1.fitBox(2);
        });

        cameraFolder.open();

        // of course we can do everything from lesson 01!
        var stackFolder = gui.addFolder('Stack');
        stackFolder
            .add(stackHelper, 'index', 0, stackHelper.stack.dimensionsIJK.z - 1)
            .step(1)
            .listen();
        stackFolder
            .add(stackHelper.slice, 'interpolation', 0, 1)
            .step(1)
            .listen();
        stackFolder.open();
    }

    /**
     * Start animation loop
     */
    function animate() {
        controls_1.update();
        renderer_1.render(scene_1, camera_1);

        // request new frame
        requestAnimationFrame(function() {
            animate();
        });
    }
    animate();

    // Setup loader
    var loader_1 = new AMI.VolumeLoader(container_1);

    var ct_root = image_sets[selectedIndex]['folder']
    var ct_files = image_sets[selectedIndex]['files']

    var files = ct_files.map(function(v) {
        return ct_root + v;
    });

    loader_1
        .load(files)
        .then(function() {
            // merge files into clean series/stack/frame structure
            var series = loader_1.data[0].mergeSeries(loader_1.data);
            var stack = series[0].stack[0];
            loader_1.free();
            loader_1 = null;
            // be carefull that series and target stack exist!
            var stackHelper = new AMI.StackHelper(stack);
            // stackHelper.orientation = 2;
            // stackHelper.index = 56;

            // tune bounding box
            stackHelper.bbox.visible = false;

            // tune slice border
            stackHelper.border.color = 0xff9800;
            // stackHelper.border.visible = false;

            scene_1.add(stackHelper);

            // build the gui
            gui_1(stackHelper);

            // center camera_1 and interactor to center of bouding box
            // for nicer experience
            // set camera_1
            var worldbb = stack.worldBoundingBox();
            var lpsDims = new THREE.Vector3(worldbb[1] - worldbb[0], worldbb[3] - worldbb[2], worldbb[5] - worldbb[4]);

            // box: {halfDimensions, center}
            var box = {
                center: stack.worldCenter().clone(),
                halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
            };

            // init and zoom
            var canvas = {
                width: container_1.clientWidth,
                height: container_1.clientHeight,
            };

            controls_1.addEventListener('OnScroll', function(e) {
            if (e.delta > 0) {
                if (stackHelper.index >= stack.dimensionsIJK.z - 1) {
                    return false;
                }
                stackHelper.index += 1;
            } else {
                if (stackHelper.index <= 0) {
                    return false;
                }
                stackHelper.index -= 1;
            }

            });

            container_1.addEventListener('OnScroll', function(e) {
            if (e.delta > 0) {
                if (stackHelper.index >= stack.dimensionsIJK.z - 1) {
                    return false;
                }
                stackHelper.index += 1;
            } else {
                if (stackHelper.index <= 0) {
                    return false;
                }
                stackHelper.index -= 1;
            }

            });

            camera_1.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
            camera_1.box = box;
            camera_1.canvas = canvas;
            camera_1.update();
            camera_1.fitBox(2);
        })
        .catch(function(error) {
            window.console.log('oops... something went wrong...');
            window.console.log(error);
        });

  }else if(id == "dropdown-menu_2"){
    $('#image-container_2').html('')
    $('#gui-container_2').html('')
    $('#dropdownMenuLink_2').text($(this).text())

    var container_2 = document.getElementById("image-container_2");

    var renderer_2 = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer_2.setSize(container_2.offsetWidth, container_2.offsetHeight);
    renderer_2.setClearColor(0x000000, 1);
    renderer_2.setPixelRatio(window.devicePixelRatio);
    container_2.appendChild(renderer_2.domElement);

    // Setup scene
    var scene_2 = new THREE.Scene();
    // Setup camera
    var camera_2 = new AMI.OrthographicCamera(
        container_2.clientWidth / -2,
        container_2.clientWidth / 2,
        container_2.clientHeight / 2,
        container_2.clientHeight / -2,
        0.1,
        10000
    );

    // Setup controls
    var controls_2 = new AMI.TrackballOrthoControl(camera_2, container_2);
    controls_2.staticMoving = true;
    controls_2.noRotate = true;
    camera_2.controls = controls_2;

    /**
     * Handle window resize
     */
    function onWindowResize() {
        camera_2.canvas = {
            width: container_2.offsetWidth,
            height: container_2.offsetHeight,
        };
        camera_2.fitBox(2);

        renderer_2.setSize(container_2.offsetWidth, container_2.offsetHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    /**
     * Build GUI
     */
    function gui_2(stackHelper) {
        var gui = new dat.GUI({
            autoPlace: false
        });

        var customContainer = document.getElementById("gui-container_2");
        customContainer.appendChild(gui.domElement);
        // only reason to use this object is to satusfy data.GUI
        var camUtils = {
            invertRows: false,
            invertColumns: false,
            rotate45: false,
            rotate: 0,
            orientation: 'default',
            convention: 'radio',
        };

        // camera_2
        var cameraFolder = gui.addFolder('camera_2');
        var invertRows = cameraFolder.add(camUtils, 'invertRows');
        invertRows.onChange(function() {
            camera_2.invertRows();
        });

        var invertColumns = cameraFolder.add(camUtils, 'invertColumns');
        invertColumns.onChange(function() {
            camera_2.invertColumns();
        });

        var rotate45 = cameraFolder.add(camUtils, 'rotate45');
        rotate45.onChange(function() {
            camera_2.rotate();
        });

        cameraFolder
            .add(camera_2, 'angle', 0, 360)
            .step(1)
            .listen();

        let orientationUpdate = cameraFolder.add(camUtils, 'orientation', ['default', 'axial', 'coronal', 'sagittal']);
        orientationUpdate.onChange(function(value) {
            camera_2.orientation = value;
            camera_2.update();
            camera_2.fitBox(2);
            stackHelper.orientation = camera_2.stackOrientation;
        });

        let conventionUpdate = cameraFolder.add(camUtils, 'convention', ['radio', 'neuro']);
        conventionUpdate.onChange(function(value) {
            camera_2.convention = value;
            camera_2.update();
            camera_2.fitBox(2);
        });

        cameraFolder.open();

        // of course we can do everything from lesson 01!
        var stackFolder = gui.addFolder('Stack');
        stackFolder
            .add(stackHelper, 'index', 0, stackHelper.stack.dimensionsIJK.z - 1)
            .step(1)
            .listen();
        stackFolder
            .add(stackHelper.slice, 'interpolation', 0, 1)
            .step(1)
            .listen();
        stackFolder.open();
    }

    /**
     * Start animation loop
     */
    function animate() {
        controls_2.update();
        renderer_2.render(scene_2, camera_2);

        // request new frame
        requestAnimationFrame(function() {
            animate();
        });
    }
    animate();

    // Setup loader
    var loader_2 = new AMI.VolumeLoader(container_2);

    var ct_root = image_sets[selectedIndex]['folder']
    var ct_files = image_sets[selectedIndex]['files']

    var files = ct_files.map(function(v) {
        return ct_root + v;
    });

    loader_2
        .load(files)
        .then(function() {
            // merge files into clean series/stack/frame structure
            var series = loader_2.data[0].mergeSeries(loader_2.data);
            var stack = series[0].stack[0];
            loader_2.free();
            loader_2 = null;
            // be carefull that series and target stack exist!
            var stackHelper = new AMI.StackHelper(stack);
            // stackHelper.orientation = 2;
            // stackHelper.index = 56;

            // tune bounding box
            stackHelper.bbox.visible = false;

            // tune slice border
            stackHelper.border.color = 0xff9800;
            // stackHelper.border.visible = false;

            scene_2.add(stackHelper);

            // build the gui
            gui_2(stackHelper);

            // center camera_2 and interactor to center of bouding box
            // for nicer experience
            // set camera_2
            var worldbb = stack.worldBoundingBox();
            var lpsDims = new THREE.Vector3(worldbb[1] - worldbb[0], worldbb[3] - worldbb[2], worldbb[5] - worldbb[4]);

            // box: {halfDimensions, center}
            var box = {
                center: stack.worldCenter().clone(),
                halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
            };

            // init and zoom
            var canvas = {
                width: container_2.clientWidth,
                height: container_2.clientHeight,
            };

            controls_2.addEventListener('OnScroll', function(e) {
            if (e.delta > 0) {
                if (stackHelper.index >= stack.dimensionsIJK.z - 1) {
                    return false;
                }
                stackHelper.index += 1;
            } else {
                if (stackHelper.index <= 0) {
                    return false;
                }
                stackHelper.index -= 1;
            }

            });

            container_2.addEventListener('OnScroll', function(e) {
            if (e.delta > 0) {
                if (stackHelper.index >= stack.dimensionsIJK.z - 1) {
                    return false;
                }
                stackHelper.index += 1;
            } else {
                if (stackHelper.index <= 0) {
                    return false;
                }
                stackHelper.index -= 1;
            }

            });

            camera_2.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
            camera_2.box = box;
            camera_2.canvas = canvas;
            camera_2.update();
            camera_2.fitBox(2);
        })
        .catch(function(error) {
            window.console.log('oops... something went wrong...');
            window.console.log(error);
        });
  }
});

$("#search_dm_age_oprt_select").change(function() {

    var age_fun = $("#search_dm_age_oprt_select option:selected").val()
    $("#search_dm_age_lb").text('')
    $("#search_dm_age_ub").text('')
    if(age_fun == 'greater'){
        $("#search_dm_age_lb").show()
        $("#search_dm_age_ub").hide()
    }else if(age_fun == 'less'){
        $("#search_dm_age_lb").hide()
        $("#search_dm_age_ub").show()
    }else if(age_fun == 'equal'){
        $("#search_dm_age_lb").show()
        $("#search_dm_age_ub").hide()
    }else{
        $("#search_dm_age_lb").show()
        $("#search_dm_age_ub").show()
    }
});

$("#mr_type_select").change(function() {

    var mr_type = $("#mr_type_select option:selected").text()
    if(mr_type !== 'Integer' && mr_type !== 'Float'){
        $("#mr_type_operator_LB").hide()
        $("#mr_type_operator_UB").hide()
        $("#mr_type_operator_select").hide()
        $("#mr_type_operator_select").val('equal')
        $("#mr_type_value_select").show()
        var output= "";
            $('#mr_type_value_select').html(output);
            output += '<option value="" class="notag">--Select--</option>'
            types = mr_type.split(',')
            for (var type in types){
                output += '<option value="'+ type +'" class="notag">'+ type + '</option>'
            }

            $('#mr_type_value_select').html(output);

    }else{
        $("#mr_type_operator_select").show()
        $("#mr_type_value_select").hide()
    }
});

$("#mr_type_operator_select").change(function() {

    var age_fun = $("#mr_type_operator_select option:selected").val()
    $("#mr_type_operator_LB").text('')
    $("#mr_type_operator_UB").text('')
    if(age_fun == 'greater'){
        $("#mr_type_operator_LB").show()
        $("#mr_type_operator_UB").hide()
    }else if(age_fun == 'less'){
        $("#mr_type_operator_LB").hide()
        $("#mr_type_operator_UB").show()
    }else if(age_fun == 'equal'){
        $("#mr_type_operator_LB").show()
        $("#mr_type_operator_UB").hide()
    }else{
        $("#mr_type_operator_LB").show()
        $("#mr_type_operator_UB").show()
    }
});

$("#rt-roi-list").on("change",".roi_check_box", function(event){
    if(this.checked == true){
          g_rt_display.displayRS(parseInt(this.value));
     }
    else{
          g_rt_display.unDisplayRS(parseInt(this.value));
    }
});

$("#rt-poi-list").on("change",".poi_check_box", function(event){
    if(this.checked == true){
          g_rt_display.displayPoint(parseInt(this.value));
     }
    else{
          g_rt_display.unDisplayPoint(parseInt(this.value));
    }
});

function displayRSAll(){
    $('.roi_check_box').each(function() {
         this.checked = true;
    });
    g_rt_display.displayRSAll();
}

function unDisplayRSAll(){
    $('.roi_check_box').each(function() {
         this.checked = false;
    });
    g_rt_display.unDisplayRSAll();
}

$("#dose_check_box").click(function(event){
    g_rt_display.displayDoseColorwash(this.checked);
});

function submitSearchForm(){

    $.ajax({
        url: '/lambda/searchPatientList/',
        type: 'post',
        dataType: 'json',
        data: $('#search_patient_form').serialize(),
        success: function(json) {
            g_inst_pat_all = json;

            g_inst_pat_all.sort(function(a, b) {
                return a.institution.name > b.institution.name;
            });

            $('#demography_table').html('')
            $('#medical_record_table').html('')
            $('#patientDataTree').html('')
            $('#radiomics').html('')
            $('#image-container_1').html('')
            $('#gui-container_1').html('')
            $('#image-container_2').html('')
            $('#gui-container_2').html('')

            var output= "";
            for (i=0; i<g_inst_pat_all.length; i++){
                inst = g_inst_pat_all[i].institution;
                output += "<a class =\"list-group-item item-institution\" href=\"#\" " +
                            "id = " + inst.id + ">" +
                            inst.name
                            "</a>"
            }

            $('#institution_list').html(output);

            showPage("browse-page")
        },
    });
}

function generateReports(){

    if(g_inst_pat_all==null){
        return
    }
    // generate gender pie chart
    var num_male = 0
    var num_female = 0

    var ages = []

    for(i=0; i<g_inst_pat_all.length;i++){
        for(j=0;j<g_inst_pat_all[i].patients.length;j++){
            if(g_inst_pat_all[i].patients[j].gender == 'M'){
                num_male ++;
            }else if(g_inst_pat_all[i].patients[j].gender == 'F'){
                num_female ++;
            }

            ages.push(g_inst_pat_all[i].patients[j].age)
        }
    }

    var gender_pie_data = [{
      values: [num_male, num_female],
      labels: ['Male', 'Female'],
      type: 'pie'
    }];
    var gender_pie_layout = {
      height: 400,
      width: 500,
      title:'Sex'
    };

    Plotly.newPlot('gender_piechart', gender_pie_data, gender_pie_layout);

    // generate age bar chart
    var age_hist_data = [
    {
        x: ages,
        type: 'histogram'
      }
    ];
    var age_hist_layout = {
      height: 600,
      width: 1000,
      title:'Age'
    };

    Plotly.newPlot('age_barchart', age_hist_data, age_hist_layout);
}

$("#window-level-slider").slider({
    orientation: "vertical",
    range: true,
    values: [ 0, 60 ],
    slide: function( event, ui ) {
        g_rt_display.adjustWindowLevel(ui.values[0], ui.values[1]);
    }
});
