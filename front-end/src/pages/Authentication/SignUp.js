import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
import FormDivider from "../../components/FormDivider";
import AuthCard from "../../components/AuthCard";
import ErrorDialog from "../../components/ErrorDialog";
import RoleSelector from "../../components/RoleSelector";
import ConditionalField from "../../components/ConditionalField";



export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        university: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.role) {
            setError("Please select a role before continuing.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.role === "student" && !formData.university.trim()) {
            setError("University is required for student accounts.");
            return;
        }

        setIsSubmitting(true);

        try {
            const newUserData = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                university: formData.role === "student" ? formData.university : undefined,
            };

            const response = await fetch(`${API_BASE}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserData),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Unable to create account. Please check your details.");
                setIsSubmitting(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/profile");
        } catch (err) {
            setError("Server error while creating account. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <Navbar />

            <AuthCard
                title="Create Your Account"
                subtitle="Find housing near your university today">

                <ConditionalField role={formData.role} showFor={["student", "landlord/agent"]}>
                    <div className="auth-buttons">
                        <button className="btn-secondary">Continue with Google</button>
                        <ConditionalField role={formData.role} showFor="student">
                            <button className="btn-secondary">Continue with University SSO</button>
                        </ConditionalField>
                    </div>

                    <FormDivider text="or sign up with email" />
                </ConditionalField>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <RoleSelector role={formData.role} onRoleChange={(role) => setFormData({ ...formData, role })} required={true} />

                    <ConditionalField role={formData.role} showFor={["student", "landlord/agent"]}>
                        <>
                            <FormInput label="Full Name" type="text" name="fullName" value={formData.fullName}
                                onChange={handleChange} />
                            <FormInput label="Email" type="email" name="email" value={formData.email}
                                onChange={handleChange} />
                            <FormInput label="Password" type="password" name="password" value={formData.password}
                                onChange={handleChange} />
                            <FormInput label="Confirm Password" type="password" name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleChange} />

                            <ConditionalField role={formData.role} showFor="student">
                                <FormInput label="Your University" type="text" name="university"
                                    placeholder="Search your university..." value={formData.university}
                                    onChange={handleChange} />
                            </ConditionalField>

                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </button>
                        </>
                    </ConditionalField>
                </form>
                <ErrorDialog visible={!!error} message={error} onClose={() => setError("")} />

                <ConditionalField role={formData.role} showFor={["student", "landlord/agent"]}>
                    <p className="form-link">
                        Already have an account? <a href="/login">Log In</a>
                    </p>
                </ConditionalField>
            </AuthCard>

            <Footer />
        </div>
    );
}