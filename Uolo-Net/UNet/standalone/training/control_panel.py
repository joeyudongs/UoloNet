# -*- coding: utf-8 -*-

###########################################################################
## Python code generated with wxFormBuilder (version Jun 17 2015)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx
import wx.xrc, wx.adv, wx.grid
import os, sys, threading, time
from lambda_rad.dicomparser import DicomParser
import errno
import shutil
import re

sys.path.append('.')
os.environ['DJANGO_SETTINGS_MODULE'] = 'webplatform.settings'
import django

django.setup()
from lambda_rad import models as lambda_model
from scripts import data_insert
from django.conf import settings
from lambda_rad import utils
import pydicom
from datetime import datetime

from scripts import unet


###########################################################################
## Class MyFrame1
###########################################################################

class Frame_DicomCollector(wx.Frame):

    def __init__(self, parent):
        self.m_search_folder = ''
        self.m_output_path = ''

        self.m_thread_import_terminate = True
        self.m_listBox_image_labelChoices = []

        self.makeGUI(parent)
        self.bindEvent()

    def makeGUI(self, parent):
        wx.Frame.__init__(self, parent, id=wx.ID_ANY, title=wx.EmptyString, pos=wx.DefaultPosition,
                          size=wx.Size(1200, 900), style=wx.DEFAULT_FRAME_STYLE | wx.TAB_TRAVERSAL)

        self.SetSizeHints(wx.DefaultSize, wx.DefaultSize)
        self.SetBackgroundColour(wx.Colour(255, 255, 255))

        self.m_statusBar = self.CreateStatusBar(1)
        self.m_menubar = wx.MenuBar(0)
        self.m_menu_1 = wx.Menu()
        self.m_menuItem1_1 = wx.MenuItem(self.m_menu_1, wx.ID_ANY, u"Quit", wx.EmptyString, wx.ITEM_NORMAL)
        self.m_menu_1.Append(self.m_menuItem1_1)

        self.m_menubar.Append(self.m_menu_1, u"File")

        self.m_menu2 = wx.Menu()
        self.m_menuItem2_1 = wx.MenuItem(self.m_menu2, wx.ID_ANY, u"Copyright", wx.EmptyString, wx.ITEM_NORMAL)
        self.m_menu2.Append(self.m_menuItem2_1)

        self.m_menubar.Append(self.m_menu2, u"About")

        self.SetMenuBar(self.m_menubar)

        bSizer1 = wx.BoxSizer(wx.VERTICAL)

        self.m_notebook = wx.Notebook(self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_panel_data = wx.Panel(self.m_notebook, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL)
        bSizer11 = wx.BoxSizer(wx.VERTICAL)

        bSizer12 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer16 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_institute = wx.StaticText(self.m_panel_data, wx.ID_ANY, u"Institute", wx.DefaultPosition,
                                                    wx.DefaultSize, 0)
        self.m_staticText_institute.Wrap(-1)
        bSizer16.Add(self.m_staticText_institute, 0, wx.ALL, 5)

        bSizer18 = wx.BoxSizer(wx.HORIZONTAL)

        m_listBox_instituteChoices = []
        self.m_listBox_institute = wx.ListBox(self.m_panel_data, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 300),
                                              m_listBox_instituteChoices, 0)
        bSizer18.Add(self.m_listBox_institute, 0, wx.ALL, 5)

        bSizer13 = wx.BoxSizer(wx.VERTICAL)

        bSizer14 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_textCtrl_institute_name = wx.TextCtrl(self.m_panel_data, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                       wx.Size(300, -1), 0)
        bSizer14.Add(self.m_textCtrl_institute_name, 0, wx.ALL, 5)

        self.m_button_add = wx.Button(self.m_panel_data, wx.ID_ANY, u"Add", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer14.Add(self.m_button_add, 0, wx.ALL, 5)

        bSizer13.Add(bSizer14, 0, wx.EXPAND, 1)

        self.m_button_del = wx.Button(self.m_panel_data, wx.ID_ANY, u"Delete", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer13.Add(self.m_button_del, 0, wx.ALL, 5)

        self.m_button8 = wx.Button(self.m_panel_data, wx.ID_ANY, u"Edit", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer13.Add(self.m_button8, 0, wx.ALL, 5)

        bSizer19 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_textCtrl_searchfolder = wx.TextCtrl(self.m_panel_data, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                       wx.Size(350, -1), 0)
        bSizer19.Add(self.m_textCtrl_searchfolder, 0, wx.ALL, 5)

        self.m_button_browse = wx.Button(self.m_panel_data, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer19.Add(self.m_button_browse, 0, wx.ALL, 5)

        self.m_button_import = wx.Button(self.m_panel_data, wx.ID_ANY, u"Import Data", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer19.Add(self.m_button_import, 0, wx.ALL, 5)

        bSizer13.Add(bSizer19, 0, wx.EXPAND, 5)

        bSizer18.Add(bSizer13, 1, wx.EXPAND, 5)

        bSizer16.Add(bSizer18, 1, wx.EXPAND, 5)

        bSizer12.Add(bSizer16, 1, wx.EXPAND, 5)

        bSizer11.Add(bSizer12, 0, wx.EXPAND, 5)

        bSizer17 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_patient = wx.StaticText(self.m_panel_data, wx.ID_ANY, u"Patient", wx.DefaultPosition,
                                                  wx.DefaultSize, 0)
        self.m_staticText_patient.Wrap(-1)
        bSizer17.Add(self.m_staticText_patient, 0, wx.ALL, 5)

        bSizer38 = wx.BoxSizer(wx.HORIZONTAL)

        #m_listBox_patientChoices = []
        #self.m_listBox_patient = wx.ListBox(self.m_panel_data, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 400),
        #                                    m_listBox_patientChoices, 0)
        #bSizer38.Add(self.m_listBox_patient, 0, wx.ALL, 5)

        self.m_grid_patient = wx.grid.Grid(self.m_panel_data, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 400), 0)

        # Grid
        self.m_grid_patient.CreateGrid(0, 4)
        self.m_grid_patient.EnableEditing(True)
        self.m_grid_patient.EnableGridLines(True)
        self.m_grid_patient.EnableDragGridSize(False)
        self.m_grid_patient.SetMargins(0, 0)

        # Columns
        self.m_grid_patient.EnableDragColMove(False)
        self.m_grid_patient.EnableDragColSize(True)
        self.m_grid_patient.SetColLabelSize(30)
        self.m_grid_patient.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_grid_patient.EnableDragRowSize(True)
        self.m_grid_patient.SetRowLabelSize(80)
        self.m_grid_patient.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance
        self.m_grid_patient.SetLabelBackgroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_WINDOW))

        self.m_grid_patient.SetColLabelValue(0, "ID")
        self.m_grid_patient.SetColLabelValue(1, "Patient ID")
        self.m_grid_patient.SetColLabelValue(2, "Name")
        self.m_grid_patient.SetColLabelValue(3, "Gender")
        self.m_grid_patient.SetColSize(0, 80)
        self.m_grid_patient.SetColSize(1, 180)
        self.m_grid_patient.SetColSize(2, 180)
        self.m_grid_patient.SetColSize(3, 60)

        # Cell Defaults
        self.m_grid_patient.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer38.Add(self.m_grid_patient, 0, wx.ALL, 5)

        self.m_button_del_pat = wx.Button(self.m_panel_data, wx.ID_ANY, u"Delete", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer38.Add(self.m_button_del_pat, 0, wx.ALL, 5)

        bSizer17.Add(bSizer38, 1, wx.EXPAND, 5)

        bSizer11.Add(bSizer17, 1, wx.EXPAND, 5)

        self.m_panel_data.SetSizer(bSizer11)
        self.m_panel_data.Layout()
        bSizer11.Fit(self.m_panel_data)
        self.m_notebook.AddPage(self.m_panel_data, u"Data", False)
        self.m_panel_training = wx.Panel(self.m_notebook, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize,
                                         wx.TAB_TRAVERSAL)
        bSizer111 = wx.BoxSizer(wx.VERTICAL)

        bSizer121 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer161 = wx.BoxSizer(wx.VERTICAL)

        bSizer181 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer39 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_institute1 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Institute", wx.DefaultPosition,
                                                     wx.DefaultSize, 0)
        self.m_staticText_institute1.Wrap(-1)
        bSizer39.Add(self.m_staticText_institute1, 0, wx.ALL, 5)

        m_listBox_institute1Choices = []
        self.m_listBox_institute1 = wx.ListBox(self.m_panel_training, wx.ID_ANY, wx.DefaultPosition, wx.Size(300, 300),
                                               m_listBox_institute1Choices, 0)
        bSizer39.Add(self.m_listBox_institute1, 0, wx.ALL, 5)

        bSizer181.Add(bSizer39, 0, wx.EXPAND, 5)

        bSizer40 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText15 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"ROI", wx.DefaultPosition,
                                            wx.DefaultSize, 0)
        self.m_staticText15.Wrap(-1)
        self.m_staticText15.SetMinSize(wx.Size(200, -1))

        bSizer40.Add(self.m_staticText15, 0, wx.ALL, 5)

        m_listBox_roiChoices = []
        self.m_listBox_roi = wx.ListBox(self.m_panel_training, wx.ID_ANY, wx.DefaultPosition, wx.Size(200, 300),
                                        m_listBox_roiChoices, 0)
        bSizer40.Add(self.m_listBox_roi, 0, wx.ALL, 5)

        bSizer181.Add(bSizer40, 0, wx.EXPAND, 5)

        bSizer131 = wx.BoxSizer(wx.VERTICAL)

        self.m_button_train_select = wx.Button(self.m_panel_training, wx.ID_ANY, u"Select", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer131.Add(self.m_button_train_select, 0, wx.ALIGN_CENTER | wx.ALL, 5)

        bSizer181.Add(bSizer131, 0, wx.EXPAND, 5)

        bSizer41 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText16 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Image - Label", wx.DefaultPosition,
                                            wx.DefaultSize, 0)
        self.m_staticText16.Wrap(-1)
        bSizer41.Add(self.m_staticText16, 0, wx.ALL, 5)

        self.m_listBox_image_labelChoices = []
        self.m_listBox_image_label = wx.ListBox(self.m_panel_training, wx.ID_ANY, wx.DefaultPosition, wx.Size(400, 300),
                                                self.m_listBox_image_labelChoices, 0 | wx.HSCROLL)
        bSizer41.Add(self.m_listBox_image_label, 0, wx.ALL, 5)

        bSizer181.Add(bSizer41, 1, wx.EXPAND, 5)

        bSizer42 = wx.BoxSizer(wx.VERTICAL)

        self.m_button25 = wx.Button(self.m_panel_training, wx.ID_ANY, u"Delete", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer42.Add(self.m_button25, 0, wx.ALL, 5)

        bSizer181.Add(bSizer42, 1, wx.EXPAND, 5)

        bSizer161.Add(bSizer181, 1, wx.EXPAND, 5)

        bSizer121.Add(bSizer161, 1, wx.EXPAND, 5)

        bSizer111.Add(bSizer121, 0, wx.EXPAND, 5)

        bSizer171 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_patient1 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Training Model",
                                                   wx.DefaultPosition, wx.DefaultSize, 0)
        self.m_staticText_patient1.Wrap(-1)
        bSizer171.Add(self.m_staticText_patient1, 0, wx.ALL, 5)

        bSizer37 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer47 = wx.BoxSizer(wx.VERTICAL)

        bSizer43 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText17 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Train valid ratio", wx.DefaultPosition,
                                            wx.Size(150, -1), 0)
        self.m_staticText17.Wrap(-1)
        bSizer43.Add(self.m_staticText17, 0, wx.ALL, 5)

        self.m_textCtrl_TVR = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                          wx.DefaultSize, 0)
        bSizer43.Add(self.m_textCtrl_TVR, 0, wx.ALL, 5)

        bSizer47.Add(bSizer43, 1, wx.EXPAND, 5)

        bSizer431 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText171 = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Dimesion", wx.DefaultPosition,
                                             wx.Size(150, -1), 0)
        self.m_staticText171.Wrap(-1)
        bSizer431.Add(self.m_staticText171, 0, wx.ALL, 5)

        self.m_staticText_train_model_wide = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"wide :", wx.DefaultPosition,
                                                           wx.DefaultSize, 0)
        self.m_staticText_train_model_wide.Wrap(-1)
        bSizer431.Add(self.m_staticText_train_model_wide, 0, wx.ALL, 5)

        self.m_textCtrl_train_model_wide = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                       wx.DefaultSize, 0)
        bSizer431.Add(self.m_textCtrl_train_model_wide, 0, wx.ALL, 5)

        self.m_staticText_train_model_height = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"height :", wx.DefaultPosition,
                                                             wx.DefaultSize, 0)
        self.m_staticText_train_model_height.Wrap(-1)
        bSizer431.Add(self.m_staticText_train_model_height, 0, wx.ALL, 5)

        self.m_textCtrl_train_model_height = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                         wx.DefaultSize, 0)
        bSizer431.Add(self.m_textCtrl_train_model_height, 0, wx.ALL, 5)

        bSizer47.Add(bSizer431, 1, wx.EXPAND, 5)

        bSizer432 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_batchsize = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Batch size", wx.DefaultPosition,
                                                    wx.Size(150, -1), 0)
        self.m_staticText_batchsize.Wrap(-1)
        bSizer432.Add(self.m_staticText_batchsize, 0, wx.ALL, 5)

        self.m_textCtrl_batchsize = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                wx.DefaultSize, 0)
        bSizer432.Add(self.m_textCtrl_batchsize, 0, wx.ALL, 5)

        bSizer47.Add(bSizer432, 1, wx.EXPAND, 5)

        bSizer433 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_step_per_epoch = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Steps per epoch", wx.DefaultPosition,
                                                         wx.Size(150, -1), 0)
        self.m_staticText_step_per_epoch.Wrap(-1)
        bSizer433.Add(self.m_staticText_step_per_epoch, 0, wx.ALL, 5)

        self.m_textCtrl_step_per_epoch = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                     wx.DefaultSize, 0)
        bSizer433.Add(self.m_textCtrl_step_per_epoch, 0, wx.ALL, 5)

        bSizer47.Add(bSizer433, 1, wx.EXPAND, 5)

        bSizer434 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_num_epoch = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Number of epoch", wx.DefaultPosition,
                                                    wx.Size(150, -1), 0)
        self.m_staticText_num_epoch.Wrap(-1)
        bSizer434.Add(self.m_staticText_num_epoch, 0, wx.ALL, 5)

        self.m_textCtrl_num_epoch = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                wx.DefaultSize, 0)
        bSizer434.Add(self.m_textCtrl_num_epoch, 0, wx.ALL, 5)

        bSizer47.Add(bSizer434, 1, wx.EXPAND, 5)

        bSizer435 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_val_step = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Validation steps", wx.DefaultPosition,
                                                   wx.Size(150, -1), 0)
        self.m_staticText_val_step.Wrap(-1)
        bSizer435.Add(self.m_staticText_val_step, 0, wx.ALL, 5)

        self.m_textCtrl_val_step = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                               wx.DefaultSize, 0)
        bSizer435.Add(self.m_textCtrl_val_step, 0, wx.ALL, 5)

        bSizer47.Add(bSizer435, 1, wx.EXPAND, 5)

        bSizer436 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_weight_path = settings.LAMBDA_DATA_FOLDER
        self.m_staticText_output_weight_path = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Output weight path",
                                                             wx.DefaultPosition, wx.Size(150, -1), 0)
        self.m_staticText_output_weight_path.Wrap(-1)
        bSizer436.Add(self.m_staticText_output_weight_path, 0, wx.ALL, 5)

        self.m_textCtrl_output_weight_path = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                         wx.Size(700, -1), 0)
        bSizer436.Add(self.m_textCtrl_output_weight_path, 0, wx.ALL, 5)

        self.m_button_output_weight_path = wx.Button(self.m_panel_training, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer436.Add(self.m_button_output_weight_path, 0, wx.ALL, 5)

        bSizer47.Add(bSizer436, 1, wx.EXPAND, 5)

        bSizer437 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_model_path = settings.LAMBDA_DATA_FOLDER
        self.m_staticText_output_model_path = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Output model path", wx.DefaultPosition,
                                                            wx.Size(150, -1), 0)
        self.m_staticText_output_model_path.Wrap(-1)
        bSizer437.Add(self.m_staticText_output_model_path, 0, wx.ALL, 5)

        self.m_textCtrl_output_model_path = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                        wx.Size(700, -1), 0)
        bSizer437.Add(self.m_textCtrl_output_model_path, 0, wx.ALL, 5)

        self.m_button_output_model_path = wx.Button(self.m_panel_training, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer437.Add(self.m_button_output_model_path, 0, wx.ALL, 5)

        bSizer47.Add(bSizer437, 1, wx.EXPAND, 5)

        bSizer4361 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_input_weight_path = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Input weight path",
                                                            wx.DefaultPosition, wx.Size(150, -1), 0)
        self.m_staticText_input_weight_path.Wrap(-1)
        bSizer4361.Add(self.m_staticText_input_weight_path, 0, wx.ALL, 5)

        self.m_textCtrl_input_weight_path = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                         wx.Size(700, -1), 0)
        bSizer4361.Add(self.m_textCtrl_input_weight_path, 0, wx.ALL, 5)

        self.m_button_input_weight_path = wx.Button(self.m_panel_training, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer4361.Add(self.m_button_input_weight_path, 0, wx.ALL, 5)

        bSizer47.Add(bSizer4361, 1, wx.EXPAND, 5)

        bSizer4362 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_input_model_path = wx.StaticText(self.m_panel_training, wx.ID_ANY, u"Input model path",
                                                           wx.DefaultPosition, wx.Size(150, -1), 0)
        self.m_staticText_input_model_path.Wrap(-1)
        bSizer4362.Add(self.m_staticText_input_model_path, 0, wx.ALL, 5)

        self.m_textCtrl_input_model_path = wx.TextCtrl(self.m_panel_training, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                                       wx.Size(700, -1), 0)
        bSizer4362.Add(self.m_textCtrl_input_model_path, 0, wx.ALL, 5)

        self.m_button_input_model_path = wx.Button(self.m_panel_training, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer4362.Add(self.m_button_input_model_path, 0, wx.ALL, 5)

        bSizer47.Add(bSizer4362, 1, wx.EXPAND, 5)

        bSizer37.Add(bSizer47, 0, wx.EXPAND, 5)

        bSizer67 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_button_train = wx.Button(self.m_panel_training, wx.ID_ANY, u"Train", wx.DefaultPosition,
                                        wx.Size(100, 100), 0)
        bSizer67.Add(self.m_button_train, 0, wx.ALIGN_CENTER_VERTICAL, 5)

        bSizer37.Add(bSizer67, 1, wx.ALL | wx.EXPAND, 5)

        bSizer171.Add(bSizer37, 1, wx.EXPAND, 5)

        bSizer111.Add(bSizer171, 1, wx.EXPAND, 5)

        self.m_panel_training.SetSizer(bSizer111)
        self.m_panel_training.Layout()
        bSizer111.Fit(self.m_panel_training)
        self.m_notebook.AddPage(self.m_panel_training, u"Training", True)

        # Testing panel
        self.m_panel_testing = wx.Panel(self.m_notebook, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize,
                                        wx.TAB_TRAVERSAL)
        bSizer112 = wx.BoxSizer(wx.VERTICAL)

        bSizer122 = wx.BoxSizer(wx.HORIZONTAL)

        bSizer162 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_institute2 = wx.StaticText(self.m_panel_testing, wx.ID_ANY, u"Institute", wx.DefaultPosition,
                                                     wx.DefaultSize, 0)
        self.m_staticText_institute2.Wrap(-1)
        bSizer162.Add(self.m_staticText_institute2, 0, wx.ALL, 5)

        bSizer182 = wx.BoxSizer(wx.HORIZONTAL)

        m_listBox_institute2Choices = []
        self.m_listBox_institute2 = wx.ListBox(self.m_panel_testing, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 250),
                                               m_listBox_institute2Choices, 0)
        bSizer182.Add(self.m_listBox_institute2, 0, wx.ALL, 5)

        bSizer162.Add(bSizer182, 1, wx.EXPAND, 5)

        bSizer122.Add(bSizer162, 1, wx.EXPAND, 5)

        bSizer112.Add(bSizer122, 0, wx.EXPAND, 5)

        bSizer172 = wx.BoxSizer(wx.VERTICAL)

        self.m_staticText_patient2 = wx.StaticText(self.m_panel_testing, wx.ID_ANY, u"Patient", wx.DefaultPosition,
                                                   wx.DefaultSize, 0)
        self.m_staticText_patient2.Wrap(-1)
        bSizer172.Add(self.m_staticText_patient2, 0, wx.ALL, 5)

        bSizer381 = wx.BoxSizer(wx.HORIZONTAL)
        self.m_grid_patient1 = wx.grid.Grid(self.m_panel_testing, wx.ID_ANY, wx.DefaultPosition, wx.Size(600, 340), 0)

        # Grid
        self.m_grid_patient1.CreateGrid(0, 4)
        self.m_grid_patient1.EnableEditing(True)
        self.m_grid_patient1.EnableGridLines(True)
        self.m_grid_patient1.EnableDragGridSize(False)
        self.m_grid_patient1.SetMargins(0, 0)

        # Columns
        self.m_grid_patient1.EnableDragColMove(False)
        self.m_grid_patient1.EnableDragColSize(True)
        self.m_grid_patient1.SetColLabelSize(30)
        self.m_grid_patient1.SetColLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Rows
        self.m_grid_patient1.EnableDragRowSize(True)
        self.m_grid_patient1.SetRowLabelSize(80)
        self.m_grid_patient1.SetRowLabelAlignment(wx.ALIGN_CENTRE, wx.ALIGN_CENTRE)

        # Label Appearance
        self.m_grid_patient1.SetLabelBackgroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_WINDOW))

        self.m_grid_patient1.SetColLabelValue(0, "ID")
        self.m_grid_patient1.SetColLabelValue(1, "Patient ID")
        self.m_grid_patient1.SetColLabelValue(2, "Name")
        self.m_grid_patient1.SetColLabelValue(3, "Gender")
        self.m_grid_patient1.SetColSize(0, 80)
        self.m_grid_patient1.SetColSize(1, 180)
        self.m_grid_patient1.SetColSize(2, 180)
        self.m_grid_patient1.SetColSize(3, 60)

        # Cell Defaults
        self.m_grid_patient1.SetDefaultCellAlignment(wx.ALIGN_LEFT, wx.ALIGN_TOP)
        bSizer381.Add(self.m_grid_patient1, 0, wx.ALL, 5)


        self.m_button_generate_contour = wx.Button(self.m_panel_testing, wx.ID_ANY, u"Generate Contour", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer381.Add(self.m_button_generate_contour, 0, wx.ALL, 5)

        bSizer172.Add(bSizer381, 1, wx.EXPAND, 5)

        bSizer112.Add(bSizer172, 0, wx.EXPAND, 5)

        bSizer43611 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_input_weight_path1 = wx.StaticText(self.m_panel_testing, wx.ID_ANY, u"Input weight path",
                                                             wx.DefaultPosition, wx.Size(150, -1), 0)
        self.m_staticText_input_weight_path1.Wrap(-1)
        bSizer43611.Add(self.m_staticText_input_weight_path1, 0, wx.ALL, 5)

        self.m_textCtrl_input_weight_path1 = wx.TextCtrl(self.m_panel_testing, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                           wx.Size(700, -1), 0)
        bSizer43611.Add(self.m_textCtrl_input_weight_path1, 0, wx.ALL, 5)

        self.m_button_input_weight_path1 = wx.Button(self.m_panel_testing, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer43611.Add(self.m_button_input_weight_path1, 0, wx.ALL, 5)

        bSizer112.Add(bSizer43611, 0, wx.EXPAND, 5)

        bSizer43621 = wx.BoxSizer(wx.HORIZONTAL)

        self.m_staticText_input_model_path1 = wx.StaticText(self.m_panel_testing, wx.ID_ANY, u"Input model path",
                                                            wx.DefaultPosition, wx.Size(150, -1), 0)
        self.m_staticText_input_model_path1.Wrap(-1)
        bSizer43621.Add(self.m_staticText_input_model_path1, 0, wx.ALL, 5)

        self.m_textCtrl_input_model_path1 = wx.TextCtrl(self.m_panel_testing, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition,
                                           wx.Size(700, -1), 0)
        bSizer43621.Add(self.m_textCtrl_input_model_path1, 0, wx.ALL, 5)

        self.m_button_input_model_path1 = wx.Button(self.m_panel_testing, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0)
        bSizer43621.Add(self.m_button_input_model_path1, 0, wx.ALL, 5)

        bSizer112.Add(bSizer43621, 0, wx.EXPAND, 0)

        self.m_panel_testing.SetSizer(bSizer112)
        self.m_panel_testing.Layout()
        bSizer112.Fit(self.m_panel_testing)
        self.m_notebook.AddPage(self.m_panel_testing, u"Testing", True)

        self.m_notebook.SetSelection(0)

        bSizer1.Add(self.m_notebook, 1, wx.EXPAND | wx.ALL, 5)

        self.m_gauge = wx.Gauge(self, wx.ID_ANY, 100, wx.DefaultPosition, wx.Size(1060, -1), wx.GA_HORIZONTAL)
        self.m_gauge.SetValue(0)
        bSizer1.Add(self.m_gauge, 0, wx.ALIGN_LEFT | wx.ALL, 5)

        self.SetSizer(bSizer1)
        self.Layout()

        self.Centre(wx.BOTH)

        self.setDefault()
        self.bindEvent()

        self.load_institute()
        self.load_roi()
        self.onModelWeightNameChange()

    def bindEvent(self):
        self.Bind(wx.EVT_MENU, self.onQuit, self.m_menuItem1_1)
        self.Bind(wx.EVT_MENU, self.onCopyright, self.m_menuItem2_1)
        self.m_button_add.Bind(wx.EVT_BUTTON, self.onAddInstitute)
        self.m_button_del.Bind(wx.EVT_BUTTON, self.onDelInstitute)
        self.m_button_browse.Bind(wx.EVT_BUTTON, self.onBrowse)
        self.m_button_import.Bind(wx.EVT_BUTTON, self.onImport)
        self.m_listBox_institute.Bind(wx.EVT_LISTBOX, self.onInstituteSelected)
        self.m_button_train_select.Bind(wx.EVT_BUTTON, self.onTrainSelect)
        self.m_button_del_pat.Bind(wx.EVT_BUTTON, self.onDelPatient)

        self.m_listBox_roi.Bind(wx.EVT_LISTBOX, self.onModelWeightNameChange)
        self.m_button_output_weight_path.Bind(wx.EVT_BUTTON, self.onBrowse_owp)
        self.m_button_output_model_path.Bind(wx.EVT_BUTTON, self.onBrowse_omp)
        self.m_button_input_weight_path.Bind(wx.EVT_BUTTON, self.onBrowse_iwp)
        self.m_button_input_model_path.Bind(wx.EVT_BUTTON, self.onBrowse_imp)

        self.m_textCtrl_TVR.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_train_model_wide.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_train_model_height.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_batchsize.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_step_per_epoch.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_num_epoch.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)
        self.m_textCtrl_val_step.Bind(wx.EVT_TEXT, self.onModelWeightNameChange)

        self.m_button_train.Bind(wx.EVT_BUTTON, self.onTrain)

        self.m_listBox_institute2.Bind(wx.EVT_LISTBOX, self.onInstituteSelected2)
        self.m_button_input_weight_path1.Bind(wx.EVT_BUTTON, self.onBrowse_iwp1)
        self.m_button_input_model_path1.Bind(wx.EVT_BUTTON, self.onBrowse_imp1)

        self.m_button_generate_contour.Bind(wx.EVT_BUTTON, self.onGenerateContour)

    def setDefault(self):
        self.m_textCtrl_TVR.SetValue(r'0.8')
        self.m_textCtrl_train_model_wide.SetValue(r'256')
        self.m_textCtrl_train_model_height.SetValue(r'256')
        self.m_textCtrl_batchsize.SetValue(r'16')
        self.m_textCtrl_step_per_epoch.SetValue(r'600')
        self.m_textCtrl_num_epoch.SetValue(r'100')
        self.m_textCtrl_val_step.SetValue(r'120')

        self.m_weight_path = settings.LAMBDA_DATA_FOLDER
        self.m_textCtrl_output_weight_path.write(self.m_weight_path)
        self.m_model_path = settings.LAMBDA_DATA_FOLDER
        self.m_textCtrl_output_model_path.write(self.m_model_path)

    def __del__(self):
        pass

    def onCopyright(self, event):
        aboutInfo = wx.adv.AboutDialogInfo()
        aboutInfo.SetName("Pinn2Dicom")
        logo_path = os.path.join(os.getcwd(), 'resource/logo1.png')
        ico = wx.Icon(logo_path, wx.BITMAP_TYPE_PNG, 10, 10)
        aboutInfo.SetIcon(ico)
        aboutInfo.SetVersion('0.1.0')
        aboutInfo.SetDescription("Pinn2Dicom!")
        aboutInfo.SetCopyright("(C) 2018-2019")
        aboutInfo.SetWebSite("www.globaloncologyone.com")
        aboutInfo.AddDeveloper("Li Liao")

        wx.adv.AboutBox(aboutInfo)

    def onQuit(self, event):
        self.Close()

    def load_institute(self):
        self.m_listBox_institute.Clear()
        self.m_listBox_institute1.Clear()
        self.m_listBox_institute2.Clear()
        institutions = lambda_model.Institution.objects.all().order_by('name')
        for ins in institutions:
            self.m_listBox_institute.Append(ins.name)
            self.m_listBox_institute1.Append(ins.name)
            self.m_listBox_institute2.Append(ins.name)

    def load_roi(self):
        for key, value in utils.ROI_PATTERNS.items():
            self.m_listBox_roi.Append(key)

    def onInstituteSelected(self, event):
        self.m_grid_patient.ClearGrid()
        if self.m_grid_patient.GetNumberRows() > 0:
            self.m_grid_patient.DeleteRows(0, self.m_grid_patient.GetNumberRows())
        ins_name = event.GetEventObject().GetStringSelection()

        pats = lambda_model.Patient.objects.\
            filter(institution=lambda_model.Institution.objects.get(name=ins_name))

        for pat in pats:
            self.m_grid_patient.AppendRows()
            row_num = self.m_grid_patient.GetNumberRows() - 1
            self.m_grid_patient.SetCellValue(row_num, 0, str(pat.id))
            self.m_grid_patient.SetCellValue(row_num, 1, str(pat.patient_id))
            self.m_grid_patient.SetCellValue(row_num, 2, pat.name)
            self.m_grid_patient.SetCellValue(row_num, 3, pat.gender)

    def onInstituteSelected2(self, event):
        self.m_grid_patient1.ClearGrid()
        if self.m_grid_patient1.GetNumberRows() > 0:
            self.m_grid_patient1.DeleteRows(0, self.m_grid_patient1.GetNumberRows())
        ins_name = event.GetEventObject().GetStringSelection()

        pats = lambda_model.Patient.objects.\
            filter(institution=lambda_model.Institution.objects.get(name=ins_name))

        for pat in pats:
            self.m_grid_patient1.AppendRows()
            row_num = self.m_grid_patient1.GetNumberRows() - 1
            self.m_grid_patient1.SetCellValue(row_num, 0, str(pat.id))
            self.m_grid_patient1.SetCellValue(row_num, 1, str(pat.patient_id))
            self.m_grid_patient1.SetCellValue(row_num, 2, pat.name)
            self.m_grid_patient1.SetCellValue(row_num, 3, pat.gender)

    def onAddInstitute(self, event):

        ins_name = self.m_textCtrl_institute_name.GetValue()

        if ins_name != '':
            data_insert.addInstitution(ins_name)
            self.load_institute()
        else:
            print("Empty institution name.")

    def onDelInstitute(self, event):

        ins_name = self.m_listBox_institute.GetStringSelection()

        if ins_name != '':
            dlg = wx.MessageDialog(self, 'Do you want to delete institute: {}? '
                                         '\n All the patients in this institute will be delete!'.format(ins_name),
                                         'Del Institute', wx.YES_NO | wx.ICON_QUESTION)
            result = dlg.ShowModal()
            if result == wx.ID_YES:
                ins = lambda_model.Institution.objects.get(name=ins_name)
                ins_folder = settings.LAMBDA_DATA_FOLDER + ins.data_folder
                if os.path.exists(ins_folder):
                    try:
                        shutil.rmtree(ins_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            return
                ins.delete()
                self.load_institute()
                self.m_grid_patient.ClearGrid()
                if self.m_grid_patient.GetNumberRows() > 0:
                    self.m_grid_patient.DeleteRows(0, self.m_grid_patient.GetNumberRows())
            else:
               pass

        else:
            wx.MessageBox("Institution is not selected.")

    def onDelPatient(self, event):

        rows = self.m_grid_patient.GetSelectedRows()
        print(rows)

        dlg = wx.MessageDialog(self, 'Do you want to delete selected patients? ',
                               'Del Patient', wx.YES_NO | wx.ICON_QUESTION)
        result = dlg.ShowModal()
        if result == wx.ID_YES:
            for row in rows:
                pat = lambda_model.Patient.objects.get(id=self.m_grid_patient.GetCellValue(row, 0))

                ins = lambda_model.Institution.objects.get(id = pat.institution_id)
                patient_folder = settings.LAMBDA_DATA_FOLDER + ins.data_folder + pat.data_folder
                pat.delete()
                if os.path.exists(patient_folder):
                    try:
                        shutil.rmtree(patient_folder)
                    except OSError as exc:  # Guard against race condition
                        if exc.errno != errno.EEXIST:
                            print(patient_folder)

            self.m_grid_patient.ClearGrid()
            if self.m_grid_patient.GetNumberRows() > 0:
                self.m_grid_patient.DeleteRows(0, self.m_grid_patient.GetNumberRows())
            ins_name = self.m_listBox_institute.GetStringSelection()

            pats = lambda_model.Patient.objects. \
                filter(institution=lambda_model.Institution.objects.get(name=ins_name))

            for pat in pats:
                self.m_grid_patient.AppendRows()
                row_num = self.m_grid_patient.GetNumberRows() - 1
                self.m_grid_patient.SetCellValue(row_num, 0, str(pat.id))
                self.m_grid_patient.SetCellValue(row_num, 1, str(pat.patient_id))
                self.m_grid_patient.SetCellValue(row_num, 2, pat.name)
                self.m_grid_patient.SetCellValue(row_num, 3, pat.gender)

        else:
            pass

    def onBrowse(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        data_folder = ""

        dlg = wx.DirDialog(self, "Choose a directory:",
                           style=wx.DD_DEFAULT_STYLE
                           )
        default_path = self.m_textCtrl_searchfolder.GetValue()
        if default_path != '':
            default_path = os.path.dirname(default_path)
            dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_textCtrl_searchfolder.Clear()

            self.m_textCtrl_searchfolder.write(dlg.GetPath())
            self.m_search_folder = dlg.GetPath()
        dlg.Destroy()

    def onBrowse_owp(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        dlg = wx.DirDialog(self, "Choose a directory:",
                           style=wx.DD_DEFAULT_STYLE
                           )
        if self.m_weight_path == "":
            default_path = settings.LAMBDA_DATA_FOLDER
        else:
            default_path = self.m_weight_path

        dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_weight_path = dlg.GetPath()
            self.m_textCtrl_output_weight_path.write(self.m_weight_path)
        dlg.Destroy()

        self.onModelWeightNameChange()

    def onBrowse_omp(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        dlg = wx.DirDialog(self, "Choose a directory:",
                           style=wx.DD_DEFAULT_STYLE
                           )
        if self.m_model_path == "":
            default_path = settings.LAMBDA_DATA_FOLDER
        else:
            default_path = self.m_model_path

        dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_model_path = dlg.GetPath()
            self.m_textCtrl_output_model_path.write(self.m_model_path)
        dlg.Destroy()

        self.onModelWeightNameChange()

    def onBrowse_iwp(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        data_folder = ""
        self.m_textCtrl_input_weight_path.Clear()

        dlg = wx.FileDialog(self, "Open a file:", wildcard="hdf5 files (*.hdf5)|*.hdf5",
                            style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST)
        default_path = self.m_textCtrl_input_weight_path.GetValue()
        if default_path != '':
            default_path = os.path.dirname(default_path)
            dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_textCtrl_input_weight_path.write(dlg.GetPath())
        dlg.Destroy()

    def onBrowse_imp(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        data_folder = ""
        self.m_textCtrl_input_model_path.Clear()

        dlg = wx.FileDialog(self, "Open a file:", wildcard="hdf5 files (*.h5)|*.h5",
                            style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST)
        default_path = self.m_textCtrl_input_model_path.GetValue()
        if default_path != '':
            default_path = os.path.dirname(default_path)
            dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_textCtrl_input_model_path.write(dlg.GetPath())
        dlg.Destroy()

    def onImport(self, event):
        search_folder = self.m_textCtrl_searchfolder.GetValue()
        ins_name = self.m_listBox_institute.GetStringSelection()

        if search_folder != '' and ins_name != '':

            self.m_thread_import_terminate = False
            self.t_import_data = threading.Thread(target=self.importData, args=([ins_name, search_folder]))
            self.t_import_data.start()

            self.t_gauge = threading.Thread(target=self.onGauge, args=())
            self.t_gauge.start()

    def importData(self, ins_name, search_folder):
        new_patients = data_insert.importPatientData(ins_name, search_folder)
        ins = lambda_model.Institution.objects.get(name=ins_name)
        for p in new_patients:
            pat = lambda_model.Patient.objects.get(patient_id=p)
            patient_data_folder = settings.LAMBDA_DATA_FOLDER + pat.institution.data_folder + pat.data_folder
            dc = utils.DataConverter()
            dc.generateNrrd(patient_data_folder)
            dc.generatePNGFromNrrd(patient_data_folder)

            #utils.calculateRadiomics(patient_data_folder)
            utils.readUidAndDescriptionFromDicom(patient_data_folder)
            dc.generateCoronalSaggitalContoursForPatientFolder(patient_data_folder)

        self.m_grid_patient.ClearGrid()
        if self.m_grid_patient.GetNumberRows() > 0:
            self.m_grid_patient.DeleteRows(0, self.m_grid_patient.GetNumberRows())

        pats = lambda_model.Patient.objects. \
            filter(institution=lambda_model.Institution.objects.get(name=ins_name))
        for pat in pats:
            self.m_grid_patient.AppendRows()
            row_num = self.m_grid_patient.GetNumberRows() - 1
            self.m_grid_patient.SetCellValue(row_num, 0, str(pat.id))
            self.m_grid_patient.SetCellValue(row_num, 1, str(pat.patient_id))
            self.m_grid_patient.SetCellValue(row_num, 2, pat.name)
            self.m_grid_patient.SetCellValue(row_num, 3, pat.gender)

        self.m_thread_import_terminate = True

    def onTrainSelect(self, event):
        select_inst = self.m_listBox_institute1.GetStringSelection()
        select_roi = self.m_listBox_roi.GetStringSelection()

        if select_inst != '' and select_roi != '':
            self.m_listBox_image_label.Clear()
            image_label_list = data_insert.get_training_image_label_list(select_inst, select_roi)
            self.m_listBox_image_labelChoices = image_label_list

            for il in image_label_list:
                self.m_listBox_image_label.Append(il)

    def onModelWeightNameChange(self, event = None):
        self.m_textCtrl_output_model_path.Clear()
        self.m_textCtrl_output_weight_path.Clear()

        roi = self.m_listBox_roi.GetStringSelection()

        model = "unet"
        dimW = self.m_textCtrl_train_model_wide.GetValue()
        dimH = self.m_textCtrl_train_model_height.GetValue()
        tvr = self.m_textCtrl_TVR.GetValue()
        batch = self.m_textCtrl_batchsize.GetValue()
        stepperepoch = self.m_textCtrl_step_per_epoch.GetValue()
        numepoch = self.m_textCtrl_num_epoch.GetValue()
        validstep = self.m_textCtrl_val_step.GetValue()

        model_name = model + "_"+ roi +"_model_w"+dimW+"_h"+dimH+"_tvr"+tvr+"_"+batch+"_"+stepperepoch+"_"+numepoch+"_"+validstep+".h5"
        weight_name = model + "_"+ roi + "_weight_w"+dimW+"_h"+dimH+"_tvr"+tvr+"_"+batch+"_"+stepperepoch+"_"+numepoch+"_"+validstep+".hdf5"

        model_path = os.path.join(self.m_model_path, model_name)
        weight_path = os.path.join(self.m_weight_path,weight_name)

        self.m_textCtrl_output_model_path.SetValue(model_path)
        self.m_textCtrl_output_weight_path.SetValue(weight_path)

    def onTrain(self, event):
        tvr = float(self.m_textCtrl_TVR.GetValue())
        dimW = int(self.m_textCtrl_train_model_wide.GetValue())
        dimH = int(self.m_textCtrl_train_model_height.GetValue())
        batch = int(self.m_textCtrl_batchsize.GetValue())
        stepperepoch = int(self.m_textCtrl_step_per_epoch.GetValue())
        numepoch = int(self.m_textCtrl_num_epoch.GetValue())
        validstep = int(self.m_textCtrl_val_step.GetValue())
        omp = self.m_textCtrl_output_model_path.GetValue()
        owp = self.m_textCtrl_output_weight_path.GetValue()
        imp = self.m_textCtrl_input_model_path.GetValue()
        iwp = self.m_textCtrl_input_weight_path.GetValue()

        training_image_lable_list = self.m_listBox_image_labelChoices

        unet.train_UNet_model(training_image_lable_list,
                              train_valid_ratio=tvr,
                              dims=[dimW, dimH],
                              batch_size=batch,
                              steps_per_epoch=stepperepoch,
                              nb_epoch=numepoch,
                              validation_steps=validstep,
                              output_weight_path=owp,
                              output_model_path=omp,
                              load_weight_path = iwp,
                              load_model_path = imp)

    def onGenerateContour(self, event):

        imp = self.m_textCtrl_input_model_path1.GetValue()
        iwp = self.m_textCtrl_input_weight_path1.GetValue()

        model_name = os.path.basename(imp)
        roi_name = re.search('_(.+)_model', model_name).group(1)
        width = int(re.search('w(\d+)', model_name).group(1))
        height = int(re.search('h(\d+)', model_name).group(1))
        dc = utils.DataConverter()

        selectedPatients = self.m_grid_patient1.GetSelectedRows()
        for p in selectedPatients:
            print(self.m_grid_patient1.GetCellValue(p, 0))

            patient = lambda_model.Patient.objects. \
                get(id=self.m_grid_patient1.GetCellValue(p, 0))

            patient_data_folder = settings.LAMBDA_DATA_FOLDER + patient.institution.data_folder + patient.data_folder

            ct_list = []
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

            for ct in ct_list:
                if len(ct) > 0:
                    ct_folder = os.path.dirname(ct[0])
                else:
                    continue

                study_folder = os.path.dirname(ct_folder)
                rs_dicom_uid = pydicom.uid.generate_uid()
                t = datetime.now()
                rs_folder_name = t.strftime("%Y%m%d") + "-" + "RTSTRUCT" + "-" + rs_dicom_uid
                rs_folder = os.path.join(study_folder, rs_folder_name)

                #print(ct)
                print(roi_name)
                print([width, height])
                print(iwp)
                print(imp)
                print(rs_folder)

                unet.predict_contour(ct,
                                    roi_name=roi_name,
                                    dims = [width, height],
                                    load_weight_path =iwp,
                                    load_model_path =imp,
                                    output_folder = rs_folder)

                img_folder = os.path.join(rs_folder, roi_name)
                print("study_folder: " + study_folder)
                print("img_folder: " + img_folder)
                nrrd_folder = study_folder.replace("img", "nrrd")
                print("nrrd_folder: " + nrrd_folder)

                dirs = os.listdir(nrrd_folder)
                ct_nrrd_file = ""
                for dir in dirs:
                    if utils.CT_NRRD_PATTERN.match(dir):
                        ct_nrrd_file = os.path.join(nrrd_folder,dir)
                        break

                print("CT_nrrd_file: " + ct_nrrd_file)
                dc.RsImg2Nrrd(img_folder, ct_nrrd_file)

                rs_nrrd_file = img_folder.replace(r"/img", r"/nrrd") + ".nrrd"
                print("rs_nrrd_file: " + rs_nrrd_file)

                rs_nrrd_folder = os.path.dirname(rs_nrrd_file)
                ct_dcm_folder = ct_nrrd_file.replace(".nrrd","").replace("nrrd","dcm")
                output_rs_dicom = rs_nrrd_folder.replace("nrrd", "dcm") + ".dcm"
                print(rs_nrrd_folder)
                print(ct_dcm_folder)
                print(output_rs_dicom)

                dc.RsNrrd2Dicom(rs_nrrd_folder,
                                ct_dcm_folder,
                                output_rs_dicom)

            utils.readUidAndDescriptionFromDicom(patient_data_folder)
            dc.generateCoronalSaggitalContoursForPatientFolder(patient_data_folder)

    def onGauge(self):
        while not self.m_thread_import_terminate:
            self.m_gauge.Pulse()
            time.sleep(0.05)  # wait for next iteration

        self.m_gauge.SetValue(0)

    def onBrowse_iwp1(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        data_folder = ""
        self.m_textCtrl_input_weight_path1.Clear()

        dlg = wx.FileDialog(self, "Open a file:", wildcard="hdf5 files (*.hdf5)|*.hdf5",
                            style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST)
        default_path = self.m_textCtrl_input_weight_path1.GetValue()
        if default_path != '':
            default_path = os.path.dirname(default_path)
            dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_textCtrl_input_weight_path1.write(dlg.GetPath())
        dlg.Destroy()

    def onBrowse_imp1(self, event):
        """
            Show the DirDialog and print the user's choice to stdout
        """
        data_folder = ""
        self.m_textCtrl_input_model_path1.Clear()

        dlg = wx.FileDialog(self, "Open a file:", wildcard="hdf5 files (*.h5)|*.h5",
                            style=wx.FD_OPEN | wx.FD_FILE_MUST_EXIST)
        default_path = self.m_textCtrl_input_model_path1.GetValue()
        if default_path != '':
            default_path = os.path.dirname(default_path)
            dlg.SetPath(default_path)

        if dlg.ShowModal() == wx.ID_OK:
            self.m_textCtrl_input_model_path1.write(dlg.GetPath())
        dlg.Destroy()


def main():
    app = wx.App(False)
    MainFrame = Frame_DicomCollector(None)
    MainFrame.Show()
    app.MainLoop()


if __name__ == '__main__':
    main()
