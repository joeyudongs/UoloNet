# coding: utf-8

import os
import errno

from skimage.transform import resize
from skimage.io import imsave, imread
from keras.models import Model
from keras.layers import Input, concatenate, Conv2D, MaxPooling2D, Conv2DTranspose, BatchNormalization
from keras.optimizers import Adam
from keras.callbacks import ModelCheckpoint
from keras import backend as K
import matplotlib.pyplot as plt
import numpy as np
from scripts import data_insert
import nrrd
from sklearn.model_selection import train_test_split
from keras.callbacks import ModelCheckpoint, LearningRateScheduler, EarlyStopping, ReduceLROnPlateau
from keras.models import load_model
from keras import backend as K
from keras.utils import multi_gpu_model

from keras.preprocessing import image

os.environ["CUDA_VISIBLE_DEVICES"] = "1"   #有多少个显卡，挑第几个，编号为1的显卡

#
# train_data_path = os.path.join(data_path, 'images')
# mask_data_path = os.path.join(data_path, 'masks')
# images = os.listdir(train_data_path)
#
#
# train_images, validation_images = train_test_split(images, train_size=0.8, test_size=0.2)
# dims = [256, 256]
# batch_size = 8
# train_gen = data_gen_file(train_data_path, mask_data_path,train_images, batch_size, dims)
# generator that we will use to read the data from the directory
def data_gen_file(data_dir, mask_dir, images, batch_size, dims):

    while True:
        ix = np.random.choice(np.arange(len(images)), batch_size)  #Generates a random sample from a given 1-D array, return an array.
        imgs = []
        labels = []
        for i in ix:
            # images
            if images[i].endswith('.png'):
                original_img = imread(os.path.join(data_dir, images[i]), as_grey=True) #Read an image from a file into an array. The returned array has shape (M, N) for grayscale images.
                original_mask = imread(os.path.join(mask_dir, images[i]), as_grey=True)
            resized_i = resize(original_img, (dims[0], dims[1]), preserve_range=True)  #256rows, 256cols
            resized_img = resized_i.astype('float32')  #Copy of the array, cast to a specified type.
            array_img = (resized_img-resized_img.min())/(resized_img.max()-resized_img.min())   #??????? 原始图片-矩阵图片，把1个1个转换完. normalization
            imgs.append(array_img)

            # masks
            resized_m = resize(original_mask, (dims[0], dims[1]), preserve_range=True)
            resized_mask = resized_m.astype('float32')
            nom = resized_mask.max()-resized_mask.min()   #归一化处理
            if (nom == 0.):      #/0 --error
                nom = 1
            array_mask = (resized_mask-resized_mask.min())/(nom)
            labels.append(array_mask)
        imgs = np.array(imgs)
        labels = np.array(labels)
        yield imgs.reshape(-1,dims[0],dims[1],1), labels.reshape(-1, dims[0], dims[1], 1)  #The yield statement suspends function’s execution and sends a value back to caller, but retains enough state to enable function to resume where it is left off.
        
#
#
# train_gen = data_gen_file(train_data_path, mask_data_path,train_images, 2, [512, 512])
# valid_gen = data_gen_file(train_data_path, mask_data_path,validation_images, 2, [512, 512])
# img, msk = next(train_gen)
#
# print(img)



#test_data = data_insert.get_test_data(institution_name="Test")

# generator that we will use to read the data from the directory
def test_gen_file(data_dir, images, batch_size, dims):

    idx = 0
    while True:
        #ix = np.random.choice(np.arange(len(images)), batch_size, replace=False)
        #ix = np.random.choice(np.arange(len(images)), 1, replace=False)
        #ix = [[i] for i in range(len(images))]
        ix = [idx]   #测图片不用random
        idx += 1
        imgs = []
        for i in ix:
            # images
            if images[i].endswith('.png'):
                original_img = imread(os.path.join(data_dir, images[i]), as_grey=True)
                resized_i = resize(original_img, (dims[0], dims[1]), preserve_range=True)
                resized_img = resized_i.astype('float32')
                array_img = (resized_img-resized_img.min())/(resized_img.max()-resized_img.min())
                imgs.append(array_img)

        imgs = np.array(imgs)
        yield imgs.reshape(-1,dims[0],dims[1],1)  #labels 是mask的东西
