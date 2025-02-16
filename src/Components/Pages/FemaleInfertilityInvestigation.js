import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Spin
} from "antd";
import { Table } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  createFemaleInfertility,
  editFemaleInfertility,
  getFemaleInfertility,
  setFemaleInfertilityDetails,
  setFemaleInfertilityUpdated
} from "redux/reducers/FemaleInfertility/FemaleInfertility.slice";
import { useLocation } from "react-router-dom";
import {
  getAttendingDrList,
  setSelectedPatient
} from "redux/reducers/common.slice";
import EditIcon from "../../Img/edit.svg";
import TranshIcon from "../../Img/trash.svg";
import CancelIcon from "../../Img/cancel.svg";
import {
  clearData,
  getGlobalSearch
} from "redux/reducers/SearchPanel/globalSearch.slice";
import { getAuthToken } from "Helper/AuthTokenHelper";
import { toast } from "react-toastify";
import {
  VDRLOptions,
  bloodGroupOptions,
  endometriosisOption,
  fallopianTubeOption,
  findingsOption,
  hBsAgOptions,
  hcvOptions,
  hivOptions,
  hysteroscopyOption,
  leftOvariesOption,
  ovariesOption,
  patencyofFallopianTubeOption,
  reportDoneByOptions,
  rightOvariesOption,
  tbpcrOption,
  tubesOption,
  tvsUterusOption,
  uterusOption
} from "utils/FieldValues";
import TextArea from "antd/es/input/TextArea";
export default function FemaleInfertilityInvestigation() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const inputValidation = /^[0-9\-.]+$/;
  let UserData = getAuthToken();
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const {
    femaleInfertilityDetails,
    femaleInfertilityLoading,
    femaleInfertilityUpdate
  } = useSelector(({ femaleInfertility }) => femaleInfertility);
  const { selectedPatient, attendingDrList } = useSelector(
    ({ common }) => common
  );
  const [isEditObj, setIsEditObj] = useState({});
  const [doctorList, setDoctorList] = useState([]);
  const [data, setData] = useState([]);
  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: "",
  //   patient_name: "",
  //   partner_name: "",
  // });

  const [details, setDetails] = useState({
    // attending_dr_id: null,
    blood_group: null,
    hiv: null,
    hbsag: null,
    vdrl: null,
    tsh: "",
    prolactin: "",
    rbs: "",
    fsh: "",
    lh: "",
    e2: "",
    amh: "",
    ama: "",
    hcv: null,
    ata: "",
    s_create: "",
    progesterone: "",
    ha1ac: "",
    nk_cell_count: "",
    aca: null,
    la: null,
    ana: null,
    apla: null,
    hb_electro_phoresis: "",
    torch: "",
    karyotype: "",
    era_test: "",
    hysteroscopy: null,
    hysteroscopy_other: null,
    findings: null,
    tbpcr_operative_procedure: null,
    report_done_by_operative_procedure: null,
    report_done_by_operative_procedure_other: null,
    date_operative_procedure: null,
    tvs_uterus: null,
    right_ovaries_other: null,
    left_ovaries_other: null,
    tvs_uterus_other: null,
    right_ovaries: null,
    left_ovaries: null,
    patency_of_the_fallopian_tube_right: null,
    patency_of_the_fallopian_tube_left: null,
    fallopian_tube_right: null,
    fallopian_tube_left: null,
    hsg_uterus: null,
    date_hsg: null,
    afc: "",
    era: null,
    era_hours: "",
    notes: ""
  });

  const [redIndicator, setRedIndicator] = useState([]);
  const [laparoscopy, setLaparoscopy] = useState({
    tubes: null,
    ovaries: null,
    tbpcr: null,
    tbpcr_result: null,
    endometriosis: null,
    // report_done_by: null,
    laparoscopy_report_done_by: null,
    laparoscopy_report_done_by_other: null,
    date: null,
    note: ""
  });

  const InfertilityInvestigationModule = useMemo(() => {
    return (
      moduleList.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);

  const isAddEditDisable = useMemo(() => {
    const {
      tubes,
      ovaries,
      tbpcr,
      endometriosis,
      tbpcr_result,
      // report_done_by,
      laparoscopy_report_done_by,
      laparoscopy_report_done_by_other,
      date
    } = laparoscopy;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
        tubes &&
        ovaries &&
        tbpcr &&
        tbpcr === "Yes"
        ? tbpcr_result && endometriosis && laparoscopy_report_done_by && date
        : endometriosis && laparoscopy_report_done_by && date
    ) {
      return false;
    }
    return true;
  }, [selectedPatient, laparoscopy]);

  const clearinfertilityData = useCallback(() => {
    setLaparoscopy({
      tubes: null,
      ovaries: null,
      tbpcr: null,
      tbpcr_result: null,
      endometriosis: null,
      // report_done_by: null,
      laparoscopy_report_done_by: null,
      laparoscopy_report_done_by_other: null,
      date: null,
      note: ""
    });
    form.setFieldsValue({
      tubes: null,
      ovaries: null,
      tbpcr: null,
      tbpcr_result: null,
      endometriosis: null,
      // report_done_by: null,
      laparoscopy_report_done_by: null,
      laparoscopy_report_done_by_other: null,
      date: null,
      note: ""
    });
  }, [form]);

  const onFinish = useCallback(
    (values) => {
      let laparoscopyData =
        data?.map((item) => {
          delete item.id;
          return item;
        }) || [];
      const obj = {
        ...femaleInfertilityDetails,
        // attending_dr_id: values.attending_dr_id ? values.attending_dr_id : null,
        blood_group: values.blood_group ? values.blood_group : null,
        hiv: values.hiv ? values.hiv : null,
        hbsag: values.hbsag ? values.hbsag : null,
        vdrl: values.vdrl ? values.vdrl : null,
        tsh: values.tsh ? values.tsh : "",
        prolactin: values.prolactin ? values.prolactin : "",
        rbs: values.rbs ? values.rbs : "",
        fsh: values.fsh ? values.fsh : "",
        lh: values.lh ? values.lh : "",
        e2: values.e2 ? values.e2 : "",
        amh: values.amh ? values.amh : "",
        ama: values.ama ? values.ama : "",
        hcv: values.hcv ? values.hcv : null,
        ata: values.ata ? values.ata : "",
        s_create: values.s_create ? values.s_create : "",
        progesterone: values.progesterone ? values.progesterone : "",
        ha1ac: values.ha1ac ? values.ha1ac : "",
        nk_cell_count: values.nk_cell_count ? values.nk_cell_count : "",
        aca: values.aca ? values.aca : null,
        la: values.la ? values.la : null,
        ana: values.ana ? values.ana : null,
        apla: values.apla ? values.apla : null,
        hb_electro_phoresis: values.hb_electro_phoresis
          ? values.hb_electro_phoresis
          : "",
        torch: values.torch ? values.torch : "",
        karyotype: values.karyotype ? values.karyotype : "",
        era_test: values.era_test ? values.era_test : "",
        hysteroscopy: values.hysteroscopy ? values.hysteroscopy : null,
        hysteroscopy_other: values.hysteroscopy_other
          ? values.hysteroscopy_other
          : null,
        findings: values.findings ? values.findings : null,
        tbpcr_operative_procedure: values.tbpcr_operative_procedure
          ? values.tbpcr_operative_procedure
          : null,
        report_done_by_operative_procedure:
          values.report_done_by_operative_procedure
            ? values.report_done_by_operative_procedure
            : null,
        report_done_by_operative_procedure_other:
          values?.report_done_by_operative_procedure_other
            ? values.report_done_by_operative_procedure_other
            : null,
        date_operative_procedure: values.date_operative_procedure
          ? values.date_operative_procedure
          : null,
        tvs_uterus: values.tvs_uterus ? values.tvs_uterus : null,
        right_ovaries_other: values.right_ovaries_other
          ? values.right_ovaries_other
          : null,
        left_ovaries_other: values.left_ovaries_other
          ? values.left_ovaries_other
          : null,
        tvs_uterus_other: values.tvs_uterus_other
          ? values.tvs_uterus_other
          : null,
        right_ovaries: values.right_ovaries ? values.right_ovaries : null,
        left_ovaries: values.left_ovaries ? values.left_ovaries : null,
        patency_of_the_fallopian_tube_right:
          values.patency_of_the_fallopian_tube_right
            ? values.patency_of_the_fallopian_tube_right
            : null,
        patency_of_the_fallopian_tube_left:
          values.patency_of_the_fallopian_tube_left
            ? values.patency_of_the_fallopian_tube_left
            : null,
        fallopian_tube_right: values.fallopian_tube_right
          ? values.fallopian_tube_right
          : null,
        fallopian_tube_left: values.fallopian_tube_left
          ? values.fallopian_tube_left
          : null,
        hsg_uterus: values.hsg_uterus ? values.hsg_uterus : null,
        date_hsg: values.date_hsg ? values.date_hsg : null,
        afc: values.afc ? values.afc : "",
        era: values.era ? values.era : null,
        era_hours: values.era_hours ? values.era_hours : "",
        laparoscopy: laparoscopyData
      };
      if (Object.keys(femaleInfertilityDetails)?.length > 0) {
        dispatch(
          editFemaleInfertility({
            location_id: selectedLocation,
            id: femaleInfertilityDetails?._id,
            moduleId: InfertilityInvestigationModule?._id,
            payload: obj
          })
        );
      } else {
        dispatch(
          createFemaleInfertility({
            location_id: selectedLocation,
            patient_reg_id: selectedPatient?._id,
            moduleId: InfertilityInvestigationModule?._id,
            payload: obj
          })
        );
      }
    },
    [
      dispatch,
      data,
      selectedPatient,
      InfertilityInvestigationModule,
      selectedLocation,
      femaleInfertilityDetails
    ]
  );

  const onChangeLaparoscopy = useCallback((name, values) => {
    const value =
      name === "date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setLaparoscopy((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const clearFemaleInfertilityForm = useCallback(() => {
    // setPatientDetails({
    //   patient_id: "",
    //   patient_name: "",
    //   partner_name: "",
    // });
    setDetails({
      // attending_dr_id: null,
      blood_group: null,
      hiv: null,
      hbsag: null,
      vdrl: null,
      tsh: "",
      prolactin: "",
      rbs: "",
      fsh: "",
      lh: "",
      e2: "",
      amh: "",
      ama: "",
      hcv: null,
      ata: "",
      s_create: "",
      progesterone: "",
      ha1ac: "",
      nk_cell_count: "",
      aca: null,
      la: null,
      ana: null,
      apla: null,
      hb_electro_phoresis: "",
      torch: "",
      karyotype: "",
      era_test: "",
      hysteroscopy: null,
      hysteroscopy_other: null,
      findings: null,
      tbpcr_operative_procedure: null,
      report_done_by_operative_procedure: null,
      report_done_by_operative_procedure_other: null,
      date_operative_procedure: null,
      tvs_uterus: null,
      right_ovaries_other: null,
      left_ovaries_other: null,
      tvs_uterus_other: null,
      right_ovaries: null,
      left_ovaries: null,
      patency_of_the_fallopian_tube_right: null,
      patency_of_the_fallopian_tube_left: null,
      fallopian_tube_right: null,
      fallopian_tube_left: null,
      hsg_uterus: null,
      date_hsg: null,
      afc: "",
      era: null,
      era_hours: "",
      notes: ""
    });
    setLaparoscopy({
      tubes: null,
      ovaries: null,
      tbpcr: null,
      tbpcr_result: null,
      endometriosis: null,
      // report_done_by: null,
      laparoscopy_report_done_by: null,
      laparoscopy_report_done_by_other: null,
      date: null
    });
    form.setFieldsValue({
      // patient_id: "",
      // patient_name: "",
      // partner_name: "",
      // attending_dr_id: null,
      blood_group: null,
      hiv: null,
      hbsag: null,
      vdrl: null,
      tsh: "",
      prolactin: "",
      rbs: "",
      fsh: "",
      lh: "",
      e2: "",
      amh: "",
      ama: "",
      hcv: null,
      ata: "",
      s_create: "",
      progesterone: "",
      ha1ac: "",
      nk_cell_count: "",
      aca: null,
      la: null,
      ana: null,
      apla: null,
      hb_electro_phoresis: "",
      torch: "",
      karyotype: "",
      era_test: "",
      hysteroscopy: null,
      hysteroscopy_other: null,
      findings: null,
      tbpcr_operative_procedure: null,
      report_done_by_operative_procedure: null,
      report_done_by_operative_procedure_other: null,
      date_operative_procedure: null,
      tvs_uterus: null,
      right_ovaries_other: null,
      left_ovaries_other: null,
      tvs_uterus_other: null,
      right_ovaries: null,
      left_ovaries: null,
      patency_of_the_fallopian_tube_right: null,
      patency_of_the_fallopian_tube_left: null,
      fallopian_tube_right: null,
      fallopian_tube_left: null,
      hsg_uterus: null,
      date_hsg: null,
      tubes: null,
      ovaries: null,
      tbpcr: null,
      tbpcr_result: null,
      endometriosis: null,
      // report_done_by: null,
      laparoscopy_report_done_by: null,
      laparoscopy_report_done_by_other: null,
      date: null,
      afc: "",
      era: null,
      era_hours: "",
      notes: ""
    });
  }, [form]);

  const handleSubmit = useCallback(() => {
    const {
      tubes,
      ovaries,
      tbpcr,
      tbpcr_result,
      endometriosis,
      // report_done_by,
      laparoscopy_report_done_by,
      laparoscopy_report_done_by_other,
      date,
      note
    } = laparoscopy;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
        tubes &&
        ovaries &&
        tbpcr &&
        tbpcr === "Yes"
        ? tbpcr_result && endometriosis
        // && laparoscopy_report_done_by && date
        : endometriosis
      // && laparoscopy_report_done_by && date
    ) {
      if (Object.keys(isEditObj)?.length > 0) {
        let editedData = [...data] || [];
        editedData =
          editedData?.map((item) => {
            if (item.id === isEditObj.id) {
              return {
                ...item,
                date: laparoscopy?.date ? moment(laparoscopy.date, "DD/MM/YYYY").format(
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ) : null,
                tubes: tubes,
                ovaries: ovaries,
                tbpcr: tbpcr,
                tbpcr_result: tbpcr === "Yes" ? tbpcr_result : null,
                endometriosis: endometriosis,
                // report_done_by: report_done_by,
                laparoscopy_report_done_by: laparoscopy_report_done_by,
                laparoscopy_report_done_by_other:
                  laparoscopy_report_done_by_other,
                note: note
              };
            }
            return item;
          }) || editedData;
        setData(editedData);
        toast.success("Update Succesfully.");
      } else {
        setData((prev) => [
          ...prev,
          {
            ...laparoscopy,
            date: laparoscopy?.date ? moment(laparoscopy.date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ) : null,
            id: Math.random().toString().substring(2, 9),
            isDelete: true
          }
        ]);
        toast.success("Add Succesfully.");
      }
      setIsEditObj({});
      clearinfertilityData();
    } else {
      toast.error("Please Fill Laparoscopy Fields.");
    }
  }, [clearinfertilityData, selectedPatient, isEditObj, laparoscopy, data]);

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    clearFemaleInfertilityForm();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };

  const onDeleteHandler = useCallback(
    (record) => {
      let treatMentData = [...data] || [];
      treatMentData = treatMentData.filter((item) => item.id !== record.id);
      setData(treatMentData);
      toast.success("Delete Succesfully.");
    },
    [data, setData]
  );

  useEffect(() => {
    dispatch(getAttendingDrList());
  }, [dispatch]);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient).length > 0) {
  //     const { patient_id, patient_full_name, partner_full_name } =
  //       selectedPatient;

  //     setPatientDetails((prev) => ({
  //       ...prev,
  //       patient_id: patient_id || "",
  //       patient_name: patient_full_name || "",
  //       partner_name: partner_full_name || "",
  //     }));

  //     form.setFieldsValue({
  //       patient_id: patient_id || "",
  //       patient_name: patient_full_name || "",
  //       partner_name: partner_full_name || "",
  //     });
  //   }
  //   return () => {
  //     clearFemaleInfertilityForm();
  //     dispatch(setFemaleInfertilityDetails({}));
  //   };
  // }, [dispatch, form,]);

  useEffect(() => {
    if (InfertilityInvestigationModule?._id && selectedPatient?._id) {
      dispatch(
        getFemaleInfertility({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          moduleId: InfertilityInvestigationModule?._id
        })
      );
    }
    return () => {
      clearFemaleInfertilityForm();
      dispatch(setFemaleInfertilityDetails({}));
    };
  }, [selectedPatient, selectedPatient, clearFemaleInfertilityForm]);

  const getNewSelectedPatientData = useCallback(async () => {
    if (
      femaleInfertilityUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(femaleInfertilityDetails)?.length === 0
    ) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [
    dispatch,
    selectedLocation,
    femaleInfertilityUpdate,
    femaleInfertilityDetails,
    selectedPatient
  ]);

  useEffect(() => {
    if (femaleInfertilityUpdate) {
      setIsEditObj({});
      clearinfertilityData();
      dispatch(
        getFemaleInfertility({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          moduleId: InfertilityInvestigationModule?._id
        })
      );
      getNewSelectedPatientData();
      dispatch(setFemaleInfertilityUpdated(false));
    }
  }, [
    dispatch,
    InfertilityInvestigationModule._id,
    clearinfertilityData,
    femaleInfertilityUpdate,

    selectedPatient,
    selectedLocation
  ]);

  useEffect(() => {
    if (Object.keys(femaleInfertilityDetails)?.length > 0) {
      const mapDetails = (field) =>
        femaleInfertilityDetails[field]
          ? femaleInfertilityDetails[field]
          : field.endsWith("date")
            ? dayjs(
              moment(femaleInfertilityDetails[field]).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null;

      const detailsFields = [
        // "attending_dr_id",
        "blood_group",
        "hiv",
        "hbsag",
        "vdrl",
        "tsh",
        "prolactin",
        "rbs",
        "fsh",
        "lh",
        "e2",
        "amh",
        "ama",
        "hcv",
        "ata",
        "s_create",
        "progesterone",
        "ha1ac",
        "nk_cell_count",
        "aca",
        "la",
        "ana",
        "apla",
        "hb_electro_phoresis",
        "torch",
        "karyotype",
        "era_test",
        "hysteroscopy",
        "hysteroscopy_other",
        "findings",
        "tbpcr_operative_procedure",
        "report_done_by_operative_procedure",
        "report_done_by_operative_procedure_other",
        "date_operative_procedure",
        "tvs_uterus",
        "tvs_uterus_other",
        "right_ovaries_other",
        "left_ovaries_other",
        "right_ovaries",
        "left_ovaries",
        "patency_of_the_fallopian_tube_right",
        "patency_of_the_fallopian_tube_left",
        "fallopian_tube_right",
        "fallopian_tube_left",
        "hsg_uterus",
        "date_hsg",
        "afc",
        "era",
        "era_hours"
      ];

      const updatedDetails = detailsFields.reduce((acc, field) => {
        acc[field] = mapDetails(field);
        return acc;
      }, {});

      setDetails(updatedDetails);
      form.setFieldsValue(updatedDetails);
      clearinfertilityData();
    } else {
      clearinfertilityData();
    }
  }, [clearinfertilityData, femaleInfertilityDetails, form]);

  // useEffect(() => {
  //   getNewSelectedPatientData();
  // }, []);

  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item?._id,
          label: item?.user_name
        }))
      );
    }
  }, [dispatch, attendingDrList]);

  useEffect(() => {
    if (Object.keys(femaleInfertilityDetails)?.length > 0) {
      const withIdlaparoscopyData =
        femaleInfertilityDetails.laparoscopy?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false
          };
        }) || [];
      setData(withIdlaparoscopyData);
      setDetails({
        // attending_dr_id: femaleInfertilityDetails.attending_dr_id
        //   ? femaleInfertilityDetails?.attending_dr_id
        //   : null,
        blood_group: femaleInfertilityDetails.blood_group
          ? femaleInfertilityDetails?.blood_group
          : null,
        hiv: femaleInfertilityDetails.hiv
          ? femaleInfertilityDetails?.hiv
          : null,
        hbsag: femaleInfertilityDetails.hbsag
          ? femaleInfertilityDetails?.hbsag
          : null,
        vdrl: femaleInfertilityDetails.vdrl
          ? femaleInfertilityDetails?.vdrl
          : null,
        tsh: femaleInfertilityDetails.tsh ? femaleInfertilityDetails?.tsh : "",
        prolactin: femaleInfertilityDetails.prolactin
          ? femaleInfertilityDetails?.prolactin
          : "",
        rbs: femaleInfertilityDetails.rbs ? femaleInfertilityDetails?.rbs : "",
        fsh: femaleInfertilityDetails.fsh ? femaleInfertilityDetails?.fsh : "",
        lh: femaleInfertilityDetails.lh ? femaleInfertilityDetails?.lh : "",
        e2: femaleInfertilityDetails.e2 ? femaleInfertilityDetails?.e2 : "",
        amh: femaleInfertilityDetails.amh ? femaleInfertilityDetails?.amh : "",
        ama: femaleInfertilityDetails.ama ? femaleInfertilityDetails?.ama : "",
        hcv: femaleInfertilityDetails.hcv
          ? femaleInfertilityDetails?.hcv
          : null,
        ata: femaleInfertilityDetails.ata ? femaleInfertilityDetails?.ata : "",
        s_create: femaleInfertilityDetails.s_create
          ? femaleInfertilityDetails?.s_create
          : "",
        progesterone: femaleInfertilityDetails.progesterone
          ? femaleInfertilityDetails?.progesterone
          : "",
        ha1ac: femaleInfertilityDetails.ha1ac
          ? femaleInfertilityDetails?.ha1ac
          : "",
        nk_cell_count: femaleInfertilityDetails.nk_cell_count
          ? femaleInfertilityDetails?.nk_cell_count
          : "",
        aca: femaleInfertilityDetails.aca
          ? femaleInfertilityDetails?.aca
          : null,
        la: femaleInfertilityDetails.la ? femaleInfertilityDetails?.la : null,
        ana: femaleInfertilityDetails.ana
          ? femaleInfertilityDetails?.ana
          : null,
        apla: femaleInfertilityDetails.apla
          ? femaleInfertilityDetails?.apla
          : null,
        hb_electro_phoresis: femaleInfertilityDetails.hb_electro_phoresis
          ? femaleInfertilityDetails?.hb_electro_phoresis
          : "",
        torch: femaleInfertilityDetails.torch
          ? femaleInfertilityDetails?.torch
          : "",
        karyotype: femaleInfertilityDetails.karyotype
          ? femaleInfertilityDetails?.karyotype
          : null,
        era_test: femaleInfertilityDetails.era_test
          ? femaleInfertilityDetails?.era_test
          : null,
        hysteroscopy: femaleInfertilityDetails.hysteroscopy
          ? femaleInfertilityDetails?.hysteroscopy
          : null,
        hysteroscopy_other: femaleInfertilityDetails.hysteroscopy_other
          ? femaleInfertilityDetails?.hysteroscopy_other
          : "",
        findings: femaleInfertilityDetails.findings
          ? femaleInfertilityDetails?.findings
          : null,
        tbpcr_operative_procedure:
          femaleInfertilityDetails.tbpcr_operative_procedure
            ? femaleInfertilityDetails?.tbpcr_operative_procedure
            : null,
        report_done_by_operative_procedure:
          femaleInfertilityDetails.report_done_by_operative_procedure
            ? femaleInfertilityDetails?.report_done_by_operative_procedure
            : null,
        report_done_by_operative_procedure_other:
          femaleInfertilityDetails?.report_done_by_operative_procedure_other
            ? femaleInfertilityDetails?.report_done_by_operative_procedure_other
            : null,
        date_operative_procedure:
          femaleInfertilityDetails.date_operative_procedure
            ? moment(femaleInfertilityDetails.date_operative_procedure).format(
              "DD/MM/YYYY"
            )
            : null,
        tvs_uterus: femaleInfertilityDetails.tvs_uterus
          ? femaleInfertilityDetails?.tvs_uterus
          : null,
        right_ovaries_other: femaleInfertilityDetails.right_ovaries_other
          ? femaleInfertilityDetails?.right_ovaries_other
          : null,
        left_ovaries_other: femaleInfertilityDetails.left_ovaries_other
          ? femaleInfertilityDetails?.left_ovaries_other
          : null,
        tvs_uterus_other: femaleInfertilityDetails.tvs_uterus_other
          ? femaleInfertilityDetails?.tvs_uterus_other
          : null,
        right_ovaries: femaleInfertilityDetails.right_ovaries
          ? femaleInfertilityDetails?.right_ovaries
          : null,
        left_ovaries: femaleInfertilityDetails.left_ovaries
          ? femaleInfertilityDetails?.left_ovaries
          : null,
        patency_of_the_fallopian_tube_right:
          femaleInfertilityDetails.patency_of_the_fallopian_tube_right
            ? femaleInfertilityDetails?.patency_of_the_fallopian_tube_right
            : null,
        patency_of_the_fallopian_tube_left:
          femaleInfertilityDetails.patency_of_the_fallopian_tube_left
            ? femaleInfertilityDetails?.patency_of_the_fallopian_tube_left
            : null,
        fallopian_tube_right: femaleInfertilityDetails.fallopian_tube_right
          ? femaleInfertilityDetails?.fallopian_tube_right
          : null,
        fallopian_tube_left: femaleInfertilityDetails.fallopian_tube_left
          ? femaleInfertilityDetails?.fallopian_tube_left
          : null,
        hsg_uterus: femaleInfertilityDetails?.hsg_uterus
          ? femaleInfertilityDetails?.hsg_uterus
          : null,
        date_hsg: femaleInfertilityDetails?.date_hsg
          ? moment(femaleInfertilityDetails.date_hsg).format("DD/MM/YYYY")
          : null,
        afc: femaleInfertilityDetails.afc ? femaleInfertilityDetails?.afc : "",
        era: femaleInfertilityDetails.era
          ? femaleInfertilityDetails?.era
          : null,
        era_hours: femaleInfertilityDetails.era_hours
          ? femaleInfertilityDetails?.era_hours
          : "",
        notes: femaleInfertilityDetails.notes
          ? femaleInfertilityDetails?.notes
          : ""
      });
      form.setFieldsValue({
        // attending_dr_id: femaleInfertilityDetails.attending_dr_id
        //   ? femaleInfertilityDetails?.attending_dr_id
        //   : null,
        blood_group: femaleInfertilityDetails.blood_group
          ? femaleInfertilityDetails?.blood_group
          : null,
        hiv: femaleInfertilityDetails.hiv
          ? femaleInfertilityDetails?.hiv
          : null,
        hbsag: femaleInfertilityDetails.hbsag
          ? femaleInfertilityDetails?.hbsag
          : null,
        vdrl: femaleInfertilityDetails.vdrl
          ? femaleInfertilityDetails?.vdrl
          : null,
        tsh: femaleInfertilityDetails.tsh ? femaleInfertilityDetails?.tsh : "",
        prolactin: femaleInfertilityDetails.prolactin
          ? femaleInfertilityDetails?.prolactin
          : "",
        rbs: femaleInfertilityDetails.rbs ? femaleInfertilityDetails?.rbs : "",
        fsh: femaleInfertilityDetails.fsh ? femaleInfertilityDetails?.fsh : "",
        lh: femaleInfertilityDetails.lh ? femaleInfertilityDetails?.lh : "",
        e2: femaleInfertilityDetails.e2 ? femaleInfertilityDetails?.e2 : "",
        amh: femaleInfertilityDetails.amh ? femaleInfertilityDetails?.amh : "",
        ama: femaleInfertilityDetails.ama ? femaleInfertilityDetails?.ama : "",
        hcv: femaleInfertilityDetails.hcv
          ? femaleInfertilityDetails?.hcv
          : null,
        ata: femaleInfertilityDetails.ata ? femaleInfertilityDetails?.ata : "",
        s_create: femaleInfertilityDetails.s_create
          ? femaleInfertilityDetails?.s_create
          : "",
        progesterone: femaleInfertilityDetails.progesterone
          ? femaleInfertilityDetails?.progesterone
          : "",
        ha1ac: femaleInfertilityDetails.ha1ac
          ? femaleInfertilityDetails?.ha1ac
          : "",
        nk_cell_count: femaleInfertilityDetails.nk_cell_count
          ? femaleInfertilityDetails?.nk_cell_count
          : "",
        aca: femaleInfertilityDetails.aca
          ? femaleInfertilityDetails?.aca
          : null,
        la: femaleInfertilityDetails.la ? femaleInfertilityDetails?.la : null,
        ana: femaleInfertilityDetails.ana
          ? femaleInfertilityDetails?.ana
          : null,
        apla: femaleInfertilityDetails.apla
          ? femaleInfertilityDetails?.apla
          : null,
        hb_electro_phoresis: femaleInfertilityDetails.hb_electro_phoresis
          ? femaleInfertilityDetails?.hb_electro_phoresis
          : "",
        torch: femaleInfertilityDetails.torch
          ? femaleInfertilityDetails?.torch
          : "",
        karyotype: femaleInfertilityDetails.karyotype
          ? femaleInfertilityDetails?.karyotype
          : null,
        era_test: femaleInfertilityDetails.era_test
          ? femaleInfertilityDetails?.era_test
          : null,
        hysteroscopy: femaleInfertilityDetails.hysteroscopy
          ? femaleInfertilityDetails?.hysteroscopy
          : null,
        hysteroscopy_other: femaleInfertilityDetails.hysteroscopy_other
          ? femaleInfertilityDetails?.hysteroscopy_other
          : "",
        findings: femaleInfertilityDetails.findings
          ? femaleInfertilityDetails?.findings
          : null,
        tbpcr_operative_procedure:
          femaleInfertilityDetails.tbpcr_operative_procedure
            ? femaleInfertilityDetails?.tbpcr_operative_procedure
            : null,
        report_done_by_operative_procedure:
          femaleInfertilityDetails.report_done_by_operative_procedure
            ? femaleInfertilityDetails?.report_done_by_operative_procedure
            : null,
        report_done_by_operative_procedure_other:
          femaleInfertilityDetails?.report_done_by_operative_procedure_other
            ? femaleInfertilityDetails?.report_done_by_operative_procedure_other
            : null,
        date_operative_procedure:
          femaleInfertilityDetails.date_operative_procedure
            ? dayjs(
              moment(
                femaleInfertilityDetails.date_operative_procedure
              ).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
        tvs_uterus: femaleInfertilityDetails.tvs_uterus
          ? femaleInfertilityDetails?.tvs_uterus
          : null,
        right_ovaries_other: femaleInfertilityDetails.right_ovaries_other
          ? femaleInfertilityDetails?.right_ovaries_other
          : null,
        left_ovaries_other: femaleInfertilityDetails.left_ovaries_other
          ? femaleInfertilityDetails?.left_ovaries_other
          : null,
        tvs_uterus_other: femaleInfertilityDetails.tvs_uterus_other
          ? femaleInfertilityDetails?.tvs_uterus_other
          : null,
        right_ovaries: femaleInfertilityDetails.right_ovaries
          ? femaleInfertilityDetails?.right_ovaries
          : null,
        left_ovaries: femaleInfertilityDetails.left_ovaries
          ? femaleInfertilityDetails?.left_ovaries
          : null,
        patency_of_the_fallopian_tube_right:
          femaleInfertilityDetails.patency_of_the_fallopian_tube_right
            ? femaleInfertilityDetails?.patency_of_the_fallopian_tube_right
            : null,
        patency_of_the_fallopian_tube_left:
          femaleInfertilityDetails.patency_of_the_fallopian_tube_left
            ? femaleInfertilityDetails?.patency_of_the_fallopian_tube_left
            : null,
        fallopian_tube_right: femaleInfertilityDetails.fallopian_tube_right
          ? femaleInfertilityDetails?.fallopian_tube_right
          : null,
        fallopian_tube_left: femaleInfertilityDetails.fallopian_tube_left
          ? femaleInfertilityDetails?.fallopian_tube_left
          : null,
        hsg_uterus: femaleInfertilityDetails?.hsg_uterus
          ? femaleInfertilityDetails?.hsg_uterus
          : null,
        date_hsg: femaleInfertilityDetails?.date_hsg
          ? dayjs(
            moment(femaleInfertilityDetails.date_hsg).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        afc: femaleInfertilityDetails.afc ? femaleInfertilityDetails?.afc : "",
        era: femaleInfertilityDetails.era
          ? femaleInfertilityDetails?.era
          : null,
        era_hours: femaleInfertilityDetails.era_hours
          ? femaleInfertilityDetails?.era_hours
          : "",
        notes: femaleInfertilityDetails.notes
          ? femaleInfertilityDetails?.notes
          : ""
      });
      clearinfertilityData();
    } else {
      clearinfertilityData();
      setData([]);
    }
  }, [clearinfertilityData, UserData?.other, femaleInfertilityDetails, form]);

  const columns = [
    {
      title: "Sr. No.",
      key: "sno",
      render: (text, data, index) => index + 1
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : "";
      }
    },
    {
      title: "Tubes",
      dataIndex: "tubes",
      key: "tubes"
    },
    {
      title: "Ovaries",
      dataIndex: "ovaries",
      key: "ovaries"
    },
    {
      title: "TBPCR",
      dataIndex: "tbpcr",
      key: "tbpcr"
    },
    {
      title: "TBPCR Result",
      dataIndex: "tbpcr_result",
      key: "tbpcr_result"
    },
    {
      title: "Endometriosis",
      dataIndex: "endometriosis",
      key: "endometriosis"
    },
    {
      title: "Report Done By",
      // dataIndex: "report_done_by",
      // key: "report_done_by"
      dataIndex: "laparoscopy_report_done_by",
      key: "laparoscopy_report_done_by"
    },
    {
      title: "Report Done By Other",
      dataIndex: "laparoscopy_report_done_by_other",
      key: "laparoscopy_report_done_by_other"
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note"
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 ||
              InfertilityInvestigationModule?.edit ||
              record?.isDelete) && (
                <li>
                  <Button className="btn_transparent">
                    {record?.id === isEditObj?.id ? (
                      <img
                        src={CancelIcon}
                        alt="CancelIcon"
                        className="me-2 edit_img"
                        onClick={() => {
                          clearinfertilityData();
                          setIsEditObj({});
                        }}
                      />
                    ) : (
                      <img
                        src={EditIcon}
                        alt="EditIcon"
                        className="me-2 edit_img"
                        onClick={() => {
                          setLaparoscopy({
                            date: record?.date ? moment(record.date).format("DD/MM/YYYY") : null,
                            tubes: record.tubes,
                            ovaries: record.ovaries,
                            tbpcr: record.tbpcr,
                            tbpcr_result: record.tbpcr_result,
                            endometriosis: record.endometriosis,
                            // report_done_by: record.report_done_by,
                            laparoscopy_report_done_by:
                              record.laparoscopy_report_done_by,
                            laparoscopy_report_done_by_other:
                              record?.laparoscopy_report_done_by_other
                                ? record.laparoscopy_report_done_by_other
                                : null,
                            note: record.note
                          });
                          form.setFieldsValue({
                            date: record?.date ? dayjs(
                              moment(record.date).format("DD/MM/YYYY"),
                              "DD/MM/YYYY"
                            ) : null,
                            tubes: record.tubes,
                            ovaries: record.ovaries,
                            tbpcr: record.tbpcr,
                            tbpcr_result: record.tbpcr_result,
                            endometriosis: record.endometriosis,
                            // report_done_by: record.report_done_by,
                            laparoscopy_report_done_by:
                              record.laparoscopy_report_done_by,
                            laparoscopy_report_done_by_other:
                              record?.laparoscopy_report_done_by_other
                                ? record.laparoscopy_report_done_by_other
                                : null,
                            note: record.note
                          });
                          setIsEditObj(record);
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
                  <Button className="btn_transparent">
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        );
      }
    }
  ];

  const inRange = (name, value, min, max, comparisonType = "") => {
    if (value === undefined || value === null || value === "") {
      return { [name]: false };
    } else if (value < min || value > max) {
      return { [name]: true };
    } else if (comparisonType === "max" && value > max) {
      return { [name]: true };
    } else {
      return { [name]: false };
    }
  };

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {femaleInfertilityLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <Form
          name="basic"
          initialValues={{
            remember: true
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
                    <label>Partner Name :</label>
                    <span>
                      {selectedPatient?.partner_full_name
                        ? selectedPatient?.partner_full_name
                        : ""}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                <li className="w_250 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input
                      name="patient_id"
                      placeholder="Enter Patient ID"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_name">
                    <Input
                      name="patient_name"
                      placeholder="Enter Patient Name"
                      value={patientDetails?.patient_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item label="Partner Name" name="partner_name">
                    <Input
                      name="partner_name"
                      placeholder="Enter Partner Name"
                      value={patientDetails?.partner_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Attending Dr."
                    name="attending_dr_id"
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
                        (option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                      }
                      placeholder="Dr. Kishor Nadkarni"
                      value={details?.attending_dr_id}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          attending_dr_id: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div> */}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Female Details</h3>
              <ul className="grid_wrapper">
                <li className="w_150 w_xs_50">
                  {/* <Form.Item
                    label="Blood Group"
                    name="blood_group"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  > */}
                  {/* <Select
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
                      name="blood_group"
                      value={details?.blood_group}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          blood_group: value || null
                        });
                      }}
                      options={bloodGroupOptions}
                    /> */}

                  <Form.Item label="Blood Group">
                    <Input
                      placeholder="Enter Blood Group"
                      value={selectedPatient?.patient_blood_group || ""}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="HIV"
                    name="hiv"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      name="hiv"
                      value={details?.hiv}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          hiv: value || null
                        });
                      }}
                      options={hivOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="HBsAg"
                    name="hbsag"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      name="hbsag"
                      value={details?.hbsag}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          hbsag: value || null
                        });
                      }}
                      options={hBsAgOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="VDRL"
                    name="vdrl"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      name="vdrl"
                      value={details?.vdrl}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          vdrl: value || null
                        });
                      }}
                      options={VDRLOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="TSH (MicroU/ml)"
                    name="tsh"
                    className={redIndicator.tsh ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="1.440"
                      name="tsh"
                      value={details?.tsh}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0.45,
                          4.5
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          tsh: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="Prolactin (ng/ml)"
                    name="prolactin"
                    className={
                      redIndicator?.prolactin === true ? "bg_light_red" : ""
                    }
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="9.65"
                      name="prolactin"
                      value={details?.prolactin}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          4.79,
                          23.3
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          prolactin: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50">
                  <Form.Item
                    label="RBS (mg/dl)"
                    name="rbs"
                    className={redIndicator.rbs ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="rbs"
                      value={details?.rbs}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          70,
                          140
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          rbs: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="FSH (miU/ml)"
                    name="fsh"
                    className={redIndicator.fsh ? "bg_light_red" : ""}
                    rules={[
                      {
                        // required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="7.27"
                      name="fsh"
                      value={details?.fsh}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          1.4,
                          9.9
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          fsh: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="LH (miU/ml)"
                    name="lh"
                    className={redIndicator.lh ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="15.8"
                      name="lh"
                      value={details?.lh}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          1.7,
                          15
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          lh: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="E2 (miU/ml)"
                    name="e2"
                    className={redIndicator.e2 ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="132"
                      name="e2"
                      value={details?.e2}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          21,
                          251
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          e2: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="AMH (ng/ml)"
                    name="amh"
                    className={redIndicator.amh ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="2.01"
                      name="amh"
                      value={details?.amh}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0.9,
                          9.5
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          amh: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="AMA (IU/ml)"
                    name="ama"
                    className={redIndicator.ama ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="0.45"
                      name="ama"
                      value={details?.ama}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0,
                          5.61,
                          "max"
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          ama: e.target.value || ''
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  {/* <Form.Item
                    label="HCV"
                    name="hcv"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter HCV"
                      name="hcv"
                      value={details?.hcv}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          hcv: e.target.value,
                        });
                      }}
                    />
                  </Form.Item> */}

                  <Form.Item
                    label="HCV"
                    name="hcv"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      name="hcv"
                      value={details.hcv}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          hcv: e || null
                        });
                      }}
                      options={hcvOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="ATA (IU/ml)"
                    name="ata"
                    className={redIndicator.ata ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="0.95"
                      name="ata"
                      value={details?.ata}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0,
                          4.11,
                          "max"
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          ata: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="S.Creat (mg%)"
                    name="s_create"
                    className={redIndicator.s_create ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="s_create"
                      value={details?.s_create}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0.5,
                          0.9
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          s_create: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Progesterone (ng/ml)"
                    name="progesterone"
                    className={redIndicator.progesterone ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="progesterone"
                      value={details?.progesterone}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          1.83,
                          23.9
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          progesterone: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="HB1AC (mg%)"
                    name="ha1ac"
                    className={redIndicator.ha1ac ? "bg_light_red" : ""}
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="5.50"
                      name="ha1ac"
                      value={details?.ha1ac}
                      onChange={(e) => {
                        const redIndicatorUpdate = inRange(
                          e.target.name,
                          e.target.value,
                          0,
                          5.6,
                          "max"
                        );
                        setRedIndicator((prev) => ({
                          ...prev,
                          ...redIndicatorUpdate
                        }));
                        setDetails({
                          ...details,
                          ha1ac: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="NK Cell Count"
                    name="nk_cell_count"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="nk_cell_count"
                      value={details?.nk_cell_count}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          nk_cell_count: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="ACA"
                    name="aca"
                    className="custom_select"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="aca"
                      value={details?.aca}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          aca: value || null
                        });
                      }}
                      options={[
                        { value: "Positive", label: "Positive" },
                        { value: "Negative", label: "Negative" },
                        { value: "Not Done", label: "Not Done" }
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="LA"
                    name="la"
                    className="custom_select"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="la"
                      value={details?.la}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          la: value || null
                        });
                      }}
                      options={[
                        { value: "Absent", label: "Absent" },
                        { value: "Present", label: "Present" },
                        { value: "Not Done", label: "Not Done" }
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="ANA"
                    name="ana"
                    className="custom_select"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="ana"
                      value={details?.ana}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          ana: value || null
                        });
                      }}
                      options={[
                        { value: "Positive", label: "Positive" },
                        { value: "Negative", label: "Negative" },
                        { value: "Not Done", label: "Not Done" }
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="APLA"
                    name="apla"
                    className="custom_select"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="apla"
                      value={details?.apla}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          apla: value || null
                        });
                      }}
                      options={[
                        { value: "Positive", label: "Positive" },
                        { value: "Negative", label: "Negative" },
                        { value: "Not Done", label: "Not Done" }
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="HB Electro Phoresis"
                    name="hb_electro_phoresis"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="hb_electro_phoresis"
                      value={details?.hb_electro_phoresis}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          hb_electro_phoresis: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Torch"
                    name="torch"
                    rules={[
                      {
                        required: selectedPatient?.type_of_patient !== 4 ? true : false,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="Not Done"
                      name="torch"
                      value={details?.torch}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          torch: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Karyotype"
                    name="karyotype"
                    rules={[
                      {
                        required:
                          selectedPatient?.type_of_patient !== 4 && selectedPatient?.type_of_patient !== 5,
                        message: ""
                      }
                    ]}
                  >
                    <Input
                      placeholder="46xx"
                      name="karyotype"
                      value={details?.karyotype}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          karyotype: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="ERA Test" name="era_test">
                    <Input
                      placeholder="ERA Test"
                      name="era_test"
                      value={details?.era_test}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          era_test: e.target.value
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Operative Procedure</h3>
              <ul className="grid_wrapper">
                {selectedPatient?.type_of_patient !== 4 && (
                  <li className="w_190 w_xs_50">
                    <Form.Item
                      label="Hysteroscopy"
                      name="hysteroscopy"
                      className="custom_select"
                      rules={[
                        {
                          required: true,
                          message: ""
                        }
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
                        // filterSort={(optionA, optionB) =>
                        //   optionA.label
                        //     .toLowerCase()
                        //     .localeCompare(optionB.label.toLowerCase())
                        // }
                        placeholder="Select"
                        name="hysteroscopy"
                        value={details?.hysteroscopy}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            hysteroscopy: value || null
                          });
                        }}
                        options={hysteroscopyOption}
                      />
                    </Form.Item>
                  </li>
                )}
                {details?.hysteroscopy === "Others" && (
                  <li>
                    <Form.Item
                      label="Hysteroscopy Other"
                      name="hysteroscopy_other"
                    >
                      <Input
                        placeholder="Enter Hysteroscopy Other"
                        name="hysteroscopy_other"
                        value={details?.hysteroscopy_other}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            hysteroscopy_other: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_200 w_xs_50">
                  <Form.Item
                    label="Findings"
                    name="findings"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      name="findings"
                      value={details?.findings}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          findings: value || null
                        });
                      }}
                      options={findingsOption}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item
                    label="TBPCR"
                    name="tbpcr_operative_procedure"
                    className="custom_select"
                    rules={[
                      {
                        //required: true,
                        message: ""
                      }
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
                      name="tbpcr_operative_procedure"
                      value={details?.tbpcr_operative_procedure}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          tbpcr_operative_procedure: value || null
                        });
                      }}
                      options={tbpcrOption}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_50">
                  <Form.Item
                    label="Report Done By"
                    name="report_done_by_operative_procedure"
                    className="custom_select"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: ""
                  //   }
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
                      name="report_done_by_operative_procedure"
                      value={details?.report_done_by_operative_procedure}
                      onChange={(e) =>
                        setDetails({
                          ...details,
                          report_done_by_operative_procedure: e || null
                        })
                      }
                      // options={[
                      //   { value: "--", label: "--" },
                      //   // {
                      //   //   value: "Shraddha Mandaviya",
                      //   //   label: "Shraddha Mandaviya"
                      //   // },
                      //   // { value: "Dhruti Bhatt", label: "Dhruti Bhatt" },
                      //   // { value: "Meha Desai", label: "Meha Desai" },
                      //   // { value: "Priyanka Rajput", label: "Priyanka Rajput" },
                      //   // { value: "Sapna Trada", label: "Sapna Trada" }
                      //   {
                      //     value: "Dr. Shubhra Tripathi",
                      //     label: "Dr. Shubhra Tripathi"
                      //   },
                      //   {
                      //     value: "Dr. Pooja Nadkarni",
                      //     label: "Dr. Pooja Nadkarni"
                      //   },
                      //   {
                      //     value: "Dr. Harshil Shah",
                      //     label: "Dr. Harshil Shah"
                      //   },
                      //   {
                      //     value: "Dr. Akshay Nadkarni",
                      //     label: "Dr. Akshay Nadkarni"
                      //   },
                      //   { value: "Dr. Birva Dave", label: "Dr. Birva Dave" },
                      //   {
                      //     value: "Dr. Yuvrajsingh Jadeja",
                      //     label: "Dr. Yuvrajsingh Jadeja"
                      //   },
                      //   {
                      //     value: "Dr. Gopal vekariya",
                      //     label: "Dr. Gopal vekariya"
                      //   },
                      //   {
                      //     value: "Dr. Praful Doshi",
                      //     label: "Dr. Praful Doshi"
                      //   },
                      //   { value: "Dr nimesh patel", label: "Dr nimesh patel" },
                      //   {
                      //     value: "Dr. Gopal Vekariya",
                      //     label: "Dr. Gopal Vekariya"
                      //   },
                      //   {
                      //     value: "Dr jayna unadkat",
                      //     label: "Dr jayna unadkat"
                      //   },
                      //   { value: "Dr swar shah", label: "Dr swar shah" },
                      //   {
                      //     value: "Dr sanjay brahmbhatt",
                      //     label: "Dr sanjay brahmbhatt"
                      //   },
                      //   {
                      //     value: "Dr poornima mathur",
                      //     label: "Dr poornima mathur"
                      //   },
                      //   { value: "Dr Amit kalyani", label: "Dr Amit kalyani" },
                      //   { value: "Other", label: "Other" }
                      // ]}
                      options={reportDoneByOptions}
                    />
                    {/* <Input
                      placeholder="Yes"
                      name="report_done_by_operative_procedure"
                      value={details?.report_done_by_operative_procedure}
                      onChange={(e) => {
                        setDetails({
                          ...details,
                          report_done_by_operative_procedure: e.target.value,
                        });
                      }}
                    /> */}
                  </Form.Item>
                </li>

                {details?.report_done_by_operative_procedure?.toLowerCase() ===
                  "other" && (
                    <li className="w_220 w_xs_50">
                      <Form.Item
                        label="Report Done By Other"
                        name="report_done_by_operative_procedure_other"
                      >
                        <Input
                          placeholder="Report Done By Other"
                          name="report_done_by_operative_procedure_other"
                          value={
                            details?.report_done_by_operative_procedure_other
                          }
                          onChange={(e) => {
                            setDetails({
                              ...details,
                              report_done_by_operative_procedure_other: e.target
                                .value
                                ? e.target.value
                                : null
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  )}
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Date"
                    name="date_operative_procedure"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: ""
                  //   }
                  // ]}
                  >
                    <DatePicker
                      placeholder="08/03/2017"
                      name="date_operative_procedure"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask"
                      }}
                      value={dayjs(
                        details?.date_operative_procedure,
                        dateFormat
                      )}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          date_operative_procedure: value ? moment(
                            new Date(value)
                          ).format("YYYY-MM-DD") : null
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            {selectedPatient?.type_of_patient !== 4 && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">Laparoscopy</h3>
                <ul className="grid_wrapper">
                  <li className="w_220 w_xs_66">
                    <Form.Item
                      label="Tubes"
                      name="tubes"
                      className="custom_select"
                      rules={
                        laparoscopy?.tubes && [
                          {
                            required: true,
                            message: ""
                          }
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
                        // filterSort={(optionA, optionB) =>
                        //   optionA.label
                        //     .toLowerCase()
                        //     .localeCompare(optionB.label.toLowerCase())
                        // }
                        placeholder="Select"
                        name="tubes"
                        value={laparoscopy?.tubes}
                        onChange={(e) =>
                          onChangeLaparoscopy("tubes", e ? e : null)
                        }
                        options={tubesOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_200 w_xs_50">
                    <Form.Item
                      label="Ovaries"
                      name="ovaries"
                      className="custom_select"
                      rules={
                        laparoscopy?.tubes && [
                          {
                            required: true,
                            message: ""
                          }
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
                        name="ovaries"
                        value={laparoscopy?.ovaries}
                        onChange={(e) =>
                          onChangeLaparoscopy("ovaries", e ? e : null)
                        }
                        options={ovariesOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_170 w_xs_50">
                    <Form.Item
                      label="TBPCR"
                      name="tbpcr"
                      className="custom_select"
                      rules={
                        laparoscopy?.tubes && [
                          {
                            //required: true,
                            message: ""
                          }
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
                        name="tbpcr"
                        value={laparoscopy?.tbpcr}
                        onChange={(e) => {
                          onChangeLaparoscopy("tbpcr", e ? e : null);
                        }}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                          { value: "--", label: "--" }
                        ]}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_190 w_xs_50">
                    <Form.Item
                      label="TBPCR Result"
                      name={laparoscopy?.tbpcr === "Yes" ? "tbpcr_result" : ""}
                      className="custom_select"
                      rules={
                        laparoscopy?.tbpcr === "Yes" && [
                          {
                            // required: true,
                            message: ""
                          }
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
                        name="tbpcr_result"
                        disabled={laparoscopy?.tbpcr !== "Yes"}
                        value={laparoscopy?.tbpcr_result}
                        onChange={(e) =>
                          onChangeLaparoscopy("tbpcr_result", e ? e : null)
                        }
                        options={tbpcrOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_190 w_xs_50">
                    <Form.Item
                      label="Endometriosis"
                      name="endometriosis"
                      className="custom_select"
                      rules={
                        laparoscopy?.tubes && [
                          {
                            required: true,
                            message: ""
                          }
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
                        name="endometriosis"
                        value={laparoscopy?.endometriosis}
                        onChange={(e) =>
                          onChangeLaparoscopy("endometriosis", e ? e : null)
                        }
                        options={endometriosisOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_270 w_xs_100">
                    <Form.Item
                      label="Report Done By"
                      // name="report_done_by"
                      name="laparoscopy_report_done_by"
                      className="custom_select"
                    // rules={
                    //   laparoscopy?.tubes && [
                    //     {
                    //       required: true,
                    //       message: ""
                    //     }
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
                        // filterSort={(optionA, optionB) =>
                        //   optionA.label
                        //     .toLowerCase()
                        //     .localeCompare(optionB.label.toLowerCase())
                        // }
                        placeholder="Select"
                        name="laparoscopy_report_done_by"
                        value={laparoscopy?.laparoscopy_report_done_by}
                        onChange={(e) =>
                          onChangeLaparoscopy(
                            "laparoscopy_report_done_by",
                            e ? e : null
                          )
                        }
                        // options={[
                        //   {
                        //     value: "Shraddha Mandaviya",
                        //     label: "Shraddha Mandaviya"
                        //   },
                        //   { value: "Dhruti Bhatt", label: "Dhruti Bhatt" },
                        //   { value: "Meha Desai", label: "Meha Desai" },
                        //   { value: "Priyanka Rajput", label: "Priyanka Rajput" },
                        //   { value: "Sapna Trada", label: "Sapna Trada" }
                        // ]}
                        options={reportDoneByOptions}
                      />
                    </Form.Item>
                  </li>

                  {laparoscopy?.laparoscopy_report_done_by?.toLowerCase() ===
                    "other" && (
                      <li className="w_220 w_xs_50">
                        <Form.Item
                          label="Report Done By Other"
                          name="laparoscopy_report_done_by_other"
                        >
                          <Input
                            placeholder="Report Done By Other"
                            name="laparoscopy_report_done_by_other"
                            value={laparoscopy?.laparoscopy_report_done_by_other}
                            onChange={(e) => {
                              onChangeLaparoscopy(
                                "laparoscopy_report_done_by_other",
                                e?.target.value ? e?.target.value : null
                              );
                              // setDetails({
                              //   ...details,
                              //   laparoscopy_report_done_by_other: e.target
                              //     .value
                              //     ? e.target.value
                              //     : null
                              // });
                            }}
                          />
                        </Form.Item>
                      </li>
                    )}

                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="Date"
                      name="date"
                    // rules={
                    //   laparoscopy?.tubes && [
                    //     {
                    //       required: true,
                    //       message: ""
                    //     }
                    //   ]
                    // }
                    >
                      <DatePicker
                        placeholder="Select date"
                        value={
                          laparoscopy?.date
                            ? dayjs(laparoscopy?.date, "DD/MM/YYYY")
                            : null
                        }
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask"
                        }}
                        onChange={(value) => onChangeLaparoscopy("date", value)}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_370 w_xs_100">
                    <Form.Item label="Note" name="note">
                      <Input
                        placeholder="Type here"
                        name="note"
                        value={laparoscopy?.note}
                        onChange={(e) =>
                          onChangeLaparoscopy("note", e.target.value)
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_120 w_xs_50 align-self-end">
                    {Object.keys(isEditObj)?.length > 0
                      ? (userType === 1 ||
                        InfertilityInvestigationModule?.edit) && (
                        <Button
                          // disabled={isAddEditDisable}
                          className="btn_primary me-3 py-2 mb24"
                          onClick={handleSubmit}
                        >
                          Edit
                        </Button>
                      )
                      : (userType === 1 ||
                        InfertilityInvestigationModule?.create) && (
                        <Button
                          // disabled={isAddEditDisable}
                          className="btn_primary me-3 py-2 mb24"
                          onClick={handleSubmit}
                        >
                          Add
                        </Button>
                      )}
                  </li>
                </ul>
                <div className="cmn_table_wrap pb-4">
                  <Table columns={columns} dataSource={data} pagination={false} />
                </div>
              </div>
            )}

            <div className="form_info_wrapper filled">
              <h3 className="mb-3">TVS</h3>
              <ul className="grid_wrapper">
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Uterus"
                    name="tvs_uterus"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="tvs_uterus"
                      value={details?.tvs_uterus}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          tvs_uterus: value
                        });
                      }}
                      options={tvsUterusOption}
                    />
                  </Form.Item>
                </li>
                {details?.tvs_uterus === "Other" && (
                  <li>
                    <Form.Item label="Tvs Uterus Other" name="tvs_uterus_other">
                      <Input
                        placeholder="Enter Tvs Uterus Other"
                        name="tvs_uterus_other"
                        value={details?.tvs_uterus_other}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            tvs_uterus_other: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}

                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Right Ovaries"
                    name="right_ovaries"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="right_ovaries"
                      value={details?.right_ovaries}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          right_ovaries: value
                        });
                      }}
                      options={rightOvariesOption}
                    />
                  </Form.Item>
                </li>
                {details?.right_ovaries === "Others" && (
                  <li>
                    <Form.Item
                      label="Right Ovaries Other"
                      name="right_ovaries_other"
                    >
                      <Input
                        placeholder="Enter Right Ovaries Other"
                        name="right_ovaries_other"
                        value={details?.right_ovaries_other}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            right_ovaries_other: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Left Ovaries"
                    name="left_ovaries"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: ""
                      }
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
                      // filterSort={(optionA, optionB) =>
                      //   optionA.label
                      //     .toLowerCase()
                      //     .localeCompare(optionB.label.toLowerCase())
                      // }
                      placeholder="Select"
                      name="left_ovaries"
                      value={details?.left_ovaries}
                      onChange={(value) => {
                        setDetails({
                          ...details,
                          left_ovaries: value,
                          afc: "",
                          era: null,
                          era_hours: ""
                        });
                        form.setFieldsValue({
                          afc: "",
                          era: null,
                          era_hours: ""
                        });
                      }}
                      options={leftOvariesOption}
                    />
                  </Form.Item>
                </li>
                {details?.left_ovaries === "Others" && (
                  <li>
                    <Form.Item
                      label="Left Ovaries Other"
                      name="left_ovaries_other"
                    >
                      <Input
                        placeholder="Enter Left Ovaries Other"
                        name="left_ovaries_other"
                        value={details?.left_ovaries_other}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            left_ovaries_other: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}

                {details?.left_ovaries === "AFC" && (
                  <li className="w_200 w_xs_50">
                    <Form.Item
                      label="AFC"
                      name="afc"
                      rules={[
                        {
                          required: true,
                          message: ""
                        }
                      ]}
                    >
                      <Input
                        name="afc"
                        placeholder="54"
                        value={details?.afc}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            afc: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                {details?.left_ovaries === "ERA" && (
                  <li className="w_190 w_xs_50">
                    <Form.Item
                      label="Era"
                      name="era"
                      className="custom_select"
                      rules={[
                        {
                          required: true,
                          message: ""
                        }
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
                        name="era"
                        value={details?.era}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            era: value,
                            era_hours: ""
                          });
                          form.setFieldsValue({
                            era_hours: ""
                          });
                        }}
                        options={[
                          { label: "Yes", value: "Yes" },
                          { label: "No", value: "No" }
                        ]}
                      />
                    </Form.Item>
                  </li>
                )}
                {details?.era === "Yes" && (
                  <li className="w_200 w_xs_50">
                    <Form.Item
                      label="Era Hours"
                      name="era_hours"
                      rules={[
                        {
                          required: true,
                          message: ""
                        }
                      ]}
                    >
                      <Input
                        name="era_hours"
                        placeholder="45"
                        value={details?.era_hours}
                        onChange={(e) => {
                          setDetails({
                            ...details,
                            era_hours: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
              </ul>
            </div>
            {selectedPatient?.type_of_patient !== 4 && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">HSG</h3>
                <ul className="grid_wrapper">
                  <li className="w_320 w_xs_100">
                    <Form.Item
                      label="Patency of Fallopian Tube (Right)"
                      name="patency_of_the_fallopian_tube_right"
                      className="custom_select"
                      rules={[
                        {
                          //required: true,
                          message: ""
                        }
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
                        name="patency_of_the_fallopian_tube_right"
                        value={details?.patency_of_the_fallopian_tube_right}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            patency_of_the_fallopian_tube_right: value || null
                          });
                        }}
                        options={patencyofFallopianTubeOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_320 w_xs_100">
                    <Form.Item
                      label="Patency of Fallopian Tube (Left)"
                      name="patency_of_the_fallopian_tube_left"
                      className="custom_select"
                      rules={[
                        {
                          //required: true,
                          message: ""
                        }
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
                        name="patency_of_the_fallopian_tube_left"
                        value={details?.patency_of_the_fallopian_tube_left}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            patency_of_the_fallopian_tube_left: value || null
                          });
                        }}
                        options={patencyofFallopianTubeOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_270 w_xs_100">
                    <Form.Item
                      label="Fallopian Tube (Right)"
                      name="fallopian_tube_right"
                      className="custom_select"
                      rules={[
                        {
                          //required: true,
                          message: ""
                        }
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
                        name="fallopian_tube_right"
                        value={details?.fallopian_tube_right}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            fallopian_tube_right: value || null
                          });
                        }}
                        options={fallopianTubeOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_270 w_xs_100">
                    <Form.Item
                      label="Fallopian Tube (Left)"
                      name="fallopian_tube_left"
                      className="custom_select"
                      rules={[
                        {
                          //required: true,
                          message: ""
                        }
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
                        name="fallopian_tube_left"
                        value={details?.fallopian_tube_left}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            fallopian_tube_left: value || null
                          });
                        }}
                        options={fallopianTubeOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Uterus"
                      name="hsg_uterus"
                      className="custom_select"
                      rules={[
                        {
                          //required: true,
                          message: ""
                        }
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
                        name="hsg_uterus"
                        value={details?.hsg_uterus}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            hsg_uterus: value || null
                          });
                        }}
                        options={uterusOption}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="Date"
                      name="date_hsg"
                      rules={
                        (details?.date_hsg || details?.hsg_uterus) && [
                          {
                            required: (details?.hsg_uterus === "--" || details?.hsg_uterus === null) ? false : true,
                            message: ""
                          }
                        ]}
                    >
                      <DatePicker
                        name="date_hsg"
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask"
                        }}
                        value={dayjs(details?.date_hsg, dateFormat)}
                        onChange={(value) => {
                          setDetails({
                            ...details,
                            date_hsg: value ? moment(new Date(value)).format("YYYY-MM-DD") : null,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            )}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Notes</h3>
              <div>
                <Form.Item name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    placeholder="Notes"
                    value={details?.notes}
                    onChange={(e) => {
                      setDetails({
                        ...details,
                        notes: e.target.value
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(femaleInfertilityDetails)?.length > 0
              ? (userType === 1 || InfertilityInvestigationModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || InfertilityInvestigationModule?.create) && (
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
            {/* <Button
              disabled
              className="btn_print mx-3"
            >
              Print
            </Button> */}
          </div>
        </Form>
      </div>
    </div>
  );
}
