import os, sys, re
import shutil
from scripts import data_insert

from lambda_rad import models as lambda_model
import numpy as np
import django
from django.conf import settings
from scripts import unet
from lambda_rad import utils
import nrrd
import pydicom
from datetime import datetime
from skimage.io import imsave, imread
import random
import json

sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'webplatform.settings'
django.setup()

def train_brain():
    total_image_lable_list = []

    image_label_list_json = r'/data/LAMBDA/Brain.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Brain", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Brain", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Brain", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Brain", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Brain", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Brain.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)


    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=20,
                          steps_per_epoch=4000,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path="D:/LAMBDA/unet_Brain_weight_w256_h256_tvr0.8_12_4000_100_100.hdf5",
                          output_model_path="D:/LAMBDA/unet_Brain_model_w256_h256_tvr0.8_12_4000_100_100.h5")


def train_brainstem():
    total_image_lable_list = []
    # image_label_list_json = r'/data/LAMBDA/unet_hn_models/BrainStem.json'
    # if os.path.exists(image_label_list_json):
    #     with open(image_label_list_json) as f:
    #         total_image_lable_list = json.load(f)
    # else:
    #
    #     image_label_list = get_training_data_from_institute("HN", "BrainStem", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = get_training_data_from_institute("HNSC-TCGA", "BrainStem", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = get_training_data_from_institute("HNSCC", "BrainStem", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = get_training_data_from_institute("HNSCC3DCT", "BrainStem", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "BrainStem", label_exists=False)
    #     # total_image_lable_list.extend(image_label_list)
    #     # print(len(total_image_lable_list))
    #     image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "BrainStem", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #
    #     with open('/data/LAMBDA/unet_hn_models/BrainStem.json', 'w') as outfile:
    #         json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/unet_hn_models/BrainStem+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "BrainStem", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "BrainStem", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "BrainStem", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "BrainStem", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "BrainStem", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/unet_hn_models/BrainStem+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=2500,
                          nb_epoch=3,
                          validation_steps=100,
                          output_weight_path="/data/LAMBDA/unet_hn_models/unet_BrainStem_weight_w256_h256_tvr0.8_20_350_300_100.hdf5",
                          output_model_path="/data/LAMBDA/unet_hn_models/unet_BrainStem_model_w256_h256_tvr0.8_20_350_300_100.h5",
                          load_weight_path="/data/LAMBDA/unet_hn_models/unet_BrainStem_weight_w256_h256_tvr0.8_20_350_300_100.hdf5",
                          load_model_path="")



def train_cord():
    total_image_lable_list = []

    patients = lambda_model.Patient.objects. \
        filter(institution=lambda_model.Institution.objects.get(name="HN"))

    for patient in patients:
        patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder

        cord_image_label_list = data_insert.get_training_image_label_list_from_patient_folder(patient_data_folder, "SpinalCord", label_exists=True)

        if len(cord_image_label_list) > 0:
            roi_2 = os.path.basename(os.path.dirname(cord_image_label_list[0][1]))
            ct_dir = os.path.dirname(cord_image_label_list[-1][0])
            label_dir = os.path.dirname(cord_image_label_list[-1][1])

            start = int(os.path.basename(cord_image_label_list[-1][1]).replace(".png", ""))
            for i in range(start+1, 250):
                ct = os.path.join(ct_dir, str(i)+".png")
                label = os.path.join(label_dir, str(i)+".png")
                if os.path.exists(ct_dir) and os.path.exists(label_dir):
                    cord_image_label_list.append([ct, label])

    cord_image_label_list_2 = data_insert.get_training_image_label_list("Training","SpinalCord", label_exists=True)
    total_image_lable_list.extend(cord_image_label_list_2)

    cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "SpinalCord", label_exists=True)
    total_image_lable_list.extend(cord_image_label_list_3)

    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[128, 128],
                          batch_size=48,
                          steps_per_epoch=300,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path="D:/LAMBDA/unet_SpinalCord_weight_w128_h128_tvr0.8_48_300_100_100.hdf5",
                          output_model_path="D:/LAMBDA/unet_SpinalCord_model_w128_h128_tvr0.8_48_300_100_100.h5")


def train_lung_l():
    total_image_lable_list = []

    cord_image_label_list_2 = data_insert.get_training_image_label_list("Training", "Lung_L", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_2)

    cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "Lung_L", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_3)


    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[128, 128],
                          batch_size=48,
                          steps_per_epoch=300,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path="D:/LAMBDA/unet_Lung_L_weight_w128_h128_tvr0.8_48_300_100_100.hdf5",
                          output_model_path="D:/LAMBDA/unet_Lung_L_model_w128_h128_tvr0.8_48_300_100_100.h5")


def train_lung_r():
    total_image_lable_list = []

    cord_image_label_list_2 = data_insert.get_training_image_label_list("Training", "Lung_R", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_2)

    cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "Lung_R", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_3)


    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[128, 128],
                          batch_size=48,
                          steps_per_epoch=300,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path="D:/LAMBDA/unet_Lung_R_weight_w128_h128_tvr0.8_48_300_100_100.hdf5",
                          output_model_path="D:/LAMBDA/unet_Lung_R_model_w128_h128_tvr0.8_48_300_100_100.h5")


def train_heart():
    total_image_lable_list = []

    cord_image_label_list_2 = data_insert.get_training_image_label_list("Training", "Heart", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_2)
    print(len(total_image_lable_list))

    cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "Heart", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_3)


    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[128, 128],
                          batch_size=48,
                          steps_per_epoch=300,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path="D:/LAMBDA/unet_Heart_weight_w128_h128_tvr0.8_48_300_100_100.hdf5",
                          output_model_path="D:/LAMBDA/unet_Heart_model_w128_h128_tvr0.8_48_300_100_100.h5")


