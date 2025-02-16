import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Spin,
} from "antd";

import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { addEmbryoBankData, getEmbryoBankData, setEmbryoBankDetailsData } from "redux/reducers/EmbryoBank/embryoBank.slice";
import { ageCalculate } from "utils/CommonFunctions";
import dayjs from "dayjs";
import EmbryoBankFormItems from "./EmbryoBankFormItems";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import { setSelectedPatient } from "redux/reducers/common.slice";

export default function EmbryoBank() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const [doubleColumn, setDoubleColumn] = useState({
    isDoubleColumn: true,
    isDoubleColumnID: [],
    isVetrificationID: []
  });
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { selectedPatient } = useSelector(
    ({ common }) => common
  );
  const { embryoBankDetails, embryoBankLoading } = useSelector(
    ({ embryoBank }) => embryoBank
  );
  const selectedModule = useMemo(() => {
    let module = moduleList?.find(
      (mod) => mod.module_name === location?.pathname
    );
    if (!module) {
      moduleList.forEach((mod) => {
        if (mod.submenu) {
          const subModule = mod.submenu.find(
            (sub) => sub.module_name === location?.pathname
          );
          if (subModule) {
            // module = { ...subModule };
            module = mod;
          }
        }
      });
    }
    return module ? module : null;
  }, [moduleList, location?.pathname]);

  const initialEmbryoBankData = useCallback(() => {
    const dynamicFields = {};
    if (Array.isArray(embryoBankDetails)) {
      embryoBankDetails.forEach((item, index) => {
        dynamicFields[index] = {
          ivf_flow_id: embryoBankDetails[index]?.ivf_flow_id,
          thawing_media: embryoBankDetails[index]?.vitrification_data?.thawing_media || null,
          transfer_media: embryoBankDetails[index]?.vitrification_data?.transfer_media || null,
          introducer: embryoBankDetails[index]?.vitrification_data?.introducer || null,
          catheter: embryoBankDetails[index]?.vitrification_data?.catheter || null,
          notes: embryoBankDetails[index]?.vitrification_data?.notes || '',
          introducer_other: embryoBankDetails[index]?.vitrification_data?.introducer_other || '',
          no_of_straw_thawed: embryoBankDetails[index]?.vitrification_data?.no_of_straw_thawed || '',
          thaw: [],
        };

        if (item?.embryology_data) {
          item.embryology_data.forEach((subItem) => {

            const vitrificationData = embryoBankDetails[index]?.vitrification_data?.embryo_bank_vitrification_data;
            const vitrificationIds = vitrificationData?.map(vitrItem => vitrItem?.vitrification_id);

            const subItemMap = vitrificationIds?.includes(subItem?.vitrification_id || "")
              ? vitrificationData.find(vitrItem => vitrItem?.vitrification_id === subItem?.vitrification_id)
              : {};

            dynamicFields[index]?.thaw?.push({
              ivf_flow_id: subItem?.ivf_flow_id,
              vitrification_id: subItem?.vitrification_id,
              no_of_embryo_transferred: subItemMap?.no_of_embryo_transferred || '',
              date_of_thawing: subItemMap?.date_of_thawing || null,
              thawed_by: subItemMap?.thawed_by || null,
              status: subItemMap?.status || null,
              date_of_embryo_transfer: subItemMap?.date_of_embryo_transfer || null,
              kept_for_blastocyst: subItemMap?.kept_for_blastocyst || '',
              no_of_blastocyst_transferred: subItemMap?.no_of_blastocyst_transferred || '',
              batch_no: subItemMap?.batch_no || '',
              expiry_date: subItemMap?.expiry_date || null,
              provider: subItemMap?.provider || null,
              provider_other: subItemMap?.provider_other || "",
              thawed_by_other: subItemMap?.thawed_by_other || "",
              distance_from_fundus: subItemMap?.distance_from_fundus || '',
            });
          });
        }
      });
    }

    return dynamicFields;
  }, [embryoBankDetails]);

  const initalFormValues = useMemo(() => {
    return Object.entries(initialEmbryoBankData())?.reduce((acc, [index, item]) => {
      acc[`introducer_${index}`] = item.introducer;
      acc[`catheter_${index}`] = item.catheter;
      acc[`notes_${index}`] = item.notes;
      acc[`introducer_other_${index}`] = item.introducer_other;
      acc[`thawing_media_${index}`] = item.thawing_media;
      acc[`transfer_media_${index}`] = item.transfer_media;
      acc[`total_straw_thawed_${index}`] = item.total_straw_thawed;

      item?.thaw?.forEach(embryo => {
        acc[`no_of_embryo_transferred_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.no_of_embryo_transferred;
        acc[`date_of_thawing_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.date_of_thawing ? dayjs(embryo.date_of_thawing, "YYYY-MM-DD") : null;
        acc[`thawed_by_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.thawed_by;
        acc[`status_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.status;
        acc[`date_of_embryo_transfer_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.date_of_embryo_transfer ? dayjs(embryo.date_of_embryo_transfer, "YYYY-MM-DD") : null;
        acc[`kept_for_blastocyst_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.kept_for_blastocyst;
        acc[`no_of_blastocyst_transferred_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.no_of_blastocyst_transferred;
        acc[`batch_no_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.batch_no;
        acc[`expiry_date_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.expiry_date ? dayjs(embryo.expiry_date, "YYYY-MM-DD") : null;
        acc[`provider_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.provider;
        acc[`provider_other_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.provider_other;
        acc[`thawed_by_other_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.thawed_by_other;
        acc[`distance_from_fundus_${embryo.ivf_flow_id}_${embryo.vitrification_id}`] = embryo.distance_from_fundus;
      });
      return acc;
    }, {});
  }, [initialEmbryoBankData]);

  const [embryoBankState, setEmbryoBankState] = useState(initialEmbryoBankData());

  const removeNullThawObjects = (embryoBankState) => {
    const newState = {};

    Object?.keys(embryoBankState)?.forEach(itemKey => {
      const newThawArray = embryoBankState[itemKey]?.thaw?.filter(thawItem => thawItem?.date_of_thawing !== null);
      if (newThawArray?.length > 0) {
        newState[itemKey] = {
          ...embryoBankState[itemKey],
          thaw: newThawArray
        };
      }
    });
    return newState;
  };

  const onFinishFailed = useCallback((errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

  const onFinish = useCallback(
    async () => {
      if (
        selectedLocation &&
        Object.keys(selectedPatient)?.length > 0 &&
        Object.keys(selectedModule)?.length > 0
      ) {
        const payload = {
          vitrification_data: Object?.values(removeNullThawObjects(embryoBankState))
        }
        const response = await dispatch(addEmbryoBankData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          payload: payload
        }))
        if (response?.payload?.length) {
          getNewSelectedPatientData();
        }
      }
    },
    [dispatch, embryoBankState, getNewSelectedPatientData, selectedLocation, selectedModule, selectedPatient],
  )

  useEffect(() => {
    if (embryoBankDetails?.length) {
      setEmbryoBankState(initialEmbryoBankData)
      form.setFieldsValue(initalFormValues);
      return () => {
        dispatch(setEmbryoBankDetailsData({}))
        setEmbryoBankState({})
        form.setFieldsValue({})
      };
    }
  }, [embryoBankDetails, initialEmbryoBankData, dispatch, form, initalFormValues]);


  const callEmbryoBankAPI = useCallback(async () => {
    try {
      await dispatch(
        getEmbryoBankData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
        })
      )
    } catch (error) {
      console.error('error', error)
    }
  }, [dispatch, selectedLocation, selectedPatient?._id, selectedModule?._id]);


  useEffect(() => {
    if (
      selectedLocation &&
      selectedPatient && Object.keys(selectedPatient)?.length > 0 &&
      selectedModule && Object.keys(selectedModule)?.length > 0 &&
      window.location.pathname === '/embryo-bank'
    ) {
      callEmbryoBankAPI()
    }
    return () => {
      dispatch(setEmbryoBankDetailsData({}))
      setEmbryoBankState({})
      form.setFieldsValue({})
    };
  }, [selectedPatient, selectedLocation, dispatch, selectedModule, callEmbryoBankAPI, form]);

  const handleVertChange = (index, value, name, id = false, ivfid = false) => {
    if (id) {
      Object.keys(embryoBankState).forEach((key) => {
        if (embryoBankState[key].ivf_flow_id === ivfid) {
          index = key;
        }
      });
      let obj = {};
      obj[`${name}_${index}_${id}`] = value;
      form.setFieldsValue({
        ...obj,
      });
      setEmbryoBankState(prevState => ({
        ...prevState,
        [index]: {
          ...prevState[index],
          thaw: prevState[index]?.thaw?.map(item =>
            item.vitrification_id === id ? { ...item, [name]: value } : item
          )
        }
      }));
    } else {
      let obj = {};
      obj[`${name}_${index}`] = value;
      form.setFieldsValue({
        ...obj,
      });
      setEmbryoBankState(prevState => ({
        ...prevState,
        [index]: {
          ...prevState[index],
          [name]: value
        }
      }));
    }
  }

  const handleCancel = useCallback((e) => {
    e.preventDefault();
    setEmbryoBankState({});
    form.resetFields();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  }, [form, dispatch])

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(embryoBankLoading) && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}

        {!embryoBankDetails?.length && (
          <h1 style={{ textAlign: 'center', color: 'white' }} className="mt-5">Vitrification ID Not Available</h1>
        )}

        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <EmbryoBankFormItems selectedPatient={selectedPatient} ageCalculate={ageCalculate} embryoBankDetails={embryoBankDetails} doubleColumn={doubleColumn} setDoubleColumn={setDoubleColumn} embryoBankState={embryoBankState} handleVertChange={handleVertChange} />
          {embryoBankDetails?.length > 0 && (
            <div className="button_group d-flex align-items-center justify-content-center mt-4">
              {Object.keys(embryoBankState)?.length > 0
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
            </div>
          )}
        </Form>
      </div>
    </div >
  );
}