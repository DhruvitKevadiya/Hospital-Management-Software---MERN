export const userTypeList = [
  {
    label: "Super Admin",
    value: 1,
  },
  {
    label: "Admin",
    value: 2,
  },
  {
    label: "Clinician",
    value: 3,
  },
  {
    label: "Embryologist",
    value: 4,
  },
];
export const bloodGroupOptions = [
  { value: "A+ve", label: "A+ve" },
  { value: "B+ve", label: "B+ve" },
  { value: "O+ve", label: "O+ve" },
  { value: "AB+ve", label: "AB+ve" },
  { value: "A-ve", label: "A-ve" },
  { value: "B-ve", label: "B-ve" },
  { value: "O-ve", label: "O-ve" },
  { value: "AB-ve", label: "AB-ve" },
  { value: "N.K", label: "N.K" },
];
export const iDCardOptions = [
  { value: "Aadhaar Card", label: "Aadhaar Card" },
  { value: "Pan Card", label: "Pan Card" },
  { value: "Passport", label: "Passport" },
  { value: "Voter ID", label: "Voter ID" },
  { value: "Driving Lic.", label: "Driving Lic." },
];
export const allergyOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const patencyOfTheFallopianTubeOptions = [
  { value: "Unknown", label: "Unknown" },
  { value: "Yes", label: "Yes" },
  { value: "Constricted", label: "Constricted" },
  { value: "No", label: "No" },
  { value: "--", label: "--" },
];

export const chromosomeAnalysisOptions = [
  { value: "Not Performed", label: "Not Performed" },
  {
    value: "No Abnormality Detected",
    label: "No Abnormality Detected",
  },
  {
    value: "Positive Finding",
    label: "Positive Finding",
  },
  { value: "--", label: "--" },
];

// export const pregnancyOutcomeOptions = [
//   {
//     value: "Early abortion",
//     label: "Early abortion"
//   },
//   { value: "Extra uterine pregnancy", label: "Extra uterine pregnancy" },
//   { value: "Heterotopic pregnancy", label: "Heterotopic pregnancy" },
//   { value: "Hydatid mole", label: "Hydatid mole" },
//   { value: "Induced abortion", label: "Induced abortion" },
//   {
//     value: "Late Abortion",
//     label: "Late Abortion"
//   },
//   { value: "Missed abortion", label: "Missed abortion" },
//   { value: "Still birth", label: "Still birth" },
//   { value: "Full Term", label: "Full Term" },
//   { value: "--", label: "--" }
// ];

export const pregnancyOutcomeOptions = [
  {
    value: "Early abortion(till 16th week of Pregnancy)",
    label: "Early abortion (till 16th week of Pregnancy)",
  },
  { value: "Extrauterine pregnancy", label: "Extrauterine pregnancy" },
  { value: "Heterotopic pregnancy", label: "Heterotopic pregnancy" },
  { value: "Hydatid mole", label: "Hydatid mole" },
  { value: "Induced abortion", label: "Induced abortion" },
  {
    value: "Late abortion (17th to 28th week of Pregnancy)",
    label: "Late abortion (17th to 28th week of Pregnancy)",
  },
  { value: "Missed abortion", label: "Missed abortion" },
  {
    value: "On schedule (vital signs from 38th week of Pregnancy)",
    label: "On schedule (vital signs from 38th week of Pregnancy)",
  },
  { value: "Still Birth", label: "Still Birth" },
  { value: "Primary infertility", label: "Primary infertility" },
  { value: "Secondary infertility", label: "Secondary infertility" },
  { value: "--", label: "--" },
];

export const withPartnerOptions = [
  { value: "Current Partner", label: "Current Partner" },
  { value: "Other Partner", label: "Other Partner" },
  { value: "Unknown Partner", label: "Unknown Partner" },
  { value: "--", label: "--" },
];

export const deliveryMethodOptions = [
  {
    value: "Vaginally Spontaneously",
    label: "Vaginally Spontaneously",
  },
  { value: "Unknown", label: "Unknown" },
  {
    value: "Vaginally Operatively",
    label: "Vaginally Operatively",
  },
  { value: "Sectio", label: "Sectio" },
  {
    value: "Breech presentation Vaginally",
    label: "Breech presentation Vaginally",
  },
  { value: "Laproscopy", label: "Laproscopy" },
  { value: "Laparotomy", label: "Laparotomy" },
  { value: "--", label: "--" },
  // {
  //   value: "MCdonald's",
  //   label: "MCdonald's"
  // },
  // { value: "Shirodkar", label: "Shirodkar" },
  // {
  //   value: "Modified Shirodkar",
  //   label: "Modified Shirodkar"
  // },
  // { value: "--", label: "--" }
];

export const cycleMethodOptions = [
  {
    value: "MCdonald's",
    label: "MCdonald's",
  },
  { value: "Shirodkar", label: "Shirodkar" },
  {
    value: "Modified Shirodkar",
    label: "Modified Shirodkar",
  },
  { value: "--", label: "--" },
];

