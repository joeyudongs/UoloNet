import subprocess
import os
import re
import errno
import numpy as np
try:
    from pydicom.dicomio import read_file
    from pydicom.dataset import Dataset
except ImportError:
    from dicom import read_file
    from dicom.dataset import Dataset

import pydicom.uid
from pydicom.dataset import Dataset, FileDataset
from pydicom.sequence import Sequence

import random
from numbers import Number
from six import PY2, iterkeys, string_types
from six.moves import range
from dicompylercore import dvh, dvhcalc

pil_available = True
try:
    from PIL import Image
except:
    pil_available = False

import matplotlib.pyplot as plt
import nrrd
from skimage import measure
import json

from webplatform import settings
import lambda_rad
from lambda_rad.dicomparser import DicomParser
from datetime import datetime
import webcolors
from scipy.misc import imread, imsave, imresize



CT_FOLDER_PATTERN = re.compile(r'^.*-CT-.*(\/?\\?)(\d+\.)+(\d+)$', re.IGNORECASE)
CT_NRRD_PATTERN = re.compile(r'^.*-CT-.*(\/?\\?)(\d+\.)+(\d+)+.nrrd$', re.IGNORECASE)

RTSTRUCT_FOLDER_PATTERN = re.compile(r'^.*-RTSTRUCT-.*(\/?\\?)(\d+\.)+(\d+)$', re.IGNORECASE)
RTSTRUCT_DICOM_PATTERN = re.compile(r'^.*-RTSTRUCT-.*(\/?\\?)(\d+\.)+(\d+).dcm$', re.IGNORECASE)

RTDOSE_DICOM_PATTERN = re.compile(r'^.*-RTDOSE-.*(\/?\\?)(\d+\.)+(\d+).dcm$', re.IGNORECASE)


DICOM_STUDY_FOLDER_PATTERN = re.compile(r'^(.*)(\\?\/?)dcm(\\?\/?)((\d+\.)+(\d+))$', re.IGNORECASE)
NRRD_STUDY_FOLDER_PATTERN = re.compile(r'^(.*)(\\?\/?)nrrd(\\?\/?)((\d+\.)+(\d+))$', re.IGNORECASE)

IMAGE_STUDY_FOLDER_PATTERN = re.compile(r'^(.*)(\\?\/?)img(\\?\/?)((\d+\.)+(\d+))$', re.IGNORECASE)


SERIES_PATTERN = re.compile(r'^([a-zA-Z\d]*?)-([A-Z]+)-((\d+\.)+(\d+))(\.?[a-zA-Z])*$', re.IGNORECASE)
STUDY_PATTERN = re.compile(r'^((\d+\.)+(\d+))$', re.IGNORECASE)

NRRD_FILE_PATTERN = re.compile('.*nrrd$', re.IGNORECASE)

RESULT_FILE_PATTERN = re.compile(r'^(.*)_([a-zA-Z\d]*?)-([A-Z]+)-((\d+\.)+(\d+))(\.?[a-zA-Z])*_([a-zA-Z\d]*?)-([A-Z]+)-((\d+\.)+(\d+))(\.?[a-zA-Z])*$', re.IGNORECASE)

TARGET_RELATED_PATTERN = re.compile('^[a-zA-Z]*( )*[c,g,p]tv( )*\-*[a-zA-Z]*\d*[\.]*\d*$', re.IGNORECASE)

PRIVATE_IP_ADDRESS_PATTERN = re.compile('(^192\.168\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)'
                                        '|(^127\.([1][6-9]|[2][0-9]|[3][0-1])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)'
                                        '|(^10\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])\.([0-9]|[0-9][0-9]|[0-2][0-5][0-5])$)', re.IGNORECASE)

def get_roi_patterns(roi_pattern_file):
    patterns = {}

    with open(roi_pattern_file, 'r') as file:

        for line in file:
            line = line.strip()
            if line == '':
                continue
            columns = line.split(',')
            if len(columns)>0:
                key = str(columns[0])
                v=''
                for c in columns:
                    if not c == '':
                        v += '^'+c+'$|'
                v = v[:-1]
                #print('Key: ' + key + ' Value: ' +v)

                value = re.compile(v, re.IGNORECASE)
                patterns[key] = value

    return patterns


ROI_PATTERNS = get_roi_patterns('data/ROI.csv')

# """
# checkDicomFile
# To check the dicom files are ready to use
# Input: dicom parent folder path (str)
# Output: dicomReady (bool)
#         dicom folder
#         ct folder
#         rs file
# """
# def checkDicomFile(dir):
#     dicomReady = False
#     dicom = ''
#     ct = ''
#     rs = ''
#     if os.path.isfile(dir):
#         return dicomReady
#
#     if os.path.isdir(dir):
#         dicom = os.path.join(dir, "dcm")
#         if os.path.exists(dicom) and os.path.isdir(dicom):
#             ct = os.path.join(dicom, "CT")
#             rs = os.path.join(dicom, "RS.dcm")
#             if os.path.exists(ct) and os.path.isdir(ct) and os.path.exists(rs) and os.path.isfile(rs):
#                 cts = os.listdir(ct)
#                 if len(cts)>0:
#                     dicomReady = True
#
#     return dicomReady, dicom, ct, rs
#
#
# """
# checkNrrdFile
# To check the nrrd files are ready to use
# Input: nrrd parent folder path (str)
# Output: nrrdReady (bool)
#         nrrd folder
#         image nrrd file
#         rs nrrd folder
# """
# def checkNrrdFile(dir):
#     nrrdReady = False
#     nrrd = ''
#     ct = ''
#     rs = ''
#     if os.path.isfile(dir):
#         return nrrdReady
#
#     if os.path.isdir(dir):
#         nrrd = os.path.join(dir, "NRRD")
#         if os.path.exists(nrrd) and os.path.isdir(nrrd):
#             ct = os.path.join(nrrd, "ct.nrrd")
#             rs = os.path.join(nrrd, "RS")
#             if os.path.exists(ct) and os.path.isfile(ct) and os.path.exists(rs) and os.path.isdir(rs):
#                 rss = os.listdir(rs)
#                 if len(rss) > 0:
#                     nrrdReady = True
#
#     return nrrdReady, nrrd, ct, rs
#
#
# """
# checkResutlsFile
# To check the results have calculated already
# Input: results folder's parent folder path (str)
# Output: results (array)
# """
# def checkResultFile(dir):
#     results = []
#     if os.path.isfile(dir):
#         return results
#
#     if os.path.isdir(dir):
#         res = os.path.join(dir, "RESULTS")
#         if os.path.exists(res) and os.path.isdir(res):
#             for rss in os.listdir(res):
#                 results.append(rss)
#
#     return results

