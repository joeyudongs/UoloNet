class RTImageSlice{
    constructor() {

	    this.x_start = 0;
	    this.y_start = 0;
	    this.z_start = 0;

	    this.x_dim = 0;
	    this.y_dim = 0;
	    this.z_dim = 0;

	    this.x_pixdim = 0;
	    this.y_pixdim = 0;
	    this.z_pixdim = 0;

        this.imageSlice = [];
    }
}

class RTImage{
    constructor() {

	    this.x_start = 0;
	    this.y_start = 0;
	    this.z_start = 0;

	    this.x_dim = 0;
	    this.y_dim = 0;
	    this.z_dim = 0;

	    this.x_pixdim = 0;
	    this.y_pixdim = 0;
	    this.z_pixdim = 0;

	    this.Xx_ornt = 1;
	    this.Xy_ornt = 0;
	    this.Xz_ornt = 0;
	    this.Yx_ornt = 0;
	    this.Yy_ornt = 1;
	    this.Yz_ornt = 0;
	    this.Zx_ornt = 0;
	    this.Zy_ornt = 0;
	    this.Zz_ornt = 1;

	    //actual size of image box (mm)
	    this.x_size = 0;
	    this.y_size = 0;
	    this.z_size = 0;
	    this.max_size = 0;

	    //minimal pixel resolution
	    this.min_pixdim = 0;

	    //normalized pixel dimension
	    this.x_dim_norm = 0;
	    this.y_dim_norm = 0;
	    this.z_dim_norm = 0;

	    //max dimension
	    this.max_dim = 0;

        this.imageSlices = [];
    }

    calculateSizeAndNormDim(){
        this.x_size = this.x_dim*this.x_pixdim;
        this.y_size = this.y_dim*this.y_pixdim;
        this.z_size = this.z_dim*this.z_pixdim;

        this.max_size = this.x_size;
        if(this.max_size < this.y_size){
            this.max_size = this.y_size;
        }
        if(this.max_size < this.z_size){
            this.max_size = this.z_size;
        }

        this.min_pixdim = this.x_pixdim;
        if(this.min_pixdim > this.y_pixdim){
            this.min_pixdim = this.y_pixdim;
        }
        if(this.min_pixdim > this.z_pixdim){
            this.min_pixdim = this.z_pixdim;
        }

        this.x_dim_norm = this.x_size/this.min_pixdim;
        this.y_dim_norm = this.y_size/this.min_pixdim;
        this.z_dim_norm = this.z_size/this.min_pixdim;

        this.max_dim = this.x_dim_norm;
        if(this.max_dim < this.y_dim_norm){
            this.max_dim = this.y_dim_norm;
        }
        if(this.max_dim < this.z_dim_norm){
            this.max_dim = this.z_dim_norm;
        }
    }

    getAxialSlice(sliceNum_z){
        let axialImage = new RTImageSlice();

        if(sliceNum_z>=0 && sliceNum_z<this.z_dim){
            axialImage.imageSlice = this.imageSlices[sliceNum_z].getBuffer()[0];
        }

        return axialImage;
    }

    getCoronalSlice(sliceNum_y){
        let coronalImage = new RTImageSlice();

        for(let i=0; i<this.z_dim; i++){
            let start_index = sliceNum_y*this.x_dim;
            let end_index =  this.x_dim+sliceNum_y*this.x_dim;

            for(let x=start_index; x< end_index; x++){
                coronalImage.imageSlice.push(this.imageSlices[i].getBuffer()[0][x]);
            }
        }

        return coronalImage;
    }

    getSagittalSlice(sliceNum_x){
        let sagittalImage = new RTImageSlice();

        for(let i=0; i<this.z_dim; i++){
            for(let y=0; y< this.y_dim; y++){
                sagittalImage.imageSlice.push(this.imageSlices[i].getBuffer()[0][sliceNum_x+y*this.x_dim]);
            }
        }

        return sagittalImage;
    }
}

class RTDose{
    constructor() {

	    this.x_start = 0;
	    this.y_start = 0;
	    this.z_start = 0;

	    this.x_dim = 0;
	    this.y_dim = 0;
	    this.z_dim = 0;

	    this.x_pixdim = 0;
	    this.y_pixdim = 0;
	    this.z_pixdim = 0;

	    this.Xx_ornt = 1;
	    this.Xy_ornt = 0;
	    this.Xz_ornt = 0;
	    this.Yx_ornt = 0;
	    this.Yy_ornt = 1;
	    this.Yz_ornt = 0;
	    this.Zx_ornt = 0;
	    this.Zy_ornt = 0;
	    this.Zz_ornt = 1;

        //actual size of dose box (mm)
	    this.x_size = 0;
	    this.y_size = 0;
	    this.z_size = 0;
	    this.max_size = 0;

	    //minimal pixel resolution
	    this.min_pixdim = 0;

	    //normalized pixel dimension
	    this.x_dim_norm = 0;
	    this.y_dim_norm = 0;
	    this.z_dim_norm = 0;

	    //max dimension
	    this.max_dim = 0;

        this.doseData = [];

        this.maxDose = 0;
    }

    calculateSizeAndNormDim(){
        this.x_size = this.x_dim*this.x_pixdim;
        this.y_size = this.y_dim*this.y_pixdim;
        this.z_size = this.z_dim*this.z_pixdim;

        this.max_size = this.x_size;
        if(this.max_size < this.y_size){
            this.max_size = this.y_size;
        }
        if(this.max_size < this.z_size){
            this.max_size = this.z_size;
        }

        this.min_pixdim = this.x_pixdim;
        if(this.min_pixdim > this.y_pixdim){
            this.min_pixdim = this.y_pixdim;
        }
        if(this.min_pixdim > this.z_pixdim){
            this.min_pixdim = this.z_pixdim;
        }

        this.x_dim_norm = this.x_size/this.min_pixdim;
        this.y_dim_norm = this.y_size/this.min_pixdim;
        this.z_dim_norm = this.z_size/this.min_pixdim;

        this.max_dim = this.x_dim_norm;
        if(this.max_dim < this.y_dim_norm){
            this.max_dim = this.y_dim_norm;
        }
        if(this.max_dim < this.z_dim_norm){
            this.max_dim = this.z_dim_norm;
        }
    }

    calculateMaxDose(){
        let maxDoseArray = []
        for(let i=0; i<this.doseData.length; i++){
            let maxDose = Math.max(...this.doseData[i]);
            maxDoseArray.push(maxDose);
        }
        let max = Math.max(...maxDoseArray);
        this.maxDose = max;
    }

    getAxialSlice(position_z){
        let slice = [];
        let sliceNum = Math.round((position_z - this.z_start)/this.z_pixdim);
        if(sliceNum>=0 && sliceNum < this.z_dim){
            slice = this.doseData[sliceNum];
        }
        return slice;
    }

    getCoronalSlice(position_y){
        let slice = [];
        let sliceNum = Math.round((position_y - this.y_start)/this.y_pixdim);
        if(sliceNum>=0){
            for(let i=this.doseData.length-1; i>0; i--){
                let start_index = sliceNum*this.x_dim;
                let end_index =  this.x_dim+sliceNum*this.x_dim;

                for(let x=start_index; x< end_index; x++){
                    slice.push(this.doseData[i][x]);
                }
            }
        }
        return slice;
    }

    getSagittalSlice(position_x){
        let slice = [];
        let sliceNum = Math.round((position_x - this.x_start)/this.x_pixdim);
        if(sliceNum>=0){
            for(let i=this.doseData.length-1; i>0; i--){
                for(let y=0; y< this.y_dim; y++){
                    slice.push(this.doseData[i][sliceNum+y*this.x_dim]);
                }
            }
        }

        return slice;
    }
}

class RtDisplay {

    constructor() {
        this.rsDicom = '';
        this.ctDicoms = [];
        this.rdDicom = '';
        //this.imageSlices = [];
        this.rtImage = new RTImage();
        this.rtDose = new RTDose();

        this.rsJson = null;
        this.dvhJson = null;

        this.crntAxialImgNmb = 0;
        this.crntCoronalImgNmb = 0;
        this.crntSagittalImgNmb = 0;

        this.displayRois = [];
        this.displayPois = [];

        this.axialImgLoader;
        this.axialCanvas;

        // coronal image loader
        this.coronalImgLoader;
        this.coronalCanvas;

        // sagittal image loader
        this.sagittalImgLoader;
        this.sagittalCanvas;


        this.axialPaper;
        this.axialImageLayer;
        this.axialDoseLayer;
        this.axialRoiLayer;
        this.axialLineLayer;

        this.coronalPaper;
        this.coronalImageLayer;
        this.coronalDoseLayer;
        this.coronalRoiLayer;
        this.coronalLineLayer;

        this.sagittalPaper;
        this.sagittalImageLayer;
        this.sagittalDoseLayer;
        this.sagittalRoiLayer;
        this.sagittalLineLayer;

        this.dvhLoader;

        this.defaultColor = [0, 0, 255];

        this.displayDose = false;

        this.windowLevelMax = 4096;
        this.windowLevelUpper = 2458;    //percentage
        this.windowLevelLower = 0;

        this.doseLevelUpper = 0;
        this.doseLevelLower = 0;

        this.doseUpperInput;
        this.doseLowerInput;
        this.doseColorBar;

        this.dicomFiles;
        this.selectedStudy;
        this.selectedImage;
        this.selectedStructure;
        this.selectedDose;

        this.rtRoiList;
        this.rtPoiList;
        this.doseCheckBox;
        this.doseLabel;
    }

    init(){
        this.dicomFiles = [];
        this.selectedStudy = -1;
        this.selectedImage = -1;
        this.selectedStructure = -1;
        this.selectedDose = -1;

    }

