import Popup from "reactjs-popup";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, doc, getDoc, collection, getFirestore } from "firebase/firestore";
import Sidebar from '../Sidebar';
import '../CSS/Dashboard.css'
// Assuming the CSS is in src/index.css or directly in the same file for this example
// For a real project, you would typically have a separate CSS file for global styles
// and potentially component-specific styles.

// CSS for the entire application, directly embedded for a single-file immersive output
const appStyles = `
    :root {
        --primary-color: #4361ee;
        --secondary-color: #3f37c9;
        --accent-color: #4cc9f0;
        --light-color: #f8f9fa;
        --dark-color: #212529;
        --success-color: #4caf50;
        --warning-color: #ff9800;
        --danger-color: #f44336;
        --border-radius: 8px;
        --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --transition: all 0.3s ease;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
        background-color: #f5f7fb;
        color: var(--dark-color);
        line-height: 1.6;
    }

    .dashboard {
        display: grid;
        grid-template-columns: 250px 1fr;
        min-height: 100vh;
    }

    .logo {
        text-align: center;
        padding: 0 20px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
    }

    .logo h2 {
        color: var(--primary-color);
        font-size: 1.5rem;
    }

    .nav-menu {
        padding: 0 20px;
    }

    .nav-item {
        margin-bottom: 10px;
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .nav-item:hover {
        background-color: rgba(67, 97, 238, 0.1);
    }

    .nav-item.active {
        background-color: rgba(67, 97, 238, 0.2);
    }

    .nav-item a {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        color: var(--dark-color);
        text-decoration: none;
        font-weight: 500;
    }

    .nav-item i {
        margin-right: 10px;
        color: var(--primary-color);
    }

    .nav-item.active i {
        color: var(--secondary-color);
    }

    /* Main Content Styles */
    .main-content {
        padding: 30px;
    }

    .dashboard .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .search-bar {
        flex: 1;
        max-width: 500px;
        position: relative;
    }

    .search-bar input {
        width: 100%;
        padding: 12px 20px 12px 45px;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-size: 1rem;
        outline: none;
        transition: var(--transition);
    }

    .search-bar input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }

    .search-bar i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #777;
    }

    .user-profile {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .user-profile img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
    }

    .user-profile span {
        font-weight: 500;
    }

    /* Dashboard Cards */
    .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .card {
        background-color: white;
        border-radius: var(--border-radius);
        padding: 20px;
        box-shadow: var(--box-shadow);
        transition: var(--transition);
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .card-title {
        font-size: 1rem;
        color: #666;
        font-weight: 500;
    }

    .card-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 5px;
    }

    .card-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
    }

    .card-icon.tests {
        background-color: var(--primary-color);
    }

    .card-icon.score {
        background-color: var(--success-color);
    }

    .card-icon.time {
        background-color: var(--warning-color);
    }

    .card-icon.resources {
        background-color: var(--accent-color);
    }

    /* Sections */
    .section {
        background-color: white;
        border-radius: var(--border-radius);
        padding: 20px;
        box-shadow: var(--box-shadow);
        margin-bottom: 30px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .section-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--dark-color);
    }

    .view-all {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
    }

    .view-all:hover {
        text-decoration: underline;
    }

    /* Upcoming Tests */
    .test-list {
        display: grid;
        gap: 15px;
    }

    .test-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: var(--border-radius);
        background-color: #f8f9fa;
        transition: var(--transition);
    }

    .test-item:hover {
        background-color: rgba(67, 97, 238, 0.1);
    }

    .test-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(67, 97, 238, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: var(--primary-color);
    }

    .test-info2 {
        flex: 1;
    }

    .test-name2 {
        font-weight: 600;
        margin-bottom: 5px;
    }

    .test-meta {
        display: flex;
        font-size: 0.85rem;
        color: #666;
    }

    .test-meta span {
        display: flex;
        align-items: baseline;
        margin-right: 15px;
    }

    .test-meta i {
        margin-right: 5px;
        font-size: 0.8rem;
    }

    .test-action {
        padding: 8px 15px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 500;
        transition: var(--transition);
    }

    .test-action:hover {
        background-color: var(--secondary-color);
    }

    /* Recent Activity */
    .activity-list {
        display: grid;
        gap: 15px;
    }

    .activity-item {
        display: flex;
        padding: 15px;
        border-radius: var(--border-radius);
        background-color: #f8f9fa;
    }

    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: white;
        font-size: 1rem;
    }

    .activity-icon.completed {
        background-color: var(--success-color);
    }

    .activity-icon.started {
        background-color: var(--warning-color);
    }

    .activity-icon.resource {
        background-color: var(--accent-color);
    }

    .activity-info {
        flex: 1;
    }

    .activity-title {
        font-weight: 600;
        margin-bottom: 5px;
    }

    .activity-meta {
        font-size: 0.85rem;
        color: #666;
    }

    .activity-time {
        font-size: 0.8rem;
        color: #999;
    }

    /* Study Resources */
    .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }

    .resource-card {
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--box-shadow);
        transition: var(--transition);
    }

    .resource-card:hover {
        transform: translateY(-5px);
    }

    .resource-image {
        height: 120px;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 2rem;
    }

    .resource-info {
        padding: 15px;
        background-color: white;
    }

    .resource-title {
        font-weight: 600;
        margin-bottom: 5px;
        font-size: 0.95rem;
    }

    .resource-type {
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 10px;
    }

    .resource-action {
        display: inline-block;
        padding: 5px 10px;
        background-color: rgba(67, 97, 238, 0.1);
        color: var(--primary-color);
        border-radius: var(--border-radius);
        font-size: 0.8rem;
        font-weight: 500;
        text-decoration: none;
        transition: var(--transition);
    }

    .resource-action:hover {
        background-color: rgba(67, 97, 238, 0.2);
    }

    /* Responsive */
    @media (max-width: 992px) {
        .dashboard {
            grid-template-columns: 1fr;
        }


        .nav-menu {
            display: flex;
            overflow-x: auto;
            padding-bottom: 10px;
        }

        .nav-item {
            min-width: max-content;
            margin-right: 10px;
            margin-bottom: 0;
        }
    }

    @media (max-width: 768px) {
        .header {
            flex-direction: column;
            align-items: stretch;
        }

        .search-bar {
            max-width: 100%;
            margin-bottom: 15px;
        }

        .user-profile {
            margin-left: 0;
            justify-content: flex-end;
        }

        .test-item {
            flex-direction: column;
            align-items: flex-start;
        }

        .test-info {
            margin-bottom: 15px;
        }

        .test-action {
            align-self: flex-end;
        }
    }
`;