export const previousIllnessesOptions = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Diabetes Mellitus",
    label: "Diabetes Mellitus",
  },
  {
    value: "Hyperandrogenemia",
    label: "Hyperandrogenemia",
  },
  {
    value: "Malignant Tumor",
    label: "Malignant Tumor",
  },
  {
    value: "Nicotine Intake",
    label: "Nicotine Intake",
  },
  {
    value: "None",
    label: "None",
  },
  {
    value: "Obesity (BMI>30)",
    label: "Obesity (BMI>30)",
  },
  {
    value: "Organic Disorder of the inner genital",
    label: "Organic Disorder of the inner genital",
  },
  {
    value: "PCO",
    label: "PCO",
  },
  {
    value: "Pre-existing psyclic/psychiatric condition",
    label: "Pre-existing psyclic/psychiatric condition",
  },
  {
    value: "Severe Allergy",
    label: "Severe Allergy",
  },
  {
    value: "Thrombo-embolic insult ",
    label: "Thrombo-embolic insult ",
  },
  {
    value: "Unknown",
    label: "Unknown",
  },
  {
    value: "Hypothyroidism",
    label: "Hypothyroidism",
  },
  {
    value: "Hyperthyroidism",
    label: "Hyperthyroidism",
  },
  {
    value: "Hypertension",
    label: "Hypertension",
  },
  {
    value: "Thalassemia minor",
    label: "Thalassemia minor",
  },
  {
    value: "Both Parents Thalassemia Minor",
    label: "Both Parents Thalassemia Minor",
  },
  {
    value: "Sickle Cell",
    label: "Sickle Cell",
  },
  {
    value: "Depression",
    label: "Depression",
  },
  {
    value: "Aplastic Anaemia",
    label: "Aplastic Anaemia",
  },
  {
    value: "Organic Disorder",
    label: "Organic Disorder",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const sterilityFactorsOptions = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Endometriosis",
    label: "Endometriosis",
  },
  {
    value: "Hyperandrogenemia/ PCO",
    label: "Hyperandrogenemia/ PCO",
  },
  {
    value:
      "Path Cycle Other endoorinalagical disorders excluding hyperandrogenemia",
    label:
      "Path Cycle Other endoorinalagical disorders excluding hyperandrogenemia",
  },
  {
    value: "Psychogenic Factors",
    label: "Psychogenic Factors",
  },
  {
    value: "Sexual Disorders",
    label: "Sexual Disorders",
  },
  {
    value: "Status after sterilization",
    label: "Status after sterilization",
  },
  {
    value: "Tubal Pathology",
    label: "Tubal Pathology",
  },
  {
    value: "Uterine, Cervix factor",
    label: "Uterine, Cervix factor",
  },
  {
    value: "Male Factor",
    label: "Male Factor",
  },
  {
    value: `Asherman's Syndrome`,
    label: `Asherman's Syndrome`,
  },
  {
    value: "Genectic Factor",
    label: "Genectic Factor",
  },
  {
    value: "Low Ovarian Reserve",
    label: "Low Ovarian Reserve",
  },
  {
    value: "Primary Ovarian Failure",
    label: "Primary Ovarian Failure",
  },
  {
    value: "Primary Amenorrhoea",
    label: "Primary Amenorrhoea",
  },
  {
    value: "Menopausal",
    label: "Menopausal",
  },
  {
    value: "Unexplained",
    label: "Unexplained",
  },
  {
    value: "RIF",
    label: "RIF",
  },
  {
    value: "BOH",
    label: "BOH",
  },
  {
    value: "MRKH",
    label: "MRKH",
  },
  {
    value: "Premature Ovarian Failure",
    label: "Premature Ovarian Failure",
  },
  {
    value: "Secondary Amenorrhoea",
    label: "Secondary Amenorrhoea",
  },
  {
    value: "Primary Infertility",
    label: "Primary Infertility",
  },
  {
    value: "Secondary Infertility",
    label: "Secondary Infertility",
  },
  {
    value: "Professional Donor",
    label: "Professional Donor",
  },
  {
    value: "Uterine Anomaly",
    label: "Uterine Anomaly",
  },
  {
    value: "Hupogonadotropic Hypogonadism",
    label: "Hupogonadotropic Hypogonadism",
  },
  {
    value: "Adenomyotic Uterus",
    label: "Adenomyotic Uterus",
  },
  {
    value: "Multiple Fibroid Uterus",
    label: "Multiple Fibroid Uterus",
  },
  {
    value: "None",
    label: "None",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const regularityOptions = [
  { value: "Regular", label: "Regular" },
  { value: "Irregular", label: "Irregular" },
  { value: "Early", label: "Early" },
  { value: "Delayed", label: "Delayed" },
  { value: "Menopausal", label: "Menopausal" },
  { value: "Only withdrawal bleeding", label: "Only withdrawal bleeding" },
  { value: "With O-Cpill", label: "With O-Cpill" },
  { value: "--", label: "--" },
];

export const intensityOptions = [
  { value: "Normal", label: "Normal" },
  { value: "Scary", label: "Scary" },
  { value: "Moderate", label: "Moderate" },
  { value: "Excessive", label: "Excessive" },
];

export const typeOptionsForPatientExtendedHistory = [
  { value: "I", label: "I" },
  { value: "II", label: "II" },
  { value: "--", label: "--" },
];

export const hivOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
];

export const hBsAgOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
];

export const uptTestOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
];

export const VDRLOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
];

export const fertilityImpairmentFactorOptions = [
  {
    value: "Anejaculation",
    label: "Anejaculation",
  },
  {
    value: "Azoospermia Except Sterilization",
    label: "Azoospermia Except Sterilization",
  },
  {
    value: "Congenital Bilateral Occlusion",
    label: "Congenital Bilateral Occlusion",
  },
  {
    value: "Impaired Spermiagram",
    label: "Impaired Spermiagram",
  },
  {
    value: "Marginally Impaired Spermiogram",
    label: "Marginally Impaired Spermiogram",
  },
  {
    value: "Neuragenic Disorder",
    label: "Neuragenic Disorder",
  },
  {
    value: "Previous absent or poor IVF-Fertilization",
    label: "Previous absent or poor IVF-Fertilization",
  },
  {
    value: "Retrograde Ejaculation",
    label: "Retrograde Ejaculation",
  },
  {
    value: "Sexual Disorders",
    label: "Sexual Disorders",
  },
  {
    value: "Unknown",
    label: "Unknown",
  },
  {
    value: "Varicocele",
    label: "Varicocele",
  },
  {
    value: "Obstructive Azoospermia",
    label: "Obstructive Azoospermia",
  },
  {
    value: "Non Obstructive Azoospermia",
    label: "Non Obstructive Azoospermia",
  },
  {
    value: "congenital absence of bilateral vas deferens",
    label: "congenital absence of bilateral vas deferens",
  },
  {
    value: "None",
    label: "None",
  },
  {
    value: "Other",
    label: "Other",
  },
];
export const hysteroscopyOption = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "septum",
    label: "septum",
  },
  {
    value: "Asherman",
    label: "Asherman",
  },
  {
    value: "Others",
    label: "Others",
  },
];
export const findingsOption = [
  { value: "--", label: "--" },
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "Drilling Done",
    label: "Drilling Done",
  },
  {
    value: "Abnormal",
    label: "Abnormal",
  },
];
export const tbpcrOption = [
  { value: "--", label: "--" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const ovariesOption = [
  { value: "--", label: "--" },
  { value: "Normal", label: "Normal" },
  { value: "Drilling Done", label: "Drilling Done" },
  { value: "Abnormal", label: "Abnormal" },
];

export const reportDoneByOptions = [
  {
    value: "Dr. Shubhra Tripathi",
    label: "Dr. Shubhra Tripathi",
  },
  {
    value: "Dr. Pooja Nadkarni",
    label: "Dr. Pooja Nadkarni",
  },
  {
    value: "Dr. Harshil Shah",
    label: "Dr. Harshil Shah",
  },
  {
    value: "Dr. Akshay Nadkarni",
    label: "Dr. Akshay Nadkarni",
  },
  { value: "Dr. Birva Dave", label: "Dr. Birva Dave" },
  {
    value: "Dr. Yuvrajsingh Jadeja",
    label: "Dr. Yuvrajsingh Jadeja",
  },
  {
    value: "Dr. Gopal vekariya",
    label: "Dr. Gopal vekariya",
  },
  {
    value: "Dr. Praful Doshi",
    label: "Dr. Praful Doshi",
  },
  { value: "Dr nimesh patel", label: "Dr nimesh patel" },
  {
    value: "Dr. Gopal Vekariya",
    label: "Dr. Gopal Vekariya",
  },
  {
    value: "Dr jayna unadkat",
    label: "Dr jayna unadkat",
  },
  { value: "Dr swar shah", label: "Dr swar shah" },
  {
    value: "Dr sanjay brahmbhatt",
    label: "Dr sanjay brahmbhatt",
  },
  {
    value: "Dr poornima mathur",
    label: "Dr poornima mathur",
  },
  { value: "Dr Amit kalyani", label: "Dr Amit kalyani" },
  { value: "Other", label: "Other" },
];

export const tubesOption = [
  { value: "--", label: "--" },
  { value: "Normal", label: "Normal" },
  { value: "BilateralBlock", label: "Bilateral Block" },
  { value: "UnilateralBlock", label: "Unilateral Block" },
  { value: "Hydrosalpinx", label: "Hydrosalpinx" },
  { value: "Others", label: "Others" },
];

export const endometriosisOption = [
  { value: "--", label: "--" },
  { value: "Absent", label: "Absent" },
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
  { value: "Grade 4", label: "Grade 4" },
];

export const tvsUterusOption = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "Septate",
    label: "Septate",
  },
  {
    value: "Adenomyotic",
    label: "Adenomyotic",
  },
  {
    value: "Fibroid",
    label: "Fibroid",
  },
  {
    value: "Polyp",
    label: "Polyp",
  },
  {
    value: "Endo. Hyperplasia",
    label: "Endo. Hyperplasia",
  },
  {
    value: "Bicornuate",
    label: "Bicornuate",
  },
  {
    value: "Unicornuate",
    label: "Unicornuate",
  },
  {
    value: "Atrophic",
    label: "Atrophic",
  },
  {
    value: "Smaller Than Normal",
    label: "Smaller Than Normal",
  },
  {
    value: "Uterinedidelphis",
    label: "Uterinedidelphis",
  },
  {
    value: "Cystic glandular hyperplasia",
    label: "Cystic glandular hyperplasia",
  },
  {
    value: "Cut in situ",
    label: "Cut in situ",
  },
  {
    value: "absent",
    label: "absent",
  },
  {
    value: "Hypoplastic",
    label: "Hypoplastic",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const rightOvariesOption = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "PCOD",
    label: "PCOD",
  },
  {
    value: "Dermoid",
    label: "Dermoid",
  },
  {
    value: "C.L.Cyst",
    label: "C.L.Cyst",
  },
  {
    value: "Hydrosalpinx",
    label: "Hydrosalpinx",
  },
  {
    value: "Hemorrhage Cyst",
    label: "Hemorrhage Cyst",
  },
  {
    value: "Endometriosic",
    label: "Endometriosic",
  },
  {
    value: "Smaller than Normal",
    label: "Smaller than Normal",
  },
  {
    value: "Endometrioma",
    label: "Endometrioma",
  },
  {
    value: "Low AFC",
    label: "Low AFC",
  },
  {
    value: "Atrophic",
    label: "Atrophic",
  },
  {
    value: "Tubo Ovarian Mass",
    label: "Tubo Ovarian Mass",
  },
  {
    value: "Par Ovarian Cyst",
    label: "Par Ovarian Cyst",
  },
  {
    value: "Absent",
    label: "Absent",
  },
  {
    value: "AFC",
    label: "AFC",
  },
  {
    value: "Not Visualised",
    label: "Not Visualised",
  },
  {
    value: "Stuck to Fundus",
    label: "Stuck to Fundus",
  },
  {
    value: "Others",
    label: "Others",
  },
];

