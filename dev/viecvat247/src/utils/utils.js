import dayjs from "dayjs";

const validatePassword = (inputPassword) => {
    const uppercaseRegex = /[A-Z]/;

    const lowercaseRegex = /[a-z]/;

    const digitRegex = /\d/;

    const specialCharRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/;

    const minLength = 8;

    return inputPassword.length >= minLength && uppercaseRegex.test(inputPassword) && lowercaseRegex.test(inputPassword) && digitRegex.test(inputPassword) && specialCharRegex.test(inputPassword);
};

const isValidImageUrl = (url) => {
    const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/i;
    return imageUrlRegex.test(url);
};

const calculateTimeAgo = (isoTime) => {
    const currentTime = dayjs();
    const providedTime = dayjs(isoTime);

    const minutesAgo = currentTime.diff(providedTime, "minute");
    const hoursAgo = currentTime.diff(providedTime, "hour");
    const daysAgo = currentTime.diff(providedTime, "day");

    if (minutesAgo < 1) {
        return "Vừa xong";
    } else if (minutesAgo < 60) {
        return `${minutesAgo} phút trước`;
    } else if (hoursAgo < 24) {
        return `${hoursAgo} giờ trước`;
    } else if (daysAgo === 1) {
        return "Hôm qua";
    } else if (daysAgo < 30) {
        return `${daysAgo} ngày trước`;
    } else {
        return providedTime.format("DD/MM/YYYY");
    }
};

const convertText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + " ...";
    }
    return text;
};

export const utils = {
    validatePassword,
    isValidImageUrl,
    calculateTimeAgo,
    convertText,
};
