import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_EMP_QUERY = gql`
  query getEmp {
    getEmp {
      ID
      name
      class
      subjects
      attendance
      age
    }
  }
`;

const Dashboard = () => {
    const { loading, error, data } = useQuery(GET_EMP_QUERY);

    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error: {error.message}</h1>;

    // Filter out the "__typename" field
    const headers = data.getEmp.length > 0
        ? Object.keys(data.getEmp[0]).filter(header => header !== '__typename')
        : [];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>
                <h1 style={{ textAlign: 'center' }}>Employee Data</h1>
                <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header} style={{ border: '1px solid black', padding: '8px' }}>
                                    {header.charAt(0).toUpperCase() + header.slice(1)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.getEmp.map((emp, index) => (
                            <tr key={index}>
                                {headers.map((header) => (
                                    <td key={header} style={{ border: '1px solid black', padding: '8px' }}>
                                        {emp[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
