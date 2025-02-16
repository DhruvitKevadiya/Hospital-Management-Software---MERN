import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Spin,
  Table
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import EditIcon from "../../Img/edit.svg";
import TranshIcon from "../../Img/trash.svg";
import CancelIcon from "../../Img/cancel.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  createExtendedHistory,
  editExtendedHistory,
  getExtendedHistoryData,
  setExtendedHistoryDetail,
  setExtendedHistoryUpdated
} from "redux/reducers/PatientExtendedHistory/patientExtendedHistory.slice";
import {
  clearData,
  getGlobalSearch
} from "redux/reducers/SearchPanel/globalSearch.slice";
import { setSelectedPatient } from "redux/reducers/common.slice";
import { useLocation } from "react-router-dom";
import { ageCalculatorFunc, diffYMD } from "utils/CommonFunctions";
import {
  deliveryMethodOptions,
  intensityOptions,
  pregnancyOutcomeOptions,
  regularityOptions,
  typeOptionsForPatientExtendedHistory,
  withPartnerOptions
} from "utils/FieldValues";
import TextArea from "antd/es/input/TextArea";

export default function PatientExtendedHistory() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const [data, setData] = useState([]);
  const [isEditObj, setIsEditObj] = useState({});

  const { selectedLocation } = useSelector(({ role }) => role);
  const { selectedPatient } = useSelector(({ common }) => common);
  const { moduleList, userType } = useSelector(({ role }) => role);
  const {
    extendedHistoryDetail,
    extendedHistoryUpdated,
    extendedHistoryLoading
  } = useSelector(({ patientExtendedHistory }) => patientExtendedHistory);

  const extendedHistoryModule = useMemo(() => {
    return (
      moduleList.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList]);

  let UserData;
  let UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserData = UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const [patientDetails, setPatientDetails] = useState({
    // patient_id: '',
    // patient_name: '',
    // age: '',
    date_of_medical_history: null
  });
  const [menstruationDetails, setMenstruationDetails] = useState({
    regularity: null,
    duration: "",
    distance: "",
    intensity: null,
    menopause: "",
    amenorrhea: "",
    type: null,
    notes: ""
  });
  const [previousArtTreatment, setPreviousArtTreatment] = useState({
    date: "",
    clinic_name: "",
    treatment: null,
    emb_transfer: null,
    pg: null,
    pg_outcome: null,
    no_of_emb_transfer: "",
    notes: ""
  });
  const isAddEditDisable = useMemo(() => {
    const {
      date,
      clinic_name,
      treatment,
      emb_transfer,
      pg_outcome,
      no_of_emb_transfer,
      pg
    } = previousArtTreatment;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      date &&
      clinic_name &&
      treatment &&
      pg
      //&&
      //emb_transfer &&
      //no_of_emb_transfer
    ) {
      return false;
    }
    return true;
  }, [selectedPatient, previousArtTreatment]);

  const [previousPregnanciesInfo, setPreviousPregnanciesInfo] = useState({
    sr_no: "",
    in_year: "",
    pregnancy_outcome: null,
    with_partner: null,
    child_died_perinatally: "",
    // previous_treatment: "",
    delivery_method: null,
    type_of_conception: null,
    pg_week: "",
    note: ""
  });


  const clearPreviousPregnanciesInfo = useCallback(() => {
    setPreviousPregnanciesInfo({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: ""
    });
    form.setFieldsValue({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: ""
    });
  }, [form]);

  const [prevTablePP, setPrevTablePP] = useState([]);

  const isAddBtnStatus = () => {
    const {
      sr_no,
      in_year,
      pregnancy_outcome,
      with_partner,
      child_died_perinatally,
      // previous_treatment,
      delivery_method,
      type_of_conception,
      pg_week
    } = previousPregnanciesInfo;
    if (
      sr_no &&
      in_year &&
      pregnancy_outcome &&
      with_partner &&
      child_died_perinatally &&
      // previous_treatment &&
      delivery_method &&
      type_of_conception &&
      pg_week
    ) {
      return false;
    } else return true;
  };

  const clearPreviousArtTreatment = useCallback(() => {
    setPreviousArtTreatment({
      date: null,
      clinic_name: "",
      treatment: null,
      emb_transfer: null,
      pg: null,
      pg_outcome: null,
      no_of_emb_transfer: ""
    });
    form.setFieldsValue({
      date: null,
      clinic_name: "",
      treatment: null,
      emb_transfer: null,
      pg: null,
      pg_outcome: null,
      no_of_emb_transfer: ""
    });
  }, [form]);

  useEffect(() => {
    if (Object.keys(extendedHistoryDetail)?.length > 0) {
      const withIdTreatmentData =
        extendedHistoryDetail.treatmentData?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false
          };
        }) || [];
      setData(withIdTreatmentData);
      const withIdPreganancyData =
        extendedHistoryDetail.previous_pregnancy?.map((item, i) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
            sr_no: i + 1
          };
        }) || [];
      setPrevTablePP(withIdPreganancyData);
      setMenstruationDetails({
        regularity: extendedHistoryDetail.regularity
          ? extendedHistoryDetail.regularity
          : null,
        duration: extendedHistoryDetail.duration
          ? extendedHistoryDetail.duration
          : "",
        distance: extendedHistoryDetail.distance
          ? extendedHistoryDetail.distance
          : "",
        intensity: extendedHistoryDetail.intensity
          ? extendedHistoryDetail.intensity
          : null,
        menopause: extendedHistoryDetail.menopause
          ? extendedHistoryDetail.menopause
          : "",
        amenorrhea: extendedHistoryDetail.amenorrhea
          ? extendedHistoryDetail.amenorrhea
          : "",
        type: extendedHistoryDetail.type ? extendedHistoryDetail.type : null,
        notes: extendedHistoryDetail.notes ? extendedHistoryDetail.notes : ""
      });
      form.setFieldsValue({
        regularity: extendedHistoryDetail.regularity
          ? extendedHistoryDetail.regularity
          : null,
        duration: extendedHistoryDetail.duration
          ? extendedHistoryDetail.duration
          : "",
        distance: extendedHistoryDetail.distance
          ? extendedHistoryDetail.distance
          : "",
        intensity: extendedHistoryDetail.intensity
          ? extendedHistoryDetail.intensity
          : null,
        menopause: extendedHistoryDetail.menopause
          ? extendedHistoryDetail.menopause
          : "",
        amenorrhea: extendedHistoryDetail.amenorrhea
          ? extendedHistoryDetail.amenorrhea
          : "",
        type: extendedHistoryDetail.type ? extendedHistoryDetail.type : null,
        notes: extendedHistoryDetail.notes ? extendedHistoryDetail.notes : ""
      });
      clearPreviousArtTreatment();
    } else {
      clearPreviousArtTreatment();
      setData([]);
    }
  }, [clearPreviousArtTreatment, extendedHistoryDetail, form]);
  const ageCalculate = useCallback((patientDob) => {
    const currentDate = moment();
    const dob = moment(patientDob);
    const years = currentDate.diff(dob, "years");
    return `${years}Y`;
  }, []);
  useEffect(() => {
    if (Object.keys(selectedPatient)?.length > 0) {
      const currentDate = moment();
      const dob = moment(new Date(selectedPatient.patient_dob));
      const patientAge = diffYMD(currentDate, dob) || null;
      setPatientDetails((prev) => ({
        ...prev,
        // age: patientAge ? patientAge : null,
        // patient_name: selectedPatient.patient_full_name
        //   ? selectedPatient?.patient_full_name
        //   : '',
        // patient_id: selectedPatient.patient_id
        //   ? selectedPatient?.patient_id
        //   : '',
        date_of_medical_history: selectedPatient.date_of_medical_history
          ? moment(selectedPatient.date_of_medical_history).format("DD/MM/YYYY")
          : null
      }));
      form.setFieldsValue({
        // age: patientAge ? patientAge : null,
        // patient_name: selectedPatient.patient_full_name
        //   ? selectedPatient.patient_full_name
        //   : '',
        // patient_id: selectedPatient.patient_id
        //   ? selectedPatient.patient_id
        //   : '',
        date_of_medical_history: selectedPatient.date_of_medical_history
          ? dayjs(
            moment(selectedPatient.date_of_medical_history).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null
      });
    }
    return () => {
      clearPatientExtendedHistoryForm();
      dispatch(setExtendedHistoryDetail({}));
    };
  }, [form, selectedPatient]);

  useEffect(() => {
    if (extendedHistoryModule?._id && selectedPatient?._id) {
      dispatch(
        getExtendedHistoryData({
          locationId: selectedLocation,
          patientRegId: selectedPatient._id,
          moduleId: extendedHistoryModule._id
        })
      );
    }
  }, [dispatch, selectedPatient, selectedLocation]);

  useEffect(() => {
    if (extendedHistoryUpdated) {
      setIsEditObj({});
      clearPreviousArtTreatment();
      dispatch(
        getExtendedHistoryData({
          locationId: selectedLocation,
          patientRegId: selectedPatient._id,
          moduleId: extendedHistoryModule._id
        })
      );
      dispatch(setExtendedHistoryUpdated(false));
    }
  }, [dispatch, extendedHistoryUpdated, selectedLocation]);

  const getNewSelectedPatientData = useCallback(async () => {
    if (
      extendedHistoryUpdated &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(extendedHistoryDetail)?.length === 0
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
    extendedHistoryUpdated,
    selectedLocation,
    selectedPatient,
    extendedHistoryUpdated
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [extendedHistoryUpdated]);

  const onFinish = useCallback(
    (values) => {
      let preArtTreatmentData = [];

      if (selectedPatient?.type_of_patient !== 5 && data?.length) {
        preArtTreatmentData =
          data?.map((item) => {
            delete item.id;
            return item;
          }) || [];
      }

      const obj = {
        ...extendedHistoryDetail,
        previous_pregnancy: prevTablePP,
        // age: values.age ? values.age : null,
        regularity: values.regularity ? values.regularity : null,
        duration: values.duration ? values.duration : "",
        distance: values.distance ? values.distance : "",
        intensity: values.intensity ? values.intensity : null,
        menopause: values.menopause ? values.menopause : "",
        amenorrhea: values.amenorrhea ? values.amenorrhea : "",
        notes: values.notes ? values.notes : "",
        type: values.type ? values.type : null,
        ...(selectedPatient?.type_of_patient !== 5 && {
          previous_art_treatment: preArtTreatmentData
        })
      };

      obj?.treatmentData && delete obj.treatmentData;

      if (Object.keys(extendedHistoryDetail)?.length > 0) {
        dispatch(
          editExtendedHistory({
            location_id: selectedLocation,
            id: extendedHistoryDetail._id,
            moduleId: extendedHistoryModule._id,
            payload: obj
          })
        );
      } else {
        dispatch(
          createExtendedHistory({
            location_id: selectedLocation,
            payload: obj,
            patient_reg_id: selectedPatient._id,
            moduleId: extendedHistoryModule._id
          })
        );
      }
    },
    [selectedPatient?.type_of_patient, selectedPatient._id, data, prevTablePP, extendedHistoryDetail, dispatch, selectedLocation, extendedHistoryModule._id]
  );

  const onFinishFailed = useCallback((errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  const onDeleteHandler = useCallback(
    (record) => {
      let treatMentData = [...data] || [];
      treatMentData = treatMentData.filter((item) => item.id !== record.id);
      setData(treatMentData);
    },
    [data, setData]
  );
  const onDeleteHandlerPP = useCallback(
    (record) => {
      let PregnanciesData = [...prevTablePP] || [];
      PregnanciesData = PregnanciesData.filter((item) => item.id !== record.id);
      setPrevTablePP(PregnanciesData);
    },
    [prevTablePP, setPrevTablePP]
  );

  const columnsPP = [
    {
      title: "Sr. No.",
      dataIndex: "sr_no",
      key: "sr_no"
    },
    {
      title: "In Year",
      dataIndex: "in_year",
      key: "in_year"
    },
    {
      title: "Pregnancy Outcome",
      dataIndex: "pregnancy_outcome",
      key: "pregnancy_outcome"
    },
    {
      title: "With Partner",
      dataIndex: "with_partner",
      key: "with_partner"
    },
    {
      title: "Delivery Method",
      dataIndex: "delivery_method",
      key: "delivery_method"
    },
    {
      title: "PG Week",
      dataIndex: "pg_week",
      key: "pg_week"
    },
    {
      title: "Child Died Perinatally",
      dataIndex: "child_died_perinatally",
      key: "child_died_perinatally"
    },
    {
      title: "Type of Conception",
      dataIndex: "type_of_conception",
      key: "type_of_conception"
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
            {(userType === 1 || extendedHistoryModule?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record.id === isEditObj.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearPreviousPregnanciesInfo();
                        setIsEditObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setPreviousPregnanciesInfo({
                          sr_no: record.sr_no,
                          in_year: record.in_year,
                          pregnancy_outcome: record.pregnancy_outcome || null,
                          with_partner: record.with_partner || null,
                          child_died_perinatally: record.child_died_perinatally,
                          // previous_treatment: record.previous_treatment,
                          delivery_method: record.delivery_method || null,
                          type_of_conception: record.type_of_conception || null,
                          pg_week: record.pg_week,
                          note: record.note
                        });
                        form.setFieldsValue({
                          sr_no: record.sr_no,
                          in_year: record.in_year,
                          pregnancy_outcome: record.pregnancy_outcome || null,
                          with_partner: record.with_partner || null,
                          child_died_perinatally: record.child_died_perinatally,
                          // previous_treatment: record.previous_treatment,
                          delivery_method: record.delivery_method || null,
                          type_of_conception: record.type_of_conception || null,
                          pg_week: record.pg_week,
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
                    onDeleteHandlerPP(record);
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteHandler(record)}
                  >
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

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : "";
      }
    },
    {
      title: "Clinic Name",
      dataIndex: "clinic_name",
      key: "Clinic_name"
    },
    {
      title: "Treatment",
      dataIndex: "treatment",
      key: "Treatment"
    },
    {
      title: "EMB Transfer",
      dataIndex: "emb_transfer",
      key: "emb_transfer"
    },
    {
      title: "PG",
      dataIndex: "pg",
      key: "pg"
    },
    {
      title: "PG-Outcome",
      dataIndex: "pg_outcome",
      key: "pg_outcome"
    },
    {
      title: "No of EMB Transfer",
      dataIndex: "no_of_emb_transfer",
      key: "no_of_emb_transfer"
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 ||
              extendedHistoryModule?.edit ||
              record?.isDelete) && (
                <li>
                  <Button className="btn_transparent">
                    {record?.id === isEditObj?.id ? (
                      <img
                        src={CancelIcon}
                        alt="CancelIcon"
                        className="me-2 edit_img"
                        onClick={() => {
                          clearPreviousArtTreatment();
                          setIsEditObj({});
                        }}
                      />
                    ) : (
                      <img
                        src={EditIcon}
                        alt="EditIcon"
                        className="me-2 edit_img"
                        onClick={() => {
                          setPreviousArtTreatment({
                            date: moment(record.date).format("DD/MM/YYYY"),
                            clinic_name: record.clinic_name,
                            treatment: record.treatment || null,
                            emb_transfer: record.emb_transfer,
                            pg: record.pg,
                            pg_outcome: record.pg_outcome,
                            no_of_emb_transfer: record.no_of_emb_transfer
                          });
                          form.setFieldsValue({
                            date: dayjs(
                              moment(record.date).format("DD/MM/YYYY"),
                              "DD/MM/YYYY"
                            ),
                            clinic_name: record.clinic_name,
                            treatment: record.treatment || null,
                            emb_transfer: record.emb_transfer,
                            pg: record.pg,
                            pg_outcome: record.pg_outcome,
                            no_of_emb_transfer: record.no_of_emb_transfer
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
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteHandler(record)}
                  >
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

  const disabledDate = useCallback(
    (current) => {
      let dateArray = [];
      data?.forEach((item) => {
        if (item.id !== isEditObj.id) {
          dateArray.push(moment(new Date(item.date)).format("DD/MM/YYYY"));
        }
      });
      const currentDate = current.format("DD/MM/YYYY");
      return dateArray.includes(currentDate);
    },
    [data, isEditObj]
  );

  const onChangePreviousArtTreatment = useCallback((name, values) => {
    const value =
      name === "date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setPreviousArtTreatment((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const {
      date,
      clinic_name,
      treatment,
      emb_transfer,
      pg_outcome,
      no_of_emb_transfer,
      pg
    } = previousArtTreatment;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      date &&
      clinic_name &&
      treatment &&
      // emb_transfer &&
      pg
      // &&
      // no_of_emb_transfer
    ) {
      if (Object.keys(isEditObj)?.length > 0) {
        let editedData = [...data] || [];
        editedData =
          editedData?.map((item) => {
            if (item.id === isEditObj.id) {
              return {
                ...item,
                date: moment(previousArtTreatment.date, "DD/MM/YYYY").format(
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ),
                clinic_name: clinic_name,
                treatment: treatment,
                emb_transfer: emb_transfer,
                pg: pg,
                pg_outcome: pg_outcome,
                no_of_emb_transfer: no_of_emb_transfer
              };
            }
            return item;
          }) || editedData;
        setData(editedData);
      } else {
        setData((prev) => [
          ...prev,
          {
            ...previousArtTreatment,
            date: moment(previousArtTreatment.date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            id: Math.random().toString().substring(2, 9),
            isDelete: true
          }
        ]);
      }
      setIsEditObj({});
      clearPreviousArtTreatment();
    }
  }, [
    data,
    isEditObj,
    previousArtTreatment,
    selectedPatient,
    clearPreviousArtTreatment
  ]);

  const handleSubmitPP = useCallback(() => {
    if (Object.keys(isEditObj)?.length > 0) {
      let editedData = [...prevTablePP] || [];
      editedData =
        editedData?.map((item) => {
          if (item.id === isEditObj.id) {
            return {
              ...item,
              ...previousPregnanciesInfo
            };
          }
          return item;
        }) || editedData;
      setPrevTablePP(editedData);
      setIsEditObj({});
      clearPreviousPregnanciesInfo();
    } else {
      setPrevTablePP([
        ...prevTablePP,
        {
          id: Math.random().toString().substring(2, 9),
          isDelete: true,
          ...previousPregnanciesInfo
        }
      ]);
      clearPreviousPregnanciesInfo();
    }
  }, [
    clearPreviousPregnanciesInfo,
    isEditObj,
    prevTablePP,
    previousPregnanciesInfo
  ]);

  const clearPatientExtendedHistoryForm = useCallback(() => {
    setPatientDetails({
      // patient_id: '',
      // patient_name: '',
      // age: '',
      date_of_medical_history: null
    });
    setMenstruationDetails({
      regularity: null,
      duration: "",
      distance: "",
      intensity: null,
      menopause: "",
      amenorrhea: "",
      notes: "",
      type: null
    });
    setPreviousArtTreatment({
      date: "",
      clinic_name: "",
      treatment: null,
      emb_transfer: null,
      pg: null,
      pg_outcome: null,
      no_of_emb_transfer: ""
    });
    setPreviousPregnanciesInfo({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: ""
    });
    setPrevTablePP([]);
    form.setFieldsValue({
      // patient_id: '',
      // patient_name: '',
      // age: '',
      date_of_medical_history: null,
      regularity: null,
      duration: "",
      distance: "",
      intensity: null,
      menopause: "",
      amenorrhea: "",
      notes: "",
      type: null,
      date: "",
      clinic_name: "",
      treatment: null,
      emb_transfer: null,
      pg: null,
      pg_outcome: null,
      no_of_emb_transfer: "",
      delivery_method: null,
      type_of_conception: null,
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      pg_week: "",
      note: "",
    });
  }, [form]);
  const handleCancel = () => {
    clearPatientExtendedHistoryForm();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {extendedHistoryLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true
          }}
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
                    <label>Age</label>
                    <span>
                      {selectedPatient.patient_dob
                        ? ageCalculatorFunc(selectedPatient.patient_dob)
                        : ""}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Patient ID"
                    name="patient_id"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="patient_id"
                      placeholder="Enter Patient ID"
                      value={patientDetails?.patient_id}
                      onChange={e => {
                        setPatientDetails({
                          ...patientDetails,
                          patient_id: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Patient Name"
                    name="patient_name"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Patient Name"
                      value={patientDetails?.patient_name}
                      onChange={e => {
                        setPatientDetails({
                          ...patientDetails,
                          patient_name: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_180 w_xs_50">
                  <Form.Item
                    label="Age"
                    name="age"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Age"
                      value={patientDetails?.age}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Date of Medical History"
                    name="date_of_medical_history"
                  >
                    <DatePicker
                      placeholder="Select date"
                      value={
                        patientDetails.date_of_medical_history
                          ? dayjs(
                            patientDetails.date_of_medical_history,
                            "DD/MM/YYYY"
                          )
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask"
                      }}
                      onChange={(value) => {
                        setPatientDetails({
                          ...patientDetails,
                          date_of_medical_history: value
                            ? moment(new Date(value)).format("DD/MM/YYYY")
                            : null
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>

            {selectedPatient?.type_of_patient !== 4 && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">Menstruation Details</h3>
                <ul className="grid_wrapper">
                  <li className="w_300 w_xs_100">
                    <Form.Item
                      label="Regularity"
                      name="regularity"
                      className="custom_select"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: ""
                      //   }
                      // ]}
                      rules={
                        [1, 2, 5].includes(selectedPatient?.type_of_patient)
                          ? [
                            {
                              required: true,
                              message: ""
                            }
                          ]
                          : []
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
                        options={regularityOptions}
                        value={menstruationDetails?.regularity}
                        onChange={(value) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            regularity: value || null
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_150 w_xs_50">
                    <Form.Item
                      label="Duration (Days)"
                      name="duration"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: ""
                      //   }
                      // ]}
                      rules={
                        [1, 2, 5].includes(selectedPatient?.type_of_patient)
                          ? [
                            {
                              required: true,
                              message: ""
                            }
                          ]
                          : []
                      }
                    >
                      <Input
                        placeholder="Enter Duration (Days)"
                        name="duration"
                        value={menstruationDetails?.duration}
                        onChange={(e) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            duration: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_150 w_xs_50">
                    <Form.Item
                      label="Distance (Days)"
                      name="distance"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: ""
                      //   }
                      // ]}
                      rules={
                        [1, 2, 5].includes(selectedPatient?.type_of_patient)
                          ? [
                            {
                              required: true,
                              message: ""
                            }
                          ]
                          : []
                      }
                    >
                      <Input
                        placeholder="Enter Distance (Days)"
                        value={menstruationDetails?.distance}
                        onChange={(e) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            distance: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_180 w_xs_100">
                    <Form.Item
                      label="Intensity"
                      className="custom_select"
                      name="intensity"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: ""
                      //   }
                      // ]}
                      rules={
                        [1, 2, 5].includes(selectedPatient?.type_of_patient)
                          ? [
                            {
                              required: true,
                              message: ""
                            }
                          ]
                          : []
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
                        options={intensityOptions}
                        value={menstruationDetails?.intensity}
                        onChange={(value) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            intensity: value || null
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_180 w_xs_100">
                    <Form.Item
                      label="Menopause (Year)"
                      name="menopause"
                    // rules={[
                    //   {
                    //     // required: true,
                    //     message: ""
                    //   }
                    // ]}
                    // rules={
                    //   [1, 2, 5].includes(selectedPatient?.type_of_patient)
                    //     ? [
                    //         {
                    //           required: true,
                    //           message: "",
                    //         },
                    //       ]
                    //     : []
                    // }
                    >
                      <Input
                        placeholder="Enter Menopause (Year)"
                        value={menstruationDetails?.menopause}
                        onChange={(e) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            menopause: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_180 w_xs_100">
                    <Form.Item
                      label="Amenorrhea (Year)"
                      name="amenorrhea"
                    // rules={[
                    //   {
                    //     // required: true,
                    //     message: ""
                    //   }
                    // ]}
                    // rules={
                    //   [1, 2, 5].includes(selectedPatient?.type_of_patient)
                    //     ? [
                    //         {
                    //           required: true,
                    //           message: "",
                    //         },
                    //       ]
                    //     : []
                    // }
                    >
                      <Input
                        placeholder="Enter Amenorrhea (Year)"
                        value={menstruationDetails?.amenorrhea}
                        onChange={(e) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            amenorrhea: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_180 w_xs_100">
                    <Form.Item
                      label="Type"
                      className="custom_select"
                      name="type"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: ""
                    //   }
                    // ]}
                    // rules={
                    //   [1, 2, 5].includes(selectedPatient?.type_of_patient)
                    //     ? [
                    //       {
                    //         required: true,
                    //         message: "",
                    //       },
                    //     ]
                    //     : []
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
                        placeholder="Select"
                        options={typeOptionsForPatientExtendedHistory}
                        value={menstruationDetails?.type}
                        onChange={(value) => {
                          setMenstruationDetails({
                            ...menstruationDetails,
                            type: value || null
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            )}
            {selectedPatient?.type_of_patient !== 5 && selectedPatient?.type_of_patient !== 4 && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">Previous ART Treatment</h3>
                <ul className="grid_wrapper">
                  <li className="w_220 w_xs_50">
                    <Form.Item label="Date" name="date">
                      <DatePicker
                        placeholder="Select date"
                        value={
                          previousArtTreatment?.date
                            ? dayjs(previousArtTreatment?.date, "DD/MM/YYYY")
                            : null
                        }
                        disabledDate={disabledDate}
                        format={{
                          format: "DD-MM-YYYY",
                          type: "mask"
                        }}
                        onChange={(value) =>
                          onChangePreviousArtTreatment("date", value)
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="Clinic Name"
                      name="clinic_name"
                      rules={
                        previousArtTreatment?.date && [
                          {
                            required: true,
                            message: ""
                          }
                        ]
                      }
                    >
                      <Input
                        placeholder="Enter Clinic Name"
                        value={previousArtTreatment?.clinic_name}
                        onChange={(e) =>
                          onChangePreviousArtTreatment(
                            "clinic_name",
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="Treatment"
                      name="treatment"
                      className="custom_select"
                      rules={
                        previousArtTreatment?.date && [
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
                        options={[
                          { value: "IUI - H", label: "IUI - H" },
                          { value: "FET", label: "FET" },
                          { value: "IUI - D", label: "IUI - D" },
                          { value: "ICSI", label: "ICSI" }
                        ]}
                        value={previousArtTreatment?.treatment}
                        onChange={(e) =>
                          onChangePreviousArtTreatment("treatment", e || null)
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="EMB Transfer"
                      className="custom_select"
                      name="emb_transfer"
                    // rules={
                    //   previousArtTreatment?.date && [
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
                        options={[
                          { value: "Day 2", label: "Day 2" },
                          { value: "Day 3", label: "Day 3" },
                          { value: "Day 5", label: "Day 5" },
                          { value: "Day 6", label: "Day 6" },
                          { value: "None", label: "None" },
                        ]}
                        value={previousArtTreatment?.emb_transfer}
                        onChange={(e) =>
                          onChangePreviousArtTreatment(
                            "emb_transfer",
                            e || null
                          )
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="PG"
                      className="custom_select"
                      name="pg"
                      rules={
                        previousArtTreatment?.date && [
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
                        options={[
                          { value: "Positive", label: "Positive" },
                          { value: "Negative", label: "Negative" },
                          { value: "--", label: "--" }
                        ]}
                        value={previousArtTreatment?.pg}
                        onChange={(e) =>
                          onChangePreviousArtTreatment("pg", e || null)
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="PG-Outcome"
                      className="custom_select"
                      name="pg_outcome"
                      rules={
                        previousArtTreatment?.date &&
                        previousArtTreatment.pg === "Positive" && [
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
                        name="pg_outcome"
                        disabled={previousArtTreatment.pg !== "Positive"}
                        options={[
                          {
                            value: "Missed",
                            label: "Missed"
                          },
                          {
                            value: "Missed (8 weeks)",
                            label: "Missed (8 weeks)"
                          },
                          { value: "Blighted Ovum", label: "Blighted Ovum" },
                          {
                            value: "First Trimester Abortion",
                            label: "First Trimester Abortion"
                          },
                          { value: "Ectopic", label: "Ectopic" },
                          { value: "IUFD", label: "IUFD" },
                          { value: "FTND (Single)", label: "FTND (Single)" },
                          {
                            value: "FTND (Multiple)",
                            label: "FTND (Multiple)"
                          },
                          { value: "Pre Term", label: "Pre Term" }
                        ]}
                        value={previousArtTreatment?.pg_outcome}
                        onChange={(e) =>
                          onChangePreviousArtTreatment("pg_outcome", e || null)
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_50">
                    <Form.Item
                      label="No of EMB Transfer"
                      name="no_of_emb_transfer"
                    // rules={
                    //   previousArtTreatment?.date && [
                    //     {
                    //       required: true,
                    //       message: ""
                    //     }
                    //   ]
                    // }
                    >
                      <Input
                        placeholder="Enter No of EMB Transfer"
                        value={previousArtTreatment?.no_of_emb_transfer}
                        onChange={(e) =>
                          onChangePreviousArtTreatment(
                            "no_of_emb_transfer",
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                  </li>
                  <li className="w_120 w_xs_50 align-self-end">
                    {Object.keys(isEditObj)?.length > 0
                      ? (userType === 1 || extendedHistoryModule?.edit) && (
                        <Button
                          disabled={isAddEditDisable}
                          className="btn_primary mb24"
                          onClick={handleSubmit}
                        >
                          Edit
                        </Button>
                      )
                      : (userType === 1 || extendedHistoryModule?.create) && (
                        <Button
                          disabled={isAddEditDisable}
                          className="btn_primary mb24"
                          onClick={handleSubmit}
                        >
                          Add
                        </Button>
                      )}
                  </li>
                </ul>
                <div className="cmn_table_wrap pb-3">
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                  />
                </div>
              </div>
            )}

            {selectedPatient?.type_of_patient === 4 && (
              <div className="form_info_wrapper filled">
                <h3 className="mb-3">Previous Pregnancies</h3>
                <ul className="grid_wrapper">
                  <li className="w_90 w_xs_50">
                    <Form.Item label="Sr. No." name="sr_no">
                      <Input
                        type="number"
                        placeholder="0"
                        name="sr_no"
                        value={previousPregnanciesInfo?.sr_no}
                        onChange={(e) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            sr_no: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_90 w_xs_50">
                    <Form.Item
                      label="In Year"
                      name="in_year"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
                          message: ""
                        }
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="0"
                        name="in_year"
                        value={previousPregnanciesInfo?.in_year}
                        onChange={(e) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            in_year: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_270 w_xs_100">
                    <Form.Item
                      label="Pregnancy Outcome"
                      name="pregnancy_outcome"
                      className="custom_select"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
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
                        options={pregnancyOutcomeOptions}
                        dropdownMatchSelectWidth={false}
                        name="pregnancy_outcome"
                        value={previousPregnanciesInfo?.pregnancy_outcome}
                        onChange={(value) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            pregnancy_outcome: value || null
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_220 w_xs_100">
                    <Form.Item
                      label="With Partner"
                      name="with_partner"
                      className="custom_select"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
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
                        options={withPartnerOptions}
                        name="with_partner"
                        value={previousPregnanciesInfo?.with_partner}
                        onChange={(value) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            with_partner: value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_300 w_xs_100">
                    <Form.Item
                      label="Delivery Method"
                      name="delivery_method"
                      className="custom_select"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
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
                        options={deliveryMethodOptions}
                        name="delivery_method"
                        value={previousPregnanciesInfo?.delivery_method}
                        onChange={(value) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            delivery_method: value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_120 w_xs_100">
                    <Form.Item
                      label="PG Week"
                      name="pg_week"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
                          message: ""
                        }
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="0"
                        name="pg_week"
                        value={previousPregnanciesInfo?.pg_week}
                        onChange={(e) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            pg_week: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_190 w_xs_100">
                    <Form.Item
                      label="Child Died Perinatally"
                      name="child_died_perinatally"
                      rules={[
                        {
                          required: previousPregnanciesInfo?.sr_no
                            ? true
                            : false,
                          message: ""
                        }
                      ]}
                    >
                      <Input
                        placeholder="--"
                        name="child_died_perinatally"
                        value={
                          previousPregnanciesInfo?.child_died_perinatally
                        }
                        onChange={(e) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            child_died_perinatally: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_180 w_xs_100">
                    <Form.Item
                      label="Type of Conception"
                      name="type_of_conception"
                      className="custom_select"
                    // rules={[
                    //   {
                    //     required: previousPregnanciesInfo?.sr_no
                    //       ? true
                    //       : false,
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
                        options={[
                          { value: "Natural", label: "Natural" },
                          { value: "IUI", label: "IUI" },
                          { value: "IVF", label: "IVF" },
                          { value: "None", label: "None" },
                        ]}
                        name="type_of_conception"
                        value={previousPregnanciesInfo?.type_of_conception}
                        onChange={(value) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            type_of_conception: value || null
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_370 w_xs_100">
                    <Form.Item label="Note" name="note">
                      <Input
                        placeholder="Type here"
                        name="note"
                        value={previousPregnanciesInfo?.note}
                        onChange={(e) => {
                          setPreviousPregnanciesInfo({
                            ...previousPregnanciesInfo,
                            note: e.target.value
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                  <li className="w_120 w_xs_50 align-self-end">
                    {Object.keys(isEditObj)?.length > 0
                      ? (userType === 1 || extendedHistoryModule?.edit) && (
                        <Button
                          className="btn_primary mb24"
                          disabled={isAddBtnStatus()}
                          onClick={handleSubmitPP}
                        >
                          Edit
                        </Button>
                      )
                      : (userType === 1 || extendedHistoryModule?.create) && (
                        <Button
                          className="btn_primary mb24"
                          disabled={isAddBtnStatus()}
                          onClick={handleSubmitPP}
                        >
                          Add
                        </Button>
                      )}
                  </li>
                </ul>
                <div className="cmn_table_wrap pb-4">
                  <Table
                    columns={columnsPP}
                    dataSource={prevTablePP}
                    pagination={false}
                  />
                </div>
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
                    value={menstruationDetails?.notes}
                    onChange={(e) => {
                      setMenstruationDetails({
                        ...menstruationDetails,
                        notes: e.target.value
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(extendedHistoryDetail)?.length > 0
              ? (userType === 1 || extendedHistoryModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || extendedHistoryModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button
              className="btn_gray"
              disabled={Object.keys(selectedPatient)?.length === 0}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {/* <Button disabled className="btn_print mx-3">
              Print
            </Button> */}
          </div>
        </Form>
      </div>
    </div>
  );
}
