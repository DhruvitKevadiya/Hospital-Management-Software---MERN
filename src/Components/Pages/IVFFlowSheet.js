import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Radio,
  Select,
  Spin,
  TimePicker,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import UploadIcon from "../../Img/upload.svg";
import { Table } from "antd";
import {
  AddIvfFlowsheetDetail,
  editIvfFlowsheetDetail,
  getIvfFlowsheetDetail,
  printIVF,
  setIvfFlowsheetList,
  setivfFlowSheetDetail,
  setivfFlowSheetUpdated,
} from "redux/reducers/IVFFlowSheet/IvfFlowSheet.slice";
import moment from "moment";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import dayjs from "dayjs";
import TranshIcon from "../../Img/trash.svg";
import {
  getAttendingDrList,
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  additionalMeasuresOption,
  pgtsOption,
  plannedCycleOption,
  plannedSpermCollectionOption,
  protocolOption,
  sterilityFactorsOptions,
} from "utils/FieldValues";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuthToken } from "Helper/AuthTokenHelper";
import TextArea from "antd/es/input/TextArea";
import Upload from "antd/es/upload/Upload";
import { uploadImage } from "redux/reducers/UploadImage/uploadImage.slice";

export default function IVFFlowSheet() {
  let UserData = getAuthToken();
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();

  const [IvfList, setIvfList] = useState([]);
  const [lastIVFid, setLastIVFid] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [medicalData, setMedicinData] = useState([]);
  const [ultraSoundData, setUltraSoundData] = useState([]);
  const [isEditmedicalObj, setIsEditMedicalObj] = useState({});
  const [isEditultraSoundObj, setIsEditUltraSoundObj] = useState({}); // ultraSoundIntisitalValue
  const [medicalDetails, setMedicinDetails] = useState({
    from_date: null,
    to_date: null,
    medicine: "",
    dose: "",
    step: "",
    ruptures_or_hormones: true,
    // step_up: false,
    // step_down: false,
    // ruptures: false,
    // hormones: true
  });
  const [ultraSoundDetails, setUltraSoundDetails] = useState({
    ultrasoundDate: null,
    rt_side: null,
    rt_number: "",
    lt_side: null,
    lt_number: "",
    endometrium: "",
  });
  const [isEditlabDetailsObj, setIsEditLabdetailsObj] = useState({});
  const [labDetailsData, setLabDetailsData] = useState([]); // labdetailsInitialValue
  const [labDetails, setLabDetails] = useState({
    date: null,
    type: null,
    progesterone: "",
    fsh: "",
    lh: "",
    e2: "",
    amh: "",
    afc: "",
  });
  const [commanDetail, setCommanDetail] = useState({
    protocol: null,
    factors: null,
    last_menstrual_period: null,
    trigger_date: null,
    trigger_time: null,
    pick_up_date: null,
    pick_up_time: null,
    actual_pick_up_time: null,
    grade_of_ohss: null,
    complication: null,
    complication_other: null,
    protocol_other: null,
    doctor_name_id: null,
    count: "",
    motility: "",
    morphology: "",
    dfi: "",
    vialld: "",
    planned_sperm_collection: null,
    done_by_id: null,
    sperm_presence: null,
    additional_measures: null,
    diagnosis_of_pgt: null,
    // planned_cycle: null,
    planned_cycle: [],
    notes: "",
    planned_cycle_date: null,
    donor_profile_affidavit: "",
  });
  const [donor_profile_affidavit_list, setDonor_profile_affidavit_list] =
    useState([]);

  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { selectedPatient, attendingDrList, ivfIdList } = useSelector(
    ({ common }) => common
  );
  const { getUploadImage, isUploadImageUpdated } = useSelector(
    ({ uploadImage }) => uploadImage
  );
  const {
    IvfFlowsheetList,
    ivfstateListState,
    IvfFlowsheetListLoding,
    ivfFlowSheetUpdate,
  } = useSelector(({ ivfFlowSheet }) => ivfFlowSheet);
  useEffect(() => {
    if (isUploadImageUpdated) {
      setCommanDetail({
        ...commanDetail,
        donor_profile_affidavit: getUploadImage?.file,
      });
    }
  }, [isUploadImageUpdated]);
  const onRadioChange = (e) => {
    setMedicinDetails({ ...medicalDetails, [e.target.name]: e.target.value });
  };

  const clearmedicalData = useCallback(() => {
    setMedicinDetails({
      from_date: null,
      to_date: null,
      medicine: "",
      dose: "",
      step: "",
      ruptures_or_hormones: true,
    });
    form.setFieldsValue({
      from_date: null,
      to_date: null,
      medicine: "",
      dose: "",
      step: "",
      ruptures_or_hormones: true,
    });
  }, [form]);

  const handleMedicalData = useCallback(() => {
    const { from_date, to_date, medicine, dose } = medicalDetails;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      from_date &&
      to_date &&
      medicine &&
      dose
    ) {
      if (Object.keys(isEditmedicalObj)?.length > 0) {
        let editedData = [...medicalData] || [];
        editedData =
          editedData?.map((item) => {
            if (item.id === isEditmedicalObj.id) {
              return {
                ...item,
                ...medicalDetails,
                from_date: moment(
                  medicalDetails.from_date,
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
                to_date: moment(medicalDetails.to_date, "DD/MM/YYYY").format(
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ),
                medicine: medicalDetails?.medicine
                  ? medicalDetails?.medicine?.trim()
                  : "",
                dose: dose,
              };
            }
            return item;
          }) || editedData;
        setMedicinData(editedData);
        setIsEditMedicalObj({});
        toast.success("Update Succesfully.");
      } else {
        setMedicinData((prev) => [
          ...prev,
          {
            ...medicalDetails,
            from_date: moment(medicalDetails.from_date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            to_date: moment(medicalDetails.to_date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            id: Math.random().toString().substring(2, 9),
            isDelete: true,
            medicine: medicalDetails?.medicine
              ? medicalDetails?.medicine?.trim()
              : "",
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearmedicalData();
    } else {
      toast.error("Please Fill Medicine Fields.");
    }
  }, [
    selectedPatient,
    isEditmedicalObj,
    medicalDetails,
    medicalData,
    clearmedicalData,
  ]);

  const onChangeMedicalDetails = useCallback((name, values) => {
    const value =
      name === "from_date" || name === "to_date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setMedicinDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onDeleteHandler = useCallback(
    (record) => {
      let treatMentData = [...medicalData] || [];
      treatMentData = treatMentData.filter((item) => item.id !== record.id);
      setMedicinData(treatMentData);
      toast.success("Delete Succesfully.");
    },
    [medicalData, setMedicinData]
  );

  const clearultraSoundData = useCallback(() => {
    setUltraSoundDetails({
      ultrasoundDate: null,
      rt_side: null,
      rt_number: "",
      lt_side: null,
      lt_number: "",
      endometrium: "",
    });
    form.setFieldsValue({
      ultrasoundDate: null,
      rt_side: null,
      rt_number: "",
      lt_side: null,
      lt_number: "",
      endometrium: "",
    });
  }, [form]);

  const handleUltraSoundData = useCallback(() => {
    const {
      ultrasoundDate,
      rt_side,
      rt_number,
      lt_side,
      lt_number,
      endometrium,
    } = ultraSoundDetails;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      ultrasoundDate &&
      rt_side &&
      rt_number &&
      lt_side &&
      lt_number &&
      endometrium
    ) {
      if (Object.keys(isEditultraSoundObj)?.length > 0) {
        let editedData = [...ultraSoundData] || [];
        editedData =
          editedData?.map((item) => {
            if (item.id === isEditultraSoundObj.id) {
              return {
                ...item,
                ultrasoundDate: moment(
                  ultraSoundDetails.ultrasoundDate,
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
                date: moment(
                  ultraSoundDetails.ultrasoundDate,
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
                rt_side: rt_side,
                rt_number: rt_number,
                lt_side: lt_side,
                lt_number: lt_number,
                endometrium: endometrium,
              };
            }
            return item;
          }) || editedData;
        setUltraSoundData(editedData);
        setIsEditUltraSoundObj({});
        toast.success("Update Succesfully.");
      } else {
        setUltraSoundData((prev) => [
          ...prev,
          {
            ...ultraSoundDetails,
            ultrasoundDate: moment(
              ultraSoundDetails.ultrasoundDate,
              "DD/MM/YYYY"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
            date: moment(ultraSoundDetails.ultrasoundDate, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            id: Math.random().toString().substring(2, 9),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearultraSoundData();
    } else {
      toast.error("Please Fill UltraSound Fields.");
    }
  }, [
    clearultraSoundData,
    isEditultraSoundObj,
    selectedPatient,
    ultraSoundData,
    ultraSoundDetails,
  ]);

  const onChangeUltraSoundDetails = useCallback((name, values) => {
    const value =
      name === "ultrasoundDate"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setUltraSoundDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onDeleteultraSound = useCallback(
    (record) => {
      let ultraSoundDetail = [...ultraSoundData] || [];
      ultraSoundDetail = ultraSoundDetail.filter(
        (item) => item.id !== record.id
      );
      setUltraSoundData(ultraSoundDetail);
      toast.success("Delete Succesfully.");
    },
    [ultraSoundData, setUltraSoundData]
  );

  const clearLabData = useCallback(() => {
    setLabDetails({
      date: null,
      type: null,
      progesterone: "",
      fsh: "",
      lh: "",
      e2: "",
      amh: "",
      afc: "",
    });
    form.setFieldsValue({
      date: null,
      type: null,
      progesterone: "",
      fsh: "",
      lh: "",
      e2: "",
      amh: "",
      afc: "",
    });
  }, [form]);

  const handleLabData = useCallback(() => {
    const { date, type, progesterone, fsh, lh, e2, amh, afc } = labDetails;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      date
      //  &&
      // type &&
      // progesterone &&
      // fsh &&
      // lh &&
      // e2 &&
      // amh &&
      // afc
    ) {
      if (Object.keys(isEditlabDetailsObj)?.length > 0) {
        let editedData = [...labDetailsData] || [];
        editedData =
          editedData?.map((item) => {
            if (item.id === isEditlabDetailsObj.id) {
              return {
                ...item,
                date: labDetails.date
                  ? moment(labDetails.date, "DD/MM/YYYY").format(
                    "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                  )
                  : "",
                type: type,
                progesterone: progesterone,
                fsh: fsh,
                lh: lh,
                e2: e2,
                amh: amh,
                afc: afc,
              };
            }
            return item;
          }) || editedData;
        setLabDetailsData(editedData);
        setIsEditLabdetailsObj({});
        toast.success("Update Succesfully.");
      } else {
        setLabDetailsData((prev) => [
          ...prev,
          {
            ...labDetails,
            date: labDetails.date
              ? moment(labDetails.date, "DD/MM/YYYY").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              )
              : "",
            id: Math.random().toString().substring(2, 9),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }

      clearLabData();
    } else {
      toast.error("Please Fill Date in Lab Details.");
    }
  }, [
    clearLabData,
    isEditlabDetailsObj,
    labDetails,
    labDetailsData,
    selectedPatient,
  ]);

  const onChangeLabDetails = useCallback((name, values) => {
    const value =
      name === "date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setLabDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onDeleteLabDetails = useCallback(
    (record) => {
      let LabDetail = [...labDetailsData] || [];
      LabDetail = LabDetail.filter((item) => item.id !== record.id);
      setLabDetailsData(LabDetail);
      toast.success("Delete Succesfully.");
    },
    [labDetailsData, setLabDetailsData]
  );

  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: '',
  //   patient_full_name: '',
  //   partner_full_name: '',
  //   married_since: '',
  // });

  const checkPlannedCycleCondition = useMemo(() => {
    let checkPlannedCycle = false;
    if (commanDetail?.planned_cycle?.length) {
      checkPlannedCycle = commanDetail?.planned_cycle?.some((item) =>
        ["FET", "ED", "OD", "Thawed Oocytes ICSI"].includes(item)
      );
    }
    return checkPlannedCycle;
  }, [commanDetail?.planned_cycle]);

  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);

  // const validatePickUpDate = (rule, value) => {
  //   const triggerDate = form?.getFieldValue("trigger_date");
  //   if (value && triggerDate && !value?.isAfter(triggerDate, "day")) {
  //     return Promise.reject("Pickup Date must be after Trigger Date");
  //   }
  // };

  const validatePickUpTime = (rule, value) => {
    const triggerTime = form.getFieldValue("trigger_time");
    const triggerDate = form.getFieldValue("trigger_date");
    const pickUpDate = form.getFieldValue("pick_up_date");
    if (triggerTime && triggerDate && value && pickUpDate) {
      const triggerDateTime = dayjs(triggerDate)
        .hour(dayjs(triggerTime).hour())
        .minute(dayjs(triggerTime).minute());
      const pickUpDateTime = dayjs(pickUpDate)
        .hour(dayjs(value).hour())
        .minute(dayjs(value).minute());
      const diffHours = pickUpDateTime.diff(triggerDateTime, "hour");
      if (diffHours < 34) {
        return Promise.reject(
          "Pickup Time must be at least 34 hours after Trigger Time"
        );
      }
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);

  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [dispatch, attendingDrList]);

  const clearIvfFlowSheetData = useCallback(() => {
    // setPatientDetails({
    //   partner_full_name: '',
    //   patient_full_name: '',
    //   patient_id: '',
    //   married_since: '',
    // });
    setLabDetailsData([]);
    setUltraSoundData([]);
    setMedicinData([]);
    setLastIVFid("");
    setCommanDetail({
      protocol: null,
      factors: null,
      last_menstrual_period: null,
      trigger_date: null,
      trigger_time: null,
      pick_up_date: null,
      pick_up_time: null,
      actual_pick_up_time: null,
      grade_of_ohss: null,
      complication: null,
      complication_other: null,
      protocol_other: null,
      doctor_name_id: null,
      count: "",
      motility: "",
      morphology: "",
      dfi: "",
      vialld: "",
      planned_sperm_collection: null,
      done_by_id: null,
      sperm_presence: null,
      additional_measures: null,
      diagnosis_of_pgt: null,
      // planned_cycle: null,
      planned_cycle: [],
      deleted: false,
      medicine_detail: [],
      ultrasound_detail: [],
      lab_detail: [],
      notes: "",
      planned_cycle_date: null,
    });
    form.resetFields();
    clearmedicalData();
    clearultraSoundData();
    clearLabData();
  }, [form]);

  const printIVFData = useCallback(async () => {
    if (Object.keys(selectedPatient)?.length > 0) {
      let ultraSoundDataset = ultraSoundData.map(
        ({ date, rt_side, rt_number, lt_side, lt_number, endometrium }) => ({
          date: date ? moment(date).format("YYYY-MM-DD") : null,
          rt_side,
          rt_number,
          lt_side,
          lt_number,
          endometrium,
        })
      );

      let medicalDataset = medicalData.map((item) => {
        const { from_date, to_date, medicine, dose } = item;
        return {
          from_date: from_date ? moment(from_date).format("YYYY-MM-DD") : null,
          to_date: to_date ? moment(to_date).format("YYYY-MM-DD") : null,
          medicine: medicine ? medicine.trim() : "",
          dose,
        };
      });
      const doctor = attendingDrList.find(
        (doc) => doc._id === IvfFlowsheetList?.doctor_name_id
      );
      const doneBy = attendingDrList.find(
        (doc) => doc._id === IvfFlowsheetList?.done_by_id
      );

      let labDataset = (labDetailsData || []).map(
        ({
          _id,
          ivf_flow_id,
          date,
          type,
          progesterone,
          fsh,
          lh,
          e2,
          amh,
          afc,
        }) => ({
          _id,
          ivf_flow_id,
          date,
          type,
          progesterone,
          fsh,
          lh,
          e2,
          amh,
          afc,
        })
      );

      const patientDetails = {
        today_date: moment().format("YYYY-MM-DD") || null,
        patient_id: selectedPatient?.patient_id || null,
        patient_full_name: selectedPatient.patient_full_name || null,
        ivf_flow_id: lastIVFid || null,
        partner_full_name: selectedPatient?.partner_full_name || null,
        last_menstrual_period: IvfFlowsheetList?.last_menstrual_period
          ? moment(IvfFlowsheetList.last_menstrual_period).format("YYYY-MM-DD")
          : null,
        married_since: selectedPatient?.married_since,
        dr_name: doctor ? doctor.user_name : "",
        protocol: IvfFlowsheetList?.protocol || null,
        planned_cycle: IvfFlowsheetList?.planned_cycle
          ? IvfFlowsheetList?.planned_cycle.join()
          : "",
        donor_profile_affidavit: IvfFlowsheetList?.donor_profile_affidavit
          ? IvfFlowsheetList?.donor_profile_affidavit
          : "",
        planned_sperm_collection: IvfFlowsheetList?.planned_sperm_collection
          ? IvfFlowsheetList?.planned_sperm_collection
          : null,
        trigger_date: IvfFlowsheetList?.trigger_date
          ? moment(IvfFlowsheetList.trigger_date).format("YYYY-MM-DD")
          : null,
        trigger_time: IvfFlowsheetList?.trigger_time ? IvfFlowsheetList?.trigger_time?.length === 8 ? IvfFlowsheetList?.trigger_time : dayjs(IvfFlowsheetList?.trigger_time).format("HH:mm:ss") : null,
        complication: IvfFlowsheetList?.complication || null,
        pick_up_time: IvfFlowsheetList?.pick_up_time ? IvfFlowsheetList?.pick_up_time?.length === 8 ? IvfFlowsheetList?.pick_up_time : dayjs(IvfFlowsheetList?.pick_up_time).format("HH:mm:ss") : null,
        actual_pick_up_time: IvfFlowsheetList?.actual_pick_up_time || null,
        done_by: doneBy ? doneBy.user_name : "",
      };

      const payloadIVFPrint = {
        ...patientDetails,
        medicine_detail: medicalDataset,
        ultrasound_detail: ultraSoundDataset,
        lab_detail: labDataset,
      };

      dispatch(
        printIVF({
          location_id: selectedLocation,
          module_id: selectedModule?._id,
          payload: payloadIVFPrint,
        })
      );
    }
  }, [lastIVFid, IvfFlowsheetList]);

  const marriedYearCount = useCallback((married_since) => {
    if (married_since !== "" || married_since !== null) {
      const currentDate = moment();
      const dob = moment(married_since);
      const years = currentDate.diff(dob, "years");
      return `${years}Y`;
    }
  }, []);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient).length > 0) {
  //     setPatientDetails({
  //       patient_id: selectedPatient?.patient_id || '',
  //       patient_full_name: selectedPatient?.patient_full_name || '',
  //       partner_full_name: selectedPatient?.partner_full_name || '',
  //       married_since: marriedYearCount(selectedPatient?.anniversary) || '',
  //     });
  //     form.setFieldsValue({
  //       patient_id: selectedPatient?.patient_id || '',
  //       patient_full_name: selectedPatient?.patient_full_name || '',
  //       partner_full_name: selectedPatient?.partner_full_name || '',
  //       married_since: marriedYearCount(selectedPatient?.anniversary) || '',
  //     });
  //   }
  //   return () => {
  //     clearIvfFlowSheetData();
  //     dispatch(setIvfIdList([]));
  //     setIvfList([]);
  //     setLastIVFid('');
  //     dispatch(setIvfFlowsheetList({}));
  //     dispatch(setivfFlowSheetDetail({}));
  //   };
  // }, [form, dispatch, selectedPatient, clearIvfFlowSheetData]);

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
          paramsModule: "ivf_flow",
        })
      );
    }
    return () => {
      clearIvfFlowSheetData();
      dispatch(setIvfIdList([]));
      setIvfList([]);
      setLastIVFid("");
      dispatch(setIvfFlowsheetList({}));
      dispatch(setivfFlowSheetDetail({}));
    };
  }, [selectedPatient, dispatch, selectedPatient, clearIvfFlowSheetData]);

  useEffect(() => {
    if (Object.keys(selectedPatient)?.length > 0) {
      if (ivfIdList?.length > 0 && selectedLocation && selectedModule._id) {
        const ivfListId = ivfIdList?.map((item) => ({
          value: item._id,
          label: item.ivf_id,
        }));
        setIvfList(ivfListId);
        form.setFieldsValue({ ivf_id: ivfListId[0].value });
        setLastIVFid(ivfListId[0].value);
        if (ivfIdList[0].ivf_id !== "new") {
          dispatch(
            getIvfFlowsheetDetail({
              locationId: selectedLocation,
              ivfFlowId: ivfListId[0].value,
              moduleId: selectedModule._id,
            })
          );
        }
      }
    }
  }, [ivfIdList]);

  useEffect(() => {
    if (Object.keys(IvfFlowsheetList)?.length > 0) {
      const medicine_detailset =
        IvfFlowsheetList?.medicine_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            step: item?.step_down
              ? "step_down"
              : item?.step_up
                ? "step_up"
                : "",
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      const ultrasound_detailset =
        IvfFlowsheetList?.ultrasound_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      const lab_detailset =
        IvfFlowsheetList?.lab_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      setMedicinData(medicine_detailset);
      setUltraSoundData(ultrasound_detailset);
      setLabDetailsData(lab_detailset);
      setCommanDetail({
        protocol: IvfFlowsheetList?.protocol || null,
        last_menstrual_period: IvfFlowsheetList?.last_menstrual_period
          ? moment(IvfFlowsheetList.last_menstrual_period).format("YYYY-MM-DD")
          : null,
        trigger_date: IvfFlowsheetList?.trigger_date
          ? moment(IvfFlowsheetList.trigger_date).format("YYYY-MM-DD")
          : null,
        trigger_time: IvfFlowsheetList?.trigger_time
          ? dayjs(IvfFlowsheetList?.trigger_time, "HH:mm:ss")
          : null,
        pick_up_date: IvfFlowsheetList?.pick_up_date
          ? moment(IvfFlowsheetList.pick_up_date).format("YYYY-MM-DD")
          : null,
        pick_up_time: IvfFlowsheetList?.pick_up_time
          ? dayjs(IvfFlowsheetList?.pick_up_time, "HH:mm:ss")
          : null,
        actual_pick_up_time: IvfFlowsheetList?.actual_pick_up_time
          ? dayjs(IvfFlowsheetList.actual_pick_up_time, "HH:mm:ss")
          : null,
        grade_of_ohss: IvfFlowsheetList?.grade_of_ohss || null,
        complication: IvfFlowsheetList?.complication || null,
        complication_other: IvfFlowsheetList?.complication_other || null,
        protocol_other: IvfFlowsheetList?.protocol_other || null,
        doctor_name_id: IvfFlowsheetList?.doctor_name_id
          ? IvfFlowsheetList?.doctor_name_id
          : null,
        count: IvfFlowsheetList?.count || "",
        motility: IvfFlowsheetList?.motility || "",
        morphology: IvfFlowsheetList.morphology || "",
        dfi: IvfFlowsheetList?.dfi || "",
        vialld: IvfFlowsheetList?.vialld | "",
        planned_sperm_collection:
          IvfFlowsheetList?.planned_sperm_collection || null,
        done_by_id: IvfFlowsheetList?.done_by_id || null,
        sperm_presence: IvfFlowsheetList?.sperm_presence || null,
        additional_measures: IvfFlowsheetList?.additional_measures || null,
        diagnosis_of_pgt: IvfFlowsheetList?.diagnosis_of_pgt || null,
        planned_cycle: IvfFlowsheetList?.planned_cycle || [],
        deleted: IvfFlowsheetList?.deleted || false,
        factors: IvfFlowsheetList?.factors || null,
        notes: IvfFlowsheetList?.notes || null,
        planned_cycle_date: IvfFlowsheetList?.planned_cycle_date
          ? dayjs(IvfFlowsheetList.planned_cycle_date, "HH:mm:ss")
          : null,
      });
      setLastIVFid(IvfFlowsheetList?.ivf_id || null);
      form.setFieldsValue({
        protocol: IvfFlowsheetList?.protocol || null,
        last_menstrual_period: IvfFlowsheetList?.last_menstrual_period
          ? dayjs(
            moment(IvfFlowsheetList?.last_menstrual_period).format(
              "YYYY-MM-DD"
            ),
            "YYYY-MM-DD"
          )
          : null,
        trigger_date: IvfFlowsheetList?.trigger_date
          ? dayjs(
            moment(IvfFlowsheetList?.trigger_date).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          )
          : null,
        trigger_time: IvfFlowsheetList?.trigger_time
          ? dayjs(IvfFlowsheetList?.trigger_time, "HH:mm:ss")
          : null,
        pick_up_date: IvfFlowsheetList?.pick_up_date
          ? dayjs(
            moment(IvfFlowsheetList?.pick_up_date).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          )
          : null,
        pick_up_time: IvfFlowsheetList?.pick_up_time
          ? dayjs(IvfFlowsheetList?.pick_up_time, "HH:mm:ss")
          : null,
        actual_pick_up_time: IvfFlowsheetList?.actual_pick_up_time
          ? dayjs(IvfFlowsheetList?.actual_pick_up_time, "HH:mm:ss")
          : null,
        planned_cycle_date: IvfFlowsheetList?.planned_cycle_date
          ? dayjs(IvfFlowsheetList?.planned_cycle_date, "HH:mm:ss")
          : null,
        grade_of_ohss: IvfFlowsheetList?.grade_of_ohss || null,
        complication: IvfFlowsheetList?.complication || null,
        complication_other: IvfFlowsheetList?.complication_other || null,
        protocol_other: IvfFlowsheetList?.protocol_other || null,
        doctor_name_id: IvfFlowsheetList?.doctor_name_id
          ? IvfFlowsheetList?.doctor_name_id
          : null,
        count: IvfFlowsheetList?.count || "",
        motility: IvfFlowsheetList.motility || "",
        morphology: IvfFlowsheetList?.morphology || "",
        dfi: IvfFlowsheetList?.dfi || "",
        vialld: IvfFlowsheetList?.vialld | "",
        planned_sperm_collection:
          IvfFlowsheetList?.planned_sperm_collection || null,
        done_by_id: IvfFlowsheetList?.done_by_id,
        sperm_presence: IvfFlowsheetList.sperm_presence,
        additional_measures: IvfFlowsheetList?.additional_measures,
        diagnosis_of_pgt: IvfFlowsheetList?.diagnosis_of_pgt || null,
        planned_cycle: IvfFlowsheetList?.planned_cycle || [],
        deleted: IvfFlowsheetList?.deleted || false,
        factors: IvfFlowsheetList?.factors || "",
        notes: IvfFlowsheetList?.notes || null,
      });
    }
  }, [IvfFlowsheetList, lastIVFid?.value]);

  const getIvfDetailsID = useCallback(
    (ivfId) => {
      if (ivfId && ivfId !== "new" && selectedModule._id) {
        setIvfFlowsheetList({});
        setLastIVFid(ivfId);
        dispatch(
          getIvfFlowsheetDetail({
            locationId: selectedLocation,
            ivfFlowId: ivfId,
            moduleId: selectedModule._id,
          })
        );
      } else if (ivfId === "new") {
        setLastIVFid(ivfId);
        setCommanDetail({
          last_menstrual_period: null,
          protocol: null,
          factors: null,
          trigger_date: null,
          trigger_time: null,
          pick_up_date: null,
          pick_up_time: null,
          actual_pick_up_time: null,
          grade_of_ohss: null,
          complication: null,
          complication_other: null,
          protocol_other: null,
          doctor_name_id: null,
          count: "",
          motility: "",
          morphology: "",
          dfi: "",
          vialld: "",
          planned_sperm_collection: null,
          done_by_id: null,
          sperm_presence: null,
          additional_measures: null,
          diagnosis_of_pgt: null,
          // planned_cycle: null,
          planned_cycle: [],
          deleted: false,
          medicine_detail: {},
          ultrasound_detail: {},
          lab_detail: {},
          notes: "",
        });
        form.setFieldsValue({
          last_menstrual_period: null,
          protocol: null,
          factors: null,
          trigger_date: null,
          trigger_time: null,
          pick_up_date: null,
          pick_up_time: null,
          actual_pick_up_time: null,
          grade_of_ohss: null,
          complication: null,
          complication_other: null,
          protocol_other: null,
          doctor_name_id: null,
          count: "",
          motility: "",
          morphology: "",
          dfi: "",
          vialld: "",
          planned_sperm_collection: null,
          done_by_id: null,
          sperm_presence: null,
          additional_measures: null,
          diagnosis_of_pgt: null,
          // planned_cycle: null,
          planned_cycle: [],
          deleted: false,
          medicine_detail: {},
          ultrasound_detail: {},
          lab_detail: {},
          notes: "",
        });
        setLabDetailsData([]);
        setUltraSoundData([]);
        setMedicinData([]);
        dispatch(setIvfFlowsheetList({}));
      }
    },
    [dispatch, selectedLocation, form, selectedModule]
  );

  const onFinish = async (values) => {
    // let medicalDataset = (medicalData || []).map(({ id, ...data }) => data);

    let IVFAllCommonDetails = { ...commanDetail };

    const {
      trigger_date,
      trigger_time,
      pick_up_date,
      pick_up_time,
      grade_of_ohss,
      complication,
      complication_other,
      protocol_other,
      doctor_name_id,
      actual_pick_up_time,
      ...restData
    } = commanDetail;

    if (commanDetail?.protocol === "Fet") {
      IVFAllCommonDetails = { ...restData };
    }

    let medicalDataset = medicalData.map((item) => {
      const { id, ...rest } = item;
      return {
        ...rest,
        step_up: item.step === "step_up" ? true : false,
        step_down: item.step === "step_down" ? true : false,
        medicine: item.medicine ? item.medicine.trim() : "",
      };
    });
    let ultraSoundDataset = (ultraSoundData || []).map(
      ({ id, ...data }) => data
    );
    let labDataset = (labDetailsData || []).map(({ id, ...data }) => data);

    const payload = {
      ...IVFAllCommonDetails,
      ivf_id: lastIVFid,
      married_since: selectedPatient?.married_since,
      deleted: false,
      medicine_detail: medicalDataset,
      ultrasound_detail: ultraSoundDataset,
      lab_detail: labDataset,
    };

    if (Object.keys(IvfFlowsheetList).length > 0) {
      dispatch(
        editIvfFlowsheetDetail({
          locationId: selectedLocation,
          _id: IvfFlowsheetList._id,
          moduleId: selectedModule._id,
          payload: payload,
        })
      );
    } else {
      const response = await dispatch(
        AddIvfFlowsheetDetail({
          locationId: selectedLocation,
          id: selectedPatient?._id,
          moduleId: selectedModule._id,
          payload: payload,
        })
      );

      if (response?.payload?.data?._id) {
        setIsEditMedicalObj({});
        setIsEditUltraSoundObj({});
        setIsEditLabdetailsObj({});
        const res = await dispatch(
          getIvfId({
            locationId: selectedLocation,
            patientRegId: selectedPatient?._id,
            moduleId: selectedModule?._id,
            paramsModule: "?module=ivf_flow",
          })
        );

        if (res?.payload) {
          const { payload } = await dispatch(
            getGlobalSearch({
              patient_reg_id: selectedPatient._id,
              patient_name: selectedPatient.patient_full_name,
              location_id: selectedLocation,
            })
          );
          if (payload?.length > 0) {
            dispatch(setSelectedPatient(payload[0]));
          }
        }
      }
    }
    dispatch(setivfFlowSheetUpdated(false));
  };
  //   [
  //     dispatch,
  //     IvfFlowsheetList,
  //     commanDetail,
  //     labDetailsData,
  //     medicalData,
  //     selectedLocation,
  //     selectedModule._id,
  //     selectedPatient?._id,
  //     selectedPatient?.anniversary,
  //     ultraSoundData
  //   ]
  // );

  const getNewSelectedPatientData = useCallback(async () => {
    if (
      ivfFlowSheetUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(IvfFlowsheetList)?.length === 0
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
    ivfFlowSheetUpdate,
    IvfFlowsheetList,
    selectedPatient,
  ]);

  useEffect(() => {
    if (ivfFlowSheetUpdate && IvfFlowsheetList._id) {
      dispatch(
        getIvfFlowsheetDetail({
          locationId: selectedLocation,
          ivfFlowId: IvfFlowsheetList._id,
          moduleId: selectedModule._id,
        })
      );
      getNewSelectedPatientData();
      dispatch(setivfFlowSheetUpdated(false));
    }
  }, [ivfFlowSheetUpdate]);

  const columns = [
    {
      title: "Sr. No.",
      key: "sno",
      render: (text, data, index) => index + 1,
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      key: "from_date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      key: "to_date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
    },
    {
      title: "Dose",
      dataIndex: "dose",
      key: "dose",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 || selectedModule?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record?.id === isEditmedicalObj?.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearmedicalData();
                        setIsEditMedicalObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setMedicinDetails({
                          from_date: moment(record.from_date).format(
                            "DD/MM/YYYY"
                          ),
                          to_date: moment(record.to_date).format("DD/MM/YYYY"),
                          medicine: record.medicine,
                          dose: record.dose,
                          step: record.step,
                          ruptures_or_hormones: record.ruptures_or_hormones,
                        });
                        form.setFieldsValue({
                          from_date: dayjs(
                            moment(record.from_date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          to_date: dayjs(
                            moment(record.to_date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          medicine: record.medicine,
                          dose: record.dose,
                          step: record.step,
                          ruptures_or_hormones: record.ruptures_or_hormones,
                        });
                        setIsEditMedicalObj(record);
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {record?.isDelete && (
              <li>
                <Popconfirm
                  title="Delete this data"
                  description="Are you sure to delete this data?"
                  onConfirm={() => {
                    onDeleteHandler(record);
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => }
                  >
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        );
      },
    },
  ];

  const UltraSoundcolumns = [
    {
      title: "Sr. No.",
      key: "sno",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "RT Side",
      dataIndex: "rt_side",
      key: "rt_side",
    },
    {
      title: "RT Number",
      dataIndex: "rt_number",
      key: "rt_number",
    },
    {
      title: "LT Side",
      dataIndex: "lt_side",
      key: "lt_side",
    },
    {
      title: "LT Number",
      dataIndex: "lt_number",
      key: "lt_number",
    },
    {
      title: "Endometrium",
      dataIndex: "endometrium",
      key: "endometrium",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 || selectedModule?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record?.id === isEditultraSoundObj?.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearultraSoundData();
                        setIsEditUltraSoundObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setUltraSoundDetails({
                          ultrasoundDate: moment(record.date).format(
                            "DD/MM/YYYY"
                          ),
                          rt_side: record.rt_side,
                          rt_number: record.rt_number,
                          lt_side: record.lt_side,
                          lt_number: record.lt_number,
                          endometrium: record.endometrium,
                        });
                        form.setFieldsValue({
                          ultrasoundDate: dayjs(
                            moment(record.date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          rt_side: record.rt_side,
                          rt_number: record.rt_number,
                          lt_side: record.lt_side,
                          lt_number: record.lt_number,
                          endometrium: record.endometrium,
                        });
                        setIsEditUltraSoundObj(record);
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {record?.isDelete && (
              <li>
                <Popconfirm
                  title="Delete this data"
                  description="Are you sure to delete this data?"
                  onConfirm={() => {
                    onDeleteultraSound(record);
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteultraSound(record)}
                  >
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        );
      },
    },
  ];

  const labDetailColumns = [
    {
      title: "Sr. No.",
      key: "sno",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Progesterone",
      dataIndex: "progesterone",
      key: "progesterone",
    },
    {
      title: "FSH",
      dataIndex: "fsh",
      key: "fsh",
    },
    {
      title: "LH",
      dataIndex: "lh",
      key: "lh",
    },
    {
      title: "E2",
      dataIndex: "e2",
      key: "e2",
    },
    {
      title: "AMH",
      dataIndex: "amh",
      key: "amh",
    },
    {
      title: "AFC",
      dataIndex: "afc",
      key: "afc",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 || selectedModule?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record?.id === isEditlabDetailsObj?.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearLabData();
                        setIsEditLabdetailsObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setLabDetails({
                          date: moment(record.date).format("DD/MM/YYYY"),
                          type: record.type,
                          progesterone: record.progesterone,
                          fsh: record.fsh,
                          lh: record.lh,
                          e2: record.e2,
                          amh: record.amh,
                          afc: record.afc,
                        });
                        form.setFieldsValue({
                          date: dayjs(
                            moment(record.date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          type: record.type,
                          progesterone: record.progesterone,
                          fsh: record.fsh,
                          lh: record.lh,
                          e2: record.e2,
                          amh: record.amh,
                          afc: record.afc,
                        });
                        setIsEditLabdetailsObj(record);
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {record?.isDelete && (
              <li>
                <Popconfirm
                  title="Delete this data"
                  description="Are you sure to delete this data?"
                  onConfirm={() => {
                    onDeleteLabDetails(record);
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteLabDetails(record)}
                  >
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        );
      },
    },
  ];

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");

    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancel = useCallback(() => {
    clearIvfFlowSheetData();
    setIvfList([]);
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
    dispatch(setIvfFlowsheetList({}));
    dispatch(setivfFlowSheetDetail({}));
    dispatch(setIvfIdList([]));
  }, [clearIvfFlowSheetData]);

  const customUpload =
    () =>
      async ({ file, onSuccess, onError }) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          dispatch(uploadImage(formData));
          setDonor_profile_affidavit_list([file]);
          setTimeout(() => {
            onSuccess("Successfully uploaded");
          }, 1000);
        } catch (error) {
          onError("Upload failed");
        }
      };

  const handleRemove = () => {
    setCommanDetail({
      ...commanDetail,
      donor_profile_affidavit: "",
    });
    setDonor_profile_affidavit_list("");
  };
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {IvfFlowsheetListLoding && (
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
                  <li>
                    <label>Patient ID :</label>
                    <span>
                      {selectedPatient.patient_id
                        ? selectedPatient.patient_id
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Patient Name :</label>
                    <span>
                      {selectedPatient.patient_full_name
                        ? selectedPatient.patient_full_name
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
                    <label>Married Since :</label>
                    <span>
                      {selectedPatient?.anniversary
                        ? marriedYearCount(selectedPatient?.anniversary)
                        : ""}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input
                      placeholder="Enter Patient Id"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="IVF ID"
                    name="ivf_id"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
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
                      options={IvfList}
                      name="ivf_id"
                      value={lastIVFid}
                      onChange={(e) => {
                        getIvfDetailsID(e || null);
                        setLastIVFid(e || null);
                      }}
                    />
                  </Form.Item>
                </li>
                {/* <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item label="Partner Name" name="partner_full_name">
                    <Input
                      placeholder="Enter Partner Name"
                      name="partner_full_name"
                      value={patientDetails?.partner_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {ivfstateListState && (
                  <Spin tip="Loading" size="large">
                    <div className="content" />
                  </Spin>
                )}
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Protocol"
                    name="protocol"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      options={protocolOption}
                      name="protocol"
                      value={commanDetail?.protocol}
                      onChange={(a) => {
                        setCommanDetail({
                          ...commanDetail,
                          protocol: a || null,
                        });
                      }}
                    />
                  </Form.Item>
                </li>

                {commanDetail?.protocol === "Others" && (
                  <li>
                    <Form.Item label="Protocol Other" name="protocol_other">
                      <Input
                        placeholder="Enter Protocol Other"
                        name="protocol_other"
                        value={commanDetail?.protocol_other}
                        onChange={(e) => {
                          setCommanDetail({
                            ...commanDetail,
                            protocol_other: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}

                <li className="min_200 w_xs_100">
                  {/* <Form.Item
                    label="Factors"
                    name="factors"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
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
                      options={sterilityFactorsOptions}
                      mode="multiple"
                      maxTagCount="responsive"
                      name="factors"
                      value={commanDetail?.factors}
                      onChange={(a) => {
                        setCommanDetail({
                          ...commanDetail,
                          factors: a
                        });
                      }}
                      maxTagPlaceholder={(factors) => (
                        <Tooltip
                          title={factors.map(({ label }) => label).join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                    />
                  </Form.Item> */}

                  <Form.Item
                    label="Factors"
                  // name="factors"
                  >
                    <Tooltip title={selectedPatient?.factors || ""}>
                      <Input
                        placeholder="Enter Factors"
                        // name="factors"
                        value={selectedPatient?.factors || ""}
                        disabled
                      />
                    </Tooltip>
                  </Form.Item>
                </li>
                {/* <li className="w_200 w_xs_100">
                  <Form.Item label="Married Since" name="married_since">
                    <Input
                      placeholder="5 Years"
                      name="married_since"
                      value={patientDetails?.married_since}
                    />
                  </Form.Item>
                </li> */}

                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Last Menstrual Period"
                    name="last_menstrual_period"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="Select To Date"
                      name="last_menstrual_period"
                      value={commanDetail?.last_menstrual_period}
                      onChange={(value) => {
                        setCommanDetail({
                          ...commanDetail,
                          last_menstrual_period: value
                            ? moment(new Date(value)).format("YYYY-MM-DD")
                            : null,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Planned Cycle"
                    name="planned_cycle"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
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
                      name="planned_cycle"
                      maxTagCount="responsive"
                      mode="multiple"
                      value={commanDetail?.planned_cycle}
                      onChange={(e) => {
                        let data = {
                          planned_cycle: e || null,
                        };

                        if (e?.length) {
                          const checkPlannedCycle = e?.some((item) =>
                            ["FET", "ED", "OD", "Thawed Oocytes ICSI"].includes(
                              item
                            )
                          );

                          if (checkPlannedCycle) {
                            data = {
                              ...data,
                              trigger_date: null,
                              trigger_time: null,
                              pick_up_date: null,
                              pick_up_time: null,
                              actual_pick_up_time: null,
                              grade_of_ohss: null,
                              complication: null,
                              complication_other: null,
                              doctor_name_id: null,
                            };

                            form.setFieldsValue({
                              trigger_date: null,
                              trigger_time: null,
                              pick_up_date: null,
                              pick_up_time: null,
                              actual_pick_up_time: null,
                              grade_of_ohss: null,
                              complication: null,
                              complication_other: null,
                              doctor_name_id: null,
                            });
                          }
                        }

                        setCommanDetail({
                          ...commanDetail,
                          ...data,
                        });
                      }}
                      maxTagPlaceholder={(preimplantationGenericTesting) => (
                        <Tooltip
                          title={preimplantationGenericTesting
                            .map(({ label }) => label)
                            .join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                      options={plannedCycleOption}
                    />
                  </Form.Item>
                </li>
                {
                  /* {(commanDetail?.planned_cycle === "OD" ||
                  commanDetail?.planned_cycle === "ED" */
                  commanDetail?.planned_cycle?.some((item) =>
                    ["ED", "OD"].includes(item)
                  ) && (
                    <li className="w_220 w_xs_50">
                      <Form.Item
                        label="Planned Cycle Date"
                        name="planned_cycle_date"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <DatePicker
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          placeholder="Select To Date"
                          name="planned_cycle_date"
                          value={commanDetail?.planned_cycle_date}
                          onChange={(value) => {
                            setCommanDetail({
                              ...commanDetail,
                              planned_cycle_date: value
                                ? moment(new Date(value)).format("YYYY-MM-DD")
                                : null,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  )
                }
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Medicine Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Date"
                    name="from_date"
                    rules={
                      medicalDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="Select From Date"
                      name="from_date"
                      value={
                        medicalDetails?.from_date
                          ? dayjs(medicalDetails?.from_date, "DD/MM/YYYY")
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeMedicalDetails("from_date", value || null)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="To Date"
                    name="to_date"
                    rules={
                      medicalDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="Select To Date"
                      name="to_date"
                      value={
                        medicalDetails?.to_date
                          ? dayjs(medicalDetails?.to_date, "DD/MM/YYYY")
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeMedicalDetails("to_date", value || null)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <Form.Item
                    label="Medicine"
                    name="medicine"
                    rules={
                      medicalDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter medicine"
                      name="medicine"
                      value={medicalDetails?.medicine}
                      onChange={(e) =>
                        onChangeMedicalDetails("medicine", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <Form.Item
                    label="Dose"
                    name="dose"
                    rules={
                      medicalDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter dose"
                      name="dose"
                      value={medicalDetails?.dose}
                      onChange={(e) => {
                        onChangeMedicalDetails("dose", e.target.value);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="align-self-center">
                  <div className="round_radio_main_wrapper">
                    <div className="round_radio_wrapper">
                      <Radio.Group
                        onChange={onRadioChange}
                        name="step"
                        value={medicalDetails.step}
                      >
                        <Radio value="step_up">Step Up</Radio>
                        <Radio value="step_down">Step Down</Radio>
                      </Radio.Group>
                    </div>
                    <div className="round_radio_wrapper border_left">
                      <Radio.Group
                        onChange={onRadioChange}
                        name="ruptures_or_hormones"
                        value={medicalDetails.ruptures_or_hormones}
                      >
                        <Radio value={true}> Hormones</Radio>
                        <Radio value={false}>Ruptures</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </li>
                <li className="w_120 w_xs_50 align-self-end">
                  {Object.keys(isEditmedicalObj)?.length > 0 ? (
                    (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleMedicalData}
                      >
                        Edit
                      </Button>
                    )
                  ) : (
                    <Button
                      disabled={
                        Object.keys(selectedPatient)?.length > 0 ? false : true
                      }
                      className="btn_primary mb24"
                      onClick={handleMedicalData}
                    >
                      Add
                    </Button>
                  )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4 mt-3">
                <Table
                  columns={columns}
                  pagination={false}
                  dataSource={medicalData}
                ></Table>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">UltraSound Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Date"
                    name="ultrasoundDate"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="22/04/2023"
                      name="ultrasoundDate"
                      value={
                        ultraSoundDetails?.ultrasoundDate
                          ? dayjs(
                            ultraSoundDetails?.ultrasoundDate,
                            "DD/MM/YYYY"
                          )
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeUltraSoundDetails(
                          "ultrasoundDate",
                          value || null
                        )
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="RT Side"
                    name="rt_side"
                    className="custom_select"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
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
                      name="rt_side"
                      value={ultraSoundDetails?.rt_side}
                      onChange={(e) =>
                        onChangeUltraSoundDetails("rt_side", e || null)
                      }
                      // options={[
                      //   { value: "Normal", label: "Normal" },
                      //   { value: "Septum", label: "Septum" },
                      //   { value: "Asherman", label: "Asherman" },
                      //   { value: "Others", label: "Others" }
                      // ]}
                      options={[
                        { value: "08-12", label: "08-12" },
                        { value: "13-15", label: "13-15" },
                        { value: "16-20", label: "16-20" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="RT Number"
                    name="rt_number"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="5"
                      name="rt_number"
                      value={ultraSoundDetails?.rt_number}
                      onChange={(e) =>
                        onChangeUltraSoundDetails("rt_number", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="LT Side"
                    name="lt_side"
                    className="custom_select"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
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
                      name="lt_side"
                      value={ultraSoundDetails?.lt_side}
                      onChange={(e) =>
                        onChangeUltraSoundDetails("lt_side", e || null)
                      }
                      // options={[
                      //   { value: "Normal", label: "Normal" },
                      //   { value: "Septum", label: "Septum" },
                      //   { value: "Asherman", label: "Asherman" },
                      //   { value: "Others", label: "Others" }
                      // ]}
                      options={[
                        { value: "08-12", label: "08-12" },
                        { value: "13-15", label: "13-15" },
                        { value: "16-20", label: "16-20" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="LT Number"
                    name="lt_number"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="5"
                      name="lt_number"
                      value={ultraSoundDetails?.lt_number}
                      onChange={(e) =>
                        onChangeUltraSoundDetails("lt_number", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="Endometrium"
                    name="endometrium"
                    rules={
                      ultraSoundDetails?.ultrasoundDate && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="--"
                      name="endometrium"
                      value={ultraSoundDetails?.endometrium}
                      onChange={(e) =>
                        onChangeUltraSoundDetails("endometrium", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_50 align-self-end">
                  {Object.keys(isEditultraSoundObj)?.length > 0 ? (
                    (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleUltraSoundData}
                      >
                        Edit
                      </Button>
                    )
                  ) : (
                    <Button
                      disabled={
                        Object.keys(selectedPatient)?.length > 0 ? false : true
                      }
                      className="btn_primary mb24"
                      onClick={handleUltraSoundData}
                    >
                      Add
                    </Button>
                  )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4">
                <Table
                  columns={UltraSoundcolumns}
                  dataSource={ultraSoundData}
                  pagination={false}
                />
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Lab Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Date"
                    name="date"
                    rules={
                      labDetails?.date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="22/04/2023"
                      name="date"
                      value={
                        labDetails?.date
                          ? dayjs(labDetails?.date, "DD/MM/YYYY")
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeLabDetails("date", value || null)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Type"
                    name="type"
                    className="custom_select"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
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
                      name="type"
                      placeholder="Select"
                      value={labDetails?.rt_side}
                      onChange={(e) => onChangeLabDetails("type", e || null)}
                      options={[
                        { value: "Investigation", label: "Investigation" },
                        { value: "D2 Hormones", label: "D2 Hormones" },
                        {
                          value: "Investigation on Day of Trigger",
                          label: "Investigation on Day of Trigger",
                        },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Progesterone"
                    name="progesterone"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="--"
                      name="progesterone"
                      value={labDetails?.progesterone}
                      onChange={(e) =>
                        onChangeLabDetails("progesterone", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="FSH (decimal - 0.000)"
                    name="fsh"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="2.04"
                      name="fsh"
                      value={labDetails?.fsh}
                      onChange={(e) =>
                        onChangeLabDetails("fsh", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="LH (decimal - 0.000)"
                    name="lh"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="1.56"
                      name="lh"
                      value={labDetails?.lh}
                      onChange={(e) => onChangeLabDetails("lh", e.target.value)}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="E2 (decimal - 0.000)"
                    name="e2"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="7.91"
                      name="e2"
                      value={labDetails?.e2}
                      onChange={(e) => onChangeLabDetails("e2", e.target.value)}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="AMH (decimal - 0.000)"
                    name="amh"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="2.69"
                      name="amh"
                      value={labDetails?.amh}
                      onChange={(e) =>
                        onChangeLabDetails("amh", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="AFC (decimal - 0.000)"
                    name="afc"
                  // rules={
                  //   labDetails?.date && [
                  //     {
                  //       required: true,
                  //       message: "",
                  //     },
                  //   ]
                  // }
                  >
                    <Input
                      placeholder="--"
                      name="afc"
                      value={labDetails?.afc}
                      onChange={(e) =>
                        onChangeLabDetails("afc", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100 align-self-end">
                  {Object.keys(isEditlabDetailsObj)?.length > 0 ? (
                    (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleLabData}
                      >
                        Edit
                      </Button>
                    )
                  ) : (
                    <Button
                      disabled={
                        Object.keys(selectedPatient)?.length > 0 ? false : true
                      }
                      className="btn_primary mb24"
                      onClick={handleLabData}
                    >
                      Add
                    </Button>
                  )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4">
                <Table
                  columns={labDetailColumns}
                  dataSource={labDetailsData}
                  pagination={false}
                />
              </div>
            </div>
            {commanDetail?.protocol !== "Fet" && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">Pickup Details</h3>
                <ul className="grid_wrapper">
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="Trigger Date"
                      name="trigger_date"
                      rules={[
                        {
                          required: !checkPlannedCycleCondition,
                          message: "",
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder="Select date"
                        name="trigger_date"
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask",
                        }}
                        value={commanDetail?.trigger_date}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              trigger_date: e
                                ? moment(new Date(e)).format("YYYY-MM-DD")
                                : null,
                            });
                          }
                        }}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Trigger Time"
                      name="trigger_time"
                      rules={[
                        {
                          required: !checkPlannedCycleCondition,
                          message: "",
                        },
                      ]}
                    >
                      <TimePicker
                        picker="time"
                        format="h:mm a"
                        name="trigger_time"
                        value={commanDetail?.trigger_time}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              trigger_time: e
                                ? dayjs(e).format("HH:mm:ss")
                                : null,
                            });
                          }
                        }}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="Pickup Date"
                      name="pick_up_date"
                      rules={[
                        {
                          required: !checkPlannedCycleCondition,
                          message: "",
                        },
                        // {
                        //   validator: validatePickUpDate
                        // }
                      ]}
                    >
                      <DatePicker
                        placeholder="Select date"
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask",
                        }}
                        name="pick_up_date"
                        value={commanDetail?.pick_up_date}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              pick_up_date: e
                                ? moment(new Date(e)).format("YYYY-MM-DD")
                                : null,
                            });
                          }
                        }}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Pickup Time"
                      name="pick_up_time"
                      dependencies={[
                        "trigger_time",
                        "trigger_date",
                        "pick_up_date",
                      ]}
                      rules={[
                        {
                          required: !checkPlannedCycleCondition,
                          message: "",
                        },
                        {
                          validator: validatePickUpTime,
                        },
                      ]}
                    >
                      <TimePicker
                        picker="time"
                        format="h:mm a"
                        name="pick_up_time"
                        value={commanDetail?.pick_up_time}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              pick_up_time: e
                                ? dayjs(e).format("HH:mm:ss")
                                : null,
                            });
                          }
                        }}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Actual Pickup Time"
                      name="actual_pick_up_time"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '',
                    //   },
                    // ]}
                    >
                      <TimePicker
                        picker="time"
                        format="h:mm a"
                        name="actual_pick_up_time"
                        value={commanDetail?.actual_pick_up_time}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              actual_pick_up_time: e
                                ? dayjs(e).format("HH:mm:ss")
                                : null,
                            });
                          }
                        }}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Grade of OHSS"
                      name="grade_of_ohss"
                      className="custom_select"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '',
                    //   },
                    // ]}
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
                        name="grade_of_ohss"
                        value={commanDetail?.grade_of_ohss}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              grade_of_ohss: e || null,
                            });
                          }
                        }}
                        options={[
                          { value: "Grade - I", label: "Grade - I" },
                          { value: "Grade - II", label: "Grade - II" },
                          { value: "Grade - III", label: "Grade - III" },
                          {
                            value: "Hospitalisation",
                            label: "Hospitalisation",
                          },
                          { value: "None", label: "None" },
                        ]}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Complication"
                      name="complication"
                      className="custom_select"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '',
                    //   },
                    // ]}
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
                        // filterSort={(optionA, optionB) =>
                        //   optionA.label
                        //     .toLowerCase()
                        //     .localeCompare(optionB.label.toLowerCase())
                        // }
                        placeholder="Select"
                        name="complication"
                        value={commanDetail?.complication}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              complication: e || null,
                            });
                          }
                        }}
                        options={[
                          { value: "None", label: "None" },
                          { value: "Bleeding", label: "Bleeding" },
                          { value: "OHSS", label: "OHSS" },
                          { value: "Others", label: "Others" },
                        ]}
                        disabled={checkPlannedCycleCondition}
                      />
                    </Form.Item>
                  </li>

                  {commanDetail?.complication === "Others" && (
                    <li>
                      <Form.Item
                        label="Complication Other"
                        name="complication_other"
                      >
                        <Input
                          placeholder="Enter Complication Other"
                          name="complication_other"
                          value={commanDetail?.complication_other}
                          onChange={(e) => {
                            setCommanDetail({
                              ...commanDetail,
                              complication_other: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  )}

                  <li className="w_370 w_xs_100">
                    <Form.Item
                      label="Doctor Name"
                      name="doctor_name_id"
                      className="custom_select"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: '',
                    //   },
                    // ]}
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
                        name="doctor_name_id"
                        value={commanDetail?.doctor_name_id}
                        onChange={(e) => {
                          if (!checkPlannedCycleCondition) {
                            setCommanDetail({
                              ...commanDetail,
                              doctor_name_id: e || null,
                            });
                          }
                        }}
                        options={doctorList}
                        disabled={checkPlannedCycleCondition}
                        className="mb24"
                      />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            )}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Semen Details</h3>
              <ul className="grid_wrapper">
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="Count"
                    name="count"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder="--"
                      name="count"
                      value={commanDetail?.count}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          count: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="Motility"
                    name="motility"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder="--"
                      name="motility"
                      value={commanDetail?.motility}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          motility: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="Morphology (%)"
                    name="morphology"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder="00%"
                      name="morphology"
                      value={commanDetail?.morphology}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          morphology: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="DFI (%)"
                    name="dfi"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder="00%"
                      name="dfi"
                      value={commanDetail?.dfi}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          dfi: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="ViallD"
                    name="vialld"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
                  >
                    <Input
                      placeholder="--"
                      name="vialld"
                      value={commanDetail?.vialld}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          vialld: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <Form.Item
                    label="Planned Sperm Collection"
                    name="planned_sperm_collection"
                    className="custom_select"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
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
                      name="planned_sperm_collection"
                      value={commanDetail?.planned_sperm_collection}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          planned_sperm_collection: e || null,
                        });
                      }}
                      options={plannedSpermCollectionOption}
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
                {commanDetail?.planned_sperm_collection?.includes(
                  "Donor Sperm"
                ) && (
                    <li className="w_240 w_xs_100">
                      <Form.Item
                        label="Donor Profile / Affidavit"
                        name="medicine"
                        rules={
                          medicalDetails?.from_date && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <div className="photo_upload_inner">
                          <Button
                            onClick={() => {
                              if (commanDetail?.donor_profile_affidavit) {
                                const url = `${process.env.REACT_APP_SOCKET_URL}/${commanDetail.donor_profile_affidavit}`;
                                window.open(url, "_blank");
                              }
                            }}
                          >
                            Click to download
                          </Button>
                          <Upload
                            customRequest={customUpload(
                              "donor_profile_affidavit"
                            )}
                            onRemove={(file) => {
                              handleRemove();
                            }}
                            listType="text"
                          >
                            <div className="upload_wrap">
                              <img src={UploadIcon} alt="" />
                              <p>Click to upload or drag & drop</p>
                              <span>Browse</span>
                            </div>
                          </Upload>
                        </div>
                      </Form.Item>
                    </li>
                  )}
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Done By"
                    name="done_by_id"
                    className="custom_select"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
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
                      name="done_by_id"
                      value={commanDetail?.done_by_id}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          done_by_id: e || null,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Sperm Present"
                    name="sperm_presence"
                    className="custom_select"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
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
                      name="sperm_presence"
                      value={commanDetail?.sperm_presence}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          sperm_presence: e || null,
                        });
                      }}
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                        { value: "--", label: "--" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Additional Measures"
                    name="additional_measures"
                    className="custom_select"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: '',
                  //   },
                  // ]}
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
                      name="additional_measures"
                      mode="multiple"
                      maxTagCount="responsive"
                      value={commanDetail?.additional_measures}
                      onChange={(e) => {
                        setCommanDetail({
                          ...commanDetail,
                          additional_measures: e || null,
                        });
                      }}
                      options={additionalMeasuresOption}
                      maxTagPlaceholder={(additionalMeasures) => (
                        <Tooltip
                          title={additionalMeasures
                            .map(({ label }) => label)
                            .join(", ")}
                        >
                          <span>Hover Me</span>
                        </Tooltip>
                      )}
                    />
                  </Form.Item>
                </li>
                {commanDetail?.additional_measures?.includes("PGT-A") ? (
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Diagnosis of PGT "
                      name="diagnosis_of_pgt"
                      className="custom_select"
                      rules={[
                        {
                          required: commanDetail?.additional_measures?.includes(
                            "PGT-A"
                          )
                            ? true
                            : false,
                          message: "",
                        },
                      ]}
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
                        name="diagnosis_of_pgt"
                        value={commanDetail?.diagnosis_of_pgt}
                        onChange={(e) => {
                          setCommanDetail({
                            ...commanDetail,
                            diagnosis_of_pgt: e || null,
                          });
                        }}
                        options={pgtsOption}
                        className="mb24"
                      />
                    </Form.Item>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Notes</h3>
              <div>
                <Form.Item name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    placeholder="Notes"
                    value={commanDetail?.notes}
                    onChange={(e) => {
                      setCommanDetail({
                        ...commanDetail,
                        notes: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {lastIVFid !== "new" && Object.keys(IvfFlowsheetList)?.length > 0
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
            <Button className="btn_gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={Object.keys(selectedPatient)?.length === 0}
              onClick={printIVFData}
              className="btn_print mx-3"
            >
              Print
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