    resetDisplay(){
        //set canvases
        // axial image loader
        this.axialImgLoader = document.getElementById("axialImageLoader");
        let aCanvas = document.getElementById("axialCanvas");
        if(aCanvas){
            aCanvas.parentNode.removeChild(aCanvas);
        }
        this.axialCanvas = document.createElement('canvas');
        this.axialCanvas.id = "axialCanvas";
        this.axialCanvas.width = 380;
        this.axialCanvas.height = 380;
        this.axialImgLoader.appendChild(this.axialCanvas);

        // coronal image loader
        this.coronalImgLoader = document.getElementById("coronalImageLoader");
        let cCanvas = document.getElementById("coronalCanvas");
        if(cCanvas){
            cCanvas.parentNode.removeChild(cCanvas);
        }
        this.coronalCanvas = document.createElement('canvas');
        this.coronalCanvas.id = "coronalCanvas";
        this.coronalCanvas.width = 380;
        this.coronalCanvas.height = 380;
        this.coronalImgLoader.appendChild(this.coronalCanvas);

        // sagittal image loader
        this.sagittalImgLoader = document.getElementById("sagittalImageLoader");
        let sCanvas = document.getElementById("sagittalCanvas");
        if(sCanvas){
            sCanvas.parentNode.removeChild(sCanvas);
        }
        this.sagittalCanvas = document.createElement('canvas');
        this.sagittalCanvas.id = "sagittalCanvas";
        this.sagittalCanvas.width = 380;
        this.sagittalCanvas.height = 380;
        this.sagittalImgLoader.appendChild(this.sagittalCanvas);

        //set papers
        this.axialPaper = new paper.PaperScope();
        this.coronalPaper = new paper.PaperScope();
        this.sagittalPaper = new paper.PaperScope();

        this.axialPaper.setup('axialCanvas');
        this.coronalPaper.setup('coronalCanvas');
        this.sagittalPaper.setup('sagittalCanvas');

        let self = this;
        self.axialCanvas.addEventListener("mousewheel",function(event){
            if (event.deltaY < 0) {

                let deltaSlice = parseInt(event.deltaY/100/self.axialPaper.view.getPixelRatio());

                if(self.crntAxialImgNmb>=0 && self.crntAxialImgNmb<=self.rtImage.z_dim-1){
                    if(self.crntAxialImgNmb + deltaSlice <= 0){
                        self.crntAxialImgNmb = 0;
                    }else{
                        self.crntAxialImgNmb += deltaSlice;
                    }
                    self.updateAxialImage();
                }
            }
            if (event.deltaY > 0) {

                let deltaSlice = parseInt(event.deltaY/100/self.axialPaper.view.getPixelRatio());

                if(self.crntAxialImgNmb>=0 && self.crntAxialImgNmb<=self.rtImage.z_dim-1){
                    if(self.crntAxialImgNmb + deltaSlice >=  self.rtImage.imageSlices.length-1){
                        self.crntAxialImgNmb = self.rtImage.imageSlices.length-1;
                    }else{
                        self.crntAxialImgNmb += deltaSlice;
                    }
                    self.updateAxialImage();
                }
            }
        });
        self.axialCanvas.addEventListener("click",function(event){

            let imageWidth = self.axialPaper.view.size.width * self.rtImage.x_size/self.rtImage.max_size;
            let imageHeight = self.axialPaper.view.size.height * self.rtImage.y_size/self.rtImage.max_size;

            let offsetX = (self.axialPaper.view.size.width-imageWidth)/2;
            let offsetY = (self.axialPaper.view.size.height-imageHeight)/2;

            let x_clickPosition = event.offsetX;

            let x_clickImagePosition = (x_clickPosition - offsetX);
            if(x_clickImagePosition<0){
                x_clickImagePosition = 0;
            }
            let xImgNum = Math.floor(x_clickImagePosition/imageWidth*self.rtImage.x_dim);
            if(xImgNum<0){
                xImgNum = 0;
            }else if(xImgNum>self.rtImage.x_dim){
                xImgNum = self.rtImage.x_dim-1;
            }
            self.crntSagittalImgNmb = xImgNum;

            let y_clickPosition = event.offsetY;
            let y_clickImagePosition = (y_clickPosition - offsetY);
            if(y_clickImagePosition<0){
                y_clickImagePosition = 0;
            }
            let yImgNum = Math.floor(y_clickImagePosition/imageHeight*self.rtImage.y_dim);
            if(yImgNum<0){
                yImgNum = 0;
            }else if(yImgNum>self.rtImage.y_dim){
                yImgNum = self.rtImage.y_dim-1;
            }
            self.crntCoronalImgNmb = yImgNum;

            self.updateCoronalImage();
            self.updateSagittalImage();

        });

        self.coronalCanvas.addEventListener("mousewheel",function(event){
            if (event.deltaY < 0) {

                let deltaSlice = parseInt(-1*event.deltaY/100/self.coronalPaper.view.getPixelRatio());

                if(self.crntCoronalImgNmb>=0 && self.crntCoronalImgNmb<self.rtImage.y_dim-1){
                    if(self.crntCoronalImgNmb + deltaSlice >=  self.rtImage.y_dim-1){
                        deltaSlice = 1;
                    }
                    self.crntCoronalImgNmb += deltaSlice;
                    self.updateCoronalImage();
                }

            }
            if (event.deltaY > 0) {

                let deltaSlice = parseInt(event.deltaY/100/self.coronalPaper.view.getPixelRatio());

                if(self.crntCoronalImgNmb>0){
                    if(self.crntCoronalImgNmb - deltaSlice < 0){
                        deltaSlice = 1;
                    }
                    self.crntCoronalImgNmb -= deltaSlice;
                    self.updateCoronalImage();
                }
            }
        });
        self.coronalCanvas.addEventListener("click",function(event){

            let imageWidth = self.coronalPaper.view.size.width * self.rtImage.x_size/self.rtImage.max_size;
            let imageHeight = self.coronalPaper.view.size.height * self.rtImage.z_size/self.rtImage.max_size;

            let offsetX = (self.coronalPaper.view.size.width-imageWidth)/2;
            let offsetY = (self.coronalPaper.view.size.height-imageHeight)/2;

            let x_clickPosition = event.offsetX;

            let x_clickImagePosition = (x_clickPosition - offsetX);
            if(x_clickImagePosition<0){
                x_clickImagePosition = 0;
            }
            let xImgNum = Math.floor(x_clickImagePosition/imageWidth*self.rtImage.x_dim);
            if(xImgNum<0){
                xImgNum = 0;
            }else if(xImgNum>self.rtImage.x_dim){
                xImgNum = self.rtImage.x_dim-1;
            }
            self.crntSagittalImgNmb = xImgNum;

            let y_clickPosition = event.offsetY;
            let y_clickImagePosition = (y_clickPosition - offsetY);
            if(y_clickImagePosition<0){
                y_clickImagePosition = 0;
            }

            let zImgNum = Math.floor(y_clickImagePosition/imageHeight*self.rtImage.z_dim);

            if(zImgNum<0){
                zImgNum = 0;
            }else if(zImgNum>self.rtImage.z_dim){
                zImgNum = self.rtImage.z_dim-1;
            }

            self.crntAxialImgNmb = zImgNum;

            self.updateSagittalImage();
            self.updateAxialImage();

        });

        self.sagittalCanvas.addEventListener("mousewheel",function(event){
            if (event.deltaY < 0) {

                let deltaSlice = parseInt(-1*event.deltaY/100/self.sagittalPaper.view.getPixelRatio());

                if(self.crntSagittalImgNmb>=0 && self.crntSagittalImgNmb<self.rtImage.x_dim-1){
                    if(self.crntSagittalImgNmb + deltaSlice >=  self.rtImage.x_dim-1){
                        deltaSlice = 1;
                    }
                    self.crntSagittalImgNmb += deltaSlice;
                    self.updateSagittalImage();
                }

            }
            if (event.deltaY > 0) {

                let deltaSlice = parseInt(event.deltaY/100/self.sagittalPaper.view.getPixelRatio());

                if(self.crntSagittalImgNmb>0){
                    if(self.crntSagittalImgNmb - deltaSlice < 0){
                        deltaSlice = 1;
                    }
                    self.crntSagittalImgNmb -= deltaSlice;
                    self.updateSagittalImage();
                }
            }
        });
        self.sagittalCanvas.addEventListener("click",function(event){

            let imageWidth = self.sagittalPaper.view.size.width * self.rtImage.y_size/self.rtImage.max_size;
            let imageHeight = self.sagittalPaper.view.size.height * self.rtImage.z_size/self.rtImage.max_size;

            let offsetX = (self.sagittalPaper.view.size.width-imageWidth)/2;
            let offsetY = (self.sagittalPaper.view.size.height-imageHeight)/2;

            let x_clickPosition = event.offsetX;

            let x_clickImagePosition = (x_clickPosition - offsetX);
            if(x_clickImagePosition<0){
                x_clickImagePosition = 0;
            }
            let xImgNum = Math.floor(x_clickImagePosition/imageWidth*self.rtImage.y_dim);
            if(xImgNum<0){
                xImgNum = 0;
            }else if(xImgNum>self.rtImage.y_dim){
                xImgNum = self.rtImage.y_dim-1;
            }
            self.crntCoronalImgNmb = xImgNum;

            let y_clickPosition = event.offsetY;
            let y_clickImagePosition = (y_clickPosition - offsetY);
            if(y_clickImagePosition<0){
                y_clickImagePosition = 0;
            }

            let zImgNum = Math.floor(y_clickImagePosition/imageHeight*self.rtImage.z_dim);

            if(zImgNum<0){
                zImgNum = 0;
            }else if(zImgNum>self.rtImage.z_dim){
                zImgNum = self.rtImage.z_dim-1;
            }

            self.crntAxialImgNmb = zImgNum;

            self.updateCoronalImage();
            self.updateAxialImage();

        });

        //set layers
        this.axialPaper.activate();
        this.axialImageLayer = new this.axialPaper.Layer();
        this.axialDoseLayer = new this.axialPaper.Layer();
        this.axialRoiLayer = new this.axialPaper.Layer();
        this.axialLineLayer = new this.axialPaper.Layer();

        this.coronalPaper.activate();
        this.coronalImageLayer = new this.coronalPaper.Layer();
        this.coronalDoseLayer = new this.coronalPaper.Layer();
        this.coronalRoiLayer = new this.coronalPaper.Layer();
        this.coronalLineLayer = new this.coronalPaper.Layer();

        this.sagittalPaper.activate();
        this.sagittalImageLayer = new this.sagittalPaper.Layer();
        this.sagittalDoseLayer = new this.sagittalPaper.Layer();
        this.sagittalRoiLayer = new this.sagittalPaper.Layer();
        this.sagittalLineLayer = new this.sagittalPaper.Layer();

        //dvh
        this.dvhLoader = document.getElementById("dvh_plot_div");
        this.dvhLoader.innerHTML = "";

        //init image and dose
        this.rsDicom = '';
        this.ctDicoms = [];
        this.rdDicom = '';
        this.rsJson = null;
        this.dvhJson = null;

        this.rtImage = new RTImage();

        this.rtDose = new RTDose();

        this.crntAxialImgNmb = 0;
        this.crntCoronalImgNmb = 0;
        this.crntSagittalImgNmb = 0;

        this.displayRois = [];
        this.displayPois = [];

        this.windowLevelMax = 4096;
        this.windowLevelUpper = 2458;    //percentage
        this.windowLevelLower = 0;

        this.doseLevelUpper = 0;
        this.doseLevelLower = 0;

        //init controller
        this.doseUpperInput = document.getElementById("dose-upper");
        this.doseLowerInput = document.getElementById("dose-lower");
        this.doseColorBar = document.getElementById("dose-colorbar");

        this.doseUpperInput.style.visibility = "hidden";
        this.doseLowerInput.style.visibility = "hidden";
        this.doseColorBar.style.visibility = "hidden";

        this.doseUpperInput.addEventListener("change", function(event){
            let doseLevelInput = event.target.value;
            if (!isNaN(doseLevelInput)){
                g_rt_display.doseLevelUpper = parseInt(doseLevelInput, 10);

                g_rt_display.updateAxialDose();
                g_rt_display.updateCoronalDose();
                g_rt_display.updateSagittalDose();
            } else{
                alert("dose level is not an integer");
            }
        });     //add event listener
        this.doseLowerInput.addEventListener("change", function(event){
            let doseLevelInput = event.target.value;
            if (!isNaN(doseLevelInput)){
                g_rt_display.doseLevelLower = parseInt(doseLevelInput, 10);

                g_rt_display.updateAxialDose();
                g_rt_display.updateCoronalDose();
                g_rt_display.updateSagittalDose();
            } else{
                alert("dose level is not an integer");
            }
        });

        this.rtRoiList = document.getElementById("rt-roi-list");
        this.rtPoiList = document.getElementById("rt-poi-list");
        this.doseCheckBox = document.getElementById("dose_check_box");
        this.doseLabel = document.getElementById("dose_label");

        this.rtRoiList.innerHTML = "";
        this.rtPoiList.innerHTML = "";
        this.doseCheckBox.style.visibility = "hidden";
        this.doseLabel.style.visibility = "hidden";
    }

