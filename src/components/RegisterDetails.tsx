import React from 'react';

interface Register {
    name: string;
    topic: string;
    unit: string;
    value: number;
}

interface RegisterDetailsProps {
    register: Register;
}

const RegisterDetails: React.FC<RegisterDetailsProps> = ({ register }) => {
    return (
        <div>
            <h5>{register.name}</h5>
            <p><strong>Topic:</strong> {register.topic}</p>
            <p><strong>Unit:</strong> {register.unit}</p>
            <p><strong>Value:</strong> {register.value}</p>
        </div>
    );
};

export default RegisterDetails;
