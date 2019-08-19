from model import *
from data import *  #Import all functions in these two files

#os.environ["CUDA_VISIBLE_DEVICES"] = "0"


data_gen_args = dict(rotation_range=0.2,
                    width_shift_range=0.05,
                    height_shift_range=0.05,
                    shear_range=0.05,
                    zoom_range=0.05,
                    horizontal_flip=True,
                    fill_mode='nearest')  #Dictionary of Transformations in Data Enhancement
myGene = trainGenerator(2,'data/membrane/train','image','label',data_gen_args,save_to_dir = None)
#Get a generator that generates the enhanced data infinitely at the rate of batch = 2
model = unet()
model_checkpoint = ModelCheckpoint('unet_membrane.hdf5', monitor='loss',verbose=1, save_best_only=True)           #none define
#Callback function, the first is to save the model path, the second is to detect the value, detection Loss is to make it the smallest, and the third is to save only the best performance model on the verification set.
model.fit_generator(myGene,steps_per_epoch=300,epochs=1,callbacks=[model_checkpoint])                                  #none define?
# steps_per_epoch The number of batch_sizes per epoch, that is, the number of training sets divided by batch_size
# The above line uses a generator to train batch_size numbers, and samples and labels are passed in through myGene.

testGene = testGenerator("data/membrane/test")
results = model.predict_generator(testGene,30,verbose=1)
#30 is steps, steps: Total steps from generator before stopping(Sample batch). Optional parameters: Sequence:  If not specified, len (generator) will be used as the number of steps.
#The return value above is a Numpy array of predicted values
saveResult("data/membrane/test",results)