export const patencyofFallopianTubeOption = [
  { value: "--", label: "--" },
  { value: "Patent", label: "Patent" },
  { value: "Constricted", label: "Constricted" },
  { value: "Blocked", label: "Blocked" },
];

export const uterusOption = [
  { value: "Normal", label: "Normal" },
  { value: "Shadow", label: "Shadow" },
  { value: "Fill Defect", label: "Fill Defect" },
  { value: "Abnormalities", label: "Abnormalities" },
  { value: "--", label: "--" },
];

export const fallopianTubeOption = [
  { value: "--", label: "--" },
  { value: "Hydrosalpinx", label: "Hydrosalpinx" },
  {
    value: "Pertitubal Adhesions",
    label: "Pertitubal Adhesions",
  },
];

export const noOfFetalSacOption = [
  { value: "--", label: "--" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

export const PGProgressOption = [
  { value: "--", label: "--" },
  { value: "Not Specified", label: "Not Specified" },
  { value: "Unknown", label: "Unknown" },
  { value: "Continuous", label: "Continuous" },
  { value: "Spontaneous Abrtion", label: "Spontaneous Abrtion" },
  { value: "Induced Abortion", label: "Induced Abortion" },
  { value: "Embryo Reduction", label: "Embryo Reduction" },
  { value: "Selective Reduction", label: "Selective Reduction" },
  { value: "Blighted Ovum", label: "Blighted Ovum" },
  { value: "Extra Uterine", label: "Extra Uterine" },
];

export const indicationOption = [
  { value: "--", label: "--" },
  { value: "Chromosomal Abnormality", label: "Chromosomal Abnormality" },
  { value: "Desired Reduction", label: "Desired Reduction" },
  { value: "Malformation", label: "Malformation" },
  { value: "Social Indiaction", label: "Social Indiaction" },
  { value: "None", label: "None" },
  { value: "Bleeding", label: "Bleeding" },
  { value: "Passing", label: "Passing" },
  { value: "Vaginal infection", label: "Vaginal infection" },
  { value: "Amnion-infection-syndrome", label: "Amnion-infection-syndrome" },
  { value: "Fever", label: "Fever" },
  { value: "Unknown", label: "Unknown" },
  { value: "IUFD", label: "IUFD" },
  { value: "Placenta Praevia", label: "Placenta Praevia" },
  {
    value: "Premature Separation Of Placenta",
    label: "Premature Separation Of Placenta",
  },
  {
    value: "Premature Rupture Of Fetal Membranes",
    label: "Premature Rupture Of Fetal Membranes",
  },
  { value: "Amnion-infection-syndrome", label: "Amnion-infection-syndrome" },
  { value: "Tupture of Uterus", label: "Tupture of Uterus" },
  { value: "Imminent Pre term Delivery", label: "Imminent Pre term Delivery" },
  { value: "GDM", label: "GDM" },
  { value: "PIH", label: "PIH" },
  { value: "IUGR", label: "IUGR" },
  { value: "HELLP Syndrome", label: "HELLP Syndrome" },
  { value: "Other", label: "Other" },
];

export const pGProgressOption = [];

export const leftOvariesOption = [
  {
    value: "--",
    label: "--",
  },
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "PCOD",
    label: "PCOD",
  },
  {
    value: "Dermoid",
    label: "Dermoid",
  },
  {
    value: "C.L.Cyst",
    label: "C.L.Cyst",
  },
  {
    value: "Hydrosalpinx",
    label: "Hydrosalpinx",
  },
  {
    value: "Hemorrhage Cyst",
    label: "Hemorrhage Cyst",
  },
  {
    value: "Endometriosic",
    label: "Endometriosic",
  },
  {
    value: "Smaller than Normal",
    label: "Smaller than Normal",
  },
  {
    value: "Endometrioma",
    label: "Endometrioma",
  },
  {
    value: "Low AFC",
    label: "Low AFC",
  },
  {
    value: "Atrophic",
    label: "Atrophic",
  },
  {
    value: "Absent",
    label: "Absent",
  },
  {
    value: "AFC",
    label: "AFC",
  },
  {
    value: "Not Visualised",
    label: "Not Visualised",
  },
  {
    value: "Stuck to Fundus",
    label: "Stuck to Fundus",
  },
  {
    value: "ERA",
    label: "ERA",
  },
  {
    value: "Others",
    label: "Others",
  },
];
export const referenceTypeOption = [
  { value: "Doctor", label: "Doctor" },
  { value: "Newspaper advertisement", label: "Newspaper advertisement" },
  { value: "Radio", label: "Radio" },
  { value: "Instagram", label: "Instagram" },
  { value: "Google Search", label: "Google Search" },
  { value: "Patient", label: "Patient" },
  { value: "Friends / Relative", label: "Friends / Relative" },
  { value: "Camp", label: "Camp" },
  { value: "Agent", label: "Agent" },
  { value: "Other", label: "Other" },
];
export const dfi = [
  {
    value: "Excellent",
    label: "Excellent",
  },
  {
    value: "Poor",
    label: "Poor",
  },
  {
    value: "Fair",
    label: "Fair",
  },
  {
    value: "Good to fair",
    label: "Good to fair",
  },
  {
    value: "Fair to poor",
    label: "Fair to poor",
  },
  {
    value: "Extremely poor",
    label: "Extremely poor",
  },
  {
    value: "--",
    label: "--",
  },
];
export const protocolOption = [
  {
    value: "Antagonist",
    label: "Antagonist",
  },
  {
    value: "Long Short",
    label: "Long Short",
  },
  {
    value: "Ultrashort",
    label: "Ultrashort",
  },
  {
    value: "Long",
    label: "Long",
  },
  {
    value: "Short",
    label: "Short",
  },
  {
    value: "Mos",
    label: "Mos",
  },
  {
    value: "No supretact ",
    label: "No supretact ",
  },
  {
    value: "Fet",
    label: "Fet",
  },
  {
    value: "Microdose long",
    label: "Microdose long",
  },
  {
    value: "Ultralong",
    label: "Ultralong",
  },
  {
    value: "Stop protocol",
    label: "Stop protocol",
  },
  {
    value: "Others",
    label: "Others",
  },
];
export const plannedSpermCollectionOption = [
  {
    value: "Not Specified",
    label: "Not Specified",
  },
  {
    value: "Antegrade Ejaculation",
    label: "Antegrade Ejaculation",
  },
  {
    value: "Retrograde Ejaculation",
    label: "Retrograde Ejaculation",
  },
  {
    value: "Cryo Sperm",
    label: "Cryo Sperm",
  },
  { value: "MESA", label: "MESA" },
  { value: "Thawed MESA", label: "Thawed MESA" },
  { value: "PESA", label: "PESA" },
  { value: "Thawed PESA", label: "Thawed PESA" },
  { value: "TESE", label: "TESE" },
  { value: "TESA", label: "TESA" },
  { value: "Thawed TESA", label: "Thawed TESA" },
  { value: "Thawed MICRO TESA", label: "Thawed MICRO TESA" },
  { value: "Donor Sperm", label: "Donor Sperm" },
  { value: "Thawed ESA", label: "Thawed ESA" },
  {
    value: "Own D.S",
    label: "Own D.S",
  },
  {
    value: "MICRO TESE",
    label: "MICRO TESE",
  },
];

export const additionalMeasuresOption = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Assisted Hatching",
    value: "Assisted Hatching",
  },
  {
    label: "Polar Body Biopsy",
    value: "Polar Body Biopsy",
  },
  {
    label: "Co-Culture",
    value: "Co-Culture",
  },
  {
    label: "Cryopreservation",
    value: "Cryopreservation",
  },
  {
    label: "PGT-A",
    value: "PGT-A",
  },
  {
    label: "PGT-M",
    value: "PGT-M",
  },
  {
    label: "PGT-SR",
    value: "PGT-SR",
  },
  {
    label: "Blastocyst",
    value: "Blastocyst",
  },
  {
    label: "Ovarian Rejuvenation PRP",
    value: "Ovarian Rejuvenation PRP",
  },
  // {
  //   label: "Sub-Endometrial PRP",
  //   value: "Sub-Endometrial PRP",
  // },
  // {
  //   label: "Endometrial PRP",
  //   value: "Endometrial PRP",
  // },
  {
    label: "Lymphocyte Immunization Therapy (LIT)",
    value: "Lymphocyte Immunization Therapy (LIT)",
  },
  {
    label: "Oocyte Vitrification",
    value: "Oocyte Vitrification",
  },
  {
    label: "Oocyte Activation",
    value: "Oocyte Activation",
  },
];

