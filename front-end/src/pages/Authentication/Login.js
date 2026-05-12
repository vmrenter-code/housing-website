import React, {useState} from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FormInput from "../../components/FormInput";
import FormDivider from "../../components/FormDivider";
import AuthCard from "../../components/AuthCard";


export default function Login() {
    const [formData, setFormData] = useState({
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

                <div className="auth-buttons">
                    <button className="btn-secondary">Continue with Google</button>
                    <button className="btn-secondary">Continue with University SSO</button>
                </div>

                <FormDivider text="or log in with email"/>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <FormInput label="University Email" type="email" name="email" value={formData.email}
                               onChange={handleChange}/>
                    <FormInput label="Password" type="password" name="password" value={formData.password}
                               onChange={handleChange}/>
                    <button type="submit" className="btn-primary">Log In</button>
                </form>

                <p className="form-link">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </AuthCard>
            <Footer/>
        </div>
    );
}