// Inject the CSS into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = appStyles;
document.head.appendChild(styleSheet);


// Reusable Section Component
const Section = ({ title, children }) => (
    <div className="section">
        <div className="section-header">
            <h3 className="section-title">{title}</h3>
            <a href="#" className="view-all">View All</a>
        </div>
        {children}
    </div>
);



// Header Component
const Header = () => (
    <div className="header">
        <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search for tests, materials, or topics..." />
        </div>
        <div className="user-profile">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
            <span>Sarah Johnson</span>
        </div>
    </div>
);

// Card Component (used within DashboardCards)
const Card = ({ title, value, iconClass, iconBg }) => (
    <div className="card">
        <div className="card-header">
            <div>
                <div className="card-title">{title}</div>
                <div className="card-value">{value}</div>
            </div>
            <div className={`card-icon ${iconBg}`}>
                <i className={`fas ${iconClass}`} style={{ marginRight: 0 }}></i>
            </div>
        </div>
    </div>
);

// Test Item Component
const TestItem = ({ icon, name, date, duration, level }) => (
    <div className="test-item">
        <div className="test-icon">
            <i className={`fas ${icon}`} style={{ marginRight: 0 }}></i>
        </div>
        <div className="test-info2">
            <div className="test-name2">{name}</div>
            <div className="test-meta">
                <span><i className="far fa-calendar-alt" ></i> {date}</span>
                <span><i className="far fa-clock"></i> {duration}</span>
                <span><i className="fas fa-layer-group"></i> {level}</span>
            </div>
        </div>
        <button className="test-action">Start</button>
    </div>
);



// Activity Item Component
const ActivityItem = ({ icon, iconBg, title, meta, time }) => (
    <div className="activity-item">
        <div className={`activity-icon ${iconBg}`}>
            <i className={`fas ${icon}`} style={{ marginRight: 0 }}></i>
        </div>
        <div className="activity-info">
            <div className="activity-title">{title}</div>
            <div className="activity-meta">{meta}</div>
        </div>
        <div className="activity-time">{time}</div>
    </div>
);

// Recent Activity Section Component
const RecentActivitySection = () => {
    const activities = [
        { icon: 'fa-check', iconBg: 'completed', title: 'Completed "History Final Exam"', meta: 'Score: 88% • 45/50 questions', time: '2 hours ago' },
        { icon: 'fa-play', iconBg: 'started', title: 'Started "Chemistry Quiz"', meta: '15/20 questions completed', time: '1 day ago' },
        { icon: 'fa-book', iconBg: 'resource', title: 'Viewed "Algebra Study Guide"', meta: '25 minutes spent', time: '2 days ago' },
    ];

    return (
        <Section title="Recent Activity">
            <div className="activity-list">
                {activities.map((activity, index) => (
                    <ActivityItem
                        key={index}
                        icon={activity.icon}
                        iconBg={activity.iconBg}
                        title={activity.title}
                        meta={activity.meta}
                        time={activity.time}
                    />
                ))}
            </div>
        </Section>
    );
};

