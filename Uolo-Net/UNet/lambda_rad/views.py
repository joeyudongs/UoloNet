# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import re
import errno

#import urllib
from urllib.parse import urlparse
from django.shortcuts import render
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
import json
import fnmatch
from . import helloRadiomics
from . import utils
from lambda_rad import models as lambda_model
from webplatform import settings
from collections import OrderedDict


# Create your views here.
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def index(request):
    return render(request, 'index.html')


def getInstPatsAll(request):
    if request.method == 'POST':
        if request.is_ajax():
            institutions = lambda_model.Institution.objects.all().order_by('name')
            patients = lambda_model.Patient.objects.all()

            inst_pat_all = []
            for ins in institutions:
                inst_pat = {}
                pats = [pat for pat in patients if pat.institution == ins]
                inst_pat['institution'] = {"id": ins.id, "name": ins.name}
                inst_pat['patients'] = [{"id": p.id,
                                         "patient_id": p.patient_id,
                                         "name_first": p.name_first,
                                         "name_last": p.name_last,
                                         "gender": p.gender,
                                         "race": p.race,
                                         "age": p.age
                                         } for p in pats]
                inst_pat_all.append(inst_pat)

            return HttpResponse(
                json.dumps(inst_pat_all),
                content_type="application/json"
            )


def getPatientList(request):
    if request.method == 'POST':
        if request.is_ajax():
            institution_id = request.POST.get('institution_id')
            patients = lambda_model.Patient.objects. \
                filter(institution=lambda_model.Institution.objects.filter(id=institution_id))

            data = {}
            patient_list = []

            patients.order_by('patient_id')

            for p in patients:
                record = {"id": p.id, "patient_id": p.patient_id, "name_first": p.name_first, "name_last": p.name_last}
                patient_list.append(record)

            data['patient_list'] = patient_list

            if len(patients) > 0:
                medical_records = lambda_model.MedicalRecord.objects.filter(patient__in=patients)
                mrs = OrderedDict()
                mr_key_set = list(set([mr.key for mr in medical_records]))
                for key in mr_key_set:
                    value_set = list(set([mr.value for mr in medical_records if mr.key == key]))
                    isFloat = False
                    isInteger = True
                    for value in value_set:
                        if re.match("^\d+?\.\d+?$", value):
                            isFloat = True
                    if isFloat:
                        mrs[key] = 'Float'

                    for value in value_set:
                        try:
                            num = int(value)
                        except ValueError:
                            isInteger = False
                            break

                    if isFloat:
                        mrs[key] = 'Float'

                    if isInteger and len(value_set) > 20:
                        mrs[key] = 'Integer'
                    else:
                        mrs[key] = value_set

                data['medical_records'] = mrs

            return HttpResponse(
                json.dumps(data),
                content_type="application/json"
            )

def dicomFolderToDict(path, http_request_file_folder):
    d = OrderedDict()
    name = os.path.basename(path)
    d['name'] = name
    matchStudy = utils.STUDY_PATTERN.match(name)
    matchSeries = utils.SERIES_PATTERN.match(name)
    if matchStudy and os.path.isdir(path):

        externalPath = path.replace(settings.LAMBDA_DATA_FOLDER, http_request_file_folder)

        d['path'] = externalPath
        d['modality'] = "Study"
        d['type'] = "directory"
        s = lambda_model.Study.objects.get(uid=name)
        if s:
            f_display = 'Study: ' + s.date + ' ' + s.description
            d['description'] = f_display
        d['children'] = [dicomFolderToDict(os.path.join(path, x), http_request_file_folder) for x in os.listdir(path)]
    elif matchSeries:
        series_date = str(matchSeries.group(1))
        series_modality = str(matchSeries.group(2))
        series_uid = str(matchSeries.group(3))
        try:
            s = lambda_model.Series.objects.get(uid=series_uid)
        except lambda_model.Series.DoesNotExist:
            s = None

        f_display = "None"
        if s is not None:
            f_display = s.date + ' ' + s.modality + ' ' + s.description

        if os.path.isdir(path):
            d['modality'] = series_modality
            d['type'] = "directory"
            d['description'] = f_display

            d['children'] = [dicomFolderToDict(os.path.join(path, x), http_request_file_folder) for x in os.listdir(path)]

        else:
            d['modality'] = series_modality
            d['type'] = "file"
            d['description'] = f_display

    elif os.path.isdir(path):
        d['path'] = path
        d['type'] = "directory"
        d['children'] = [dicomFolderToDict(os.path.join(path, x), http_request_file_folder) for x in os.listdir(path)]
    else:
        d['type'] = "file"

    return d


