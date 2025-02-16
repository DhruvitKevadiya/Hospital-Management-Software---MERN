import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Select,
  Space,
  Spin,
  Tooltip,
} from "antd";
import {
  anetheistNameOptions,
  complicationOptions,
  denudationDoneByOptions,
  eggsOptions,
  embryoDevCultureMediaOptions,
  embryoDevPgtOptions,
  embryoGradeOptions,
  etProvider,
  etStatusOptions,
  fertCheckOptions,
  freezingMediaOptions,
  gobletColorOptions,
  icsiAddOnOptions,
  incubatorOptions,
  oocytesQualityOptions,
  spermsOptions,
  spermsPrepMethodOptions,
  spermsQualityOptions,
  stageOfDevOptions,
  stageOptionsForPrint,
  statusOptions,
  strawColorOptions,
  vitrificationDevicesOptions,
  vitrificationIdOptions,
} from "utils/FieldValues";
import { TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TranshIcon from "../../Img/trash.svg";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  getAttendingDrList,
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import _ from "lodash";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  createEmbryologyData,
  editEmbryologyData,
  getEmbryologyData,
  getPatientList,
  printEmbryoWarming,
  printEmbryologyFlowSheet,
  printVitrificationReport,
  setEmbryologyData,
  setEmbryologyDataUpdate,
  setPatientListData,
} from "redux/reducers/EmbryologyData/embryologyData.slice";
import { toast } from "react-toastify";
import { CloseOutlined } from "@ant-design/icons";
import { ageCalculate, generateUniqueId } from "utils/CommonFunctions";
import { getIvfFlowsheetDetail } from "redux/reducers/IVFFlowSheet/IvfFlowSheet.slice";

const embryologyinitialdata = {
  ivf_flow_id: "",
  eggs: null,
  cycle_type: null,
  cycle_no: "",
  icsi_ivf_done_by_other: "",
  tesa_pesa_done_by_other: "",
  opu_done_by_other: "",
  assisted_by_other: "",
  anesthesia_given_by: null,
  denudation_done_by: null,
  anesthesia_given_by_other: "",
  denudation_done_by_other: "",
  donor_partner_name: "",
  donor_partner_age: "",
  sperms: null,
  sperms_by: null,
  sperms_quality: null,
  sperms_quality_donor: null,
  sperms_quality_other_donor: "",
  sperms_prep_method_donor: null,
  sperms_prep_method_other_donor: "",
  sperms_donor: null,
  sperms_by_donor: null,
  frozen_vial_id_donor: "",
  sperms_prep_method: null,
  add_on: null,
  frozen_vial_id: "",
  icsi_ivf_done_by: null,
  tesa_pesa_done_by: null,
  opu_done_by: null,
  assisted_by: null,
  opu_date: null,
  opu_time: null,
  actual_opu_time: null,
  amh: "",
  gv: "",
  progesterone: "",
  lmp: "",
  lh: "",
  e2: "",
  atretic: "",
  embryo_dev_pgt: null,
  denudation_time: null,
  icsi_ivf_time: null,
  embryo_dev_culture_media: null,
  embryo_dev_culture_media_other: null,
  freezing_media_other: null,
  vitrification_devices_other: null,
  add_on_other: "",
  embryo_dev_batch_no: "",
  embryo_dev_expiry_date: null,
  day_0_date: null,
  day_0_time: null,
  day_1_date: null,
  day_0_hrs_post_icsi: "",
  day_3_date: null,
  day_3_time: null,
  day_5_date: null,
  day_6_date: null,
  day_7_date: null,
  vitrification_batch_no_exp_date: "",
  freezing_media: null,
  vitrification_devices: null,
  vitrification_batch_no: "",
  vitrification_expiry_date: null,
  pre_frozen_embryo_available: null,
  tank_no: "",
  cannister_no: "",
  thawing_media: null,
  embryo_dev_incubator_other: "",
  warming_expiry_date: null,
  distance_from_fundus: "",
  transfer_done_by: null,
  total_straw: 0,
  total_goblet: 0,
  embryo_loading_by: null,
  embryo_dev_incubator: null,
  sperms_prep_method_other: "",
  sperms_quality_other: "",
  embryo_dev_batch_no_exp_date: "",
  notes: "",
  no_of_oocytes: "",
  cleaved: "",
  fert: "",
  degenerated: "",
  unfert: "",
  abnormal_pn: "",
  kept_for_blastocyst: "",
  eggs_to: null,
  eggs_by: null,
  eggs_by_ivf_id: "",
  eggs_donor: null,
  eggs_to_donor: null,
  eggs_by_ivf_id_donor: null,
  eggs_by_donor: null,
};

const days = {
  D2: 2,
  D3: 3,
  D5: 5,
  D6: 6,
  D7: 7,
};

const isOpenBy = ["Donor Thawed", "Donor Fresh"];
const isOpenTo = ["Professional Donor"];