def train_esophagus():
    total_image_lable_list = []
    image_label_list_json = r'/data/LAMBDA/unet_hn_models/Esophagus_all.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
            print(len(total_image_lable_list))

    else:

        image_label_list = get_training_data_from_institute("HN", "Esophagus", labeled_start_offset=0,
                                                            labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Esophagus", labeled_start_offset=0,
                                                            labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Esophagus", labeled_start_offset=0,
                                                            labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Esophagus", labeled_start_offset=0,
                                                            labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Esophagus", labeled_start_offset=0,
                                                            labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        image_label_list = data_insert.get_training_image_label_list("Training", "Esophagus", label_exists=False)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        image_label_list = data_insert.get_training_image_label_list("Abdominal", "Esophagus", label_exists=False)
        total_image_lable_list.extend(image_label_list)


        with open('/data/LAMBDA/unet_hn_models/Esophagus_all.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    # cord_image_label_list_2 = data_insert.get_training_image_label_list("Training", "Esophagus", label_exists=False)
    # total_image_lable_list.extend(cord_image_label_list_2)
    # print(len(total_image_lable_list))
    #
    # cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "Esophagus", label_exists=False)
    # total_image_lable_list.extend(cord_image_label_list_3)
    #
    #

    # print(len(total_image_lable_list))
    #
    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=1500,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path="/data/LAMBDA/unet_hn_models/unet_Esophagus_weight_w256_h256_tvr0.8_22_200_100_100.hdf5",
                          output_model_path="/data/LAMBDA/unet_hn_models/unet_Esophagus_model_w256_h256_tvr0.8_22_200_100_100.h5")


def train_liver():
    total_image_lable_list = []


    cord_image_label_list_3 = data_insert.get_training_image_label_list("Abdominal", "Liver", label_exists=False)
    total_image_lable_list.extend(cord_image_label_list_3)


    print(len(total_image_lable_list))

    # unet.train_UNet_model(total_image_lable_list,
    #                       train_valid_ratio=0.8,
    #                       dims=[128, 128],
    #                       batch_size=48,
    #                       steps_per_epoch=300,
    #                       nb_epoch=100,
    #                       validation_steps=100,
    #                       output_weight_path="D:/LAMBDA/unet_Liver_weight_w128_h128_tvr0.8_48_300_100_100.hdf5",
    #                       output_model_path="D:/LAMBDA/unet_Liver_model_w128_h128_tvr0.8_48_300_100_100.h5")


def train_eye_l():
    total_image_lable_list = []
    image_label_list_json = r'/data/LAMBDA/unet_hn_models/Eye_L.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Eye_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Eye_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Eye_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Eye_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Eye_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/unet_hn_models/Eye_L.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/unet_hn_models/Eye_L+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Eye_L", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Eye_L", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Eye_L", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Eye_L", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Eye_L", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/unet_hn_models/Eye_L+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=400,
                          nb_epoch=50,
                          validation_steps=100,
                          output_weight_path="/data/LAMBDA/unet_hn_models/unet_Eye_L_weight_w256_h256_tvr0.8_20_350_300_100.hdf5",
                          output_model_path="/data/LAMBDA/unet_hn_models/unet_Eye_L_model_w256_h256_tvr0.8_20_350_300_100.h5",
                          load_weight_path = "/data/LAMBDA/unet_hn_models/unet_Eye_L_weight_w256_h256_tvr0.8_20_350_300_100.hdf5",
                          load_model_path = "")


def train_eye_r():
    total_image_lable_list = []
    image_label_list_json = r'/data/LAMBDA/unet_hn_models/Eye_R.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Eye_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Eye_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Eye_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Eye_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Eye_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/unet_hn_models/Eye_R.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/unet_hn_models/Eye_R+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Eye_R", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Eye_R", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Eye_R", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Eye_R", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Brain", label_exists=False)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Eye_R", labeled_start_offset=-12,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/unet_hn_models/Eye_R+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=500,
                          nb_epoch=500,
                          validation_steps=100,
                          output_weight_path="/data/LAMBDA/unet_hn_models/unet_Eye_R_weight_w256_h256_tvr0.8_20_350_300_100.hdf5",
                          output_model_path="/data/LAMBDA/unet_hn_models/unet_Eye_R_model_w256_h256_tvr0.8_20_350_300_100.h5",
                          load_weight_path = "",
                          load_model_path = "")


def train_larynx():
    total_image_lable_list = []

    # image_label_list_json = r'/data/LAMBDA/Larynx_onlyLabel.json'
    # if os.path.exists(image_label_list_json):
    #     with open(image_label_list_json) as f:
    #         total_image_lable_list = json.load(f)
    # else:
    #     image_label_list = data_insert.get_training_image_label_list("HN", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSC-TCGA", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC3DCT", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-Cetuximab", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-PET-CT", "Larynx", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #
    #     with open('/data/LAMBDA/Larynx_onlyLabel.json', 'w') as outfile:
    #         json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Larynx+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Larynx", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Larynx", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Larynx", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Larynx", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Larynx",
        #                                                     labeled_start_offset=-20, labeled_end_offset=20)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Larynx", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Larynx+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=12,
                          steps_per_epoch=2500,
                          nb_epoch=250,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Larynx_weight_w256_h256_tvr0.8_12_2500_250_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Larynx_model_w256_h256_tvr0.8_12_2500_250_100.h5")