    async getImage(folder, filenames){

        let urls = []
        for(let i=0;i<filenames.length;i++){
            urls[i]=folder+filenames[i]
        }

        let list = [];
        let results = [];

        let ilss = document.getElementsByClassName("image-loader-sign");
        for(let i=0; i<ilss.length; i++){
            ilss[i].style.visibility = "visible";
        }
        document.getElementById("window-level-slider").style.visibility = "hidden";

        let self = this

        for(let i=0; i< urls.length; i++){
            const result = await fetch(urls[i]);
            const data = await result.arrayBuffer();
            let dicomParser = new dwv.dicom.DicomParser();
            dicomParser.parse(data);
            self.ctDicoms[i] = dicomParser;
            list.push(data);
        }

        //sort image order
        let n = self.ctDicoms.length;

        for(let j = 0; j < n - 1; j++){
            let iMin = j;
            for(let i = j+1; i < n; i++){

                if(parseFloat(self.ctDicoms[i].getRawDicomElements().x00200032.value[2]) > parseFloat(self.ctDicoms[iMin].getRawDicomElements().x00200032.value[2])){
                    iMin = i;
                }
            }

            let temp = self.ctDicoms[iMin];
            self.ctDicoms[iMin] = self.ctDicoms[j];
            self.ctDicoms[j] = temp;
        }

        Promise
          .all(list)
          .then(function() {
            for(let i=0; i<self.ctDicoms.length; i++){
                let rawTags = self.ctDicoms[i].getRawDicomElements();
                let pixelBuffer = rawTags.x7FE00010.value;
                // create the image
                let imageFactory = new dwv.image.ImageFactory();
                let image = imageFactory.create(
                    self.ctDicoms[i].getDicomElements(),
                    pixelBuffer );

                self.rtImage.imageSlices[i] = image;
            }

            let sliceNum = self.rtImage.imageSlices.length;

            let imageSlice = self.rtImage.imageSlices[sliceNum-1];

            self.rtImage.x_start =imageSlice.getGeometry().getOrigin().getX();
            self.rtImage.y_start = imageSlice.getGeometry().getOrigin().getY();
            self.rtImage.z_start = imageSlice.getGeometry().getOrigin().getZ();

            self.rtImage.x_dim = imageSlice.getGeometry().getSize().getNumberOfColumns();
            self.rtImage.y_dim = imageSlice.getGeometry().getSize().getNumberOfRows();
            self.rtImage.z_dim = self.rtImage.imageSlices.length;

            self.rtImage.x_pixdim = imageSlice.getGeometry().getSpacing().getColumnSpacing();
            self.rtImage.y_pixdim = imageSlice.getGeometry().getSpacing().getRowSpacing();
            let z_spacing = 1;
            if(self.rtImage.imageSlices.length>1){
                z_spacing = Math.abs(self.rtImage.imageSlices[sliceNum-1].getGeometry().getOrigin().getZ()-self.rtImage.imageSlices[sliceNum-2].getGeometry().getOrigin().getZ());
            }
            self.rtImage.z_pixdim = z_spacing;

            self.rtImage.Xx_ornt = imageSlice.getGeometry().getOrientation().get(0,0);
            self.rtImage.Xy_ornt = imageSlice.getGeometry().getOrientation().get(0,1);
            self.rtImage.Xz_ornt = imageSlice.getGeometry().getOrientation().get(0,2);
            self.rtImage.Yx_ornt = imageSlice.getGeometry().getOrientation().get(1,0);
            self.rtImage.Yy_ornt = imageSlice.getGeometry().getOrientation().get(1,1);
            self.rtImage.Yz_ornt = imageSlice.getGeometry().getOrientation().get(1,2);
            self.rtImage.Zx_ornt = imageSlice.getGeometry().getOrientation().get(2,0);
            self.rtImage.Zy_ornt = imageSlice.getGeometry().getOrientation().get(2,1);
            self.rtImage.Zz_ornt = imageSlice.getGeometry().getOrientation().get(2,2);

            self.rtImage.calculateSizeAndNormDim();

            self.crntAxialImgNmb = Math.floor(self.rtImage.z_dim/2);
            self.crntCoronalImgNmb = Math.floor(self.rtImage.y_dim/2);
            self.crntSagittalImgNmb = Math.floor(self.rtImage.x_dim/2);

            let ilss = document.getElementsByClassName("image-loader-sign");
            for(let i=0; i<ilss.length; i++){
                ilss[i].style.visibility = "hidden";
            }
            self.showCT();

            let windowLevelSlider = document.getElementById("window-level-slider");
            windowLevelSlider.style.visibility = "visible";

            console.log('all cts loaded!'); // (5)
          });
    }

    showCT(){

        this.axialPaper.activate();
        this.updateAxialImage()

        this.coronalPaper.activate();
        this.updateCoronalImage();

        this.sagittalPaper.activate();
        this.updateSagittalImage();

        this.axialPaper.view.draw();
        this.coronalPaper.view.draw();
        this.sagittalPaper.view.draw();

    }

    async getRS(folder, file){

        const rs_file = folder + file

        try {
            this.rtRoiList.innerHTML = "";
            this.rtPoiList.innerHTML = "";
            let rlss = document.getElementsByClassName("roi-loader-sign");
            for(let i=0; i<rlss.length; i++){
                rlss[i].style.visibility = "visible";
            }
            this.displayRois = [];
            this.displayPois = [];
            this.axialPaper.activate();
            this.axialRoiLayer.activate();
            this.axialRoiLayer.removeChildren();

            this.coronalPaper.activate();
            this.coronalRoiLayer.activate();
            this.coronalRoiLayer.removeChildren();

            this.sagittalPaper.activate();
            this.sagittalRoiLayer.activate();
            this.sagittalRoiLayer.removeChildren();

            let json_rs_file = rs_file.replace(/dcm/g, "json");

            const result = await fetch(rs_file);
            const data = await result.arrayBuffer();

            try{
                const json_result = await fetch(json_rs_file);

                if(!json_result.ok){
                    console.log("No json structure")
                }else{
                    const json_data = await json_result.text();
                    this.rsJson = JSON.parse(json_data)
                }
            }catch(err){
                console.log(err);
            }

            let dicomParser = new dwv.dicom.DicomParser();
            dicomParser.parse(data);
            this.rsDicom = dicomParser;

            for(let i=0; i<rlss.length; i++){
                rlss[i].style.visibility = "hidden";
            }
            this.showRSNames();

        } catch(error) {
            console.log(error);
        }
    }

