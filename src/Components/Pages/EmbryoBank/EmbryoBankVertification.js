import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";

const getColumns2 = (doubleColumn, setDoubleColumn, embryoBankState, handleVertChange, index) => {
    return [
        {
            title: "Date of Thawing",
            dataIndex: "date_of_thawing",
            key: "date_of_thawing",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_140">
                        <Form.Item label="" className="m-0 w-100" name={`date_of_thawing_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                            dependencies={[`thawed_by_${record?.ivf_flow_id}_${record?.vitrification_id}`, `status_${record?.ivf_flow_id}_${record?.vitrification_id}`, `no_of_embryo_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`, `date_of_embryo_transfer_${record?.ivf_flow_id}_${record?.vitrification_id}`, `kept_for_blastocyst_${record?.ivf_flow_id}_${record?.vitrification_id}`,
                            `no_of_blastocyst_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`, `batch_no_${record?.ivf_flow_id}_${record?.vitrification_id}`,
                            `expiry_date_${record?.ivf_flow_id}_${record?.vitrification_id}`, `provider_${record?.ivf_flow_id}_${record?.vitrification_id}`, `distance_from_fundus_${record?.ivf_flow_id}_${record?.vitrification_id}`]}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const thawedByValue = getFieldValue(`thawed_by_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const statusValue = getFieldValue(`status_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const noOfEmbryoTransferred = getFieldValue(`no_of_embryo_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const dateOfTransfer = getFieldValue(`date_of_embryo_transfer_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const keptForBlastocyst = getFieldValue(`kept_for_blastocyst_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const noOfBlastocystTransferred = getFieldValue(`no_of_blastocyst_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const batchNo = getFieldValue(`batch_no_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const expiryDate = getFieldValue(`expiry_date_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const provider = getFieldValue(`provider_${record?.ivf_flow_id}_${record?.vitrification_id}`);
                                        const distanceFromFundus = getFieldValue(`distance_from_fundus_${record?.ivf_flow_id}_${record?.vitrification_id}`);

                                        const hasOtherFieldsFilled = thawedByValue || statusValue || noOfEmbryoTransferred || dateOfTransfer ||
                                            keptForBlastocyst || noOfBlastocystTransferred || batchNo || expiryDate || provider || distanceFromFundus;
                                        if (hasOtherFieldsFilled && !value) {
                                            return Promise.reject(new Error(''));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                placeholder="9/11/1997"
                                name={`date_of_thawing_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                }}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.date_of_thawing ? dayjs(
                                    embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.date_of_thawing,
                                    "DD/MM/YYYY"
                                ) : null}
                                onChange={(e) => handleVertChange(index, e ? moment(new Date(e)).format("YYYY-MM-DD") : null, 'date_of_thawing', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div >
                );
            },
        },
        {
            title: "Thawed by",
            dataIndex: "thawed_by",
            key: "thawed_by",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_150">
                        {/* <Form.Item label="" className="m-0 w-100">
                <Input placeholder="112acd" name="male_Partner" />
              </Form.Item> */}
                        <Form.Item className="custom_select m-0 w-100" name={`thawed_by_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Select
                                showSearch
                                allowClear={true}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Select"
                                name={`thawed_by_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.thawed_by || null}
                                onChange={(e) => { handleVertChange(index, e || null, 'thawed_by', record?.vitrification_id, record?.ivf_flow_id) }}
                                options={[
                                    { value: "Dhruti Bhatt", label: "Dhruti Bhatt" },
                                    { value: "Meha Desai", label: "Meha Desai" },
                                    { value: "Priyanka Rajput", label: "Priyanka Rajput" },
                                    { value: "Shraddha Mandaviya", label: "Shraddha Mandaviya" },
                                    { value: "Sapna Trada", label: "Sapna Trada" },
                                    { value: "Other", label: "Other" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },

        ...(embryoBankState?.[index]?.thaw?.some(thaw => thaw.thawed_by === "Other") ? [{
            title: "Thawed by Other",
            dataIndex: "thawed_by_other",
            key: "thawed_by_other",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_170">
                        <Form.Item label="" className="m-0 w-100" name={`thawed_by_other_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input
                                placeholder="Thawed by Other"
                                name={`thawed_by_other_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.thawed_by_other || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'thawed_by_other', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div>
                );
            },
        }] : []),

        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_120">
                        <Form.Item className="custom_select m-0 w-100" name={`status_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Select
                                showSearch
                                allowClear={true}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.label
                                        .toLowerCase()
                                        .localeCompare(optionB.label.toLowerCase())
                                }
                                placeholder="Select"
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.status || null}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                name={`status_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                options={[
                                    { value: "Obtained", label: "Obtained" },
                                    { value: "Lysed", label: "Lysed" },
                                ]}
                                onChange={(e) => handleVertChange(index, e || null, 'status', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "No.of embryo transferred",
            dataIndex: "no_of_embryo_transferred",
            key: "no_of_embryo_transferred",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_170">
                        <Form.Item label="" className="m-0 w-100" name={`no_of_embryo_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input
                                placeholder="Enter number"
                                name={`no_of_embryo_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.no_of_embryo_transferred || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'no_of_embryo_transferred', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Date of Transfer",
            dataIndex: "date_of_embryo_transfer",
            key: "date_of_embryo_transfer",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_140">
                        <Form.Item label="" className="m-0 w-100" name={`date_of_embryo_transfer_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <DatePicker
                                placeholder="9/11/1997"
                                name={`date_of_embryo_transfer_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.date_of_embryo_transfer ? dayjs(
                                    embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.date_of_embryo_transfer,
                                    "DD/MM/YYYY"
                                ) : null}
                                onChange={(e) => handleVertChange(index, e ? moment(new Date(e)).format("YYYY-MM-DD") : null, 'date_of_embryo_transfer', record?.vitrification_id, record?.ivf_flow_id)}
                                format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                }}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Kept for blastocyst",
            dataIndex: "kept_for_blastocyst",
            key: "kept_for_blastocyst",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_140">
                        <Form.Item label="" className="m-0 w-100" name={`kept_for_blastocyst_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input placeholder="112acd" name={`kept_for_blastocyst_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.kept_for_blastocyst || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'kept_for_blastocyst', record?.vitrification_id, record?.ivf_flow_id)} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "No.of blastocyst transferred",
            dataIndex: "no_of_blastocyst_transferred",
            key: "no_of_blastocyst_transferred",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_200">
                        <Form.Item label="" className="m-0 w-100" name={`no_of_blastocyst_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input placeholder="112acd" name={`no_of_blastocyst_transferred_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.no_of_blastocyst_transferred || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'no_of_blastocyst_transferred', record?.vitrification_id, record?.ivf_flow_id)} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Batch No.",
            dataIndex: "batch_no",
            key: "batch_no",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_100">
                        <Form.Item label="" className="m-0 w-100" name={`batch_no_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input placeholder="112acd" name={`batch_no_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.batch_no || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'batch_no', record?.vitrification_id, record?.ivf_flow_id)} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Expiry Date",
            dataIndex: "expiry_date",
            key: "expiry_date",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_140">
                        <Form.Item label="" className="m-0 w-100" name={`expiry_date_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <DatePicker
                                placeholder="9/11/1997"
                                name={`expiry_date_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                }}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.expiry_date ? dayjs(
                                    embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.expiry_date,
                                    "DD/MM/YYYY"
                                ) : null}
                                onChange={(e) => handleVertChange(index, e ? moment(new Date(e)).format("YYYY-MM-DD") : null, 'expiry_date', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Provider",
            dataIndex: "provider",
            key: "provider",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_200">
                        <Form.Item className="custom_select m-0 w-100" name={`provider_${record?.ivf_flow_id}_${record?.vitrification_id}`} >
                            <Select
                                showSearch
                                allowClear={true}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder="Select"
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.provider || ""}
                                onChange={(e) => handleVertChange(index, e || "", 'provider', record?.vitrification_id, record?.ivf_flow_id)}
                                options={[
                                    { value: "Dr. Pooja Singh", label: "Dr. Pooja Singh" },
                                    { value: "Dr. Prabhakar Singh", label: "Dr. Prabhakar Singh" },
                                    { value: "Dhruti Bhatt", label: "Dhruti Bhatt" },
                                    { value: "Meha Desai", label: "Meha Desai" },
                                    { value: "Other", label: "Other" },
                                ]}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },

        ...(embryoBankState?.[index]?.thaw?.some(thaw => thaw.provider === "Other") ? [{
            title: "Provider by Other",
            dataIndex: "provider_by_other",
            key: "provider_by_other",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_170">
                        <Form.Item label="" className="m-0 w-100" name={`provider_by_other_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input
                                placeholder="Provider by Other"
                                name={`provider_by_other_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.provider_by_other || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'provider_by_other', record?.vitrification_id, record?.ivf_flow_id)}
                            />
                        </Form.Item>
                    </div>
                );
            },
        }] : []),

        {
            title: "Distance from fundus(mm)",
            dataIndex: "distance_from_fundus(mm)",
            key: "distance_from_fundus(mm)",
            render: (text, record, index) => {
                return (
                    <div className="table_input_wrap w_220">
                        <Form.Item label="" className="m-0 w-100" name={`distance_from_fundus_${record?.ivf_flow_id}_${record?.vitrification_id}`}>
                            <Input placeholder="45" name={`distance_from_fundus_${record?.ivf_flow_id}_${record?.vitrification_id}`}
                                disabled={!doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                                value={embryoBankState?.[record?.ivf_flow_id]?.[record?.vitrification_id]?.distance_from_fundus || ""}
                                onChange={(e) => handleVertChange(index, e.target.value || "", 'distance_from_fundus', record?.vitrification_id, record?.ivf_flow_id)} />
                        </Form.Item>
                    </div>
                );
            },
        },
    ];
}

export default getColumns2;