export const pgtsOption = [
  {
    label: "NA",
    value: "NA",
  },
  {
    label: "Age",
    value: "Age",
  },
  {
    label: "ART without pregnancy",
    value: "ART without pregnancy",
  },
  {
    label: "ART with abortion ",
    value: "ART with abortion ",
  },
  {
    label: "Abortion without ART",
    value: "Abortion without ART",
  },
  {
    label: "Patients wish",
    value: "Patients wish",
  },
  {
    label: "RIF",
    value: "RIF",
  },
  {
    label: "Genetic factor",
    value: "Genetic factor",
  },
  {
    label: "Single gene disease",
    value: "Single gene disease",
  },
  {
    label: "Maternal Karyotype",
    value: "Maternal Karyotype",
  },
  {
    label: "Paternal Karyotype",
    value: "Paternal Karyotype",
  },
  {
    label: "Genera linked disease",
    value: "Genera linked disease",
  },
];

export const plannedCycleOption = [
  {
    label: "Fresh",
    value: "Fresh",
  },
  {
    label: "Fresh ET",
    value: "Fresh ET",
  },
  {
    label: "OD",
    value: "OD",
  },
  {
    label: "ED",
    value: "ED",
  },
  {
    label: "FET",
    value: "FET",
  },
  {
    label: "Surrogacy",
    value: "Surrogacy",
  },
  {
    label: "ICSI-DS",
    value: "ICSI-DS",
  },
  {
    label: "IVF",
    value: "IVF",
  },
  {
    label: "TESA/PESA",
    value: "TESA/PESA",
  },
  {
    label: "Oocytes Vitrification",
    value: "Oocytes Vitrification",
  },
  {
    label: "Thawed Oocytes ICSI",
    value: "Thawed Oocytes ICSI",
  },
  {
    label: "Professional Donor",
    value: "Professional Donor",
  },
];

