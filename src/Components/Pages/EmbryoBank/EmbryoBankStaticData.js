import { Button, DatePicker, Form, Input, Select } from "antd";
import moment from "moment";
import { freezingMediaOptions } from "utils/FieldValues";

const getColumns = (doubleColumn, setDoubleColumn) => {
    return [
        {
            title: "Date of freezing",
            dataIndex: "date_of_freezing",
            key: "date_of_freezing",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_150 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item label="" className="m-0 w-100">
                            <DatePicker
                                placeholder="9/11/1997"
                                name="opu_date"
                                format={{
                                    format: "DD-MM-YYYY",
                                    type: "mask",
                                }}
                                value={record.date_of_freezing ? moment(record?.date_of_freezing) : null}
                                disabled={true}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Vitrification ID (Straw ID)",
            dataIndex: "vitrification_id",
            key: "vitrification_id",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item label="" className="m-0 w-100">
                            <Input placeholder="" name="vitrification_id" value={record?.vitrification_id || ""} disabled={true} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "No. of Embryo",
            dataIndex: "no_of_embryo",
            key: "no_of_embryo",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_120 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item label="" className="m-0 w-100">
                            <Input placeholder="45" name="no_of_embryo" value={record?.no_of_embryo || ""} disabled={true} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Stage",
            dataIndex: "stage",
            key: "stage",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_120 ${record?.is_thawed ? "red_row_wrapper" : ""}`} >
                        <Form.Item className="custom_select m-0 w-100">
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
                                name="freezing-media"
                                value={record?.stage || null}
                                disabled={true}
                                options={freezingMediaOptions}
                            />
                        </Form.Item>
                    </div >
                );
            },
        },
        {
            title: "Grade/Score",
            dataIndex: "grade_or_score",
            key: "grade_or_score",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_120 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item label="" className="m-0 w-100">
                            <Input placeholder="45" name="male_Partner" value={record?.grade_or_score || ""} disabled={true} />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Color of straw",
            dataIndex: "color_of_straw",
            key: "color_of_straw",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_120 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item className="custom_select m-0 w-100">
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
                                name="freezing-media"
                                className="color_select"
                                value={record?.straw_color || null}
                                disabled={true}
                                options={freezingMediaOptions}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Color of Goblet",
            dataIndex: "color_of_goblet",
            key: "color_of_goblet",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_150 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item className="custom_select m-0 w-100">
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
                                name="freezing-media"
                                value={record?.goblet_color || null}
                                className="color_select"
                                disabled={true}
                                options={freezingMediaOptions}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },
        {
            title: "Vitrified by",
            dataIndex: "vitrified_by",
            key: "vitrified_by",
            render: (text, record, index) => {
                return (
                    <div className={`table_input_wrap w_220 ${record?.is_thawed ? "red_row_wrapper" : ""}`}>
                        <Form.Item className="custom_select m-0 w-100">
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
                                name="freezing-media"
                                value={record?.vitrified_by || null}
                                disabled={true}
                                options={freezingMediaOptions}
                            />
                        </Form.Item>
                    </div>
                );
            },
        },

        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Button
                        htmlType="login"
                        className={`w-100  mb-0 ${record?.vitrification_id?.length && doubleColumn?.isVetrificationID?.includes(record?.vitrification_id) ? "btn_gray" : "btn_danger"}`}
                        // onClick={handleSendResetLink}
                        onClick={(e) => {
                            e.preventDefault()
                            setDoubleColumn({
                                isDoubleColumn: false,
                                isDoubleColumnID: [...doubleColumn?.isDoubleColumnID, record.main_key],
                                isVetrificationID: [...doubleColumn?.isVetrificationID, record.vitrification_id],
                            });
                        }}
                        disabled={doubleColumn?.isVetrificationID.includes(record?.vitrification_id)}
                    >
                        THAW
                    </Button>
                );
            },
        },
    ]
}

export default getColumns;