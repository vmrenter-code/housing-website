import React, {useState} from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UserHeader from "../../components/UserHeader";
import ProfileTabs from "../../components/ProfileTabs";
import HousingPreferences from "../../components/HousingPreferences";
import NotificationSettings from "../../components/NotificationSettings";
import "./Profile.css";


export default function Profile() {
    // Mock user data
    const [user] = useState({
        name: 'Amazing Student',
        email: 'anteater@uci.edu',
        school: 'UC Irvine'
    });
    const [activeTab, setActiveTab] = useState('Preferences');

    return (
        <div className="profile-page">
            <Navbar/>

            <main className="profile-content">
                <UserHeader user={user}/>
                <ProfileTabs activeTab={activeTab} onTabClick={setActiveTab}/>
                {activeTab === 'Preferences' && (
                    <div className="settings-grid">
                        <HousingPreferences/>
                        <NotificationSettings/>
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}