def getPatientDetail(request):
    if request.method == 'POST':
        if request.is_ajax():
            id = request.POST.get('id')
            patient = lambda_model.Patient.objects.get(id=id)

            medical_records = lambda_model.MedicalRecord.objects. \
                filter(patient=patient)

            data = {}
            patient_info = {"patient_id": patient.patient_id,
                            "name_first": patient.name_first,
                            "name_last": patient.name_last,
                            "gender": patient.gender,
                            "race": patient.race,
                            "age": patient.age}
            data["patient_info"] = patient_info
            data["patient_data_folder"] = settings.LAMBDA_DATA_FOLDER + \
                                          patient.institution.data_folder + \
                                          patient.data_folder

            mr_list = {}
            for mr in medical_records:
                mr_list[mr.key] = mr.value

            data["medical_records"] = mr_list

            patient_dicom_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder + 'dcm/'

            client_ip = get_client_ip(request)
            http_request_file_folder = settings.LAMBDA_DATA_WEB_FOLDER
            if not utils.PRIVATE_IP_ADDRESS_PATTERN.match(client_ip):
                http_request_file_folder = settings.LAMBDA_DATA_WEB_EXTERNAL_FOLDER

            image_sets = []
            dicom_files = dicomFolderToDict(patient_dicom_folder, http_request_file_folder)
            #print(json.dumps(dicom_files))
            data["dicom_files"] = dicom_files

            for root, dirs, filenames in os.walk(patient_dicom_folder):
                for dir in dirs:

                    matchSeries = utils.SERIES_PATTERN.match(dir)
                    if matchSeries:
                        series_date = str(matchSeries.group(1))
                        series_modality = str(matchSeries.group(2))
                        series_uid = str(matchSeries.group(3))

                        if series_modality in ['CT', 'PT']:
                            image_abpath = os.path.join(root, dir)

                            slices = os.listdir(image_abpath)
                            image = {}
                            image_webpath = image_abpath.replace(settings.LAMBDA_DATA_FOLDER, http_request_file_folder)

                            image['folder'] = image_webpath + "/"
                            image['files'] = slices
                            f_display = series_date + ' ' + series_modality + ' ' + series_uid + ' (' + str(
                                len(slices)) + ')'

                            s = lambda_model.Series.objects.get(uid=series_uid)
                            if s:
                                f_display = series_date + ' ' + s.modality + ' ' + s.description + ' (' + str(
                                    len(slices)) + ')'

                            image['description'] = f_display
                            image_sets.append(image)

            data['image_sets'] = image_sets

            # patient_dosimetry_file = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder + 'dosimetry/dvh.json'
            # if os.path.exists(patient_dosimetry_file):
            #     with open(patient_dosimetry_file, 'r') as fh:
            #         dvh_json = json.load(fh)
            #         data['dvhs'] = dvh_json

            return HttpResponse(
                json.dumps(data),
                content_type="application/json"
            )


def dirlist(request):
    r = ['<ul class="jqueryFileTree" style="display: none;">']
    try:
        r = ['<ul class="jqueryFileTree" style="display: none;">']
        dir = str(urlparse(request.POST.get('dir', 'D:/LAMBDA')).path)

        dir = dir.replace('%3A', ':')

        ignoreFilePattern = re.compile(fnmatch.translate('*.SynologyWorkingDirectory'), re.IGNORECASE)

        # print('Dir: ' + dir)
        dirlist = os.listdir(dir)
        sortedDirs = sorted(dirlist)
        for f in sortedDirs:
            # print(f)
            f_display = f

            matchStudy = utils.STUDY_PATTERN.match(f)
            matchSeries = utils.SERIES_PATTERN.match(f)
            if matchStudy:
                s = lambda_model.Study.objects.get(uid=f)
                if s:
                    f_display = 'Study: ' + s.date + ' ' + s.description
                    # print(f_display)
            elif matchSeries:
                #print(matchSeries.group(3))
                s = lambda_model.Series.objects.get(uid=matchSeries.group(3))
                if s:
                    f_display = s.date + ' ' + s.modality + ' ' + s.description
                    # print(f_display)
            else:
                pass

            abpff = os.path.join(dir, f)
            # print(abpff)
            # If the sub-path is an ignorable file, ignore it.
            if ignoreFilePattern.match(f):
                continue

            if os.path.isdir(abpff):
                filePath = str(abpff).replace(r'D:/LAMBDA', r'http://localhost/lambda')
                r.append(
                    '<li class="directory collapsed"><a href="%s" rel="%s/">%s</a></li>' % (filePath, abpff, f_display))
            else:
                filePath = str(abpff).replace(r'D:/LAMBDA', r'http://localhost/lambda')
                e = os.path.splitext(f)[1][1:]  # get .ext and remove dot
                r.append('<li class="file ext_%s"><a href="%s" rel="%s">%s</a></li>' % (e, filePath, abpff, f_display))

        r.append('</ul>')
    except Exception as e:
        r.append('Could not load directory: %s' % str(e))
    r.append('</ul>')

    return HttpResponse(''.join(r))