#
# class DicomParser:
#     """Parses DICOM / DICOM RT files."""
#
#     def __init__(self, dataset):
#         print('Parse: ' + dataset)
#         if isinstance(dataset, Dataset):
#             self.ds = dataset
#         elif isinstance(dataset, string_types):
#             try:
#                 self.ds = \
#                     read_file(dataset, defer_size=100, force=True)
#             except:
#                 # Raise the error for the calling method to handle
#                 raise
#             else:
#                 # Sometimes DICOM files may not have headers,
#                 # but they should always have a SOPClassUID
#                 # to declare what type of file it is.
#                 # If the file doesn't have a SOPClassUID,
#                 # then it probably isn't DICOM.
#                 if not "SOPClassUID" in self.ds:
#                     raise AttributeError
#         else:
#             raise AttributeError
#
# ######################## SOP Class and Instance Methods #######################
#
#     def GetSOPClassUID(self):
#         """Determine the SOP Class UID of the current file."""
#
#         if (self.ds.SOPClassUID == '1.2.840.10008.5.1.4.1.1.481.2'):
#             return 'rtdose'
#         elif (self.ds.SOPClassUID == '1.2.840.10008.5.1.4.1.1.481.3'):
#             return 'rtss'
#         elif (self.ds.SOPClassUID == '1.2.840.10008.5.1.4.1.1.481.5'):
#             return 'rtplan'
#         elif (self.ds.SOPClassUID == '1.2.840.10008.5.1.4.1.1.2'):
#             return 'ct'
#         else:
#             return None
#
#     def GetSOPInstanceUID(self):
#         """Determine the SOP Class UID of the current file."""
#
#         return self.ds.SOPInstanceUID
#
#     def GetStudyInfo(self):
#         """Return the study information of the current file."""
#
#         study = {}
#         if 'StudyDescription' in self.ds:
#             desc = self.ds.StudyDescription
#         else:
#             desc = 'No description'
#         study['description'] = desc
#         if 'StudyDate' in self.ds:
#             date = self.ds.StudyDate
#         else:
#             date = None
#         study['date'] = date
#         # Don't assume that every dataset includes a study UID
#         if 'StudyInstanceUID' in self.ds:
#             study['id'] = self.ds.StudyInstanceUID
#         else:
#             study['id'] = str(random.randint(0, 65535))
#
#         return study
#
#     def GetSeriesInfo(self):
#         """Return the series information of the current file."""
#
#         series = {}
#         if 'SeriesDescription' in self.ds:
#             desc = self.ds.SeriesDescription
#         else:
#             desc = 'No description'
#         series['description'] = desc
#         series['id'] = self.ds.SeriesInstanceUID
#         # Don't assume that every dataset includes a study UID
#         series['study'] = self.ds.SeriesInstanceUID
#         if 'StudyInstanceUID' in self.ds:
#             series['study'] = self.ds.StudyInstanceUID
#         series['referenceframe'] = self.ds.FrameOfReferenceUID \
#             if 'FrameOfReferenceUID' in self.ds \
#             else str(random.randint(0, 65535))
#         if 'SeriesDate' in self.ds:
#             date = self.ds.SeriesDate
#         else:
#             date = None
#         series['date'] = date
#         if 'Modality' in self.ds:
#             series['modality'] = self.ds.Modality
#         else:
#             series['modality'] = 'OT'
#
#         return series
#
#     def GetReferencedSeries(self):
#         """Return the SOP Class UID of the referenced series."""
#
#         if "ReferencedFrameOfReferenceSequence" in self.ds:
#             frame = self.ds.ReferencedFrameOfReferenceSequence
#             if "RTReferencedStudySequence" in frame[0]:
#                 study = frame[0].RTReferencedStudySequence[0]
#                 if "RTReferencedSeriesSequence" in study:
#                     if "SeriesInstanceUID" in \
#                             study.RTReferencedSeriesSequence[0]:
#                         series = study.RTReferencedSeriesSequence[0]
#                         return series.SeriesInstanceUID
#         else:
#             return ''
#
#     def GetFrameOfReferenceUID(self):
#         """Determine the Frame of Reference UID of the current file."""
#
#         if 'FrameOfReferenceUID' in self.ds:
#             return self.ds.FrameOfReferenceUID
#         elif 'ReferencedFrameOfReferences' in self.ds:
#             return self.ds.ReferencedFrameOfReferences[0].FrameOfReferenceUID
#         else:
#             return ''
#
#     def GetReferencedStructureSet(self):
#         """Return the SOP Class UID of the referenced structure set."""
#
#         if "ReferencedStructureSetSequence" in self.ds:
#             return self.ds.ReferencedStructureSetSequence[0].ReferencedSOPInstanceUID
#         else:
#             return ''
#
#     def GetReferencedRTPlan(self):
#         """Return the SOP Class UID of the referenced RT plan."""
#
#         if "ReferencedRTPlanSequence" in self.ds:
#             return self.ds.ReferencedRTPlanSequence[0].ReferencedSOPInstanceUID
#         else:
#             return ''
#
#     def GetDemographics(self):
#         """Return the patient demographics from a DICOM file."""
#
#         # Set up some sensible defaults for demographics
#         patient = {'name': 'None',
#                    'id': 'None',
#                    'birth_date': None,
#                    'gender': 'Other'}
#         if 'PatientName' in self.ds:
#             if PY2:
#                 self.ds.decode()
#             name = self.ds.PatientName
#             if name:
#                 patient['name'] = str(name).strip()
#             if hasattr(name, 'given_name'):
#                 patient['given_name'] = name.given_name.strip()
#             else:
#                 patient['given_name'] = ''
#             if hasattr(name, 'middle_name'):
#                 patient['middle_name'] = name.middle_name.strip()
#             else:
#                 patient['middle_name'] = ''
#             if hasattr(name, 'family_name'):
#                 patient['family_name'] = name.family_name.strip()
#             else:
#                 patient['family_name'] = ''
#         if 'PatientID' in self.ds:
#             patientId= ((self.ds[(0x0010, 0x0020)]).repval).encode('UTF-8')
#             patientId2 = self.ds.PatientID
#
#             if patientId.decode('utf8').find(r"\x0"):
#                 patientId = patientId.decode('utf8')[1: patientId.decode('utf8').find(r'\x0')].replace("\'", '').strip()
#
#             #print('patientId: ' + patientId)
#             #print('patientId2: ' + patientId2)
#
#             patient['id'] = patientId.strip()
#
#         if 'PatientSex' in self.ds:
#             if (self.ds.PatientSex == 'M'):
#                 patient['gender'] = 'M'
#             elif (self.ds.PatientSex == 'F'):
#                 patient['gender'] = 'F'
#             else:
#                 patient['gender'] = 'O'
#         if 'PatientBirthDate' in self.ds:
#             if len(self.ds.PatientBirthDate):
#                 patient['birth_date'] = str(self.ds.PatientBirthDate).strip()
#
#         return patient
#
#
# ############################### Image Methods #################################
#
#     def GetImageData(self):
#         """Return the image data from a DICOM file."""
#
#         data = {}
#
#         if 'ImagePositionPatient' in self.ds:
#             data['position'] = self.ds.ImagePositionPatient
#         if 'ImageOrientationPatient' in self.ds:
#             data['orientation'] = self.ds.ImageOrientationPatient
#         if 'PixelSpacing' in self.ds:
#             data['pixelspacing'] = self.ds.PixelSpacing
#         else:
#             data['pixelspacing'] = [1, 1]
#         data['rows'] = self.ds.Rows
#         data['columns'] = self.ds.Columns
#         data['samplesperpixel'] = self.ds.SamplesPerPixel
#         data['photometricinterpretation'] = self.ds.PhotometricInterpretation
#         data['littlendian'] = \
#             self.ds.file_meta.TransferSyntaxUID.is_little_endian
#         if 'PatientPosition' in self.ds:
#             data['patientposition'] = self.ds.PatientPosition
#         data['frames'] = self.GetNumberOfFrames()
#
#         return data
#
#     def GetImageLocation(self):
#         """Calculate the location of the current image slice."""
#
#         ipp = self.ds.ImagePositionPatient
#         iop = self.ds.ImageOrientationPatient
#
#         normal = []
#         normal.append(iop[1] * iop[5] - iop[2] * iop[4])
#         normal.append(iop[2] * iop[3] - iop[0] * iop[5])
#         normal.append(iop[0] * iop[4] - iop[1] * iop[3])
#
#         loc = 0
#         for i in range(0, len(normal)):
#             loc += normal[i] * ipp[i]
#
#         # The image location is inverted for Feet First images
#         if 'PatientPosition' in self.ds:
#             if ('ff' in self.ds.PatientPosition.lower()):
#                 loc = loc * -1
#
#         return loc
#
#     def GetImageOrientationType(self):
#         """Get the orientation of the current image slice."""
#
#         if 'ImageOrientationPatient' in self.ds:
#             iop = np.array(self.ds.ImageOrientationPatient)
#
#             orientations = [
#                 ["SA", np.array([1, 0, 0, 0, 1, 0])],      # supine axial
#                 ["PA", np.array([-1, 0, 0, 0, -1, 0])],    # prone axial
#                 ["SS", np.array([0, 1, 0, 0, 0, -1])],     # supine sagittal
#                 ["PS", np.array([0, -1, 0, 0, 0, -1])],    # prone sagittal
#                 ["SC", np.array([1, 0, 0, 0, 0, -1])],     # supine coronal
#                 ["PC", np.array([-1, 0, 0, 0, 0, -1])]     # prone coronal
#             ]
#
#             for o in orientations:
#                 if (not np.any(np.array(np.round(iop - o[1]), dtype=np.int32))):
#                     return o[0]
#         # Return N/A if the orientation was not found or could not be determined
#         return "NA"
#
#     def GetNumberOfFrames(self):
#         """Return the number of frames in a DICOM image file."""
#
#         frames = 1
#         if 'NumberOfFrames' in self.ds:
#             frames = self.ds.NumberOfFrames.real
#         else:
#             try:
#                 self.ds.pixel_array
#             except:
#                 return 0
#             else:
#                 if (self.ds.pixel_array.ndim > 2):
#                     if (self.ds.SamplesPerPixel == 1) and not \
#                        (self.ds.PhotometricInterpretation == 'RGB'):
#                         frames = self.ds.pixel_array.shape[0]
#         return frames
#
#     def GetRescaleInterceptSlope(self):
#         """Return the rescale intercept and slope if present."""
#
#         intercept, slope = 0, 1
#         if ('RescaleIntercept' in self.ds and 'RescaleSlope' in self.ds):
#             intercept = self.ds.RescaleIntercept if \
#                 isinstance(self.ds.RescaleIntercept, Number) else 0
#             slope = self.ds.RescaleSlope if \
#                 isinstance(self.ds.RescaleSlope, Number) else 1
#
#         return intercept, slope
#
#     def GetImage(self, window=0, level=0, size=None, background=False,
#                  frames=0):
#         """Return the image from a DICOM image storage file."""
#
#         if not pil_available:
#             print("Python imaging library not available." + \
#                 " Cannot generate images.")
#             return
#
#         # Return None if the Numpy pixel array cannot be accessed
#         try:
#             self.ds.pixel_array
#         except:
#             return Image.new('RGB', size, (0, 0, 0))
#
#         # Samples per pixel are > 1 & RGB format
#         if (self.ds.SamplesPerPixel > 1) and \
#            (self.ds.PhotometricInterpretation == 'RGB'):
#
#             # Little Endian
#             if self.ds.file_meta.TransferSyntaxUID.is_little_endian:
#                 im = Image.frombuffer('RGB', (self.ds.Columns, self.ds.Rows),
#                                       self.ds.PixelData, 'raw', 'RGB', 0, 1)
#             # Big Endian
#             else:
#                 im = Image.fromarray(np.rollaxis(
#                     self.ds.pixel_array.transpose(), 0, 2))
#
#         # Otherwise the image is monochrome
#         else:
#             if ((window == 0) and (level == 0)):
#                 window, level = self.GetDefaultImageWindowLevel()
#             # Rescale the slope and intercept of the image if present
#             intercept, slope = self.GetRescaleInterceptSlope()
#             # Get the requested frame if multi-frame
#             if (frames > 0):
#                 pixel_array = self.ds.pixel_array[frames]
#             else:
#                 pixel_array = self.ds.pixel_array
#
#             rescaled_image = pixel_array * slope + intercept
#
#             image = self.GetLUTValue(rescaled_image, window, level)
#             im = Image.fromarray(image).convert('L')
#
#         # Resize the image if a size is provided
#         if size:
#             im.thumbnail(size, Image.ANTIALIAS)
#
#         # Add a black background if requested
#         if background:
#             bg = Image.new('RGBA', size, (0, 0, 0, 255))
#             bg.paste(im, ((size[0] - im.size[0]) / 2,
#                      (size[1] - im.size[1]) / 2))
#             return bg
#
#         return im
#
#     def GetDefaultImageWindowLevel(self):
#         """Determine the default window/level for the DICOM image."""
#
#         window, level = 0, 0
#         if ('WindowWidth' in self.ds) and ('WindowCenter' in self.ds):
#             if isinstance(self.ds.WindowWidth, float):
#                 window = self.ds.WindowWidth
#             elif isinstance(self.ds.WindowWidth, list):
#                 if (len(self.ds.WindowWidth) > 1):
#                     window = self.ds.WindowWidth[1]
#             if isinstance(self.ds.WindowCenter, float):
#                 level = self.ds.WindowCenter
#             elif isinstance(self.ds.WindowCenter, list):
#                 if (len(self.ds.WindowCenter) > 1):
#                     level = self.ds.WindowCenter[1]
#
#         if ((window, level) == (0, 0)):
#             wmax = 0
#             wmin = 0
#             # Rescale the slope and intercept of the image if present
#             intercept, slope = self.GetRescaleInterceptSlope()
#             pixel_array = self.ds.pixel_array * slope + intercept
#
#             if (pixel_array.max() > wmax):
#                 wmax = pixel_array.max()
#             if (pixel_array.min() < wmin):
#                 wmin = pixel_array.min()
#             # Default window is the range of the data array
#             window = int(abs(wmax) + abs(wmin))
#             # Default level is the range midpoint minus the window minimum
#             level = int(window / 2 - abs(wmin))
#         return window, level
#
#     def GetLUTValue(self, data, window, level):
#         """Apply the RGB Look-Up Table for the data and window/level value."""
#
#         lutvalue = util.piecewise(data,
#                                 [data <= (level - 0.5 - (window - 1) / 2),
#                                  data > (level - 0.5 + (window - 1) / 2)],
#                                 [0, 255, lambda data:
#                                  ((data - (level - 0.5)) / (window-1) + 0.5) *
#                                  (255 - 0)])
#         # Convert the resultant array to an unsigned 8-bit array to create
#         # an 8-bit grayscale LUT since the range is only from 0 to 255
#         return np.array(lutvalue, dtype=np.uint8)
#
#     def GetPatientToPixelLUT(self):
#         """Get the image transformation matrix from the DICOM standard Part 3
#             Section C.7.6.2.1.1"""
#
#         di = self.ds.PixelSpacing[0]
#         dj = self.ds.PixelSpacing[1]
#         orientation = self.ds.ImageOrientationPatient
#         position = self.ds.ImagePositionPatient
#
#         m = np.matrix(
#             [[orientation[0]*di, orientation[3]*dj, 0, position[0]],
#             [orientation[1]*di, orientation[4]*dj, 0, position[1]],
#             [orientation[2]*di, orientation[5]*dj, 0, position[2]],
#             [0, 0, 0, 1]])
#
#         x = []
#         y = []
#         for i in range(0, self.ds.Columns):
#             imat = m * np.matrix([[i], [0], [0], [1]])
#             x.append(float(imat[0]))
#         for j in range(0, self.ds.Rows):
#             jmat = m * np.matrix([[0], [j], [0], [1]])
#             y.append(float(jmat[1]))
#
#         return (np.array(x), np.array(y))
#
# ########################## RT Structure Set Methods ###########################
#
#     def GetStructureInfo(self):
#         """Return the patient demographics from a DICOM file."""
#
#         structure = {}
#         structure['label'] = self.ds.StructureSetLabel
#         structure['date'] = self.ds.StructureSetDate
#         structure['time'] = self.ds.StructureSetTime
#         structure['numcontours'] = len(self.ds.ROIContourSequence)
#
#         return structure
#
#     def GetStructures(self):
#         """Returns a dictionary of structures (ROIs)."""
#
#         structures = {}
#
#         # Determine whether this is RT Structure Set file
#         if not (self.GetSOPClassUID() == 'rtss'):
#             return structures
#
#         # Locate the name and number of each ROI
#         if 'StructureSetROISequence' in self.ds:
#             for item in self.ds.StructureSetROISequence:
#                 data = {}
#                 number = int(item.ROINumber)
#                 data['id'] = number
#                 data['name'] = item.ROIName
#                 #logger.debug("Found ROI #%s: %s", str(number), data['name'])
#                 structures[number] = data
#
#         # Determine the type of each structure (PTV, organ, external, etc)
#         if 'RTROIObservationsSequence' in self.ds:
#             for item in self.ds.RTROIObservationsSequence:
#                 number = item.ReferencedROINumber
#                 structures[number]['type'] = item.RTROIInterpretedType
#
#         # The coordinate data of each ROI is stored within ROIContourSequence
#         if 'ROIContourSequence' in self.ds:
#             for roi in self.ds.ROIContourSequence:
#                 number = roi.ReferencedROINumber
#
#                 # Generate a random color for the current ROI
#                 structures[number]['color'] = np.array((
#                     random.randint(0, 255),
#                     random.randint(0, 255),
#                     random.randint(0, 255)), dtype=int)
#                 # Get the RGB color triplet for the current ROI if it exists
#                 if 'ROIDisplayColor' in roi:
#                     # Make sure the color is not none
#                     if not (roi.ROIDisplayColor is None):
#                         color = roi.ROIDisplayColor
#                     # Otherwise decode values separated by forward slashes
#                     else:
#                         value = roi[0x3006, 0x002a].repval
#                         color = value.strip("'").split("/")
#                     # Try to convert the detected value to a color triplet
#                     try:
#                         structures[number]['color'] = \
#                             np.array(color, dtype=int)
#                     # Otherwise fail and fallback on the random color
#                     except:
#                         pass
#                         #logger.debug(
#                         #   "Unable to decode display color for ROI #%s",
#                         #   str(number))
#
#                 # Determine whether the ROI has any contours present
#                 if 'ContourSequence' in roi:
#                     structures[number]['empty'] = False
#                 else:
#                     structures[number]['empty'] = True
#
#         return structures
#
#     def GetStructureCoordinates(self, roi_number):
#         """Get the list of coordinates for each plane of the structure."""
#
#         planes = {}
#         # The coordinate data of each ROI is stored within ROIContourSequence
#         if 'ROIContourSequence' in self.ds:
#             for roi in self.ds.ROIContourSequence:
#                 if (roi.ReferencedROINumber == int(roi_number)):
#                     if 'ContourSequence' in roi:
#                         # Locate the contour sequence for each referenced ROI
#                         for c in roi.ContourSequence:
#                             # For each plane, initialize a new plane dict
#                             plane = {}
#
#                             # Determine all the plane properties
#                             plane['type'] = c.ContourGeometricType
#                             plane['num_points'] = int(c.NumberOfContourPoints)
#                             plane['data'] = \
#                                 self.GetContourPoints(c.ContourData)
#
#                             # Each plane which coincides with an image slice
#                             # will have a unique ID
#                             if 'ContourImageSequence' in c:
#                                 # Add each plane to the planes dict
#                                 # of the current ROI
#                                 z = str(round(plane['data'][0][2], 2)) + '0'
#                                 if z not in planes:
#                                     planes[z] = []
#                                 planes[z].append(plane)
#
#         return planes
#
#     def GetContourPoints(self, array):
#         """Parses an array of xyz points & returns a array of point dicts."""
#
#         n = 3
#         return [array[i:i+n] for i in range(0, len(array), n)]
#
#     def CalculatePlaneThickness(self, planesDict):
#         """Calculates the plane thickness for each structure."""
#
#         planes = []
#
#         # Iterate over each plane in the structure
#         for z in iterkeys(planesDict):
#             planes.append(float(z))
#         planes.sort()
#
#         # Determine the thickness
#         thickness = 10000
#         for n in range(0, len(planes)):
#             if (n > 0):
#                 newThickness = planes[n] - planes[n-1]
#                 if (newThickness < thickness):
#                     thickness = newThickness
#
#         # If the thickness was not detected, set it to 0
#         if (thickness == 10000):
#             thickness = 0
#
#         return thickness
#
# ############################## RT Dose Methods ###############################
#
#     def HasDVHs(self):
#         """Returns whether dose-volume histograms (DVHs) exist."""
#
#         if not "DVHSequence" in self.ds:
#             return False
#         else:
#             return True
#
#     def GetDVHs(self):
#         """Returns cumulative dose-volume histograms (DVHs)."""
#
#         self.dvhs = {}
#
#         if self.HasDVHs():
#             for item in self.ds.DVHSequence:
#                 # Make sure that the DVH has a referenced structure / ROI
#                 if not 'DVHReferencedROISequence' in item:
#                     continue
#                 number = item.DVHReferencedROISequence[0].ReferencedROINumber
#                 #logger.debug("Found DVH for ROI #%s", str(number))
#                 self.dvhs[number] = dvh.DVH.from_dicom_dvh(self.ds, number)
#
#         return self.dvhs
#
#     def GetDoseGrid(self, z=0, threshold=0.5):
#         """
#         Return the 2d dose grid for the given slice position (mm).
#
#         :param z:           Slice position in mm.
#         :param threshold:   Threshold in mm to determine the max difference
#                             from z to the closest dose slice without
#                             using interpolation.
#         :return:            An numpy 2d array of dose points.
#         """
#
#         # If this is a multi-frame dose pixel array,
#         # determine the offset for each frame
#         if 'GridFrameOffsetVector' in self.ds:
#             z = float(z)
#             # Get the initial dose grid position (z) in patient coordinates
#             imagepatpos = self.ds.ImagePositionPatient[2]
#             orientation = self.ds.ImageOrientationPatient[0]
#             # Add the position to the offset vector to determine the
#             # z coordinate of each dose plane
#             planes = orientation * np.array(self.ds.GridFrameOffsetVector) + \
#                 imagepatpos
#             frame = -1
#             # Check to see if the requested plane exists in the array
#             if (np.amin(np.fabs(planes - z)) < threshold):
#                 frame = np.argmin(np.fabs(planes - z))
#             # Return the requested dose plane, since it was found
#             if not (frame == -1):
#                 return self.ds.pixel_array[frame]
#             # Check if the requested plane is within the dose grid boundaries
#             elif ((z < np.amin(planes)) or (z > np.amax(planes))):
#                 return np.array([])
#             # The requested plane was not found, so interpolate between planes
#             else:
#                 # Determine the upper and lower bounds
#                 umin = np.fabs(planes - z)
#                 ub = np.argmin(umin)
#                 lmin = umin.copy()
#                 # Change the min value to the max so we can find the 2nd min
#                 lmin[ub] = np.amax(umin)
#                 lb = np.argmin(lmin)
#                 # Fractional distance of dose plane between upper & lower bound
#                 fz = (z - planes[lb]) / (planes[ub] - planes[lb])
#                 plane = self.InterpolateDosePlanes(
#                     self.ds.pixel_array[ub], self.ds.pixel_array[lb], fz)
#                 return plane
#         else:
#             return np.array([])
#
#     def InterpolateDosePlanes(self, uplane, lplane, fz):
#         """Interpolates a dose plane between two bounding planes at the given
#            relative location.
#
#         :param uplane:      Upper dose plane boundary.
#         :param uplane:      Lower dose plane boundary.
#         :param fz:          Fractional distance from the bottom to the top,
#                             where the new plane is located.
#                             E.g. if fz = 1, the plane is at the upper plane,
#                             fz = 0, it is at the lower plane.
#         :return:            An numpy 2d array of the interpolated dose plane.
#         """
#
#         # A simple linear interpolation
#         doseplane = fz*uplane + (1.0 - fz)*lplane
#
#         return doseplane
#
#     def GetIsodosePoints(self, z=0, level=100, threshold=0.5):
#         """Return points for the given isodose level and slice position
#            from the dose grid.
#
#         :param z:           Slice position in mm.
#         :param threshold:   Threshold in mm to determine the max difference
#                             from z to the closest dose slice without
#                             using interpolation.
#         :param level:       Isodose level in scaled form
#                             (multiplied by self.ds.DoseGridScaling)
#         :return:            An array of tuples representing isodose points.
#         """
#
#         plane = self.GetDoseGrid(z, threshold)
#         isodose = (plane >= level).nonzero()
#         return list(zip(isodose[1].tolist(), isodose[0].tolist()))
#
#     def GetDoseData(self):
#         """Return the dose data from a DICOM RT Dose file."""
#
#         data = self.GetImageData()
#         data['doseunits'] = self.ds.DoseUnits
#         data['dosetype'] = self.ds.DoseType
#         data['dosecomment'] = self.ds.DoseComment \
#             if 'DoseComment' in self.ds else ''
#         data['dosesummationtype'] = self.ds.DoseSummationType
#         data['dosegridscaling'] = self.ds.DoseGridScaling
#         data['dosemax'] = float(self.ds.pixel_array.max())
#         data['lut'] = self.GetPatientToPixelLUT()
#         data['fraction'] = ''
#         if "ReferencedRTPlanSequence" in self.ds:
#             plan = self.ds.ReferencedRTPlanSequence[0]
#             if "ReferencedFractionGroupSequence" in plan:
#                 data['fraction'] = \
#                 plan.ReferencedFractionGroupSequence[0].ReferencedFractionGroupNumber
#
#         return data
#
#     def GetReferencedBeamNumber(self):
#         """Return the referenced beam number (if it exists) from RT Dose."""
#
#         beam = None
#         if "ReferencedRTPlanSequence" in self.ds:
#             rp = self.ds.ReferencedRTPlanSequence[0]
#             if "ReferencedFractionGroupSequence" in rp:
#                 rf = rp.ReferencedFractionGroupSequence[0]
#                 if "ReferencedBeamSequence" in rf:
#                     if "ReferencedBeamNumber" in rf.ReferencedBeamSequence[0]:
#                         beam = \
#                             rf.ReferencedBeamSequence[0].ReferencedBeamNumber
#
#         return beam
#
# ############################## RT Plan Methods ###############################
#
#     def GetPlan(self):
#         """Returns the plan information."""
#
#         self.plan = {}
#
#         self.plan['label'] = self.ds.RTPlanLabel
#         self.plan['date'] = self.ds.RTPlanDate
#         self.plan['time'] = self.ds.RTPlanTime
#         self.plan['name'] = ''
#         self.plan['rxdose'] = 0
#         if "DoseReferenceSequence" in self.ds:
#             for item in self.ds.DoseReferenceSequence:
#                 if item.DoseReferenceStructureType == 'SITE':
#                     self.plan['name'] = "N/A"
#                     if "DoseReferenceDescription" in item:
#                         self.plan['name'] = item.DoseReferenceDescription
#                     if 'TargetPrescriptionDose' in item:
#                         rxdose = item.TargetPrescriptionDose * 100
#                         if (rxdose > self.plan['rxdose']):
#                             self.plan['rxdose'] = rxdose
#                 elif item.DoseReferenceStructureType == 'VOLUME':
#                     if 'TargetPrescriptionDose' in item:
#                         self.plan['rxdose'] = item.TargetPrescriptionDose * 100
#         if (("FractionGroupSequence" in self.ds) and (self.plan['rxdose'] == 0)):
#             fg = self.ds.FractionGroupSequence[0]
#             if ("ReferencedBeams" in fg) and \
#                ("NumberofFractionsPlanned" in fg):
#                 beams = fg.ReferencedBeams
#                 fx = fg.NumberofFractionsPlanned
#                 for beam in beams:
#                     if "BeamDose" in beam:
#                         self.plan['rxdose'] += beam.BeamDose * fx * 100
#         self.plan['rxdose'] = int(self.plan['rxdose'])
#         self.plan['brachy'] = False
#         if ("BrachyTreatmentTechnique" in self.ds) or \
#                 ("BrachyTreatmentType" in self.ds):
#             self.plan['brachy'] = True
#         return self.plan
#
#     def GetReferencedBeamsInFraction(self, fx=0):
#         """Return the referenced beams from the specified fraction."""
#
#         beams = {}
#         if ("BeamSequence" in self.ds):
#             bdict = self.ds.BeamSequence
#         elif ("IonBeamSequence" in self.ds):
#             bdict = self.ds.IonBeamSequence
#         else:
#             return beams
#
#         # Obtain the beam information
#         for b in bdict:
#             beam = {}
#             beam['name'] = b.BeamName if "BeamName" in b else ""
#             beam['description'] = b.BeamDescription \
#                 if "BeamDescription" in b else ""
#             beams[b.BeamNumber.real] = beam
#
#         # Obtain the referenced beam info from the fraction info
#         if ("FractionGroupSequence" in self.ds):
#             fg = self.ds.FractionGroupSequence[fx]
#             if ("ReferencedBeamSequence" in fg):
#                 rb = fg.ReferencedBeamSequence
#                 nfx = fg.NumberOfFractionsPlanned
#                 for b in rb:
#                     if "BeamDose" in b:
#                         beams[b.ReferencedBeamNumber]['dose'] = \
#                             b.BeamDose * nfx * 100
#         return beams
#