# test output

Sky = [128,128,128]         # 标框，显示不同物体，几类东西。 产生的颜色的sky
Building = [128,0,0]
Pole = [192,192,128]
Road = [128,64,128]
Pavement = [60,40,222]
Tree = [128,128,0]
SignSymbol = [192,128,128]
Fence = [64,64,128]
Car = [64,0,128]
Pedestrian = [64,64,0]
Bicyclist = [0,128,192]
Unlabelled = [0,0,0]

COLOR_DICT = np.array([Sky, Building, Pole, Road, Pavement,
                          Tree, SignSymbol, Fence, Car, Pedestrian, Bicyclist, Unlabelled])

def labelVisualize(num_class, color_dict,img):  #用颜色区分
    img = img[:,:,0] if len(img.shape) == 3 else img  #升降维
    img_out = np.zeros(img.shape + (3,))
    for i in range(num_class):
        img_out[img == i,:] = color_dict[i]
    return img_out / 255   #     RGB最大是255
#saveResult("data/test_result", results)
def saveResult(save_path, npyfile, flag_multi_class = False, num_class = 2):

    '''
    idx = 0
    print(len(npyfile))
    for v in npyfile:
        #print(idx)
        pred_img = image.array_to_img(v)
        #pred_img.save(str(idx) + '.jpg')
        idx += 1
    print("Save finished.")
    return
    '''

    for i,item in enumerate(npyfile):
        img = labelVisualize(num_class,COLOR_DICT,item) if flag_multi_class else item[:,:,0]
        imsave(os.path.join(save_path,"%d_predict.png"%i),img)

def data_gen_nrrd(image_label_list, batch_size, dims):

    while True:
        file_index_list = np.random.choice(np.arange(len(image_label_list)), batch_size)

        imgs = []
        labels = []
        for file_index in file_index_list:

            image_data, image_header = nrrd.read(image_label_list[file_index][0])
            mask_data, mask_header = nrrd.read(image_label_list[file_index][1])

            image_num = image_header['sizes'][2]
            mask_num = mask_header['sizes'][2]

            if image_num == mask_num:
                image_index = np.random.randint(image_num)

                img = image_data[:,:,image_index]
                img = resize(img,(dims[0], dims[1]), preserve_range=True)
                img = img.astype('float32')
                img_nom = img.max() - img.min()
                if (img_nom == 0.):
                    img_nom = 1
                img = (img-img.min())/img_nom
                imgs.append(img)

                mask = mask_data[:,:,image_index]
                mask = resize(mask, (dims[0], dims[1]), preserve_range=True)
                mask = mask.astype('float32')
                mask_nom = mask.max() - mask.min()
                if (mask_nom == 0.):
                    mask_nom = 1
                mask = (mask - mask.min()) / mask_nom
                labels.append(mask)

        imgs = np.array(imgs)
        labels = np.array(labels)
        yield imgs.reshape(-1,dims[0],dims[1],1), labels.reshape(-1, dims[0], dims[1], 1)

def data_gen_image_lable_list(image_label_list, batch_size, dims):

    while True:
        image_label_index_list = np.random.choice(np.arange(len(image_label_list)), batch_size)

        imgs = []
        labels = []
        for index in image_label_index_list:

            original_img = imread(os.path.join(image_label_list[index][0]), as_gray=True)
            original_mask = imread(os.path.join(image_label_list[index][1]), as_gray=True)

            img = resize(original_img,(dims[0], dims[1]), preserve_range=True)
            img = img.astype('float32')
            img_nom = img.max() - img.min()
            if (img_nom == 0.):
                img_nom = 1
            img = (img-img.min())/img_nom
            imgs.append(img)

            mask = resize(original_mask, (dims[0], dims[1]), preserve_range=True)
            mask = mask.astype('float32')
            mask_nom = mask.max() - mask.min()
            if (mask_nom == 0.):
                mask_nom = 1
            mask = (mask - mask.min()) / mask_nom
            labels.append(mask)

        imgs = np.array(imgs)
        labels = np.array(labels)
        yield imgs.reshape(-1,dims[0],dims[1],1), labels.reshape(-1, dims[0], dims[1], 1)


