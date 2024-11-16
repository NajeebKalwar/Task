import React, { useState } from 'react';
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
import Footer from './component/footer';
import Navbar from './component/navbar';

const GET_EMP_WITH_PAGINATION = gql`
  query getEmpWithPagination($page: Int, $limit: Int) {
    getEmpWithPagination(page: $page, limit: $limit) {
      data {
        ID
        name
        class
        attendance
      }
      pagination {
        currentPage
        totalPages
      }
    }
  }
`;

const GET_EMP_BY_ID = gql`
  query getEmpById($ID: Int!) {
    getEmpById(ID: $ID) {
      
      age
      subjects
    }
  }
`;


const ATTENDANCE_UPDATE = gql`
  mutation attendanceUpdate($ID: Int!, $attendance: String!) {
    attendanceUpdate(ID: $ID, attendance: $attendance) {
      ID
      attendance
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($ID: Int!) {
    deleteEmployee(ID: $ID) {
      message
    }
  }
`;

const Dashboard = () => {
    const client = useApolloClient();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState('');
    const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
    const [isMoreInfoDialogOpen, setIsMoreInfoDialogOpen] = useState(false);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
    const { loading, error, data } = useQuery(GET_EMP_WITH_PAGINATION, {
        variables: { page: currentPage, limit: itemsPerPage },
    });




    const openMoreInfoDialog = async (id) => {
        try {
            console.log('Fetching details for ID:', id);
            const response = await client.query({
                query: GET_EMP_BY_ID,
                variables: { ID: parseInt(id) },
            });
            console.log('response d:', response.data.getEmpById);

            setSelectedEmployeeDetails(response.data.getEmpById); // Save details in state
            setIsMoreInfoDialogOpen(true); // Open dialog
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const closeMoreInfoDialog = () => {
        setIsMoreInfoDialogOpen(false);
        setSelectedEmployeeDetails(null);
    };

    const [updateAttendance] = useMutation(ATTENDANCE_UPDATE);
    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

    if (loading) return <h1>Loading...</h1>;
    if (error) {
        console.error('GraphQL error:', error);
        return <h1>Error: {error.message}</h1>;
    }

    const employees = data.getEmpWithPagination.data;
    const totalPages = data.getEmpWithPagination.pagination.totalPages;

    const openEditDialog = (id, currentAttendance) => {
        setSelectedEmployeeID(id);
        setSelectedAttendance(currentAttendance);
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (id) => {
        setSelectedEmployeeID(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveAttendance = async () => {
        console.log('Updating attendance for ID:', selectedEmployeeID, 'to:', selectedAttendance);
        try {
            await updateAttendance({
                variables: { ID: parseInt(selectedEmployeeID), attendance: selectedAttendance },
                refetchQueries: [
                    {
                        query: GET_EMP_WITH_PAGINATION,
                        variables: { page: currentPage, limit: itemsPerPage },
                    },
                ],
            });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating attendance:', error);
        }
    };




    const handleDelete = async () => {
        try {
            console.log('Updating attendance for ID:', selectedEmployeeID,);

            await deleteEmployee({
                variables: { ID: parseInt(selectedEmployeeID) },
                refetchQueries: [
                    {
                        query: GET_EMP_WITH_PAGINATION,
                        variables: { page: currentPage, limit: itemsPerPage },
                    },
                ],
            });
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.headerRow}>
                            <th style={styles.headerCell}>ID</th>
                            <th style={styles.headerCell}>Name</th>
                            <th style={styles.headerCell}>Class</th>
                            {/* <th style={styles.headerCell}>Subjects</th> */}
                            <th style={styles.headerCell}>Attendance</th>
                            {/* <th style={styles.headerCell}>Age</th> */}
                            <th style={styles.headerCell}>Actions</th>
                            <th style={styles.headerCell}>MoreInfo</th>

                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp, index) => (
                            <tr key={emp.ID} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                <td style={styles.cell}>{emp.ID}</td>
                                <td style={styles.cell}>{emp.name}</td>
                                <td style={styles.cell}>{emp.class}</td>
                                {/* <td style={styles.cell}>{emp.subjects}</td> */}
                                <td style={styles.cell}>{emp.attendance ? emp.attendance : "Not Entered Attendance"}</td>
                                {/* <td style={styles.cell}>{emp.age}</td> */}
                                <td style={styles.cell}>
                                    <button onClick={() => openEditDialog(emp.ID, emp.attendance)} style={styles.editButton}>Edit</button>
                                    <button onClick={() => openDeleteDialog(emp.ID)} style={styles.deleteButton}>Del</button>
                                </td>
                                <td style={styles.cell}>
                                    <button onClick={() => openMoreInfoDialog(emp.ID,)} style={styles.infoButton}>Info</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={styles.paginationButton}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={styles.paginationButton}
                    >
                        Next
                    </button>
                </div>
            </div>
            <Footer />
            {/* More Info Dialog */}
            {isMoreInfoDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Employee Details</h3>
                        {selectedEmployeeDetails ? (
                            <div style={styles.detailsContainer}>
                                {/* <p><strong>ID:</strong> {selectedEmployeeDetails.ID}</p> */}
                                {/* <p><strong>Name:</strong> {selectedEmployeeDetails.name}</p> */}
                                {/* <p><strong>Class:</strong> {selectedEmployeeDetails.class}</p> */}
                                {/* <p><strong>Attendance:</strong> {selectedEmployeeDetails.attendance}</p> */}
                                <p><strong>Age:</strong> {selectedEmployeeDetails.age}</p>
                                <p><strong>subjects:</strong>
                                    {selectedEmployeeDetails.subjects
                                        ? Array.isArray(selectedEmployeeDetails.subjects)
                                            ? selectedEmployeeDetails.subjects.join(', ')
                                            : selectedEmployeeDetails.subjects.split(',').join(', ')
                                        : 'No subjects available'}
                                </p>
                            </div>
                        ) : (
                            <p>Loading details...</p>
                        )}
                        <button onClick={closeMoreInfoDialog} style={styles.cancelButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Attendance Dialog */}
            {isEditDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Edit Attendance</h3>
                        <label>
                            Attendance:
                            <select
                                value={selectedAttendance}
                                onChange={(e) => setSelectedAttendance(e.target.value)}
                                style={styles.dropdown}
                            >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <button onClick={handleSaveAttendance} style={styles.saveButton}>Save</button>
                        <button onClick={() => setIsEditDialogOpen(false)} style={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Delete Confirmation</h3>
                        <p>Are you sure you want to delete this employee?</p>
                        <p>This action cannot be undone.</p>
                        <button onClick={() => setIsDeleteDialogOpen(false)} style={styles.cancelButton}>No</button>
                        <button onClick={handleDelete} style={styles.deleteButton}>Yes</button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
    },
    detailsContainer: {
        textAlign: 'left',
        lineHeight: '1.6',
    },

    table: {
        width: '60%',
        borderCollapse: 'collapse',
    },
    headerRow: {
        backgroundColor: '#333',
        color: '#fff',
    },
    headerCell: {
        padding: '12px',
        textAlign: 'left',
    },
    rowEven: {
        backgroundColor: '#f2f2f2',
    },
    rowOdd: {
        backgroundColor: '#ffffff',
    },
    cell: {
        padding: '12px',
        textAlign: 'left',
    },
    actionsCell: {
        display: 'flex',
        gap: '10px',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
    },
    pagination: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    paginationButton: {
        padding: '5px 10px',
    },
    infoButton: {
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
    },

    dialogOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '5px 20px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
    },
    cancelButton: {
        backgroundColor: '#757575',
        color: 'white',
        padding: '5px 20px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
    },
    dropdown: {
        width: '100%',
        padding: '8px',
        marginTop: '10px',
    },
};

export default Dashboard;
