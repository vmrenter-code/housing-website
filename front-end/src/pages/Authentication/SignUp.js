import React, {useState} from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
import FormDivider from "../../components/FormDivider";
import AuthCard from "../../components/AuthCard";
import RoleSelector from "../../components/RoleSelector";
import ConditionalField from "../../components/ConditionalField";


export default function SignUp() {
    const [formData, setFormData] = useState({
        role: "",
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

                <ConditionalField role={formData.role} showFor={["tenant", "landlord"]}>
                    <div className="auth-buttons">
                        <button className="btn-secondary">Continue with Google</button>
                        <ConditionalField role={formData.role} showFor="tenant">
                            <button className="btn-secondary">Continue with University SSO</button>
                        </ConditionalField>
                    </div>

                    <FormDivider text="or sign up with email"/>
                </ConditionalField>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <RoleSelector role={formData.role} onRoleChange={(role) => setFormData({...formData, role})} required={true} />
                    
                    <ConditionalField role={formData.role} showFor={["tenant", "landlord"]}>
                        <>
                            <FormInput label="Full Name" type="text" name="fullName" value={formData.fullName}
                                       onChange={handleChange}/>
                            <FormInput label="Email" type="email" name="email" value={formData.email}
                                       onChange={handleChange}/>
                            
                            <ConditionalField role={formData.role} showFor="tenant">
                                <FormInput label="University Email (Optional)" type="email" name="universityEmail" 
                                           placeholder="your.name@university.edu"/>
                            </ConditionalField>

                            <FormInput label="Password" type="password" name="password" value={formData.password}
                                       onChange={handleChange}/>
                            <FormInput label="Confirm Password" type="password" name="confirmPassword"
                                       value={formData.confirmPassword} onChange={handleChange}/>
                            
                            <ConditionalField role={formData.role} showFor="tenant">
                                <FormInput label="Your University" type="text" name="university"
                                           placeholder="Search your university..." value={formData.university}
                                           onChange={handleChange}/>
                            </ConditionalField>

                            <button type="submit" className="btn-primary">Create Account</button>
                        </>
                    </ConditionalField>
                </form>

                <ConditionalField role={formData.role} showFor={["tenant", "landlord"]}>
                    <p className="form-link">
                        Already have an account? <a href="/login">Log In</a>
                    </p>
                </ConditionalField>
            </AuthCard>

            <Footer/>
        </div>
    );
}