# -*- coding: utf-8 -*-
"""DicomToNRRD class.

This class call plastimatch functions which installed on windows to convert 
dicom image and structure files to nrrd files.
http://plastimatch.org/plastimatch.html

Section breaks are created by resuming unindented text. Section breaks
are also implicitly created anytime a new section starts.

Attributes:
    plastimatchPath (str): The path to plastimatch.exe.

Todo:
    * For module TODOs

Author:
    Li Liao

Last modified:
    1-23-2018
"""


class DataConverter:
    plastimatchPath = settings.PLASTIMATCHPATH

    def convertDicomCTDirToNrrd(self, inputDir, outputFile):
        """ Convert a set of CT image in a folder to a nrrd image file.

            Args:
                inputDir (str): The input CT image folder path.
                outputFile (str): The output nrrd file path.

            Returns:
                None

        """
        #input = " --input " + str(inputDir) + " "
        #output = " --output-img " + str(outputFile) + " "
        #type = " --output-type int"
        command = [self.plastimatchPath, "convert", "--input", str(inputDir), "--output-img", str(outputFile), "--output-type", "int"]
        print(command)
        subprocess.call(command)

    def convertDicomRTContourTo4DNrrd(self, inputFile, outputNrrd, outputList):
        """ Convert a RT structure dicom file a 4D nrrd image file.

            Args:
                inputFile (str): The input CT image folder path.
                outputNrrd (str): The output nrrd file path.
                outputList (str): The output list file path.

            Returns:
                None

        """
        #input = " --input " + str(inputFile)
        #output = " --output-ss-img " + str(outputNrrd)
        #type = " --output-type uchar"
        #list = " --output-ss-list " + str(outputList)
        #command = []
        #command.append(self.plastimatchPath)
        #command.append("convert " + input + output + list + type)
        command = [self.plastimatchPath, "convert", "--input", str(inputFile), "--output-ss-img", str(outputNrrd),
                   "--output-type", "uchar", "--output-ss-list", str(outputList)]

        print(command)
        subprocess.call(command)

    def convertDicomRTContourToNrrds(self, inputFile, outputDir, outputList, refCTDir=""):
        """ Convert a RT structure dicom file a 4D nrrd image file.

            Args:
                inputFile (str): The input CT image folder path.
                outputNrrd (str): The output nrrd file path.
                outputList (str): The output list file path. The list file containing names and colors.

            Returns:
                None

        """
        input = " --input " + str(inputFile)
        refCT = " --referenced-ct " + str(refCTDir)
        output = " --output-prefix " + str(outputDir)
        type = " --output-type uchar"
        format = " --prefix-format \"nrrd\""
        list = " --output-ss-list " + str(outputList)
        if refCTDir == "":
            command = [self.plastimatchPath, "convert", "--input", str(inputFile), "--output-prefix", str(outputDir),
                       "--output-ss-list", str(outputList), "--output-type", "uchar", "--prefix-format" , "nrrd"]

            #command = []
            #ommand.append(self.plastimatchPath)
            #command.append("convert " + input + output + list + type + format)
        else:
            command = [self.plastimatchPath, "convert", "--input", str(inputFile), "--output-prefix", str(outputDir),
                       "--output-ss-list", str(outputList), "--output-type", "uchar", "--prefix-format", "nrrd", "--referenced-ct", str(refCTDir)]
            #command = []
            #command.append(self.plastimatchPath)
            #command.append("convert " + input + output + list + type + format + refCT)

        print(command)
        subprocess.call(command)

    def generateNrrd(self, patient_data_folder, force_update=False):

        for root, dirs, filenames in os.walk(patient_data_folder):
            reference_ct = ""
            for dir in dirs:
                if CT_FOLDER_PATTERN.match(dir):
                    CT_abpath = os.path.join(root, dir)
                    reference_ct = CT_abpath
                    print(dir)
                    nrrd_file_name = dir + '.nrrd'

                    nrrd_folder_path = str(root).replace('dcm', 'nrrd')

                    print(nrrd_folder_path)
                    try:
                        os.makedirs(nrrd_folder_path)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            raise

                    print(nrrd_file_name)

                    nrrd_abpath = os.path.join(nrrd_folder_path, nrrd_file_name)
                    print(nrrd_abpath)

                    if not os.path.exists(nrrd_abpath) or force_update:
                        self.convertDicomCTDirToNrrd(CT_abpath, nrrd_abpath)
                    else:
                        print("nrrd file: " + nrrd_abpath + " exist!")


            for filename in filenames:
                if RTSTRUCT_DICOM_PATTERN.match(filename):
                    RTSTRUCT_abpath = os.path.join(root, filename)

                    print(filename)

                    RTSTRUCT_abpath = os.path.join(root, filename)

                    nrrd_file_name = filename.replace('.dcm','')

                    nrrd_folder_path = str(root).replace('dcm', 'nrrd')

                    print(nrrd_folder_path)
                    try:
                        os.makedirs(nrrd_folder_path)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            raise

                    print(nrrd_file_name)

                    nrrd_abpath = os.path.join(nrrd_folder_path, nrrd_file_name)
                    print(nrrd_abpath)

                    if not os.path.exists(nrrd_abpath) or force_update:
                        if reference_ct != "":
                            self.convertDicomRTContourToNrrds(RTSTRUCT_abpath, nrrd_abpath,
                                                              os.path.join(nrrd_abpath, 'rts.txt'), refCTDir=reference_ct)
                        else:
                            self.convertDicomRTContourToNrrds(RTSTRUCT_abpath, nrrd_abpath,
                                                              os.path.join(nrrd_abpath, 'rts.txt'))
                    else:
                        print("nrrd file: " + nrrd_abpath + " exist!")

    def generatePNGFromNrrd(self, patient_data_folder, force_update=False):
       for root, dirs, filenames in os.walk(patient_data_folder):
           for file in filenames:
               if NRRD_FILE_PATTERN.match(file):
                    nrrd_file = os.path.join(root,file)
                    image_folder = nrrd_file.replace('.nrrd', '')
                    image_folder = image_folder.replace('nrrd', 'img')

                    if os.path.exists(image_folder) and not force_update:
                        print("image folder: " + image_folder + " exist!")
                        continue;

                    try:
                        os.makedirs(image_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            raise

                    readdata, header = nrrd.read(nrrd_file)

                    for i in range(0, readdata.shape[2]):
                        image_file = os.path.join(image_folder, str(i)+".png")
                        data = readdata[:,:,i]
                        data = data.astype(float).transpose()
                        nom = data.max() - data.min()
                        if (nom == 0.):
                            nom = 1
                        data = (data - data.min()) / nom

                        imsave(image_file, data)

    def RsNrrd2Json(self, rs_nrrd, output_json):
        """
        Generate contours from rs mask nrrd file
        :param rs_nrrd:
        :param output_json:
        :return:
        """
        rs_nrrd_data, rs_nrrd_header = nrrd.read(rs_nrrd)
        contour_header = rs_nrrd_header
        contour_header['sizes'] = contour_header['sizes'].tolist()
        contour_header['space directions'] = contour_header['space directions'].tolist()
        contour_header['space origin'] = contour_header['space origin'].tolist()

        contour_data = []
        for i in range(rs_nrrd_data.shape[2]):
            # if i == 112:
            # outfile.write("z: " + str(i) + "\n")
            # print("z: " + str(i))
            data = rs_nrrd_data[:, :, i]

            boundaries = measure.find_contours(data, 0.99)
            # print(type(boundaries))
            contours = []
            for b in boundaries:
                points = []
                for p in b:
                    points.append([contour_header['space origin'][0] + contour_header['space directions'][0][0] * round(p[0]),
                                   contour_header['space origin'][1] + contour_header['space directions'][1][1] * round(p[1])])

                contours.append(points)

            contour_data.append(contours)

        # nrrd.write(output_contour_json, contour_data, contour_header)
        with open(output_json, 'wb') as out_json:
            json.dump({'header': contour_header, 'data': contour_data}, out_json)

    def RsNrrd2Dicom(self, input_rs_nrrd_folder,
                            input_ct_dicom_folder,
                            output_rs_dicom,
                            study_uid = '',
                            series_uid =''):

        ct_dicom_files = [f for f in os.listdir(input_ct_dicom_folder) if
                          os.path.isfile(os.path.join(input_ct_dicom_folder, f)) and f.endswith(".dcm")]

        rs_nrrd_files = [f for f in os.listdir(input_rs_nrrd_folder) if
                         os.path.isfile(os.path.join(input_rs_nrrd_folder, f)) and f.endswith(".nrrd")]

        # sort image order
        ct_dicom_parsers = []
        for ct_dicom in ct_dicom_files:

            dp = DicomParser(os.path.join(input_ct_dicom_folder, ct_dicom))
            ct_dicom_parsers.append(dp)

        n = len(ct_dicom_parsers)
        for i in range(n - 1):
            iMin = i
            for j in range(i + 1, n):
                if ct_dicom_parsers[j].GetImageLocation() < ct_dicom_parsers[iMin].GetImageLocation():
                    iMin = j

            temp = ct_dicom_parsers[iMin]
            ct_dicom_parsers[iMin] = ct_dicom_parsers[i]
            ct_dicom_parsers[i] = temp

        file_meta = Dataset()
        file_meta.FileMetaInformationGroupLength = 0
        file_meta.FileMetaInformationVersion = b"\0\1"
        file_meta.MediaStorageSOPClassUID = b'1.2.840.10008.5.1.4.1.1.481.3'
        file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
        file_meta.TransferSyntaxUID = b'1.2.840.10008.1.2'
        file_meta.ImplementationClassUID = b'1.2.246.352.70.2.1.7'

        ds = FileDataset(output_rs_dicom, {}, file_meta=file_meta, preamble=b"\0" * 128)
        ds.SpecificCharacterSet = 'ISO_IR 100'
        ds.InstanceCreationDate = datetime.now().date()
        ds.InstanceCreationTime = datetime.now().time()
        ds.SOPClassUID = '1.2.840.10008.5.1.4.1.1.481.3'
        ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
        ds.StudyDate = ct_dicom_parsers[0].GetStudyInfo()["date"]
        # ds.StudyTime = scanTimeFromScanner.time()
        ds.AccessionNumber = ''
        ds.Modality = 'RTSTRUCT'
        ds.Manufacturer = 'ADAC'
        # ds.ReferringPhysicianName = referringPhysician
        ds.StationName = 'Go One'
        ds.StudyDescription = ct_dicom_parsers[0].GetStudyInfo()["description"]
        # ds.PhysiciansOfRecord = radiationOncologist
        # ds.ManufacturerModelName = tool_type

        # --- Referenced Study Sequence ---#
        study = Dataset()
        study_sequence = Sequence([study])
        study_sequence[0].ReferencedSOPClassUID = '1.2.840.10008.3.1.2.3.2'
        study_sequence[0].ReferencedSOPInstanceUID = ct_dicom_parsers[0].GetStudyInfo()["id"]
        ds.ReferencedStudySequence = study_sequence

        # --- Referenced Study Sequence ---#
        ds.PatientName = ct_dicom_parsers[0].ds.PatientName
        ds.PatientID = ct_dicom_parsers[0].ds.PatientID
        ds.PatientBirthDate = ct_dicom_parsers[0].ds.PatientBirthDate
        ds.PatientSex = ct_dicom_parsers[0].ds.PatientSex
        ds.SoftwareVersions = "GoOne Dicom Converter"

        if study_uid == '':
            ds.StudyInstanceUID = ct_dicom_parsers[0].ds.StudyInstanceUID
        else:
            ds.StudyInstanceUID = study_uid

        if series_uid != '':
            ds.SeriesInstanceUID = series_uid
        else:
            matchSeries = SERIES_PATTERN.match(os.path.basename(input_rs_nrrd_folder))
            if matchSeries:
                series_date = str(matchSeries.group(1))
                series_modality = str(matchSeries.group(2))
                series_uid = str(matchSeries.group(3))
                ds.SeriesInstanceUID = series_uid
            else:
                ds.SeriesInstanceUID = pydicom.uid.generate_uid()

        ds.StudyID = ct_dicom_parsers[0].ds.StudyID
        ds.SeriesNumber = ct_dicom_parsers[0].ds.SeriesNumber
        ds.SeriesDate = ds.InstanceCreationDate
        ds.SeriesDescription = "Generated by Go One auto contour!"
        ds.StructureSetLabel = "RTstruct"
        ds.StructureSetName = 'POIandROIandBOLUS'
        ds.StructureSetDate = ds.InstanceCreationDate
        ds.StructureSetTime = ds.InstanceCreationTime

        # --- Referenced Frame of ReferenceSequence ---#
        ds.ReferencedFrameOfReferenceSequence = Sequence([Dataset()])
        ds.ReferencedFrameOfReferenceSequence[0].FrameOfReferenceUID = ct_dicom_parsers[0].GetFrameOfReferenceUID()

        contourImageSequence = Sequence([Dataset() for i in range(len(ct_dicom_parsers))])
        for i in range(len(ct_dicom_parsers)):
            contourImageSequence[i].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
            contourImageSequence[i].ReferencedSOPInstanceUID = ct_dicom_parsers[i].GetSOPInstanceUID()

        rtReferencedSeriesSequence = Sequence([Dataset()])
        rtReferencedSeriesSequence[0].SeriesInstanceUID = ct_dicom_parsers[0].GetSeriesInfo()["id"]
        rtReferencedSeriesSequence[0].ContourImageSequence = contourImageSequence

        study_sequence_2 = Sequence([Dataset()])
        study_sequence_2[0].ReferencedSOPClassUID = '1.2.840.10008.3.1.2.3.2'
        study_sequence_2[0].ReferencedSOPInstanceUID = ct_dicom_parsers[0].GetStudyInfo()["id"]
        study_sequence_2[0].RTReferencedSeriesSequence = rtReferencedSeriesSequence

        ds.ReferencedFrameOfReferenceSequence[0].RTReferencedStudySequence = study_sequence_2

        # --- Structure Set ROI Sequence ---#
        # structure_number = len(points_list) + len(rs_nrrd_files)
        structure_number = len(rs_nrrd_files)
        ROINumber = 1;
        structureSetROISequence = Sequence([Dataset() for _ in range(structure_number)])
        # for i in range(len(points_list)):
        #     structureSetROISequence[ROINumber - 1].ROINumber = ROINumber
        #     structureSetROISequence[ROINumber - 1].ReferencedFrameOfReferenceUID = ct_FrameUID
        #     structureSetROISequence[ROINumber - 1].ROIName = str(points_list[i]['Name'])
        #     structureSetROISequence[ROINumber - 1].ROIGenerationAlgorithm = 'SEMIAUTOMATIC'
        #     ROINumber += 1

        for i in range(len(rs_nrrd_files)):
            structureSetROISequence[ROINumber - 1].ROINumber = ROINumber
            structureSetROISequence[ROINumber - 1].ReferencedFrameOfReferenceUID = ct_dicom_parsers[
                0].GetFrameOfReferenceUID()
            structureSetROISequence[ROINumber - 1].ROIName = str(rs_nrrd_files[i].replace(".nrrd", ""))
            structureSetROISequence[ROINumber - 1].ROIVolume = 0
            structureSetROISequence[ROINumber - 1].ROIGenerationAlgorithm = 'SEMIAUTOMATIC'
            ROINumber += 1

        ds.StructureSetROISequence = structureSetROISequence

        # --- ROI Contour Sequence ---#
        ROINumber = 1;

        ROIContourSequence = Sequence([Dataset() for _ in range(len(rs_nrrd_files))])
        # for i in range(len(points_list)):
        #     color = points_list[i]['Color']
        #     xcoord_pinn = points_list[i]['XCoord']
        #     ycoord_pinn = points_list[i]['YCoord']
        #     zcoord_pinn = points_list[i]['ZCoord']
        #
        #     xcoord_dicom = xcoord_pinn * 10
        #     ycoord_dicom = ycoord_pinn * -10
        #     zcoord_dicom = zcoord_pinn * -10
        #
        #     color = str(color).lower()
        #     rgb = webcolors.IntegerRGB
        #     if color in pinn_color_dict:
        #         rgb.red = pinn_color_dict[color][0]
        #         rgb.green = pinn_color_dict[color][1]
        #         rgb.blue = pinn_color_dict[color][2]
        #     else:
        #         try:
        #             rgb = webcolors.name_to_rgb(color)
        #         except:
        #             print('Cannot find the color "' + color + '" in web color, changed it to blue!')
        #             rgb = webcolors.name_to_rgb('blue')
        #
        #     color_str = str(rgb.red) + '\\' + str(rgb.green) + '\\' + str(rgb.blue)
        #     ROIContourSequence[ROINumber - 1].ROIDisplayColor = color_str
        #
        #     sub_contourImageSequence = Sequence([Dataset()])
        #     sub_contourImageSequence[0].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
        #     sub_contourImageSequence[0].ReferencedSOPInstanceUID = get_reference_image_UID(image_info_list, zcoord_pinn)
        #
        #     contourSequence = Sequence([Dataset()])
        #     contourSequence[0].ContourImageSequence = sub_contourImageSequence
        #     contourSequence[0].ContourGeometricType = 'POINT'
        #     contourSequence[0].NumberOfContourPoints = 1
        #     point_str = str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)
        #     contourSequence[0].ContourData = point_str
        #
        #     ROIContourSequence[ROINumber - 1].ContourSequence = contourSequence
        #     ROIContourSequence[ROINumber - 1].ReferencedROINumber = ROINumber
        #
        #     ROINumber += 1

        # roi sequence
        color_list = ['beige', 'yellow', 'orange', 'red', 'pink', 'purple', 'blue', 'navy', 'green', 'brown', 'black']

        for rs_nrrd_f in rs_nrrd_files:

            rgb = webcolors.name_to_rgb(random.choice(color_list))

            color_str = str(rgb.red) + '\\' + str(rgb.green) + '\\' + str(rgb.blue)
            ROIContourSequence[ROINumber - 1].ROIDisplayColor = color_str

            rs_nrrd_data, rs_nrrd_header = nrrd.read(os.path.join(input_rs_nrrd_folder, rs_nrrd_f))
            contour_header = rs_nrrd_header
            contour_header['sizes'] = contour_header['sizes'].tolist()
            contour_header['space directions'] = contour_header['space directions'].tolist()
            contour_header['space origin'] = contour_header['space origin'].tolist()

            contour_data = []

            for i in range(rs_nrrd_data.shape[2]):
                # i is the slice number
                data = rs_nrrd_data[:, :, i]
                # multiple boundaries can be found on one slice
                boundaries = measure.find_contours(data, 0.99)
                for b in boundaries:
                    # one boundary contains multiple points
                    points = []
                    for p in b:
                        points.append(
                            [contour_header['space origin'][0] + contour_header['space directions'][0][0] * round(p[0]),
                             contour_header['space origin'][1] + contour_header['space directions'][1][1] * round(p[1]),
                             contour_header['space origin'][2] + contour_header['space directions'][2][2] * i])

                    if len(points) > 0:
                        # append a tuple (i, points)
                        contour_data.append((i, points))

            coutour_number = len(contour_data)
            #print(coutour_number)
            #print(len(ct_dicom_parsers))
            if coutour_number > 0:
                contourSequence = Sequence([Dataset() for _ in range(coutour_number)])
                for i in range(coutour_number):
                    points = contour_data[i][1]
                    #print(contour_data[i][0])

                    sub_contourImageSequence = Sequence([Dataset()])
                    sub_contourImageSequence[0].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
                    sub_contourImageSequence[0].ReferencedSOPInstanceUID = ct_dicom_parsers[contour_data[i][0]].GetSOPInstanceUID()
                    contourSequence[i].ContourImageSequence = sub_contourImageSequence
                    contourSequence[i].ContourGeometricType = 'CLOSED_PLANAR'

                    contourSequence[i].NumberOfContourPoints = len(points) - 1

                    points_str = ''
                    for p in range(len(points) - 1):
                        xcoord_dicom = points[p][0]
                        ycoord_dicom = points[p][1]
                        zcoord_dicom = points[p][2]

                        if p == 0:
                            points_str += str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)
                        else:
                            points_str += '\\' + str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)

                    contourSequence[i].ContourData = points_str

                ROIContourSequence[ROINumber - 1].ContourSequence = contourSequence

            ROIContourSequence[ROINumber - 1].ReferencedROINumber = ROINumber

            ROINumber += 1

        ds.ROIContourSequence = ROIContourSequence
        # # --- ROI Contour Sequence ---#
        #
        ds.RTROIObservationsSequence = ''
        ROINumber = 1;
        RTROIObservationsSequence = Sequence([Dataset() for _ in range(structure_number)])
        # for i in range(len(points_list)):
        #     RTROIObservationsSequence[ROINumber - 1].ObservationNumber = ROINumber
        #     RTROIObservationsSequence[ROINumber - 1].ReferencedROINumber = ROINumber
        #     RTROIObservationsSequence[ROINumber - 1].RTROIInterpretedType = 'MARKER'
        #     RTROIObservationsSequence[ROINumber - 1].ROIInterpreter = ''
        #     ROINumber += 1

        for i in range(len(rs_nrrd_files)):
            RTROIObservationsSequence[ROINumber - 1].ObservationNumber = ROINumber
            RTROIObservationsSequence[ROINumber - 1].ReferencedROINumber = ROINumber
            RTROIObservationsSequence[ROINumber - 1].RTROIInterpretedType = 'ORGAN'
            RTROIObservationsSequence[ROINumber - 1].ROIInterpreter = ''
            ROINumber += 1
        ds.RTROIObservationsSequence = RTROIObservationsSequence

        ds.ApprovalStatus = 'UNAPPROVED'

        ds.save_as(output_rs_dicom)

    def Label2Nrrd(self, input_label_folder, nrrd_header, output_nrrd_file):

        num_slice = nrrd_header['sizes'][2]
        width = nrrd_header['sizes'][0]
        height = nrrd_header['sizes'][1]

        labels = os.listdir(input_label_folder)
        if num_slice != len(labels):
            print("size error!")
            return

        rs_data = np.zeros([width, height, num_slice])
        for i in range(num_slice):

            img = str(i) + ".png"
            img_path = os.path.join(input_label_folder, img)
            img_array = imread(img_path)
            img_array = imresize(img_array, tuple([width, height]))
            img_array = img_array.astype(float)
            nom = img_array.max() - img_array.min()
            if nom == 0.:
                nom = 1
            img_array = (img_array - img_array.min()) / nom
            img_array = np.rint(img_array).astype(int)

            img_array = np.transpose(img_array)

            rs_data[:, :, i] = img_array

        rs_data = np.array(rs_data)

        if not os.path.exists(os.path.dirname(output_nrrd_file)):
            os.makedirs(os.path.dirname(output_nrrd_file))

        nrrd.write(output_nrrd_file, rs_data, nrrd_header)

    def RsImg2Nrrd(self, image_folder, ct_nrrd_file):

        rs_nrrd_file = image_folder.replace(r"/img", r"/nrrd") + ".nrrd"

        rs_folder = os.path.dirname(rs_nrrd_file)
        try:
            os.makedirs(rs_folder)
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise

        ct_data, ct_header = nrrd.read(ct_nrrd_file)

        rs_header = ct_header

        rs_header['type'] = "uint"
        num_slice = rs_header['sizes'][2]
        width = rs_header['sizes'][0]
        height = rs_header['sizes'][1]

        imgs = os.listdir(image_folder)

        if num_slice != len(imgs):
            print("size error!")
            return

        rs_data = np.zeros([width, height, num_slice])
        for i in range(len(imgs)):

            img = str(i)+".png"
            img_path = os.path.join(image_folder, img)
            img_array = imread(img_path)
            img_array = imresize(img_array, tuple([width, height]))
            img_array = img_array.astype(float)
            nom = img_array.max() - img_array.min()
            if nom == 0.:
                nom = 1
            img_array = (img_array - img_array.min())/nom
            img_array = np.rint(img_array).astype(int)

            img_array = np.transpose(img_array)

            rs_data[:,:,i] = img_array

        rs_data = np.array(rs_data)

        nrrd.write(rs_nrrd_file,rs_data,rs_header)

    def generateCoronalSaggitalContours(self, rs_nrrd_file):
        '''
        :param rs_nrrd_file:
        :return: roi_name, contour_coronal, contour_saggital (1 string and 2 dictionaries)
        '''
        roi_name = os.path.basename(rs_nrrd_file).replace('.nrrd', '')

        rs_nrrd_data, rs_nrrd_header = nrrd.read(rs_nrrd_file)

        contour_coronal = []
        for i in range(rs_nrrd_data.shape[1]):
            slice_contour_data = []
            # i is the slice number
            slice_data = rs_nrrd_data[:, i, :]
            # multiple boundaries can be found on one slice
            contours = measure.find_contours(slice_data, 0.99)
            for c in contours:
                # one boundary contains multiple points
                points = []
                for p in c:
                    points.append(
                        [int(round(p[0])), int(round(p[1]))]
                    )

                if len(points) > 0:
                    # append a tuple (i, points)
                    slice_contour_data.append(points)

            contour_coronal.append(slice_contour_data)

        contour_saggital = []
        for i in range(rs_nrrd_data.shape[0]):
            slice_contour_data = []
            # i is the slice number
            slice_data = rs_nrrd_data[i, :, :]
            # multiple boundaries can be found on one slice
            contours = measure.find_contours(slice_data, 0.99)
            for c in contours:
                # one boundary contains multiple points
                points = []
                for p in c:
                    points.append(
                        [int(round(p[0])), int(round(p[1]))]
                    )

                if len(points) > 0:
                    # append a tuple (i, points)
                    slice_contour_data.append(points)

            contour_saggital.append(slice_contour_data)

        return roi_name, contour_coronal, contour_saggital

    def generateCoronalSaggitalContoursForPatientFolder(self, patient_data_folder, force_update=False):
        for root, dirs, filenames in os.walk(patient_data_folder):
            for dir in dirs:
                if RTSTRUCT_FOLDER_PATTERN.match(dir) and NRRD_STUDY_FOLDER_PATTERN.match(root):
                    input_rs_nrrd_folder = os.path.join(root, dir)
                    output_rs_json_file = input_rs_nrrd_folder.replace('nrrd', 'json') + '.json'

                    print("generate contour file: " + output_rs_json_file)

                    if os.path.exists(output_rs_json_file) and not force_update:
                        print("rs json file: " + output_rs_json_file + " exist!")
                        continue;

                    rs_nrrd_files = [f for f in os.listdir(input_rs_nrrd_folder) if
                                     os.path.isfile(os.path.join(input_rs_nrrd_folder, f)) and f.endswith(".nrrd")]

                    ret = {}
                    for rs_nrrd_file in rs_nrrd_files:
                        roi_name, contour_coronal, contour_saggital = self.generateCoronalSaggitalContours(
                            os.path.join(input_rs_nrrd_folder, rs_nrrd_file))
                        contour_dict = {'coronal': contour_coronal, 'saggital': contour_saggital}
                        ret[roi_name] = contour_dict

                    if not os.path.exists(os.path.dirname(output_rs_json_file)):
                        os.makedirs(os.path.dirname(output_rs_json_file))

                    with open(output_rs_json_file, 'w') as out_json:
                        json.dump(ret, out_json)

    def generateCoronalSaggitalContourJson(self, input_rs_nrrd_folder, output_rs_json_file):
        rs_nrrd_files = [f for f in os.listdir(input_rs_nrrd_folder) if
                         os.path.isfile(os.path.join(input_rs_nrrd_folder, f)) and f.endswith(".nrrd")]

        ret = {}
        for rs_nrrd_file in rs_nrrd_files:
            roi_name, contour_coronal, contour_saggital = self.generateCoronalSaggitalContours(
                os.path.join(input_rs_nrrd_folder, rs_nrrd_file))
            contour_dict = {'coronal': contour_coronal, 'saggital': contour_saggital}
            ret[roi_name] = contour_dict

        if not os.path.exists(os.path.dirname(output_rs_json_file)):
            os.makedirs(os.path.dirname(output_rs_json_file))

        with open(output_rs_json_file, 'w') as out_json:
            json.dump(ret, out_json)

    def generateDVHs(self, dicom_dose_file, dicom_rs_file, update=False, output_dvh_json_file=""):
        '''
        :param dicom_dose_file:
        :param dicom_rs_file:
        :param update: Whether force to update the dvh json file. If the output_file is already generated,
                        don't calculate dvh. Default value is False.
        :param output_dvh_json_file:
        :return:
        '''
        dose_dataset = DicomParser(dicom_dose_file)
        rs_dataset = DicomParser(dicom_rs_file)

        if output_dvh_json_file == "":
            dicom_study_folder = os.path.dirname(dicom_dose_file)
            json_folder = dicom_study_folder.replace("dcm", "json")
            t = datetime.now()
            dose_series = dose_dataset.GetSeriesInfo()
            rs_series = rs_dataset.GetSeriesInfo()
            json_file_name = "DVH" + "-" + str(dose_series['id']) + "-" + str(rs_series['id']) + ".json"
            output_dvh_json_file = os.path.join(json_folder, json_file_name)

        if not os.path.exists(os.path.dirname(output_dvh_json_file)):
            os.makedirs(os.path.dirname(output_dvh_json_file))

        if update is False and os.path.exists(output_dvh_json_file):
            print("Json dvh file: " + output_dvh_json_file + " is already generated.")
            return

        dvhs = []
        for roi in rs_dataset.GetStructures().items():
            roi_dvh = {}
            roi_dvh["id"] = roi[1]["id"]
            roi_dvh["name"] = roi[1]["name"]
            roi_dvh["type"] = roi[1]["type"]
            roi_dvh["color"] = roi[1]["color"].tolist()

            dvh = dvhcalc.get_dvh(rs_dataset.ds,
                                  dose_dataset.ds,
                                  roi=roi_dvh["id"])

            print(roi_dvh["name"])
            if dvh.volume > 0:
                roi_dvh["relative_volume.bincenters"] = dvh.relative_volume.bincenters.tolist()
                roi_dvh["relative_volume.counts"] = dvh.relative_volume.counts.tolist()
                roi_dvh["bincenters"] = dvh.bincenters.tolist()
                roi_dvh["counts"] = dvh.counts.tolist()

                roi_dvh["max"] = float(dvh.max)
                roi_dvh["min"] = float(dvh.min)
                roi_dvh["mean"] = float(dvh.mean)
                roi_dvh["volume"] = float(dvh.volume)
            else:
                roi_dvh["relative_volume.bincenters"] = []
                roi_dvh["relative_volume.counts"] = []
                roi_dvh["bincenters"] = []
                roi_dvh["counts"] = []

                roi_dvh["max"] = 0
                roi_dvh["min"] = 0
                roi_dvh["mean"] = 0
                roi_dvh["volume"] = 0

            dvhs.append(roi_dvh)

        with open(output_dvh_json_file, 'w') as out_json:
            json.dump(dvhs, out_json)
        print("generate dvh json file: " + output_dvh_json_file)

    def generateDVHsForPatientFolder(self, patient_data_folder):
        dicom_dose_file_list = []
        dicom_rs_file_list = []

        for root, dirs, filenames in os.walk(patient_data_folder):
            for filename in filenames:
                if RTSTRUCT_DICOM_PATTERN.match(filename):
                    dicom_rs_file_list.append(os.path.join(root, filename))
                    continue
                if RTDOSE_DICOM_PATTERN.match(filename):
                    dicom_dose_file_list.append(os.path.join(root, filename))
                    continue

        for dicom_dose_file in dicom_dose_file_list:
            for dicom_rs_file in dicom_rs_file_list:
                self.generateDVHs(dicom_dose_file=dicom_dose_file,
                                  dicom_rs_file=dicom_rs_file)