// Resource Card Component
const ResourceCard = ({ icon, title, type, actionText, actionLink }) => (
    <div className="resource-card">
        <div className="resource-image">
            <i className={`fas ${icon}`} style={{ marginRight: 0 }}></i>
        </div>
        <div className="resource-info">
            <div className="resource-title">{title}</div>
            <div className="resource-type">{type}</div>
            <a href={actionLink} className="resource-action">{actionText}</a>
        </div>
    </div>
);

// Study Resources Section Component
const StudyResourcesSection = () => {
    const resources = [
        { icon: 'fa-file-pdf', title: 'Physics Formulas', type: 'PDF • 15 pages', actionText: 'View', actionLink: '#' },
        { icon: 'fa-video', title: 'Calculus Tutorial', type: 'Video • 45 mins', actionText: 'Watch', actionLink: '#' },
        { icon: 'fa-file-alt', title: 'Literature Notes', type: 'Document • 8 pages', actionText: 'Read', actionLink: '#' },
        { icon: 'fa-headphones', title: 'French Pronunciation', type: 'Audio • 30 mins', actionText: 'Listen', actionLink: '#' },
    ];

    return (
        <Section title="Recommended Study Resources">
            <div className="resource-grid">
                {resources.map((resource, index) => (
                    <ResourceCard
                        key={index}
                        icon={resource.icon}
                        title={resource.title}
                        type={resource.type}
                        actionText={resource.actionText}
                        actionLink={resource.actionLink}
                    />
                ))}
            </div>
        </Section>
    );
};

// Main App Component
function App() {
    const db = getFirestore();
    const auth = getAuth();
    const [studentDataList, setStudentDataList] = useState({ upcomingTests: [] });


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Reference the student document
                    const studentDocRef = doc(db, "students", user.email);
                    const studentSnap = await getDoc(studentDocRef);

                    if (studentSnap.exists()) {
                        const data = studentSnap.data();

                        // Ensure upcomingTests is always an array
                        const upcomingTests = data.upcomingTests || [];

                        console.log(upcomingTests);

                        setStudentDataList({
                            ...data,
                            upcomingTests, // safe fallback
                        });
                    } else {
                        console.log("No such student document!");
                        setStudentDataList({ upcomingTests: [] });
                    }
                } catch (error) {
                    console.error("Error fetching student data:", error);
                    setStudentDataList({ upcomingTests: [] });
                }
            }

        });

        return () => unsubscribe();
    }, [auth]);

    const cardsData = [
        { title: 'Upcoming Tests', value: studentDataList.upcomingTests.length, iconClass: 'fa-clipboard-list', iconBg: 'tests' },
        { title: 'Average Score', value: '82%', iconClass: 'fa-star', iconBg: 'score' },
        { title: 'Resources', value: '24', iconClass: 'fa-book-open', iconBg: 'resources' },
    ];

    const combinedTests = [
        ...(studentDataList?.upcomingTests || [])
    ];

    return (
        <div className="dashboard">
            <Sidebar venue="student" />
            <div className="main">
                <div className="header flex">
                    <div className="row-right">
                        <Popup
                            trigger={<i className="fa-solid fa-bars" style={{ marginRight: 0 }} />}
                            position="bottom left"
                            closeOnDocumentClick
                            mouseLeaveDelay={300}
                            mouseEnterDelay={0}
                            contentStyle={{ padding: "0px", border: "none" }}
                            arrow={false}
                        >
                            <Sidebar />
                        </Popup>
                        <h2>Welcome Back !! {auth.currentUser?.email}</h2>
                    </div>
                    <div className="row-left">
                        <i className="fa-regular fa-bell" style={{ marginRight: 0 }} />
                        <i className="fa-solid fa-gear" style={{ marginRight: 0 }} />
                        <i className="fa-regular fa-circle-user" style={{ marginRight: 0 }} />
                    </div>
                </div>
                <div className="main-content">
                    <div className="dashboard-cards">
                        {cardsData.map((card, index) => (
                            <Card
                                key={index}
                                title={card.title}
                                value={card.value}
                                iconClass={card.iconClass}
                                iconBg={card.iconBg}
                            />
                        ))}
                    </div>
                    <Section title="Upcoming Tests">
                        {studentDataList?.upcomingTests && studentDataList.upcomingTests.length > 0 ? (
                            <div className="test-list">
                                {combinedTests.map((test, index) => (
                                    <TestItem
                                        key={index}
                                        icon='fa-flask'
                                        name={test}
                                        date='17 Aug'
                                        duration='180mins'
                                        level='Hard'
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>nothing found</div>
                        )}
                    </Section>
                    <RecentActivitySection />
                    <StudyResourcesSection />
                </div>
            </div>
        </div>
    );
}

export default App;
