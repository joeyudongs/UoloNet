import os, sys
import re

sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'webplatform.settings'
import django
from django.db import transaction
django.setup()
from lambda_rad import models as lambda_model
from lambda_rad import utils
import fnmatch
import pydicom
from datetime import datetime
from lambda_rad import helloRadiomics
import errno
from django.conf import settings
import shutil
import csv
import json
from xlrd import open_workbook
from collections import OrderedDict
from lambda_rad import utils
import nrrd
from skimage.io import imsave, imread

from scripts import unet


class DVH:

    def __init__(self):
        self.roi = ''
        self.max_dose = 0
        self.min_dose = 0
        self.mean_dose = 0
        self.dose_type = 'absolute'
        self.volume_type = 'relative'
        self.dvh_data = []

    def insertDVHData(self, dvh_data):

        self.dvh_data.append(dvh_data)
        self.dvh_data.sort(key=lambda tup: tup[0])

def importPatientData(institution_name, data_folder):
    '''
    Import dicom files to institute
    :param institution_name:
    :param data_folder:
    :return:
    '''
    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution

    institution_folder = settings.LAMBDA_DATA_FOLDER + institution.data_folder
    if not os.path.exists(institution_folder):
        try:
            os.makedirs(institution_folder)
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    if os.path.isdir(data_folder):

        patients={}
        for dirpath, _, filenames in os.walk(data_folder):
            for f in filenames:
                absPath = os.path.abspath(os.path.join(dirpath, f))

                if (os.path.isfile(absPath)):
                    try:
                        dp = utils.DicomParser(absPath)
                    except (AttributeError, EOFError, IOError, KeyError):
                        print("%s is not a valid DICOM file.", absPath)
                    else:

                        demographic = dp.GetDemographics()

                        study = dp.GetStudyInfo()

                        series = dp.GetSeriesInfo()

                        instance = dp.GetSOPInstanceUID()

                        date = '00000000'
                        if 'date' in series:
                            if not series['date'] is None:
                                date = series['date'].strip()
                            elif 'date' in study:
                                if not study['date'] is None:
                                    date = study['date'].strip()

                        modality = series['modality'].strip()

                        patientId = demographic['id'].strip()

                        patient_folder = institution_folder + patientId + '/'

                        # if this patient is not in the list, check database
                        if not patientId in patients.keys():

                            if not lambda_model.Patient.objects.filter(patient_id=patientId,
                                                                      institution=institution).exists():
                                patient = lambda_model.Patient()
                                patient.patient_id = patientId.strip()
                                patient.name = demographic['name']
                                patient.name_first = demographic['given_name']
                                patient.middle_name = demographic['middle_name']
                                patient.name_last = demographic['family_name']
                                patient.gender = demographic['gender']
                                # patient.age = patient_age
                                patient.birth_date = demographic['birth_date']
                                # patient.race = patient_race
                                patient.data_folder = patientId + '/'
                                patient.institution = institution
                                patient.save()
                                transaction.commit()

                                patient_folder = institution_folder + patient.data_folder
                                patient_dicom_folder = patient_folder + 'dcm/'
                                patients[patientId] = patient_dicom_folder
                                print('Create patient: ' + patientId)
                            else:
                                patient = lambda_model.Patient.objects.get(patient_id=patientId, institution=institution)
                                patient_folder = institution_folder + patient.data_folder
                                patient_dicom_folder = patient_folder + 'dcm/'
                                patients[patientId] = patient_dicom_folder
                                print('Find patient in database: ' + patientId)
                        else:
                            print('Find patient in buffer: ' + patientId)
                            patient_dicom_folder = patients[patientId]




                        studyUid = study['id']
                        seriesStr = date + '-' + modality + '-' + series['id']

                        print(patient_dicom_folder)
                        if not os.path.exists(patient_dicom_folder):
                            try:
                                os.makedirs(patient_dicom_folder)
                            except OSError as exc:  # Guard against race condition
                                if exc.errno != errno.EEXIST:
                                    return

                        studyDir = os.path.join(patient_dicom_folder, studyUid)
                        if not os.path.exists(studyDir):
                            try:
                                os.makedirs(studyDir)
                            except OSError as exc:  # Guard against race condition
                                if exc.errno != errno.EEXIST:
                                    raise

                        if modality == 'CT' or modality == 'PT' or modality == 'MR':
                            seriesDir = os.path.join(studyDir, seriesStr)
                            if not os.path.exists(seriesDir):
                                try:
                                    os.makedirs(seriesDir)
                                except OSError as exc:  # Guard against race condition
                                    if exc.errno != errno.EEXIST:
                                        raise

                            file = os.path.join(seriesDir, instance + '.dcm')
                        else:
                            file = os.path.join(studyDir, seriesStr+'.dcm')

                        if not os.path.exists(file):
                            shutil.copy2(absPath, file)

                        print(r'cp' + ': ' + absPath + ' to ' + file)

        return patients