#img, msk = next(train_gen)


from keras.models import Input, Model
from keras.layers import Conv2D, Concatenate, MaxPooling2D
from keras.layers import UpSampling2D, Dropout, BatchNormalization

'''
U-Net: Convolutional Networks for Biomedical Image Segmentation
(https://arxiv.org/abs/1505.04597)
---
img_shape: (height, width, channels)
out_ch: number of output channels
start_ch: number of channels of the first conv
depth: zero indexed depth of the U-structure
inc_rate: rate at which the conv channels will increase
activation: activation function after convolutions
dropout: amount of dropout in the contracting part
batchnorm: adds Batch Normalization if true
maxpool: use strided conv instead of maxpooling if false
upconv: use transposed conv instead of upsamping + conv if false
residual: add residual connections around each conv block if true
'''

def conv_block(m, dim, acti, bn, res, do=0):
	n = Conv2D(dim, 3, activation=acti, padding='same')(m)
	n = BatchNormalization()(n) if bn else n
	n = Dropout(do)(n) if do else n
	n = Conv2D(dim, 3, activation=acti, padding='same')(n)
	n = BatchNormalization()(n) if bn else n
	return Concatenate()([m, n]) if res else n

def level_block(m, dim, depth, inc, acti, do, bn, mp, up, res):
	if depth > 0:
		n = conv_block(m, dim, acti, bn, res)
		m = MaxPooling2D()(n) if mp else Conv2D(dim, 3, strides=2, padding='same')(n)
		m = level_block(m, int(inc*dim), depth-1, inc, acti, do, bn, mp, up, res)
		if up:
			m = UpSampling2D()(m)
			m = Conv2D(dim, 2, activation=acti, padding='same')(m)
		else:
			m = Conv2DTranspose(dim, 3, strides=2, activation=acti, padding='same')(m)
		n = Concatenate()([n, m])
		m = conv_block(n, dim, acti, bn, res)
	else:
		m = conv_block(m, dim, acti, bn, res, do)
	return m
# model = UNet(dims[0], dims[1])
def UNet(row,col, out_ch=1, start_ch=64, depth=4, inc_rate=2., activation='relu',
		 dropout=0.5, batchnorm=True, maxpool=True, upconv=True, residual=False):
	i = Input((row,col,1))  #from keras.layers import Input
	o = level_block(i, start_ch, depth, inc_rate, activation, dropout, batchnorm, maxpool, upconv, residual)
	o = Conv2D(out_ch, 1, activation='sigmoid')(o)
	return Model(inputs=i, outputs=o)


smooth = 1.

def dice_coef(y_true, y_pred):
    y_true_f = K.flatten(y_true)
    y_pred_f = K.flatten(y_pred)
    intersection = K.sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (K.sum(y_true_f) + K.sum(y_pred_f) + smooth)

def dice_coef_loss(y_true, y_pred):
    return -dice_coef(y_true, y_pred)

def dice_coef2(y_true, y_pred, smooth=1):
    """
    Dice = (2*|X & Y|)/ (|X|+ |Y|)
         =  2*sum(|A*B|)/(sum(A^2)+sum(B^2))
    ref: https://arxiv.org/pdf/1606.04797v1.pdf
    """
    intersection = K.sum(K.abs(y_true * y_pred), axis=-1)
    return (2. * intersection + smooth) / (K.sum(K.square(y_true),-1) + K.sum(K.square(y_pred),-1) + smooth)

def dice_coef_loss1(y_true, y_pred):
    return 1-dice_coef(y_true, y_pred)