def getPatientRadiomics(request):
    if request.method == 'POST':
        if request.is_ajax():
            patient_id = request.POST.get('patient_id')
            patient = lambda_model.Patient.objects.get(id=patient_id)

            tables = []
            result_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder + 'result/'
            hasRadiomicsResult = False
            for root, dirs, filenames in os.walk(result_folder):
                for file in filenames:
                    matchResult = utils.RESULT_FILE_PATTERN.match(file)
                    if matchResult:
                        hasRadiomicsResult = True
                        # print(file)
                        result_type = str(matchResult.group(1))
                        if result_type == 'radiomics':
                            res = os.path.join(root, file)
                            rf = open(res, "r")
                            thead = rf.readline().split(';')

                            thead = list(map(str.strip, list(map(str, thead))))

                            tbody = []
                            for line in rf:
                                row = line.split(';')
                                row = list(map(str.strip, list(map(str, row))))
                                tbody.append(row)
                            rf.close()
                            table = {}
                            table['thead'] = thead
                            table['tbody'] = tbody
                            table['file'] = str(file)
                            tables.append(table)
            # print(hasRadiomicsResult)
            '''
            if not hasRadiomicsResult:
                nrrdFolder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder + 'nrrd/'
                # print(nrrdFolder)
                if os.path.exists(nrrdFolder):
                    for root, dirs, filenames in os.walk(nrrdFolder):
                        if utils.NRRD_STUDY_FOLDER_PATTERN.match(root):
                            # print(nrrdFolder)
                            cts = []
                            rois = []
                            for dir in dirs:
                                if utils.RTSTRUCT_FOLDER_PATTERN.match(dir):
                                    rois.append(dir)
                                    # print(dir)

                            for file in filenames:
                                if utils.CT_NRRD_PATTERN.match(file):
                                    cts.append(file)
                                    # print(file)

                            for ct in cts:
                                for roi in rois:
                                    result_folder = root.replace('nrrd', 'result')
                                    try:
                                        os.makedirs(result_folder)
                                    except OSError as exc:  # Guard against race condition
                                        if exc.errno != errno.EEXIST:
                                            raise

                                    abp_ct = os.path.join(root, ct)
                                    abp_roi = os.path.join(root, roi)

                                    ct_name = ct.replace('.nrrd', '')
                                    radiomics_result = os.path.join(result_folder,
                                                                    'radiomics_' + ct_name + '_' + roi + '.txt')
                                    if (len(radiomics_result) > 260):
                                        radiomics_result = radiomics_result[0:255] + '.txt'

                                    if os.path.exists(radiomics_result):
                                        print(radiomics_result + ' : exist!')
                                        continue

                                    print('Calculate radiomics for : ' + abp_ct + ' and ' + abp_roi)
                                    thead, tbody = helloRadiomics.calculateRadiomics(str(abp_ct), str(abp_roi))

                                    rf = open(radiomics_result, "w")

                                    ss = ''
                                    for item in thead:
                                        ss += ("%s;" % item)
                                    ss += '\n'

                                    for i in range(len(tbody)):
                                        for j in range(len(tbody[i])):
                                            ss += ("%s;" % str(tbody[i][j]))
                                        ss += '\n'

                                    rf.write(ss)
                                    rf.close()

                for root, dirs, filenames in os.walk(result_folder):
                    for file in filenames:
                        matchResult = utils.RESULT_FILE_PATTERN.match(file)
                        if matchResult:
                            hasRadiomicsResult = True
                            # print(file)
                            result_type = str(matchResult.group(1))
                            if result_type == 'radiomics':
                                res = os.path.join(root, file)
                                rf = open(res, "r")
                                thead = rf.readline().split(';')
                                thead = list(map(str.strip, list(map(str, thead))))

                                tbody = []
                                for line in rf:
                                    row = line.split(';')
                                    row = list(map(str.strip, list(map(str, row))))
                                    tbody.append(row)
                                rf.close()
                                table = {}
                                table['thead'] = thead
                                table['tbody'] = tbody
                                table['file'] = str(file)
                                tables.append(table)
            '''
            # data = {}
            # data['tables'] = tables

            return HttpResponse(
                json.dumps(tables),
                content_type="application/json"
            )