def importPatientMedicalRecord(institution_name, record_file):
    institution = lambda_model.Institution.objects.get(name=institution_name)

    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution

    with open(record_file, 'rb') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

        patients = lambda_model.Patient.objects. \
            filter(institution=institution)

        for row in spamreader:
            list_keys = list(row.keys())

            list_keys.remove('Patient_ID')
            list_keys.remove('Gender')
            list_keys.remove('Race')

            p_id = row['Patient_ID']
            for patient in patients:
                if int(patient.patient_id) == int(p_id):
                    gender = row['Gender']
                    if gender == 'Male' and patient.gender == 'M':
                        pass
                    elif gender == 'Female' and patient.gender == 'F':
                        pass
                    else:
                        print(p_id + ': Gender Mis-match')
                        if gender == 'Male':
                            patient.gender = 'M'
                        elif gender == 'Female':
                            patient.gender = 'F'

                    race = row['Race']
                    patient.race = race

                    patient.save()
                    transaction.commit()
                    for key in list_keys:
                       value = row[key]
                       m = lambda_model.MedicalRecord()
                       m.patient = patient
                       m.key = key
                       m.value = value
                       m.save()
                       transaction.commit()

def importPatientMedicalRecord2(institution_name, record_file):
    institution = lambda_model.Institution.objects.get(name=institution_name)

    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution

    with open(record_file, 'rb') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

        patients = lambda_model.Patient.objects. \
            filter(institution=institution)

        for row in spamreader:
            list_keys = list(row.keys())

            list_keys.remove('TCIA code')
            list_keys.remove('Sex')
            list_keys.remove('Age')
            list_keys.remove('Date of Birth')


            p_id = row['TCIA code']
            for patient in patients:
                if patient.patient_id == p_id:
                    gender = row['Sex']
                    if gender == 'Male' and patient.gender == 'M':
                        pass
                    elif gender == 'Female' and patient.gender == 'F':
                        pass
                    else:
                        print(p_id + ': Gender Mis-match')
                        if gender == 'Male':
                            patient.gender = 'M'
                        elif gender == 'Female':
                            patient.gender = 'F'

                    age = row['Age']
                    patient.age = age

                    dob = row['Date of Birth']
                    patient.birth_date = dob

                    patient.save()
                    transaction.commit()
                    for key in list_keys:
                        value = row[key]
                        m = lambda_model.MedicalRecord()
                        m.patient = patient
                        m.key = key
                        m.value = value
                        m.save()
                        transaction.commit()

def importPatientMedicalRecord_CHUM(institution_name, record_file):
    institution = lambda_model.Institution.objects.get(name=institution_name)

    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution


    with open(record_file, 'rb') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

        patients = lambda_model.Patient.objects. \
            filter(institution=institution)

        for row in spamreader:
            list_keys = list(row.keys())

            list_keys.remove('Patient')
            list_keys.remove('Sex')
            list_keys.remove('Age')

            p_id = row['Patient']
            for patient in patients:
                if patient.patient_id == p_id:
                    print(p_id)
                    gender = row['Sex']
                    if gender == 'M' and patient.gender == 'M':
                        pass
                    elif gender == 'F' and patient.gender == 'F':
                        pass
                    else:
                        print(p_id + ': Gender Mis-match')
                        if gender == 'M':
                            patient.gender = 'M'
                        elif gender == 'F':
                            patient.gender = 'F'

                    age = row['Age']
                    patient.age = age

                    patient.save()
                    transaction.commit()
                    for key in list_keys:
                        value = row[key]
                        m = lambda_model.MedicalRecord()
                        m.patient = patient
                        m.key = key
                        m.value = value
                        #print('key: ' + key + ' value: ' + value)
                        m.save()
                        transaction.commit()