def jaccard_distance_loss(y_true, y_pred, smooth=100):
    """
    Jaccard = (|X & Y|)/ (|X|+ |Y| - |X & Y|)
            = sum(|A*B|)/(sum(|A|)+sum(|B|)-sum(|A*B|))

    The jaccard distance loss is usefull for unbalanced datasets. This has been
    shifted so it converges on 0 and is smoothed to avoid exploding or disapearing
    gradient.

    Ref: https://en.wikipedia.org/wiki/Jaccard_index

    @url: https://gist.github.com/wassname/f1452b748efcbeb4cb9b1d059dce6f96
    @author: wassname
    """
    intersection = K.sum(K.abs(y_true * y_pred), axis=-1)
    sum_ = K.sum(K.abs(y_true) + K.abs(y_pred), axis=-1)
    jac = (intersection + smooth) / (sum_ - intersection + smooth)
    return (1 - jac) * smooth


def train_UNet_model(training_data_image_lable_list,       
                     train_valid_ratio,
                     dims,
                     batch_size,
                     steps_per_epoch,
                     nb_epoch,
                     validation_steps,
                     output_weight_path,
                     output_model_path,
                     load_weight_path="",
                     load_model_path=""):
    train_images, validation_images = train_test_split(training_data_image_lable_list, train_size=train_valid_ratio, test_size=1-train_valid_ratio)
    train_gen = data_gen_image_lable_list(train_images, batch_size, dims)
    valid_gen = data_gen_image_lable_list(validation_images, batch_size, dims)

    model = UNet(dims[0], dims[1])

    checkpoint = ModelCheckpoint(output_weight_path, monitor='val_loss', verbose=1,
                                 save_best_only=True, mode='min', save_weights_only=True)

    reduceLROnPlat = ReduceLROnPlateau(monitor='val_loss', factor=0.8, patience=10, verbose=1, mode='auto',
                                       epsilon=0.0001, cooldown=5, min_lr=0.00001)

    early = EarlyStopping(monitor="val_loss",
                          mode="min",
                          patience=10)  # probably needs to be more patient, but kaggle time is limited

    callbacks_list = [checkpoint, reduceLROnPlat]

    model.summary()
    parallel_model = multi_gpu_model(model, gpus=2)

    parallel_model.compile(optimizer=Adam(lr=1e-4), loss=dice_coef_loss, metrics=[dice_coef])

    loss_history = []

    if load_model_path != "":
        parallel_model = load_model(load_model_path,
                       custom_objects={'dice_coef_loss':dice_coef_loss, 'dice_coef': dice_coef})

    if load_weight_path != "":
        parallel_model.load_weights(load_weight_path)

    loss_history += [parallel_model.fit_generator(train_gen, steps_per_epoch=steps_per_epoch, nb_epoch=nb_epoch,
                                         validation_data=valid_gen, validation_steps=validation_steps,
                                         callbacks=callbacks_list)]

    parallel_model.save(output_model_path)


def predict_contour(ct,
                    roi_name,
                    dims,
                    load_weight_path="",
                    load_model_path="",
                    output_folder = ""):
    '''
    :param ct:  A set of ct image file paths
    :param roi_name:    Predict contour name
    :param dims:        ct image dimension size
    :param load_weight_path:    pre-trained model weight
    :param load_model_path:     pre-trained model
    :return:
    '''

    model = load_model(load_model_path, custom_objects={'jaccard_distance_loss':jaccard_distance_loss,'dice_coef_loss':dice_coef_loss,'dice_coef':dice_coef})
    if load_weight_path != "":
        model.load_weights(load_weight_path)

    if len(ct)>0:
        ct_folder = os.path.dirname(ct[0])
    else:
        return None

    roi_folder = os.path.join(output_folder, roi_name)

    try:
        os.makedirs(roi_folder)
    except OSError as exc:  # Guard against race condition
        if exc.errno != errno.EEXIST:
            raise

    thresh = 0.5
    for image in ct:
        image_name = os.path.basename(image)
        label_file = os.path.join(roi_folder, image_name)

        imgs = []

        img = imread(image, as_grey=True)

        img = resize(img, (dims[0], dims[1]), preserve_range=True)
        img = img.astype('float32')
        img_nom = img.max() - img.min()
        if (img_nom == 0.):
            img_nom = 1
        img = (img - img.min()) / img_nom

        imgs.append(img)
        imgs = np.array(imgs)
        imgs = imgs.reshape(-1, dims[0], dims[1], 1)

        label = model.predict(imgs)

        save_label = label[0,:,:,0]
        remove_label = save_label < thresh
        left_label = save_label >= thresh

        save_label[remove_label] = 0
        save_label[left_label] = 1

        save_label = save_label.astype('uint8')

        save_label[0,:] = 0
        save_label[dims[0]-1, :] = 0
        save_label[:, 0] = 0
        save_label[:, dims[1] - 1] = 0

        if save_label.sum() < 3:
            save_label = np.zeros((dims[0], dims[1])).astype('uint8')

        imsave(label_file, save_label)

    K.clear_session()


