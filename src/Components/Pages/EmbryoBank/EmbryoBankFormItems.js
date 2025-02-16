import { Button, Form, Input, Select, Table } from 'antd'
import { memo } from 'react'
import { freezingMediaOptions } from 'utils/FieldValues'
import getColumns from "./EmbryoBankStaticData";
import getColumns2 from "./EmbryoBankVertification";
import DownArrow from "../../../Img/right-arrow.svg";

const EmbryoBankFormItems = ({ selectedPatient, ageCalculate, embryoBankDetails, doubleColumn, setDoubleColumn, embryoBankState, handleVertChange }) => {
    return (
        <div className="form_process_wrapper">
            {embryoBankDetails?.length > 0 && (
                <div className="form_info_wrapper filled">
                    <div className="patient_detail_wrap">
                        <ul>
                            <li>
                                <label>Patient Name :</label>
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
                                <label>Partner Name :</label>
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
                            <li>
                                <label>Patient ID :</label>
                                <span>
                                    {selectedPatient?.patient_id
                                        ? selectedPatient?.patient_id
                                        : ""}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {embryoBankDetails?.length && embryoBankDetails?.map((mainItem, index) => {
                return (
                    <div className="form_info_wrapper filled">
                        <div className="double_column_wrapper">
                            <div
                                className={`double_column_inner ${!doubleColumn?.isDoubleColumn && doubleColumn?.isDoubleColumnID.includes(mainItem._id)
                                    ? "double_column_scale"
                                    : ""
                                    }`}
                            >
                                <h3 className="mb-3">Vitrification Details IVF ID - {mainItem?.ivf_id}</h3>
                                <ul className="grid_wrapper">
                                    <li className="w_200 w_xs_100">
                                        <Form.Item
                                            label="Freezing Media"
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
                                                value={freezingMediaOptions.find(item => item.value === mainItem?.freezing_media)?.value || null}
                                                options={freezingMediaOptions}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_200 w_xs_100">
                                        <Form.Item label="Batch No. & Expiry Date">
                                            <Input placeholder="30" name="vitrification_batch_no_exp_date" value={mainItem?.vitrification_batch_no_exp_date || ""} disabled={true} />
                                        </Form.Item>
                                    </li>
                                    {/* <li className="w_250 w_xs_100">
                    <Form.Item label="Expiry Date">
                      <TimePicker name="opu_time" format="h:mm a" />
                    </Form.Item>
                  </li> */}
                                    <li className="w_250 w_xs_100">
                                        <Form.Item label="Virtification Device">
                                            <Input placeholder="Virtification Device" value={mainItem?.vitrification_devices || ""} disabled={true} />
                                        </Form.Item>
                                    </li>
                                    <li className="w_150 w_xs_100">
                                        <Form.Item label="Total No. of Goblet">
                                            <div className="default_value_wrap">
                                                <span>{mainItem?.total_goblet || 0}</span>
                                            </div>
                                        </Form.Item>
                                    </li>
                                    <li className="w_150 w_xs_100">
                                        <Form.Item label="Total No. of Straws">
                                            <div className="default_value_wrap">
                                                <span>{mainItem?.total_straw || 0}</span>
                                            </div>
                                        </Form.Item>
                                    </li>
                                    <li className="w_150 w_xs_100">
                                        <Form.Item label="Tank No.">
                                            <div className="default_value_wrap">
                                                <span>{mainItem?.tank_no || 0}</span>
                                            </div>
                                        </Form.Item>
                                    </li>
                                    <li className="w_150 w_xs_100">
                                        <Form.Item label="Cannister No.">
                                            <div className="default_value_wrap">
                                                <span>{mainItem?.cannister_no || 0}</span>
                                            </div>
                                        </Form.Item>
                                    </li>
                                </ul>
                                <div className="cmn_table_wrap pb-3">
                                    <Table
                                        columns={getColumns(doubleColumn, setDoubleColumn)}
                                        dataSource={mainItem?.embryology_data?.map((item, index) => {
                                            return { ...item, main_key: mainItem._id, sub_key: mainItem._id, key: index }
                                        })}
                                        pagination={false}
                                    />
                                </div>
                            </div>
                            <div
                                className={`double_column_inner ${!doubleColumn?.isDoubleColumn && doubleColumn?.isDoubleColumnID.includes(mainItem._id)
                                    ? "right_column_show double_column_scale"
                                    : "right_column_none "
                                    }`}
                            >
                                <div className="form_info_wrapper filled">
                                    <div className="return_btn_wrap mb-3">
                                        <Button
                                            className="default_btn"
                                            onClick={() => {
                                                setDoubleColumn({
                                                    isDoubleColumn: doubleColumn?.isDoubleColumnID?.length === 0,
                                                    isDoubleColumnID: doubleColumn?.isDoubleColumnID?.filter((item) => item !== mainItem._id),
                                                    isVetrificationID: doubleColumn?.isVetrificationID?.filter(id => !mainItem?.embryology_data.some(item => item.vitrification_id === id))
                                                });
                                            }}
                                        >
                                            <img src={DownArrow} alt="" />
                                        </Button>
                                        <h3 className="mb-0">Vitrification Details IVF ID - {mainItem?.ivf_id}</h3>
                                    </div>
                                    <ul className="grid_wrapper">

                                        <li className="w_170 w_xs_100">
                                            <Form.Item
                                                label="Thawing Media"
                                                className="custom_select"
                                                name={`thawing_media_${index}`}
                                                dependencies={[`transfer_media_${index}`, `introducer_${index}`, `catheter_${index}`, `notes_${index}`]}
                                                // rules={[
                                                //     ({ getFieldValue }) => ({
                                                //         required:
                                                //             (getFieldValue(`transfer_media_${index}`) !== null && getFieldValue(`transfer_media_${index}`) !== undefined) ||
                                                //             (getFieldValue(`introducer_${index}`) !== null && getFieldValue(`introducer_${index}`) !== undefined) ||
                                                //             (getFieldValue(`catheter_${index}`) !== null && getFieldValue(`catheter_${index}`) !== undefined) ||
                                                //             (getFieldValue(`notes_${index}`) !== "" && getFieldValue(`notes_${index}`) !== undefined),
                                                //         message: "",
                                                //     }),
                                                // ]}
                                                rules={[
                                                    {
                                                        required: doubleColumn?.isDoubleColumnID.includes(mainItem._id),
                                                        message: "Thawing Media is Required"
                                                    }
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    allowClear={true}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    placeholder="Select"
                                                    name={`thawing_media_${index}`}
                                                    options={[
                                                        { value: "Cryotech", label: "Cryotech" },
                                                        { value: "Kitazato", label: "Kitazato" },
                                                        { value: "Origio", label: "Origio" },
                                                        { value: "Other", label: "Other" },
                                                    ]}
                                                    onChange={(e) => {
                                                        handleVertChange(index, e || null, "thawing_media");
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>


                                        <li className="w_170 w_xs_100">
                                            <Form.Item
                                                label="Transfer Media"
                                                className="custom_select"
                                                name={`transfer_media_${index}`}
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
                                                    placeholder="Select"
                                                    name={`transfer_media_${index}`}
                                                    options={[
                                                        { value: "Sage", label: "Sage" },
                                                        { value: "Vitromed", label: "Vitromed" },
                                                        { value: "Vitrolife", label: "Vitrolife" },
                                                        { value: "Cook's", label: "Cook's" },
                                                        { value: "Other", label: "Other" }
                                                    ]}
                                                    onChange={(e) => {
                                                        handleVertChange(
                                                            index,
                                                            e || null,
                                                            "transfer_media"
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>

                                        <li className="w_250 w_xs_100">
                                            <Form.Item label="Introducer" className="custom_select" name={`introducer_${index}`}>
                                                <Select
                                                    showSearch
                                                    allowClear={true}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.label
                                                            .toLowerCase()
                                                            .indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    placeholder="Select"
                                                    name={`introducer_${index}`}
                                                    options={[
                                                        { value: "Dr. Yuvarajsinh Jadeja", label: "Dr. Yuvarajsinh Jadeja" },
                                                        { value: "Pooja Singh", label: "Pooja Singh" },
                                                        { value: "Dr. Birva Dave", label: "Dr. Birva Dave" },
                                                        { value: "Other", label: "Other" },
                                                    ]}
                                                    onChange={(e) => {
                                                        handleVertChange(
                                                            index,
                                                            e || null,
                                                            "introducer"
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>

                                        {embryoBankState?.[index]?.introducer === "Other" && (
                                            <li className="w_250 w_xs_100">
                                                <Form.Item label="Introducer Other" name={`introducer_other_${index}`}>
                                                    <Input
                                                        placeholder="Introducer Other"
                                                        name={`introducer_other_${index}`}
                                                        value={embryoBankState?.[index]?.introducer_other || ""}
                                                        onChange={(e) => {
                                                            handleVertChange(
                                                                index,
                                                                e.target.value || "",
                                                                "introducer_other"
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </li>
                                        )}

                                        <li className="w_170 w_xs_100">
                                            <Form.Item label="Catheter" className="custom_select" name={`catheter_${index}`}>
                                                <Select
                                                    showSearch
                                                    allowClear={true}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.label
                                                            .toLowerCase()
                                                            .indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    placeholder="Select"
                                                    name={`catheter_${index}`}
                                                    options={[
                                                        { value: "Wallace", label: "Wallace" },
                                                        { value: "Obturator/Allwin", label: "Obturator/Allwin" },
                                                        { value: "Cook-Sydney", label: "Cook-Sydney" },
                                                        { value: "Other", label: "Other" },
                                                    ]}
                                                    onChange={(e) => {
                                                        handleVertChange(
                                                            index,
                                                            e || null,
                                                            "catheter"
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_220 w_xs_100">
                                            <Form.Item label="Total No. of Straws thawed" name={`no_of_straw_thawed_${index}`}>
                                                <div className="default_value_wrap">
                                                    <span>{embryoBankState?.[index]?.no_of_straw_thawed || 0}</span>
                                                </div>
                                            </Form.Item>
                                        </li>

                                        <li className="w_250 w_xs_100">
                                            <Form.Item label="Notes" name={`notes_${index}`}>
                                                <Input
                                                    placeholder="Notes"
                                                    name={`notes_${index}`}
                                                    value={embryoBankState?.[index]?.notes || ""}
                                                    onChange={(e) => {
                                                        handleVertChange(
                                                            index,
                                                            e.target.value || "",
                                                            "notes"
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>

                                    </ul>
                                    <div className="cmn_table_wrap pb-3">
                                        <Table
                                            columns={getColumns2(doubleColumn, setDoubleColumn, embryoBankState, handleVertChange, index)}
                                            dataSource={mainItem.embryology_data.map((item, index) => {
                                                return { ...item, main_key: mainItem._id, key: index }
                                            })}
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default memo(EmbryoBankFormItems)
