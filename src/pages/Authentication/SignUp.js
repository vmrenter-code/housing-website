import React, {useState} from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
import FormDivider from "../../components/FormDivider";
import AuthCard from "../../components/AuthCard";


export default function SignUp() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        university: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
    };

    return (
        <div className="signup-container">
            <Navbar/>

            <AuthCard
                title="Create Your Account"
                subtitle="Find housing near your university today">

                <div className="auth-buttons">
                    <button className="btn-secondary">Continue with Google</button>
                    <button className="btn-secondary">Continue with University SSO</button>
                </div>

                <FormDivider text="or sign up with email"/>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <FormInput label="Full Name" type="text" name="fullName" value={formData.fullName}
                               onChange={handleChange}/>
                    <FormInput label="University Email" type="email" name="email" value={formData.email}
                               onChange={handleChange}/>
                    <FormInput label="Password" type="password" name="password" value={formData.password}
                               onChange={handleChange}/>
                    <FormInput label="Confirm Password" type="password" name="confirmPassword"
                               value={formData.confirmPassword} onChange={handleChange}/>
                    <FormInput label="Your University" type="text" name="university"
                               placeholder="Search your university..." value={formData.university}
                               onChange={handleChange}/>
                    <button type="submit" className="btn-primary">Create Account</button>
                </form>

                <p className="form-link">
                    Already have an account? <a href="/login">Log In</a>
                </p>
            </AuthCard>

            <Footer/>
        </div>
    );
}