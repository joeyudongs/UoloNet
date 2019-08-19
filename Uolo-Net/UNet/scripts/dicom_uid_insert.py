import os, sys

sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'webplatform.settings'
import django

django.setup()
from lambda_rad import models as lambda_model
from lambda_rad import utils
import fnmatch
import pydicom
from lambda_rad import helloRadiomics
import errno
from django.conf import settings
import shutil
import csv
import re
import pydicom

patients = lambda_model.Patient.objects.all()
for patient in patients:
    patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder
    utils.readUidAndDescriptionFromDicom(patient_data_folder)

# strs = [
#     r'D:\PycharmProjects\webplatform\venv64bit\Scripts\python.exe D:/PycharmProjects/webplatform/dicom_uid_insert.py',
#     r'Search folder: D:/LAMBDA/institution-3/HNSCC-01-0001/',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/',
#     r'match result: None',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/dicom',
#     r'match result: None',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/dicom\1.3.6.1.4.1.14519.5.2.1.1706.8040.141473127645431244275904143582',
#     r'match result: <_sre.SRE_Match object at 0x00000000181355A8>',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/dicom\1.3.6.1.4.1.14519.5.2.1.1706.8040.141473127645431244275904143582\19981205-CT-1.3.6.1.4.1.14519.5.2.1.1706.8040.898612621408214889027419428768',
#     r'Search folder: D:/LAMBDA/institution-3/HNSCC-01-0001/',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/',
#     r'match result: None',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/dicom',
#     r'match result: None',
#     r'D:/LAMBDA/institution-3/HNSCC-01-0001/dicom\1.3.6.1.4.1.14519.5.2.1.1706.8040.141473127645431244275904143582',
#     r'match result: <_sre.SRE_Match object at 0x00000000181355A8>',
#     ]
#
# for st in strs:
#     print(st)
#     matchObj = utils.DICOM_STUDY_FOLDER_PATTERN.match(st)
#     print('match result: ' + str(matchObj))

# LAMBDA_INSTITUTION_PATTERN = re.compile(r'institution-\d+', re.IGNORECASE)
# RTSTRUCT_DICOM_PATTERN = re.compile(r'^.*-RTSTRUCT-.*(\/?\\?)(\d+\.)+(\d+)+.dcm$', re.IGNORECASE)
#
# institution_dirs = [r'/data/LAMBDA/institution-1',
#         r'/data/LAMBDA/institution-2',
#         r'/data/LAMBDA/institution-3',
#         r'/data/LAMBDA/institution-4']
#
#
# f = r'D:/LAMBDA/roi_name.txt'
# names = []
#
# for dir in institution_dirs:
#     for root, dirs, filenames in os.walk(dir):
#         for file in filenames:
#             if RTSTRUCT_DICOM_PATTERN.match(file):
#                 abp_rs_dicom = os.path.join(root, file)
#                 print(abp_rs_dicom)
#
#                 dcmdataset = pydicom.read_file(abp_rs_dicom)
#
#                 for i in range(len(dcmdataset.ROIContourSequence)):
#                     name = dcmdataset.StructureSetROISequence[i].ROIName
#                     if not name in names:
#                         names.append(name)
#                         print(name)
#
# names.sort()
# fw = open(f, 'w')
# for n in names:
#     fw.write(n + '\n')
#
# fw.close()