def importPatientMedicalRecord_features(institution_name, record_file):
    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution
    with open(record_file, 'rb') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

        patients = lambda_model.Patient.objects. \
            filter(institution=institution)

        for row in spamreader:
            list_keys = list(row.keys())

            list_keys.remove('MRN')
            list_keys.remove('Sex')
            list_keys.remove('age')

            p_id = row['MRN']

            ps = next((p for p in patients if p.patient_id == p_id), None)
            #patientid_list = [patient.patient_id for patient in patients]
            #print(patientid_list)
            if ps is None:
                p_cur = lambda_model.Patient()
                p_cur.patient_id = p_id
                p_cur.institution = institution

                if row['Sex'] == '0':
                    p_cur.gender = 'F'
                elif row['Sex'] == '1':
                    p_cur.gender = 'M'

                p_cur.age = row['age']

                p_cur.data_folder = p_id + '/'
                patient_folder = settings.LAMBDA_DATA_FOLDER + institution.data_folder + p_cur.data_folder
                if not os.path.exists(patient_folder):
                    try:
                        os.makedirs(patient_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            return

                print(p_cur.patient_id)
                print(p_cur.gender)
                print(p_cur.age)

                p_cur.save()
            else:
                p_cur = ps
                p_cur.patient_id = p_id

                if row['Sex'] == '0':
                    p_cur.gender = 'F'
                elif row['Sex'] == '1':
                    p_cur.gender = 'M'

                p_cur.age = row['age']
                p_cur.data_folder = p_id + '/'
                patient_folder = settings.LAMBDA_DATA_FOLDER + institution.data_folder + p_cur.data_folder
                if not os.path.exists(patient_folder):
                    try:
                        os.makedirs(patient_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            return

                p_cur.save()
                transaction.commit()
            for key in list_keys:
                value = row[key]
                m = lambda_model.MedicalRecord()
                m.patient = p_cur
                m.key = key
                m.value = value
                m.save()
                transaction.commit()

def importDosimetry(institution_name, record_file):
    try:
        institution = lambda_model.Institution.objects.get(name=institution_name)
    except lambda_model.Institution.DoesNotExist:
        institution = None
        print('institution: ' + institution_name + ' dose not exist!')
        return institution
    with open(record_file, 'rb') as csvfile:
        spamreader = csv.DictReader(csvfile, delimiter=',', quotechar='|')

        patients = lambda_model.Patient.objects. \
            filter(institution=institution)

        for row in spamreader:
            list_keys = list(row.keys())

            p_id = row['MRN']

            ps = next((p for p in patients if p.patient_id == p_id), None)

            patient_folder = settings.LAMBDA_DATA_FOLDER + institution.data_folder + ps.data_folder
            print(patient_folder)
            patient_dosimetry_folder = patient_folder+'dosimetry/'
            if not os.path.exists(patient_dosimetry_folder):
                try:
                    os.makedirs(patient_dosimetry_folder)
                except OSError as exc:  # Guard against race condition
                    if exc.errno != errno.EEXIST:
                        return

            dvh_list = []
            for key in list_keys:
                ss = key.split('_')
                if len(ss) == 2:
                    roi = ss[0]

                    dvh = next((dvh for dvh in dvh_list if dvh.roi == roi), None)
                    if dvh is None:
                        dvh = DVH()
                        dvh.roi = roi
                        dvh_list.append(dvh)

                    if ss[1].lower() == 'mean':
                        dose = float(row[key])
                        dvh.mean_dose = dose
                    elif ss[1].lower() == 'min':
                        dose = float(row[key])
                        dvh.min_dose = dose
                    elif ss[1].lower() == 'max':
                        dose = float(row[key])
                        dvh.max_dose = dose
                    else:
                        dose = float(ss[1])
                        volume = float(row[key])
                        dvh.insertDVHData((dose, volume))

            #json_string = json.dumps([dvh.__dict__ for dvh in dvh_list])

            #print(json_string)
            with open(patient_dosimetry_folder+'dvh.json', 'w') as outfile:
                json.dump([dvh.__dict__ for dvh in dvh_list], outfile)

def calculateRadiomics():
    patients = lambda_model.Patient.objects.all()

    for patient in patients:

        dir = patient.data_folder

        nrrdReady, nrrdFolder, ctNrrd, rsNrrdFolder = utils.checkNrrdFile(dir)
        results = utils.checkResultFile(dir)

        ss = ""
        if nrrdReady:
            if 'radiomics.txt' in results:
                print('Patient: ' + str(patient.id) + ' has already had radiomics result. Pass.')
                pass

            else:
                try:
                    print('Calculate radiomics for patient : ' + str(patient.id) + '.')
                    thead, tbody = helloRadiomics.myRadiomicsData(os.path.abspath(nrrdFolder))
                except:
                    ss = "Calculate radiomics error!"
                    raise

                ref = os.path.join(dir, "RESULTS")
                res = os.path.join(ref, "radiomics.txt")

                if not os.path.exists(ref):
                    try:
                        os.makedirs(ref)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            raise

                rf = open(res, "w")

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

def addInstitution(institution_name):
    institution = lambda_model.Institution()
    institution.name = institution_name
    institution.save()
    transaction.commit()

    institution_saved = lambda_model.Institution.objects.get(name=institution_name)
    institution_id = institution_saved.id
    ins_folder = 'inst-'+str(institution_id) + '/'
    institution_saved.data_folder = ins_folder
    folder = settings.LAMBDA_DATA_FOLDER + institution_saved.data_folder

    if not os.path.exists(folder):
        try:
            os.makedirs(folder)
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

    institution_saved.save()
    transaction.commit()

def get_training_image_label_list_from_patient_folder(patient_folder, roi_name, label_exists = False):
    paired_ct_roi_list = []
    if roi_name not in utils.ROI_PATTERNS.keys():
        print(roi_name + " is not recognized!")
        return paired_ct_roi_list
    roi_pattern = utils.ROI_PATTERNS[roi_name]

    for root, dirs, filenames in os.walk(patient_folder):
        # find study folders in the nrrd folder
        if utils.IMAGE_STUDY_FOLDER_PATTERN.match(root):
            # root is the study folder
            cts = []
            rois = []
            for dir in dirs:
                # find the rt structure folder
                if utils.RTSTRUCT_FOLDER_PATTERN.match(dir):
                    abp_rs = os.path.join(root, dir)
                    for rs in os.listdir(abp_rs):
                        # find the roi folder
                        # the roi pattern may math multiple folders
                        # rois is a list of roi image lists
                        if roi_pattern.match(rs):
                            roi = []

                            abp_roi = os.path.join(abp_rs, rs)
                            # list images in this folder
                            for image in os.listdir(abp_roi):
                                roi.append(os.path.abspath(os.path.join(abp_roi, image)))

                            rois.append(roi)

                if utils.CT_FOLDER_PATTERN.match(dir):

                    abp_ct = os.path.join(root, dir)
                    for image in os.listdir(abp_ct):
                        cts.append(os.path.abspath(os.path.join(abp_ct, image)))

            for roi in rois:
                if len(cts) == len(roi):
                    for i in range(len(roi)):
                        if not label_exists:
                            paired_ct_roi_list.append((cts[i], roi[i]))
                        else:
                            mask = imread(roi[i], as_gray=True)
                            if mask.max() > 0:
                                # only add labeled pairs
                                paired_ct_roi_list.append((cts[i], roi[i]))


    return paired_ct_roi_list

def get_training_image_label_list(institution_name, roi_name, label_exists = False):
    '''
    #input patient filter and a roi name (now, make it simple, the patient filter is an institution name)
    #           eg. patients from the training institution
    #               ROI name Heart (Must be standard roi name from roi.csv. Using ROI pattern for roi searching)
    #           make sure every patient in this patient list has this roi
    #           return a paired ct/roi file list
    :param institution_name:
    :param roi_name:
    :return: a paired ct/roi file list
    '''

    paired_ct_roi_list = []
    if roi_name not in utils.ROI_PATTERNS.keys():
        print(roi_name + " is not recognized!")
        return paired_ct_roi_list

    roi_pattern = utils.ROI_PATTERNS[roi_name]

    # get patient list
    patients = lambda_model.Patient.objects. \
        filter(institution=lambda_model.Institution.objects.get(name=institution_name))

    for patient in patients:
        patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder

        for root, dirs, filenames in os.walk(patient_data_folder):
            # find study folders in the nrrd folder
            if utils.IMAGE_STUDY_FOLDER_PATTERN.match(root):
                # root is the study folder
                cts = []
                rois = []
                for dir in dirs:
                    # find the rt structure folder
                    if utils.RTSTRUCT_FOLDER_PATTERN.match(dir):
                        abp_rs = os.path.join(root, dir)
                        for rs in os.listdir(abp_rs):
                            # find the roi folder
                            # the roi pattern may math multiple folders
                            # rois is a list of roi image lists
                            if roi_pattern.match(rs):
                                roi = []

                                abp_roi = os.path.join(abp_rs, rs)
                                # list images in this folder
                                for image in os.listdir(abp_roi):
                                    roi.append(os.path.join(abp_roi, image))

                                rois.append(roi)

                    if utils.CT_FOLDER_PATTERN.match(dir):

                        abp_ct = os.path.join(root, dir)
                        for image in os.listdir(abp_ct):
                            cts.append(os.path.join(abp_ct, image))


                for roi in rois:
                    if len(cts) == len(roi):
                        for i in range(len(roi)):
                            if not label_exists:
                                paired_ct_roi_list.append((cts[i], roi[i]))
                            else:
                                mask = imread(roi[i], as_gray=True)
                                if mask.max() > 0:
                                    #only add labeled pairs
                                    paired_ct_roi_list.append((cts[i], roi[i]))

    return paired_ct_roi_list




def get_test_ct_list(institution_name):
    '''
    #input patient filter and a roi name (now, make it simple, the patient filter is an institution name)
    #           eg. patients from the training institution
    #           return a ct nrrd file list
    :param institution_name:
    :return: a ct list, each ct includes a list of image
    '''

    ct_list = []

    # get patient list
    patients = lambda_model.Patient.objects. \
        filter(institution=lambda_model.Institution.objects.filter(name=institution_name))

    for patient in patients:
        patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder

        for root, dirs, filenames in os.walk(patient_data_folder):
            # find study folders in the nrrd folder
            if utils.IMAGE_STUDY_FOLDER_PATTERN.match(root):
                # root is the study folder
                cts = []
                for dir in dirs:

                    if utils.CT_FOLDER_PATTERN.match(dir):

                        abp_ct = os.path.join(root, dir)
                        for image in os.listdir(abp_ct):
                            cts.append(os.path.join(abp_ct, image))

                ct_list.append(cts)

    return ct_list


#addInstitution('test')

# importPatientData(r'MDACC-OropharynxRadiomicsChallenge-Test', r'/data/LAMBDA/MDACC-OropharynxRadiomicsChallenge\Test')
# importPatientData(r'MDACC-OropharynxRadiomicsChallenge-Training', r'/data/LAMBDA/MDACC-OropharynxRadiomicsChallenge\Training')
#importPatientMedicalRecord(r'MDACC-OropharynxRadiomicsChallenge-Test', r'/data/LAMBDA/MDACC-OropharynxRadiomicsChallenge\Test.csv')
# importPatientMedicalRecord(r'MDACC-OropharynxRadiomicsChallenge-Training', r'/data/LAMBDA/MDACC-OropharynxRadiomicsChallenge\Training.csv')

#importPatientData(r'test', r'/data/LAMBDA/1301014\dicom')
#addInstitution('HN-CHUM')
#importPatientData(r'HN-CHUM', r'/data/LAMBDA/HN-CHUM\Head-Neck-PET-CT')

#importPatientMedicalRecord2(r'HNSCC',r'/data/LAMBDA/HNSCC/HNSCC-ClinData_date_offset.csv')
#importPatientMedicalRecord_CHUM(r'HN-CHUM', r'D:\LAMBDA\HN-CHUM\mr.csv')
#importPatientMedicalRecord_features(r'imrt-features',r'D:\GOOShare\User\li.liao\parotidfeatures\imrtfeatures-medicalrecord.csv')
#importDosimetry(r'imrt-features',r'D:\GOOShare\User\li.liao\parotidfeatures\imrtfeatures-dosimetry.csv')


#patients = lambda_model.Patient.objects.filter(patient_id = '1301014')
#for patient in patients:
#    patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
#    utils.readUidAndDescriptionFromDicom(patient_data_folder)

# patients = lambda_model.Patient.objects.filter(patient_id = '134')
# for patient in patients:
#
#     patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
#     dtn = utils.DicomToNRRD()
#     dtn.generateNrrd(patient_data_folder)

#
# patients = lambda_model.Patient.objects.all()
# large_nnrd_names = []
#
# for patient in patients:
#     patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
#     utils.calculateRadiomics(patient_data_folder)
    #utils.findLargeRoiNrrd(patient_data_folder, large_nnrd_names)

# file = 'large_nrrd.txt'
# large_nnrd_names.sort()
# print(len(large_nnrd_names))
# f = open(file, 'w')
# for n in large_nnrd_names:
#     f.write(n + '\n')
#
# f.close()

#
# radiomics_result = r'D:/LAMBDA/institution-3/HNSCC-01-0001/result/1.3.6.1.4.1.14519.5.2.1.1706.8040.141473127645431244275904143582/radiomics_19981205-CT-1.3.6.1.4.1.14519.5.2.1.1706.8040.898612621408214889027419428768_19981205-RTSTRUCT-1.3.6.1.4.1.14519.5.2.1.1706.8040.244695219130951879840699778710.txt'
# print(len(radiomics_result))
# if(len(radiomics_result)>260):
#     radiomics_result = radiomics_result[0:255]+'.txt'
# print(len(radiomics_result))
# rf = open(radiomics_result, "w")
# ss = 'aaa'
# rf.write(ss)
# rf.close()

# patients = lambda_model.Patient.objects.all()
# for patient in patients:
#     patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
#     utils.readUidAndDescriptionFromDicom(patient_data_folder)
#
# import json
#
# file = r'D:\LAMBDA\LAMBDA\20180222\pinnacle\20171015-1031-1-151.1\20171015-1031-1-151.1\Institution_2\Mount_0\Patient_9098/Patient'
#
# f = open(file, 'r')
# content = f.read()
# #print(content)
# content = content.replace("=", ":")
# print(content)
#
# d = json.loads(content)
# print(d)

# institution_name = 'MDACC-OropharynxRadiomicsChallenge-Test'
# try:
#     institution = lambda_model.Institution.objects.get(name=institution_name)
# except lambda_model.Institution.DoesNotExist:
#     institution = None
#     print('institution: ' + institution_name + ' dose not exist!')
#     exit(0)
#
#
# csv_file_Demography = open(institution_name+'-Demography.csv', 'wb')
# columnTitleRow = "patient_id, name, name_first, name_last, gender, age, birth_date\n"
# csv_file_Demography.write(columnTitleRow)
# patients = lambda_model.Patient.objects.filter(institution=institution)
# for patient in patients:
#     patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
#     str = ''
#     str += patient.patient_id + ', '
#     str += patient.name.strip() + ', '
#     str += patient.name_first.strip() + ', '
#     str += patient.name_last.strip() + ', '
#     str += patient.gender.strip() + ', '
#     str += '{}, '.format(patient.age)
#     str += '{}\n'.format(patient.birth_date)
#     csv_file_Demography.write(str)
#
#
# csv_file_MR = open(institution_name+'-MR.csv', 'wb')
# has_header = False
# patients = lambda_model.Patient.objects.filter(institution=institution)
# for patient in patients:
#     mrs = OrderedDict()
#     medical_records = lambda_model.MedicalRecord.objects.filter(patient=patient)
#     mrs['patient_id'] = patient.patient_id
#     for mr in medical_records:
#         mrs[mr.key] =  mr.value
#     w = csv.DictWriter(csv_file_MR, mrs.keys())
#     if not has_header:
#         w.writeheader()
#         has_header = True
#     w.writerow(mrs)
#
#
# csv_file_radiomics = open(institution_name+'-Radiomics.csv', 'wb')
# wr = csv.writer(csv_file_radiomics)
# has_header = False
# patients = lambda_model.Patient.objects.filter(institution=institution)
# for patient in patients:
#     result_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder + 'result/'
#     hasRadiomicsResult = False
#     for root, dirs, filenames in os.walk(result_folder):
#         for file in filenames:
#             matchResult = utils.RESULT_FILE_PATTERN.match(file)
#             if matchResult:
#                 hasRadiomicsResult = True
#                 result_type = '{}'.format(matchResult.group(1))
#                 if result_type == 'radiomics':
#                     res = os.path.join(root, file)
#                     rf = open(res, "r")
#                     thead = rf.readline().split(';')
#                     thead.insert(0, 'patient_id')
#
#                     tbody = []
#                     for line in rf:
#                         row = line.split(';')
#                         row.insert(0, patient.patient_id)
#                         tbody.append(row)
#                     rf.close()
#                     table = {}
#                     table['thead'] = thead
#                     table['tbody'] = tbody
#
#     if not has_header:
#         wr.writerow(table['thead'])
#         has_header = True
#     for body in table['tbody']:
#         wr.writerow(body)



def main():

    # Step 1: Create an instituion
    #addInstitution('Training')

    #Step 2: Import patient dicom data into institution
    #importPatientData(r'Training', r'D:\Udemy\AAPM_Thoracic_Challenge\Training')

    #Step 3: Generate NRRD, calculate Radiomics and update UUID/Description table (for display)
    patients = lambda_model.Patient.objects. \
        filter(institution=lambda_model.Institution.objects.get(name='HN'))
    for patient in patients:
        patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
        dc = utils.DataConverter()
    #    dc.generateNrrd(patient_data_folder)
    #    dc.generateCoronalSaggitalContoursForPatientFolder(patient_data_folder)
        dc.generateDVHsForPatientFolder(patient_data_folder)
    #     dc.generatePNGFromNrrd(patient_data_folder)
    #
    #     utils.calculateRadiomics(patient_data_folder)
    #     utils.readUidAndDescriptionFromDicom(patient_data_folder)

    #Step 4: Select data for training
    #           input: patient filter and a roi name (now, make it simple, the patient filter is an institution name)
    #           eg. patients from the training institution
    #               ROI name Heart (Using ROI pattern for roi searching)
    #           make sure every patient in this patient list has this roi
    #           output: a paired ct/roi file list
    #training_image_lable_list = get_training_image_label_list(institution_name="Training", roi_name="Heart")


    #Step 5: Call training function
    #           input: a paired ct/roi file list
    #           output: a trained model
    # unet.train_UNet_model(training_image_lable_list,
    #                       train_valid_ratio = 0.8,
    #                       dims = [256, 256],
    #                       batch_size = 16,
    #                       steps_per_epoch= 600,
    #                       nb_epoch=100,
    #                       validation_steps=10,
    #                       output_weight_path ="{}_weights.best.hdf5".format('unet256'),
    #                       output_model_path ='unet_256.h5')


    # # Step 6:Generate data for testing
    # # Create an instituion
    # addInstitution('Test')
    #
    # # Import patient dicom data into institution
    # importPatientData(r'Test', r'/data/AAPM_Thoracic_Challenge/Test')
    #
    # # Generate NRRD, calculate Radiomics and update UUID/Description table (for display)
    # patients = lambda_model.Patient.objects. \
    #     filter(institution=lambda_model.Institution.objects.filter(name='Test'))
    # for patient in patients:
    #     patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
    #     dtn = utils.NRRDConverter()
    #     dtn.generateNrrd(patient_data_folder)
    #     dtn.generatePNGFromNrrd(patient_data_folder)
    #
    #     utils.calculateRadiomics(patient_data_folder)
    #     utils.readUidAndDescriptionFromDicom(patient_data_folder)
    #
    #Step 6: Select data for testing
    #           input: a patient filter
    #           output: a ct list
    # test_ct_list = get_test_ct_list(institution_name="Training")
    # for ct in test_ct_list:
    #     if len(ct) > 0:
    #         ct_folder = os.path.dirname(ct[0])
    #     else:
    #         continue
    #
    #     study_folder = os.path.dirname(ct_folder)
    #     rs_dicom_uid = pydicom.uid.generate_uid()
    #     t = datetime.now()
    #     rs_folder_name = t.strftime("%Y%m%d") + "-" + "RTSTRUCT" + "-" + rs_dicom_uid
    #     rs_folder = os.path.join(study_folder, rs_folder_name)
    #     unet.predict_contour(ct,
    #                         roi_name="Heart",
    #                         dims = [256, 256],
    #                         load_weight_path ="/data/AAPM_Thoracic_Challenge/output2/whole/Heart/unet256_weights.best.hdf5",
    #                         load_model_path ="/data/AAPM_Thoracic_Challenge/output2/whole/Heart/unet_256.h5",
    #                         output_folder = rs_folder)
    #
    #     if rs_dicom_uid is not None:
    #         print("Generate RS: " + str(rs_dicom_uid))
    #     else:
    #         print("Roi predict error!")
    #
    #
    #Step 7: Generate test results
    #           input:  a trained model
    #                   test data
    #           output: nrrd and dicom files


    # img_folder = "/data/LAMBDA/institution-1/LCTSC-Train-S1-002/image/1.3.6.1.4.1.14519.5.2.1.7014.4598.665008031803939868532289200439/20181030-RTSTRUCT-1.2.826.0.1.3680043.8.498.11342721553100452643594726921704938248/Heart"
    # ct_nrrd_file = "/data/LAMBDA/institution-1/LCTSC-Train-S1-002/nrrd/1.3.6.1.4.1.14519.5.2.1.7014.4598.665008031803939868532289200439/20031102-CT-1.3.6.1.4.1.14519.5.2.1.7014.4598.234842392725588194788547945938.nrrd"
    # dtn = utils.NRRDConverter()
    # dtn.RsImg2Nrrd(img_folder, [512, 512], ct_nrrd_file)
    #
    # dtn.RsNrrd2Dicom("/data/LAMBDA/institution-1/LCTSC-Train-S1-002/nrrd/1.3.6.1.4.1.14519.5.2.1.7014.4598.665008031803939868532289200439/20181030-RTSTRUCT-1.2.826.0.1.3680043.8.498.11342721553100452643594726921704938248",
    #                  "/data/LAMBDA/institution-1/LCTSC-Train-S1-002/dicom/1.3.6.1.4.1.14519.5.2.1.7014.4598.665008031803939868532289200439/20031102-CT-1.3.6.1.4.1.14519.5.2.1.7014.4598.234842392725588194788547945938",
    #                  "/data/LAMBDA/institution-1/LCTSC-Train-S1-002/dicom/1.3.6.1.4.1.14519.5.2.1.7014.4598.665008031803939868532289200439/20181030-RTSTRUCT-1.2.826.0.1.3680043.8.498.11342721553100452643594726921704938248.dcm")
    # utils.readUidAndDescriptionFromDicom("/data/LAMBDA/institution-1/LCTSC-Train-S1-002")


if __name__=="__main__":
    main()