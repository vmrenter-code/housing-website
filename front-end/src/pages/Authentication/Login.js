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



export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: "",
        email: "",
        password: "",
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
            setError("Please select a role before logging in.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.message || "Invalid credentials. Please try again.");
                setIsSubmitting(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/profile");
        } catch (err) {
            setError("Server error while logging in. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <Navbar />
            <AuthCard
                title="Log In to Your Account"
                subtitle="Welcome back! Please enter your details.">

                <form className="auth-form" onSubmit={handleSubmit}>
                    <RoleSelector role={formData.role} onRoleChange={(role) => setFormData({ ...formData, role })} required={true} />

                    <ConditionalField role={formData.role} showFor={["student", "landlord/agent"]}>
                        <>
                            <div className="auth-buttons">
                                <button type="button" className="btn-secondary">Continue with Google</button>
                                <ConditionalField role={formData.role} showFor="student">
                                    <button type="button" className="btn-secondary">Continue with University SSO</button>
                                </ConditionalField>
                            </div>

                            <FormDivider text="or log in with email" />

                            <FormInput label="Email" type="email" name="email" value={formData.email}
                                onChange={handleChange} required={true} />
                            <FormInput label="Password" type="password" name="password" value={formData.password}
                                onChange={handleChange} required={true} />
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </button>

                            <p className="form-link">
                                Don't have an account? <a href="/signup">Sign Up</a>
                            </p>
                        </>
                    </ConditionalField>
                </form>
                <ErrorDialog visible={!!error} message={error} onClose={() => setError("")} />
            </AuthCard>
            <Footer />
        </div>
    );
}