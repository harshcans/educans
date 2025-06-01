// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tests, setTests] = useState([]);
    const [testAttempts, setTestAttempts] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = firestore.collection('users');
            const snapshot = await usersCollection.get();
            const usersData = snapshot.docs.map(doc => doc.data());
            setUsers(usersData);
        };
        fetchUsers();

        const fetchTests = async () => {
            const testsCollection = firestore.collection('tests');
            const snapshot = await testsCollection.get();
            const testsData = snapshot.docs.map(doc => doc.data());
            setTests(testsData);
        };
        fetchTests();

        const fetchTestAttempts = async () => {
            const testAttemptsCollection = firestore.collection('testAttempts');
            const snapshot = await testAttemptsCollection.get();
            const testAttemptsData = snapshot.docs.map(doc => doc.data());
            setTestAttempts(testAttemptsData);
        };
        fetchTestAttempts();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div>
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.displayName} - {user.email}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Tests</h3>
                <ul>
                    {tests.map(test => (
                        <li key={test.id}>{test.title}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Test Attempts</h3>
                <ul>
                    {testAttempts.map(attempt => (
                        <li key={attempt.id}>{attempt.userId} - {attempt.testId} - {attempt.score}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