    async getRD(folder, file){

        const rd_file = folder + file

        try {
            this.doseCheckBox.checked = false;
            this.doseCheckBox.style.visibility = "hidden";
            this.doseLabel.style.visibility = "hidden";
            let dlss = document.getElementsByClassName("dose-loader-sign");
            for(let i=0; i<dlss.length; i++){
                dlss[i].style.visibility = "visible";
            }
            this.doseUpperInput.style.visibility = "hidden";
            this.doseLowerInput.style.visibility = "hidden";
            this.doseColorBar.style.visibility = "hidden";
            this.axialPaper.activate();
            this.axialDoseLayer.activate();
            this.axialDoseLayer.removeChildren();

            this.coronalPaper.activate();
            this.coronalDoseLayer.activate();
            this.coronalDoseLayer.removeChildren();

            this.sagittalPaper.activate();
            this.sagittalDoseLayer.activate();
            this.sagittalDoseLayer.removeChildren();

            const result = await fetch(rd_file);
            const data = await result.arrayBuffer();

            let dicomParser = new dwv.dicom.DicomParser();
            dicomParser.parse(data);
            this.rdDicom = dicomParser;

            let rawData = g_rt_display.rdDicom.getRawDicomElements();
            this.rtDose.x_start = parseFloat(rawData.x00200032.value[0]);
            this.rtDose.y_start = parseFloat(rawData.x00200032.value[1]);
            this.rtDose.z_start = parseFloat(rawData.x00200032.value[2]);

            this.rtDose.x_dim = parseInt(rawData.x00280011.value[0]);
            this.rtDose.y_dim = parseInt(rawData.x00280010.value[0]);
            this.rtDose.z_dim = parseInt(rawData.x00280008.value[0]);

            this.rtDose.x_pixdim = parseFloat(rawData.x00280030.value[1]);
            this.rtDose.y_pixdim = parseFloat(rawData.x00280030.value[0]);
            this.rtDose.z_pixdim = parseFloat(rawData.x00180050.value[0]);

            //this.rtDose.Xx_ornt = imageSlice.getGeometry().getOrientation().get(0,0)
            //this.rtDose.Xy_ornt = imageSlice.getGeometry().getOrientation().get(0,1)
            //this.rtDose.Xz_ornt = imageSlice.getGeometry().getOrientation().get(0,2)
            //this.rtDose.Yx_ornt = imageSlice.getGeometry().getOrientation().get(1,0)
            //this.rtDose.Yy_ornt = imageSlice.getGeometry().getOrientation().get(1,1)
            //this.rtDose.Yz_ornt = imageSlice.getGeometry().getOrientation().get(1,2)
            //this.rtDose.Zx_ornt = imageSlice.getGeometry().getOrientation().get(2,0)
            //this.rtDose.Zy_ornt = imageSlice.getGeometry().getOrientation().get(2,1)
            //this.rtDose.Zz_ornt = imageSlice.getGeometry().getOrientation().get(2,2)

            this.rtDose.calculateSizeAndNormDim();

            let doseGridScaling = parseFloat(rawData.x3004000E.value);

            for(let i=0; i<rawData.x7FE00010.value.length;i++){
                let doseLine = [];
                for(let j=0; j<rawData.x7FE00010.value[i].length; j++){
                    doseLine[j] = (rawData.x7FE00010.value[i][j]* doseGridScaling * 100).toFixed(0);
                }
                this.rtDose.doseData.push(doseLine);
            }

            this.rtDose.calculateMaxDose();

            this.doseLevelUpper = this.rtDose.maxDose;
            this.doseLevelLower = 0;
            this.doseUpperInput.value = this.doseLevelUpper;
            this.doseLowerInput.value = this.doseLevelLower;

            for(let i=0; i<dlss.length; i++){
                dlss[i].style.visibility = "hidden";
            }
            this.doseCheckBox.style.visibility = "visible";
            this.doseLabel.style.visibility = "visible";


        } catch(error) {
            console.log(error);
        }
    }

    async getDVH(file){
        try{
            const json_result = await fetch(file);

            if(!json_result.ok){
                console.log("No json dvh")
            }else{
                const json_data = await json_result.text();
                this.dvhJson = JSON.parse(json_data)
            }
            this.updateDVH();
        }catch(err){
            console.log(err);
        }
    }

    showRSNames(){
        let rawTags = this.rsDicom.getRawDicomElements();

        let output_roi = ''
        let output_poi = ''

        let structureSetRoiSequence = rawTags.x30060020.value;
        let roiContourSequence = rawTags.x30060039.value;


        for(let i=0; i<structureSetRoiSequence.length; i++){
            let roiName = structureSetRoiSequence[i].x30060026.value;
            let roiType = this.findContourType(roiContourSequence[i]);
            if(roiType == 'POINT'){
                output_poi +=  '<input class="poi_check_box" id=poi_check_' + i + ' value= ' + i + ' type="checkbox">'+
                       '<label for=poi_check_"'+i+'">' +
                        roiName +
                        '</label><br>'
            }else{
                output_roi +=  '<input class="roi_check_box" id=roi_check_' + i + ' value= ' + i + ' type="checkbox">'+
                       '<label for=roi_check_"'+i+'">' +
                        roiName +
                        '</label><br>'
            }
        }

        this.rtRoiList.innerHTML = output_roi;
        this.rtPoiList.innerHTML = output_poi;
    }

    displayRS(index){
        if(this.displayRois.indexOf(index) == -1){
            this.displayRois.push(index);
            this.updateAxialROIandPOI();
            this.updateCoronalROIandPOI();
            this.updateSagittalROIandPOI();

            this.updateDVH();
        }
    }

    unDisplayRS(index){
        let a = this.displayRois.indexOf(index);
        if(a>=0){
            this.displayRois.splice(a, 1);
            this.updateAxialROIandPOI();
            this.updateCoronalROIandPOI();
            this.updateSagittalROIandPOI();

            this.updateDVH();

        }
    }

    displayRSAll(){
        let rawTags = this.rsDicom.getRawDicomElements();

        let output_roi = ''
        let output_poi = ''

        let structureSetRoiSequence = rawTags.x30060020.value;
        let roiContourSequence = rawTags.x30060039.value;

        this.displayRois.length = 0;
        for(let i=0; i<structureSetRoiSequence.length; i++){
            let roiName = structureSetRoiSequence[i].x30060026.value;
            let roiType = this.findContourType(roiContourSequence[i]);
            if(roiType == 'POINT'){

            }else{
                this.displayRois.push(i);
            }
        }

        this.updateAxialROIandPOI();
        this.updateCoronalROIandPOI();
        this.updateSagittalROIandPOI();

        this.updateDVH();

    }

    unDisplayRSAll(){
        this.displayRois.length = 0;
        this.updateAxialROIandPOI();
        this.updateCoronalROIandPOI();
        this.updateSagittalROIandPOI();
        this.updateDVH();

    }

    displayPoint(index){
        if(this.displayPois.indexOf(index) == -1){
            this.displayPois.push(index);
            this.updateAxialROIandPOI();
            this.updateCoronalROIandPOI();
            this.updateSagittalROIandPOI();

        }
    }

    unDisplayPoint(index){
        let a = this.displayPois.indexOf(index);
        if(a>=0){
            this.displayPois.splice(a, 1);
            this.updateAxialROIandPOI();
            this.updateCoronalROIandPOI();
            this.updateSagittalROIandPOI();
        }
    }

    findContourType(roiContour){

        let type = [""];
        if(roiContour.x30060040){
            let contourSequence = roiContour.x30060040.value;
            if(contourSequence.length>0){
                let contour = contourSequence[0];
                if(contour.x30060042){
                    type = contour.x30060042.value;
                }
            }
        }
        return type[0].trim();
    }

    findAxialContour(contourSequence, crntAxialImgNmb){

        let contours = [];

        let imgUID = this.ctDicoms[crntAxialImgNmb].getRawDicomElements().x00080018.value;
        for(let i=0; i<contourSequence.length; i++){
            let contour = contourSequence[i];
            let contourData = contour.x30060050.value;
            let contourImageSequence = contour.x30060016.value;

            if(contourImageSequence.length==1){
                if(contourImageSequence[0].x00081155.value[0] == imgUID){
                    contours.push(contourData);
                }
            }
            if(contourImageSequence.length>1){
                console.log(contourImageSequence.length);
            }
        }

        return contours;
    }

    findCoronalContour(contourSequence, crntCoronalPosition){
        let contours = [];
        let points = [];
        for(let z=0; z<contourSequence.length; z++){
            let contour = contourSequence[z];
            let contourData = contour.x30060050.value;
            if(contourData.length>=3){
                for(let i=0; i< contourData.length; i+=3){
                    let y = contourData[1+i];
                    if(Math.abs(crntCoronalPosition-y)<0.5){
                        points.push(contourData[i]);
                        points.push(contourData[i+1]);
                        points.push(contourData[i+2]);
                    }
                }
            }
        }
        contours.push(points)

        return contours;
    }

    findSagittalContour(contourSequence, crntSagittalPosition){
        let contours = [];
        let points = [];
        for(let z=0; z<contourSequence.length; z++){
            let contour = contourSequence[z];
            let contourData = contour.x30060050.value;
            if(contourData.length>=3){
                for(let i=0; i< contourData.length; i+=3){
                    let x = contourData[i];
                    if(Math.abs(crntSagittalPosition-x)<0.5){
                        points.push(contourData[i]);
                        points.push(contourData[i+1]);
                        points.push(contourData[i+2]);
                    }
                }
            }
        }
        contours.push(points)

        return contours;
    }

    displayDoseColorwash(display){
        if(display){
            this.displayDose = true;

            this.doseUpperInput.style.visibility = "visible";
            this.doseLowerInput.style.visibility = "visible";
            this.doseColorBar.style.visibility = "visible";

            this.updateAxialDose();
            this.updateCoronalDose();
            this.updateSagittalDose();

        }else{
            this.displayDose = false;

            this.doseUpperInput.style.visibility = "hidden";
            this.doseLowerInput.style.visibility = "hidden";
            this.doseColorBar.style.visibility = "hidden";

            this.axialPaper.activate();
            this.axialDoseLayer.activate();
            this.axialDoseLayer.removeChildren();

            this.coronalPaper.activate();
            this.coronalDoseLayer.activate();
            this.coronalDoseLayer.removeChildren();

            this.sagittalPaper.activate();
            this.sagittalDoseLayer.activate();
            this.sagittalDoseLayer.removeChildren();
        }
    }

    adjustWindowLevel(lower, upper){
        this.windowLevelUpper = this.windowLevelMax*upper/100;
        this.windowLevelLower = this.windowLevelMax*lower/100;

        this.updateAxialImage();
        this.updateCoronalImage();
        this.updateSagittalImage();

    }