def main():
    data_path = 'data'

    train_data_path = os.path.join(data_path, 'images') #data/images
    mask_data_path = os.path.join(data_path, 'masks')   #data/masks
    images = os.listdir(train_data_path)           #list:[1.png, 2.png...30.png]

    test_data_path = os.path.join(data_path, 'test')    #data/test
    test_images = os.listdir(test_data_path)       #[1.png, 2.png, ..., 30.png]

    train_valid_ratio = 0.8  
    dims = [256, 256]
    batch_size = 8                  #在不能将数据一次性通过神经网络的时候，就需要将数据集分成几个 batch。
    output_path = 'unet_256.h5'
    step_per_epoch = 300         #epoch:1个epoch表示过了1遍训练集中的所有样本。  duo shao ceng
    num_epoch = 40                  #40次epoches
    validation_steps = 120       
    weight_path = "{}_weights.best.hdf5".format('unet256')   

    train_images, validation_images = train_test_split(images, train_size=train_valid_ratio,
                                                       test_size=1 - train_valid_ratio)
    train_gen = data_gen_file(train_data_path, mask_data_path,train_images, batch_size, dims)
    valid_gen = data_gen_file(train_data_path, mask_data_path,validation_images, batch_size, dims)
    test_gen = test_gen_file(test_data_path, test_images, batch_size, dims)

    # load
    #model = load_model("unet_256.h5", custom_objects={'jaccard_distance_loss':jaccard_distance_loss,    'dice_coef_loss':dice_coef_loss,'dice_coef':dice_coef})
    #model.load_weights("unet256_weights.best.hdf5")
    #results = model.predict_generator(test_gen, steps=len(test_images))
    #saveResult("data/test_result", results)
    #exit()
    # load ends


    model = UNet(dims[0], dims[1])

    #from keras.callbacks import ModelCheckpoint
    checkpoint = ModelCheckpoint(weight_path, monitor='val_loss', verbose=1,
                                 save_best_only=True, mode='min', save_weights_only=True)

    reduceLROnPlat = ReduceLROnPlateau(monitor='val_loss', factor=0.8, patience=10, verbose=1, mode='auto',
                                       epsilon=0.0001, cooldown=5, min_lr=0.0001)

    early = EarlyStopping(monitor="val_loss",
                          mode="min",
                          patience=10)  # probably needs to be more patient, but kaggle time is limited

    callbacks_list = [checkpoint, early, reduceLROnPlat]

    model.summary()

    model.compile(optimizer=Adam(lr=1e-4), loss=jaccard_distance_loss, metrics=[dice_coef])

    loss_history = []
    #相当于train函数
    loss_history += [model.fit_generator(train_gen, steps_per_epoch=step_per_epoch, nb_epoch=num_epoch,
                                         validation_data=valid_gen, validation_steps=validation_steps,
                                         callbacks=callbacks_list)]

    model.save(output_path)

# test

    #results = model.predict_generator(test_gen, steps=step_per_epoch)
    results = model.predict_generator(test_gen, steps=len(test_images)) #????前面是训练，你准备问题，它给你答案#Generates predictions for the input samples from a data generator.
    saveResult("data/test_result", results)


if __name__=="__main__":
    main()
