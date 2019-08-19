import numpy as np
import os
import nrrd
import pydicom.uid
from pydicom.dataset import Dataset, FileDataset
from pydicom.sequence import Sequence
from skimage import measure
from lambda_rad import dicomparser

from datetime import datetime
import webcolors
from lambda_rad import utils


# Some sample numpy data
#data = np.zeros((5,4,3,2))
#filename = 'testdata.nrrd'

# Write to a NRRD file
#nrrd.write(filename, data)
np.set_printoptions(threshold=np.nan)

# Read the data back from file
# filename = r"/data/LAMBDA/institution-1\033\nrrd\GTV-N1.nrrd"
# readdata, header = nrrd.read(filename)
# print(readdata.shape)
# print(header)
#print(readdata)

# with file('roi.txt', 'w') as outfile:
#     outfile.write('# Array shape: {0}\n'.format(readdata.shape))
#     for i in range(0, readdata.shape[2],2):
#         data = readdata[:,:,i]
#         np.savetxt(outfile, data, fmt='%i', delimiter=",")
#
#         # Writing out a break to indicate different slices...
#         outfile.write('# New slice\n')

#np.savetxt("roi.txt", readdata)
#f= open("roi.txt","w")
#f.write(readdata)
#f.close()

# ct nrrd
#filename = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\ct.nrrd"
#readdata, ct_header = nrrd.read(filename)
#print(readdata.shape)
#print(ct_header)
#print("CT type: " + str(ct_header['type']))

#ct_header['type'] = 'uint8'
#del ct_header['endian']
#print(ct_header)


# roi nrrd
#filename = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\40-.nrrd"
#readdata, header = nrrd.read(filename)
#print(readdata.shape)
#print(readdata.shape)


#nrrd.write(r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\output.nrrd", readdata, ct_header)
#filename = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\output.nrrd"
#o_readdata, o_header = nrrd.read(filename)
#print(o_readdata.shape)
#print(o_header)

#
# #print(readdata[0][0][0].astype(np.int16))
#
# with file(r"/data/LAMBDA/institution-1\033\nrrd\ct_yky.txt", 'w') as outfile:
#     outfile.write('# Array shape: {0}\n'.format(readdata.shape))
#     for i in range(0, readdata.shape[2],3):
#         data = readdata[:,:,i]
#         np.savetxt(outfile, data, fmt='%i', delimiter=",")
#
#         # Writing out a break to indicate different slices...
#         outfile.write('# New slice\n')

# filename = r"/data/LAMBDA/institution-1\033\dicom\1.2.840.113619.2.55.1.1762894947.2048.1178714531.347\061-CT-1.2.840.113619.2.55.1.1762894947.2048.1178714531.352\CT1.2.840.113619.2.55.1.1762894947.2048.1178714531.353.1.dcm"
# #filename_yky = r"/data/LAMBDA/institution-6\1301014\dicom\1.2.840.113704.1.111.3264.1456970470.14\20160303-CT-1.2.840.113704.1.111.5448.1456970939.6\CT.1.2.840.113704.1.111.2500.1456971135.727.dcm"
# dataset = pydicom.dcmread(filename)
#
# if 'PixelData' in dataset:D:\Udemy\AAPM_Thoracic_Challenge\output2\only_with_roi\Lung_R\masks
#     rows = int(dataset.Rows)
#     cols = int(dataset.Columns)
#     print("Image size.......: {rows:d} x {cols:d}, {size:d} bytes".format(
#         rows=rows, cols=cols, size=len(dataset.PixelData)))
#     if 'PixelSpacing' in dataset:
#         print("Pixel spacing....:", dataset.PixelSpacing)
#
# print(dataset.pixel_array.min())
# print(dataset.pixel_array[0])


#image = imread(r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903\AP_PTVall2cmring\57.png",flatten=True)
#print(image.shape)

filename = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903\AP_PTVall2cmring.nrrd"
output_contour_file = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903\AP_PTVall2cmring_contour.txt"
output_contour_json = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903\AP_PTVall2cmring_contour.json"

