import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Spin,
  TimePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IUI_with,
  bloodGroupOptions,
  collectionOptions,
  completeCollectionOptions,
  frozen_sample,
  referringClinicOptions,
  uptTestOptions,
  visualAppearance,
} from "utils/FieldValues";
import { useDispatch, useSelector } from "react-redux";
import {
  getAttendingDrList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  createIuiReportsData,
  editIuiReporData,
  getIuiReporData,
  printIuiReporData,
  setIuiReportDetails,
  getReportDateList
} from "redux/reducers/IuiReport/IuiReportData.slice";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import { useLocation } from "react-router-dom";
import { ageCalculate } from "utils/CommonFunctions";
import TextArea from "antd/es/input/TextArea";
import { toast } from "react-toastify";

const iuiReportInitialdata = {
  patient_reg_id: "",
  collections: null,
  collections_other: null,
  complete_collection: null,
  rec_no: "",
  date: null,
  refer_clinic: null,
  method_collection: "Masturbation",
  abstinance_period: "",
  collection_time: "",
  assay_time: "",
  iui_with: null,
  blood_group_husband_donor: null,
  frozen_sample: null,
  upt_test: null,
  lmp: "",
  b_hcg_1st: "",
  clinical_preg_determined: "",
  b_hcg_2nd: "",
  pregnancy_type: null,
  done_by: null,
  gestation_weeks: "",
  pregnancy_outcome_radio: "None",
  // live_birth: false,
  // ectopic: false,
  // missed_abortion: false,
  // abnormal: false,
  // os_tightening: false,
  // preterm: false,
  notes: "",
  report_date: null,

};

const pregnancyOutcome = {
  live_birth: false,
  ectopic: false,
  missed_abortion: false,
  abnormal: false,
  os_tightening: false,
  preterm: false,
};

