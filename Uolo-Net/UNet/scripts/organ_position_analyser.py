import os
import nrrd
import json


def generatePositionReportFromNrrd(nrrd_file):
    """
    :param nrrd_file:
    :return: a json dict
    """
    readdata, header = nrrd.read(nrrd_file)

    contour_header = header
    contour_header['sizes'] = contour_header['sizes'].tolist()
    contour_header['space directions'] = contour_header['space directions'].tolist()
    contour_header['space origin'] = contour_header['space origin'].tolist()

    marker = [];
    for i in range(0, readdata.shape[2]):
        data = readdata[:,:,i]
        if data.max() == 0:
            marker.append(0)
        elif data.max() - data.min() == 0:
            marker.append(0)
        else:
            marker.append(1)
    return {"header": contour_header, "marker": marker}


def generatePositionReportFromNrrdFolder(nrrd_folder):
    """
    :param nrrd_folder:
    :return: a json string
    """
    rs_nrrd_files = [f for f in os.listdir(nrrd_folder) if
                     os.path.isfile(os.path.join(nrrd_folder, f)) and f.endswith(".nrrd")]

    report_header = ""
    report_body = {}
    for nrrd_file in rs_nrrd_files:
        organ_name = nrrd_file.replace(".nrrd", "")
        nrrd_file_path = os.path.join(nrrd_folder, nrrd_file)

        js = generatePositionReportFromNrrd(nrrd_file_path)
        if report_header == "":
            report_header = js["header"]

        report_body[organ_name] = js["marker"]
    return {"header": report_header, "body": report_body}


def main():
    nrrd_file = r"/data/LAMBDA/inst-1\LCTSC-Train-S1-001\nrrd\1.3.6.1.4.1.14519.5.2.1.7014.4598.117430069853376188015337939664\20050825-RTSTRUCT-1.3.6.1.4.1.14519.5.2.1.7014.4598.267594131248797648024467762948\Heart.nrrd"
    nrrd_folder = r"/data/LAMBDA/inst-1\LCTSC-Train-S1-001\nrrd\1.3.6.1.4.1.14519.5.2.1.7014.4598.117430069853376188015337939664\20050825-RTSTRUCT-1.3.6.1.4.1.14519.5.2.1.7014.4598.267594131248797648024467762948"

    js = generatePositionReportFromNrrdFolder(nrrd_folder)


    print(js)


if __name__=="__main__":
    main()