export const cycleOptions = [
  { value: "Own", label: "Own" },
  { value: "OD", label: "OD" },
  { value: "DS", label: "DS" },
  { value: "ED", label: "ED" },
];

export const idiopathicOption = [
  { value: "Oligospermia", label: "Oligospermia" },
  {
    value: "Asthenozoospermia",
    label: "Asthenozoospermia",
  },
  { value: "Aspermia", label: "Aspermia" },
  {
    value: "Azoospermia Except Sterilization",
    label: "Azoospermia Except Sterilization",
  },
  {
    value: "Teratozoospermia",
    label: "Teratozoospermia",
  },
  { value: "Necrozoospermia", label: "Necrozoospermia" },
  { value: "None", label: "None" },
];

export const additionalillnesses = [
  { value: "Globozoospermia", label: "Globozoospermia" },
  { value: "Necrospermia", label: "Necrospermia" },
  { value: "Severe OATS", label: "Severe OATS" },
  { value: "None", label: "None" },
];

export const habitsOptions = [
  { value: "Alcohol", label: "Alcohol" },
  { value: "Tobacco chewing", label: "Tobacco chewing" },
  { value: "Smoking", label: "Smoking" },
  { value: "E cigarettes", label: "E cigarettes" },
  { value: "--", label: "--" },
];

export const inflammationOptions = [
  { value: "--", label: "--" },
  { value: "Urethritis", label: "Urethritis" },
  { value: "Prostalitis", label: "Prostalitis" },
  { value: "Epididymitis", label: "Epididymitis" },
];

export const varicoceleOptions = [
  { value: "--", label: "--" },
  { value: "Grade I", label: "Grade I" },
  { value: "Grade II", label: "Grade II" },
  { value: "Right", label: "Right" },
  { value: "Left", label: "Left" },
  { value: "Both", label: "Both" },
];

export const procedureOptions = [
  {
    value: "Stimulation given using antagonist protocol",
    label: "Stimulation given using antagonist protocol",
  },
  {
    value: "Stimulation given microdose long protocol",
    label: "Stimulation given microdose long protocol",
  },
  {
    value: "Stimulation given microdose flare protocol",
    label: "Stimulation given microdose flare protocol",
  },
  {
    value: "Stimulation given ultrashort protocol",
    label: "Stimulation given ultrashort protocol",
  },
  {
    value: "Stimulation given short protocol",
    label: "Stimulation given short protocol",
  },
  {
    value: "Stimulation given stop protocol",
    label: "Stimulation given stop protocol",
  },
  {
    value: "Frozen embryo transfer",
    label: "Frozen embryo transfer",
  },
  {
    value: "Frozen embryo transfer + surrogacy",
    label: "Frozen embryo transfer + surrogacy",
  },
  {
    value: "Stimulation given to donor using antagonist protocol",
    label: "Stimulation given to donor using antagonist protocol",
  },
];