def searchPatientList(request):
    # search tag pattern
    demographyPattern = re.compile('search_dm_(.+)')
    medicalrecordPattern = re.compile('search_mr_(.+)')

    if request.method == 'POST':
        if request.is_ajax():

            # set search criteria into session
            for key, value in request.POST.items():
                if key[-2:] == '[]':
                    value = request.POST.getlist(key)
                    v_str = ''
                    for v in value:
                        v_str += str(v) + ','
                    v_str = v_str[:-1]
                    value = v_str
                    print(value)
                request.session[key] = value
                print(key+'------>'+value)

            inst_pat_all = []
            if 'search_list-institution[]' in request.session:
                inst_ids_str = request.session.get('search_list-institution[]')
                print(inst_ids_str)
                inst_ids = inst_ids_str.split(',')
            else:
                inst_ids = []

            if len(inst_ids) == 0:
                institutions = lambda_model.Institution.objects.all()
            else:
                institutions = lambda_model.Institution.objects.filter(id__in=inst_ids)

            patients = lambda_model.Patient.objects.filter(institution__in=institutions)

            for ins in institutions:
                inst_pat = {}
                pats = [pat for pat in patients if pat.institution == ins]

                # Gender
                if 'search_dm_gender' in request.session:
                    search_dm_gender = request.session.get('search_dm_gender')
                    if search_dm_gender != '':
                        pats = [pat for pat in pats if pat.gender == search_dm_gender]

                # Age
                if 'search_dm_age_oprt' in request.session:
                    search_dm_age_oprt = request.session.get('search_dm_age_oprt')
                    if search_dm_age_oprt != '':
                        search_dm_age_lb = request.session.get('search_dm_age_lb')
                        search_dm_age_ub = request.session.get('search_dm_age_ub')

                        if search_dm_age_oprt == 'greater':
                            pats = [pat for pat in pats if pat.age > int(search_dm_age_lb)]
                        elif search_dm_age_oprt == 'less':
                            pats = [pat for pat in pats if pat.age < int(search_dm_age_ub)]
                        elif search_dm_age_oprt == 'equal':
                            pats = [pat for pat in pats if pat.age == int(search_dm_age_lb)]
                        elif search_dm_age_oprt == 'between':
                            pats = [pat for pat in pats if pat.age > int(search_dm_age_lb) and pat.age < int(search_dm_age_ub)]

                inst_pat['institution'] = {"id": ins.id, "name": ins.name}
                inst_pat['patients'] = [{"id": p.id,
                                         "patient_id": p.patient_id,
                                         "name_first": p.name_first,
                                         "name_last": p.name_last,
                                         "gender": p.gender,
                                         "race": p.race,
                                         "age": p.age
                                         } for p in pats]
                inst_pat_all.append(inst_pat)

            return HttpResponse(
                json.dumps(inst_pat_all),
                content_type="application/json"
            )

    # institution_id = request.POST.get('form_institution_id')

    # gender = request.POST.get('gender')
    # age = request.POST.get('age')
    #
    # age_LB = request.POST.get('LB')
    # age_UB = request.POST.get('UB')

    # if age_LB !='':
    #     try:
    #         age_LB = int(age_LB)
    #     except ValueError:
    #         print "age_LB an int"
    #
    # if age_UB !='':
    #     try:
    #         age_UB = int(age_UB)
    #     except ValueError:
    #         print "age_UB an int"
    #
    # mr_type = request.POST.get('mr_type')
    # mr_type_operator = request.POST.get('mr_type_operator')
    # mr_type_value = request.POST.get('mr_type_value')
    #
    # patients = lambda_model.Patient.objects. \
    #     filter(institution=lambda_model.Institution.objects.filter(id=institution_id))
    # patients.order_by('patient_id')
    #
    # #Gender
    # if gender != '' and (gender == 'M' or gender == 'F') :
    #     patients = [patient for patient in patients if patient.gender == gender]
    # elif gender != '' and gender == 'O' :
    #     patients = [patient for patient in patients if (patient.gender != 'M' and patient.gender != 'F')]
    #
    # #Age
    # if age == 'greater' and isinstance(age_LB, int):
    #     patients = [patient for patient in patients if patient.age > age_LB]
    # elif age == 'less' and isinstance(age_UB, int):
    #     patients = [patient for patient in patients if patient.age < age_UB]
    # elif age == 'equal' and isinstance(age_LB, int):
    #     patients = [patient for patient in patients if patient.age == age_LB]
    # elif age == 'between' and isinstance(age_LB, int) and isinstance(age_UB, int):
    #     patients = [patient for patient in patients if patient.age > age_LB and patient.age < age_UB]
    #
    # #Medical Record
    # if mr_type != '':
    #     if mr_type_operator == 'equal':
    #         medical_records = lambda_model.MedicalRecord.objects.filter(patient__in=patients)\
    #                         .filter(key=mr_type).filter(value=mr_type_value)
    #
    #         patients = set([mr.patient for mr in medical_records])
    #
    # patient_list = []
    #
    # for p in patients:
    #     record = {"id": p.id, "patient_id": p.patient_id, "name_first": p.name_first, "name_last": p.name_last}
    #     patient_list.append(record)
    #
    # return HttpResponse(
    #     json.dumps(''),
    #     content_type="application/json"
    # )