    updateAxialImage(){
        let imageSlice_axial = this.rtImage.getAxialSlice(this.crntAxialImgNmb);
        this.axialPaper.activate();
        this.axialImageLayer.activate();
        this.axialImageLayer.removeChildren();

        let imageOriginPoint = new this.axialPaper.Point(0, 0);
        let imageOriginSize = new this.axialPaper.Size(this.rtImage.x_dim, this.rtImage.y_dim);
        //update image layer
        var rect = new this.axialPaper.Shape.Rectangle(imageOriginPoint, imageOriginSize);
        var raster = rect.rasterize();

        rect.remove();
        let imageData = raster.createImageData(imageOriginSize);

        for(let i = 0; i < imageSlice_axial.imageSlice.length; i++) {
            if(imageSlice_axial.imageSlice[i]>this.windowLevelUpper){
                imageData.data[4*i] = 255;
                imageData.data[4*i+1] = 255;
                imageData.data[4*i+2] = 255;
                imageData.data[4*i+3] = 255;
            }else if(imageSlice_axial.imageSlice[i]<this.windowLevelLower){
                imageData.data[4*i] = 0;
                imageData.data[4*i+1] = 0;
                imageData.data[4*i+2] = 0;
                imageData.data[4*i+3] = 255;
            }else{
                let value = (imageSlice_axial.imageSlice[i] - this.windowLevelLower)/(this.windowLevelUpper - this.windowLevelLower);
                imageData.data[4*i] = value*255;
                imageData.data[4*i+1] = value*255;
                imageData.data[4*i+2] = value*255;
                imageData.data[4*i+3] = 255;
            }
        }

        raster.setImageData(imageData, imageOriginPoint);

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.width* this.axialPaper.view.getPixelRatio();
        let scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.height* this.axialPaper.view.getPixelRatio();
        raster.scale(scale_x, scale_y, imageOriginPoint);

        //move image to the view center
        // start point is (0,0)
        // (view size - image display size)/2
        raster.position.x += (this.axialPaper.view.size.width* this.axialPaper.view.getPixelRatio()-this.rtImage.x_dim*scale_x)/this.coronalPaper.view.getPixelRatio()/2;
        raster.position.y += (this.axialPaper.view.size.height* this.axialPaper.view.getPixelRatio()-this.rtImage.y_dim*scale_y)/this.coronalPaper.view.getPixelRatio()/2;

        //add text
        let text = new this.axialPaper.PointText(new this.axialPaper.Point(10, 370));
        text.fillColor = new this.axialPaper.Color(0.5);
        text.content = 'Z: ' + (this.rtImage.z_start + (this.rtImage.z_dim - this.crntAxialImgNmb)*this.rtImage.z_pixdim).toFixed(1) + ' mm';

        //update dose layer
        if(this.displayDose && this.rdDicom !=''){
            this.updateAxialDose();
        }

        //update structure layer
        if(this.rsDicom !=''){
            this.updateAxialROIandPOI();
        }

        //update dotted line
        this.updateDottedLines();
    }

    updateCoronalImage(){
        let imageSlice_coronal = this.rtImage.getCoronalSlice(this.crntCoronalImgNmb);
        this.coronalPaper.activate();
        this.coronalImageLayer.activate();
        this.coronalImageLayer.removeChildren();

        let imageOriginPoint = new this.coronalPaper.Point(0, 0);
        let imageOriginSize = new this.coronalPaper.Size(this.rtImage.x_dim, this.rtImage.z_dim);

        //update image layer
        let rect = new this.coronalPaper.Shape.Rectangle(imageOriginPoint, imageOriginSize);

        let raster = rect.rasterize();
        rect.remove();

        let imageData = raster.createImageData(imageOriginSize);

        for(let i = 0; i < imageSlice_coronal.imageSlice.length; i++) {
             if(imageSlice_coronal.imageSlice[i]>this.windowLevelUpper){
                imageData.data[4*i] = 255;
                imageData.data[4*i+1] = 255;
                imageData.data[4*i+2] = 255;
                imageData.data[4*i+3] = 255;
            }else if(imageSlice_coronal.imageSlice[i]<this.windowLevelLower){
                imageData.data[4*i] = 0;
                imageData.data[4*i+1] = 0;
                imageData.data[4*i+2] = 0;
                imageData.data[4*i+3] = 255;
            }else{
                let value = (imageSlice_coronal.imageSlice[i] - this.windowLevelLower)/(this.windowLevelUpper - this.windowLevelLower);
                imageData.data[4*i] = value*255;
                imageData.data[4*i+1] = value*255;
                imageData.data[4*i+2] = value*255;
                imageData.data[4*i+3] = 255;
            }
        }
        raster.setImageData(imageData, imageOriginPoint);

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.width * this.coronalPaper.view.getPixelRatio();
        let scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.height * this.coronalPaper.view.getPixelRatio();
        raster.scale(scale_x, scale_z, imageOriginPoint);

        //move image to the view center
        // start point is (0,0)
        // (view size - image display size)/2
        raster.position.x += (this.coronalPaper.view.size.width* this.coronalPaper.view.getPixelRatio()-this.rtImage.x_dim*scale_x)/this.coronalPaper.view.getPixelRatio()/2;
        raster.position.y += (this.coronalPaper.view.size.height* this.coronalPaper.view.getPixelRatio()-this.rtImage.z_dim*scale_z)/this.coronalPaper.view.getPixelRatio()/2;

        let text = new this.coronalPaper.PointText(new this.coronalPaper.Point(10, this.coronalPaper.view.size.height-10));
        text.fillColor = new this.coronalPaper.Color(0.5);
        text.content = 'Y: ' + (this.rtImage.y_start + this.crntCoronalImgNmb*this.rtImage.y_pixdim).toFixed(1) + ' mm';

        //update dose layer
        if(this.displayDose){
            this.updateCoronalDose();
        }

        //update structure layer
        if(this.rsDicom !=''){
            this.updateCoronalROIandPOI();
        }

        //update dotted line
        this.updateDottedLines();
    }

    updateSagittalImage(){
        let imageSlice_sagittal = this.rtImage.getSagittalSlice(this.crntSagittalImgNmb);
        this.sagittalPaper.activate();
        this.sagittalImageLayer.activate();
        this.sagittalImageLayer.removeChildren();

        let imageOriginPoint = new this.sagittalPaper.Point(0, 0);
        let imageOriginSize = new this.sagittalPaper.Size(this.rtImage.y_dim, this.rtImage.z_dim);
        //update image layer
        let rect = new this.sagittalPaper.Shape.Rectangle(imageOriginPoint, imageOriginSize);

        let raster = rect.rasterize();
        rect.remove();

        let imageData = raster.createImageData(imageOriginSize);

        for(let i = 0; i < imageSlice_sagittal.imageSlice.length; i++) {
            if(imageSlice_sagittal.imageSlice[i]>this.windowLevelUpper){
                imageData.data[4*i] = 255;
                imageData.data[4*i+1] = 255;
                imageData.data[4*i+2] = 255;
                imageData.data[4*i+3] = 255;
            }else if(imageSlice_sagittal.imageSlice[i]<this.windowLevelLower){
                imageData.data[4*i] = 0;
                imageData.data[4*i+1] = 0;
                imageData.data[4*i+2] = 0;
                imageData.data[4*i+3] = 255;
            }else{
                let value = (imageSlice_sagittal.imageSlice[i] - this.windowLevelLower)/(this.windowLevelUpper - this.windowLevelLower);
                imageData.data[4*i] = value*255;
                imageData.data[4*i+1] = value*255;
                imageData.data[4*i+2] = value*255;
                imageData.data[4*i+3] = 255;
            }
        }
        raster.setImageData(imageData, imageOriginPoint);

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.sagittalPaper.view.size.width * this.sagittalPaper.view.getPixelRatio();
        let scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.sagittalPaper.view.size.height * this.sagittalPaper.view.getPixelRatio();
        raster.scale(scale_y, scale_z, imageOriginPoint);

        //move image to the view center
        // start point is (0,0)
        // (view size - image display size)/2
        raster.position.x += (this.sagittalPaper.view.size.width* this.sagittalPaper.view.getPixelRatio()-this.rtImage.y_dim*scale_y)/this.coronalPaper.view.getPixelRatio()/2;
        raster.position.y += (this.sagittalPaper.view.size.height* this.sagittalPaper.view.getPixelRatio()-this.rtImage.z_dim*scale_z)/this.coronalPaper.view.getPixelRatio()/2;

        let text = new this.axialPaper.PointText(new this.axialPaper.Point(10, this.axialPaper.view.size.height-10));
        text.fillColor = new this.axialPaper.Color(0.5);
        text.content = 'X: ' + (this.rtImage.x_start + this.crntSagittalImgNmb*this.rtImage.x_pixdim).toFixed(1) + ' mm';

        //update dose layer
        if(this.displayDose){
            this.updateSagittalDose();
        }

        //update structure layer
        if(this.rsDicom !=''){
            this.updateSagittalROIandPOI();
        }

        //update dotted line
        this.updateDottedLines();
    }