output_rs_dicom = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903_output.dcm"
input_ct_dicom_folder = r"/data/LAMBDA/institution-6\1301014\dicom\1.2.840.113704.1.111.3264.1456970470.14\20160303-CT-1.2.840.113704.1.111.5448.1456970939.6"
input_rs_nrrd_folder = r"/data/LAMBDA/institution-6\1301014\nrrd\1.2.840.113704.1.111.3264.1456970470.14\20160303-RTSTRUCT-2.16.840.1.113669.2.931128.192763.20180327115746.492903"

nc = utils.DataConverter()
nc.generateContourDicom(input_ct_dicom_folder,input_ct_dicom_folder,output_rs_dicom)

#
# ct_dicom_files = [f for f in os.listdir(input_ct_dicom_folder) if os.path.isfile(os.path.join(input_ct_dicom_folder, f)) and f.endswith(".dcm")]
# rs_nrrd_files = [f for f in os.listdir(input_rs_nrrd_folder) if os.path.isfile(os.path.join(input_rs_nrrd_folder, f)) and f.endswith(".nrrd")]
#
#
#
# readdata, header = nrrd.read(filename)
#
# #sort image order
# ct_dicom_parsers = []
# for ct_dicom in ct_dicom_files:
#     dp = dicomparser.DicomParser(os.path.join(input_ct_dicom_folder, ct_dicom))
#     ct_dicom_parsers.append(dp)
#
# n = len(ct_dicom_parsers)
# for i in range(n-1):
#     iMin = i
#     for j in range(i+1, n):
#         #dp_iMin = dicomparser.DicomParser(os.path.join(input_ct_dicom_folder, ct_dicom_files[iMin]))
#         #dp_j = dicomparser.DicomParser(os.path.join(input_ct_dicom_folder, ct_dicom_files[j]))
#         if ct_dicom_parsers[j].GetImageLocation() < ct_dicom_parsers[iMin].GetImageLocation():
#             iMin = j
#
#     temp = ct_dicom_parsers[iMin]
#     ct_dicom_parsers[iMin] = ct_dicom_parsers[i]
#     ct_dicom_parsers[i] = ct_dicom_parsers[iMin]
#
#     #print(z_iMin)
#
# # try:
# #     instanceCreationDateTime = datetime.strptime(rois_dict_list['file_stamp']['write_date'], '%a %b %d %H:%M:%S %Y')
# # except ValueError:
# #     instanceCreationDateTime = dateutil.parser.parse(rois_dict_list['file_stamp']['write_date'])
# #
# # try:
# #     scanTimeFromScanner = datetime.strptime(image_set_dict_list['ScanTimeFromScanner'], '%Y-%m-%d %H:%M:%S')
# # except ValueError:
# #     scanTimeFromScanner = dateutil.parser.parse(image_set_dict_list['ScanTimeFromScanner'])
#
# file_meta = Dataset()
# file_meta.FileMetaInformationGroupLength = 0
# file_meta.FileMetaInformationVersion = '1'
# file_meta.MediaStorageSOPClassUID = '1.2.840.10008.5.1.4.1.1.481.3'
# file_meta.MediaStorageSOPInstanceUID = pydicom.uid.generate_uid()
# file_meta.TransferSyntaxUID = '1.2.840.10008.1.2'
# file_meta.ImplementationClassUID = '1.2.246.352.70.2.1.7'
#
# #study_folder = os.path.join(output_folder, ct_StudyInstanceUID)
# #output_file = os.path.join(study_folder, str(instanceCreationDateTime.date()).replace('-',
# #                                                                                      '') + '-RS-' + file_meta.MediaStorageSOPInstanceUID + '.dcm')
# ds = FileDataset(output_rs_dicom, {}, file_meta=file_meta, preamble="\0" * 128)
# ds.SpecificCharacterSet = 'ISO_IR 100'
# ds.InstanceCreationDate = datetime.now().date()
# ds.InstanceCreationTime = datetime.now().time()
# ds.SOPClassUID = '1.2.840.10008.5.1.4.1.1.481.3'
# ds.SOPInstanceUID = file_meta.MediaStorageSOPInstanceUID
# ds.StudyDate = ct_dicom_parsers[0].GetStudyInfo()["date"]
# #ds.StudyTime = scanTimeFromScanner.time()
# ds.AccessionNumber = ''
# ds.Modality = 'RTSTRUCT'
# ds.Manufacturer = 'ADAC'
# #ds.ReferringPhysicianName = referringPhysician
# ds.StationName = 'Go One'
# ds.StudyDescription = ct_dicom_parsers[0].GetStudyInfo()["description"]
# #ds.PhysiciansOfRecord = radiationOncologist
# #ds.ManufacturerModelName = tool_type
#
# # --- Referenced Study Sequence ---#
# study = Dataset()
# study_sequence = Sequence([study])
# study_sequence[0].ReferencedSOPClassUID = '1.2.840.10008.3.1.2.3.2'
# study_sequence[0].ReferencedSOPInstanceUID = ct_dicom_parsers[0].GetStudyInfo()["id"]
# ds.ReferencedStudySequence = study_sequence
#
# # --- Referenced Study Sequence ---#
#
# ds.PatientName = ct_dicom_parsers[0].ds.PatientName
# ds.PatientID = ct_dicom_parsers[0].ds.PatientID
# ds.PatientBirthDate = ct_dicom_parsers[0].ds.PatientBirthDate
# ds.PatientSex = ct_dicom_parsers[0].ds.PatientSex
# ds.SoftwareVersions = "GoOne Dicom Converter"
#
# ds.StudyInstanceUID = ct_dicom_parsers[0].ds.StudyInstanceUID
# ds.SeriesInstanceUID = pydicom.uid.generate_uid()
#
# ds.StudyID = ct_dicom_parsers[0].ds.StudyID
# ds.SeriesNumber = ct_dicom_parsers[0].ds.SeriesNumber
# #ds.StructureSetLabel = plan_name
# ds.StructureSetName = 'POIandROIandBOLUS'
# #ds.StructureSetDate = instanceCreationDateTime.date()
# #ds.StructureSetTime = instanceCreationDateTime.time()
#
#
# # --- Referenced Frame of ReferenceSequence ---#
# ds.ReferencedFrameOfReferenceSequence = Sequence([Dataset()])
# ds.ReferencedFrameOfReferenceSequence[0].FrameOfReferenceUID = ct_dicom_parsers[0].GetFrameOfReferenceUID()
#
# contourImageSequence = Sequence([Dataset() for i in range(len(ct_dicom_parsers))])
# for i in range(len(ct_dicom_parsers)):
#     contourImageSequence[i].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
#     contourImageSequence[i].ReferencedSOPInstanceUID = ct_dicom_parsers[i].GetSOPInstanceUID()
#
# rtReferencedSeriesSequence = Sequence([Dataset()])
# rtReferencedSeriesSequence[0].SeriesInstanceUID = ct_dicom_parsers[0].GetSeriesInfo()["id"]
# rtReferencedSeriesSequence[0].ContourImageSequence = contourImageSequence
#
# study_sequence_2 = Sequence([Dataset()])
# study_sequence_2[0].ReferencedSOPClassUID = '1.2.840.10008.3.1.2.3.2'
# study_sequence_2[0].ReferencedSOPInstanceUID = ct_dicom_parsers[0].GetStudyInfo()["id"]
# study_sequence_2[0].RTReferencedSeriesSequence = rtReferencedSeriesSequence
#
# ds.ReferencedFrameOfReferenceSequence[0].RTReferencedStudySequence = study_sequence_2
#
# # --- Structure Set ROI Sequence ---#
# #structure_number = len(points_list) + len(rs_nrrd_files)
# structure_number = len(rs_nrrd_files)
# ROINumber = 1;
# structureSetROISequence = Sequence([Dataset() for _ in range(structure_number)])
# # for i in range(len(points_list)):
# #     structureSetROISequence[ROINumber - 1].ROINumber = ROINumber
# #     structureSetROISequence[ROINumber - 1].ReferencedFrameOfReferenceUID = ct_FrameUID
# #     structureSetROISequence[ROINumber - 1].ROIName = str(points_list[i]['Name'])
# #     structureSetROISequence[ROINumber - 1].ROIGenerationAlgorithm = 'SEMIAUTOMATIC'
# #     ROINumber += 1
#
# for i in range(len(rs_nrrd_files)):
#     structureSetROISequence[ROINumber - 1].ROINumber = ROINumber
#     structureSetROISequence[ROINumber - 1].ReferencedFrameOfReferenceUID = ct_dicom_parsers[0].GetFrameOfReferenceUID()
#     structureSetROISequence[ROINumber - 1].ROIName = str(rs_nrrd_files[i].replace(".nrrd", ""))
#     structureSetROISequence[ROINumber - 1].ROIVolume = 0
#     structureSetROISequence[ROINumber - 1].ROIGenerationAlgorithm = 'SEMIAUTOMATIC'
#     ROINumber += 1
#
# ds.StructureSetROISequence = structureSetROISequence
#
# # --- ROI Contour Sequence ---#
# ROINumber = 1;
#
# ROIContourSequence = Sequence([Dataset() for _ in range(len(rs_nrrd_files))])
# # for i in range(len(points_list)):
# #     color = points_list[i]['Color']
# #     xcoord_pinn = points_list[i]['XCoord']
# #     ycoord_pinn = points_list[i]['YCoord']
# #     zcoord_pinn = points_list[i]['ZCoord']
# #
# #     xcoord_dicom = xcoord_pinn * 10
# #     ycoord_dicom = ycoord_pinn * -10
# #     zcoord_dicom = zcoord_pinn * -10
# #
# #     color = str(color).lower()
# #     rgb = webcolors.IntegerRGB
# #     if color in pinn_color_dict:
# #         rgb.red = pinn_color_dict[color][0]
# #         rgb.green = pinn_color_dict[color][1]
# #         rgb.blue = pinn_color_dict[color][2]
# #     else:
# #         try:
# #             rgb = webcolors.name_to_rgb(color)
# #         except:
# #             print('Cannot find the color "' + color + '" in web color, changed it to blue!')
# #             rgb = webcolors.name_to_rgb('blue')
# #
# #     color_str = str(rgb.red) + '\\' + str(rgb.green) + '\\' + str(rgb.blue)
# #     ROIContourSequence[ROINumber - 1].ROIDisplayColor = color_str
# #
# #     sub_contourImageSequence = Sequence([Dataset()])
# #     sub_contourImageSequence[0].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
# #     sub_contourImageSequence[0].ReferencedSOPInstanceUID = get_reference_image_UID(image_info_list, zcoord_pinn)
# #
# #     contourSequence = Sequence([Dataset()])
# #     contourSequence[0].ContourImageSequence = sub_contourImageSequence
# #     contourSequence[0].ContourGeometricType = 'POINT'
# #     contourSequence[0].NumberOfContourPoints = 1
# #     point_str = str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)
# #     contourSequence[0].ContourData = point_str
# #
# #     ROIContourSequence[ROINumber - 1].ContourSequence = contourSequence
# #     ROIContourSequence[ROINumber - 1].ReferencedROINumber = ROINumber
# #
# #     ROINumber += 1
#
# # roi sequence
# for rs_nrrd_f in rs_nrrd_files:
#
#     rgb = webcolors.name_to_rgb('blue')
#
#     color_str = str(rgb.red) + '\\' + str(rgb.green) + '\\' + str(rgb.blue)
#     ROIContourSequence[ROINumber - 1].ROIDisplayColor = color_str
#
#     rs_nrrd_data, rs_nrrd_header = nrrd.read(os.path.join(input_rs_nrrd_folder, rs_nrrd_f))
#     contour_header = rs_nrrd_header
#     contour_header['sizes'] = contour_header['sizes'].tolist()
#     contour_header['space directions'] = contour_header['space directions'].tolist()
#     contour_header['space origin'] = contour_header['space origin'].tolist()
#
#     contour_data = []
#
#     for i in range(rs_nrrd_data.shape[2]):
#
#         data = rs_nrrd_data[:, :, i]
#
#         boundaries = measure.find_contours(data, 0.99)
#         contours = []
#         for b in boundaries:
#             points = []
#             for p in b:
#                 points.append(
#                     [contour_header['space origin'][0] + contour_header['space directions'][0][0] * round(p[0]),
#                      contour_header['space origin'][1] + contour_header['space directions'][1][1] * round(p[1]),
#                      contour_header['space origin'][2] + contour_header['space directions'][2][2] * i])
#
#             if len(points) > 0:
#                 contour_data.append((i, points))
#
#     # print(rs_nrrd_f)
#     # for cd in contour_data:
#     #     print(cd[0])
#     #     print(ct_dicom_parsers[cd[0]].GetSOPInstanceUID())
#     #     print(cd[1])
#
#     coutour_number = len(contour_data)
#     #print(rs_nrrd_f + ": " + str(coutour_number) + ": " + str(t))
#
#     if coutour_number > 0:
#         contourSequence = Sequence([Dataset() for _ in range(coutour_number)])
#         for i in range(coutour_number):
#
#             points = contour_data[i][1]
#
#             #if len(point_list) > 0:
#             #    zcoord_pinn = point_list[0][2]
#
#             sub_contourImageSequence = Sequence([Dataset()])
#             sub_contourImageSequence[0].ReferencedSOPClassUID = '1.2.840.10008.5.1.4.1.1.2'
#             sub_contourImageSequence[0].ReferencedSOPInstanceUID = ct_dicom_parsers[contour_data[i][0]].GetSOPInstanceUID()
#             contourSequence[i].ContourImageSequence = sub_contourImageSequence
#             contourSequence[i].ContourGeometricType = 'CLOSED_PLANAR'
#
#             contourSequence[i].NumberOfContourPoints = len(points) - 1
#
#             points_str = ''
#             for p in range(len(points)-1):
#                 xcoord_dicom = points[p][0]
#                 ycoord_dicom = points[p][1]
#                 zcoord_dicom = points[p][2]
#
#                 if p == 0:
#                     points_str += str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)
#                 else:
#                     points_str += '\\' + str(xcoord_dicom) + '\\' + str(ycoord_dicom) + '\\' + str(zcoord_dicom)
#
#             contourSequence[i].ContourData = points_str
#
#         ROIContourSequence[ROINumber - 1].ContourSequence = contourSequence
#
#     ROIContourSequence[ROINumber - 1].ReferencedROINumber = ROINumber
#
#     ROINumber += 1
#
# ds.ROIContourSequence = ROIContourSequence
# # # --- ROI Contour Sequence ---#
# #
# ds.RTROIObservationsSequence = ''
# ROINumber = 1;
# RTROIObservationsSequence = Sequence([Dataset() for _ in range(structure_number)])
# # for i in range(len(points_list)):
# #     RTROIObservationsSequence[ROINumber - 1].ObservationNumber = ROINumber
# #     RTROIObservationsSequence[ROINumber - 1].ReferencedROINumber = ROINumber
# #     RTROIObservationsSequence[ROINumber - 1].RTROIInterpretedType = 'MARKER'
# #     RTROIObservationsSequence[ROINumber - 1].ROIInterpreter = ''
# #     ROINumber += 1
#
# for i in range(len(rs_nrrd_files)):
#     RTROIObservationsSequence[ROINumber - 1].ObservationNumber = ROINumber
#     RTROIObservationsSequence[ROINumber - 1].ReferencedROINumber = ROINumber
#     RTROIObservationsSequence[ROINumber - 1].RTROIInterpretedType = 'ORGAN'
#     RTROIObservationsSequence[ROINumber - 1].ROIInterpreter = ''
#     ROINumber += 1
# ds.RTROIObservationsSequence = RTROIObservationsSequence
#
# ds.ApprovalStatus = 'UNAPPROVED'
#
# ds.save_as(output_rs_dicom)






