import React, {useState} from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
import FormDivider from "../../components/FormDivider";
import AuthCard from "../../components/AuthCard";
import RoleSelector from "../../components/RoleSelector";
import ConditionalField from "../../components/ConditionalField";


export default function Login() {
    const [formData, setFormData] = useState({
        role: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login form submitted:", formData);
    };

    return (
        <div className="login-container">
            <Navbar/>
            <AuthCard
                title="Log In to Your Account"
                subtitle="Welcome back! Please enter your details.">

                <form className="auth-form" onSubmit={handleSubmit}>
                    <RoleSelector role={formData.role} onRoleChange={(role) => setFormData({...formData, role})} required={true} />
                    
                    <ConditionalField role={formData.role} showFor={["tenant", "landlord"]}>
                        <>
                            <div className="auth-buttons">
                                <button type="button" className="btn-secondary">Continue with Google</button>
                                <ConditionalField role={formData.role} showFor="tenant">
                                    <button type="button" className="btn-secondary">Continue with University SSO</button>
                                </ConditionalField>
                            </div>

                            <FormDivider text="or log in with email"/>

                            <FormInput label="Email" type="email" name="email" value={formData.email}
                                       onChange={handleChange}/>
                            <FormInput label="Password" type="password" name="password" value={formData.password}
                                       onChange={handleChange}/>
                            <button type="submit" className="btn-primary">Log In</button>

                            <p className="form-link">
                                Don't have an account? <a href="/signup">Sign Up</a>
                            </p>
                        </>
                    </ConditionalField>
                </form>
            </AuthCard>
            <Footer/>
        </div>
    );
}