    updateAxialROIandPOI(){
        this.axialPaper.activate();
        this.axialRoiLayer.activate();
        this.axialRoiLayer.removeChildren();

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.width;
        let scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.height;

        //move image to the view center
        // start point is (0,0)
        // (view size - image display size)/2
        let move_x = (this.axialPaper.view.size.width-this.rtImage.x_dim*scale_x)/2;
        let move_y = (this.axialPaper.view.size.height-this.rtImage.y_dim*scale_y)/2;

        let rawTags = this.rsDicom.getRawDicomElements();

        let structureSetRoiSequence = rawTags.x30060020.value;
        let roiContourSequence = rawTags.x30060039.value;

        for(let roi_index=0; roi_index<this.displayRois.length; roi_index++){
            let structureSetRoi = structureSetRoiSequence[this.displayRois[roi_index]];
            let roiContour = roiContourSequence[this.displayRois[roi_index]];

            let roiName = String(structureSetRoi.x30060026.value).trim();

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(roiContour.x30060040){
                let contourSequence = roiContour.x30060040.value;
                let refRoiNum = parseInt(roiContour.x30060084.value);

                let contours = this.findAxialContour(contourSequence, this.crntAxialImgNmb);

                if(contours.length>0){

                    for(let i=0; i<contours.length; i++){
                        let path = new this.axialPaper.Path();
                        path.strokeColor = new this.axialPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)
                        for(let p=0; p<contours[i].length-2; p+=3){

                            let point_x = (parseFloat(contours[i][p])-this.rtImage.x_start)/this.rtImage.x_pixdim*scale_x;
                            let point_y = (parseFloat(contours[i][p+1])-this.rtImage.y_start)/this.rtImage.y_pixdim*scale_y;

                            point_x += move_x;
                            point_y += move_y;

                            let point = new this.axialPaper.Point(point_x, point_y);

                            path.add(point);
                        }
                        path.closed = true;
                    }
                }
            }
        }
        for(let poi_index=0; poi_index<this.displayPois.length; poi_index++){
            let structureSetRoi = structureSetRoiSequence[this.displayPois[poi_index]];
            let roiContour = roiContourSequence[this.displayPois[poi_index]];

            let roiName = structureSetRoi.x30060026.value;

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(roiContour.x30060040){
                let contourSequence = roiContour.x30060040.value;
                let refRoiNum = parseInt(roiContour.x30060084.value);

                let contours = this.findAxialContour(contourSequence, this.crntAxialImgNmb);

                if(contours.length>0){

                    for(let i=0; i<contours.length; i++){

                        let point_x = (parseFloat(contours[i][0])-this.rtImage.x_start)/this.rtImage.x_pixdim*scale_x;
                        let point_y = (parseFloat(contours[i][1])-this.rtImage.y_start)/this.rtImage.y_pixdim*scale_y;

                        point_x += move_x;
                        point_y += move_y;

                        let point = new this.axialPaper.Point(point_x, point_y);

                        let circle = new this.axialPaper.Path.Circle(point, 1);
                        circle.fillColor = new this.axialPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)

                        let textPoint = new this.axialPaper.Point(point_x-10, point_y+10);
                        let text = new this.axialPaper.PointText(textPoint);
                        text.justification = circle.fillColor;
                        text.fillColor = circle.fillColor;
                        text.content = roiName;
                        text.fontSize = 10;

                    }
                }
            }
        }
    }

    updateCoronalROIandPOI(){
        this.coronalPaper.activate();
        this.coronalRoiLayer.activate();
        this.coronalRoiLayer.removeChildren();

        let crntCoronalPosition = this.rtImage.y_start + this.rtImage.y_pixdim* this.crntCoronalImgNmb;
        let rawTags = this.rsDicom.getRawDicomElements();

        let structureSetRoiSequence = rawTags.x30060020.value;
        let roiContourSequence = rawTags.x30060039.value;

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.coronalPaper.view.size.width;
        let scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.coronalPaper.view.size.height;

        //move image to the view center
        // start point is (0,0) z need to flip
        // (view size - image display size)/2 + image display size = (view size + image display size)/2
        let move_x = (this.coronalPaper.view.size.width - this.rtImage.x_dim*scale_x)/2;
        let move_z = (this.coronalPaper.view.size.height + this.rtImage.z_dim*scale_z)/2;


        for(let roi_index=0; roi_index<this.displayRois.length; roi_index++){

            let structureSetRoi = structureSetRoiSequence[this.displayRois[roi_index]];
            let roiContour = roiContourSequence[this.displayRois[roi_index]];

            let roiName = String(structureSetRoi.x30060026.value).trim();

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(this.rsJson !== null){
                if(this.rsJson.hasOwnProperty(roiName)){
                    let contours = this.rsJson[roiName]["coronal"][this.crntCoronalImgNmb];
                    for(let i =0; i<contours.length; i++){
                        let path = new this.coronalPaper.Path();
                        path.strokeColor = new this.coronalPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)
                        let contour = contours[i];
                        for(let p=0; p<contour.length; p++){

                            let point_x = parseFloat(contour[p][0])*scale_x;
                            let point_z = -parseFloat(contour[p][1])*scale_z;

                            point_x += move_x;
                            point_z += move_z;

                            let point = new this.coronalPaper.Point(point_x, point_z);

                            path.add(point);
                        }
                        path.closed = true;
                    }
                }
            }else{
                if(roiContour.x30060040){
                    let contourSequence = roiContour.x30060040.value;
                    let refRoiNum = parseInt(roiContour.x30060084.value);

                    let contours = this.findCoronalContour(contourSequence, crntCoronalPosition);

                    if(contours.length>0){

                        for(let i=0; i<contours.length; i++){
                            //let path = new this.coronalPaper.Path();
                            //path.strokeColor = new this.coronalPaper.Color(displayColor[0]/255,
                            //                                            displayColor[1]/255,
                            //                                            displayColor[2]/255,)
                            for(let p=0; p<contours[i].length-2; p+=3){

                                let point_x = (parseFloat(contours[i][p])-this.rtImage.x_start)/this.rtImage.x_pixdim*scale_x;
                                let point_z = -(parseFloat(contours[i][p+2])-this.rtImage.z_start)/this.rtImage.z_pixdim*scale_z;

                                point_x += move_x;
                                point_z += move_z;

                                //console.log(point_x + " " + point_z)

                                let point = new this.coronalPaper.Point(point_x, point_z);

                                let circle = new this.coronalPaper.Path.Circle(point, 1);
                                circle.fillColor = new this.coronalPaper.Color(displayColor[0]/255,
                                                                            displayColor[1]/255,
                                                                            displayColor[2]/255,)
                                //path.add(point);
                            }
                            //path.closed = true;
                        }
                    }
                }
            }
        }
        for(let poi_index=0; poi_index<this.displayPois.length; poi_index++){
            let structureSetRoi = structureSetRoiSequence[this.displayPois[poi_index]];
            let roiContour = roiContourSequence[this.displayPois[poi_index]];

            let roiName = structureSetRoi.x30060026.value;

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(roiContour.x30060040){
                let contourSequence = roiContour.x30060040.value;
                let refRoiNum = parseInt(roiContour.x30060084.value);

                let contours = this.findCoronalContour(contourSequence, crntCoronalPosition);

                if(contours.length>0){

                    for(let i=0; i<contours.length; i++){
                        let point_x = (parseFloat(contours[i][0])-this.rtImage.x_start)/this.rtImage.x_pixdim*scale_x;
                        let point_z = -(parseFloat(contours[i][2])-this.rtImage.z_start)/this.rtImage.z_pixdim*scale_z;

                        point_x += move_x;
                        point_z += move_z;

                        let point = new this.coronalPaper.Point(point_x, point_z);

                        let circle = new this.coronalPaper.Path.Circle(point, 1);
                        circle.fillColor = new this.coronalPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)

                        let textPoint = new this.coronalPaper.Point(point_x-10, point_z+10);
                        let text = new this.coronalPaper.PointText(textPoint);
                        text.justification = circle.fillColor;
                        text.fillColor = circle.fillColor;
                        text.content = roiName;
                        text.fontSize = 10;

                    }
                }
            }
        }
    }

    updateSagittalROIandPOI(){
        this.sagittalPaper.activate();
        this.sagittalRoiLayer.activate();
        this.sagittalRoiLayer.removeChildren();

        let crntSagittalPosition = this.rtImage.x_start + this.rtImage.x_pixdim* this.crntSagittalImgNmb;
        let rawTags = this.rsDicom.getRawDicomElements();

        let structureSetRoiSequence = rawTags.x30060020.value;
        let roiContourSequence = rawTags.x30060039.value;

        //scale image size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.sagittalPaper.view.size.width;
        let scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.sagittalPaper.view.size.height;

        //move image to the view center
        // start point is (0,0) z need to flip
        // (view size - image display size)/2 + image display size = (view size + image display size)/2
        let move_y = (this.sagittalPaper.view.size.width - this.rtImage.y_dim*scale_y)/2;
        let move_z = (this.sagittalPaper.view.size.height + this.rtImage.z_dim*scale_z)/2;

        for(let roi_index=0; roi_index<this.displayRois.length; roi_index++){

            let structureSetRoi = structureSetRoiSequence[this.displayRois[roi_index]];
            let roiContour = roiContourSequence[this.displayRois[roi_index]];

            let roiName = String(structureSetRoi.x30060026.value).trim();

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(this.rsJson !== null){
                if(this.rsJson.hasOwnProperty(roiName)){
                    let contours = this.rsJson[roiName]["saggital"][this.crntSagittalImgNmb];
                    for(let i =0; i<contours.length; i++){
                        let path = new this.coronalPaper.Path();
                        path.strokeColor = new this.sagittalPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)
                        let contour = contours[i];
                        for(let p=0; p<contour.length; p++){

                            let point_y = parseFloat(contour[p][0])*scale_y;
                            let point_z = -parseFloat(contour[p][1])*scale_z;

                            point_y += move_y;
                            point_z += move_z;

                            let point = new this.sagittalPaper.Point(point_y, point_z);

                            path.add(point);
                        }
                        path.closed = true;
                    }
                }
            }else{
                if(roiContour.x30060040){
                    let contourSequence = roiContour.x30060040.value;
                    let refRoiNum = parseInt(roiContour.x30060084.value);

                    let contours = this.findSagittalContour(contourSequence, crntSagittalPosition);
                    if(contours.length>0){

                        for(let i=0; i<contours.length; i++){
                            //let path = new this.coronalPaper.Path();
                            //path.strokeColor = new this.coronalPaper.Color(displayColor[0]/255,
                            //                                            displayColor[1]/255,
                            //                                            displayColor[2]/255,)
                            for(let p=0; p<contours[i].length-2; p+=3){
                                let point_y = (parseFloat(contours[i][p+1])-this.rtImage.y_start)/this.rtImage.y_pixdim*scale_y;
                                let point_z = -(parseFloat(contours[i][p+2])-this.rtImage.z_start)/this.rtImage.z_pixdim*scale_z;

                                point_y += move_y;
                                point_z += move_z;

                                let point = new this.sagittalPaper.Point(point_y, point_z);

                                let circle = new this.sagittalPaper.Path.Circle(point, 1);
                                circle.fillColor = new this.sagittalPaper.Color(displayColor[0]/255,
                                                                            displayColor[1]/255,
                                                                            displayColor[2]/255,)
                                //path.add(point);
                            }
                            //path.closed = true;
                        }
                    }
                }
            }
        }

        for(let poi_index=0; poi_index<this.displayPois.length; poi_index++){
            let structureSetRoi = structureSetRoiSequence[this.displayPois[poi_index]];
            let roiContour = roiContourSequence[this.displayPois[poi_index]];

            let roiName = structureSetRoi.x30060026.value;

            let displayColor = this.defaultColor;
            if(roiContour.x3006002A){
                 displayColor = roiContour.x3006002A.value;
            }

            if(roiContour.x30060040){
                let contourSequence = roiContour.x30060040.value;
                let refRoiNum = parseInt(roiContour.x30060084.value);

                let contours = this.findSagittalContour(contourSequence, crntSagittalPosition);

                if(contours.length>0){

                    for(let i=0; i<contours.length; i++){
                        let point_y = (parseFloat(contours[i][1])-this.rtImage.y_start)/this.rtImage.y_pixdim*scale_y;
                        let point_z = -(parseFloat(contours[i][2])-this.rtImage.z_start)/this.rtImage.z_pixdim*scale_z;

                        point_y += move_y;
                        point_z += move_z;

                        let point = new this.sagittalPaper.Point(point_y, point_z);

                        let circle = new this.sagittalPaper.Path.Circle(point, 1);
                        circle.fillColor = new this.sagittalPaper.Color(displayColor[0]/255,
                                                                    displayColor[1]/255,
                                                                    displayColor[2]/255,)

                        let textPoint = new this.sagittalPaper.Point(point_y-10, point_z+10);
                        let text = new this.sagittalPaper.PointText(textPoint);
                        text.justification = circle.fillColor;
                        text.fillColor = circle.fillColor;
                        text.content = roiName;
                        text.fontSize = 10;

                    }
                }
            }
        }
    }

    updateAxialDose(){
        //update axial layer
        this.axialPaper.activate();
        this.axialDoseLayer.activate();
        this.axialDoseLayer.removeChildren();

        let imageSlice = this.rtImage.imageSlices[this.crntAxialImgNmb];
        let crntAxialPosition = imageSlice.getGeometry().getOrigin().getZ();

        let imageOriginPoint = new this.axialPaper.Point(0, 0);
        let doseOriginSize = new this.axialPaper.Size(this.rtDose.x_dim, this.rtDose.y_dim);

        let sliceDose = this.rtDose.getAxialSlice(crntAxialPosition);

        if(sliceDose.length==0){
            return;
        }

        let max_dose = this.rtDose.maxDose;

        var rect = new this.axialPaper.Shape.Rectangle(imageOriginPoint, doseOriginSize);

        var raster = rect.rasterize();
        rect.remove();

        let imageData = raster.createImageData(doseOriginSize);

        for(let i = 0; i < sliceDose.length; i++) {
            let color =[]
            if(sliceDose[i]>=this.doseLevelUpper){
                color=hslToRgb(0, 100.0, 50.0);
            }else if(sliceDose[i]<=this.doseLevelLower){
                color=[0,0,0];
            }else{
                color = hslToRgb((1-(sliceDose[i]-this.doseLevelLower)/(this.doseLevelUpper-this.doseLevelLower))*255, 100.0, 50.0);
            }
            imageData.data[4*i] = color[0];
            imageData.data[4*i+1] = color[1];
            imageData.data[4*i+2] = color[2];
            imageData.data[4*i+3] = 255;
        }
        raster.setImageData(imageData, imageOriginPoint);
        raster.opacity = 0.3;


        //scale dose size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtDose.x_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.axialPaper.view.size.width* this.axialPaper.view.getPixelRatio();
        let scale_y = this.rtDose.y_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.axialPaper.view.size.height* this.axialPaper.view.getPixelRatio();
        raster.scale(scale_x, scale_y, imageOriginPoint);

        let img_scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.axialPaper.view.size.width* this.axialPaper.view.getPixelRatio();
        let img_scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.axialPaper.view.size.height* this.axialPaper.view.getPixelRatio();

        //move dose to the image center
        // start point is (0,0)
        raster.position.x += (this.rtDose.x_start - this.rtImage.x_start)/this.rtImage.min_pixdim * this.axialPaper.view.size.width / this.rtImage.max_dim;
        raster.position.y += (this.rtDose.y_start - this.rtImage.y_start)/this.rtImage.min_pixdim * this.axialPaper.view.size.height / this.rtImage.max_dim;

        //move dose to the view center
        raster.position.x += (this.axialPaper.view.size.width * this.axialPaper.view.getPixelRatio()-this.rtImage.x_dim*img_scale_x)/this.axialPaper.view.getPixelRatio()/2;
        raster.position.y += (this.axialPaper.view.size.height * this.axialPaper.view.getPixelRatio()-this.rtImage.y_dim*img_scale_y)/this.axialPaper.view.getPixelRatio()/2;

    }

    updateCoronalDose(){
        //update coronal layer
        this.coronalPaper.activate();
        this.coronalDoseLayer.activate();
        this.coronalDoseLayer.removeChildren();

        let crntCoronalPosition = this.rtImage.y_start + this.rtImage.y_pixdim* this.crntCoronalImgNmb;

        let max_dose = this.rtDose.maxDose;
        let doseSlice_coronal = this.rtDose.getCoronalSlice(crntCoronalPosition);

        if(doseSlice_coronal.length==0){
            return;
        }

        let imageOriginPoint = new this.coronalPaper.Point(0, 0);
        let doseOriginSize = new this.coronalPaper.Size(this.rtDose.x_dim, this.rtDose.z_dim);

        var rect = new this.coronalPaper.Shape.Rectangle(imageOriginPoint, doseOriginSize);

        var raster = rect.rasterize();
        rect.remove();

        let imageData_coronal = raster.createImageData(doseOriginSize);

        for(let i = 0; i < doseSlice_coronal.length; i++) {
            let color =[]
            if(doseSlice_coronal[i]>=this.doseLevelUpper){
                color=hslToRgb(0, 100.0, 50.0);
            }else if(doseSlice_coronal[i]<=this.doseLevelLower){
                color=[0,0,0];
            }else{
                color = hslToRgb((1-(doseSlice_coronal[i]-this.doseLevelLower)/(this.doseLevelUpper-this.doseLevelLower))*255, 100.0, 50.0);
            }
            imageData_coronal.data[4*i] = color[0];
            imageData_coronal.data[4*i+1] = color[1];
            imageData_coronal.data[4*i+2] = color[2];
            imageData_coronal.data[4*i+3] = 255;
        }
        raster.setImageData(imageData_coronal, imageOriginPoint);
        raster.opacity = 0.3;

        //scale dose size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_x = this.rtDose.x_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.width* this.coronalPaper.view.getPixelRatio();
        let scale_z = this.rtDose.z_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.height* this.coronalPaper.view.getPixelRatio();
        raster.scale(scale_x, scale_z, imageOriginPoint);

        let img_scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.width* this.coronalPaper.view.getPixelRatio();
        let img_scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.coronalPaper.view.size.height* this.coronalPaper.view.getPixelRatio();

        //move dose to the image center
        // start point is (0,0)
        raster.position.x += (this.rtDose.x_start - this.rtImage.x_start)/this.rtImage.min_pixdim * this.coronalPaper.view.size.width / this.rtImage.max_dim;
        raster.position.y += ((this.rtImage.z_start + this.rtImage.z_size) - (this.rtDose.z_start + this.rtDose.z_size))/this.rtImage.min_pixdim * this.coronalPaper.view.size.height / this.rtImage.max_dim;

        //move dose to the view center
        raster.position.x += (this.coronalPaper.view.size.width * this.coronalPaper.view.getPixelRatio()-this.rtImage.x_dim*img_scale_x)/this.coronalPaper.view.getPixelRatio()/2;
        raster.position.y += (this.coronalPaper.view.size.height * this.coronalPaper.view.getPixelRatio()-this.rtImage.z_dim*img_scale_z)/this.coronalPaper.view.getPixelRatio()/2;


    }

    updateSagittalDose(){
        //update coronal layer
        this.sagittalPaper.activate();
        this.sagittalDoseLayer.activate();
        this.sagittalDoseLayer.removeChildren();

        let crntSagittalPosition = this.rtImage.x_start + this.rtImage.x_pixdim* this.crntSagittalImgNmb;

        let max_dose = this.rtDose.maxDose;
        let doseSlice_sagittal = this.rtDose.getSagittalSlice(crntSagittalPosition);

        if(doseSlice_sagittal.length==0){
            return;
        }

        let imageOriginPoint = new this.sagittalPaper.Point(0, 0);
        let doseOriginSize = new this.sagittalPaper.Size(this.rtDose.y_dim, this.rtDose.z_dim);

        var rect = new this.sagittalPaper.Shape.Rectangle(imageOriginPoint, doseOriginSize);

        var raster = rect.rasterize();
        rect.remove();

        let imageData_sagittal = raster.createImageData(doseOriginSize);

        for(let i = 0; i < doseSlice_sagittal.length; i++) {
            let color =[]
            if(doseSlice_sagittal[i]>=this.doseLevelUpper){
                color=hslToRgb(0, 100.0, 50.0);
            }else if(doseSlice_sagittal[i]<=this.doseLevelLower){
                color=[0,0,0];
            }else{
                color = hslToRgb((1-(doseSlice_sagittal[i]-this.doseLevelLower)/(this.doseLevelUpper-this.doseLevelLower))*255, 100.0, 50.0);
            }
            imageData_sagittal.data[4*i] = color[0];
            imageData_sagittal.data[4*i+1] = color[1];
            imageData_sagittal.data[4*i+2] = color[2];
            imageData_sagittal.data[4*i+3] = 255;
        }
        raster.setImageData(imageData_sagittal, imageOriginPoint);
        raster.opacity = 0.3;

//        let scale_x = this.rtDose.y_pixdim/this.rtImage.y_pixdim * this.sagittalPaper.view.size.width/this.rtImage.max_dim*this.sagittalPaper.view.getPixelRatio();
//        let scale_y = this.rtDose.z_pixdim/this.rtImage.x_pixdim * this.sagittalPaper.view.size.height/this.rtImage.max_dim*this.sagittalPaper.view.getPixelRatio();
//        raster.scale(scale_x, scale_y, imageOriginPoint);
//
//        raster.position.x += (this.rtDose.y_start-this.rtImage.y_start)/this.rtImage.y_pixdim*this.sagittalPaper.view.size.width/this.rtImage.max_dim;
//        raster.position.y -= (this.rtDose.z_start-this.rtImage.z_start)/this.rtImage.x_pixdim*this.sagittalPaper.view.size.height/this.rtImage.max_dim;
//
//        //move to image center
//        //let scale_y = this.rtImage.z_pixdim/this.rtImage.y_pixdim*this.sagittalPaper.view.size.height/this.rtImage.max_dim;
//        raster.position.y += (this.sagittalPaper.view.size.height-this.rtImage.z_dim*scale_y/this.coronalPaper.view.getPixelRatio())/2;

        //scale dose size
        // _pixdim / min_dim * 1 / max_dim * view size * pixel ratio
        let scale_y = this.rtDose.y_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.sagittalPaper.view.size.width* this.sagittalPaper.view.getPixelRatio();
        let scale_z = this.rtDose.z_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.sagittalPaper.view.size.height* this.sagittalPaper.view.getPixelRatio();
        raster.scale(scale_y, scale_z, imageOriginPoint);

        let img_scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.sagittalPaper.view.size.width* this.sagittalPaper.view.getPixelRatio();
        let img_scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim / this.rtImage.max_dim * this.sagittalPaper.view.size.height* this.sagittalPaper.view.getPixelRatio();

        //move dose to the image center
        // start point is (0,0)
        raster.position.x += (this.rtDose.y_start - this.rtImage.y_start)/this.rtImage.min_pixdim * this.sagittalPaper.view.size.width / this.rtImage.max_dim;
        raster.position.y += ((this.rtImage.z_start + this.rtImage.z_size) - (this.rtDose.z_start + this.rtDose.z_size))/this.rtImage.min_pixdim * this.sagittalPaper.view.size.height / this.rtImage.max_dim;

        //move dose to the view center
        raster.position.x += (this.sagittalPaper.view.size.width * this.sagittalPaper.view.getPixelRatio()-this.rtImage.y_dim*img_scale_y)/this.sagittalPaper.view.getPixelRatio()/2;
        raster.position.y += (this.sagittalPaper.view.size.height * this.sagittalPaper.view.getPixelRatio()-this.rtImage.z_dim*img_scale_z)/this.sagittalPaper.view.getPixelRatio()/2;

    }

    updateDottedLines(){
        let z_position = this.crntAxialImgNmb;
        let x_position = this.crntSagittalImgNmb;
        let y_position = this.crntCoronalImgNmb;

        //scale image size
        let scale_x = this.rtImage.x_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.width;
        let scale_y = this.rtImage.y_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.axialPaper.view.size.height;
        let scale_z = this.rtImage.z_pixdim / this.rtImage.min_pixdim * 1 / this.rtImage.max_dim * this.sagittalPaper.view.size.height;

        //move image to the view center
        let move_x = (this.axialPaper.view.size.width-this.rtImage.x_dim*scale_x)/2;
        let move_y = (this.axialPaper.view.size.height-this.rtImage.y_dim*scale_y)/2;
        let move_z = (this.sagittalPaper.view.size.height - this.rtImage.z_dim*scale_z)/2;

        let z_imagePosition = z_position*scale_z + move_z;
        let x_imagePosition = x_position*scale_x + move_x;
        let y_imagePosition = y_position*scale_y + move_y;

        this.axialPaper.activate();
        this.axialLineLayer.activate();
        this.axialLineLayer.removeChildren();

        let axialXLine = new this.axialPaper.Path();
        axialXLine.strokeColor = new this.axialPaper.Color(1,1,1);
        axialXLine.strokeWidth = 1;
        axialXLine.strokeCap = 'round';
        axialXLine.dashArray = [2, 2];
        axialXLine.opacity = 0.3;
        let startPoint = new this.axialPaper.Point(x_imagePosition, 0);
        let endPoint = new this.axialPaper.Point(x_imagePosition, this.axialPaper.view.size.width);
        axialXLine.add(startPoint);
        axialXLine.add(endPoint);

        let axialYLine = new this.axialPaper.Path();
        axialYLine.strokeColor = new this.axialPaper.Color(1,1,1);
        axialYLine.strokeWidth = 1;
        axialYLine.strokeCap = 'round';
        axialYLine.dashArray = [2, 2];
        axialYLine.opacity = 0.3;
        startPoint = new this.axialPaper.Point(0, y_imagePosition);
        endPoint = new this.axialPaper.Point(this.axialPaper.view.size.height, y_imagePosition);
        axialYLine.add(startPoint);
        axialYLine.add(endPoint);

        this.coronalPaper.activate();
        this.coronalLineLayer.activate();
        this.coronalLineLayer.removeChildren();

        let coronalXLine = new this.coronalPaper.Path();
        coronalXLine.strokeColor = new this.coronalPaper.Color(1,1,1);
        coronalXLine.strokeWidth = 1;
        coronalXLine.strokeCap = 'round';
        coronalXLine.dashArray = [2, 2];
        coronalXLine.opacity = 0.3;
        startPoint = new this.coronalPaper.Point(x_imagePosition, 0);//(380-this.rtImage.z_dim*scale_y)/2);
        endPoint = new this.coronalPaper.Point(x_imagePosition, this.coronalPaper.view.size.width);//this.rtImage.z_dim*this.rtImage.z_pixdim/this.rtImage.x_pixdim*380/this.rtImage.x_pixdim + (380-this.rtImage.z_dim*scale_y)/2);
        coronalXLine.add(startPoint);
        coronalXLine.add(endPoint);

        let coronalYLine = new this.coronalPaper.Path();
        coronalYLine.strokeColor = new this.coronalPaper.Color(1,1,1);
        coronalYLine.strokeWidth = 1;
        coronalYLine.strokeCap = 'round';
        coronalYLine.dashArray = [2, 2];
        coronalYLine.opacity = 0.3;
        startPoint = new this.coronalPaper.Point(0, z_imagePosition);
        endPoint = new this.coronalPaper.Point(this.coronalPaper.view.size.height, z_imagePosition);
        coronalYLine.add(startPoint);
        coronalYLine.add(endPoint);

        this.sagittalPaper.activate();
        this.sagittalLineLayer.activate();
        this.sagittalLineLayer.removeChildren();

        let sagittalXLine = new this.sagittalPaper.Path();
        sagittalXLine.strokeColor = new this.sagittalPaper.Color(1,1,1);
        sagittalXLine.strokeWidth = 1;
        sagittalXLine.strokeCap = 'round';
        sagittalXLine.dashArray = [2, 2];
        sagittalXLine.opacity = 0.3;
        startPoint = new this.sagittalPaper.Point(y_imagePosition, 0);//(380-this.rtImage.z_dim*scale_y)/2);
        endPoint = new this.sagittalPaper.Point(y_imagePosition, this.sagittalPaper.view.size.height);//this.rtImage.z_dim*this.rtImage.z_pixdim/this.rtImage.x_pixdim*380/this.rtImage.x_pixdim + (380-this.rtImage.z_dim*scale_y)/2);
        sagittalXLine.add(startPoint);
        sagittalXLine.add(endPoint);

        let sagittalYLine = new this.sagittalPaper.Path();
        sagittalYLine.strokeColor = new this.sagittalPaper.Color(1,1,1);
        sagittalYLine.strokeWidth = 1;
        sagittalYLine.strokeCap = 'round';
        sagittalYLine.dashArray = [2, 2];
        sagittalYLine.opacity = 0.3;
        startPoint = new this.sagittalPaper.Point(0, z_imagePosition);
        endPoint = new this.sagittalPaper.Point(this.sagittalPaper.view.size.height, z_imagePosition);
        sagittalYLine.add(startPoint);
        sagittalYLine.add(endPoint);

    }

    updateDVH(){
        console.log("update DVH")
        if(this.dvhJson === null){
            return
        }

        this.dvhLoader.innerHTML = ""

        let plot_data = [];
        let max_xaxis = 0;

        for(let idx=0; idx<this.displayRois.length; idx++){

            let roi_index = this.displayRois[idx]
            if(roi_index>=this.dvhJson.length){
                console.log("The roi index is out of range.");
                continue;
            }

            let roi_id = this.dvhJson[roi_index]["id"];
            let roi_name = this.dvhJson[roi_index]["name"];
            let roi_type = this.dvhJson[roi_index]["type"];
            let roi_color = this.dvhJson[roi_index]["color"];
            let roi_color_str = 'rgb('+roi_color[0]+","+roi_color[1]+","+roi_color[2]+")"
            let roi_bincenters = this.dvhJson[roi_index]["relative_volume.bincenters"];
            let roi_counts = this.dvhJson[roi_index]["relative_volume.counts"];
            let roi_max = this.dvhJson[roi_index]["max"];
            let roi_min = this.dvhJson[roi_index]["min"];
            let roi_mean = this.dvhJson[roi_index]["mean"];
            let roi_volume = this.dvhJson[roi_index]["volume"];

            if(max_xaxis < roi_bincenters[roi_bincenters.length-1]){
                max_xaxis = roi_bincenters[roi_bincenters.length-1];
            }
            var pd = {
                name: roi_name,
                x:roi_bincenters,
                y:roi_counts,
                mode:'lines',
                line:{
                    color: roi_color_str
                }
            };
            plot_data.push(pd)
        }
        if(max_xaxis !== 0){
            max_xaxis = parseInt(max_xaxis*1.05);
        }else{
            max_xaxis = 1;
        }

        var layout = {
            xaxis: {
                title: 'Dose (Gy)',
                range: [0 , max_xaxis]
            },
            yaxis: {
                title: 'Volume (%)',
                range: [0, 100]
            },
            title:'Dose Volume Histogram'
        };

        Plotly.newPlot('dvh_plot_div', plot_data, layout);
    }
}


function hslToRgb(h, s, l){
    h = h/360.0;
    s = s/100.0;
    l = l/100.0;

    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function unRegisterAllEventListeners(element) {

        let clone = element.cloneNode();
        // move all child elements from the original to the clone
        while (element.firstChild) {
            clone.appendChild(element.lastChild);
        }

        element.parentNode.replaceChild(clone, element);
        element = clone;
    }

function removeChildren(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