export const embryosTransferredOptions = [
  {
    value: "As PGTA was planned, embryo transfer was not done.",
    label: "As PGTA was planned, embryo transfer was not done.",
  },
  {
    value:
      "As hysteroscopy was done on the day of pick up, embryo transfer was not done.",
    label:
      "As hysteroscopy was done on the day of pick up, embryo transfer was not done.",
  },
  {
    value: "As embryo pooling was planned. embryo transfer was not done.",
    label: "As embryo pooling was planned. embryo transfer was not done.",
  },
  {
    value: "To prevent OHSS, embryo transfer was not done.",
    label: "To prevent OHSS, embryo transfer was not done.",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const icsiDoneWithOptions = [
  {
    value: "Husband's sperm",
    label: "Husband's sperm",
  },
  {
    value: "Husband's frozen sperm",
    label: "Husband's frozen sperm",
  },
  {
    value: "D.S.",
    label: "D.S.",
  },
  {
    value: "D.S. (own)",
    label: "D.S. (own)",
  },
  {
    value: "Husband's sperm as well as D.S.",
    label: "Husband's sperm as well as D.S.",
  },
  // {
  //   value: "Stimulation given stop protocol",
  //   label: "Stimulation given stop protocol",
  // },
  // {
  //   value: "Frozen embryo transfer",
  //   label: "Frozen embryo transfer",
  // },
  // {
  //   value: "Frozen embryo transfer + surrogacy",
  //   label: "Frozen embryo transfer + surrogacy",
  // },
  // {
  //   value: "Stimulation given to donor using antagonist protocol",
  //   label: "Stimulation given to donor using antagonist protocol",
  // },
];

export const transferDoneInSingleTrialStayUneventfulDoneUnderUSGGuidenceOptions =
  [
    {
      value: "Easy",
      label: "Easy",
    },
    {
      value: "Difficult",
      label: "Difficult",
    },
  ];

export const incubatorOptions = [
  {
    value: "MInc 1",
    label: "MInc 1",
  },
  {
    value: "MInc 2",
    label: "MInc 2",
  },
  {
    value: "MInc +",
    label: "MInc +",
  },
  {
    value: "Heracell",
    label: "Heracell",
  },
  {
    value: "Astec",
    label: "Astec",
  },
  {
    value: "TIME-LAPSE",
    label: "TIME-LAPSE",
  },
  {
    value: "Planner",
    label: "Planner",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const spermsQualityOptions = [
  { value: "Normal", label: "Normal" },
  { value: "Obstructive Azoospermia", label: "Obstructive Azoospermia" },
  { value: "Non-Obstructive Azoospermia", label: "Non-Obstructive Azoospermia" },
  { value: "Partial Globozoospermia", label: "Partial Globozoospermia" },
  { value: "Absolute Globozoospermia", label: "Absolute Globozoospermia" },
  { value: "Cryptozoospermia", label: "Cryptozoospermia" },
  { value: "Oligospermia", label: "Oligospermia" },
  { value: "Asthenospermia", label: "Asthenospermia" },
  { value: "Teratospermia", label: "Teratospermia" },
  { value: "OATS", label: "OATS" },
  { value: "Severe OATS", label: "Severe OATS" },
  { value: "Necrozoospermia", label: "Necrozoospermia" },
  { value: "Hypospermia", label: "Hypospermia" },
  { value: "Leucocytospermia", label: "Leucocytospermia" },
  { value: "Bacterial Infection (+++)", label: "Bacterial Infection (+++)" },
  { value: "Other", label: "Other" },
];

export const statusOptions = [
  {
    value: "PGT",
    label: "PGT",
  },
  {
    value: "Non - PGT",
    label: "Non - PGT",
  },
];

export const anesthesiaOption = [
  { value: "S.A.", label: "S.A." },
  { value: "GA", label: "GA" },
  { value: "Epidural Anesthesia", label: "Epidural Anesthesia" },
  { value: "Local Anesthesia", label: "Local Anesthesia" },
  { value: "Block Anesthesia", label: "Block Anesthesia" },
  { value: "Regional Anesthesia", label: "Regional Anesthesia" },
  { value: "Spinal Anesthesia", label: "Spinal Anesthesia" },
  { value: "General Anesthesia", label: "General Anesthesia" },
];

export const deliveryTypeOptions = [
  { value: "FTND", label: "FTND" },
  { value: "PTND", label: "PTND" },
  { value: "LSCS", label: "LSCS" },
  { value: "PTLSCS", label: "PTLSCS" },
  { value: "EMLSCS", label: "EMLSCS" },
  { value: "Vaccum", label: "Vaccum" },
];

export const statusOptionsFinalOutCome = [
  { value: "Live", label: "Live" },
  { value: "IUFD", label: "IUFD" },
];

export const sexOfChildOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const strawColorOptions = [
  { value: "Blue", label: "Blue" },
  { value: "Blue⭐", label: "Blue⭐" },
  { value: "Green", label: "Green" },
  { value: "Green⭐", label: "Green⭐" },
  { value: "Pink", label: "Pink" },
  { value: "Pink⭐", label: "Pink⭐" },
  { value: "Yellow", label: "Yellow" },
  { value: "Yellow⭐", label: "Yellow⭐" },
  { value: "White", label: "White" },
  { value: "White⭐", label: "White⭐" },
  { value: "Other", label: "Other" },
];

export const gobletColorOptions = [
  { value: "Blue", label: "Blue" },
  { value: "Blue⭐", label: "Blue⭐" },
  { value: "Green", label: "Green" },
  { value: "Green⭐", label: "Green⭐" },
  { value: "Pink", label: "Pink" },
  { value: "Pink⭐", label: "Pink⭐" },
  { value: "Yellow", label: "Yellow" },
  { value: "Yellow⭐", label: "Yellow⭐" },
  { value: "White", label: "White" },
  { value: "White⭐", label: "White⭐" },
  { value: "Purple", label: "Purple" },
  { value: "Purple⭐", label: "Purple⭐" },
  { value: "Orange", label: "Orange" },
  { value: "Orange⭐", label: "Orange⭐" },
  { value: "Sky", label: "Sky" },
  { value: "Sky⭐", label: "Sky⭐" },
  { value: "Light Green", label: "Light Green" },
  { value: "Light Green⭐", label: "Light Green⭐" },
  { value: "Light Pink", label: "Light Pink" },
  { value: "Light Pink⭐", label: "Light Pink⭐" },
  { value: "Other", label: "Other" },
];

export const stage2Options = [
  { value: "Day 5", label: "Day 5" },
  { value: "Day 6", label: "Day 6" },
  { value: "Day 7", label: "Day 7" },
  { value: "Arrested", label: "Arrested" },
];

export const vitrificationIdOptions = [
  { value: "DR. PRABHAKAR SINGH", label: "DR. PRABHAKAR SINGH" },
  { value: "DHRUTI BHATT", label: "DHRUTI BHATT" },
  { value: "MEHA DESAI", label: "MEHA DESAI" },
  { value: "PRIYANKA RAJPUT", label: "PRIYANKA RAJPUT" },
  { value: "SHRADDHA MANDAVIYA", label: "SHRADDHA MANDAVIYA" },
  { value: "SAPNA TRADA", label: "SAPNA TRADA" },
  { value: "JIGNASHA VELARIYA", label: "JIGNASHA VELARIYA" },
  { value: "JMOHAMMAD MASI", label: "JMOHAMMAD MASI" },
  { value: "JANKI CHOKSI", label: "JANKI CHOKSI" },
  { value: "NEHA GOSWAMI", label: "NEHA GOSWAMI" },
  { value: "OTHER", label: "OTHER" },
];

export const anetheistNameOptions = [
  { value: "DR. HIMANSHU NANDWANI", label: "DR. HIMANSHU NANDWANI" },
  { value: "DR. JIGAR BHUTWALA", label: "DR. JIGAR BHUTWALA" },
  { value: "DR. NIKUNJ REVDIWALA", label: "DR. NIKUNJ REVDIWALA" },
  { value: "NA", label: "NA" },
  { value: "Other", label: "Other" },
];

export const paeditricianAttendedOptions = [
  { value: "Dr neena pillai", label: "Dr neena pillai" },
  { value: "Dr. Parth Soni", label: "Dr. Parth Soni" },
  { value: "Dr. Santosh Yadav", label: "Dr. Santosh Yadav" },
  { value: "Dr khushbu tankshali ", label: "Dr khushbu tankshali " },
  { value: "Other", label: "Other" },
];

export const spermsOptions = [
  { value: "Own Fresh", label: "Own Fresh" },
  { value: "Own Thawed", label: "Own Thawed" },
  { value: "Donor Fresh", label: "Donor Fresh" },
  { value: "Donor Thawed", label: "Donor Thawed" },
  { value: "TESA Fresh", label: "TESA Fresh" },
  { value: "TESA Thawed", label: "TESA Thawed" },
  { value: "PESA Fresh", label: "PESA Fresh" },
  { value: "PESA Thawed", label: "PESA Thawed" },
  { value: "Micro TESA Fresh", label: "Micro TESA Fresh" },
  { value: "Micro TESA Thawed", label: "Micro TESA Thawed" },
];

export const eggsOptions = [
  { value: "Own Fresh", label: "Own Fresh" },
  { value: "Own Thawed", label: "Own Thawed" },
  { value: "Donor Fresh", label: "Donor Fresh" },
  { value: "Donor Thawed", label: "Donor Thawed" },
]

export const spermsPrepMethodOptions = [
  { value: "Direct SWIM-UP", label: "Direct SWIM-UP" },
  { value: "Pellet SWIM-UP", label: "Pellet SWIM-UP" },
  {
    value: "Single SWIM-DOWN",
    label: "Single SWIM-DOWN",
  },
  {
    value: "Double SWIM-DOWN",
    label: "Double SWIM-DOWN",
  },
  {
    value: "Triple SWIM-DOWN",
    label: "Triple SWIM-DOWN",
  },
  { value: "SIMPLE WASH", label: "SIMPLE WASH" },
  { value: "CA0", label: "CA0" },
  { value: "zymot", label: "zymot" },
  { value: "MACS", label: "MACS" },
  { value: "Swim down", label: "Swim down" },
  { value: "Other", label: "Other" },
]

export const denudationDoneByOptions = [
  {
    value: "DR. PRABHAKAR SINGH",
    label: "DR. PRABHAKAR SINGH",
  },
  { value: "RAM PRAKASH", label: "RAM PRAKASH" },
  { value: "SNEHA RANA", label: "SNEHA RANA" },
  { value: "NEHAL NAIK", label: "NEHAL NAIK" },
  { value: "DHRUTI BHATT", label: "DHRUTI BHATT" },
  { value: "MEHA DESAI", label: "MEHA DESAI" },
  { value: "PRIYANKA RAJPUT", label: "PRIYANKA RAJPUT" },
  {
    value: "SHRADDHA MANDAVIYA",
    label: "SHRADDHA MANDAVIYA",
  },
  { value: "SAPNA TRADA", label: "SAPNA TRADA" },
  {
    value: "JIGNASHA VEKARIYA",
    label: "JIGNASHA VEKARIYA",
  },
  { value: "MOHAMMAD MASI", label: "MOHAMMAD MASI" },
  { value: "JANKI CHOKSI", label: "JANKI CHOKSI" },
  {
    value: "DR. ABHISHEK SHAH",
    label: "DR. ABHISHEK SHAH",
  },
  { value: "NEHA GOSWAMI", label: "NEHA GOSWAMI" },
  { value: "Other", label: "Other" },
]

export const embryoDevCultureMediaOptions = [
  { value: "Sage", label: "Sage" },
  { value: "Vitromed", label: "Vitromed" },
  {
    value: "Vitrolife",
    label: "Vitrolife",
  },
  { value: "Cook's", label: "Cook's" },
  { value: "Other", label: "Other" },
]

export const embryoDevPgtOptions = [
  { value: "PGT-A", label: "PGT-A" },
  { value: "PGT-M", label: "PGT-M" },
  { value: "PGT-SR", label: "PGT-SR" },
  { value: "ERA-PGT", label: "ERA-PGT" },
  { value: "NI-PGT", label: "NI-PGT" },
  { value: "NO", label: "NO" },
]

export const icsiAddOnOptions = [
  { value: "P-ICSI", label: "P-ICSI" },
  {
    value: "Ca++ Ionophore Media",
    label: "Ca++ Ionophore Media",
  },
  { value: "LAH", label: "LAH" },
  {
    value: "Sperm Mobil",
    label: "Sperm Mobil",
  },
  {
    value: "Embryo Glue",
    label: "Embryo Glue",
  },
  { value: "None", label: "None" },
]

export const freezingMediaOptions = [
  { value: "Cryotech", label: "Cryotech" },
  { value: "Kitazato", label: "Kitazato" },
  { value: "Origio", label: "Origio" },
  { value: "Other", label: "Other" },
]

export const vitrificationDevicesOptions = [
  { value: "Cryotech", label: "Cryotech" },
  { value: "Cryoleaf", label: "Cryoleaf" },
  { value: "Cryotop", label: "Cryotop" },
  { value: "Cryolock", label: "Cryolock" },
  { value: "Other", label: "Other" },
]

export const oocytesQualityOptions = [
  {
    value: "Normal",
    label: "Normal",
  },
  {
    value: "SER disc",
    label: "SER disc",
  },
  {
    value: "Vacuole",
    label: "Vacuole",
  },
  {
    value: "Abnormal PVS",
    label: "Abnormal PVS",
  },
  {
    value: "Granulation in PVS",
    label: "Granulation in PVS",
  },
  {
    value: "Thick zona",
    label: "Thick zona",
  },
  // {
  //   value: "Thin zona",
  //   label: "Thin zona",
  // },
  {
    value: "Hyper mature",
    label: "Hyper mature",
  },
  {
    value: "Organelle cluster",
    label: "Organelle cluster",
  },
  {
    value: "Fragmented PB",
    label: "Fragmented PB",
  },
  {
    value: "Abnormal PB",
    label: "Abnormal PB",
  },
  {
    value: "Multiple PB",
    label: "Multiple PB",
  },
  {
    value: "Giant Oocyte",
    label: "Giant Oocyte",
  },
  {
    value: "Septate Zona",
    label: "Septate Zona",
  },
  {
    value: "Oval",
    label: "Oval",
  },
]

export const fertCheckOptions = [
  { value: "1PN", label: "1PN" },
  { value: "2PN", label: "2PN" },
  { value: "3PN", label: "3PN" },
  {
    value: "Abnormal PN",
    label: "Abnormal PN",
  },
  {
    value: "2 Cell",
    label: "2 Cell",
  },
  {
    value: "Degenerated",
    label: "Degenerated",
  },
  {
    value: "Unfert",
    label: "Unfert",
  },
  {
    value: "Lysed",
    label: "Lysed",
  },
  {
    value: "NA",
    label: "NA",
  },
]

export const embryoGradeOptions = [
  {
    value: "Grade-I",
    label: "Grade-I",
  },
  {
    value: "Grade-II",
    label: "Grade-II",
  },
  {
    value: "Grade-III",
    label: "Grade-III",
  },
  {
    value: "D3 Arrested",
    label: "D3 Arrested",
  },
  {
    value: "Lysed",
    label: "Lysed",
  },
  { value: "NA", label: "NA" },
]

export const etStatusOptions = [
  {
    value: "Vitrified",
    label: "Vitrified",
  },
  {
    value: "Discarded",
    label: "Discarded",
  },
  {
    value: "Fresh ET",
    label: "Fresh ET",
  },
  { value: "NA", label: "NA" },
]

export const complicationOptions = [
  {
    value: "Easy",
    label: "Easy",
  },
  {
    value: "Difficult",
    label: "Difficult",
  },
  {
    value: "Blood",
    label: "Blood",
  },
  {
    value: "Clean",
    label: "Clean",
  },
  {
    value: "Easy blood",
    label: "Easy blood",
  },
  {
    value: "Easy clean",
    label: "Easy clean",
  },
  {
    value: "Difficult Blood, ",
    label: "Difficult Blood, ",
  },
  {
    value: " Cx caught",
    label: " Cx caught",
  },
  {
    value: "Blood on outer",
    label: "Blood on outer",
  },
  {
    value: "Blood on inner, ",
    label: "Blood on inner, ",
  },
  {
    value: "Blood on tip",
    label: "Blood on tip",
  },
  {
    value: "Obturator",
    label: "Obturator",
  },
]

export const stageOfDevOptions = [
  { value: "D2", label: "D2" },
  { value: "D3", label: "D3" },
  { value: "D5", label: "D5" },
  { value: "D6", label: "D6" },
  { value: "D7", label: "D7" },
  { value: "M1", label: "M1" },
  { value: "M2", label: "M2" },
  { value: "PN Arrested", label: "PN Arrested" },
  { value: "NA", label: "NA" },
];

export const stageOptions = [
  { value: "Day 02", label: "Day 02" },
  { value: "Day 03", label: "Day 03" },
  { value: "Day 05", label: "Day 05" },
  { value: "Day 06", label: "Day 06" },
  { value: "Day 07", label: "Day 07" },
  { value: "Oocytes", label: "Oocytes" },
];

export const stageOptionsForPrint = [
  { value: "D2", label: "D2" },
  { value: "D3", label: "D3" },
  { value: "D5", label: "D5" },
  { value: "D6", label: "D6" },
  { value: "D7", label: "D7" },
  { value: "M1", label: "M1" },
  { value: "M2", label: "M2" },
  // { value: "Oocytes", label: "Oocytes" },
];

export const collectionOptions = [
  { value: "At Lab", label: "At Lab" },
  { value: "Home", label: "Home" },
  // {
  //   value: "Normal Semen Analysis",
  //   label: "Normal Semen Analysis",
  // },
  { value: "Other", label: "Other" },
];

export const completeCollectionOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const interpretationDNAOptions = [
  { value: "Excellent DNA Integrity", label: "Excellent DNA Integrity" },
  {
    value: "Excellent to Good DNA Integrity",
    label: "Excellent to Good DNA Integrity",
  },
  { value: "Good to Fair DNA Integrity", label: "Good to Fair DNA Integrity" },
  { value: "Fair to Poor DNA Integrity", label: "Fair to Poor DNA Integrity" },
  { value: "Poor DNA Integrity", label: "Poor DNA Integrity" },
  {
    value: "Extremely Poor DNA Integrity",
    label: "Extremely Poor DNA Integrity",
  },
];

export const chronicsIllnessesOptions = [
  { value: "Diabetes Mellitus", label: "Diabetes Mellitus" },
  { value: "Hypertension", label: "Hypertension" },
  { value: "Hypothyroidism", label: "Hypothyroidism" },
  { value: "ITP", label: "ITP" },
  { value: "Obesity", label: "Obesity" },
  { value: "Testosterone", label: "Testosterone" },
  { value: "None", label: "None" },
];

export const visualAppearance = [
  { value: "Normal", label: "Normal" },
  { value: "Abnormal", label: "Abnormal" },
];

export const macroscopicExaminationVisualAppearance = [
  { value: "Normal", label: "Normal" },
  { value: "Abnormal", label: "Abnormal" },
  { value: "Yellowish", label: "Yellowish" },
  { value: "Reddish", label: "Reddish" },
];

export const hcvOptions = [
  { value: "Positive", label: "Positive" },
  { value: "Negative", label: "Negative" },
];

export const yChromosomeMicrodeletionOptions = [
  { value: "Detected", label: "Detected" },
  { value: "Not Detected", label: "Not Detected" },
  { value: "Not Done", label: "Not Done" },
];

export const dfiOptions = [
  { value: "Excellent", label: "Excellent" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
  { value: "Extremely Poor", label: "Extremely Poor" },
  { value: "Fair to Good", label: "Fair to Good" },
  { value: "Good to Fair", label: "Good to Fair" },
  { value: "Excellent to Fair", label: "Excellent to Fair" },
];

export const fructoseOptions = [
  { value: "+ve", label: "+ve" },
  { value: "-ve", label: "-ve" },
];

export const debriesOptions = [
  { value: "None", label: "None" },
  { value: "Some", label: "Some" },
  { value: "Plenty", label: "Plenty" },
  { value: "Moderate", label: "Moderate" },
];

export const interpretationOptions = [
  { value: "Oligospermia", label: "Oligospermia" },
  { value: "Asthenospermia", label: "Asthenospermia" },
  { value: "Teratazoospermia", label: "Teratazoospermia" },
  { value: "Oligoasthenospermia", label: "Oligoasthenospermia" },
  { value: "Oligoteratazoospermia", label: "Oligoteratazoospermia" },
  { value: "Asthenoteratazoospermia", label: "Asthenoteratazoospermia" },
  {
    value: "Oligoasthenoteratazoosperia/OATS",
    label: "Oligoasthenoteratazoosperia/OATS",
  },
  {
    value: "Normal Semen Analysis",
    label: "Normal Semen Analysis",
  },
  { value: "Azoospermia", label: "Azoospermia" },
  { value: "Severe OATS", label: "Severe OATS" },
  { value: "Hyperspermia", label: "Hyperspermia" },
  { value: "Hypospermia", label: "Hypospermia" },
  { value: "Necrozoospermia", label: "Necrozoospermia" },
  { value: "Globozoospermia", label: "Globozoospermia" },
  { value: "Leukocytospermia", label: "Leukocytospermia" },
];

export const decisionLimitsOptions = [
  { label: "Normal Count", value: "Normal Count" },
  { label: "Normal Motility", value: "Normal Motility" },
  { label: "Normal Morphology", value: "Normal Morphology" },
  { label: "Borderline Count", value: "Borderline Count" },
  { label: "Borderline Motility", value: "Borderline Motility" },
  { label: "Abnormal Count", value: "Abnormal Count" },
  { label: "Abnormal Motility", value: "Abnormal Motility" },
  { label: "Abnormal Morphology", value: "Abnormal Morphology" },
  { label: "Borderline Morphology", value: "Borderline Morphology" },
];

export const referringClinicOptions = [
  { value: "Dr. Pooja Singh/Nimaaya", label: "Dr. Pooja Singh/Nimaaya" },
  { value: "Other", label: "Other" },
];

export const IUI_with = [
  { value: "Donor’s Semen", label: "Donor’s Semen" },
  { value: "Husband's Semen", label: "Husband's Semen" },
];
export const etProvider = [
  { value: "DR. POOJA SINGH", label: "DR. POOJA SINGH" },
  { value: "DR. KISHORE NADKARNI", label: "DR. KISHORE NADKARNI" },
  { value: "DR. PRAFUL DOSHI", label: "DR. PRAFUL DOSHI" },
  { value: "DR. GOPAL VEKARIYA", label: "DR. GOPAL VEKARIYA" },
  { value: "DR. YUVRAJSINH JADEJA", label: "DR. YUVRAJSINH JADEJA" },
  { value: "DR. BIRVA DAVE", label: "DR. BIRVA DAVE" },
  { value: "DR. PRABHAKAR SINGH", label: "DR. PRABHAKAR SINGH" },
  { value: "RAM PRAKASH", label: "RAM PRAKASH" },
  { value: "SNEHA RANA", label: "SNEHA RANA" },
  { value: "NEHAL NAIK", label: "NEHAL NAIK" },
  { value: "DHRUTI BHATT", label: "DHRUTI BHATT" },
  { value: "MEHA DESAI", label: "MEHA DESAI" },
  { value: "PRIYANKA RAJPUT", label: "PRIYANKA RAJPUT" },
  { value: "SHRADDHA MANDAVIYA", label: "SHRADDHA MANDAVIYA" },
  { value: "SAPNA TRADA", label: "SAPNA TRADA" },
  { value: "JIGNASHA VEKARIYA", label: "JIGNASHA VEKARIYA" },
  { value: "MOHAMMAD MASI", label: "MOHAMMAD MASI" },
  { value: "JANKI CHOKSI", label: "JANKI CHOKSI" },
  { value: "DR. ABHISHEK SHAH", label: "DR. ABHISHEK SHAH" },
  { value: "NEHA GOSWAMI", label: "NEHA GOSWAMI" },
  { value: "NOT DONE", label: "NOT DONE" },
  { value: "OTHER", label: "OTHER" },
];

export const frozen_sample = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const historyOfTesaOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
