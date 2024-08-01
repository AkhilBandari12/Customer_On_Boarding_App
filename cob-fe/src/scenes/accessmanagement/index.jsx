import React, { useState } from 'react';
import { Box, Checkbox, FormControlLabel, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Header from "../../components/Header";
import axios from 'axios';

const permissions = {
  Plan: ['Read', 'Create'],
  Planmodify: ['Update', 'Delete'],
  Clientdetails: ['Read', 'Update'],
  Createadminorsalesagent: ['Create'],
  AssigntoSalesagent: ['Update'],
};

const initialSelectedPermissions = {
  Plan: [],
  Planmodify: [],
  Clientdetails: [],
  Createadminorsalesagent: [],
  AssigntoSalesagent: [],
};

const actionToHttpMethod = {
  Read: 'get',
  Create: 'post',
  Update: 'patch',
  Delete: 'delete'
};

const AccessManagement = () => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState(initialSelectedPermissions);
  const [roles, setRoles] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  const handleCheckboxChange = (category, permission) => {
    setSelectedPermissions(prevState => {
      const updatedPermissions = { ...prevState };
      if (updatedPermissions[category].includes(permission)) {
        updatedPermissions[category] = updatedPermissions[category].filter(p => p !== permission);
      } else {
        updatedPermissions[category] = [...updatedPermissions[category], permission];
      }
      return updatedPermissions;
    });
  };

  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedPermissions = Object.keys(selectedPermissions).reduce((acc, category) => {
      acc[category.toLowerCase()] = selectedPermissions[category].map(action => actionToHttpMethod[action]);
      return acc;
    }, {});

    const newRole = {
      name: roleName,
      permissions: formattedPermissions,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8001/accounts/api/create-role-user/", newRole, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Role created successfully:', response.data);
        setRoles([...roles, response.data]);
        setRoleName('');
        setSelectedPermissions(initialSelectedPermissions); // Reset selected permissions after submission
      } else {
        console.error('Failed to create role:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isActionEnabled = (category, action) => {
    return permissions[category]?.includes(action);
  };

  return (
    <Paper elevation={3} sx={{ padding: '15px', margin: '30px', width: '90%' }}>
      <Header title="Role Creation" subtitle="Create Role with specific Permissions" />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="left" minHeight="60vh">
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Role Name"
            value={roleName}
            onChange={handleRoleNameChange}
            margin="normal"
            required
            sx={{ width: '50%', marginBottom: '20px' }} // Adjust the width and margins as needed
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  {Object.keys(actionToHttpMethod).map(action => (
                    <TableCell key={action}>{action}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(permissions).map(([category, actions]) => (
                  <TableRow key={category}>
                    <TableCell component="th" scope="row">{category}</TableCell>
                    {Object.keys(actionToHttpMethod).map(action => (
                      <TableCell key={action}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedPermissions[category]?.includes(action) || false}
                              onChange={() => handleCheckboxChange(category, action)}
                              color="primary"
                              disabled={!isActionEnabled(category, action)} // Disable checkbox if action is not in permissions list
                            />
                          }
                          label=""
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="left" mt={2}>
            <Button type="submit" variant="contained" color="primary">Create Role</Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default AccessManagement;






