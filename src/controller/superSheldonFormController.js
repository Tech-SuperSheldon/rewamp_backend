const SuperSheldonForm = require("../model/superSheldonForm");

const submitForm = async (req, res) => {
    try {
        console.log("Form submission received:", req.body);
        
        // Validate required fields
        const { fullName, email, mobile, childAgeYear, subject } = req.body;
        
        if (!fullName || !email || !mobile || !childAgeYear || !subject) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }

        // Create new document in DB
        const formData = await SuperSheldonForm.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.toString(),
            childAgeYear: childAgeYear.trim(),
            subject: subject
        });
        
        console.log("Form saved successfully to MongoDB:", formData);
        
        res.status(200).json({
            data: formData,
            status: 200,
            message: "Form submitted successfully"
        });
    } catch (err) {
        console.error("Error saving form:", err);
        res.status(400).json({
            status: 400,
            message: "Error: " + (err.message || "Failed to save form data")
        });
    }
};

module.exports = submitForm;

