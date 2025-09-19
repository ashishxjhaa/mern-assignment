
function validateRow(row) {
    const { FirstName, Phone, Notes } = row;

    if (!FirstName || typeof FirstName !== "string") {
        return "Invalid or missing firstName";
    }

    if (!Phone || !phoneRegex.test(Phone)) {
        return "Invalid or missing phoneNumber";
    }

    if (!Notes || typeof Notes !== "string") {
        return "Invalid or missing notes";
    }

    return null;
}

export default validateRow;