# for(let j = 0; j < n - 1; j++){
#     let iMin = j;
#     for(let i = j+1; i < n; i++){
#
#         if(parseFloat(self.ctDicoms[i].getRawDicomElements().x00200032.value[2]) > parseFloat(self.ctDicoms[iMin].getRawDicomElements().x00200032.value[2])){
#             iMin = i;
#         }
#     }
#
#     let temp = self.ctDicoms[iMin];
#     self.ctDicoms[iMin] = self.ctDicoms[j];
#     self.ctDicoms[j] = temp;
# }



#nc = utils.NRRDConverter()
#nc.generateContourJson(filename, output_contour_json)




# readdata, header = nrrd.read(filename)
# print(header['sizes'])
# print(header['space directions'])
# print(header['space origin'])
#
# contour_header = header
# contour_header['sizes'] = contour_header['sizes'].tolist()
# contour_header['space directions'] = contour_header['space directions'].tolist()
# contour_header['space origin'] = contour_header['space origin'].tolist()
#
# contour_data = []
# #del(contour_header['sizes'])
# #del(contour_header['type'])
# #del(contour_header['dimension'])
# #del(contour_header['space'])
# #del(contour_header['kinds'])
#
#
# print(contour_header)
#
#
# #with file(output_contour_file, 'w') as outfile:
# #     outfile.write('# Array shape: {0}\n'.format(readdata.shape))
# #for i in range(0, readdata.shape[2],2):
# for i in range(readdata.shape[2]):
#     #if i == 112:
#     #outfile.write("z: " + str(i) + "\n")
#     #print("z: " + str(i))
#     data = readdata[:,:,i]
#
#     boundaries =measure.find_contours(data, 0.99)
#     #print(type(boundaries))
#     contours = []
#     for b in boundaries:
#         points = []
#         for p in b:
#             points.append([header['space origin'][0] + header['space directions'][0][0] * round(p[0]),
#                            header['space origin'][1] + header['space directions'][1][1] * round(p[1])])
#
#         contours.append(points)
#
#     contour_data.append(contours)
#
# #nrrd.write(output_contour_json, contour_data, contour_header)
# with open(output_contour_json, 'wb') as out_json:
#     json.dump({'header': contour_header, 'data': contour_data}, out_json)