def train_thyroid():
    total_image_lable_list = []

    image_label_list_json = r'/data/LAMBDA/Thyroid_onlyLabel.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:
        image_label_list = data_insert.get_training_image_label_list("HN", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = data_insert.get_training_image_label_list("HNSC-TCGA", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = data_insert.get_training_image_label_list("HNSCC", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = data_insert.get_training_image_label_list("HNSCC3DCT", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = data_insert.get_training_image_label_list("Head-Neck-Cetuximab", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = data_insert.get_training_image_label_list("Head-Neck-PET-CT", "Thyroid", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Thyroid_onlyLabel.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Thyroid+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Thyroid", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Thyroid", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Thyroid", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Thyroid", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Thyroid",
                                                            labeled_start_offset=-20, labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Thyroid", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Thyroid+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=500,
                          nb_epoch=250,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Thyroid_weight_w256_h256_tvr0.8_22_500_250_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Thyroid_model_w256_h256_tvr0.8_22_500_250_100.h5")



def train_trachea():
    total_image_lable_list = []

    image_label_list_json = r'/data/LAMBDA/Trachea_onlyLabel.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:
        image_label_list = get_training_data_from_institute("HN", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Trachea", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Trachea_onlyLabel.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Trachea+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Trachea", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Trachea", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Trachea", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Trachea", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Larynx",
        #                                                     labeled_start_offset=-20, labeled_end_offset=20)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Trachea", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Trachea+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=800,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Trachea_weight_w256_h256_tvr0.8_22_800_200_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Trachea_model_w256_h256_tvr0.8_22_800_200_100.h5")



def train_parotid_l():
    total_image_lable_list = []

    # image_label_list_json = r'/data/LAMBDA/Parotid_L_onlyLabel.json'
    # if os.path.exists(image_label_list_json):
    #     with open(image_label_list_json) as f:
    #         total_image_lable_list = json.load(f)
    # else:
    #     image_label_list = data_insert.get_training_image_label_list("HN", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSC-TCGA", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC3DCT", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-Cetuximab", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-PET-CT", "Parotid_L", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #
    #     with open('/data/LAMBDA/Parotid_L_onlyLabel.json', 'w') as outfile:
    #         json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Parotid_L+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Parotid_L", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("HNSC-TCGA", "Parotid_R", labeled_start_offset=-30,
        #                                                     labeled_end_offset=20)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("HNSCC", "Parotid_R", labeled_start_offset=-30,
        #                                                     labeled_end_offset=20)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("HNSCC3DCT", "Parotid_R", labeled_start_offset=-30,
        #                                                     labeled_end_offset=20)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        # image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Parotid_R",
        #                                                     labeled_start_offset=-20, labeled_end_offset=30)
        # total_image_lable_list.extend(image_label_list)
        # print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Parotid_L", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Parotid_L+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)
    #
    # print(len(total_image_lable_list))
    #
    #
    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=12,
                          steps_per_epoch=2000,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Parotid_L_weight_w256_h256_tvr0.8_12_2000_200_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Parotid_L_model_w256_h256_tvr0.8_12_2000_200_100.h5")


def train_parotid_r():
    total_image_lable_list = []

    # image_label_list_json = r'/data/LAMBDA/Parotid_R_onlyLabel.json'
    # if os.path.exists(image_label_list_json):
    #     with open(image_label_list_json) as f:
    #         total_image_lable_list = json.load(f)
    # else:
    #     image_label_list = data_insert.get_training_image_label_list("HN", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSC-TCGA", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC3DCT", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-Cetuximab", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-PET-CT", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #
    #     with open('/data/LAMBDA/Parotid_R_onlyLabel.json', 'w') as outfile:
    #         json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Parotid_R+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Parotid_R", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Parotid_R", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Parotid_R", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Parotid_R", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Parotid_R",
                                                            labeled_start_offset=-20, labeled_end_offset=30)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Parotid_R", labeled_start_offset=-30,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Parotid_R+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(len(total_image_lable_list))


    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=12,
                          steps_per_epoch=3500,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Parotid_R_weight_w256_h256_tvr0.8_12_3500_200_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Parotid_R_model_w256_h256_tvr0.8_12_3500_200_100.h5")


def train_OpticNrv_L():
    total_image_lable_list = []

    # image_label_list_2 = data_insert.get_training_image_label_list("HN", "Parotid_R", label_exists=False)
    # n = len(image_label_list_2)
    # sample_num = (int)(n*0.5)
    # random_label_list_2 = random.sample(image_label_list_2, sample_num)

    #total_image_lable_list.extend(random_label_list_2)

    image_label_list_json = r'/data/LAMBDA/OpticNrv_L+3.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "OpticNrv_L", labeled_start_offset=-3, labeled_end_offset=3)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/OpticNrv_L+3.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(total_image_lable_list[0])

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=12,
                          steps_per_epoch=400,
                          nb_epoch=400,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_L_weight_w256_h256_tvr0.8_48_200_100_100_+3.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_L_model_w256_h256_tvr0.8_48_200_100_100_+3.h5")


def train_OpticNrv_R():
    total_image_lable_list = []

    # image_label_list_2 = data_insert.get_training_image_label_list("HN", "Parotid_R", label_exists=False)
    # n = len(image_label_list_2)
    # sample_num = (int)(n*0.5)
    # random_label_list_2 = random.sample(image_label_list_2, sample_num)

    #total_image_lable_list.extend(random_label_list_2)

    image_label_list_json = r'/data/LAMBDA/OpticNrv_R+4.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "OpticNrv_R", labeled_start_offset=-4, labeled_end_offset=4)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/OpticNrv_R+5.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(total_image_lable_list[0])

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=12,
                          steps_per_epoch=400,
                          nb_epoch=400,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_R_weight_w256_h256_tvr0.8_48_200_100_100_+4.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_R_model_w256_h256_tvr0.8_48_200_100_100_+4.h5")


def train_Cochlea_L():
    total_image_lable_list = []

    image_label_list_json = r'/data/LAMBDA/Cochlea_L.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            image_label_list = json.load(f)
            total_image_lable_list.extend(image_label_list)
    else:

        image_label_list = get_training_data_from_institute("HN", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Cochlea_L", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Cochlea_L.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Cochlea_L+5.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            image_label_list = json.load(f)
            total_image_lable_list.extend(image_label_list)
    else:

        image_label_list = get_training_data_from_institute("HN", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Cochlea_L", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Cochlea_L+5.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=400,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Cochlea_L_weight_w256_h256_tvr0.8_22_400_300_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Cochlea_L_model_w256_h256_tvr0.8_22_400_300_100.h5")


def train_Cochlea_R():
    total_image_lable_list = []

    image_label_list_json = r'/data/LAMBDA/Cochlea_R.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            image_label_list = json.load(f)
            total_image_lable_list.extend(image_label_list)
    else:

        image_label_list = get_training_data_from_institute("HN", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Cochlea_R", label_exists=True)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Cochlea_R.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Cochlea_R+5.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            image_label_list = json.load(f)
            total_image_lable_list.extend(image_label_list)
    else:

        image_label_list = get_training_data_from_institute("HN", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Cochlea_R", labeled_start_offset=-5, labeled_end_offset=5)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Cochlea_R+5.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=400,
                          nb_epoch=200,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Cochlea_R_weight_w256_h256_tvr0.8_22_400_300_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Cochlea_R_model_w256_h256_tvr0.8_22_400_300_100.h5")


def train_mandibule():
    total_image_lable_list = []

    # image_label_list_json = r'/data/LAMBDA/Parotid_R_onlyLabel.json'
    # if os.path.exists(image_label_list_json):
    #     with open(image_label_list_json) as f:
    #         total_image_lable_list = json.load(f)
    # else:
    #     image_label_list = data_insert.get_training_image_label_list("HN", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSC-TCGA", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("HNSCC3DCT", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-Cetuximab", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #     image_label_list = data_insert.get_training_image_label_list("Head-Neck-PET-CT", "Parotid_R", label_exists=True)
    #     total_image_lable_list.extend(image_label_list)
    #     print(len(total_image_lable_list))
    #
    #     with open('/data/LAMBDA/Parotid_R_onlyLabel.json', 'w') as outfile:
    #         json.dump(total_image_lable_list, outfile)

    image_label_list_json = r'/data/LAMBDA/Mandible+20.json'
    if os.path.exists(image_label_list_json):
        with open(image_label_list_json) as f:
            total_image_lable_list = json.load(f)
    else:

        image_label_list = get_training_data_from_institute("HN", "Mandible", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSC-TCGA", "Mandible", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC", "Mandible", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("HNSCC3DCT", "Mandible", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-Cetuximab", "Mandible",
                                                            labeled_start_offset=-20, labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))
        image_label_list = get_training_data_from_institute("Head-Neck-PET-CT", "Mandible", labeled_start_offset=-20,
                                                            labeled_end_offset=20)
        total_image_lable_list.extend(image_label_list)
        print(len(total_image_lable_list))

        with open('/data/LAMBDA/Mandible+20.json', 'w') as outfile:
            json.dump(total_image_lable_list, outfile)

    print(len(total_image_lable_list))

    unet.train_UNet_model(total_image_lable_list,
                          train_valid_ratio=0.8,
                          dims=[256, 256],
                          batch_size=22,
                          steps_per_epoch=3000,
                          nb_epoch=100,
                          validation_steps=100,
                          output_weight_path=r"/data/LAMBDA/unet_hn_models/unet_Mandible_weight_w256_h256_tvr0.8_22_3000_100_100.hdf5",
                          output_model_path=r"/data/LAMBDA/unet_hn_models/unet_Mandible_model_w256_h256_tvr0.8_22_3000_100_100.h5")


def get_ct_image_list(ct_image_folder):
    ct_image_list = []
    if utils.CT_FOLDER_PATTERN.match(ct_image_folder):
        for image in os.listdir(ct_image_folder):
            ct_image_list.append(os.path.join(ct_image_folder, image))
    ct_image_list.sort(key=lambda x: int(os.path.basename(x).replace(".png", "")))

    return ct_image_list


def sequence_test(model_path, image_list, start, end, output_folder):
    model_name = os.path.basename(model_path)
    roi_name = re.search('_(.+)_model_', model_name).group(1)
    width = int(re.search('w(\d+)', model_name).group(1))
    height = int(re.search('h(\d+)', model_name).group(1))

    if start < 0:
        start = 0
    if end < 0:
        end = 0
    if start > len(image_list):
        start = len(image_list)
    if end > len(image_list):
        end = len(image_list)

    test_images = image_list[start:end]

    unet.predict_contour(test_images,
                         roi_name=roi_name,
                         dims=[width, height],
                         load_weight_path="",
                         load_model_path=model_path,
                         output_folder=output_folder)
    label_folder = os.path.join(output_folder, roi_name)
    if not os.path.exists(label_folder):
        os.makedirs(label_folder)
    generate_empty_labels(len(image_list), start, end, [width, height], label_folder=label_folder)

    label_mark = get_label_range(label_folder)

    if label_mark["end"] == -1:
        shutil.rmtree(label_folder, ignore_errors=True)

    return label_mark


def get_label_range(label_folder):

    labels = os.listdir(label_folder)
    labels.sort(key=lambda x: int(os.path.basename(x).replace(".png", "")))

    label_mark = np.zeros(len(labels))
    start = len(labels)
    end = -1

    for i in range(len(labels)):
        mask = imread(os.path.join(label_folder, labels[i]), as_gray=True)
        #print(mask.max())
        #print(mask.sum())

        if mask.max() > 0.5:
            label_mark[i] = 1
            if end < i:
                end = i
            if start > i:
                start = i

    res = {}
    res["label_mark"] = label_mark
    if end!=-1:
        res["end"] = end+1
    else:
        res["end"] = -1
    res["start"] = start
    return res


def generate_empty_labels(image_num, start, end, dims, label_folder):
    img = np.zeros(dims)

    for i in range(start):
        label_file = os.path.join(label_folder, str(i)+".png")
        imsave(label_file, img)

    for i in range(end, image_num):
        label_file = os.path.join(label_folder, str(i)+".png")
        imsave(label_file, img)


def get_training_data(ct_folder, label_folder, roi_name,
                      labeled_only=False,
                      labeled_start_offset=99999,
                      labeled_end_offset=99999,
                      start=0, end=99999):
    '''
    :param ct_folder:       CT image folder. eg: /data/LAMBDA/inst-11\HN-CHUM-001\img\1.3.6.1.4.1.14519.5.2.1.5168.2407.193637231694935080613530300441\18850827-CT-1.3.6.1.4.1.14519.5.2.1.5168.2407.178959368858707198180439962659
    :param label_folder:    RS image root folder, which includes all roi sub-folders. eg: /data/LAMBDA/inst-11\HN-CHUM-001\img\1.3.6.1.4.1.14519.5.2.1.5168.2407.193637231694935080613530300441\18850827-RTSTRUCT-1.3.6.1.4.1.14519.5.2.1.5168.2407.298553443897894253140323968567
    :param roi_name:
    :param labeled_only:    only with labeled slices
    :param labeled_start_offset: based on range of labeled slices, add a start offset to give a new range
    :param labeled_end_offset:   based on range of labeled slices, add a end offset to give a new range
    :param start:       give a start point in the whole image range
    :param end:         give a end point in the whole image range
    :return:
    '''
    paired_ct_roi_list = []
    if roi_name not in utils.ROI_PATTERNS.keys():
        print(roi_name + " is not recognized!")
        return paired_ct_roi_list
    roi_pattern = utils.ROI_PATTERNS[roi_name]

    # get label list
    label_list = []
    for rs in os.listdir(label_folder):
        # find the roi folder
        # the roi pattern may math multiple folders
        # rois is a list of roi image lists
        if roi_pattern.match(rs):
            abp_roi = os.path.join(label_folder, rs)
            # list images in this folder
            for image in os.listdir(abp_roi):
                label_list.append(os.path.abspath(os.path.join(abp_roi, image)))

    # get ct list
    ct_list = []
    for image in os.listdir(ct_folder):
        ct_list.append(os.path.abspath(os.path.join(ct_folder, image)))


    if len(label_list) == 0:
        #print("There is no roi: " + roi_name + " in folder: " + label_folder)
        return paired_ct_roi_list

    if len(ct_list) == 0:
        print("There is no ct image in folder: " + ct_folder)
        return paired_ct_roi_list

    if len(ct_list) != len(label_list):
        print("CT and label folder doesn't match!")
        print("CT folder: " + ct_folder)
        print("Label folder: " + label_folder)
        return paired_ct_roi_list

    label_list.sort(key=lambda x: int(os.path.basename(x).replace(".png", "")))

    ct_list.sort(key=lambda x: int(os.path.basename(x).replace(".png", "")))

    if labeled_only:
        lr = get_label_range(abp_roi)
        if len(lr["label_mark"]) != len(label_list):
            print("label range size error")
            return paired_ct_roi_list

        for i in range(len(label_list)):
            if lr["label_mark"][i] == 1:
                paired_ct_roi_list.append((ct_list[i], label_list[i]))

        return paired_ct_roi_list

    if labeled_start_offset!=99999 or labeled_end_offset !=99999:
        lr = get_label_range(abp_roi)
        lr_start = lr["start"] + labeled_start_offset
        lr_end = lr["end"] + labeled_end_offset
        if lr_start<0:
            lr_start =0
        if lr_start >= len(label_list):
            lr_start = 0

        if lr_end<0:
            lr_end = len(label_list)
        if lr_end > len(label_list):
            lr_end = len(label_list)

        if lr_start > lr_end:
            lr_start = 0
            lr_end = len(label_list)

        for i in range(lr_start, lr_end):
            if os.path.basename(ct_list[i]) == os.path.basename(label_list[i]):
                paired_ct_roi_list.append((ct_list[i], label_list[i]))
            else:
                print("CT and label file doesn't match!")
                print("CT file: " + ct_list[i])
                print("Label file: " + label_list[i])

        return paired_ct_roi_list

    if start<0:
        start=0
    if start>=len(label_list):
        start=0

    if end<0:
        end = len(label_list)
    if end > len(label_list):
        end = len(label_list)

    if start>end:
        start = 0
        end = len(label_list)

    for i in range(start, end):
        if os.path.basename(ct_list[i]) == os.path.basename(label_list[i]):
            paired_ct_roi_list.append((ct_list[i], label_list[i]))
        else:
            print("CT and label file doesn't match!")
            print("CT file: " + ct_list[i])
            print("Label file: " + label_list[i])

    return paired_ct_roi_list


def get_training_data_from_patient(patient_uid, roi_name,
                                   label_exists = False,
                                   labeled_start_offset=99999,
                                   labeled_end_offset=99999,
                                   start=0, end=99999):
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
    patient = lambda_model.Patient.objects.get(id=patient_uid)

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
                    abp_rs = os.path.abspath(os.path.join(root, dir))
                    rois.append(abp_rs)

                if utils.CT_FOLDER_PATTERN.match(dir):
                    abp_ct = os.path.abspath(os.path.join(root, dir))
                    cts.append(abp_ct)

            if len(cts)==0:
                #print("There is no CT images in study: " + root)
                continue

            if len(rois)==0:
                #print("There is no ROI labels in study: " + root)
                continue

            if len(cts)>1:
                #print("There are multiple sets of CT image in study: " + root)
                continue

            for roi in rois:
                for ct in cts:
                    paired_ct_roi_list.extend(get_training_data(ct, roi, roi_name,
                                                                labeled_only=label_exists,
                                                                labeled_start_offset=labeled_start_offset,
                                                                labeled_end_offset=labeled_end_offset,
                                                                start=start, end=end))

    return paired_ct_roi_list


def get_training_data_from_institute(institution_name, roi_name,
                                     label_exists = False,
                                     labeled_start_offset=99999,
                                     labeled_end_offset=99999,
                                     start=0, end=99999):
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
        paired_ct_roi_list.extend(get_training_data_from_patient(patient.id, roi_name,
                                                                 label_exists = label_exists,
                                                                 labeled_start_offset=labeled_start_offset,
                                                                 labeled_end_offset=labeled_end_offset,
                                                                 start=start, end=end))

    return paired_ct_roi_list


def thoracic_sequence_testing(img_ct_folder_abspath):
    '''
    :param img_ct_folder_abspath:
    :param ct_slice_distance: ct z resolution (mm)
    :return:
    '''

    # Get CT Images: Input a CT Image Folder Path
    #img_ct_folder_abspath = r"/data/LAMBDA/inst-2\LCTSC-Test-S3-203\img\1.3.6.1.4.1.14519.5.2.1.7014.4598.209403017805510796875124464511\20041205-CT-1.3.6.1.4.1.14519.5.2.1.7014.4598.170975846739654511307430051907"
    ct_image_list = get_ct_image_list(img_ct_folder_abspath)

    # Set RS Output Folder
    img_study_folder_abspath = os.path.dirname(img_ct_folder_abspath)
    rs_dicom_uid = "1.2.826.0.1.3680043.8.498.76827984228137608882190715003118823963" #pydicom.uid.generate_uid()
    t = datetime.now()
    rs_folder_name = t.strftime("%Y%m%d") + "-" + "RTSTRUCT" + "-" + rs_dicom_uid
    img_rs_folder_abspath = os.path.join(img_study_folder_abspath, rs_folder_name)

    # Test lung models
    lung_L_model_path = r"/data/LAMBDA/unet_thoracic_models\unet_Lung_L_model_w128_h128_tvr0.8_48_300_100_100.h5"
    lung_L_start_offset = 0
    lung_L_end_offset = 0
    lung_L_start = 0 + lung_L_start_offset
    lung_L_end = len(ct_image_list) + lung_L_end_offset
    lung_L_label_range = sequence_test(model_path=lung_L_model_path,
                                     image_list=ct_image_list,
                                     start=lung_L_start,
                                     end=lung_L_end,
                                     output_folder=img_rs_folder_abspath)

    lung_R_model_path = r"/data/LAMBDA/unet_thoracic_models\unet_Lung_R_model_w128_h128_tvr0.8_48_300_100_100.h5"
    lung_R_start_offset = 0
    lung_R_end_offset = 0
    lung_R_start = 0 + lung_R_start_offset
    lung_R_end = len(ct_image_list) + lung_R_end_offset
    lung_R_label_range = sequence_test(model_path=lung_R_model_path,
                                       image_list=ct_image_list,
                                       start=lung_R_start,
                                       end=lung_R_end,
                                       output_folder=img_rs_folder_abspath)

    lung_start = min(lung_L_label_range["start"], lung_R_label_range["start"])
    lung_end = max(lung_L_label_range["end"], lung_R_label_range["end"])

    heart_model_path = r"/data/LAMBDA/unet_thoracic_models\unet_Heart_model_w128_h128_tvr0.8_48_300_100_100.h5"
    lung2heart_start_offset = 0
    lung2heart_end_offset = 0
    if lung_end > lung_start:
        heart_start = lung_start + lung2heart_start_offset
        heart_end = lung_end + lung2heart_end_offset
    else:
        heart_start = 0
        heart_end = len(ct_image_list)
    heart_label_range = sequence_test(model_path=heart_model_path,
                                      image_list=ct_image_list,
                                      start=heart_start,
                                      end=heart_end,
                                      output_folder=img_rs_folder_abspath)

    # brain_model_path = r"/data/LAMBDA/unet_thoracic_models\unet_Brain_model_w128_h128_tvr0.8_48_300_100_100.h5"
    #
    # if lung_end != -1:
    #     brain_start = lung_end + 0
    # else:
    #     brain_start = 0
    # brain_end = len(ct_image_list)
    # brain_label_range = sequence_test(model_path=brain_model_path,
    #                                   image_list=ct_image_list,
    #                                   start=brain_start,
    #                                   end=brain_end,
    #                                   output_folder=img_rs_folder_abspath)

    cord_model_path = r"/data/LAMBDA/unet_thoracic_models\unet_SpinalCord_model_w128_h128_tvr0.8_48_300_100_100.h5"
    #
    # if brain_label_range["start"] < brain_label_range["end"]:
    #     cord_start = 0
    #     cord_end = brain_label_range["start"]
    # else:
    cord_start = 0
    cord_end = len(ct_image_list)

    cord_label_range = sequence_test(model_path=cord_model_path,
                                      image_list=ct_image_list,
                                      start=cord_start,
                                      end=cord_end,
                                      output_folder=img_rs_folder_abspath)


    eso_model_path = r"/data/LAMBDA/unet_Esophagus_model_w128_h128_tvr0.8_48_300_100_100.h5"

    # if brain_label_range["start"] < brain_label_range["end"]:
    #     eso_start = 0
    #     eso_end = brain_label_range["start"]
    # else:
    eso_start = 0
    eso_end = len(ct_image_list)

    eso_label_range = sequence_test(model_path=eso_model_path,
                                     image_list=ct_image_list,
                                     start=eso_start,
                                     end=eso_end,
                                     output_folder=img_rs_folder_abspath)


    #From image files generate nrrd file
    # n to 1
    dc = utils.DataConverter()
    nrrd_ct_file_abspath = img_ct_folder_abspath.replace("img", "nrrd") + ".nrrd"
    ct_data, ct_header = nrrd.read(nrrd_ct_file_abspath)
    rs_header = ct_header
    rs_header['type'] = "uint"

    label_folders = os.listdir(img_rs_folder_abspath)
    for label_folder in label_folders:
        input_label_folder = os.path.join(img_rs_folder_abspath, label_folder)
        output_nrrd_file = input_label_folder.replace("img", "nrrd") + ".nrrd"
        dc.Label2Nrrd(input_label_folder=input_label_folder,
                      nrrd_header=rs_header,
                      output_nrrd_file=output_nrrd_file)

    #From nrrd files generate dicom file
    # and generate coronal and saggital contours
    # n to 1
    nrrd_rs_folder_abspath = img_rs_folder_abspath.replace("img", "nrrd")
    dcm_ct_folder_abspath = nrrd_ct_file_abspath.replace(".nrrd", "").replace("nrrd", "dcm")
    dcm_rs_file_abspath = nrrd_rs_folder_abspath.replace("nrrd", "dcm") + ".dcm"
    dc.RsNrrd2Dicom(nrrd_rs_folder_abspath,
                     dcm_ct_folder_abspath,
                     dcm_rs_file_abspath)

    # update uid info in database
    utils.updateDicomUidAndDescription(dcm_rs_file_abspath)

    # generate coronal and saggital contour json files
    json_rs_file_abspath = nrrd_rs_folder_abspath.replace('nrrd', 'json') + '.json'
    dc.generateCoronalSaggitalContourJson(input_rs_nrrd_folder=nrrd_rs_folder_abspath,
                                       output_rs_json_file=json_rs_file_abspath)

    # Calculate dvhs
    dcm_study_folder_abspath = img_study_folder_abspath.replace("img", "dcm")
                                # find all dose dicom files
    files = os.listdir(dcm_study_folder_abspath)
    for file in files:
        if utils.RTDOSE_DICOM_PATTERN.match(file):
            dc.generateDVHs(dicom_dose_file=os.path.join(dcm_study_folder_abspath, file),
                            dicom_rs_file=dcm_rs_file_abspath,
                            update=True)


def hn_sequence_testing(img_ct_folder_abspath):
    '''
    :param img_ct_folder_abspath:
    :param ct_slice_distance: ct z resolution (mm)
    :return:
    '''

    # Get CT Images: Input a CT Image Folder Path
    #img_ct_folder_abspath = r"/data/LAMBDA/inst-2\LCTSC-Test-S3-203\img\1.3.6.1.4.1.14519.5.2.1.7014.4598.209403017805510796875124464511\20041205-CT-1.3.6.1.4.1.14519.5.2.1.7014.4598.170975846739654511307430051907"
    ct_image_list = get_ct_image_list(img_ct_folder_abspath)

    # Set RS Output Folder
    img_study_folder_abspath = os.path.dirname(img_ct_folder_abspath)
    rs_dicom_uid = "1.2.826.0.1.3680043.8.498.12894812573176121604836276416594922682" #pydicom.uid.generate_uid()#
    t = datetime.now()
    rs_folder_name = t.strftime("%Y%m%d") + "-" + "RTSTRUCT" + "-" + rs_dicom_uid
    img_rs_folder_abspath = os.path.join(img_study_folder_abspath, rs_folder_name)


    brain_model_path = r"/data/LAMBDA/unet_hn_models/unet_Brain_model_w256_h256_tvr0.8_12_4000_100_100.h5"

    brain_start = 0
    brain_end = len(ct_image_list)
    brain_label_range = sequence_test(model_path=brain_model_path,
                                      image_list=ct_image_list,
                                      start=brain_start,
                                      end=brain_end,
                                      output_folder=img_rs_folder_abspath)

    print(brain_label_range)

    cord_model_path = r"/data/LAMBDA/unet_hn_models/unet_SpinalCord_model_w128_h128_tvr0.8_48_200_100_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        cord_start = 0
        cord_end = brain_label_range["start"]
    else:
        cord_start = 0
        cord_end = len(ct_image_list)

    cord_label_range = sequence_test(model_path=cord_model_path,
                                      image_list=ct_image_list,
                                      start=cord_start,
                                      end=cord_end,
                                      output_folder=img_rs_folder_abspath)
    print(cord_label_range)


    eso_model_path = r"/data/LAMBDA/unet_hn_models/unet_Esophagus_model_w256_h256_tvr0.8_22_200_100_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        eso_start = 0
        eso_end = brain_label_range["start"]
    else:
        eso_start = 0
        eso_end = len(ct_image_list)

    eso_label_range = sequence_test(model_path=eso_model_path,
                                     image_list=ct_image_list,
                                     start=eso_start,
                                     end=eso_end,
                                     output_folder=img_rs_folder_abspath)
    print(eso_label_range)


    brainstem_model_path = r"/data/LAMBDA/unet_hn_models/unet_BrainStem_model_w256_h256_tvr0.8_20_350_300_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        brainstem_start = brain_label_range["start"]
        brainstem_end = brain_label_range["end"]
    else:
        brainstem_start = 0
        brainstem_end = len(ct_image_list)

    brainstem_label_range = sequence_test(model_path=brainstem_model_path,
                                    image_list=ct_image_list,
                                    start=brainstem_start,
                                    end=brainstem_end,
                                    output_folder=img_rs_folder_abspath)
    print(brainstem_label_range)

    eye_l_model_path = r"/data/LAMBDA/unet_hn_models/unet_Eye_L_model_w256_h256_tvr0.8_20_350_300_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        eye_l_start = brain_label_range["start"]
        eye_l_end = brain_label_range["end"]
    else:
        eye_l_start = 0
        eye_l_end = len(ct_image_list)

    eye_l_label_range = sequence_test(model_path=eye_l_model_path,
                                          image_list=ct_image_list,
                                          start=eye_l_start,
                                          end=eye_l_end,
                                          output_folder=img_rs_folder_abspath)
    print(eye_l_label_range)

    eye_r_model_path = r"/data/LAMBDA/unet_hn_models/unet_Eye_R_model_w256_h256_tvr0.8_20_350_300_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        eye_r_start = brain_label_range["start"]
        eye_r_end = brain_label_range["end"]
    else:
        eye_r_start = 0
        eye_r_end = len(ct_image_list)

    eye_r_label_range = sequence_test(model_path=eye_r_model_path,
                                      image_list=ct_image_list,
                                      start=eye_r_start,
                                      end=eye_r_end,
                                      output_folder=img_rs_folder_abspath)
    print(eye_r_label_range)

    eye_start = min(eye_l_label_range["start"], eye_r_label_range["start"])
    eye_end = max(eye_l_label_range["end"], eye_r_label_range["end"])

    lung_l_model_path = r"/data/LAMBDA/unet_hn_models/unet_Lung_L_model_w128_h128_tvr0.8_48_300_100_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        lung_l_start = 0
        lung_l_end = brain_label_range["start"]
    else:
        lung_l_start = 0
        lung_l_end = len(ct_image_list)

    lung_l_label_range = sequence_test(model_path=lung_l_model_path,
                                      image_list=ct_image_list,
                                      start=lung_l_start,
                                      end=lung_l_end,
                                      output_folder=img_rs_folder_abspath)
    print(lung_l_label_range)

    lung_r_model_path = r"/data/LAMBDA/unet_hn_models/unet_Lung_R_model_w128_h128_tvr0.8_48_300_100_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        lung_r_start = 0
        lung_r_end = brain_label_range["start"]
    else:
        lung_r_start = 0
        lung_r_end = len(ct_image_list)

    lung_r_label_range = sequence_test(model_path=lung_r_model_path,
                                       image_list=ct_image_list,
                                       start=lung_r_start,
                                       end=lung_r_end,
                                       output_folder=img_rs_folder_abspath)
    print(lung_r_label_range)

    lung_start = min(lung_l_label_range["start"], lung_r_label_range["start"])
    lung_end = max(lung_l_label_range["end"], lung_r_label_range["end"])

    parotid_l_model_path = r"/data/LAMBDA/unet_hn_models/unet_Parotid_L_model_w256_h256_tvr0.8_12_2000_200_100.h5"

    if lung_start < lung_end and eye_r_label_range["start"] < eye_r_label_range["end"]:
        parotid_l_start = lung_end
        parotid_l_end = eye_r_label_range["start"]
    else:
        parotid_l_start = 0
        parotid_l_end = len(ct_image_list)

    parotid_l_label_range = sequence_test(model_path=parotid_l_model_path,
                                       image_list=ct_image_list,
                                       start=parotid_l_start,
                                       end=parotid_l_end,
                                       output_folder=img_rs_folder_abspath)
    print(parotid_l_label_range)

    parotid_r_model_path = r"/data/LAMBDA/unet_hn_models/unet_Parotid_R_model_w256_h256_tvr0.8_12_3500_200_100.h5"

    parotid_r_start = 0
    if lung_start < lung_end:
        parotid_r_start = lung_end
    if cord_label_range["end"] - 13 >= 0:
        parotid_r_start = cord_label_range["end"] - 13

    parotid_r_end = len(ct_image_list)
    if eye_r_label_range["start"] < eye_r_label_range["end"]:
        parotid_r_end = eye_r_label_range["start"]

    parotid_r_label_range = sequence_test(model_path=parotid_r_model_path,
                                          image_list=ct_image_list,
                                          start=parotid_r_start,
                                          end=parotid_r_end,
                                          output_folder=img_rs_folder_abspath)
    print(parotid_r_label_range)

    mandible_model_path = r"/data/LAMBDA/unet_hn_models/unet_Mandible_model_w256_h256_tvr0.8_22_3000_100_100.h5"

    mandible_start = 0
    if lung_start < lung_end:
        mandible_start = lung_end

    mandible_end = len(ct_image_list)
    if eye_r_label_range["start"] < eye_r_label_range["end"]:
        mandible_end = eye_r_label_range["start"]

    mandible_label_range = sequence_test(model_path=mandible_model_path,
                                          image_list=ct_image_list,
                                          start=mandible_start,
                                          end=mandible_end,
                                          output_folder=img_rs_folder_abspath)
    print(mandible_label_range)


    opticNrv_l_model_path = r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_L_model_w256_h256_tvr0.8_48_200_100_100_+3.h5"

    opticNrv_l_start = 0
    if eye_start-1 >= 0:
        opticNrv_l_start = eye_start-1

    opticNrv_l_end = len(ct_image_list)
    if eye_end + 1 <= len(ct_image_list):
        opticNrv_l_end = eye_end + 1

    opticNrv_l_label_range = sequence_test(model_path=opticNrv_l_model_path,
                                          image_list=ct_image_list,
                                          start=opticNrv_l_start,
                                          end=opticNrv_l_end,
                                          output_folder=img_rs_folder_abspath)
    print(opticNrv_l_label_range)

    opticNrv_r_model_path = r"/data/LAMBDA/unet_hn_models/unet_OpticNrv_R_model_w256_h256_tvr0.8_48_200_100_100_+4.h5"

    opticNrv_r_start = 0
    if eye_start - 1 >= 0:
        opticNrv_r_start = eye_start - 1

    opticNrv_r_end = len(ct_image_list)
    if eye_end + 1 <= len(ct_image_list):
        opticNrv_r_end = eye_end + 1

    opticNrv_r_label_range = sequence_test(model_path=opticNrv_r_model_path,
                                           image_list=ct_image_list,
                                           start=opticNrv_r_start,
                                           end=opticNrv_r_end,
                                           output_folder=img_rs_folder_abspath)
    print(opticNrv_r_label_range)

    cochlea_l_model_path = r"/data/LAMBDA/unet_hn_models/unet_Cochlea_L_model_w256_h256_tvr0.8_22_400_300_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        cochlea_l_start = brain_label_range["start"]
    else:
        cochlea_l_start = 0

    if eye_end <= len(ct_image_list):
        cochlea_l_end = eye_end
    elif brain_label_range["end"]<= len(ct_image_list):
        cochlea_l_end = brain_label_range["end"]
    else:
        cochlea_l_end =  len(ct_image_list)

    cochlea_l_label_range = sequence_test(model_path=cochlea_l_model_path,
                                          image_list=ct_image_list,
                                          start=cochlea_l_start,
                                          end=cochlea_l_end,
                                          output_folder=img_rs_folder_abspath)
    print(cochlea_l_label_range)

    cochlea_r_model_path = r"/data/LAMBDA/unet_hn_models/unet_Cochlea_R_model_w256_h256_tvr0.8_22_400_300_100.h5"

    if brain_label_range["start"] < brain_label_range["end"]:
        cochlea_r_start = brain_label_range["start"]
    else:
        cochlea_r_start = 0

    if eye_end <= len(ct_image_list):
        cochlea_r_end = eye_end
    elif brain_label_range["end"]<= len(ct_image_list):
        cochlea_r_end = brain_label_range["end"]
    else:
        cochlea_r_end =  len(ct_image_list)

    cochlea_r_label_range = sequence_test(model_path=cochlea_r_model_path,
                                          image_list=ct_image_list,
                                          start=cochlea_r_start,
                                          end=cochlea_r_end,
                                          output_folder=img_rs_folder_abspath)
    print(cochlea_r_label_range)

    larynx_model_path = r"/data/LAMBDA/unet_hn_models/unet_Larynx_model_w256_h256_tvr0.8_12_2500_250_100.h5"

    larynx_start = 0
    if lung_start < lung_end:
        larynx_start = lung_end-5

    larynx_end = len(ct_image_list)
    if brain_label_range["start"] < brain_label_range["end"]:
        larynx_end = brain_label_range["start"]+5

    larynx_label_range = sequence_test(model_path=larynx_model_path,
                                          image_list=ct_image_list,
                                          start=larynx_start,
                                          end=larynx_end,
                                          output_folder=img_rs_folder_abspath)
    print(larynx_label_range)

    trachea_model_path = r"/data/LAMBDA/unet_hn_models/unet_Trachea_model_w256_h256_tvr0.8_22_800_200_100.h5"

    trachea_start = 0

    trachea_end = len(ct_image_list)
    if brain_label_range["start"] < brain_label_range["end"]:
        trachea_end = brain_label_range["start"] + 5

    trachea_label_range = sequence_test(model_path=trachea_model_path,
                                       image_list=ct_image_list,
                                       start=trachea_start,
                                       end=trachea_end,
                                       output_folder=img_rs_folder_abspath)
    print(trachea_label_range)


    #From image files generate nrrd file
    # n to 1
    dc = utils.DataConverter()
    nrrd_ct_file_abspath = img_ct_folder_abspath.replace("img", "nrrd") + ".nrrd"
    ct_data, ct_header = nrrd.read(nrrd_ct_file_abspath)
    rs_header = ct_header
    rs_header['type'] = "uint"

    label_folders = os.listdir(img_rs_folder_abspath)
    for label_folder in label_folders:
        input_label_folder = os.path.join(img_rs_folder_abspath, label_folder)
        output_nrrd_file = input_label_folder.replace("img", "nrrd") + ".nrrd"
        dc.Label2Nrrd(input_label_folder=input_label_folder,
                      nrrd_header=rs_header,
                      output_nrrd_file=output_nrrd_file)

    #From nrrd files generate dicom file
    # and generate coronal and saggital contours
    # n to 1
    nrrd_rs_folder_abspath = img_rs_folder_abspath.replace("img", "nrrd")
    dcm_ct_folder_abspath = nrrd_ct_file_abspath.replace(".nrrd", "").replace("nrrd", "dcm")
    dcm_rs_file_abspath = nrrd_rs_folder_abspath.replace("nrrd", "dcm") + ".dcm"
    dc.RsNrrd2Dicom(nrrd_rs_folder_abspath,
                     dcm_ct_folder_abspath,
                     dcm_rs_file_abspath)

    # update uid info in database
    utils.updateDicomUidAndDescription(dcm_rs_file_abspath)

    # generate coronal and saggital contour json files
    json_rs_file_abspath = nrrd_rs_folder_abspath.replace('nrrd', 'json') + '.json'
    dc.generateCoronalSaggitalContourJson(input_rs_nrrd_folder=nrrd_rs_folder_abspath,
                                       output_rs_json_file=json_rs_file_abspath)

    # Calculate dvhs
    dcm_study_folder_abspath = img_study_folder_abspath.replace("img", "dcm")
                                # find all dose dicom files
    files = os.listdir(dcm_study_folder_abspath)
    for file in files:
        if utils.RTDOSE_DICOM_PATTERN.match(file):
            dc.generateDVHs(dicom_dose_file=os.path.join(dcm_study_folder_abspath, file),
                            dicom_rs_file=dcm_rs_file_abspath,
                            update=True)


def main():
    #train_OpticNrv_L()
    #train_OpticNrv_R()
    #train_parotid_l()
    #train_parotid_r()
    #train_parotid_r()
    #train_larynx()
    #train_trachea()
    #thoracic_sequence_testing(r"/data/LAMBDA/inst-2/LCTSC-Test-S3-201/img/1.3.6.1.4.1.14519.5.2.1.7014.4598.268430116413033494100421517580/20040119-CT-1.3.6.1.4.1.14519.5.2.1.7014.4598.335078307052561432151962256485")
    #train_brain()
    #train_brainstem()
    #train_eye_l()
    #train_eye_r()
    #train_esophagus()+
    #train_Cochlea_L()
    #train_Cochlea_R()
    #train_mandibule()
    train_thyroid()
    #hn_sequence_testing(
    #      r"/data/LAMBDA/inst-2/d_005/img/1.3.12.2.1107.5.1.4.49363.30000015051401271415600000052/20150515-CT-1.3.12.2.1107.5.1.4.49363.30000015051401283054600002585")


if __name__ == '__main__':
    main()