const IuiReport = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const [iuiReport, setIuiReport] = useState(iuiReportInitialdata);
  const [doctorList, setDoctorList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [reportsDate, setReportsDate] = useState(null);
  const parentComponentData = location?.state?.parentComponentData;
  const { userType, selectedLocation } = useSelector(({ role }) => role);
  const { selectedPatient, attendingDrList } = useSelector(
    ({ common }) => common
  );

  const { iuiReportDetails, iuiReportisLoading, iuiReportisUpdate, iuiReportList } =
    useSelector(({ iuiReportDataStore }) => iuiReportDataStore);

  const getPregnancyOutcome = useCallback((pregnancyData, pregnancyOutcome) => {
    const dynamicPregnancyOutcome = { ...pregnancyOutcome };
    for (const key in pregnancyData) {
      if (key === pregnancyOutcome?.pregnancy_outcome_radio) {
        dynamicPregnancyOutcome[key] = true;
      } else {
        dynamicPregnancyOutcome[key] = false;
      }
    }
    return { ...pregnancyOutcome, ...dynamicPregnancyOutcome };
  }, []);

  const getPregnancyOutcomeReverse = useCallback((testConst, mainObj) => {
    let test = { ...mainObj };
    for (const key in mainObj) {
      if (testConst?.hasOwnProperty(key) && mainObj[key]) {
        test = { ...test, pregnancy_outcome_radio: key };
      } else if (testConst?.hasOwnProperty(key) && mainObj[key] === false) {
        delete test[key];
      }
    }
    return !test?.pregnancy_outcome_radio
      ? { ...test, pregnancy_outcome_radio: "None" }
      : test;
  }, []);

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

  useEffect(() => {
    form.setFieldsValue({
      male_partner: selectedPatient?.partner_full_name || "",
      age_male: selectedPatient?.partner_dob
        ? ageCalculate(selectedPatient?.partner_dob)
        : "",
      female_partner: selectedPatient?.patient_full_name || "",
      age_female: selectedPatient?.patient_dob
        ? ageCalculate(selectedPatient?.patient_dob)
        : "",
      pt_id: selectedPatient?.patient_id || "",
    });
  }, [form, selectedPatient]);

  const getReportsDataFromAPI = (report_id) => {
    dispatch(
      getIuiReporData({
        location_id: selectedLocation,
        patient_reg_id: selectedPatient?._id,
        module_id: parentComponentData?._id,
        report_id: report_id,
      })
    );
  }

  const callReportListAPI = async () => {
    await dispatch(
      getReportDateList({
        location_id: selectedLocation,
        patient_reg_id: selectedPatient?._id,
        module_id: parentComponentData?._id,
      })
    ).then((result) => {
      const reportsList = result?.payload;
      if (reportsList?.length > 0) {
        setReportsList(
          reportsList?.map(item => ({
            value: item?._id,
            label: item?.date,
          }))
        );
        const report_id = reportsDate ? reportsDate : reportsList?.[0]?._id;
        setReportsDate(report_id)
        setIuiReport({
          ...iuiReportDetails,
          report_date: report_id,
          date: iuiReportDetails?.date
            ? moment(iuiReportDetails?.date).format("YYYY-MM-DD")
            : null,
          collection_time: iuiReportDetails?.collection_time
            ? dayjs(iuiReportDetails?.collection_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          assay_time: iuiReportDetails?.assay_time
            ? dayjs(iuiReportDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          lmp: iuiReportDetails?.lmp
            ? moment(iuiReportDetails?.lmp).format("YYYY-MM-DD")
            : null,
          clinical_preg_determined: iuiReportDetails?.clinical_preg_determined
            ? moment(iuiReportDetails?.clinical_preg_determined).format(
              "YYYY-MM-DD"
            )
            : null,
        })
        form.setFieldsValue({
          ...iuiReportDetails,
          report_date: report_id,
          date: iuiReportDetails?.date
            ? dayjs(
              moment(iuiReportDetails?.date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          collection_time: iuiReportDetails?.collection_time
            ? dayjs(iuiReportDetails?.collection_time, "HH:mm:ss")
            : null,
          assay_time: iuiReportDetails?.assay_time
            ? dayjs(iuiReportDetails?.assay_time, "HH:mm:ss")
            : null,
          lmp: iuiReportDetails?.lmp
            ? dayjs(
              moment(iuiReportDetails?.lmp).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          clinical_preg_determined: iuiReportDetails?.clinical_preg_determined
            ? dayjs(
              moment(iuiReportDetails?.clinical_preg_determined).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
        })
        getReportsDataFromAPI(report_id);
      }
    }).catch((err) => {
      toast.error('Error While Fetching Report Date List API', err)
    });
  }

  useEffect(() => {
    if (
      selectedLocation &&
      selectedPatient && Object.keys(selectedPatient).length > 0 &&
      ((iuiReportDetails && Object.keys(iuiReportDetails).length === 0) || iuiReportisUpdate) &&
      window.location.pathname === '/iui-report'
    ) {
      callReportListAPI();
    }
    return () => {
      clearIuiReport();
    };
  }, [selectedPatient, selectedLocation, selectedLocation]);

  useEffect(() => {
    if (Object.keys(iuiReportDetails)?.length > 0) {
      const tempIuiReportDetail = getPregnancyOutcomeReverse(
        pregnancyOutcome,
        iuiReportDetails
      );
      setIuiReport({
        patient_reg_id: iuiReportDetails?.patient_reg_id || "",
        collections: iuiReportDetails?.collections || null,
        collections_other: iuiReportDetails?.collections_other || null,
        complete_collection: iuiReportDetails?.complete_collection || null,
        rec_no: iuiReportDetails?.rec_no || "",
        date: iuiReportDetails?.date
          ? moment(iuiReportDetails?.date).format("YYYY-MM-DD")
          : null,
        refer_clinic: iuiReportDetails?.refer_clinic || null,
        method_collection: iuiReportDetails?.method_collection || "",
        abstinance_period: iuiReportDetails?.abstinance_period || "",
        collection_time: iuiReportDetails?.collection_time
          ? dayjs(iuiReportDetails?.collection_time, "HH:mm:ss").format(
            "HH:mm:ss"
          )
          : null,
        assay_time: iuiReportDetails?.assay_time
          ? dayjs(iuiReportDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        iui_with: iuiReportDetails?.iui_with || null,
        blood_group_husband_donor:
          iuiReportDetails?.blood_group_husband_donor || null,
        frozen_sample: iuiReportDetails?.frozen_sample || null,
        upt_test: iuiReportDetails?.upt_test || null,
        lmp: iuiReportDetails?.lmp
          ? moment(iuiReportDetails?.lmp).format("YYYY-MM-DD")
          : null,
        b_hcg_1st: iuiReportDetails?.b_hcg_1st || "",
        clinical_preg_determined: iuiReportDetails?.clinical_preg_determined
          ? moment(iuiReportDetails?.clinical_preg_determined).format(
            "YYYY-MM-DD"
          )
          : null,
        b_hcg_2nd: iuiReportDetails?.b_hcg_2nd || "",
        pregnancy_type: iuiReportDetails?.pregnancy_type || null,
        done_by: iuiReportDetails?.done_by || null,
        gestation_weeks: iuiReportDetails?.gestation_weeks || "",
        pregnancy_outcome_radio:
          tempIuiReportDetail?.pregnancy_outcome_radio || null,
        notes: iuiReportDetails?.notes || "",
        report_date: reportsDate,

      });

      form.setFieldsValue({
        patient_reg_id: iuiReportDetails?.patient_reg_id || "",
        collections: iuiReportDetails?.collections || null,
        collections_other: iuiReportDetails?.collections_other || null,
        complete_collection: iuiReportDetails?.complete_collection || null,
        rec_no: iuiReportDetails?.rec_no || "",
        date: iuiReportDetails?.date
          ? dayjs(
            moment(iuiReportDetails?.date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        refer_clinic: iuiReportDetails?.refer_clinic || null,
        method_collection: iuiReportDetails?.method_collection || "",
        abstinance_period: iuiReportDetails?.abstinance_period || "",
        collection_time: iuiReportDetails?.collection_time
          ? dayjs(iuiReportDetails?.collection_time, "HH:mm:ss")
          : null,
        assay_time: iuiReportDetails?.assay_time
          ? dayjs(iuiReportDetails?.assay_time, "HH:mm:ss")
          : null,
        iui_with: iuiReportDetails?.iui_with || null,
        blood_group_husband_donor:
          iuiReportDetails?.blood_group_husband_donor || null,
        frozen_sample: iuiReportDetails?.frozen_sample || null,
        upt_test: iuiReportDetails?.upt_test || null,
        lmp: iuiReportDetails?.lmp
          ? dayjs(
            moment(iuiReportDetails?.lmp).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        b_hcg_1st: iuiReportDetails?.b_hcg_1st || "",
        clinical_preg_determined: iuiReportDetails?.clinical_preg_determined
          ? dayjs(
            moment(iuiReportDetails?.clinical_preg_determined).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        b_hcg_2nd: iuiReportDetails?.b_hcg_2nd || "",
        pregnancy_type: iuiReportDetails?.pregnancy_type || null,
        done_by: iuiReportDetails?.done_by || null,
        gestation_weeks: iuiReportDetails?.gestation_weeks || "",
        pregnancy_outcome_radio:
          tempIuiReportDetail?.pregnancy_outcome_radio || null,
        notes: iuiReportDetails?.notes || "",
        report_date: reportsDate,

      });
    }
  }, [iuiReportDetails, form]);

  const getNewSelectedPatientData = useCallback(async () => {
    if (Object.keys(selectedPatient)?.length > 0) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation,
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [dispatch, selectedLocation, selectedPatient]);
  const createIuiReportFunc = useCallback(async (obj) => {
    const { payload } = await dispatch(
      createIuiReportsData({
        location_id: selectedLocation,
        patient_reg_id: selectedPatient?._id,
        module_id: parentComponentData?._id,
        payload: obj,
      })
    );
    if (payload?.hasOwnProperty("_id")) {
      getNewSelectedPatientData();
    }
  });
  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  };
  const onFinish = useCallback(
    async (values) => {
      if (
        selectedLocation &&
        Object.keys(selectedPatient)?.length > 0 &&
        Object.keys(parentComponentData)?.length > 0
      ) {
        if (Object.keys(iuiReportDetails)?.length > 0) {
          await dispatch(
            editIuiReporData({
              location_id: selectedLocation,
              _id: iuiReportDetails?._id,
              module_id: parentComponentData._id,
              payload: {
                ...getPregnancyOutcome(pregnancyOutcome, iuiReport),
                method_collection: 'Masturbation',
                patient_reg_id: selectedPatient?._id,
              },
            })
          );
        } else {
          await createIuiReportFunc({
            ...getPregnancyOutcome(pregnancyOutcome, iuiReport),
            method_collection: 'Masturbation',
            patient_reg_id: selectedPatient?._id,
          });
        }
        await callReportListAPI()
      }
    },
    [createIuiReportFunc, dispatch, getPregnancyOutcome, iuiReport, iuiReportDetails, parentComponentData, selectedLocation, selectedPatient]
  );

  const clearIuiReport = useCallback(() => {
    setIuiReport(iuiReportInitialdata);
    dispatch(setIuiReportDetails({}));
    form.resetFields();
  }, [form, dispatch]);
  const handleClear = () => {
    clearIuiReport();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };
  const handleRepeatTest = useCallback(() => {
    setIuiReport(iuiReportInitialdata);
    dispatch(setIuiReportDetails({}));
    form.setFieldsValue(iuiReportInitialdata);
  }, [form, dispatch]);
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {iuiReportisLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        {/* <div className="text-end">
          <Button
            className="btn_primary"
            htmlType="submit"
            onClick={handleRepeatTest}
          >
            <PlusOutlined className="m-0 me-md-2" />
            <span className="ms-0">Repeat Test</span>
          </Button>
        </div> */}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError
          autoComplete="off"
          form={form}
        >
          <div className="d-flex justify-content-end align-items-center">
            {iuiReportList?.length && (
              <>
                <li className="w_120 w_xs_10 align-self-center">
                  <label className="text_light">
                    Old Reports:
                  </label>
                </li>
                <div className="w_170 w_xs_100">
                  <Form.Item
                    label=""
                    name="report_date"
                    className="custom_select m-0"
                  >
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={reportsList}
                      showSearch
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(val) => {
                        setIuiReportDetails((prevState) => ({
                          ...prevState,
                          report_date: val || null,
                        }));
                        setReportsDate(val || null)
                        if (val) {
                          handleRepeatTest()
                          getReportsDataFromAPI(val)
                        }
                        else {
                          handleRepeatTest()
                        }
                      }}
                    />
                  </Form.Item>
                </div>
              </>
            )}

            <Button
              className="btn_primary ms-2"
              htmlType="submit"
              onClick={handleRepeatTest}
            >
              <PlusOutlined className="m-0 me-md-2" />
              <span className="ms-0">Repeat Test</span>
            </Button>
          </div>
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
                    <label>Patient :</label>
                    <span>
                      {selectedPatient?.patient_full_name
                        ? selectedPatient?.patient_full_name
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Patient Age :</label>
                    <span>
                      {selectedPatient?.patient_dob
                        ? ageCalculate(selectedPatient?.patient_dob)
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Partner :</label>
                    <span>
                      {selectedPatient?.partner_full_name
                        ? selectedPatient?.partner_full_name
                        : ""}
                    </span>
                  </li>
                  <li>
                    <label>Partner Age :</label>
                    <span>
                      {selectedPatient?.partner_dob
                        ? ageCalculate(selectedPatient?.partner_dob)
                        : ""}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">
                Patient Registration & Basic info from patient
              </h3>
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_100">
                  <Form.Item label="Male Partner" name="male_partner">
                    <Input disabled placeholder="Enter Male Partner" />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Age (Male)" name="age_male">
                    <Input disabled placeholder="Enter Age" />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item label="Female Partner" name="female_partner">
                    <Input disabled placeholder="Enter Female Partner" />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Age (Female)" name="age_female">
                    <Input disabled placeholder="Enter Age" />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Pt. ID" name="pt_id">
                    <Input disabled placeholder="Enter ID" name="pt_ID" />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Collection"
                    name="collections"
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
                      options={collectionOptions}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          collections: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                {iuiReport?.collections === "Other" && (
                  <li>
                    <Form.Item
                      label="Collections Other"
                      name="collections_other"
                    >
                      <Input
                        placeholder="Enter Collections Other"
                        name="collections_other"
                        value={iuiReport?.collections_other}
                        onChange={(e) => {
                          setIuiReport({
                            ...iuiReport,
                            collections_other: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}

                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Complete Collection"
                    name="complete_collection"
                    className="custom_select"
                  >
                    <Select
                      allowClear={true}
                      optionFilterProp="children"
                      showSearch
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
                      options={completeCollectionOptions}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          complete_collection: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Rec.No." name="rec_no">
                    <Input
                      placeholder="Rec.No."
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          rec_no: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="Date"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          date: moment(new Date(e)).format("YYYY-MM-DD"),
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Referring clinic/clinician"
                    name="refer_clinic"
                    className="custom_select"
                  >
                    <Select
                      placeholder="Select"
                      allowClear={true}
                      options={doctorList}
                      showSearch
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
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          refer_clinic: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Method Of Collection">
                    <div className="default_value_wrap">
                      <span>{iuiReportDetails?.method_collection || 'Masturbation'}</span>
                    </div>
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <Form.Item
                    label="Abstinence Period (Days)"
                    name="abstinance_period"
                  >
                    <Input
                      placeholder="Abstinance Period"
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          abstinance_period: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Collection time(CT)" name="collection_time">
                    <TimePicker
                      format="h:mm a"
                      onChange={(value) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          collection_time: value
                            ? dayjs(value).format("HH:mm:ss")
                            : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Assay time (AT)" name="assay_time">
                    <TimePicker
                      format="h:mm a"
                      onChange={(value) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          assay_time: value
                            ? dayjs(value).format("HH:mm:ss")
                            : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="IUI with"
                    name="iui_with"
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
                      options={IUI_with}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          iui_with: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Blood Group of Husband / Donor"
                    name="blood_group_husband_donor"
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
                      name="Blood_Group_of_Husband_Donor"
                      options={bloodGroupOptions}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          blood_group_husband_donor: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Frozen sample"
                    name="frozen_sample"
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
                      name="Frozen_sample"
                      options={frozen_sample}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          frozen_sample: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Pregnancy Outcome</h3>
              <ul className="grid_wrapper">
                <li className="w_120 w_xs_100">
                  <Form.Item
                    label="UPT Test"
                    name="upt_test"
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
                      options={uptTestOptions}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          upt_test: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="LMP" name="lmp">
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          lmp: e ? moment(new Date(e)).format("YYYY-MM-DD") : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="1st ß-HcG" name="b_hcg_1st">
                    <Input
                      placeholder="Enter Number"
                      name="enter_number"
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          b_hcg_1st: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="Clinical Pregnancy determined on"
                    name="clinical_preg_determined"
                  >
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          clinical_preg_determined: e ? moment(new Date(e)).format(
                            "YYYY-MM-DD"
                          ) : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="2nd ß-HcG" name="b_hcg_2nd">
                    <Input
                      placeholder="Enter Number"
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          b_hcg_2nd: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="Type of Pregnancy"
                    name="pregnancy_type"
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
                      options={visualAppearance}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          pregnancy_type: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Done By"
                    name="done_by"
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
                      name="Done_By"
                      options={doctorList}
                      onChange={(val) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          done_by: val || null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Weeks of Gestation" name="gestation_weeks">
                    <Input
                      placeholder="Enter Weeks of Gestatio"
                      onChange={(e) => {
                        setIuiReport((prevState) => ({
                          ...prevState,
                          gestation_weeks: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_100">
                  <div className="round_radio_main_wrapper mb-4">
                    <div className="round_radio_wrapper">
                      <Radio.Group
                        name="pregnancy_outcome_radio"
                        value={iuiReport?.pregnancy_outcome_radio}
                        onChange={(e) => {
                          setIuiReport((prevState) => ({
                            ...prevState,
                            pregnancy_outcome_radio: e.target.value,
                          }));
                        }}
                        className="flex-wrap d-sm-flex d-block"
                      >
                        <Radio value="live_birth">Live Birth</Radio>
                        <Radio value="ectopic">Ectopic</Radio>
                        <Radio value="missed_abortion">Missed Abortion</Radio>
                        <Radio value="abnormal">Abnormal</Radio>
                        <Radio value="os_tightening">Os Tightening</Radio>
                        <Radio value="preterm">Preterm</Radio>
                        <Radio value="None">None</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="form_info_wrapper filled">
                <ul className="grid_wrapper">
                  <li className="w-100">
                    <Form.Item name="notes" label="Notes">
                      <TextArea
                        rows={3}
                        placeholder="Notes"
                        onChange={(e) => {
                          setIuiReport((prevState) => ({
                            ...prevState,
                            notes: e.target.value,
                          }));
                        }}
                      />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(iuiReportDetails)?.length > 0
              ? (userType === 1 || parentComponentData?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-sm-2 mx-1"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || parentComponentData?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-sm-2 mx-1"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button className="btn_gray mx-sm-2 mx-1" onClick={handleClear}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default IuiReport;