def calculateRadiomics(patient_data_folder):
    #CT_nrrd_pattern = re.compile(r'^.*-CT-.*(\/?\\?)(\d+\.)+(\d+)+.nrrd$', re.IGNORECASE)
    #RTSTRUCT_folder_pattern = re.compile(r'^.*-RTSTRUCT-.*(\/?\\?)(\d+\.)+(\d+)+$', re.IGNORECASE)
    #nrrd_folder_pattern = re.compile(r'^(.*)(\\?\/?)nrrd(\/?\\?)(\d+\.)+(\d+)+$', re.IGNORECASE)

    for root, dirs, filenames in os.walk(patient_data_folder):
        if NRRD_STUDY_FOLDER_PATTERN.match(root):
            print(root)
            cts = []
            rois = []
            for dir in dirs:
                if RTSTRUCT_FOLDER_PATTERN.match(dir):
                    rois.append(dir)
                    print(dir)

            for file in filenames:
                if CT_NRRD_PATTERN.match(file):
                    cts.append(file)
                    print(file)

            for ct in cts:
                for roi in rois:
                    result_folder = root.replace('nrrd','result')
                    try:
                        os.makedirs(result_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            raise

                    abp_ct = os.path.join(root, ct)
                    abp_roi = os.path.join(root, roi)

                    ct_name = ct.replace('.nrrd', '')
                    radiomics_result = os.path.join(result_folder, 'radiomics_' + ct_name + '_' + roi + '.txt')
                    if (len(radiomics_result) > 260):
                        radiomics_result = radiomics_result[0:255] + '.txt'

                    if os.path.exists(radiomics_result):
                        print(radiomics_result + ' : exist!')
                        continue

                    print('Calculate radiomics for : ' + abp_ct + ' and ' + abp_roi)
                    thead, tbody = lambda_rad.helloRadiomics.calculateRadiomics(str(abp_ct), str(abp_roi))

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


def readUidAndDescriptionFromDicom(patient_data_folder):
    print('Search folder: ' + patient_data_folder)
    for root, dirs, filenames in os.walk(patient_data_folder):
        matchObj = DICOM_STUDY_FOLDER_PATTERN.match(root)

        if matchObj:
            print('  Study folder: ' + root)
            study_uid = str(matchObj.group(4))

            for dir in dirs:
                print(dir)

                matchSeries = SERIES_PATTERN.match(dir)
                if matchSeries:
                    series_date = str(matchSeries.group(1))
                    series_modality = str(matchSeries.group(2))
                    series_uid = str(matchSeries.group(3))
                    #print(series_date)
                    #print(series_modality)
                    #print(series_uid)
                    print('    ' + dir)

                    study_exist = lambda_rad.models.Study.objects.filter(uid=study_uid).exists()
                    series_exist = lambda_rad.models.Series.objects.filter(uid=series_uid).exists()

                    if not study_exist or \
                            not series_exist:

                        for sub_root, sub_dirs, sub_filenames in os.walk(os.path.join(root, dir)):
                            print(sub_filenames)
                            if len(sub_filenames)>0:
                                sub_file = sub_filenames[0]
                                print('      Sub file:' + sub_file)
                                dp = DicomParser(os.path.join(sub_root, sub_file))
                                study = dp.GetStudyInfo()

                                if study_uid == study['id'] and not study_exist:
                                    print('study id matched!')
                                    print('study id: ' + str(study['id']))
                                    print('study date: ' + str(study['date']))
                                    print('study description: ' + str(study['description']))

                                    st = lambda_rad.models.Study()
                                    st.uid = str(study['id'])
                                    st.date = str(study['date'])
                                    st.description = str(study['description'])
                                    st.save()

                                if not series_exist:
                                    series = dp.GetSeriesInfo()
                                    print('series id: ' + str(series['id']))
                                    print('series date: ' + str(series['date']))
                                    print('series modality: ' + str(series['modality']))
                                    print('series description: ' + str(series['description']))

                                    se = lambda_rad.models.Series()
                                    se.uid = str(series['id'])
                                    se.date = str(series['date'])
                                    se.modality = str(series['modality'])
                                    se.description = str(series['description'])
                                    se.save()

                                break

            for file in filenames:
                print(file)
                matchSeries = SERIES_PATTERN.match(file)
                if matchSeries:
                    series_date = str(matchSeries.group(1))
                    series_modality = str(matchSeries.group(2))
                    series_uid = str(matchSeries.group(3))
                    #print(series_date)
                    #print(series_modality)
                    #print(series_uid)
                    print('    ' + file)

                    study_exist = lambda_rad.models.Study.objects.filter(uid=study_uid).exists()
                    series_exist = lambda_rad.models.Series.objects.filter(uid=series_uid).exists()

                    if not study_exist or \
                            not series_exist:
                        dp = DicomParser(os.path.join(root, file))
                        study = dp.GetStudyInfo()

                        if study_uid == study['id'] and not study_exist:
                            print('study id matched!')
                            print('study id: ' + str(study['id']))
                            print('study date: ' + str(study['date']))
                            print('study description: ' + str(study['description']))

                            st = lambda_rad.models.Study()
                            st.uid = str(study['id'])
                            st.date = str(study['date'])
                            st.description = str(study['description'])
                            st.save()

                        if not series_exist:
                            series = dp.GetSeriesInfo()
                            print('series id: ' + str(series['id']))
                            print('series date: ' + str(series['date']))
                            print('series modality: ' + str(series['modality']))
                            print('series description: ' + str(series['description']))

                            se = lambda_rad.models.Series()
                            se.uid = str(series['id'])
                            se.date = str(series['date'])
                            se.modality = str(series['modality'])
                            se.description = str(series['description'])
                            se.save()


def updateDicomUidAndDescription(dicom_file):
    dp = DicomParser(dicom_file)
    series = dp.GetSeriesInfo()
    print('series id: ' + str(series['id']))
    print('series date: ' + str(series['date']))
    print('series modality: ' + str(series['modality']))
    print('series description: ' + str(series['description']))

    se = lambda_rad.models.Series()
    se.uid = str(series['id'])
    se.date = str(series['date'])
    se.modality = str(series['modality'])
    se.description = str(series['description'])
    se.save()


def findLargeRoiNrrd(root_folder, large_nnrd_names):
    for root, dirs, filenames in os.walk(root_folder):
        if NRRD_STUDY_FOLDER_PATTERN.match(root):
            for dir in dirs:
                if RTSTRUCT_FOLDER_PATTERN.match(dir):
                    nrrd_folder = os.path.join(root, dir)
                    for rs in os.listdir(nrrd_folder):
                        if NRRD_FILE_PATTERN.match(rs):
                            rsName = str(rs).replace('.nrrd', '')
                            checkLargeRoiNrrd(os.path.join(nrrd_folder, rs))
                            checkRoiNameIsOrgans(rsName)
                            checkRoiNameIsTarget(rsName)


def checkLargeRoiNrrd(file_path):
    stateinfo_roi = os.stat(file_path)
    size_roi = int(stateinfo_roi.st_size)

    maximum = 60 * 1024
    if size_roi > maximum:
        print('The size of roi: ' + file_path + ' is ' + str(size_roi) + ' larger than ' + str(maximum))
        return True
    else:
        print('The size of roi: ' + file_path + ' is ' + str(size_roi))
        return False


def checkRoiNameIsOrgans(fileName):
    for key, value in ROI_PATTERNS.items():
        if value.match(fileName):
            print(fileName + ' is a organ: ' + key)
            return True
    return False


def checkRoiNameIsTarget(fileName):
    if TARGET_RELATED_PATTERN.match(fileName):
        print(fileName + ' is a target')
        return True
    return False

def main():
    dicom_folder = r"/data/LAMBDA/inst-5\000082\dcm\1.2.840.113704.1.111.4816.1473866757.1"
    dicom_dose_file = r"20160914-RTDOSE-2.16.840.1.113669.2.931128.912615563.20161116111128.772524.dcm"
    dicom_rs_file = r"20160914-RTSTRUCT-2.16.840.1.113669.2.931128.912615563.20161116111128.772514.dcm"

    json_folder = dicom_folder.replace("dcm", "json")
    json_file = dicom_dose_file.replace("RTDOSE", "DVH").replace("dcm", "json")
    print("From " + dicom_dose_file + " and " + dicom_rs_file)
    print("generate dvh json file: " + os.path.join(json_folder, json_file))

    # dc = DataConverter()
    #
    # dc.generateDVHs(os.path.join(dicom_folder, dicom_dose_file),
    #                   os.path.join(dicom_folder, dicom_rs_file),
    #                   os.path.join(json_folder, json_file))

    dose_dataset = DicomParser(os.path.join(dicom_folder, dicom_dose_file))
    rs_dataset = DicomParser(os.path.join(dicom_folder, dicom_rs_file))

    dvhs = []
    for roi in rs_dataset.GetStructures().items():
        roi_dvh = {}
        roi_dvh["id"] = roi[1]["id"]
        roi_dvh["name"] = roi[1]["name"]
        roi_dvh["type"] = roi[1]["type"]
        roi_dvh["color"] = roi[1]["color"].tolist()

        dvh = dvhcalc.get_dvh(rs_dataset.ds,
                              dose_dataset.ds,
                              roi=roi_dvh["id"])


        if dvh.volume > 0:
            plt.plot(dvh.relative_volume.bincenters, dvh.relative_volume.counts, label=dvh.name,
                     color=None if not isinstance(dvh.color, np.ndarray) else
                     (dvh.color / 255))
            # plt.axis([0, self.bins[-1], 0, self.counts[0]])
            plt.xlabel('Dose [%s]' % dvh.dose_units)
            plt.ylabel('Volume [%s]' % dvh.volume_units)
            if dvh.name:
                plt.legend(loc='best')
        else:
            plt.plot([], [], label=dvh.name,
                     color=None if not isinstance(dvh.color, np.ndarray) else
                     (dvh.color / 255))
            # plt.axis([0, self.bins[-1], 0, self.counts[0]])
            plt.xlabel('Dose [%s]' % dvh.dose_units)
            plt.ylabel('Volume [%s]' % dvh.volume_units)
            if dvh.name:
                plt.legend(loc='best')



        # roi_dvh["relative_volume.bincenters"] = dvh.relative_volume.bincenters.tolist()

        # roi_dvh["relative_volume.counts"] = dvh.relative_volume.counts.tolist()
        # roi_dvh["bincenters"] = dvh.bincenters.tolist()
        # roi_dvh["counts"] = dvh.counts.tolist()
        #
        # roi_dvh["max"] = float(dvh.max)
        # roi_dvh["min"] = float(dvh.min)
        # roi_dvh["mean"] = float(dvh.mean)
        # roi_dvh["volume"] = float(dvh.volume)
        #
        # dvhs.append(roi_dvh)
    plt.show()


    # input_rs_nrrd_folder = r"/data/LAMBDA/inst-1\LCTSC-Train-S1-001\nrrd\1.3.6.1.4.1.14519.5.2.1.7014.4598.117430069853376188015337939664\20050825-RTSTRUCT-1.3.6.1.4.1.14519.5.2.1.7014.4598.267594131248797648024467762948"
    # output_rs_json_file = input_rs_nrrd_folder.replace('nrrd', 'json') + '.json'
    #
    # rs_nrrd_files = [f for f in os.listdir(input_rs_nrrd_folder) if
    #                  os.path.isfile(os.path.join(input_rs_nrrd_folder, f)) and f.endswith(".nrrd")]
    #
    # ret = {}
    # for rs_nrrd_file in rs_nrrd_files:
    #     roi_name, contour_coronal, contour_saggital = dtn.generateCoronalSaggitalContours(os.path.join(input_rs_nrrd_folder, rs_nrrd_file))
    #     contour_dict = {'coronal': contour_coronal, 'saggital': contour_saggital}
    #     ret[roi_name] = contour_dict
    #
    # if not os.path.exists(os.path.dirname(output_rs_json_file)):
    #     os.makedirs(os.path.dirname(output_rs_json_file))
    #
    # with open(output_rs_json_file, 'w') as out_json:
    #     json.dump(ret, out_json)


if __name__=="__main__":
    main()