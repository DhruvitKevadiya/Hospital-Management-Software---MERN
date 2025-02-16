import moment from "moment";
import _ from "lodash";

export function diffYMD(date1, date2) {
  let years = date1.diff(date2, "years");
  date2.add(years, "years");
  let month = date1.diff(date2, "month");
  date2.add(month, "month");
  let days = date1.diff(date2, "days");
  return `${years}Y,` + ` ${month}M,` + ` ${days}D`;
}

export const ageCalculatorFunc = (dateOfBirth) => {
  const currentDate = moment();
  const dob = moment(new Date(dateOfBirth));
  const patientAge = diffYMD(currentDate, dob) || null;
  return patientAge;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const ageCalculate = (dateOB) => {
  const currentDate = moment();
  const dob = moment(dateOB);
  const years = currentDate.diff(dob, "years");
  return `${years}Y`;
};

export const generateUniqueId = () => {
  const timestamp = new Date().getTime().toString(16);
  const randomPart = Math.random().toString(16).substr(2, 12);
  return timestamp + randomPart;
};

export const generateSmilarFieldsObject = (baseObject, comparedObject) => {
  let updatedObject = {};

  const fieldsToRemove = Object.keys(baseObject)
    ?.map((field) => {
      if (!comparedObject.hasOwnProperty(field)) {
        return field;
      }
    })
    ?.filter((item) => item);

  if (fieldsToRemove?.length) {
    updatedObject = _.omit(baseObject, fieldsToRemove);
  }

  return updatedObject;
};

export const normalizeDateFormat = (dateString) => {
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return moment(dateString, "DD-MM-YYYY").format("YYYY-MM-DD");
  }
  return moment(dateString).format("YYYY-MM-DD");
};