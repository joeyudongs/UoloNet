from lambda_rad.models import Institution, Patient, MedicalRecord

institution = Institution()
institution.name = "TestInstitution"

p1 = Patient()
p1.mrn = '1'
p1.name_first = 'Li'
p1.name_last = 'Liao'
p1.gender = 'Male'
p1.race = 'Asian'
p1.data_folder = 'D:/lambda/TestInstitution/p1'
p1.institution = institution

p2 = Patient()
p2.mrn = '2'
p2.name_first = 'Xi'
p2.name_last = 'Wang'
p2.gender = 'Female'
p2.race = 'Asian'
p2.data_folder = 'D:/lambda/TestInstitution/p2'
p2.institution = institution

m1 = MedicalRecord()
m1.patient = p1
m1.key = 'Tumor_subsite'
m1.value = 'Tonsil'

m2 = MedicalRecord()
m2.patient = p1
m2.key = 'T_category'
m2.value = '2'

m3 = MedicalRecord()
m3.patient = p1
m3.key = 'Smoking_Pack_Years'
m3.value = 3

institution.save()
p1.save()
p2.save()
m1.save()
m2.save()
m3.save()