export default function EmbryologyDataSheet() {
  const { TextArea } = Input;
  const dispatch = useDispatch();

  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );

  const { selectedPatient, ivfIdList, isIvfListLoading, attendingDrList } =
    useSelector(({ common }) => common);
  const {
    embryologyData,
    patientList,
    embryologyDataUpdate,
    embryologyDataLoading,
  } = useSelector(({ embryologyData }) => embryologyData);
  const { IvfFlowsheetList, IvfFlowsheetListLoding } = useSelector(
    ({ ivfFlowSheet }) => ivfFlowSheet
  );

  const [form] = Form.useForm();
  const location = useLocation();
  const [pDetail, setPDetail] = useState({});
  const [eggByDetail, setEggByDetail] = useState({});
  const [eggByDetailDonor, setEggByDetailDonor] = useState({});
  const [spermBySearch, setSpermBySearch] = useState([]);
  const [searchTrigger, setSearchTrigger] = useState("");
  const [spermsByDetailDonor, setSpermsByDetailDonor] = useState({});
  const [totalRows, setTotalRows] = useState(0);
  const [doctorList, setDoctorList] = useState([]);
  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [printOption, setPrintOption] = useState([]);
  const [embryoTableList, setEmbryoTableList] = useState([]);
  const [embryology_count, setEmbryology_count] = useState([]);
  const [embryologyDetails, setEmbryologyDetails] = useState(
    embryologyinitialdata
  );
  const [donateByIVFData, setDonateByIVFData] = useState({});
  const [donateByIVFDataDonor, setDonateByIVFDataDonor] = useState({});
  const [isSearchPatient, setIsSearchPatient] = useState(false);
  const [eggBySelectedList, setEggBySelectedList] = useState([]);
  const [eggBySelectedListDonor, setEggBySelectedListDonor] = useState([]);
  const [backupIvfList, setBackupIvfList] = useState([]);
  const [backupIvfDonerList, setBackupIvfDonerList] = useState([]);
  const [eggsByBackupList, setEggsByBackupList] = useState([]);
  const [eggsByDonorBackupList, setEggsByDonorBackupList] = useState([]);
  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);

  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);

  useEffect(() => {
    if (
      Object.keys(selectedModule)?.length > 0 &&
      Object.keys(selectedPatient)?.length > 0 &&
      selectedLocation
    ) {
      dispatch(
        getIvfId({
          locationId: selectedLocation,
          patientRegId: selectedPatient?._id,
          moduleId: selectedModule?._id,
        })
      );
    }
    return () => {
      clearEmbryologyData();
      dispatch(setIvfIdList([]));
      dispatch(setEmbryologyData({}));
      setIvfIdOption([]);
      setEggsByBackupList([])
    };
  }, [selectedLocation, selectedModule, selectedPatient]);

  useEffect(() => {
    if (attendingDrList?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [attendingDrList]);

  const embryology_countTable = {
    reference_ivf_id: "",
    no_of_oocytes: "",
    total_m2: "",
    total_m2_used: null,
    total_m1: "",
    total_m1_used: null,
    gv: "",
    atretic: "",
    fert: "",
    cleaved: "",
    unfert: "",
    degenerated: "",
    kept_for_blastocyst: "",
    total_blastocyst: "",
    notes: "",
    patient_detail: {},
  };
  const embryoTable = {
    oocytes: "",
    well_no: "",
    maturation_stage: null,
    fert_check: null,
    rating: "",
    incubator: null,
    stage_of_development: null,
    embryo_grade: null,
    blasto_score: null,
    date_of_freezing: null,
    note: "",
    vitrification_id: null,
    straw_color: null,
    goblet_color: null,
    status: null,
    vitrified_by: "",
    oocytes_quality: null,
    provider: null,
    complication: null,
    introducer: null,
    provider_other: null,
    introducer_other: null,
    straw_color_other: null,
    goblet_color_other: null,
  };

  useEffect(() => {
    if (patientList?.length > 0) {
      if (searchTrigger === "sperms_by") {
        const mergedList = [...patientList, ...spermBySearch];
        setSpermBySearch(mergedList);
      }
    }
  }, [patientList]);

  const transformData = useCallback((data) => {
    if (!Array.isArray(data)) {
      throw new Error("Input data must be an array.");
    }
    return data.reduce((result, item, index) => {
      Object.entries(item).forEach(([field, value]) => {
        const dynamicKey = `${field}${index}`;
        if (field.startsWith("date_") && value) {
          result[dynamicKey] = dayjs(
            moment(value).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          );
        } else {
          result[dynamicKey] = value ?? null;
        }
      });
      return result;
    }, {});
  }, []);

  const removeLastInstanceOfStage = (data, diff, stage) => {
    const m1Records = data.filter((item) => item.maturation_stage === stage);
    // const m2Records = arr.filter(item => item.maturation_stage === stage);
    for (let i = 0; i < diff; i++) {
      const lastM1Index = data.lastIndexOf(m1Records[m1Records.length - 1 - i]);
      data.splice(lastM1Index, 1);
    }
    // data.splice(
    //   data.lastIndexOf(data.find((item) => item.maturation_stage === stage)),
    //   diff
    // );
  };
  const addInstanceOfStage = (diff, stage, data) => {
    for (let i = 0; i < diff; i++) {
      data.push({ ...embryoTable, maturation_stage: stage });
    }
  };

  // optimization chat gpt start
  const addRow = useCallback(
    (m1, m2, index, data) => {
      let updatedEmbryoCounter = JSON.parse(JSON.stringify(data));
      let copyList = updatedEmbryoCounter[index].embryo;
      let updatedPackData = JSON.parse(JSON.stringify([...copyList])); // Copy existing data
      const stage1 = "M1";
      const stage2 = "M2";

      // Count how many items of each stage already exist in the list
      const existingM1Count = updatedPackData.filter(
        (item) => item.maturation_stage === stage1
      ).length;
      const existingM2Count = updatedPackData.filter(
        (item) => item.maturation_stage === stage2
      ).length;
      // Calculate the difference between existing counts and new counts
      const diffM1 = Math.abs(m1 - existingM1Count);
      const diffM2 = Math.abs(m2 - existingM2Count);

      // Add new M1 items
      if (existingM1Count > +m1) {
        // remove last record of m1 in list
        removeLastInstanceOfStage(updatedPackData, diffM1, "M1");
      } else {
        addInstanceOfStage(diffM1, stage1, updatedPackData);
        // for (let i = 0; i < diffM1; i++) {
        //   updatedPackData.push({ ...embryoTable, maturation_stage: stage1 });
        // }
      }
      if (existingM2Count > +m2) {
        // remove last record of m2 in list
        removeLastInstanceOfStage(updatedPackData, diffM2, "M2");
      } else {
        // Add new M2 items
        addInstanceOfStage(diffM2, stage2, updatedPackData);

        // for (let i = 0; i < diffM2; i++) {
        //   updatedPackData.push({ ...embryoTable, maturation_stage: stage2 });
        // }
      }

      let desiredOrder = [null, "M2", "M1"];

      let orderMap = {};
      desiredOrder.forEach((stage, index) => {
        orderMap[stage] = index;
      });
      updatedPackData.sort((a, b) => {
        let orderA = orderMap[a.maturation_stage];
        let orderB = orderMap[b.maturation_stage];

        // Handle cases where maturation_stage is not in desiredOrder
        if (orderA === undefined) orderA = Infinity;
        if (orderB === undefined) orderB = Infinity;

        return orderA - orderB;
      });

      // Remove extra items if the new counts are less than existing counts
      // updatedPackData = updatedPackData.slice(0, +m1 + +m2);
      // Update state and form fields

      updatedPackData.map((item, i) => (item.oocytes = i + 1));

      if (IvfFlowsheetList?.planned_cycle?.includes("Oocytes Vitrification")) {
        updatedPackData.map(
          (item, i) => (item.stage_of_development = item.maturation_stage)
        );
      }
      updatedEmbryoCounter[index].embryo = updatedPackData;
      const total_no_Of_OOCYTES =
        +updatedEmbryoCounter[index]["no_of_oocytes"] || 0;
      const total_m2 = +updatedEmbryoCounter[index]["total_m2"] || 0;
      const total_m1 = +updatedEmbryoCounter[index]["total_m1"] || 0;
      const atretic = +updatedEmbryoCounter[index]["atretic"] || 0;
      const gv = total_no_Of_OOCYTES - (total_m2 + total_m1 + atretic);
      updatedEmbryoCounter[index]["gv"] = gv < 0 ? 0 : gv;
      let obj1 = {};
      obj1[`gv${index}`] = gv < 0 ? 0 : gv;
      form.setFieldsValue(obj1);
      setEmbryology_count(updatedEmbryoCounter);

      // form.setFieldsValue({}); // Clear form fields and then set them with updated data
      form.setFieldsValue(
        updatedEmbryoCounter[index].embryo.reduce((obj, item, i) => {
          obj[`maturation_stage${index}${i}`] = item.maturation_stage;
          obj[`oocytes${index}${i}`] = i + 1;
          obj[`oocytes_quality${index}${i}`] = item.oocytes_quality;
          obj[`fert_check${index}${i}`] = item.fert_check;
          obj[`stage_of_development${index}${i}`] = item.stage_of_development;
          obj[`embryo_grade${index}${i}`] = item.embryo_grade;
          obj[`blasto_score${index}${i}`] = item.blasto_score;
          obj[`rating${index}${i}`] = item.rating;
          obj[`et_status${index}${i}`] = item?.et_status || null;
          obj[`provider${index}${i}`] = item?.provider || null;
          obj[`provider_other${index}${i}`] = item?.provider_other || null;
          obj[`introducer${index}${i}`] = item?.introducer || null;
          obj[`introducer_other${index}${i}`] = item?.introducer_other || null;
          obj[`complication${index}${i}`] = item?.complication || null;
          obj[`date_of_freezing${index}${i}`] = item?.date_of_freezing
            ? dayjs(
              moment(item?.date_of_freezing).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null;
          obj[`vitrification_id${index}${i}`] = item?.vitrification_id || null;
          obj[`straw_color${index}${i}`] = item?.straw_color || null;
          obj[`straw_color_other${index}${i}`] =
            item?.straw_color_other || null;
          obj[`goblet_color${index}${i}`] = item?.goblet_color || null;
          obj[`goblet_color_other${index}${i}`] =
            item?.goblet_color_other || null;
          obj[`vitrified_by${index}${i}`] = item?.vitrified_by || null;
          obj[`status${index}${i}`] = item?.status || null;
          obj[`well_no${index}${i}`] = item?.well_no || null;
          return obj;
        }, {})
      );
    },
    [embryoTable, form]
  );

  const onDeleteEmbryoData = useCallback(
    (index) => {
      const updatedEmbryoData = embryoTableList?.filter(
        (item, i) => i !== index
      );
      setEmbryoTableList(updatedEmbryoData);
      const newPackageData = transformData(updatedEmbryoData || []);
      if (Object.entries(newPackageData)?.length > 0) {
        form.setFieldsValue({ ...newPackageData });
      }
    },
    [form, embryoTableList]
  );

  const ivfFlowSheetDataModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === "/ivf-flow-sheet") || {}
    );
  }, [moduleList]);

  useEffect(() => {
    if (
      embryologyDetails?.ivf_flow_id &&
      selectedPatient?._id &&
      embryologyDetails?.ivf_flow_id !== "new"
    ) {
      let embryologyResponse = {};
      dispatch(
        getEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: embryologyDetails?.ivf_flow_id,
        })
      ).then(async (res) => {
        embryologyResponse = res?.payload;
        let selectedEmbyologyDetails = { ...embryologyDetails };

        if (embryologyResponse && Object.keys(embryologyResponse)?.length) {
          selectedEmbyologyDetails = await handleSetEmbyologyDetails(
            embryologyResponse,
            false
          );
        }

        if (
          embryologyResponse?.eggs_by &&
          embryologyResponse?.eggs_by_name &&
          selectedLocation
        ) {
          dispatch(
            getPatientList({
              patient_name: embryologyResponse?.eggs_by_name,
              start: null,
              limit: null,
            })
          )
            .then((result) => {
              const patientDetail = result?.payload?.find(
                (patient) => patient?._id === embryologyResponse?.eggs_by
              );
              // setDonateByIVFData(patientDetail?.ivf_flow_data);
            })
            .catch((err) => {
              console.error("Error Fetching IVF List", err);
            });
        }

        dispatch(
          getIvfFlowsheetDetail({
            locationId: selectedLocation,
            ivfFlowId: embryologyDetails?.ivf_flow_id,
            moduleId: ivfFlowSheetDataModule?._id,
          })
        ).then((res) => {
          const lastMenstrualPeriod = res?.payload?.last_menstrual_period;
          const pickupDate = res?.payload?.pick_up_date;
          const pickupTime = res?.payload?.pick_up_time;
          const plannedCycle = res?.payload?.planned_cycle || [];
          let partnerAge = "";

          const cycleTypeIncludesOD = plannedCycle.includes("OD");
          if (
            plannedCycle.includes("OD") &&
            embryologyResponse?.donor_partner_age
          ) {
            // Parse the dates using Moment.js
            let startDate = moment(embryologyResponse?.donor_partner_age);
            let endDate = moment();

            // Calculate the difference in years
            let differenceInYears = endDate.diff(startDate, "years");

            partnerAge = differenceInYears;
          }
          setEmbryologyDetails({
            ...selectedEmbyologyDetails,
            lmp: lastMenstrualPeriod
              ? dayjs(
                moment(lastMenstrualPeriod).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              )
              : "",
            opu_date: pickupDate
              ? dayjs(moment(pickupDate).format("YYYY-MM-DD"), "YYYY-MM-DD")
              : "",
            opu_time: pickupTime
              ? dayjs(moment(pickupTime).format("HH:mm:ss"), "HH:mm:ss")
              : "",
            actual_opu_time: embryologyResponse?.actual_opu_time
              ? dayjs(embryologyResponse?.actual_opu_time, "HH:mm:ss")
              : res?.payload?.actual_pick_up_time
                ? dayjs(res?.payload?.actual_pick_up_time, "HH:mm:ss")
                : null,
            day_0_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).format(
                  "YYYY-MM-DD"
                )
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).format("YYYY-MM-DD")
                : null,
            // day_1_date: pickupDate
            //   ? moment(new Date(pickupDate)).format("YYYY-MM-DD")
            //   : null,
            // day_3_date: pickupDate
            //   ? moment(new Date(pickupDate)).format("YYYY-MM-DD")
            //   : null,
            // day_5_date: pickupDate
            //   ? moment(new Date(pickupDate)).add(4, "days").format("YYYY-MM-DD")
            //   : null,
            // day_6_date: pickupDate
            //   ? moment(new Date(pickupDate)).add(5, "days").format("YYYY-MM-DD")
            //   : null,
            // day_7_date: pickupDate
            //   ? moment(new Date(pickupDate)).add(6, "days").format("YYYY-MM-DD")
            //   : null,

            day_1_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).add(1, "days").format(
                  "YYYY-MM-DD"
                )
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).add(1, "days").format("YYYY-MM-DD")
                : null,


            day_3_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).add(3, "days").format("YYYY-MM-DD")
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).add(3, "days").format("YYYY-MM-DD")
                : null,

            day_5_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).add(5, "days").format("YYYY-MM-DD")
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).add(5, "days").format("YYYY-MM-DD")
                : null,

            day_6_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).add(6, "days").format("YYYY-MM-DD")
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).add(6, "days").format("YYYY-MM-DD")
                : null,

            day_7_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? moment(new Date(embryologyResponse?.day_0_date)).add(7, "days").format("YYYY-MM-DD")
                : null
              : pickupDate
                ? moment(new Date(pickupDate)).add(7, "days").format("YYYY-MM-DD")
                : null,

            cycle_type: plannedCycle,
            donor_partner_name: plannedCycle.includes("OD")
              ? embryologyResponse?.donor_partner_name
              : "",
            donor_partner_age: partnerAge ? partnerAge : null,
            lh: embryologyResponse?.lh
              ? embryologyResponse?.lh
              : res?.payload.eds_lh || "",
            e2: embryologyResponse?.e2
              ? embryologyResponse?.e2
              : res?.payload.eds_e2 || "",
            amh: embryologyResponse?.amh
              ? embryologyResponse?.amh
              : res?.payload.eds_amh || "",
            progesterone: embryologyResponse?.progesterone
              ? embryologyResponse?.progesterone
              : res?.payload.eds_progesterone || "",
            // donor_partner_name: cycleTypeIncludesOD
            //   ? embryologyResponse?.donor_partner_name
            //   : selectedEmbyologyDetails?.donor_partner_name
          });

          form.setFieldsValue({
            lmp: lastMenstrualPeriod
              ? dayjs(
                moment(lastMenstrualPeriod).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              )
              : "",
            opu_date: pickupDate
              ? dayjs(moment(pickupDate).format("YYYY-MM-DD"), "YYYY-MM-DD")
              : "",
            opu_time: pickupTime ? dayjs(pickupTime, "HH:mm:ss") : "",
            actual_opu_time: embryologyResponse?.actual_opu_time
              ? dayjs(embryologyResponse?.actual_opu_time, "HH:mm:ss")
              : res?.payload?.actual_pick_up_time
                ? dayjs(res?.payload?.actual_pick_up_time, "HH:mm:ss")
                : null,
            day_0_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            cycle_type: plannedCycle,
            donor_partner_name: plannedCycle.includes("OD")
              ? embryologyResponse?.donor_partner_name
              : "",
            donor_partner_age: partnerAge ? partnerAge : null,
            // day_1_date: plannedCycle.includes("OD")
            //   ? embryologyResponse?.day_1_date
            //     ? dayjs(
            //       moment(new Date(embryologyResponse?.day_1_date)).format(
            //         "DD/MM/YYYY"
            //       ),
            //       "DD/MM/YYYY"
            //     )
            //     : null
            //   : pickupDate
            //     ? dayjs(
            //       moment(new Date(pickupDate))
            //         .add(1, "days")
            //         .format("DD/MM/YYYY"),
            //       "DD/MM/YYYY"
            //     )
            //     : null,
            // day_3_date: plannedCycle.includes("OD")
            //   ? embryologyResponse?.day_3_date
            //     ? dayjs(
            //       moment(new Date(embryologyResponse?.day_3_date)).format(
            //         "DD/MM/YYYY"
            //       ),
            //       "DD/MM/YYYY"
            //     )
            //     : null
            //   : plannedCycle.includes("OD")
            //     ? embryologyResponse?.day_3_date
            //       ? dayjs(
            //         moment(new Date(embryologyResponse?.day_3_date)).format(
            //           "DD/MM/YYYY"
            //         ),
            //         "DD/MM/YYYY"
            //       )
            //       : null
            //     : pickupDate
            //       ? dayjs(
            //         moment(new Date(pickupDate))
            //           .add(3, "days")
            //           .format("DD/MM/YYYY"),
            //         "DD/MM/YYYY"
            //       )
            //       : null,
            // day_5_date: plannedCycle.includes("OD")
            //   ? embryologyResponse?.day_5_date
            //     ? dayjs(
            //       moment(new Date(embryologyResponse?.day_5_date)).format(
            //         "DD/MM/YYYY"
            //       ),
            //       "DD/MM/YYYY"
            //     )
            //     : null
            //   : pickupDate
            //     ? dayjs(
            //       moment(new Date(pickupDate))
            //         .add(5, "days")
            //         .format("DD/MM/YYYY"),
            //       "DD/MM/YYYY"
            //     )
            //     : null,
            // day_6_date: plannedCycle.includes("OD")
            //   ? embryologyResponse?.day_5_date
            //     ? dayjs(
            //       moment(new Date(embryologyResponse?.day_6_date)).format(
            //         "DD/MM/YYYY"
            //       ),
            //       "DD/MM/YYYY"
            //     )
            //     : null
            //   : pickupDate
            //     ? dayjs(
            //       moment(new Date(pickupDate))
            //         .add(6, "days")
            //         .format("DD/MM/YYYY"),
            //       "DD/MM/YYYY"
            //     )
            //     : null,
            // day_7_date: plannedCycle.includes("OD")
            //   ? embryologyResponse?.day_5_date
            //     ? dayjs(
            //       moment(new Date(embryologyResponse?.day_7_date)).format(
            //         "DD/MM/YYYY"
            //       ),
            //       "DD/MM/YYYY"
            //     )
            //     : null
            //   : pickupDate
            //     ? dayjs(
            //       moment(new Date(pickupDate))
            //         .add(7, "days")
            //         .format("DD/MM/YYYY"),
            //       "DD/MM/YYYY"
            //     )
            //     : null,

            day_1_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).add(1, "days").format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).add(1, "days").format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            day_3_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).add(3, "days").format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).add(3, "days").format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            day_5_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).add(5, "days").format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).add(5, "days").format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            day_6_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).add(6, "days").format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).add(6, "days").format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            day_7_date: plannedCycle.includes("OD")
              ? embryologyResponse?.day_0_date
                ? dayjs(
                  moment(new Date(embryologyResponse?.day_0_date)).add(7, "days").format(
                    "DD/MM/YYYY"
                  ),
                  "DD/MM/YYYY"
                )
                : null
              : pickupDate
                ? dayjs(
                  moment(new Date(pickupDate)).add(7, "days").format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null,
            lh: embryologyResponse?.lh
              ? embryologyResponse?.lh
              : res?.payload.eds_lh || "",
            e2: embryologyResponse?.e2
              ? embryologyResponse?.e2
              : res?.payload.eds_e2 || "",
            amh: embryologyResponse?.amh
              ? embryologyResponse?.amh
              : res?.payload.eds_amh || "",
            progesterone: embryologyResponse?.progesterone
              ? embryologyResponse?.progesterone
              : res?.payload.eds_progesterone || "",
            // cycle_type: plannedCycle,
            // donor_partner_name: cycleTypeIncludesOD
            //   ? embryologyResponse?.donor_partner_name
            //   : selectedEmbyologyDetails.donor_partner_name
          });

          // setCycleType(
          //   plannedCycle.map((cycle) => ({ value: cycle, label: cycle }))
          // );
        });
      });
    } else if (
      embryologyDetails?.ivf_flow_id &&
      selectedPatient?._id &&
      embryologyDetails?.ivf_flow_id === "new"
    ) {
      let startDate = moment(selectedPatient?.partner_dob);
      let endDate = moment();

      // Calculate the difference in years
      let differenceInYears = endDate.diff(startDate, "years");
      setEmbryologyDetails({
        ...embryologyDetails,
        donor_partner_name: selectedPatient?.partner_full_name,
        donor_partner_age: differenceInYears ? differenceInYears : null,
      });
      form.setFieldsValue({
        ...embryologyDetails,
        donor_partner_name: selectedPatient?.partner_full_name,
        donor_partner_age: differenceInYears ? differenceInYears : null,
      });
    }
  }, [embryologyDetails?.ivf_flow_id]);

  useEffect(() => {
    if (embryologyDataUpdate) {
      dispatch(
        getEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: embryologyDetails?.ivf_flow_id,
        })
      )
        .then((result) => {
          const printOp = createPrintOption(result?.payload?.embryo || []);
          setPrintOption(printOp);
        })
        .catch((err) => {
          console.error("Error While Fetching Updated Data", err);
        });
      dispatch(setEmbryologyDataUpdate(false));
    }
  }, [embryologyDataUpdate]);

  const handleSetEmbyologyDetails = useCallback(
    (embryologyData, isSetData = true) => {
      if (Object.keys(embryologyData).length > 0) {
        const updatedEmbryologyData = embryologyData?.embryo?.map((item) => {
          return {
            ...item,
            vitrified_by: item?.vitrified_by
              ? item?.vitrified_by?.split(",")
              : [],
          };
        });

        const printOp = createPrintOption(updatedEmbryologyData);
        setPrintOption(printOp);
        const newPackageData = transformData(updatedEmbryologyData || []);
        setEmbryoTableList(updatedEmbryologyData || [embryoTable]);
        if (isOpenBy.includes(embryologyData?.eggs)) {
          setEggByDetail({
            _id: embryologyData?.eggs_by,
            patient_full_name: embryologyData?.eggs_by_name,
          });
          form.setFieldsValue({
            eggs_by: embryologyData?.eggs_by_name,
          });
          dispatch(
            setPatientListData([
              {
                _id: embryologyData?.eggs_by,
                patient_full_name: embryologyData?.eggs_by_name,
              },
            ])
          );
        }

        if (isOpenBy.includes(embryologyData?.sperms)) {
          setSpermBySearch([
            {
              _id: embryologyData?.sperms_by,
              patient_full_name: embryologyData?.sperms_by_name,
            },
          ]);
          form.setFieldsValue({
            sperms_by: embryologyData?.sperms_by,
          });
          // dispatch(
          //   setPatientListData([
          //     {
          //       _id: embryologyData?.sperms_by,
          //       patient_full_name: embryologyData?.sperms_by_name,
          //     },
          //   ])
          // );
        }
        if (embryologyData?.eggs_by_ivf_id.length) {
          const eggIvfData = {
            ivf_flow_data: embryologyData?.eggs_by_ivf_id,
          };
          setDonateByIVFData(eggIvfData);
        }
        if (embryologyData?.eggs_by_ivf_id_donor?.length) {
          const egg = {
            ivf_flow_data: embryologyData?.eggs_by_ivf_id_donor,
          };
          setDonateByIVFDataDonor(egg);
        }
        if (isOpenBy.includes(embryologyData?.sperms_donor)) {
          setSpermsByDetailDonor({
            _id: embryologyData?.sperms_by_donor,
            patient_full_name: embryologyData?.sperms_by_name_donor,
          });
          form.setFieldsValue({
            sperms_by_donor: embryologyData?.sperms_by_name_donor,
          });
          dispatch(
            setPatientListData([
              {
                _id: embryologyData?.sperms_by_donor,
                patient_full_name: embryologyData?.sperms_by_name_donor,
              },
            ])
          );
        }
        let sortEmbro = JSON.parse(
          JSON.stringify(embryologyData.embryology_count)
        );
        sortEmbro.forEach((item) => {
          item.embryo.sort((a, b) => +a.oocytes - +b.oocytes);
        });
        setEmbryology_count(sortEmbro);
        const embryologyDataObject = {
          ivf_flow_id: embryologyData?.ivf_flow_id,
          _id: embryologyData?._id,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyDetails?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          // opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by: embryologyData?.opu_done_by
            ? embryologyData.opu_done_by
            : embryologyData?.opu_done_by_other
              ? "Other"
              : null,
          opu_done_by_other: embryologyData?.opu_done_by_other || "",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          denudation_done_by: embryologyData?.denudation_done_by || null,
          anesthesia_given_by_other:
            embryologyData?.anesthesia_given_by_other || "",
          denudation_done_by_other:
            embryologyData?.denudation_done_by_other || "",
          tesa_pesa_done_by: embryologyData?.tesa_pesa_done_by
            ? embryologyData.tesa_pesa_done_by
            : embryologyData?.tesa_pesa_done_by_other
              ? "Other"
              : null,
          // donor_partner_name: embryologyData?.donor_partner_name || "--",
          // donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_quality_donor: embryologyData?.sperms_quality_donor || null,
          sperms_quality_other_donor:
            embryologyData?.sperms_quality_other_donor || "",
          sperms_prep_method_donor:
            embryologyData?.sperms_prep_method_donor || null,
          sperms_prep_method_other_donor:
            embryologyData?.sperms_prep_method_other_donor || "",
          sperms_donor: embryologyData?.sperms_donor || null,
          frozen_vial_id_donor: embryologyData?.frozen_vial_id_donor || "",
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          add_on: embryologyData?.add_on || null,
          frozen_vial_id: embryologyData?.frozen_vial_id || "",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by
            ? embryologyData.icsi_ivf_done_by
            : embryologyData?.icsi_ivf_done_by_other
              ? "Other"
              : null,
          assisted_by: embryologyData?.assisted_by
            ? embryologyData.assisted_by
            : embryologyData?.assisted_by_other
              ? "Other"
              : null,
          opu_date: embryologyData?.opu_date
            ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          // lmp: (embryologyData?.lmp !== '--' && embryologyData?.lmp)
          //   ? dayjs(
          //     moment(embryologyData?.lmp).format(
          //       "DD/MM/YYYY"
          //     ),
          //     "DD/MM/YYYY"
          //   )
          //   : "",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          atretic: embryologyData?.atretic || "",
          embryo_dev_pgt: embryologyData?.embryo_dev_pgt || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          embryo_dev_culture_media:
            embryologyData?.embryo_dev_culture_media || null,
          embryo_dev_culture_media_other:
            embryologyData?.embryo_dev_culture_media_other || null,
          freezing_media_other: embryologyData?.freezing_media_other || null,
          vitrification_devices_other:
            embryologyData?.vitrification_devices_other || null,
          icsi_ivf_done_by_other: embryologyData?.icsi_ivf_done_by_other || "",
          sperms_by: embryologyData?.sperms_by,
          sperms_prep_method_other:
            embryologyData?.sperms_prep_method_other || "",
          sperms_quality_other: embryologyData?.sperms_quality_other || "",
          assisted_by_other: embryologyData?.assisted_by_other || "",
          embryo_dev_batch_no_exp_date:
            embryologyData?.embryo_dev_batch_no_exp_date || "",
          tesa_pesa_done_by_other:
            embryologyData?.tesa_pesa_done_by_other || "",
          add_on_other: embryologyData?.add_on_other || "",
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,

          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss").format("HH:mm:ss")
            : null,

          day_0_hrs_post_icsi: embryologyData?.day_0_hrs_post_icsi || "--",

          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
            : null,
          day_6_date: embryologyData?.day_6_date
            ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
            : null,
          vitrification_batch_no_exp_date:
            embryologyData?.vitrification_batch_no_exp_date || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          // no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "",
          // no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "",
          thawing_media: embryologyData?.thawing_media || null,
          embryo_dev_incubator_other:
            embryologyData?.embryo_dev_incubator_other || "",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          total_straw: embryologyData?.total_straw || 0,
          total_goblet: embryologyData?.total_goblet || 0,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          embryo_dev_incubator: embryologyData?.embryo_dev_incubator || null,
          total_m1: embryologyData?.total_m1 || 0,
          total_m2: embryologyData?.total_m2 || 0,
          cleaved: embryologyData?.cleaved || 0,
          no_of_oocytes: embryologyData?.no_of_oocytes || 0,
          fert: embryologyData?.fert || 0,
          degenerated: embryologyData?.degenerated || 0,
          unfert: embryologyData?.unfert || 0,
          abnormal_pn: embryologyData?.abnormal_pn || 0,
          kept_for_blastocyst: embryologyData?.kept_for_blastocyst || 0,
          notes: embryologyData?.notes || "--",
          sperms_by_donor: embryologyData?.sperms_by_name_donor || null,
          eggs_donor: embryologyData?.eggs_donor || null,
          eggs_to_donor:
            embryologyData?.eggs_to_donor?.map((_) => _.name) || null,
          eggs_by_donor:
            embryologyData?.eggs_by_donor?.map((_) => _.id) || null,
          eggs_by_ivf_id_donor:
            embryologyData?.eggs_by_ivf_id_donor?.map((_) => _._id) || null,
          eggs_to: embryologyData?.eggs_to?.map((_) => _.name) || null,
          eggs_by: embryologyData?.eggs_by?.map((_) => _.id) || null,
          eggs_by_ivf_id:
            embryologyData?.eggs_by_ivf_id?.map((_) => _._id) || null,
        };

        const embryologyDataObjectForForm = {
          ivf_flow_id: embryologyData?.ivf_flow_id,
          _id: embryologyData?._id,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyDetails?.cycle_type || null,

          cycle_no: embryologyData?.cycle_no || "--",
          // opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by: embryologyData?.opu_done_by
            ? embryologyData.opu_done_by
            : embryologyData?.opu_done_by_other
              ? "Other"
              : null,
          opu_done_by_other: embryologyData?.opu_done_by_other || "",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          denudation_done_by: embryologyData?.denudation_done_by || null,
          anesthesia_given_by_other:
            embryologyData?.anesthesia_given_by_other || "",
          denudation_done_by_other:
            embryologyData?.denudation_done_by_other || "",
          tesa_pesa_done_by: embryologyData?.tesa_pesa_done_by
            ? embryologyData.tesa_pesa_done_by
            : embryologyData?.tesa_pesa_done_by_other
              ? "Other"
              : null,
          // donor_partner_name: embryologyData?.donor_partner_name || "--",
          // donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms_by: embryologyData?.sperms_by || null,
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          sperms_quality_donor: embryologyData?.sperms_quality_donor || null,
          sperms_quality_other_donor:
            embryologyData?.sperms_quality_other_donor || "",
          sperms_prep_method_donor:
            embryologyData?.sperms_prep_method_donor || null,
          sperms_prep_method_other_donor:
            embryologyData?.sperms_prep_method_other_donor || "",
          sperms_donor: embryologyData?.sperms_donor || null,
          sperms_by_donor: embryologyData?.sperms_by_name_donor || null,
          frozen_vial_id_donor: embryologyData?.frozen_vial_id_donor || "",
          add_on: embryologyData?.add_on || null,
          frozen_vial_id: embryologyData?.frozen_vial_id || "",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by
            ? embryologyData.icsi_ivf_done_by
            : embryologyData?.icsi_ivf_done_by_other
              ? "Other"
              : null,
          assisted_by: embryologyData?.assisted_by
            ? embryologyData.assisted_by
            : embryologyData?.assisted_by_other
              ? "Other"
              : null,
          opu_date: embryologyData?.opu_date
            ? dayjs(
              moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          // lmp: (embryologyData?.lmp !== '--' && embryologyData?.lmp)
          //   ? dayjs(
          //     moment(embryologyData?.lmp).format(
          //       "DD/MM/YYYY"
          //     ),
          //     "DD/MM/YYYY"
          //   )
          //   : "",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          atretic: embryologyData?.atretic || "",
          embryo_dev_pgt: embryologyData?.embryo_dev_pgt || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
            : null,
          embryo_dev_culture_media:
            embryologyData?.embryo_dev_culture_media || null,
          freezing_media_other: embryologyData?.freezing_media_other || null,
          vitrification_devices_other:
            embryologyData?.vitrification_devices_other || null,
          icsi_ivf_done_by_other: embryologyData?.icsi_ivf_done_by_other || "",
          sperms_prep_method_other:
            embryologyData?.sperms_prep_method_other || "",
          sperms_quality_other: embryologyData?.sperms_quality_other || "",
          assisted_by_other: embryologyData?.assisted_by_other || "",
          embryo_dev_culture_media_other:
            embryologyData?.embryo_dev_culture_media_other || "",
          embryo_dev_batch_no_exp_date:
            embryologyData?.embryo_dev_batch_no_exp_date || "",
          tesa_pesa_done_by_other:
            embryologyData?.tesa_pesa_done_by_other || "",
          add_on_other: embryologyData?.add_on_other || "",
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? dayjs(
              moment(embryologyData?.embryo_dev_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
            : null,

          day_0_hrs_post_icsi: embryologyData?.day_0_hrs_post_icsi || "--",

          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? dayjs(
              moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_6_date: embryologyData?.day_6_date
            ? dayjs(
              moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          vitrification_batch_no_exp_date:
            embryologyData?.vitrification_batch_no_exp_date || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? dayjs(
              moment(embryologyData?.vitrification_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          tank_no: embryologyData?.tank_no || "",
          // no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "",
          thawing_media: embryologyData?.thawing_media || null,
          embryo_dev_incubator_other:
            embryologyData?.embryo_dev_incubator_other || "",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? dayjs(
              moment(embryologyData?.warming_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          total_straw: embryologyData?.total_straw || 0,
          total_goblet: embryologyData?.total_goblet || 0,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          embryo_dev_incubator: embryologyData?.embryo_dev_incubator || null,
          notes: embryologyData?.notes || "--",
          cleaved: embryologyData?.cleaved || 0,
          fert: embryologyData?.fert || 0,
          degenerated: embryologyData?.degenerated || 0,
          unfert: embryologyData?.unfert || 0,
          abnormal_pn: embryologyData?.abnormal_pn || 0,
          kept_for_blastocyst: embryologyData?.kept_for_blastocyst || 0,
          no_of_oocytes: embryologyData?.no_of_oocytes || 0,
          eggs_donor: embryologyData?.eggs_donor || null,
          eggs_to_donor:
            embryologyData?.eggs_to_donor?.map((_) => _.name) || null,
          eggs_by_donor:
            embryologyData?.eggs_by_donor?.map((_) => _.id) || null,
          eggs_by_ivf_id_donor:
            embryologyData?.eggs_by_ivf_id_donor?.map((_) => _._id) || null,
          eggs_to: embryologyData?.eggs_to?.map((_) => _.name) || null,
          eggs_by: embryologyData?.eggs_by?.map((_) => _.id) || null,
          eggs_by_ivf_id:
            embryologyData?.eggs_by_ivf_id?.map((_) => _._id) || null,
          ...newPackageData,
        };
        setBackupIvfList(embryologyData?.eggs_by_ivf_id);
        setBackupIvfDonerList(embryologyData?.eggs_by_ivf_id_donor);
        // setDonateByIVFData(embryologyData?.donateByIVFData);
        sortEmbro.map((item, i) => {
          embryologyDataObjectForForm[`no_of_oocytes${i}`] = item.no_of_oocytes;
          embryologyDataObjectForForm[`total_m2${i}`] = item.total_m2;
          embryologyDataObjectForForm[`total_m1${i}`] = item.total_m1;
          embryologyDataObjectForForm[`gv${i}`] = item.gv;
          embryologyDataObjectForForm[`atretic${i}`] = item.atretic;
          embryologyDataObjectForForm[`fert${i}`] = item.fert;
          embryologyDataObjectForForm[`cleaved${i}`] = item.cleaved;
          embryologyDataObjectForForm[`unfert${i}`] = item.unfert;
          embryologyDataObjectForForm[`degenerated${i}`] = item.degenerated;
          embryologyDataObjectForForm[`kept_for_blastocyst${i}`] =
            item.kept_for_blastocyst;
          embryologyDataObjectForForm[`total_blastocyst${i}`] =
            item.total_blastocyst;
          item.embryo.map((emb, j) => {
            embryologyDataObjectForForm[`oocytes${i}${j}`] = emb.oocytes;
            embryologyDataObjectForForm[`maturation_stage${i}${j}`] =
              emb.maturation_stage;
            embryologyDataObjectForForm[`oocytes_quality${i}${j}`] =
              emb.oocytes_quality;
            embryologyDataObjectForForm[`fert_check${i}${j}`] = emb.fert_check;
            embryologyDataObjectForForm[`stage_of_development${i}${j}`] =
              IvfFlowsheetList?.planned_cycle?.includes("Oocytes Vitrification")
                ? emb.maturation_stage
                : emb.stage_of_development;
            embryologyDataObjectForForm[`embryo_grade${i}${j}`] =
              emb.embryo_grade;
            embryologyDataObjectForForm[`blasto_score${i}${j}`] =
              emb.blasto_score;
            embryologyDataObjectForForm[`rating${i}${j}`] = emb.rating;
            embryologyDataObjectForForm[`et_status${i}${j}`] =
              emb?.et_status || null;
            embryologyDataObjectForForm[`provider${i}${j}`] =
              emb?.provider || null;
            embryologyDataObjectForForm[`provider_other${i}${j}`] =
              emb?.provider_other || null;
            embryologyDataObjectForForm[`introducer${i}${j}`] =
              emb?.introducer || null;
            embryologyDataObjectForForm[`introducer_other${i}${j}`] =
              emb?.introducer_other || null;
            embryologyDataObjectForForm[`complication${i}${j}`] =
              emb?.complication || null;
            embryologyDataObjectForForm[`date_of_freezing${i}${j}`] =
              emb?.date_of_freezing
                ? dayjs(
                  moment(emb?.date_of_freezing).format("DD/MM/YYYY"),
                  "DD/MM/YYYY"
                )
                : null;
            embryologyDataObjectForForm[`vitrification_id${i}${j}`] =
              emb?.vitrification_id || null;
            embryologyDataObjectForForm[`straw_color${i}${j}`] =
              emb?.straw_color || null;
            embryologyDataObjectForForm[`straw_color_other${i}${j}`] =
              emb?.straw_color_other || null;
            embryologyDataObjectForForm[`goblet_color${i}${j}`] =
              emb?.goblet_color || null;
            embryologyDataObjectForForm[`goblet_color_other${i}${j}`] =
              emb?.goblet_color_other || null;
            embryologyDataObjectForForm[`vitrified_by${i}${j}`] =
              emb?.vitrified_by ? emb?.vitrified_by?.split(",") : null;
            embryologyDataObjectForForm[`status${i}${j}`] = emb?.status || null;
            embryologyDataObjectForForm[`well_no${i}${j}`] =
              emb?.well_no || null;
          });
        });
        // setDonateByIVFDataDonor(embryologyData?.donateByIVFDataDonor);
        setEmbryologyDetails(embryologyDataObject);
        form.setFieldsValue(embryologyDataObjectForForm);
        if (isSetData) {
          setEmbryologyDetails(embryologyDataObject);
          form.setFieldsValue(embryologyDataObjectForForm);
        }
        return embryologyDataObject;
      }
    },
    [dispatch, embryoTable, form, userType]
  );

  useEffect(() => {
    if (ivfIdList?.length > 0) {
      const ivfListId = ivfIdList?.map((item) => ({
        value: item._id,
        label: item.ivf_id,
        protocol: item.protocol,
      }));
      setIvfIdOption(ivfListId);
      setEmbryologyDetails((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      }));
      form.setFieldsValue({
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      });
    }
  }, [ivfIdList]);

  const handleIvfId = useCallback(
    (id) => {
      const findList = ivfIdOption?.find((item) => item.value === id);
      const updatedEmbryologyData = embryologyData?.embryo?.map((item) => {
        return {
          ...item,
          vitrified_by: item?.vitrified_by
            ? item?.vitrified_by?.split(",")
            : "",
        };
      });
      const newPackageData = transformData(
        updatedEmbryologyData || [embryoTable]
      );
      if (findList) {
        setEmbryoTableList(updatedEmbryologyData || [embryoTable]);
        setEmbryologyDetails({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          // cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          // opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by: embryologyData?.opu_done_by
            ? embryologyData.opu_done_by
            : embryologyData?.opu_done_by_other
              ? "Other"
              : null,
          opu_done_by_other: embryologyData?.opu_done_by_other || "",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          denudation_done_by: embryologyData?.denudation_done_by || null,
          anesthesia_given_by_other:
            embryologyData?.anesthesia_given_by_other || "",
          denudation_done_by_other:
            embryologyData?.denudation_done_by_other || "",
          tesa_pesa_done_by: embryologyData?.tesa_pesa_done_by
            ? embryologyData.tesa_pesa_done_by
            : embryologyData?.tesa_pesa_done_by_other
              ? "Other"
              : null,
          donor_partner_name: embryologyData?.donor_partner_name,
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          sperms_quality_donor: embryologyData?.sperms_quality_donor || null,
          sperms_quality_other_donor:
            embryologyData?.sperms_quality_other_donor || "",
          sperms_prep_method_donor:
            embryologyData?.sperms_prep_method_donor || null,
          sperms_prep_method_other_donor:
            embryologyData?.sperms_prep_method_other_donor || "",
          sperms_donor: embryologyData?.sperms_donor || null,
          sperms_by_donor: embryologyData?.sperms_by_name_donor || null,
          frozen_vial_id_donor: embryologyData?.frozen_vial_id_donor || "",
          add_on: embryologyData?.add_on || null,
          frozen_vial_id: embryologyData?.frozen_vial_id || "",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by
            ? embryologyData.icsi_ivf_done_by
            : embryologyData?.icsi_ivf_done_by_other
              ? "Other"
              : null,
          assisted_by: embryologyData?.assisted_by
            ? embryologyData.assisted_by
            : embryologyData?.assisted_by_other
              ? "Other"
              : null,
          opu_date: embryologyData?.opu_date
            ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp:
            embryologyData?.lmp !== "--" && embryologyData?.lmp
              ? dayjs(
                moment(embryologyData?.lmp).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              )
              : "",
          lh: embryologyData?.lh || "--",
          atretic: embryologyData?.atretic || "",
          embryo_dev_pgt: embryologyData?.embryo_dev_pgt || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          embryo_dev_culture_media:
            embryologyData?.embryo_dev_culture_media || null,
          embryo_dev_culture_media_other:
            embryologyData?.embryo_dev_culture_media_other || null,
          freezing_media_other: embryologyData?.freezing_media_other || null,
          vitrification_devices_other:
            embryologyData?.vitrification_devices_other || null,
          icsi_ivf_done_by_other: embryologyData?.icsi_ivf_done_by_other || "",
          sperms_prep_method_other:
            embryologyData?.sperms_prep_method_other || "",
          sperms_quality_other: embryologyData?.sperms_quality_other || "",
          assisted_by_other: embryologyData?.assisted_by_other || "",
          embryo_dev_batch_no_exp_date:
            embryologyData?.embryo_dev_batch_no_exp_date || "",
          tesa_pesa_done_by_other:
            embryologyData?.tesa_pesa_done_by_other || "",
          add_on_other: embryologyData?.add_on_other || "",
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).format("DD/MM/YYYY")
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          day_0_hrs_post_icsi: embryologyData?.day_0_hrs_post_icsi || "--",
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          // day_1_date: embryologyData?.day_1_date
          //   ? moment(embryologyData?.day_1_date).format("DD/MM/YYYY")
          //   : null,
          // day_3_date: embryologyData?.day_3_date
          //   ? moment(embryologyData?.day_3_date).format("DD/MM/YYYY")
          //   : null,
          // day_5_date: embryologyData?.day_5_date
          //   ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
          //   : null,
          // day_6_date: embryologyData?.day_6_date
          //   ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
          //   : null,
          // day_7_date: embryologyData?.day_7_date
          //   ? moment(embryologyData?.day_7_date).format("DD/MM/YYYY")
          //   : null,
          day_1_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).add(1, "days").format("DD/MM/YYYY")
            : null,
          day_3_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).add(3, "days").format("DD/MM/YYYY")
            : null,
          day_5_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).add(5, "days").format("DD/MM/YYYY")
            : null,
          day_6_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).add(6, "days").format("DD/MM/YYYY")
            : null,
          day_7_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).add(7, "days").format("DD/MM/YYYY")
            : null,
          vitrification_batch_no_exp_date:
            embryologyData?.vitrification_batch_no_exp_date || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          // no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "",
          // no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "",
          thawing_media: embryologyData?.thawing_media || null,
          embryo_dev_incubator_other:
            embryologyData?.embryo_dev_incubator_other || "",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          total_straw: embryologyData?.total_straw || 0,
          total_goblet: embryologyData?.total_goblet || 0,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          embryo_dev_incubator: embryologyData?.embryo_dev_incubator || null,
          total_m1: embryologyData?.total_m1 || 0,
          total_m2: embryologyData?.total_m2 || 0,
          cleaved: embryologyData?.cleaved || 0,
          fert: embryologyData?.fert || 0,
          degenerated: embryologyData?.degenerated || 0,
          unfert: embryologyData?.unfert || 0,
          abnormal_pn: embryologyData?.abnormal_pn || 0,
          kept_for_blastocyst: embryologyData?.kept_for_blastocyst || 0,
          notes: embryologyData?.notes || "--",
          sperms_by: embryologyData?.sperms_by_name || null,
          eggs_donor: embryologyData?.eggs_donor || null,
          eggs_to_donor:
            embryologyData?.eggs_to_donor?.map((_) => _.name) || null,
          eggs_by_donor:
            embryologyData?.eggs_by_donor?.map((_) => _.id) || null,
          eggs_by_ivf_id_donor:
            embryologyData?.eggs_by_ivf_id_donor?.map((_) => _.name) || null,
          eggs_to: embryologyData?.eggs_to?.map((_) => _.name) || null,
          eggs_by: embryologyData?.eggs_by?.map((_) => _.id) || null,
          eggs_by_ivf_id:
            embryologyData?.eggs_by_ivf_id?.map((_) => _.name) || null,
        });
        form.setFieldsValue({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          // cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          // opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by: embryologyData?.opu_done_by
            ? embryologyData.opu_done_by
            : embryologyData?.opu_done_by_other
              ? "Other"
              : null,
          opu_done_by_other: embryologyData?.opu_done_by_other || "--",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          denudation_done_by: embryologyData?.denudation_done_by || null,
          anesthesia_given_by_other:
            embryologyData?.anesthesia_given_by_other || "",
          denudation_done_by_other:
            embryologyData?.denudation_done_by_other || "",
          tesa_pesa_done_by: embryologyData?.tesa_pesa_done_by
            ? embryologyData.tesa_pesa_done_by
            : embryologyData?.tesa_pesa_done_by_other
              ? "Other"
              : null,
          donor_partner_name: embryologyData?.donor_partner_name,
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          sperms_quality_donor: embryologyData?.sperms_quality_donor || null,
          sperms_quality_other_donor:
            embryologyData?.sperms_quality_other_donor || "",
          sperms_prep_method_donor:
            embryologyData?.sperms_prep_method_donor || null,
          sperms_prep_method_other_donor:
            embryologyData?.sperms_prep_method_other_donor || "",
          sperms_donor: embryologyData?.sperms_donor || null,
          sperms_by_donor: embryologyData?.sperms_by_name_donor || null,
          frozen_vial_id_donor: embryologyData?.frozen_vial_id_donor || "",
          add_on: embryologyData?.add_on || null,
          frozen_vial_id: embryologyData?.frozen_vial_id || "",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by
            ? embryologyData.icsi_ivf_done_by
            : embryologyData?.icsi_ivf_done_by_other
              ? "Other"
              : null,
          assisted_by: embryologyData?.assisted_by
            ? embryologyData.assisted_by
            : embryologyData?.assisted_by_other
              ? "Other"
              : null,
          opu_date: embryologyData?.opu_date
            ? dayjs(
              moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp:
            embryologyData?.lmp !== "--" && embryologyData?.lmp
              ? dayjs(
                moment(embryologyData?.lmp).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              )
              : "",
          lh: embryologyData?.lh || "--",
          atretic: embryologyData?.atretic || "",
          embryo_dev_pgt: embryologyData?.embryo_dev_pgt || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
            : null,
          embryo_dev_culture_media:
            embryologyData?.embryo_dev_culture_media || null,
          embryo_dev_culture_media_other:
            embryologyData?.embryo_dev_culture_media_other || null,
          freezing_media_other: embryologyData?.freezing_media_other || null,
          vitrification_devices_other:
            embryologyData?.vitrification_devices_other || null,
          icsi_ivf_done_by_other: embryologyData?.icsi_ivf_done_by_other || "",
          sperms_prep_method_other:
            embryologyData?.sperms_prep_method_other || "",
          sperms_quality_other: embryologyData?.sperms_quality_other || "",
          assisted_by_other: embryologyData?.assisted_by_other || "",
          embryo_dev_batch_no_exp_date:
            embryologyData?.embryo_dev_batch_no_exp_date || "",
          tesa_pesa_done_by_other:
            embryologyData?.tesa_pesa_done_by_other || "",
          add_on_other: embryologyData?.add_on_other || "",
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? dayjs(
              moment(embryologyData?.embryo_dev_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? dayjs(
              moment(embryologyData?.day_0_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
            : null,
          day_1_date: embryologyData?.day_1_date
            ? dayjs(
              moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_0_hrs_post_icsi: embryologyData?.day_0_hrs_post_icsi || "--",
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
            : null,
          //   day_1_date: embryologyData?.day_1_date
          //   ? dayjs(
          //     moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
          //     "DD/MM/YYYY"
          //   )
          //   : null,
          // day_3_date: embryologyData?.day_3_date
          //   ? dayjs(
          //     moment(embryologyData?.day_3_date).format("DD/MM/YYYY"),
          //     "DD/MM/YYYY"
          //   )
          //   : null,

          // day_5_date: embryologyData?.day_5_date
          //   ? dayjs(
          //     moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
          //     "DD/MM/YYYY"
          //   )
          //   : null,
          // day_6_date: embryologyData?.day_6_date
          //   ? dayjs(
          //     moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
          //     "DD/MM/YYYY"
          //   )
          //   : null,
          // day_7_date: embryologyData?.day_7_date
          //   ? dayjs(
          //     moment(embryologyData?.day_7_date).format("DD/MM/YYYY"),
          //     "DD/MM/YYYY"
          //   )
          //   : null,
          day_1_date: embryologyData?.day_0_time
            ? dayjs(
              moment(embryologyData?.day_0_time).add(1, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,

          day_3_date: embryologyData?.day_0_time
            ? dayjs(
              moment(embryologyData?.day_0_time).add(3, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,

          day_5_date: embryologyData?.day_0_time
            ? dayjs(
              moment(embryologyData?.day_0_time).add(5, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,

          day_6_date: embryologyData?.day_0_time
            ? dayjs(
              moment(embryologyData?.day_0_time).add(6, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,

          day_7_date: embryologyData?.day_0_time
            ? dayjs(
              moment(embryologyData?.day_0_time).add(7, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          vitrification_batch_no_exp_date:
            embryologyData?.vitrification_batch_no_exp_date || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? dayjs(
              moment(embryologyData?.vitrification_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          // no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "",
          // no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "",
          thawing_media: embryologyData?.thawing_media || null,
          embryo_dev_incubator_other:
            embryologyData?.embryo_dev_incubator_other || "",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? dayjs(
              moment(embryologyData?.warming_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          total_straw: embryologyData?.total_straw || 0,
          total_goblet: embryologyData?.total_goblet || 0,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          embryo_dev_incubator: embryologyData?.embryo_dev_incubator || null,
          notes: embryologyData?.notes || "--",
          eggs_donor: embryologyData?.eggs_donor || null,
          eggs_to_donor:
            embryologyData?.eggs_to_donor?.map((_) => _.name) || null,
          eggs_by_donor:
            embryologyData?.eggs_by_donor?.map((_) => _.id) || null,
          eggs_by_ivf_id_donor:
            embryologyData?.eggs_by_ivf_id_donor?.map((_) => _.name) || null,
          eggs_to: embryologyData?.eggs_to?.map((_) => _.name) || null,
          eggs_by: embryologyData?.eggs_by?.map((_) => _.id) || null,
          eggs_by_ivf_id:
            embryologyData?.eggs_by_ivf_id?.map((_) => _.name) || null,
          sperms_by: embryologyData?.sperms_by_name || null,
          ...newPackageData,
        });
      }
    },
    [form, ivfIdOption]
  );

  const onFinish = (values) => {
    if (embryologyDetails?.ivf_flow_id) {
      const donorBy = [];
      const eggsBy = [];
      const eggsBydonor = [];
      const eggsIvfId = [];
      const eggsIvfDonorId = [];
      const updatedEmbryoTableData = embryology_count?.map((item) => {
        if (item?.patient_detail) {
          if (item?.patient_detail.isDonor) {
            eggsBydonor.push({
              id: item?.patient_detail.patientId,
              name: item?.patient_detail.patientName,
              disable: true,
            });
            eggsIvfDonorId.push({
              _id: item?.patient_detail?.ivf._id,
              ivf_id: item?.patient_detail?.ivf.ivf_id,
              disable: true,
            });
          } else {
            if (item?.patient_detail) {
              eggsBy.push({
                id: item?.patient_detail.patientId,
                name: item?.patient_detail.patientName,
                disable: true,
              });
              eggsIvfId.push({
                _id: item?.patient_detail?.ivf._id,
                ivf_id: item?.patient_detail?.ivf.ivf_id,
                disable: true,
              });
            }
          }
        }
        return {
          ...item,
          reference_ivf_id:
            embryologyDetails?.eggs === "Donor Fresh"
              ? item?.patient_detail?.ivf._id
              : null,
          embryo: item.embryo.map((e) => {
            // Return the modified embryo array
            const date = convertToCommonDateFormat(e?.date_of_freezing);
            return {
              ...e,
              vitrified_by: e?.vitrified_by?.toString(),
              date_of_freezing: e?.date_of_freezing
                ? moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                : null,
            };
          }),
        };
      });
      if (patientList) {
        patientList?.map((patient) => {
          if (embryologyDetails?.eggs_to?.includes(patient._id)) {
            donorBy.push({ id: patient._id, name: patient.patient_full_name });
          }
        }, []);
      }
      const obj = {
        ...embryologyDetails,
        embryology_count: updatedEmbryoTableData,
        eggs_by: eggsBy,
        eggs_by_donor: eggsBydonor,
        eggs_by_ivf_id: eggsIvfId,
        eggs_by_ivf_id_donor: eggsIvfDonorId,
        eggs_to: donorBy,
        icsi_ivf_done_by:
          embryologyDetails?.icsi_ivf_done_by === "Other"
            ? null
            : embryologyDetails?.icsi_ivf_done_by,
        opu_done_by:
          embryologyDetails?.opu_done_by === "Other"
            ? null
            : embryologyDetails?.opu_done_by,
        tesa_pesa_done_by:
          embryologyDetails?.tesa_pesa_done_by === "Other"
            ? null
            : embryologyDetails?.tesa_pesa_done_by,
        assisted_by:
          embryologyDetails?.assisted_by === "Other"
            ? null
            : embryologyDetails?.assisted_by,
        eggs_by_name: eggByDetail?.patient_full_name,
        sperms_by_donor: spermsByDetailDonor?._id,
        sperms_by_name_donor: spermsByDetailDonor?.patient_full_name,
      };

      if (Object.keys(embryologyData)?.length > 0) {
        dispatch(
          editEmbryologyData({
            location_id: selectedLocation,
            _id: embryologyDetails?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      } else {
        dispatch(
          createEmbryologyData({
            location_id: selectedLocation,
            patient_reg_id: selectedPatient?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      }
    } else {
      toast.error("IVF id Is Not Generated");
    }
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearEmbryologyData = useCallback(() => {
    // setPatientDetails({
    //   patient_id: "",
    //   patient_dob: "",
    //   patient_full_name: "",
    //   partner_full_name: "",
    // });
    setIvfIdOption([]);
    setEmbryoTableList([]);
    setPrintOption([]);
    setEmbryologyDetails({
      ivf_flow_id: "",
      eggs: null,
      cycle_type: null,
      cycle_no: "",
      opu_done_by: null,
      opu_done_by_other: "",
      anesthesia_given_by: null,
      denudation_done_by: null,
      anesthesia_given_by_other: "",
      denudation_done_by_other: "",
      tesa_pesa_done_by: null,
      donor_partner_name: "",
      donor_partner_age: "",
      sperms: null,
      sperms_quality: null,
      sperms_prep_method: null,
      add_on: null,
      frozen_vial_id: "",
      icsi_ivf_done_by: null,
      assisted_by: null,
      opu_date: null,
      opu_time: null,
      actual_opu_time: null,
      amh: "",
      progesterone: "",
      lmp: "",
      lh: "",
      e2: "",
      atretic: "",
      embryo_dev_pgt: null,
      denudation_time: null,
      icsi_ivf_time: null,
      embryo_dev_culture_media: null,
      embryo_dev_culture_media_other: null,
      freezing_media_other: null,
      vitrification_devices_other: null,
      icsi_ivf_done_by_other: "",
      sperms_prep_method_other: "",
      sperms_quality_other: "",
      assisted_by_other: "",
      embryo_dev_batch_no_exp_date: "",
      tesa_pesa_done_by_other: "",
      add_on_other: "",
      embryo_dev_batch_no: "",
      embryo_dev_expiry_date: null,
      day_0_date: null,
      day_0_time: null,
      day_1_date: null,
      day_0_hrs_post_icsi: "",
      day_3_date: null,
      day_3_time: null,
      day_5_date: null,
      day_6_date: null,
      day_7_date: null,
      vitrification_batch_no_exp_date: "",
      freezing_media: null,
      vitrification_devices: null,
      vitrification_batch_no: "",
      vitrification_expiry_date: null,
      pre_frozen_embryo_available: null,
      // no_of_goblet: "",
      tank_no: "",
      // no_of_straws: "",
      cannister_no: "",
      thawing_media: null,
      embryo_dev_incubator_other: "",
      warming_expiry_date: null,
      distance_from_fundus: "",
      transfer_done_by: null,
      total_straw: 0,
      total_goblet: 0,
      embryo_loading_by: null,
      embryo_dev_incubator: null,
      total_m1: 0,
      total_m2: 0,
      cleaved: 0,
      fert: 0,
      degenerated: 0,
      unfert: 0,
      abnormal_pn: 0,
      kept_for_blastocyst: 0,
      no_of_oocytes: 0,
      notes: "",
      eggs_donor: null,
      eggs_to_donor: null,
      eggs_by_ivf_id_donor: null,
      eggs_to: null,
      eggs_by_ivf_id: "",
      eggs_by_donor: null,
    });
    form.resetFields();
  }, [form]);

  const handleClear = () => {
    clearEmbryologyData();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
    setEggsByBackupList([])
  };

  useEffect(() => {
    const slider = document.querySelector(
      ".custom_table_Wrap .table-responsive"
    );
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  const getNewSelectedPatientData = useCallback(async () => {
    if (
      embryologyDataUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(embryologyData)?.length === 0
    ) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation,
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [
    dispatch,
    selectedLocation,
    selectedPatient,
    embryologyDataUpdate,
    embryologyData,
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [embryologyDataUpdate]);

  useEffect(() => {
    const totalOocytes = parseInt(embryologyDetails?.no_of_oocytes) || 0;
    const totalM2 = parseInt(embryologyDetails?.total_m2) || 0;
    const totalM1 = parseInt(embryologyDetails?.total_m1) || 0;
    const atretic = parseInt(embryologyDetails?.atretic) || 0;

    let cal = totalOocytes - (totalM1 + totalM2 + atretic);

    cal = cal < 0 ? 0 : cal;
    form.setFieldsValue({
      gv: cal,
    });
  }, [
    embryologyDetails?.no_of_oocytes,
    embryologyDetails?.total_m1,
    embryologyDetails?.total_m2,
    embryologyDetails?.atretic,
    form,
  ]);

  const printVitrificationReportData = useCallback(
    async (val) => {
      dispatch(
        printVitrificationReport({
          location_id: selectedLocation,
          moduleId: selectedModule?._id,
          patientRegId: selectedPatient?._id,
          ivfFlowId: embryologyData?.ivf_flow_id,
          payload: {
            stage: val,
          },
        })
      );
    },
    [selectedModule, dispatch, embryologyData, selectedPatient]
  );

  const handlechangePickupDate = useCallback(
    (e) => {
      if (embryologyDetails?.cycle_type?.includes("OD")) {
        setEmbryologyDetails({
          ...embryologyDetails,
          opu_date: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
        });

        // form.setFieldValue(
        //   "opu_date",
        //   dayjs(moment(new Date(e)).format("DD/MM/YYYY"), "DD/MM/YYYY")
        // );
      } else {
        setEmbryologyDetails((prevDetails) => ({
          ...prevDetails,
          opu_date: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
          day_0_date: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
          day_1_date: e
            ? moment(new Date(e)).add(1, "days").format("YYYY-MM-DD")
            : null,
          day_3_date: e
            ? moment(new Date(e)).add(3, "days").format("YYYY-MM-DD")
            : null,
          day_5_date: e
            ? moment(new Date(e)).add(5, "days").format("YYYY-MM-DD")
            : null,
          day_6_date: e
            ? moment(new Date(e)).add(6, "days").format("YYYY-MM-DD")
            : null,
          day_7_date: e
            ? moment(new Date(e)).add(7, "days").format("YYYY-MM-DD")
            : null,
        }));

        form.setFieldsValue({
          // opu_date: dayjs(
          //   moment(new Date(e)).format("DD/MM/YYYY"),
          //   "DD/MM/YYYY"
          // ),
          day_0_date: e
            ? dayjs(moment(new Date(e)).format("DD/MM/YYYY"), "DD/MM/YYYY")
            : null,
          day_1_date: e
            ? dayjs(
              moment(new Date(e)).add(1, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_3_date: e
            ? dayjs(
              moment(new Date(e)).add(3, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_5_date: e
            ? dayjs(
              moment(new Date(e)).add(5, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_6_date: e
            ? dayjs(
              moment(new Date(e)).add(6, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_7_date: e
            ? dayjs(
              moment(new Date(e)).add(7, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
        });
      }
    },
    [embryologyDetails, form]
  );

  const handleChangeFirstDayDate = useCallback(
    (e) => {
      if (embryologyDetails?.cycle_type?.includes("OD")) {
        setEmbryologyDetails((prevDetails) => ({
          ...prevDetails,
          day_0_date: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
          day_1_date: e
            ? moment(new Date(e)).add(1, "days").format("YYYY-MM-DD")
            : null,
          day_3_date: e
            ? moment(new Date(e)).add(3, "days").format("YYYY-MM-DD")
            : null,
          day_5_date: e
            ? moment(new Date(e)).add(5, "days").format("YYYY-MM-DD")
            : null,
          day_6_date: e
            ? moment(new Date(e)).add(6, "days").format("YYYY-MM-DD")
            : null,
          day_7_date: e
            ? moment(new Date(e)).add(7, "days").format("YYYY-MM-DD")
            : null,
        }));

        form.setFieldsValue({
          // day_0_date: dayjs(
          //   moment(new Date(e)).format("DD/MM/YYYY"),
          //   "DD/MM/YYYY"
          // ),
          day_1_date: e
            ? dayjs(
              moment(new Date(e)).add(1, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_3_date: e
            ? dayjs(
              moment(new Date(e)).add(3, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_5_date: e
            ? dayjs(
              moment(new Date(e)).add(5, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_6_date: e
            ? dayjs(
              moment(new Date(e)).add(6, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_7_date: e
            ? dayjs(
              moment(new Date(e)).add(7, "days").format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
        });
      } else {
        setEmbryologyDetails({
          ...embryologyDetails,
          day_0_date: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
        });
      }
    },
    [embryologyDetails, form]
  );
  const handleChange = (newValue, field) => {
    if (field === "eggs_by") {
      const patientDetails = patientList?.filter((patient) =>
        newValue.includes(patient?._id)
      );
      const existingPatientIds =
        eggBySelectedList?.map((patient) => patient._id) || [];
      const newPatients = patientDetails?.filter(
        (patient) => !existingPatientIds.includes(patient._id)
      );
      let array = [];
      if (newPatients.length !== 0) {
        const newPatientObj = JSON.parse(JSON.stringify(newPatients[0]));
        setEggsByBackupList((prev) => [...prev, newPatientObj]);
        newPatientObj["ivf_flow_data"].map((item) => {
          array.push(item);
        });
        if (backupIvfList.length > 0) {
          backupIvfList.map((item) => {
            array.push({ ...item, disabled: true });
          });
        }

        newPatientObj["ivf_flow_data"] = array;
        setDonateByIVFData(newPatientObj);
      }

      if (newPatients.length === 0) {
        const removedItems = embryologyDetails?.eggs_by?.filter(
          (item) => !newValue.includes(item)
        );

        setEggsByBackupList((prev) => prev?.filter((patient) =>
          !removedItems?.includes(patient?._id)
        ));

        const removedPatientDetails = patientList?.filter((patient) =>
          removedItems?.includes(patient?._id)
        );

        const isRemoved = removedItems?.includes(donateByIVFData?._id);

        if (isRemoved) {
          const removedIVFIds = removedPatientDetails.flatMap((patient) =>
            patient.ivf_flow_data.map((ivf) => ivf.ivf_id)
          );

          donateByIVFData.ivf_flow_data = donateByIVFData.ivf_flow_data.filter(
            (ivf) => !removedIVFIds?.includes(ivf.ivf_id)
          );

          setDonateByIVFData(donateByIVFData);
        }
      }

      setEmbryologyDetails({
        ...embryologyDetails,
      });
      setEggBySelectedList(patientDetails);

      let newA = [...embryology_count];

      // Managed embryo table if remove patient from the list
      // Create new objects for selected values that are not already in dataArray
      newValue.map((id) => {
        if (embryology_count.length === 0) {
          newA.push({ ...embryology_countTable, embryo: [] });
        } else if (embryology_count.length > 0) {
          //Check if the id exists in the array
          const find = embryology_count.find(
            (item) => item.patient_detail.patientId === id
          );
          if (!find) newA.push({ ...embryology_countTable, embryo: [] });
        }
      });

      if (newValue.length < eggBySelectedList.length && newValue.length > 0) {
        newA = newA.filter(
          (item1) =>
            item1.patient_detail.isDonor ||
            newValue.some((a) => a === item1.patient_detail.patientId)
        );
        setEmbryology_count(newA);
      }
      else if (newValue.length < eggBySelectedList.length && newValue.length === 0) {
        const idsToRemove = eggBySelectedList?.map(donor => donor._id);
        const filteredNewA = newA?.filter(item => !idsToRemove?.includes(item.patient_detail.patientId));
        setEmbryology_count(filteredNewA);
        setEmbryologyDetails({
          ...embryologyDetails,
          eggs_by: [],
          eggs_by_ivf_id: [],
        });
        form.setFieldsValue({
          eggs_by: [],
          eggs_by_ivf_id: [],
        });
        setBackupIvfList([])
      }
      // remove objects that are not in the selected values
      let filteredArray = newA.filter((item1) => {
        return newValue.some((id) => id === item1.patient_id);
      });

      setEmbryologyDetails({
        ...embryologyDetails,
        // eggs_by_ivf_id: null,
        eggs_by: newValue,
        eggs_by_ivf_id: backupIvfList.map((item) => item._id),
      });
      form.setFieldsValue({
        eggs_by_ivf_id: backupIvfList.map((item) => item._id),
        // eggs_by_ivf_id: null,
        eggs_by: newValue,
      });
    } else {
      setEmbryologyDetails({
        ...embryologyDetails,
        sperms_by: newValue,
      });
      form.setFieldsValue({
        sperms_by: newValue,
      });
    }
  };

  const handleDonorChange = (newValue, field) => {
    if (field === "eggs_by_donor") {
      const patientDetails = patientList?.filter((patient) =>
        newValue.includes(patient?._id)
      );
      const existingPatientIds =
        eggBySelectedListDonor?.map((patient) => patient._id) || [];

      const newPatients = patientDetails?.filter(
        (patient) => !existingPatientIds.includes(patient._id)
      );
      let array = [];

      if (newPatients.length !== 0) {
        const newPatientObj = JSON.parse(JSON.stringify(newPatients[0]));
        setEggsByDonorBackupList((prev) => [...prev, newPatientObj]);
        newPatientObj["ivf_flow_data"].map((item) => {
          array.push(item);
        });
        if (backupIvfDonerList.length > 0) {
          backupIvfDonerList.map((item) => {
            array.push({ ...item, disabled: true });
          });
        }
        newPatientObj["ivf_flow_data"] = array;
        setDonateByIVFDataDonor(newPatientObj);
      }

      if (newPatients.length === 0) {
        const removedItems = embryologyDetails?.eggs_by_donor?.filter(
          (item) => !newValue.includes(item)
        );

        setEggsByDonorBackupList((prev) => prev?.filter((patient) =>
          !removedItems?.includes(patient?._id)
        ));


        const removedPatientDetails = patientList?.filter((patient) =>
          removedItems.includes(patient?._id)
        );

        const isRemoved = removedItems?.includes(donateByIVFDataDonor?._id);

        if (isRemoved) {
          const removedIVFIds = removedPatientDetails.flatMap((patient) =>
            patient.ivf_flow_data.map((ivf) => ivf.ivf_id)
          );

          donateByIVFDataDonor.ivf_flow_data =
            donateByIVFDataDonor.ivf_flow_data.filter(
              (ivf) => !removedIVFIds.includes(ivf.ivf_id)
            );

          setDonateByIVFDataDonor(donateByIVFDataDonor);
        }
      }

      setEmbryologyDetails({
        ...embryologyDetails,
      });

      setEggBySelectedListDonor(patientDetails);

      let newA = [...embryology_count];

      // Create new objects for selected values that are not already in dataArray
      newValue.map((id) => {
        if (embryology_count.length === 0) {
          newA.push({ ...embryology_countTable, embryo: [] });
        } else if (embryology_count.length > 0) {
          //Check if the id exists in the array
          const find = embryology_count.find(
            (item) => item.patient_detail.patientId === id
          );
          if (!find) newA.push({ ...embryology_countTable, embryo: [] });
        }
      });
      if (newValue.length < eggBySelectedListDonor.length && newValue.length > 0) {
        newA = newA.filter(
          (item1) =>
            !item1.patient_detail.isDonor ||
            newValue.some((id) => id === item1.patient_detail.patientId)
        );
        setEmbryology_count(newA);
      }
      else if (newValue.length < eggBySelectedListDonor.length && newValue.length === 0) {
        const idsToRemove = eggBySelectedListDonor?.map(donor => donor._id);
        const filteredNewA = newA?.filter(item => !idsToRemove?.includes(item.patient_detail.patientId));
        setEmbryology_count(filteredNewA);
        setEmbryologyDetails({
          ...embryologyDetails,
          eggs_by_donor: [],
          eggs_by_ivf_id_donor: [],
        });
        form.setFieldsValue({
          eggs_by_donor: [],
          eggs_by_ivf_id_donor: [],
        });
        setBackupIvfDonerList([])
      }
      // remove objects that are not in the selected values
      // let filteredArray = newA.filter((item1) => {
      //   return newValue.some((id) => id === item1.patient_id);
      // });

      setEmbryologyDetails({
        ...embryologyDetails,
        // eggs_by_ivf_id_donor: null,
        eggs_by_donor: newValue,
        eggs_by_ivf_id_donor: backupIvfDonerList.map((item) => item._id),
      });
      form.setFieldsValue({
        // eggs_by_ivf_id_donor: null,
        eggs_by_donor: newValue,
        eggs_by_ivf_id_donor: backupIvfDonerList.map((item) => item._id),
      });
    } else {
      setEmbryologyDetails({
        ...embryologyDetails,
        sperms_by_donor: newValue,
      });
      form.setFieldsValue({
        sperms_by_donor: newValue,
      });
    }
  };

  const handleEggsChange = (value, key) => {
    setEmbryologyDetails({
      ...embryologyDetails,
      [key]: value || null,
    });
    if (value === "Own Fresh" && key === "eggs") {
      const selectedIvf = ivfIdOption.find(
        (item) => item.value === embryologyDetails?.ivf_flow_id
      );
      let newA = [...embryology_count];
      let updatedEmbryologyCount = newA.filter(
        (item) => item.patient_detail.isDonor
      );
      const embryoData = [
        ...updatedEmbryologyCount,
        {
          ...embryology_countTable,
          patient_detail: {
            patientId: selectedPatient?._id,
            patientName: selectedPatient?.patient_full_name,
            ivf: { ivf_id: selectedIvf.label, _id: selectedIvf.value },
            isDonor: false,
          },
          embryo: [],
        },
      ];
      setEmbryology_count(embryoData);
      const obj = {};
      Object.keys(embryology_countTable).map((key, index) => {
        obj[`${key}${embryoData.length - 1}`] = "";
      });

      form.setFieldsValue({
        ...obj,
      });
    } else if (value === "Own Fresh" && key === "eggs_donor") {
      let newA = [...embryology_count];

      let updatedEmbryologyCount = newA.filter(
        (item) => !item.patient_detail.isDonor
      );
      setEmbryology_count(updatedEmbryologyCount);
    }
  };

  const handleEggIvfSelect = (value, patient_id) => {
    //Managed ivf dropdown
    const ifvDetails = donateByIVFData?.ivf_flow_data?.filter((ivf) =>
      value.includes(ivf?._id)
    );

    const existingIvfIds = embryologyDetails.eggs_by_ivf_id
      ? embryologyDetails.eggs_by_ivf_id?.map((id) => id)
      : [];

    const newIvfs = ifvDetails?.filter(
      (patient) => !existingIvfIds.includes(patient._id)
    );

    const copyBackupIvf = [...backupIvfList];

    if (copyBackupIvf.length === 0) {
      copyBackupIvf.push({ ...newIvfs[0], _id: patient_id });
      setBackupIvfList(copyBackupIvf);
    } else {
    }
    const oldIvfs = ifvDetails?.filter((patient) =>
      existingIvfIds.includes(patient._id)
    );
    const newIvfValue = [...oldIvfs, ...newIvfs]?.map((ivf) => ivf._id);

    setEmbryologyDetails({
      ...embryologyDetails,
      eggs_by_ivf_id: newIvfValue || null,
    });
    form.setFieldsValue({
      eggs_by_ivf_id: newIvfValue || null,
    });

    // Managed embryo table
    const selectedIvf = donateByIVFData?.ivf_flow_data.find(
      (item) => item._id === newIvfs[0]?._id
    );
    let newA = [...embryology_count];

    if (embryology_count.length === 0) {
      newA.push({
        ...embryology_countTable,
        patient_detail: {
          patientId: donateByIVFData._id,
          patientName: donateByIVFData.patient_full_name,
          ivf: selectedIvf,
          isDonor: false,
        },
        embryo: [],
      });
    } else if (newA.length > 0) {
      //Check if the id exists in the array
      const patientDetail = newA.find(
        (item) =>
          item.patient_detail.patientId === patient_id &&
          !item.patient_detail.isDonor
      );

      if (!patientDetail) {
        newA.push({
          ...embryology_countTable,
          patient_detail: {
            patientId: donateByIVFData._id,
            patientName: donateByIVFData.patient_full_name,
            ivf: selectedIvf,
            isDonor: false,
          },
          embryo: [],
        });
      } else {
        //Remove ivf which is not in the selected list and stay donor ivf
        newA = newA.filter(
          (item) =>
            item.patient_detail.isDonor ||
            value.some((a) => a === item.patient_detail.ivf._id)
        );
      }
    }
    setEmbryology_count(newA);
  };

  const handleEggIvfSelectDonor = (value, patient_id) => {
    const ifvDetails = donateByIVFDataDonor?.ivf_flow_data?.filter((ivf) =>
      value.includes(ivf?._id)
    );

    const existingIvfIds = embryologyDetails.eggs_by_ivf_id_donor
      ? embryologyDetails.eggs_by_ivf_id_donor?.map((id) => id)
      : [];
    const newIvfs = ifvDetails?.filter(
      (patient) => !existingIvfIds.includes(patient._id)
    );
    const copyBackupIvf = [...backupIvfDonerList];
    if (copyBackupIvf.length === 0) {
      copyBackupIvf.push({ ...newIvfs[0], _id: patient_id });
      setBackupIvfDonerList(copyBackupIvf);
    } else {
    }
    const oldIvfs = ifvDetails?.filter((patient) =>
      existingIvfIds.includes(patient._id)
    );

    const newIvfValue = [...oldIvfs, ...newIvfs]?.map((ivf) => ivf._id);
    setEmbryologyDetails({
      ...embryologyDetails,
      eggs_by_ivf_id_donor: newIvfValue || null,
    });
    form.setFieldsValue({
      eggs_by_ivf_id_donor: newIvfValue || null,
    });
    const selectedIvf = donateByIVFDataDonor?.ivf_flow_data.find(
      (item) => item._id === newIvfs[0]?._id
    );
    let newA = [...embryology_count];
    if (embryology_count.length === 0) {
      newA.push({
        ...embryology_countTable,
        patient_detail: {
          patientId: donateByIVFDataDonor._id,
          patientName: donateByIVFDataDonor.patient_full_name,
          ivf: selectedIvf,
          isDonor: true,
        },
        embryo: [],
      });
    } else if (newA.length > 0) {
      //Check if the id exists in the array
      const patientDetail = newA.find(
        (item) =>
          item.patient_detail.patientId === patient_id &&
          item.patient_detail.isDonor
      );

      if (!patientDetail) {
        newA.push({
          ...embryology_countTable,
          patient_detail: {
            patientId: donateByIVFDataDonor._id,
            patientName: donateByIVFDataDonor.patient_full_name,
            ivf: selectedIvf,
            isDonor: true,
          },
          embryo: [],
        });
      } else {
        newA = newA.filter(
          (item) =>
            !item.patient_detail.isDonor ||
            value.some((a) => a === item.patient_detail.ivf._id)
        );
      }
    }

    setEmbryology_count(newA);
  };

  const handleSearch = useCallback(
    (newValue, selectedLocation) => {
      if (newValue && selectedLocation) {
        dispatch(
          getPatientList({
            patient_name: newValue,
            start: null,
            limit: null,
          })
        );
      }
    },
    [dispatch]
  );

  const disabledField = (key) => {
    switch (key) {
      case "anesthesia_given_by":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        break;
      case "opu_done_by":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        break;
      case "opu_date":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "opu_time":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "actual_opu_time":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "denudation_time":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "lh":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        else if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "e2":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Thawed oocyte ICSI"))
          return true;
        break;
      case "et_status":
        if (embryologyDetails?.cycle_type?.includes("OD")) return true;
        break;
      case "sperms":
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "sperms_quality":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "sperms_prep_method":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "frozen_vial_id":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "sperms_donor":
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "sperms_quality_donor":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "sperms_prep_method_donor":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "frozen_vial_id_donor":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "tesa_pesa_done_by":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "denudation_done_by":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "icsi_ivf_done_by":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "assisted_by":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "lmp":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "icsi_ivf_time":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "amh":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "add_on":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "embryo_dev_pgt":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "vitrification_batch_no_exp_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "embryo_dev_culture_media":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;

        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        break;
      case "embryo_dev_incubator":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_0_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_0_time":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_0_hrs_post_icsi":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_1_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_3_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_5_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_6_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "day_7_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "freezing_media":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "vitrification_devices":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "total_goblet":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "total_straw":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "tank_no":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      case "no_of_oocytes":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "total_m2":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "total_m1":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "gv":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "atretic":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;

        break;
      case "fert":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "cleaved":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "unfert":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "cannister_no":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "degenerated":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "total_blastocyst":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "kept_for_blastocyst":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "embryo_dev_batch_no_exp_date":
        if (
          embryologyDetails?.cycle_type?.includes("FET") &&
          embryologyDetails?.cycle_type?.includes("Surrogacy")
        )
          return true;
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;

        break;
      case "progesterone":
        if (embryologyDetails?.cycle_type?.includes("ED")) return true;
        if (embryologyDetails?.cycle_type?.includes("Professional Donor"))
          return true;
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;

        break;
      case "fert_check":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "stage_of_development":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "embryo_grade":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "blasto_score":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "provider":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "introducer":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "complication":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "date_of_freezing":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "vitrification_id":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "straw_color":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "goblet_color":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "vitrified_by":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "status":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;

      case "well_no":
        if (embryologyDetails?.cycle_type?.includes("Oocytes Vitrification"))
          return true;
        break;
      default:
        return false;
    }
  };

  const globalSearchTextChange = React.useCallback(
    _.debounce(handleSearch, 800),
    []
  );

  const handleClearSearch = useCallback(() => {
    dispatch(setPatientListData([]));
    // setEggByDetail({});
    // setPDetail({});
    setDonateByIVFData([]);
    form.setFieldsValue({
      eggs_by: null,
      sperms_by: null,
      eggs_by_ivf_id: null,
    });
    setEmbryologyDetails({
      ...embryologyDetails,
      eggs_by_ivf_id: null,
    });
    // form.setFieldsValue({
    //   eggs_by_ivf_id: null,
    // });
  }, [dispatch]);

  const handleClearSearchDonor = useCallback(() => {
    dispatch(setPatientListData([]));
    setDonateByIVFDataDonor([]);
    form.setFieldsValue({
      eggs_by_donor: null,
      sperms_by_donor: null,
      eggs_by_ivf_id_donor: null,
    });
    setEmbryologyDetails({
      ...embryologyDetails,
      eggs_by_ivf_id_donor: null,
    });
    // form.setFieldsValue({
    //   eggs_by_ivf_id: null,
    // });
  }, [dispatch]);

  const menuProps = (
    <Menu>
      {printOption?.map((item) => {
        return (
          <Menu.Item
            onClick={() => {
              selectedModule?._id &&
                selectedPatient?._id &&
                embryologyData?.ivf_flow_id &&
                printVitrificationReportData(item?.value);
            }}
            key="1"
          >
            {item?.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const createPrintOption = useCallback((tblData) => {
    const filteredEmbryoTableList = tblData?.filter((item) => {
      return stageOptionsForPrint?.some(
        (option) => option.value === item.stage_of_development
      );
    });
    const embryoTableOptions = filteredEmbryoTableList?.map((filteredItem) => {
      const { stage_of_development } = filteredItem;
      return { value: stage_of_development, label: stage_of_development };
    });
    const generateUniqueOptions = _.uniqBy(embryoTableOptions, "value");
    return generateUniqueOptions;
  }, []);

  const handleEmbryoDataChange = (value, key, index) => {
    if (!value) return null;
    const data = JSON.parse(JSON.stringify([...embryology_count]));
    data[index][key] = value;
    const obj = {};
    obj[`${key}${index}`] = value;

    if (
      key === "no_of_oocytes" ||
      key === "total_m2" ||
      key === "total_m1" ||
      key === "atretic"
    ) {
      const total_no_Of_OOCYTES = +data[index]["no_of_oocytes"] || 0;
      const total_m2 = +data[index]["total_m2"] || 0;
      const total_m1 = +data[index]["total_m1"] || 0;
      const atretic = +data[index]["atretic"] || 0;
      const gv = total_no_Of_OOCYTES - (total_m2 + total_m1 + atretic);
      data[index]["gv"] = gv < 0 ? 0 : gv;
      obj[`gv${index}`] = gv < 0 ? 0 : gv;
    }
    if (key === "total_m2" || key === "total_m1") {
      addRow(data[index]["total_m1"], data[index]["total_m2"], index, data);
    }
    form.setFieldsValue({
      ...obj,
    });
    if (key !== "total_m2" && key !== "total_m1") {
      setEmbryology_count(data);
    }
  };

  const convertToCommonDateFormat = (dateString) => {
    const possibleFormats = [
      "DD/MM/YYYY",
      "MM/DD/YYYY",
      "YYYY-MM-DD",
      "DD-MM-YYYY",
      "MM-DD-YYYY",
      "YYYY/MM/DD",
      moment.ISO_8601, // For ISO formatted dates
    ];

    const parsedDate = moment(dateString, possibleFormats, true); // 'true' for strict parsing
    if (!parsedDate.isValid()) {
      return null;
    }

    return parsedDate.format("YYYY-MM-DD");
  };

  const handleOccyteTableChange = (innerIndex, mainIndex, value, key) => {
    let updatedEmbryoCounter = JSON.parse(
      JSON.stringify([...embryology_count])
    );
    let obj = {};
    let fert = 0;
    let cleaved = 0;
    let grade = "";
    let unfert = 0;
    let degenerated = 0;
    let total_blastocyst = 0;
    let countD3 = 0;
    obj[`${key}${mainIndex}${innerIndex}`] = value;

    updatedEmbryoCounter[mainIndex].embryo[innerIndex][key] = value;

    if (key === "vitrification_id") {
      const uniqueVitrificationIds = new Set();

      updatedEmbryoCounter?.forEach((record) => {
        record.embryo.forEach((embryo) => {
          if (embryo.vitrification_id !== null) {
            uniqueVitrificationIds.add(embryo.vitrification_id);
          }
        });
      });

      const countOfUniqueIds = uniqueVitrificationIds.size;

      if (countOfUniqueIds > 0) {
        setEmbryologyDetails({
          ...embryologyDetails,
          total_straw: countOfUniqueIds || 0,
        });
        form.setFieldsValue({
          total_straw: countOfUniqueIds || 0,
        });
      }
    }

    if (key === "date_of_freezing") {
      obj[`date_of_freezing${mainIndex}${innerIndex}`] = value
        ? dayjs(moment(value).format("DD/MM/YYYY"), "DD/MM/YYYY")
        : null;
    }

    if (key === "fert_check") {
      updatedEmbryoCounter?.[mainIndex]?.embryo?.forEach((item) => {
        switch (item?.fert_check) {
          case "1PN":
            fert++;
            break;
          case "2PN":
            fert++;
            break;
          case "3PN":
            fert++;
            break;
          case "2 Cell":
            fert++;
            break;
          case "Abnormal PN":
            fert++;
            break;
          case "Unfert":
            unfert++;
            break;
          case "Degenerated":
            degenerated++;
            break;
          default:
            break;
        }
      });
      updatedEmbryoCounter[mainIndex].fert = fert;
      obj[`fert${mainIndex}`] = fert;
      updatedEmbryoCounter[mainIndex].unfert = unfert;
      obj[`unfert${mainIndex}`] = unfert;
      updatedEmbryoCounter[mainIndex].degenerated = degenerated;
      obj[`degenerated${mainIndex}`] = degenerated;
    }

    if (key === "embryo_grade") {
      updatedEmbryoCounter?.[mainIndex]?.embryo?.forEach((item) => {
        switch (item?.embryo_grade) {
          case "Grade-I":
            cleaved++;
            break;
          case "Grade-II":
            cleaved++;
            break;
          case "Grade-III":
            cleaved++;
            break;
          case "D3 Arrested":
            cleaved++;
            break;
          default:
            break;
        }
      });
      updatedEmbryoCounter[mainIndex].cleaved = cleaved;
      obj[`cleaved${mainIndex}`] = cleaved;
    }

    if (key === "stage_of_development") {
      obj[`date_of_freezing${mainIndex}${innerIndex}`] = null;
      updatedEmbryoCounter[mainIndex].embryo[innerIndex]["date_of_freezing"] =
        null;
      let day = days[value];
      if (day) {
        obj[`date_of_freezing${mainIndex}${innerIndex}`] =
          embryologyDetails?.day_0_date &&
          dayjs(
            moment(embryologyDetails?.day_0_date)
              .add(day, "days")
              .format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          );
        updatedEmbryoCounter[mainIndex].embryo[innerIndex]["date_of_freezing"] =
          moment(embryologyDetails?.day_0_date)
            .add(day, "days")
            .format("DD/MM/YYYY");
      }
    }
    if (
      key === "date_of_freezing" ||
      key === "stage_of_development" ||
      key === "embryo_grade"
    ) {
      updatedEmbryoCounter[mainIndex].embryo.map((item) => {
        // console.log(
        //   "embryologyDetails?.day_0_date",
        //   embryologyDetails?.day_0_date
        // );
        // console.log("item.date_of_freezing", item.date_of_freezing);

        // const date0 = moment(embryologyDetails?.day_0_date);
        // console.log("date0", date0);

        // const dateOfFreezing = moment(item.date_of_freezing, "DD/MM/YYYY");
        // console.log("dateOfFreezing", dateOfFreezing);

        // const diffInDays = dateOfFreezing.diff(date0, "days");
        // if (diffInDays) {
        //   if (item.stage_of_development === "D3") {
        //     if (diffInDays === days[item.stage_of_development]) countD3++;
        //   }
        // }

        // let date2 = null;
        const date1 = moment(embryologyDetails?.day_0_date, "YYYY-MM-DD");
        const convertDate = convertToCommonDateFormat(item.date_of_freezing);
        const date2 = convertDate ? moment(convertDate, "YYYY-MM-DD") : null;
        if (item?.date_of_freezing && date2) {
          const diffInDays = date2?.diff(date1, "days");
          if (3 === diffInDays) countD3++;
        }

        // if (item?.date_of_freezing && item?.stage_of_development === "D3") {
        //   let formatDate = moment(item?.date_of_freezing, "DD/MM/YYYY").format(
        //     "YYYY-MM-DD"
        //   );
        //   date2 = moment(formatDate, "YYYY-MM-DD");
        // } else {
        //   date2 = moment(item?.date_of_freezing, "YYYY-MM-DD");
        // }

        // if (item?.date_of_freezing && date2) {
        //   const diffInDays = date2?.diff(date1, "days");
        //   if (3 === diffInDays) countD3++;
        // }
      });

      const keptForBlast =
        parseInt(updatedEmbryoCounter[mainIndex]["cleaved"] || 0) - countD3;

      updatedEmbryoCounter[mainIndex]["kept_for_blastocyst"] = keptForBlast;
      obj[`kept_for_blastocyst${mainIndex}`] = keptForBlast;
    }

    if (key === "blasto_score") {
      const validScores = [
        "111",
        "112",
        "113",
        "121",
        "122",
        "123",
        "131",
        "132",
        "133",
        "211",
        "212",
        "213",
        "221",
        "222",
        "223",
        "231",
        "232",
        "233",
        "311",
        "312",
        "313",
        "321",
        "322",
        "323",
        "331",
        "332",
        "333",
      ];

      if (value) {
        updatedEmbryoCounter?.[mainIndex]?.embryo?.forEach((item) => {
          if (item?.blasto_score) {
            total_blastocyst++;
          }
        });
        obj[`total_blastocyst${mainIndex}`] = total_blastocyst;
        updatedEmbryoCounter[mainIndex].total_blastocyst = total_blastocyst;
        if (validScores.includes(value)) {
          // Determine grade based on the last digit of the score
          switch (value.slice(-1)) {
            case "1":
              grade = "Good";
              break;
            case "2":
              grade = "Fair";
              break;
            case "3":
              grade = "Poor";
              break;
            default:
              grade = "";
          }
          obj[`rating${mainIndex}${innerIndex}`] = grade;
          updatedEmbryoCounter[mainIndex].embryo[innerIndex]["rating"] = grade;
        } else {
          obj[`rating${mainIndex}${innerIndex}`] = "";
          updatedEmbryoCounter[mainIndex].embryo[innerIndex]["rating"] = "";
        }
      }

      updatedEmbryoCounter[mainIndex].total_blastocyst = total_blastocyst;
      obj[`total_blastocyst${mainIndex}`] = total_blastocyst;
    }

    form.setFieldsValue({
      ...obj,
    });
    setEmbryology_count(updatedEmbryoCounter);
  };

  const disableEmbryoGrade = (grade) => {
    const specialGrades = ["D3 Arrested", "Lysed", "NA"];
    return specialGrades.includes(grade);
  };

  const eggsByOptions = () => {

    const combinedOptionsArray = [...patientList, ...(embryologyData?.eggs_by || []), ...(eggsByBackupList || [])];

    const combinedOptions = isSearchPatient
      ? combinedOptionsArray
      : embryologyData?.eggs_by;

    return combinedOptions
      ?.filter((d, index, self) =>
        index === self.findIndex(
          (t) =>
            (t?.id || t?._id) === (d?.id || d?._id) &&
            (t?.name !== "" || t?.patient_full_name !== "")
        )
      )
      ?.map((d) => ({
        value: d?.id ? d?.id : d?._id,
        label: d?.name ? d?.name : d?.patient_full_name,
        disabled: embryologyDetails?.eggs_by?.includes(d?.id),
      }));
  }

  const eggsByDonorOptions = () => {

    const combinedOptionsArray = [...patientList, ...(embryologyData?.eggs_by_donor || []), ...(eggsByDonorBackupList || [])];

    const combinedOptions = isSearchPatient
      ? combinedOptionsArray
      : embryologyData?.eggs_by_donor;

    return combinedOptions
      ?.filter((d, index, self) =>
        index === self.findIndex(
          (t) =>
            (t?.id || t?._id) === (d?.id || d?._id) &&
            (t?.name !== "" || t?.patient_full_name !== "")
        )
      )
      ?.map((d) => ({
        value: d?.id ? d?.id : d?._id,
        label: d?.name ? d?.name : d?.patient_full_name,
        disabled: embryologyDetails?.eggs_by_donor?.includes(d?.id),
      }));
  }

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(isIvfListLoading ||
          IvfFlowsheetListLoding ||
          embryologyDataLoading) && (
            <Spin tip="Loading" size="large">
              <div className="content" />
            </Spin>
          )}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError
          autoComplete="off"
        >
          <div className="form_process_wrapper">
            <div className="form_info_wrapper filled">
              <div className="patient_detail_wrap">
                <ul>
                  {/* Pt. ID no. */}
                  <li>
                    <label>Patient ID :</label>
                    <span>
                      {selectedPatient?.patient_id
                        ? selectedPatient?.patient_id
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Patient Name :</label>
                    <span>
                      {selectedPatient?.patient_full_name
                        ? selectedPatient?.patient_full_name
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Age :</label>
                    <span>
                      {selectedPatient?.patient_dob
                        ? ageCalculate(selectedPatient?.patient_dob)
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Partner Name :</label>
                    <span>
                      {selectedPatient?.partner_full_name
                        ? selectedPatient?.partner_full_name
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Age :</label>
                    <span>
                      {selectedPatient?.partner_dob
                        ? ageCalculate(selectedPatient?.partner_dob)
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Married Since :</label>
                    <span>
                      {selectedPatient?.married_since
                        ? selectedPatient?.married_since
                        : ""}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_50">
                  <Form.Item label="Eggs" name="eggs" className="custom_select">
                    <Select
                      showSearch
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      placeholder="Select"
                      name="eggs"
                      value={embryologyDetails?.eggs}
                      onChange={(value) => {
                        handleClearSearch();
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          eggs: value || null,
                        });
                        handleEggsChange(value, "eggs");
                      }}
                      options={eggsOptions}
                    />
                  </Form.Item>
                </li>
                {isOpenBy.includes(embryologyDetails?.eggs) && (
                  <li className="w_270 w_xs_50">
                    {/* <div className="search_top"> */}
                    <div className="">
                      <Form.Item
                        label="Eggs By"
                        name="eggs_by"
                        // className="custom_select search_with_select"
                        className="custom_select search_with_select select_with_hover"
                      >
                        <Select
                          showSearch
                          allowClear={false}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              ?.toLowerCase()
                              ?.indexOf(input?.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              ?.toLowerCase()
                              ?.localeCompare(optionB?.label?.toLowerCase())
                          }
                          name="eggs_by"
                          value={embryologyDetails?.eggs_by}
                          placeholder="Search here"
                          mode="multiple"
                          maxTagCount="responsive"
                          onSearch={(e) => {
                            Object.keys(selectedPatient)?.length > 0 &&
                              globalSearchTextChange(e, selectedLocation);
                            setTimeout(() => {
                              setIsSearchPatient(true);
                            }, 1000);
                          }}
                          onChange={(e) => handleChange(e, "eggs_by")}
                          options={eggsByOptions()}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                      </Form.Item>
                    </div>
                  </li>
                )}
                {isOpenBy.includes(embryologyDetails?.eggs) &&
                  embryologyDetails?.cycle_type?.includes("OD") && (
                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Eggs By IVF ID "
                        name="eggs_by_ivf_id"
                        className="custom_select"
                      >
                        <Select
                          showSearch
                          allowClear={false}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              .toLowerCase()
                              .localeCompare(optionB.label.toLowerCase())
                          }
                          placeholder="Select"
                          name="eggs_by_ivf_id"
                          options={donateByIVFData?.ivf_flow_data?.map((d) => ({
                            value: d?._id,
                            label: d?.ivf_id,
                            disabled: d?.disable || false,
                          }))}
                          mode="multiple"
                          maxTagCount="responsive"
                          value={embryologyDetails?.eggs_by_ivf_id}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                          onChange={(e) => {
                            handleEggIvfSelect(e || null, donateByIVFData?._id);
                          }}
                        />
                      </Form.Item>
                    </li>
                  )}
                {IvfFlowsheetList?.planned_cycle?.includes(
                  "Professional Donor"
                ) && (
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Eggs To"
                        name="eggs_to"
                        className={
                          embryologyDetails?.eggs_to
                            ? "custom_select select_with_hover"
                            : "custom_select"
                        }
                      >
                        <Select
                          showSearch
                          allowClear={true}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              ?.toLowerCase()
                              ?.indexOf(input?.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              ?.toLowerCase()
                              ?.localeCompare(optionB?.label?.toLowerCase())
                          }
                          name="eggs_to"
                          mode="multiple"
                          maxTagCount="responsive"
                          value={embryologyDetails?.eggs_to}
                          placeholder="Search here"
                          onSearch={(e) => {
                            Object.keys(selectedPatient)?.length > 0 &&
                              globalSearchTextChange(e, selectedLocation);
                          }}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              eggs_to: value || null,
                            });
                          }}
                          options={(patientList || []).map((d) => ({
                            value: d?._id,
                            label: d?.patient_full_name,
                          }))}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                        {Object.keys(pDetail).length > 0 && (
                          <Button
                            className="clearIcon btn_transparent"
                            onClick={handleClearSearch}
                          >
                            <CloseOutlined />
                          </Button>
                        )}
                      </Form.Item>
                    </li>
                  )}

                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Planned Cycle"
                  // name="plan_cycle"
                  >
                    <Input
                      placeholder="Enter Planned Cycle"
                      // name="plan_cycle"
                      value={
                        IvfFlowsheetList?.planned_cycle
                          ? IvfFlowsheetList?.planned_cycle.join()
                          : ""
                      }
                      // onChange={(e) => {
                      //   setEmbryologyDetails({
                      //     ...embryologyDetails,
                      //     opu_done_by_other: e.target.value || null,
                      //   });
                      // }}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Protocol"
                  // name="protocol"
                  >
                    <Input
                      placeholder="Enter Protocol"
                      // name="protocol"
                      value={IvfFlowsheetList?.protocol || null}
                      // onChange={(e) => {
                      //   setEmbryologyDetails({
                      //     ...embryologyDetails,
                      //     opu_done_by_other: e.target.value || null,
                      //   });
                      // }}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="IVF ID"
                    name="ivf_flow_id"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      placeholder="Select"
                      name="ivf_flow_id"
                      options={ivfIdOption}
                      value={embryologyDetails?.ivf_flow_id}
                      onChange={(e) => {
                        handleIvfId(e || null);
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            {IvfFlowsheetList?.planned_cycle?.includes("Fresh") &&
              IvfFlowsheetList?.planned_cycle?.includes("OD") && (
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Patient Details (Donor)</h3>
                  <ul className="grid_wrapper">
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Eggs"
                        name="eggs_donor"
                        className="custom_select"
                      >
                        <Select
                          showSearch
                          allowClear={true}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              .toLowerCase()
                              .localeCompare(optionB.label.toLowerCase())
                          }
                          placeholder="Select"
                          name="eggs_donor"
                          value={embryologyDetails?.eggs_donor}
                          onChange={(value) => {
                            handleClearSearchDonor();
                            handleEggsChange(value, "eggs_donor");

                            // setEmbryologyDetails({
                            //   ...embryologyDetails,
                            //   eggs_donor: value || null,
                            // });
                          }}
                          options={eggsOptions}
                        />
                      </Form.Item>
                    </li>
                    {isOpenBy.includes(embryologyDetails?.eggs_donor) && (
                      <li className="w_270 w_xs_50">
                        {/* <div className="search_top"> */}
                        <div className="">
                          <Form.Item
                            label="Eggs By"
                            name="eggs_by_donor"
                            className="custom_select select_with_hover"
                          >
                            <Select
                              showSearch
                              allowClear={true}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0
                              }
                              filterSort={(optionA, optionB) =>
                                optionA.label
                                  ?.toLowerCase()
                                  ?.localeCompare(optionB?.label?.toLowerCase())
                              }
                              name="eggs_by_donor"
                              value={eggByDetail?.patient_full_name}
                              placeholder="Search here"
                              mode="multiple"
                              maxTagCount="responsive"
                              // defaultActiveFirstOption={false}
                              // suffixIcon={null}
                              onSearch={(e) => {
                                Object.keys(selectedPatient)?.length > 0 &&
                                  globalSearchTextChange(e, selectedLocation);
                                setTimeout(() => {
                                  setIsSearchPatient(true);
                                }, 1000);
                              }}
                              onChange={(e) => {
                                handleDonorChange(e, "eggs_by_donor");
                              }}
                              // notFoundContent={null}
                              options={eggsByDonorOptions()}
                              // options={(patientList || []).map((d) => ({
                              //   value: d?._id,
                              //   label: d?.patient_full_name,
                              // }))}
                              maxTagPlaceholder={(omittedValues) => (
                                <Tooltip
                                  title={omittedValues
                                    .map(({ label }) => label)
                                    .join(", ")}
                                >
                                  <span>Hover Me</span>
                                </Tooltip>
                              )}
                            />
                            {/* {Object.keys(pDetail).length > 0 && (
                            <Button
                              className="clearIcon btn_transparent"
                              onClick={handleClearSearch}
                            >
                              <CloseOutlined />
                            </Button>
                          )} */}
                          </Form.Item>
                        </div>
                      </li>
                    )}
                    {isOpenBy.includes(embryologyDetails?.eggs_donor) &&
                      embryologyDetails?.cycle_type?.includes("OD") && (
                        <li className="w_270 w_xs_100">
                          <Form.Item
                            label="Eggs By IVF ID "
                            name="eggs_by_ivf_id_donor"
                            className="custom_select"
                          >
                            <Select
                              showSearch
                              allowClear={false}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              filterSort={(optionA, optionB) =>
                                optionA.label
                                  .toLowerCase()
                                  .localeCompare(optionB.label.toLowerCase())
                              }
                              placeholder="Select"
                              name="eggs_by_ivf_id_donor"
                              options={donateByIVFDataDonor?.ivf_flow_data?.map(
                                (d) => ({
                                  value: d?._id,
                                  label: d?.ivf_id,
                                  disabled: d?.disable || false,
                                })
                              )}
                              mode="multiple"
                              maxTagCount="responsive"
                              value={embryologyDetails?.eggs_by_ivf_id_donor}
                              maxTagPlaceholder={(omittedValues) => (
                                <Tooltip
                                  title={omittedValues
                                    .map(({ label }) => label)
                                    .join(", ")}
                                >
                                  <span>Hover Me</span>
                                </Tooltip>
                              )}
                              onChange={(e) => {
                                handleEggIvfSelectDonor(
                                  e || null,
                                  donateByIVFDataDonor?._id
                                );
                              }}
                            />
                          </Form.Item>
                        </li>
                      )}
                    {IvfFlowsheetList?.planned_cycle?.includes(
                      "Professional Donor"
                    ) && (
                        <li className="w_270 w_xs_50">
                          <Form.Item
                            label="Eggs To"
                            name="eggs_to_donor"
                            className={
                              embryologyDetails?.eggs_to_donor
                                ? "custom_select select_with_hover"
                                : "custom_select"
                            }
                          >
                            <Select
                              showSearch
                              allowClear={true}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0
                              }
                              filterSort={(optionA, optionB) =>
                                optionA.label
                                  ?.toLowerCase()
                                  ?.localeCompare(optionB?.label?.toLowerCase())
                              }
                              name="eggs_to_donor"
                              mode="multiple"
                              maxTagCount="responsive"
                              value={embryologyDetails?.eggs_to_donor}
                              placeholder="Search here"
                              onSearch={(e) => {
                                Object.keys(selectedPatient)?.length > 0 &&
                                  globalSearchTextChange(e, selectedLocation);
                              }}
                              onChange={(value) => {
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  eggs_to_donor: value || null,
                                });
                              }}
                              options={(patientList || []).map((d) => ({
                                value: d?._id,
                                label: d?.patient_full_name,
                              }))}
                              maxTagPlaceholder={(omittedValues) => (
                                <Tooltip
                                  title={omittedValues
                                    .map(({ label }) => label)
                                    .join(", ")}
                                >
                                  <span>Hover Me</span>
                                </Tooltip>
                              )}
                            />
                            {Object.keys(pDetail).length > 0 && (
                              <Button
                                className="clearIcon btn_transparent"
                                onClick={handleClearSearchDonor}
                              >
                                <CloseOutlined />
                              </Button>
                            )}
                          </Form.Item>
                        </li>
                      )}
                  </ul>
                </div>
              )}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Partner Details</h3>
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Sperms"
                    name="sperms"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("sperms")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      placeholder="Select"
                      name="sperms"
                      value={embryologyDetails?.sperms}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms: value || null,
                        });
                      }}
                      options={spermsOptions}
                    />
                  </Form.Item>
                </li>
                {isOpenBy.includes(embryologyDetails?.sperms) ? (
                  <li className="w_270 w_xs_50">
                    <div className="search_top">
                      <Form.Item
                        label="Sperms By"
                        name="sperms_by"
                        className="custom_select search_with_select"
                      >
                        <Select
                          showSearch
                          allowClear={true}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              ?.toLowerCase()
                              ?.indexOf(input?.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              ?.toLowerCase()
                              ?.localeCompare(optionB?.label?.toLowerCase())
                          }
                          name="sperms_by"
                          value={embryologyDetails?.sperms_by}
                          placeholder="Search here"
                          defaultActiveFirstOption={false}
                          suffixIcon={null}
                          onSearch={(e) => {
                            if (Object.keys(selectedPatient)?.length > 0) {
                              globalSearchTextChange(e, selectedLocation);
                              setSearchTrigger("sperms_by");
                            }
                          }}
                          onChange={(e) => handleChange(e, "sperms_by")}
                          // onChange={(e) => setSperms_byByDetail(e)}
                          notFoundContent={null}
                          options={(spermBySearch || []).map((d) => ({
                            value: d?._id,
                            label: d?.patient_full_name,
                          }))}
                        // options={(patientList || []).map((d) => ({
                        //   value: d?._id,
                        //   label: d?.patient_full_name,
                        // }))}
                        />
                        {Object.keys(pDetail).length > 0 && (
                          <Button
                            className="clearIcon btn_transparent"
                            onClick={handleClearSearch}
                          >
                            <CloseOutlined />
                          </Button>
                        )}
                      </Form.Item>
                    </div>
                  </li>
                ) : null}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Sperm quality"
                    name="sperms_quality"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      allowClear={true}
                      disabled={disabledField("sperms_quality")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="sperms_quality"
                      mode="multiple"
                      maxTagCount="responsive"
                      value={embryologyDetails?.sperms_quality}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms_quality: value || null,
                        });
                      }}
                      options={spermsQualityOptions}
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip
                          title={omittedValues
                            .map(({ label }) => label)
                            .join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.sperms_quality?.includes("Other") && (
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Sperms Quality Other"
                      name="sperms_quality_other"
                    >
                      <Input
                        placeholder="Sperms Quality Other"
                        name="sperms_quality_other"
                        value={embryologyDetails?.sperms_quality_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            sperms_quality_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Sperm prep. Method"
                    name="sperms_prep_method"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("sperms_prep_method")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="sperms_prep_method"
                      value={embryologyDetails?.sperms_prep_method}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          sperms_prep_method: value || null,
                        });
                      }}
                      options={spermsPrepMethodOptions}
                      mode="multiple"
                      maxTagCount="responsive"
                      maxTagPlaceholder={(omittedValues) => (
                        <Tooltip
                          title={omittedValues
                            .map(({ label }) => label)
                            .join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                    />
                  </Form.Item>
                </li>
                {["Other", "Swim down"].some((method) =>
                  embryologyDetails?.sperms_prep_method?.includes(method)
                ) && (
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="Sperms Prep Method Other"
                        name="sperms_prep_method_other"
                      >
                        <Input
                          placeholder="Sperms Prep Method Other"
                          name="sperms_prep_method_other"
                          value={embryologyDetails?.sperms_prep_method_other}
                          onChange={(e) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_prep_method_other: e.target.value || null,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  )}

                <li className="w_270 w_xs_100">
                  <Form.Item label="Frozen sperm vial ID" name="frozen_vial_id">
                    <Input
                      placeholder="ID"
                      disabled={disabledField("frozen_vial_id")}
                      name="frozen_vial_id"
                      value={embryologyDetails?.frozen_vial_id}
                      onChange={(e) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          frozen_vial_id: e.target.value || null,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            {IvfFlowsheetList?.planned_cycle?.includes("ICSI-DS") &&
              IvfFlowsheetList?.planned_cycle?.includes("TESA/PESA") && (
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Partner Details (Donor)</h3>
                  <ul className="grid_wrapper">
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Sperms"
                        name="sperms_donor"
                        className="custom_select"
                      >
                        <Select
                          showSearch
                          disabled={disabledField("sperms_donor")}
                          allowClear={true}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.label
                              .toLowerCase()
                              .localeCompare(optionB.label.toLowerCase())
                          }
                          placeholder="Select"
                          name="sperms_donor"
                          value={embryologyDetails?.sperms_donor}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_donor: value || null,
                            });
                          }}
                          options={spermsOptions}
                        />
                      </Form.Item>
                    </li>
                    {isOpenBy.includes(embryologyDetails?.sperms_donor) ? (
                      <li className="w_270 w_xs_50">
                        <div className="search_top">
                          <Form.Item
                            label="Sperms By"
                            name="sperms_by_donor"
                            className="custom_select search_with_select"
                          >
                            <Select
                              showSearch
                              allowClear={true}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.label
                                  ?.toLowerCase()
                                  ?.indexOf(input?.toLowerCase()) >= 0
                              }
                              filterSort={(optionA, optionB) =>
                                optionA.label
                                  ?.toLowerCase()
                                  ?.localeCompare(optionB?.label?.toLowerCase())
                              }
                              name="sperms_by_donor"
                              value={spermsByDetailDonor?.patient_full_name}
                              placeholder="Search here"
                              defaultActiveFirstOption={false}
                              suffixIcon={null}
                              onSearch={(e) => {
                                Object.keys(selectedPatient)?.length > 0 &&
                                  globalSearchTextChange(e, selectedLocation);
                              }}
                              onChange={(e) =>
                                handleDonorChange(e, "sperms_by_donor")
                              }
                              notFoundContent={null}
                              options={(patientList || []).map((d) => ({
                                value: d?._id,
                                label: d?.patient_full_name,
                              }))}
                            />
                            {Object.keys(pDetail).length > 0 && (
                              <Button
                                className="clearIcon btn_transparent"
                                onClick={handleClearSearchDonor}
                              >
                                <CloseOutlined />
                              </Button>
                            )}
                          </Form.Item>
                        </div>
                      </li>
                    ) : null}
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Sperm quality"
                        name="sperms_quality_donor"
                        className="custom_select"
                      >
                        <Select
                          showSearch
                          allowClear={true}
                          disabled={disabledField("sperms_quality_donor")}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          // filterSort={(optionA, optionB) =>
                          //   optionA.label
                          //     .toLowerCase()
                          //     .localeCompare(optionB.label.toLowerCase())
                          // }
                          placeholder="Select"
                          name="sperms_quality_donor"
                          mode="multiple"
                          maxTagCount="responsive"
                          value={embryologyDetails?.sperms_quality_donor}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_quality_donor: value || null,
                            });
                          }}
                          options={spermsQualityOptions}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                      </Form.Item>
                    </li>
                    {embryologyDetails?.sperms_quality_donor?.includes(
                      "Other"
                    ) && (
                        <li className="w_220 w_xs_100">
                          <Form.Item
                            label="Sperms Quality Other"
                            name="sperms_quality_other_donor"
                          >
                            <Input
                              placeholder="Sperms Quality Other"
                              name="sperms_quality_other_donor"
                              value={
                                embryologyDetails?.sperms_quality_other_donor
                              }
                              onChange={(e) => {
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  sperms_quality_other_donor:
                                    e.target.value || null,
                                });
                              }}
                            />
                          </Form.Item>
                        </li>
                      )}
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Sperm prep. Method"
                        name="sperms_prep_method_donor"
                        className="custom_select"
                      >
                        <Select
                          showSearch
                          disabled={disabledField("sperms_prep_method_donor")}
                          allowClear={true}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          // filterSort={(optionA, optionB) =>
                          //   optionA.label
                          //     .toLowerCase()
                          //     .localeCompare(optionB.label.toLowerCase())
                          // }
                          placeholder="Select"
                          name="sperms_prep_method_donor"
                          value={embryologyDetails?.sperms_prep_method_donor}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_prep_method_donor: value || null,
                            });
                          }}
                          options={spermsPrepMethodOptions}
                          mode="multiple"
                          maxTagCount="responsive"
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                      </Form.Item>
                    </li>
                    {["Other", "Swim down"].some((method) =>
                      embryologyDetails?.sperms_prep_method_donor?.includes(
                        method
                      )
                    ) && (
                        <li className="w_220 w_xs_100">
                          <Form.Item
                            label="Sperms Prep Method Other"
                            name="sperms_prep_method_other_donor"
                          >
                            <Input
                              placeholder="Sperms Prep Method Other"
                              name="sperms_prep_method_other_donor"
                              value={
                                embryologyDetails?.sperms_prep_method_other_donor
                              }
                              onChange={(e) => {
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  sperms_prep_method_other_donor:
                                    e.target.value || null,
                                });
                              }}
                            />
                          </Form.Item>
                        </li>
                      )}

                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Frozen sperm vial ID"
                        name="frozen_vial_id_donor"
                      >
                        <Input
                          placeholder="ID"
                          disabled={disabledField("frozen_vial_id_donor")}
                          name="frozen_vial_id_donor"
                          value={embryologyDetails?.frozen_vial_id_donor}
                          onChange={(e) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              frozen_vial_id_donor: e.target.value || null,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
              )}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Procedure Details</h3>
              {/* <Row>
                <Col xl={9}> */}
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Anesthesia Given by"
                    name="anesthesia_given_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("anesthesia_given_by")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="anesthesia_given_by"
                      value={embryologyDetails?.anesthesia_given_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          anesthesia_given_by: value || null,
                          anesthesia_given_by_other: "",
                        });
                        form.setFieldsValue({
                          anesthesia_given_by_other: "",
                        });
                      }}
                      options={anetheistNameOptions}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.anesthesia_given_by === "Other" && (
                  <li>
                    <Form.Item
                      label="Anesthesia given by Other"
                      name="anesthesia_given_by_other"
                    >
                      <Input
                        placeholder="Anesthesia given by Other"
                        name="anesthesia_given_by_other"
                        value={embryologyDetails?.anesthesia_given_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            anesthesia_given_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="OPU Done by"
                    name="opu_done_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("opu_done_by")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="opu_done_by"
                      value={embryologyDetails?.opu_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          opu_done_by: value || null,
                          opu_done_by_other:
                            embryologyDetails?.opu_done_by_other === "Other"
                              ? embryologyDetails?.opu_done_by_other
                              : null,
                        });
                        form.setFieldsValue({
                          opu_done_by_other:
                            embryologyDetails?.opu_done_by_other === "Other"
                              ? embryologyDetails?.opu_done_by_other
                              : null,
                        });
                      }}
                      options={
                        doctorList.length > 0
                          ? [...doctorList, { label: "Other", value: "Other" }]
                          : []
                      }
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.opu_done_by === "Other" && (
                  <li>
                    <Form.Item
                      label="OPU done by Other"
                      name="opu_done_by_other"
                    >
                      <Input
                        placeholder="OPU done by Other"
                        name="opu_done_by_other"
                        value={embryologyDetails?.opu_done_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            opu_done_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Tesa/Pesa Done by"
                    name="tesa_pesa_done_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      allowClear={true}
                      disabled={disabledField("tesa_pesa_done_by")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="Select"
                      name="tesa_pesa_done_by"
                      value={embryologyDetails?.tesa_pesa_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          tesa_pesa_done_by: value || null,
                          tesa_pesa_done_by_other:
                            value === "Other"
                              ? embryologyDetails.tesa_pesa_done_by_other
                              : null,
                        });
                        form.setFieldsValue({
                          tesa_pesa_done_by_other: value
                            ? embryologyDetails.tesa_pesa_done_by_other
                            : null,
                        });
                      }}
                      options={
                        doctorList.length > 0
                          ? [...doctorList, { label: "Other", value: "Other" }]
                          : []
                      }
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.tesa_pesa_done_by === "Other" && (
                  <li>
                    <Form.Item
                      label="Tesa/Pesa Done by Other"
                      name="tesa_pesa_done_by_other"
                    >
                      <Input
                        placeholder="Tesa/Pesa Done by Other"
                        name="tesa_pesa_done_by_other"
                        value={embryologyDetails?.tesa_pesa_done_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            tesa_pesa_done_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Denudation Done by"
                    name="denudation_done_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      allowClear={true}
                      disabled={disabledField("denudation_done_by")}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="Select"
                      name="denudation_done_by"
                      value={embryologyDetails?.denudation_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          denudation_done_by: value || null,
                          denudation_done_by_other: "",
                        });
                        form.setFieldsValue({
                          denudation_done_by_other: "",
                        });
                      }}
                      options={denudationDoneByOptions}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.denudation_done_by === "Other" && (
                  <li>
                    <Form.Item
                      label="Denudation Done by Other"
                      name="denudation_done_by_other"
                    >
                      <Input
                        placeholder="Denudation Done by Other"
                        name="denudation_done_by_other"
                        value={embryologyDetails?.denudation_done_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            denudation_done_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="ICSI Done by"
                    name="icsi_ivf_done_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("icsi_ivf_done_by")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="icsi_ivf_done_by"
                      value={embryologyDetails?.icsi_ivf_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          icsi_ivf_done_by: value || null,
                          icsi_ivf_done_by_other:
                            value === "Other"
                              ? embryologyDetails.icsi_ivf_done_by_other
                              : null,
                        });
                        form.setFieldsValue({
                          icsi_ivf_done_by_other: value
                            ? embryologyDetails.icsi_ivf_done_by_other
                            : null,
                        });
                      }}
                      options={
                        doctorList.length > 0
                          ? [...doctorList, { label: "Other", value: "Other" }]
                          : []
                      }
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.icsi_ivf_done_by === "Other" && (
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="ICSI Done by Other"
                      name="icsi_ivf_done_by_other"
                    >
                      <Input
                        placeholder="ICSI Done by Other"
                        name="icsi_ivf_done_by_other"
                        value={embryologyDetails?.icsi_ivf_done_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            icsi_ivf_done_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Assisted by"
                    name="assisted_by"
                    className="custom_select"
                  >
                    <Select
                      showSearch
                      disabled={disabledField("assisted_by")}
                      allowClear={true}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="assisted_by"
                      value={embryologyDetails?.assisted_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          assisted_by: value || null,
                          assisted_by_other:
                            value === "Other"
                              ? embryologyDetails.assisted_by_other
                              : null,
                        });
                        form.setFieldsValue({
                          assisted_by_other: value
                            ? embryologyDetails.assisted_by_other
                            : null,
                        });
                      }}
                      options={
                        doctorList.length > 0
                          ? [...doctorList, { label: "Other", value: "Other" }]
                          : []
                      }
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.assisted_by === "Other" && (
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Assisted by Other"
                      name="assisted_by_other"
                    >
                      <Input
                        placeholder="Assisted by Other"
                        name="assisted_by_other"
                        value={embryologyDetails?.assisted_by_other}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            assisted_by_other: e.target.value || null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
              </ul>

              <div className="custom_table_Wrap custom_scroll_wrap pb-4">
                <div className="table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan="7">
                          <h4>EMBRYO DEVELOPMENT</h4>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="9">
                          <div className="embryo_development_wrap">
                            <ul className="grid_wrapper">
                              <li className="w_180">
                                <Form.Item label="LMP" name="lmp">
                                  <DatePicker
                                    placeholder="Select Date"
                                    name="lmp"
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    value={embryologyDetails?.lmp}
                                    // disabled={disabledField("lmp")}
                                    disabled
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="OPU Date" name="opu_date">
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="opu_date"
                                    value={
                                      embryologyDetails?.opu_date
                                        ? dayjs(
                                          embryologyDetails?.opu_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    onChange={handlechangePickupDate}
                                    // disabled={disabledField("opu_date")}
                                    disabled
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item label="OPU Time" name="opu_time">
                                  <TimePicker
                                    name="opu_time"
                                    format="h:mm a"
                                    value={embryologyDetails?.opu_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        opu_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                    // disabled={disabledField("opu_time")}
                                    disabled
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Actual OPU Time"
                                  name="actual_opu_time"
                                >
                                  <TimePicker
                                    name="actual_opu_time"
                                    format="h:mm a"
                                    value={embryologyDetails?.actual_opu_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        actual_opu_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                    disabled={disabledField("actual_opu_time")}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Denudation time"
                                  name="denudation_time"
                                >
                                  <TimePicker
                                    format="h:mm a"
                                    name="denudation_time"
                                    value={embryologyDetails?.denudation_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        denudation_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                    disabled={disabledField("denudation_time")}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="ICSI/IVF TIME"
                                  name="icsi_ivf_time"
                                >
                                  <TimePicker
                                    format="h:mm a"
                                    name="icsi_ivf_time"
                                    value={embryologyDetails?.icsi_ivf_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        icsi_ivf_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                    disabled={disabledField("icsi_ivf_time")}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="LH" name="lh">
                                  <Input
                                    placeholder="Enter LH"
                                    name="lh"
                                    value={embryologyDetails?.lh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        lh: e.target.value,
                                      });
                                    }}
                                    disabled={disabledField("lh")}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="E2" name="e2">
                                  <Input
                                    placeholder="Enter E2"
                                    name="e2"
                                    value={embryologyDetails?.e2}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        e2: e.target.value,
                                      });
                                    }}
                                    disabled={disabledField("e2")}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="9">
                          <div className="embryo_development_wrap">
                            <ul className="grid_wrapper">
                              <li className="w_250">
                                <Form.Item
                                  label="Incubator"
                                  name="embryo_dev_incubator"
                                  className="custom_select"
                                >
                                  <Select
                                    showSearch
                                    disabled={disabledField(
                                      "embryo_dev_incubator"
                                    )}
                                    allowClear={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    placeholder="Select"
                                    name="embryo_dev_incubator"
                                    value={
                                      embryologyDetails?.embryo_dev_incubator
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_incubator: value
                                          ? value
                                          : null,
                                        embryo_dev_incubator_other: null,
                                      });
                                      form.setFieldsValue({
                                        embryo_dev_incubator_other: null,
                                      });
                                    }}
                                    options={incubatorOptions}
                                  />
                                </Form.Item>
                              </li>
                              {embryologyDetails?.embryo_dev_incubator ===
                                "Other" && (
                                  <li className="w_220 w_xs_100">
                                    <Form.Item
                                      label="Incubator Other"
                                      name="embryo_dev_incubator_other"
                                    >
                                      <Input
                                        placeholder="Incubator Other"
                                        name="embryo_dev_incubator_other"
                                        value={
                                          embryologyDetails?.embryo_dev_incubator_other
                                        }
                                        onChange={(e) => {
                                          setEmbryologyDetails({
                                            ...embryologyDetails,
                                            embryo_dev_incubator_other:
                                              e.target.value || null,
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                  </li>
                                )}
                              <li className="w_250">
                                <Form.Item
                                  label="Culture Media"
                                  name="embryo_dev_culture_media"
                                  className="custom_select"
                                >
                                  <Select
                                    showSearch
                                    disabled={disabledField(
                                      "embryo_dev_culture_media"
                                    )}
                                    allowClear={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    placeholder="Select"
                                    name="embryo_dev_culture_media"
                                    value={
                                      embryologyDetails?.embryo_dev_culture_media
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_culture_media: value
                                          ? value
                                          : null,
                                        embryo_dev_culture_media_other: null,
                                      });
                                      form.setFieldsValue({
                                        embryo_dev_culture_media_other: null,
                                      });
                                    }}
                                    options={embryoDevCultureMediaOptions}
                                  />
                                </Form.Item>
                              </li>
                              {embryologyDetails?.embryo_dev_culture_media ===
                                "Other" && (
                                  <li className="w_220 w_xs_100">
                                    <Form.Item
                                      label="Culture Media Other"
                                      name="embryo_dev_culture_media_other"
                                    >
                                      <Input
                                        placeholder="Culture Media Other"
                                        name="embryo_dev_culture_media_other"
                                        value={
                                          embryologyDetails?.embryo_dev_culture_media_other
                                        }
                                        onChange={(e) => {
                                          setEmbryologyDetails({
                                            ...embryologyDetails,
                                            embryo_dev_culture_media_other:
                                              e.target.value || null,
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                  </li>
                                )}
                              <li className="w_250">
                                <Form.Item
                                  label="Batch No. & Expiry Date"
                                  name="embryo_dev_batch_no_exp_date"
                                >
                                  <Input
                                    placeholder="Batch No. & Expiry Date"
                                    name="embryo_dev_batch_no_exp_date"
                                    value={
                                      embryologyDetails?.embryo_dev_batch_no_exp_date
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_batch_no_exp_date:
                                          e.target.value || null,
                                      });
                                    }}
                                    disabled={disabledField(
                                      "embryo_dev_batch_no_exp_date"
                                    )}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_250">
                                <Form.Item
                                  label="PGT ?"
                                  name="embryo_dev_pgt"
                                  className="custom_select"
                                >
                                  <Select
                                    showSearch
                                    disabled={disabledField("embryo_dev_pgt")}
                                    allowClear={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    placeholder="Select"
                                    name="embryo_dev_pgt"
                                    value={embryologyDetails?.embryo_dev_pgt}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_pgt: value ? value : null,
                                      });
                                    }}
                                    options={embryoDevPgtOptions}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_300">
                                <Form.Item
                                  label="ICSI-ADD ON"
                                  name="add_on"
                                  className="custom_select"
                                >
                                  <Select
                                    showSearch
                                    disabled={disabledField("add_on")}
                                    allowClear={true}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                    // filterSort={(optionA, optionB) =>
                                    //   optionA.label
                                    //     .toLowerCase()
                                    //     .localeCompare(optionB.label.toLowerCase())
                                    // }
                                    placeholder="Select"
                                    name="add_on"
                                    mode="multiple"
                                    maxTagCount="responsive"
                                    value={embryologyDetails?.add_on}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        add_on: value || null,
                                        add_on_other:
                                          value === "Other"
                                            ? embryologyDetails.add_on_other
                                            : null,
                                      });
                                      form.setFieldsValue({
                                        add_on_other: value
                                          ? embryologyDetails.add_on_other
                                          : null,
                                      });
                                    }}
                                    options={icsiAddOnOptions}
                                    maxTagPlaceholder={(omittedValues) => (
                                      <Tooltip
                                        title={omittedValues
                                          .map(({ label }) => label)
                                          .join(", ")}
                                      >
                                        <span>Hover Me</span>
                                      </Tooltip>
                                    )}
                                  />
                                </Form.Item>
                              </li>

                              <li className="w_170">
                                <Form.Item label="Prog" name="progesterone">
                                  <Input
                                    disabled={disabledField("progesterone")}
                                    placeholder="Enter Progesterone"
                                    name="progesterone"
                                    value={embryologyDetails?.progesterone}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        progesterone: e.target.value || null,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="AMH" name="amh">
                                  <Input
                                    placeholder="Enter AMH"
                                    name="amh"
                                    value={embryologyDetails?.amh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        amh: e.target.value || null,
                                      });
                                    }}
                                    disabled={disabledField("amh")}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr className="respnsive_table_width">
                        <td>
                          <h4>Day 0</h4>
                          <ul className="grid_wrapper">
                            <li className="w_200">
                              <Form.Item label="D0 Date" name="day_0_date">
                                <DatePicker
                                  placeholder="DD/MM/YYYY"
                                  name="day_0_date"
                                  disabled={
                                    embryologyDetails?.cycle_type?.includes(
                                      "OD"
                                    )
                                      ? false
                                      : true
                                  }
                                  value={
                                    embryologyDetails?.day_0_date
                                      ? dayjs(
                                        embryologyDetails?.day_0_date,
                                        "DD/MM/YYYY"
                                      )
                                      : null
                                  }
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  onChange={handleChangeFirstDayDate}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Time" name="day_0_time">
                                <TimePicker
                                  format="h:mm a"
                                  disabled={disabledField("day_0_time")}
                                  name="day_0_time"
                                  value={embryologyDetails?.day_0_time}
                                  onChange={(value) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_0_time: value
                                        ? dayjs(value).format("HH:mm:ss")
                                        : null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_220">
                              <Form.Item
                                label="Hrs. post ICSI"
                                name="day_0_hrs_post_icsi"
                              >
                                <Input
                                  placeholder="Enter ICSI"
                                  disabled={disabledField(
                                    "day_0_hrs_post_icsi"
                                  )}
                                  name="day_0_hrs_post_icsi"
                                  value={embryologyDetails?.day_0_hrs_post_icsi}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_0_hrs_post_icsi: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <h4>Day 1</h4>
                          <li className="w_200">
                            <Form.Item label="D1 Date" name="day_1_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_1_date"
                                disabled={true}
                                value={
                                  embryologyDetails?.day_1_date
                                    ? dayjs(
                                      embryologyDetails?.day_1_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_1_date: e
                                      ? moment(new Date(e)).format("YYYY-MM-DD")
                                      : null,
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td>
                          <h4>Day 3/5/6/7</h4>
                          <ul className="grid_wrapper">
                            <li className="w_180">
                              <Form.Item label="D3 Date" name="day_3_date">
                                <DatePicker
                                  disabled={true}
                                  placeholder="9/11/1997"
                                  name="day_3_date"
                                  value={
                                    embryologyDetails?.day_3_date
                                      ? dayjs(
                                        embryologyDetails?.day_3_date,
                                        "DD/MM/YYYY"
                                      )
                                      : null
                                  }
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_3_date: e
                                        ? moment(new Date(e)).format(
                                          "YYYY-MM-DD"
                                        )
                                        : null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="D5 Date" name="day_5_date">
                                <DatePicker
                                  disabled={true}
                                  placeholder="9/11/1997"
                                  name="day_5_date"
                                  value={
                                    embryologyDetails?.day_5_date
                                      ? dayjs(
                                        embryologyDetails?.day_5_date,
                                        "DD/MM/YYYY"
                                      )
                                      : null
                                  }
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_5_date: e
                                        ? moment(new Date(e)).format(
                                          "YYYY-MM-DD"
                                        )
                                        : null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="D6 Date" name="day_6_date">
                                <DatePicker
                                  disabled={true}
                                  placeholder="9/11/1997"
                                  name="day_6_date"
                                  value={
                                    embryologyDetails?.day_6_date
                                      ? dayjs(
                                        embryologyDetails?.day_6_date,
                                        "DD/MM/YYYY"
                                      )
                                      : null
                                  }
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_6_date: e
                                        ? moment(new Date(e)).format(
                                          "YYYY-MM-DD"
                                        )
                                        : null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="D7 Date" name="day_7_date">
                                <DatePicker
                                  disabled={true}
                                  placeholder="9/11/1997"
                                  name="day_7_date"
                                  value={
                                    embryologyDetails?.day_7_date
                                      ? dayjs(
                                        embryologyDetails?.day_7_date,
                                        "DD/MM/YYYY"
                                      )
                                      : null
                                  }
                                  format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                  }}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      day_7_date: e
                                        ? moment(new Date(e)).format(
                                          "YYYY-MM-DD"
                                        )
                                        : null,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <h4>Vitrification Details</h4>
                          <ul className="grid_wrapper">
                            <li className="w_150">
                              <Form.Item
                                label="Freezing Media"
                                name="freezing_media"
                                className="custom_select"
                              >
                                <Select
                                  showSearch
                                  disabled={disabledField("freezing_media")}
                                  allowClear={true}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  placeholder="Select"
                                  name="freezing_media"
                                  value={embryologyDetails?.freezing_media}
                                  onChange={(value) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      freezing_media: value ? value : null,
                                      freezing_media_other: null,
                                    });
                                    form.setFieldsValue({
                                      freezing_media_other: null,
                                    });
                                  }}
                                  options={freezingMediaOptions}
                                />
                              </Form.Item>
                            </li>
                            {embryologyDetails?.freezing_media === "Other" && (
                              <li>
                                <Form.Item
                                  label="Freezing Media Other"
                                  name="freezing_media_other"
                                >
                                  <Input
                                    placeholder="Enter Freezing Media Other"
                                    name="freezing_media_other"
                                    value={
                                      embryologyDetails?.freezing_media_other
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        freezing_media_other: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            )}
                            <li className="w_180">
                              <Form.Item
                                label="Batch no. & Expiry Date"
                                name="vitrification_batch_no_exp_date"
                              >
                                <Input
                                  placeholder="Batch no. & Expiry Date"
                                  name="vitrification_batch_no_exp_date"
                                  disabled={disabledField(
                                    "vitrification_batch_no_exp_date"
                                  )}
                                  value={
                                    embryologyDetails?.vitrification_batch_no_exp_date
                                  }
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      vitrification_batch_no_exp_date:
                                        e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_170">
                              <Form.Item
                                label="Vitrification Devices"
                                name="vitrification_devices"
                                className="custom_select"
                              >
                                <Select
                                  showSearch
                                  disabled={disabledField(
                                    "vitrification_devices"
                                  )}
                                  allowClear={true}
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  placeholder="Select"
                                  name="vitrification_devices"
                                  value={
                                    embryologyDetails?.vitrification_devices
                                  }
                                  onChange={(value) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      vitrification_devices: value
                                        ? value
                                        : null,
                                      vitrification_devices_other: null,
                                    });
                                    form.setFieldsValue({
                                      vitrification_devices_other: null,
                                    });
                                  }}
                                  options={vitrificationDevicesOptions}
                                />
                              </Form.Item>
                            </li>
                            {embryologyDetails?.vitrification_devices ===
                              "Other" && (
                                <li>
                                  <Form.Item
                                    label="Vitrification Device Other"
                                    name="vitrification_devices_other"
                                  >
                                    <Input
                                      placeholder="Vitrification Device Other"
                                      name="vitrification_devices_other"
                                      value={
                                        embryologyDetails?.vitrification_devices_other
                                      }
                                      onChange={(e) => {
                                        setEmbryologyDetails({
                                          ...embryologyDetails,
                                          vitrification_devices_other:
                                            e.target.value,
                                        });
                                      }}
                                    />
                                  </Form.Item>
                                </li>
                              )}
                            <li className="w_180">
                              <Form.Item
                                label="Total No. Of Goblet"
                                name="total_goblet"
                              >
                                <Input
                                  placeholder="Total No. Of Goblet"
                                  disabled={disabledField("total_goblet")}
                                  name="total_goblet"
                                  value={embryologyDetails?.total_goblet}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      total_goblet: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_150">
                              <Form.Item
                                label="Total No. Of Straw"
                                name="total_straw"
                              >
                                <Input
                                  disabled={true}
                                  placeholder="Total No. Of Straw"
                                  name="total_straw"
                                  value={embryologyDetails?.total_straw}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      total_straw: e.target.value || 0,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_150">
                              <Form.Item label="Tank No." name="tank_no">
                                <Input
                                  placeholder="Tank No."
                                  disabled={disabledField("tank_no")}
                                  name="tank_no"
                                  value={embryologyDetails?.tank_no}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      tank_no: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_150">
                              <Form.Item
                                label="Cannister No."
                                name="cannister_no"
                              >
                                <Input
                                  placeholder="Cannister No."
                                  name="cannister_no"
                                  value={embryologyDetails?.cannister_no}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      cannister_no: e.target.value,
                                    });
                                  }}
                                  disabled={disabledField("cannister_no")}
                                />
                              </Form.Item>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="w_90"></td>
                        <td className="w_90"></td>
                        {/* <td className="w_250">> */}
                        <td className="w_170"></td>
                        <td className="w_120"></td>
                        <td className="w_170"></td>
                        {/* <td className="w_180">> */}
                        <td className="w_150"></td>
                        {/* <td className="w_90">> */}
                        {/* <td className="w_90">> */}
                        {/* <td className="w_150">> */}
                        {/* <td className="w_90">> */}
                        {/* <td className="w_90">> */}
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_120"></td>
                        <td className="w_120"></td>
                        <td className="w_120"></td>
                        {/* <th className="w_170">Date of Thawing</th>
                        <th className="w_170">Thawing done by</th>
                        <th className="w_170">Date of Transfer</th>
                        <th className="w_170">Action</th> */}
                      </tr>
                      <tr className="respnsive_table_width">
                        <td colSpan={16}></td>
                      </tr>
                    </tbody>
                  </table>
                  {embryology_count.map((embroData, i) => {
                    return (
                      <>
                        <div className="d-flex ">
                          <h2>{`IVF:  `}</h2>
                          <h2>{embroData?.patient_detail?.ivf?.ivf_id}</h2>
                        </div>
                        <table>
                          <tbody>
                            <tr>
                              <td colspan="12">
                                <ul className="grid_wrapper">
                                  <li className="w_180">
                                    <Form.Item
                                      label="Total No. Of Oocytes"
                                      name={`no_of_oocytes${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        disabled={disabledField(
                                          "no_of_oocytes"
                                        )}
                                        placeholder="Numeric"
                                        value={embroData.no_of_oocytes}
                                        onBlur={(e) => {
                                          handleEmbryoDataChange(
                                            +e.target.value,
                                            "no_of_oocytes",
                                            i
                                          );
                                        }}
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_90">
                                    <Form.Item
                                      label="M2"
                                      name={`total_m2${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Numeric"
                                        disabled={disabledField("total_m2")}
                                        value={embroData?.total_m2}
                                        onBlur={(e) =>
                                          handleEmbryoDataChange(
                                            +e.target.value,
                                            "total_m2",
                                            i
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </li>
                                  {embryologyDetails?.eggs === "Own Fresh" ? (
                                    <li className="w_90">
                                      <Form.Item
                                        label="Used M2"
                                        className="mb-0"
                                      >
                                        <Input
                                          placeholder="Used M2"
                                          disabled
                                          value={embroData?.total_m2_used}
                                        />
                                      </Form.Item>
                                    </li>
                                  ) : null}
                                  <li className="w_90">
                                    <Form.Item
                                      label="M1"
                                      name={`total_m1${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Numeric"
                                        disabled={disabledField("total_m1")}
                                        value={embroData?.total_m1}
                                        onBlur={(e) =>
                                          handleEmbryoDataChange(
                                            +e.target.value,
                                            "total_m1",
                                            i
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </li>

                                  {embryologyDetails?.eggs === "Own Fresh" ? (
                                    <li className="w_90">
                                      <Form.Item
                                        label="Used M1"
                                        className="mb-0"
                                      >
                                        <Input
                                          placeholder="Used M1"
                                          disabled
                                          value={embroData?.total_m1_used}
                                        />
                                      </Form.Item>
                                    </li>
                                  ) : null}
                                  <li className="w_90">
                                    <Form.Item
                                      label="GV"
                                      name={`gv${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        disabled
                                        value={embroData?.gv}
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_90">
                                    <Form.Item
                                      label="Atretic"
                                      name={`atretic${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        value={embroData?.atretic}
                                        onBlur={(e) =>
                                          handleEmbryoDataChange(
                                            +e.target.value,
                                            "atretic",
                                            i
                                          )
                                        }
                                        disabled={disabledField("atretic")}
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_90">
                                    <Form.Item
                                      label="Fert"
                                      name={`fert${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        name="fert"
                                        value={embroData?.fert}
                                        disabled
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_120">
                                    <Form.Item
                                      label="Cleaved"
                                      name={`cleaved${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        name="cleaved"
                                        value={embroData?.cleaved}
                                        disabled
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_120">
                                    <Form.Item
                                      label="Unfert"
                                      name={`unfert${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        name="unfert"
                                        value={embroData?.unfert}
                                        disabled
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_150">
                                    <Form.Item
                                      label="Degenerated"
                                      name={`degenerated${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        disabled
                                        placeholder="Condition"
                                        name="degenerated"
                                        value={embroData?.degenerated}
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_180">
                                    <Form.Item
                                      label="Kept for blastocyst"
                                      name={`kept_for_blastocyst${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        placeholder="Condition"
                                        disabled
                                        name="kept_for_blastocyst"
                                        value={embroData?.kept_for_blastocyst}
                                      />
                                    </Form.Item>
                                  </li>
                                  <li className="w_180">
                                    <Form.Item
                                      label="Total blastocyst"
                                      name={`total_blastocyst${i}`}
                                      className="mb-0"
                                    >
                                      <Input
                                        disabled
                                        placeholder="Condition"
                                        name="total_blastocyst"
                                        value={embroData?.total_blastocyst}
                                      />
                                    </Form.Item>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="inner_table_wrapper respnsive_table_width">
                          <table>
                            <thead>
                              <tr>
                                <div className="sticky_row">
                                  <th className="w_150">Oocytes</th>
                                  <th className="w_200">Maturation Stage</th>
                                </div>
                                <th className="w_250">Oocyte Quality</th>
                                <th className="w_200">Fert Check</th>
                                <th className="w_200">Stage of development</th>
                                <th className="w_170">Embryo Grade</th>
                                <th className="w_170">Blasto Score</th>
                                <th className="w_90">Rating</th>
                                {IvfFlowsheetList?.planned_cycle?.includes(
                                  "Fresh ET"
                                ) ? (
                                  <th className="w_170">ET Status</th>
                                ) : null}
                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.et_status === "Fresh ET"
                                ) ? (
                                  <th className="w_170">Provider</th>
                                ) : null}
                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.provider === "OTHER"
                                ) ? (
                                  <th className="w_170">Provider Other </th>
                                ) : null}
                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.et_status === "Fresh ET"
                                ) ? (
                                  <th className="w_170">Introducer</th>
                                ) : null}
                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.introducer === "OTHER"
                                ) ? (
                                  <th className="w_170">Introducer Other </th>
                                ) : null}
                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.et_status === "Fresh ET"
                                ) ? (
                                  <th className="w_170">Complication</th>
                                ) : null}

                                <th className="w_170">Date of freezing</th>

                                <th className="w_250">
                                  Vitrification ID
                                  {"(Straw ID)"}
                                </th>
                                <th className="w_190">Color of Straw</th>

                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.straw_color === "Other"
                                ) ? (
                                  <th className="w_200">
                                    Color of Straw Other
                                  </th>
                                ) : null}

                                <th className="w_170">Color of Goblet</th>

                                {embryology_count?.[i]?.embryo?.some(
                                  (item) => item.goblet_color === "Other"
                                ) ? (
                                  <th className="w_200">
                                    Color of Goblet Other
                                  </th>
                                ) : null}
                                <th className="w_150">Vitrified by</th>
                                {embryologyDetails?.embryo_dev_pgt !== "NO" ? (
                                  <th className="w_120">Status</th>
                                ) : null}
                                {embryologyDetails?.embryo_dev_incubator ===
                                  "TIME-LAPSE" ? (
                                  <th className="w_170">Well No.</th>
                                ) : null}
                                <th className="w_170">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {embroData.embryo?.map((item, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className={
                                      item.fert_check === "Abnormal PN"
                                        ? "red_row_wrapper"
                                        : ""
                                    }
                                  >
                                    <div className="sticky_row">
                                      <td>
                                        <div className="w_150">
                                          <Form.Item
                                            name={`oocytes${i}${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              placeholder="Oocytes"
                                              value={item.oocytes}
                                              disabled
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_200">
                                          <Form.Item
                                            name={`maturation_stage${i}${index}`}
                                            className="custom_select mb-1"
                                          >
                                            <Input
                                              placeholder="Maturation Stage"
                                              value={item?.maturation_stage}
                                              disabled
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                    </div>
                                    <td>
                                      <div className="w_200">
                                        <Form.Item
                                          name={`oocytes_quality${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            placeholder="Select"
                                            value={item?.oocytes_quality}
                                            mode="multiple"
                                            maxTagCount="responsive"
                                            maxTagPlaceholder={(
                                              QualityofEgg
                                            ) => (
                                              <Tooltip
                                                title={QualityofEgg.map(
                                                  ({ label }) => label
                                                ).join(", ")}
                                              >
                                                <span>Hover Me</span>
                                              </Tooltip>
                                            )}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "oocytes_quality"
                                              );
                                            }}
                                            options={oocytesQualityOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_200">
                                        <Form.Item
                                          name={`fert_check${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            showSearch
                                            disabled={disabledField(
                                              "fert_check"
                                            )}
                                            allowClear={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            placeholder="Select"
                                            value={item?.fert_check}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "fert_check"
                                              );
                                            }}
                                            options={fertCheckOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_220">
                                        <Form.Item
                                          name={`stage_of_development${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            showSearch
                                            disabled={
                                              disabledField(
                                                "stage_of_development"
                                              ) ||
                                              item?.fert_check === "Degenerated"
                                            }
                                            allowClear={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            placeholder="Select"
                                            value={item?.stage_of_development}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "stage_of_development"
                                              );
                                            }}
                                            options={stageOfDevOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_200">
                                        <Form.Item
                                          name={`embryo_grade${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            showSearch
                                            disabled={
                                              disabledField("embryo_grade") ||
                                              item?.fert_check === "Degenerated"
                                            }
                                            allowClear={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            placeholder="Select"
                                            value={item?.embryo_grade}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "embryo_grade"
                                              );
                                            }}
                                            options={embryoGradeOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_150">
                                        <Form.Item
                                          name={`blasto_score${i}${index}`}
                                          className="mb-1"
                                        >
                                          <Input
                                            placeholder="Blasto Score"
                                            disabled={
                                              disabledField("embryo_grade") ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                            value={item?.blasto_score}
                                            onChange={(e) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                e.target.value || "",
                                                "blasto_score"
                                              );
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_90">
                                        <Form.Item
                                          name={`rating${i}${index}`}
                                          className="mb-1"
                                        >
                                          <Input
                                            placeholder="Rating"
                                            value={item?.rating}
                                            disabled
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    {IvfFlowsheetList?.planned_cycle?.includes(
                                      "Fresh ET"
                                    ) ? (
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`et_status${i}${index}`}
                                            className="custom_select mb-1"
                                          >
                                            <Select
                                              disabled={
                                                disabledField("et_status") ||
                                                item?.blasto_score
                                                  ?.toLowerCase()
                                                  ?.trim() === "arrested" ||
                                                item?.fert_check ===
                                                "Degenerated" ||
                                                disableEmbryoGrade(
                                                  item?.embryo_grade
                                                )
                                              }
                                              showSearch
                                              allowClear={true}
                                              optionFilterProp="children"
                                              filterOption={(input, option) =>
                                                option.label
                                                  .toLowerCase()
                                                  .indexOf(
                                                    input.toLowerCase()
                                                  ) >= 0
                                              }
                                              placeholder="Select"
                                              value={item?.et_status}
                                              onChange={(value) => {
                                                handleOccyteTableChange(
                                                  index,
                                                  i,
                                                  value || null,
                                                  "et_status"
                                                );
                                              }}
                                              options={etStatusOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                    ) : null}
                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.et_status === "Fresh ET"
                                    ) ? (
                                      item?.et_status === "Fresh ET" ? (
                                        <td>
                                          <div className="w_170">
                                            <Form.Item
                                              name={`provider${i}${index}`}
                                              className="custom_select mb-1"
                                            >
                                              <Select
                                                disabled={
                                                  disabledField("provider") ||
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                showSearch
                                                allowClear={true}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                  option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                                placeholder="Select"
                                                value={item?.provider}
                                                onChange={(value) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    value || null,
                                                    "provider"
                                                  );
                                                }}
                                                options={etProvider}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_170"></div>
                                        </td>
                                      )
                                    ) : null}

                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.provider === "OTHER"
                                    ) ? (
                                      item.provider === "OTHER" ? (
                                        <td>
                                          <div className="w_170">
                                            <Form.Item
                                              name={`provider_other${i}${index}`}
                                              className="mb-1"
                                            >
                                              <Input
                                                disabled={
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                placeholder="Provider Other"
                                                value={item?.provider_other}
                                                onChange={(e) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    e.target.value || "",
                                                    "provider_other"
                                                  );
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_120"></div>
                                        </td>
                                      )
                                    ) : null}

                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.et_status === "Fresh ET"
                                    ) ? (
                                      item?.et_status === "Fresh ET" ? (
                                        <td>
                                          <div className="w_170">
                                            <Form.Item
                                              name={`introducer${i}${index}`}
                                              className="custom_select mb-1"
                                            >
                                              <Select
                                                disabled={
                                                  disabledField("introducer") ||
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                showSearch
                                                allowClear={true}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                  option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                                placeholder="Select"
                                                value={item?.introducer}
                                                onChange={(value) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    value || null,
                                                    "introducer"
                                                  );
                                                }}
                                                options={etProvider}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_170"></div>
                                        </td>
                                      )
                                    ) : null}

                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.introducer === "OTHER"
                                    ) ? (
                                      item.introducer === "OTHER" ? (
                                        <td>
                                          <div className="w_170">
                                            <Form.Item
                                              name={`introducer_other${i}${index}`}
                                              className="mb-1"
                                            >
                                              <Input
                                                disabled={
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                placeholder="Introducer Other"
                                                value={item?.introducer_other}
                                                onChange={(e) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    e.target.value || "",
                                                    "introducer_other"
                                                  );
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_120"></div>
                                        </td>
                                      )
                                    ) : null}
                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.et_status === "Fresh ET"
                                    ) ? (
                                      item?.et_status === "Fresh ET" ? (
                                        <td>
                                          <div className="w_170">
                                            <Form.Item
                                              name={`complication${i}${index}`}
                                              className="custom_select mb-1"
                                            >
                                              <Select
                                                disabled={
                                                  disabledField(
                                                    "complication"
                                                  ) ||
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                showSearch
                                                allowClear={true}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                  option.label
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                                placeholder="Select"
                                                value={item?.complication}
                                                onChange={(value) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    value || null,
                                                    "complication"
                                                  );
                                                }}
                                                options={complicationOptions}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_170"></div>
                                        </td>
                                      )
                                    ) : null}
                                    <td>
                                      <div className="w_170">
                                        <Form.Item
                                          name={`date_of_freezing${i}${index}`}
                                          className="mb-1"
                                        >
                                          <DatePicker
                                            placeholder="10/08/2023"
                                            value={dayjs(
                                              item?.date_of_freezing,
                                              "DD/MM/YYYY"
                                            )}
                                            disabled={
                                              disabledField(
                                                "date_of_freezing"
                                              ) ||
                                              item?.blasto_score
                                                ?.toLowerCase()
                                                ?.trim() === "arrested" ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                            format={{
                                              format: "DD-MM-YYYY",
                                              type: "mask",
                                            }}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value
                                                  ? moment(
                                                    new Date(value)
                                                  ).format("YYYY-MM-DD")
                                                  : null,
                                                "date_of_freezing"
                                              );
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="w_250">
                                        <Form.Item
                                          name={`vitrification_id${i}${index}`}
                                          className="mb-1"
                                        >
                                          <Input
                                            placeholder="Vitrification ID"
                                            value={item?.vitrification_id}
                                            disabled={
                                              disabledField(
                                                "vitrification_id"
                                              ) ||
                                              item?.blasto_score
                                                ?.toLowerCase()
                                                ?.trim() === "arrested" ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                            onChange={(e) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                e.target.value || "",
                                                "vitrification_id"
                                              );
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>

                                    <td>
                                      <div className="w_170">
                                        <Form.Item
                                          name={`straw_color${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            showSearch
                                            allowClear={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            placeholder="Select"
                                            disabled={
                                              disabledField("straw_color") ||
                                              item?.blasto_score
                                                ?.toLowerCase()
                                                ?.trim() === "arrested" ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              !item?.vitrification_id?.trim() ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                            className="color_select"
                                            value={item?.straw_color}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "straw_color"
                                              );
                                            }}
                                            options={strawColorOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>

                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.straw_color === "Other"
                                    ) ? (
                                      item?.straw_color === "Other" ? (
                                        <td>
                                          <div className="w_200">
                                            <Form.Item
                                              // name={`egg${i}${index}`}
                                              name={`straw_color_other${i}${index}`}
                                              className="mb-1"
                                            >
                                              <Input
                                                disabled={
                                                  disabledField(
                                                    "straw_color_other"
                                                  ) ||
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  !item?.vitrification_id?.trim() ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                placeholder="Device Color Other"
                                                // value={item?.package_amount}
                                                value={item?.straw_color_other}
                                                onChange={(e) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    e.target.value || "",
                                                    "straw_color_other"
                                                  );
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_170"></div>
                                        </td>
                                      )
                                    ) : null}

                                    <td>
                                      <div className="w_170">
                                        <Form.Item
                                          name={`goblet_color${i}${index}`}
                                          className="custom_select mb-1"
                                        >
                                          <Select
                                            showSearch
                                            allowClear={true}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              option.label
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                              0
                                            }
                                            disabled={
                                              disabledField("goblet_color") ||
                                              item?.blasto_score
                                                ?.toLowerCase()
                                                ?.trim() === "arrested" ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              !item?.vitrification_id?.trim() ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                            placeholder="Select"
                                            className="color_select"
                                            value={item?.goblet_color}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "goblet_color"
                                              );
                                            }}
                                            options={gobletColorOptions}
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    {embryology_count?.[i]?.embryo?.some(
                                      (item) => item.goblet_color === "Other"
                                    ) ? (
                                      item?.goblet_color === "Other" ? (
                                        <td>
                                          <div className="w_200">
                                            <Form.Item
                                              // name={`egg${i}${index}`}
                                              name={`goblet_color_other${i}${index}`}
                                              className="mb-1"
                                            >
                                              <Input
                                                disabled={
                                                  disabledField(
                                                    "goblet_color_other"
                                                  ) ||
                                                  item?.blasto_score
                                                    ?.toLowerCase()
                                                    ?.trim() === "arrested" ||
                                                  item?.fert_check ===
                                                  "Degenerated" ||
                                                  !item?.vitrification_id?.trim() ||
                                                  disableEmbryoGrade(
                                                    item?.embryo_grade
                                                  )
                                                }
                                                placeholder="Goblet Color Other"
                                                value={item?.goblet_color_other}
                                                onChange={(e) => {
                                                  handleOccyteTableChange(
                                                    index,
                                                    i,
                                                    e.target.value || "",
                                                    "goblet_color_other"
                                                  );
                                                }}
                                              />
                                            </Form.Item>
                                          </div>
                                        </td>
                                      ) : (
                                        <td>
                                          <div className="w_170"></div>
                                        </td>
                                      )
                                    ) : null}
                                    <td>
                                      <div className="w_170">
                                        <Form.Item
                                          name={`vitrified_by${i}${index}`}
                                          className="custom_select mb-1 custom_select_multiple"
                                        >
                                          <Select
                                            mode="tags"
                                            allowClear={true}
                                            placeholder="Select"
                                            value={item?.vitrified_by}
                                            onChange={(value) => {
                                              handleOccyteTableChange(
                                                index,
                                                i,
                                                value || null,
                                                "vitrified_by"
                                              );
                                            }}
                                            maxCount={1}
                                            options={vitrificationIdOptions}
                                            disabled={
                                              disabledField("vitrified_by") ||
                                              item?.blasto_score
                                                ?.toLowerCase()
                                                ?.trim() === "arrested" ||
                                              item?.fert_check ===
                                              "Degenerated" ||
                                              !item?.vitrification_id?.trim() ||
                                              disableEmbryoGrade(
                                                item?.embryo_grade
                                              )
                                            }
                                          />
                                        </Form.Item>
                                      </div>
                                    </td>
                                    {embryologyDetails?.embryo_dev_pgt !==
                                      "NO" ? (
                                      <td>
                                        <div className="w_120">
                                          <Form.Item
                                            name={`status${i}${index}`}
                                            className="custom_select mb-1"
                                          >
                                            <Select
                                              showSearch
                                              allowClear={true}
                                              optionFilterProp="children"
                                              filterOption={(input, option) =>
                                                option.label
                                                  .toLowerCase()
                                                  .indexOf(
                                                    input.toLowerCase()
                                                  ) >= 0
                                              }
                                              placeholder="Select"
                                              disabled={
                                                disabledField("status") ||
                                                item?.blasto_score
                                                  ?.toLowerCase()
                                                  ?.trim() === "arrested" ||
                                                item?.fert_check ===
                                                "Degenerated" ||
                                                !item?.vitrification_id?.trim() ||
                                                disableEmbryoGrade(
                                                  item?.embryo_grade
                                                )
                                              }
                                              value={item?.status}
                                              onChange={(value) => {
                                                handleOccyteTableChange(
                                                  index,
                                                  i,
                                                  value || null,
                                                  "status"
                                                );
                                              }}
                                              options={statusOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                    ) : null}
                                    {embryologyDetails?.embryo_dev_incubator ===
                                      "TIME-LAPSE" ? (
                                      <td>
                                        <div className="w_120">
                                          <Form.Item
                                            name={`well_no${i}${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              disabled={
                                                disabledField("well_no") ||
                                                item?.blasto_score
                                                  ?.toLowerCase()
                                                  ?.trim() === "arrested" ||
                                                item?.fert_check ===
                                                "Degenerated" ||
                                                !item?.vitrification_id?.trim() ||
                                                disableEmbryoGrade(
                                                  item?.embryo_grade
                                                )
                                              }
                                              placeholder="Well No."
                                              value={item?.well_no}
                                              onChange={(e) => {
                                                handleOccyteTableChange(
                                                  index,
                                                  i,
                                                  e.target.value || "",
                                                  "well_no"
                                                );
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                    ) : null}
                                    {!item._id && (
                                      <td style={{ verticalAlign: "middle" }}>
                                        <div className="w_100 text-center">
                                          <Popconfirm
                                            title="Delete this data"
                                            description="Are you sure to delete this data?"
                                            onConfirm={() => {
                                              onDeleteEmbryoData(index);
                                            }}
                                            // onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                          >
                                            <Button
                                              className="btn_transparent"
                                            // onClick={() => {
                                            //   onDeleteEmbryoData(index);
                                            // }}
                                            >
                                              <img
                                                src={TranshIcon}
                                                alt="TranshIcon"
                                              />
                                            </Button>
                                          </Popconfirm>
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(embryologyData)?.length > 0
              ? (userType === 1 || selectedModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button className="btn_gray" onClick={handleClear}>
              Cancel
            </Button>
            <Dropdown
              disabled={printOption.length === 0 ? true : false}
              overlay={menuProps}
              className="custom_select custom_dropdown"
            >
              <Button className="btn_primary mx-3">
                <Space>Print</Space>
              </Button>
            </Dropdown>
          </div>
        </Form>
      </div>
    </div>
  );
}