#with gzip.GzipFile(output_contour_json, 'w') as fout:   # 4. gzip
#    fout.write(json_bytes)

#contour_data, contour_header = nrrd.read(output_contour_nrrd)
#print(contour_header)
#print(contour_data)



            #print(len(b))

        #boundaries = np.array(boundaries)
        #print(type(boundaries))
        #print(boundaries.shape)
        #print(boundaries)
        #boundaries = boundaries.astype(np.int)
        #print(boundaries)
#boundary = boundaries[0]
#print(boundary)

#boundary = np.asarray(boundary).astype(np.int)
#boundaries = np.asarray(boundaries)
#boundaries = boundaries.astype(np.int)


#print(len(boundaries))
#print(boundary)

#fig, ax = plt.subplots()
#ax.imshow(data, interpolation='nearest', cmap=plt.cm.gray)

#for n, contour in enumerate(boundaries):
#    ax.plot(contour[:, 1], contour[:, 0], linewidth=2)

#ax.axis('image')
#ax.set_xticks([])
#ax.set_yticks([])

#plt.show()


#fig, ax = plt.subplots()
#img = np.zeros((512, 512), 'uint8')
#for n, contour in enumerate(boundaries):
#    ax.plot(contour[:, 1], contour[:, 0], linewidth=2)
#    rr, cc = polygon(contour[:, 0], contour[:, 1], img.shape)
#    img[rr, cc] = 1

#ax.imshow(img, interpolation='nearest', cmap=plt.cm.gray)

#ax.axis('image')
#ax.set_xticks([])
#ax.set_yticks([])
#plt.show()


# img = np.zeros((512, 512), 'uint8')
# rr, cc = polygon(boundary[:,0], boundary[:,1], img.shape)
# img[rr,cc] = 1
#
# print(img)


# p.savetxt(outfile, data, fmt='%i', delimiter=",")

# Writing out a break to indicate different slices...
# outfile.write('# New slice\n')